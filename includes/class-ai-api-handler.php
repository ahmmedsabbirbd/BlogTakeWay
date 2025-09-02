<?php
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * AI API Handler class for Blog TakeWay
 *
 * @category WordPress
 * @package  BlogTakeWay
 * @author   WPPOOL Team <support@wppool.com>
 * @license  GPL-2.0+ https://www.gnu.org/licenses/gpl-2.0.html
 */

class AI_API_Handler {

    private $settings;
    private $api_key;
    private $api_endpoint;
    private $model;
    private $max_retries = 3;
    private $retry_delay = 2;

    /**
     * Initialize the AI API Handler
     */
    public function __construct() {
        $this->settings = get_option('blog_takeway_settings', []);
        $this->api_key = isset($this->settings['ai_api_key']) ? $this->settings['ai_api_key'] : '';
        $this->api_endpoint = isset($this->settings['ai_api_endpoint']) ? $this->settings['ai_api_endpoint'] : 'https://api.openai.com/v1/chat/completions';
        $this->model = isset($this->settings['ai_model']) ? $this->settings['ai_model'] : 'gpt-3.5-turbo';
    }

    /**
     * Generate summary for blog content
     *
     * @param string $content The blog post content
     * @param array $options Additional options for generation
     * @return array|WP_Error Generated summary and takeaways or error
     */
    public function generate_summary($content, $options = []) {
        if (empty($this->api_key)) {
            return new WP_Error('no_api_key', 'AI API key is not configured');
        }

        if (empty($content)) {
            return new WP_Error('no_content', 'No content provided for summary generation');
        }

        $default_options = [
            'summary_length' => isset($this->settings['summary_length']) ? $this->settings['summary_length'] : 'medium',
            'summary_style' => isset($this->settings['summary_style']) ? $this->settings['summary_style'] : 'professional',
            'max_takeaways' => 5,
            'language' => 'en',
        ];

        $options = wp_parse_args($options, $default_options);

        // Clean and prepare content
        $cleaned_content = $this->clean_content($content);
        
        // Check content length
        if (strlen($cleaned_content) < 100) {
            return new WP_Error('content_too_short', 'Content is too short for meaningful summary generation');
        }

        // Generate prompt
        $prompt = $this->build_prompt($cleaned_content, $options);
        
        // Make API request
        $response = $this->make_api_request($prompt, $options);
        
        if (is_wp_error($response)) {
            return $response;
        }

        // Parse response
        $parsed_response = $this->parse_api_response($response);
        
        if (is_wp_error($parsed_response)) {
            return $parsed_response;
        }

        return $parsed_response;
    }

    /**
     * Clean and prepare content for AI processing
     *
     * @param string $content Raw content
     * @return string Cleaned content
     */
    private function clean_content($content) {
        // Remove HTML tags
        $content = wp_strip_all_tags($content);
        
        // Remove extra whitespace
        $content = preg_replace('/\s+/', ' ', $content);
        
        // Remove special characters that might confuse the AI
        $content = str_replace(['&nbsp;', '&amp;', '&quot;', '&lt;', '&gt;'], ' ', $content);
        
        // Trim content
        $content = trim($content);
        
        // Limit content length to avoid token limits
        $max_length = 8000; // Conservative limit for GPT-3.5-turbo
        if (strlen($content) > $max_length) {
            $content = substr($content, 0, $max_length) . '...';
        }
        
        return $content;
    }

    /**
     * Build the prompt for AI generation
     *
     * @param string $content Cleaned content
     * @param array $options Generation options
     * @return string Formatted prompt
     */
    private function build_prompt($content, $options) {
        $length_instructions = $this->get_length_instructions($options['summary_length']);
        $style_instructions = $this->get_style_instructions($options['summary_style']);
        
        $prompt = "Please analyze the following blog post content and provide:\n\n";
        $prompt .= "1. A concise summary ({$length_instructions})\n";
        $prompt .= "2. {$options['max_takeaways']} key takeaways as bullet points\n\n";
        $prompt .= "Style: {$style_instructions}\n";
        $prompt .= "Language: {$options['language']}\n\n";
        $prompt .= "Content:\n{$content}\n\n";
        $prompt .= "Please format your response as follows:\n";
        $prompt .= "SUMMARY:\n[Your summary here]\n\n";
        $prompt .= "TAKEAWAYS:\n- [Takeaway 1]\n- [Takeaway 2]\n- [Takeaway 3]\n- [Takeaway 4]\n- [Takeaway 5]";

        return $prompt;
    }

