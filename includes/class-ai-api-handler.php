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

    private $database;
    private $api_key;
    private $api_endpoint;
    private $model;
    private $max_retries = 3;
    private $retry_delay = 2;

    /**
     * Initialize the AI API Handler
     */
    public function __construct() {
        $this->database = new Blog_Summary_Database();
        $this->api_endpoint = 'https://api.openai.com/v1/chat/completions';
        
        // Get latest API settings
        $api_settings = $this->database->get_api_settings();
        if ($api_settings) {
            $this->api_key = $api_settings['api_key'];
            $this->model = $api_settings['selected_model'];
        }
    }

    /**
     * Generate summary for blog content
     */
    public function generate_summary($content, $options = []) {
        if (empty($this->api_key)) {
            return new WP_Error('no_api_key', 'AI API key is not configured');
        }

        if (empty($content)) {
            return new WP_Error('no_content', 'No content provided for summary generation');
        }

        // Clean and prepare content
        $cleaned_content = $this->clean_content($content);
        
        // Extract headings and sections
        $sections = $this->extract_sections($cleaned_content);
        
        // Generate takeaways and min read
        $response = $this->generate_content_analysis($cleaned_content, $sections);
        
        if (is_wp_error($response)) {
            return $response;
        }

        return [
            'takeaways' => $response['takeaways'],
            'min_read_list' => [
                'min_read' => $response['min_read'],
                'list_with_connection_with_section' => $response['sections']
            ]
        ];
    }

    /**
     * Clean and prepare content for AI processing
     */
    private function clean_content($content) {
        // Remove HTML tags
        $content = wp_strip_all_tags($content);
        
        // Remove extra whitespace
        $content = preg_replace('/\s+/', ' ', $content);
        
        // Remove special characters that might confuse the AI
        $content = str_replace(['&nbsp;', '&amp;', '&quot;', '&lt;', '&gt;'], ' ', $content);
        
        return trim($content);
    }

    /**
     * Extract sections from content
     */
    private function extract_sections($content) {
        preg_match_all('/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i', $content, $matches);
        $sections = [];
        
        foreach ($matches[1] as $heading) {
            $sections[] = [
                'heading_tag_name' => strip_tags($heading),
                'title' => trim($heading)
            ];
        }
        
        return $sections;
    }

    /**
     * Generate content analysis using AI
     */
    private function generate_content_analysis($content, $sections) {
        $prompt = $this->build_analysis_prompt($content, $sections);
        $response = $this->make_api_request($prompt);

            if (is_wp_error($response)) {
                return $response;
            }

        // Parse the response
        $parsed = json_decode($response['choices'][0]['message']['content'], true);
        
        if (!$parsed) {
            return [
                'takeaways' => ['Key point 1', 'Key point 2'],
                'min_read' => '5',
                'sections' => $sections
            ];
        }

        return [
            'takeaways' => $parsed['takeaways'] ?? ['Key point 1', 'Key point 2'],
            'min_read' => $parsed['min_read'] ?? '5',
            'sections' => $sections
        ];
    }

    /**
     * Build analysis prompt
     */
    private function build_analysis_prompt($content, $sections) {
        return [
            [
                'role' => 'system',
                'content' => "Analyze this content and provide:\n1. Key takeaways as bullet points\n2. Estimated reading time in minutes\n3. Section analysis\n\nFormat response as JSON with 'takeaways' array and 'min_read' number."
            ],
            [
                'role' => 'user',
                'content' => $content
            ]
        ];
    }

    /**
     * Make API request to OpenAI
     */
    /**
     * Get current model being used
     */
    public function get_current_model() {
        return $this->model;
    }

    /**
     * Test API connection
     */
    public function test_api_connection() {
        if (empty($this->api_key)) {
            return new WP_Error('no_api_key', 'API key is not configured');
        }

        $messages = [
            [
                'role' => 'system',
                'content' => 'Test connection'
            ]
        ];

        $response = $this->make_api_request($messages);
        if (is_wp_error($response)) {
            return $response;
        }

        return [
            'success' => true,
            'model' => $this->model
        ];
    }

    private function make_api_request($messages) {
        $args = [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->api_key,
                'Content-Type' => 'application/json',
            ],
            'body' => json_encode([
            'model' => $this->model,
                'messages' => $messages,
                'temperature' => 0.7,
                'max_tokens' => 1000,
            ]),
            'timeout' => 30,
        ];

        $response = wp_remote_post($this->api_endpoint, $args);

        if (is_wp_error($response)) {
            return $response;
        }

        $body = json_decode(wp_remote_retrieve_body($response), true);

        if (!$body || isset($body['error'])) {
            return new WP_Error(
                'api_error',
                isset($body['error']['message']) ? $body['error']['message'] : 'Unknown API error'
            );
        }

        return $body;
    }
}