    /**
     * Get length instructions based on option
     *
     * @param string $length Length option
     * @return string Length instructions
     */
    private function get_length_instructions($length) {
        switch ($length) {
            case 'short':
                return '2-3 sentences, approximately 50-75 words';
            case 'long':
                return '4-6 sentences, approximately 150-200 words';
            case 'medium':
            default:
                return '3-4 sentences, approximately 100-125 words';
        }
    }

    /**
     * Get style instructions based on option
     *
     * @param string $style Style option
     * @return string Style instructions
     */
    private function get_style_instructions($style) {
        switch ($style) {
            case 'casual':
                return 'Write in a friendly, conversational tone suitable for a general audience';
            case 'technical':
                return 'Write in a technical, professional tone suitable for industry experts';
            case 'educational':
                return 'Write in an educational, instructive tone suitable for learning';
            case 'professional':
            default:
                return 'Write in a clear, professional tone suitable for business and professional audiences';
        }
    }

    /**
     * Make API request to OpenAI
     *
     * @param string $prompt The prompt to send
     * @param array $options Generation options
     * @return array|WP_Error API response or error
     */
    private function make_api_request($prompt, $options) {
        $start_time = microtime(true);
        
        $request_data = [
            'model' => $this->model,
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'You are a professional content analyst specializing in creating clear, engaging summaries and key takeaways from blog posts.'
                ],
                [
                    'role' => 'user',
                    'content' => $prompt
                ]
            ],
            'max_tokens' => $this->calculate_max_tokens($options['summary_length']),
            'temperature' => 0.7,
            'top_p' => 1,
            'frequency_penalty' => 0,
            'presence_penalty' => 0,
        ];

        $headers = [
            'Authorization' => 'Bearer ' . $this->api_key,
            'Content-Type' => 'application/json',
        ];

        $retry_count = 0;
        
        while ($retry_count < $this->max_retries) {
            $response = wp_remote_post($this->api_endpoint, [
                'headers' => $headers,
                'body' => json_encode($request_data),
                'timeout' => 60,
                'sslverify' => true,
            ]);

            if (is_wp_error($response)) {
                $retry_count++;
                if ($retry_count < $this->max_retries) {
                    sleep($this->retry_delay);
                    continue;
                }
                return $response;
            }

            $response_code = wp_remote_retrieve_response_code($response);
            $response_body = wp_remote_retrieve_body($response);

            if ($response_code === 200) {
                $end_time = microtime(true);
                $processing_time = $end_time - $start_time;
                
                $response_data = json_decode($response_body, true);
                $response_data['processing_time'] = $processing_time;
                
                return $response_data;
            }

            // Handle rate limiting
            if ($response_code === 429) {
                $retry_count++;
                if ($retry_count < $this->max_retries) {
                    $retry_after = wp_remote_retrieve_header($response, 'Retry-After');
                    $delay = $retry_after ? intval($retry_after) : $this->retry_delay * $retry_count;
                    sleep($delay);
                    continue;
                }
            }

            // Handle other errors
            $error_message = 'API request failed with status code: ' . $response_code;
            if (!empty($response_body)) {
                $error_data = json_decode($response_body, true);
                if (isset($error_data['error']['message'])) {
                    $error_message = $error_data['error']['message'];
                }
            }

            return new WP_Error('api_error', $error_message);
        }

        return new WP_Error('max_retries_exceeded', 'Maximum retry attempts exceeded');
    }

    /**
     * Calculate maximum tokens based on summary length
     *
     * @param string $length Summary length option
     * @return int Maximum tokens
     */
    private function calculate_max_tokens($length) {
        switch ($length) {
            case 'short':
                return 200;
            case 'long':
                return 500;
            case 'medium':
            default:
                return 300;
        }
    }

    /**
     * Parse API response to extract summary and takeaways
     *
     * @param array $response API response
     * @return array|WP_Error Parsed response or error
     */
    private function parse_api_response($response) {
        if (!isset($response['choices'][0]['message']['content'])) {
            return new WP_Error('invalid_response', 'Invalid API response format');
        }

        $content = $response['choices'][0]['message']['content'];
        
        // Extract summary
        $summary = $this->extract_summary($content);
        if (empty($summary)) {
            return new WP_Error('no_summary', 'Could not extract summary from AI response');
        }

        // Extract takeaways
        $takeaways = $this->extract_takeaways($content);
        if (empty($takeaways)) {
            return new WP_Error('no_takeaways', 'Could not extract takeaways from AI response');
        }

        return [
            'summary' => $summary,
            'takeaways' => $takeaways,
            'processing_time' => isset($response['processing_time']) ? $response['processing_time'] : 0,
            'tokens_used' => isset($response['usage']['total_tokens']) ? $response['usage']['total_tokens'] : 0,
            'model' => $this->model,
        ];
    }

    /**
     * Extract summary from AI response
     *
     * @param string $content AI response content
     * @return string Extracted summary
     */
    private function extract_summary($content) {
        // Look for SUMMARY: section
        if (preg_match('/SUMMARY:\s*(.*?)(?=\n\n|\nTAKEAWAYS:|$)/s', $content, $matches)) {
            return trim($matches[1]);
        }

        // Fallback: look for content before TAKEAWAYS
        if (preg_match('/(.*?)(?=\n\nTAKEAWAYS:|$)/s', $content, $matches)) {
            $summary = trim($matches[1]);
            // Remove any remaining labels
            $summary = preg_replace('/^(SUMMARY|Summary|summary):\s*/', '', $summary);
            return $summary;
        }

        return '';
    }

    /**
     * Extract takeaways from AI response
     *
     * @param string $content AI response content
     * @return array Extracted takeaways
     */
    private function extract_takeaways($content) {
        $takeaways = [];

        // Look for TAKEAWAYS: section
        if (preg_match('/TAKEAWAYS:\s*(.*?)(?=\n\n|$)/s', $content, $matches)) {
            $takeaways_text = $matches[1];
            
            // Split by bullet points or numbered lists
            $lines = explode("\n", $takeaways_text);
            
            foreach ($lines as $line) {
                $line = trim($line);
                if (empty($line)) continue;
                
                // Remove bullet points, dashes, numbers
                $line = preg_replace('/^[\s\-\*•\d\.\)]+/', '', $line);
                $line = trim($line);
                
                if (!empty($line)) {
                    $takeaways[] = $line;
                }
            }
        }

        // Fallback: look for bullet points anywhere in the content
        if (empty($takeaways)) {
            if (preg_match_all('/[\-\*•]\s*(.+?)(?=\n|$)/', $content, $matches)) {
                foreach ($matches[1] as $match) {
                    $takeaway = trim($match);
                    if (!empty($takeaway)) {
                        $takeaways[] = $takeaway;
                    }
                }
            }
        }

        // Limit takeaways to reasonable number
        return array_slice($takeaways, 0, 5);
    }

    /**
     * Test API connectivity
     *
     * @return array|WP_Error Test result or error
     */
    public function test_api_connection() {
        if (empty($this->api_key)) {
            return new WP_Error('no_api_key', 'API key is not configured');
        }

        $test_prompt = "Please respond with 'API connection test successful' and nothing else.";
        
        $request_data = [
            'model' => $this->model,
            'messages' => [
                [
                    'role' => 'user',
                    'content' => $test_prompt
                ]
            ],
            'max_tokens' => 50,
            'temperature' => 0,
        ];

        $headers = [
            'Authorization' => 'Bearer ' . $this->api_key,
            'Content-Type' => 'application/json',
        ];

        $response = wp_remote_post($this->api_endpoint, [
            'headers' => $headers,
            'body' => json_encode($request_data),
            'timeout' => 30,
            'sslverify' => true,
        ]);

        if (is_wp_error($response)) {
            return $response;
        }

        $response_code = wp_remote_retrieve_response_code($response);
        
        if ($response_code === 200) {
            return [
                'status' => 'success',
                'message' => 'API connection test successful',
                'model' => $this->model,
            ];
        }

        return new WP_Error('api_test_failed', 'API connection test failed with status code: ' . $response_code);
    }

    /**
     * Get available AI models
     *
     * @return array Available models
     */
    public function get_available_models() {
        return [
            'gpt-4' => 'GPT-4 (Most capable)',
            'gpt-4-turbo' => 'GPT-4 Turbo (Fastest GPT-4)',
            'gpt-3.5-turbo' => 'GPT-3.5 Turbo (Good balance)',
            'gpt-3.5-turbo-16k' => 'GPT-3.5 Turbo 16K (Longer context)',
        ];
    }

    /**
     * Estimate token count for content
     *
     * @param string $content Content to estimate
     * @return int Estimated token count
     */
    public function estimate_tokens($content) {
        // Rough estimation: 1 token ≈ 4 characters for English text
        return ceil(strlen($content) / 4);
    }

    /**
     * Get API usage statistics
     *
     * @return array Usage statistics
     */
    public function get_usage_statistics() {
        // This would require additional API calls to OpenAI's usage endpoint
        // For now, return basic info
        return [
            'model' => $this->model,
            'endpoint' => $this->api_endpoint,
            'api_key_configured' => !empty($this->api_key),
        ];
    }
}
