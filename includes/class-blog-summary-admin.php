<?php
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Blog Summary Admin Class
 *
 * @category WordPress
 * @package  BlogTakeWay
 * @author   WPPOOL Team <support@wppool.com>
 * @license  GPL-2.0+ https://www.gnu.org/licenses/gpl-2.0.html
 */

class Blog_Summary_Admin {

    private $plugin_slug = 'blog-takeway';
    private static $instance = null;

    /**
     * Get singleton instance of the class
     *
     * @since 1.0.0
     *
     * @return Blog_Summary_Admin Instance of the class
     */
    public static function get_instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor
     */
    public function __construct() {
        add_action('admin_menu', [ $this, 'register_admin_menu' ]);
        add_action('admin_enqueue_scripts', [ $this, 'enqueue_admin_scripts' ]);
        add_action('admin_enqueue_scripts', [ $this, 'enqueue_admin_styles' ]);
        add_action('admin_init', [ $this, 'register_settings' ]);
        add_action('wp_ajax_generate_summary', [ $this, 'ajax_generate_summary' ]);
        add_action('wp_ajax_bulk_generate_summaries', [ $this, 'ajax_bulk_generate_summaries' ]);
        add_action('wp_ajax_test_api_connection', [ $this, 'ajax_test_api_connection' ]);
    }
    
    /**
     * Enqueue admin styles
     */
    public function enqueue_admin_styles($hook_suffix) {
        if (strpos($hook_suffix, 'blog-takeway') !== false) {
            wp_enqueue_style( 
                'blog-takeway-admin-style', 
                plugin_dir_url( dirname( __FILE__ ) ) . 'assets/css/admin-style.css',
                [],
                BLOG_TAKEWAY_VERSION
            );
        }
    }

    /**
     * Enqueue admin scripts
     */
    public function enqueue_admin_scripts($hook_suffix) {
        if (strpos($hook_suffix, 'blog-takeway') !== false) {
            wp_enqueue_script(
                'blog-takeway-admin',
                plugin_dir_url( dirname( __FILE__ ) ) . 'build/chat-admin.js',
                ['jquery', 'wp-api'],
                BLOG_TAKEWAY_VERSION,
                true
            );
            
            wp_localize_script('blog-takeway-admin', 'blogTakewayAjax', [
                'ajax_url' => admin_url('admin-ajax.php'),
                'admin_url' => admin_url(),
                'nonce' => wp_create_nonce('blog_takeway_nonce'),
                'rest_url' => rest_url('blog-takeway/v1/'),
                'strings' => [
                    'generating' => 'Generating summary...',
                    'success' => 'Summary generated successfully!',
                    'error' => 'Error generating summary',
                    'bulk_generating' => 'Processing bulk generation...',
                    'bulk_success' => 'Bulk generation completed!',
                    'bulk_error' => 'Error in bulk generation',
                ],
            ]);
        }
    }

    /**
     * Register admin menu items
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function register_admin_menu() {
        add_menu_page(
            esc_html__( 'Blog TakeWay', 'blog-takeway' ),
            esc_html__( 'Blog TakeWay', 'blog-takeway' ),
            'manage_options',
            $this->plugin_slug,
            [ $this, 'render_dashboard_page' ],
            plugin_dir_url( dirname( __FILE__ ) ) . 'assets/images/icons/menu-icon.svg', 
            30
        );

        // Add Dashboard submenu
        add_submenu_page(
            $this->plugin_slug,
            esc_html__( 'Dashboard', 'blog-takeway' ),
            esc_html__( 'Dashboard', 'blog-takeway' ),
            'manage_options',
            $this->plugin_slug,
            [ $this, 'render_dashboard_page' ]
        );

        // Add Settings submenu
        add_submenu_page(
            $this->plugin_slug,
            esc_html__( 'Settings', 'blog-takeway' ),
            esc_html__( 'Settings', 'blog-takeway' ),
            'manage_options',
            $this->plugin_slug . '-settings',
            [ $this, 'render_settings_page' ]
        );

        // Add Bulk Generator submenu
        add_submenu_page(
            $this->plugin_slug,
            esc_html__( 'Bulk Generator', 'blog-takeway' ),
            esc_html__( 'Bulk Generator', 'blog-takeway' ),
            'manage_options',
            $this->plugin_slug . '-bulk-generator',
            [ $this, 'render_bulk_generator_page' ]
        );

        // Logs menu removed
    }

    /**
     * Register plugin settings
     */
    public function register_settings() {
        register_setting('blog_takeway_settings', 'blog_takeway_settings', [
            'sanitize_callback' => [$this, 'sanitize_settings'],
        ]);

        add_settings_section(
            'blog_takeway_ai_settings',
            'AI API Configuration',
            [$this, 'render_ai_settings_section'],
            'blog_takeway_settings'
        );

        add_settings_field(
            'ai_api_key',
            'OpenAI API Key',
            [$this, 'render_api_key_field'],
            'blog_takeway_settings',
            'blog_takeway_ai_settings'
        );

        add_settings_field(
            'ai_model',
            'AI Model',
            [$this, 'render_model_field'],
            'blog_takeway_settings',
            'blog_takeway_ai_settings'
        );

        add_settings_section(
            'blog_takeway_generation_settings',
            'Generation Settings',
            [$this, 'render_generation_settings_section'],
            'blog_takeway_settings'
        );

        add_settings_field(
            'summary_length',
            'Summary Length',
            [$this, 'render_length_field'],
            'blog_takeway_settings',
            'blog_takeway_generation_settings'
        );

        add_settings_field(
            'summary_style',
            'Summary Style',
            [$this, 'render_style_field'],
            'blog_takeway_settings',
            'blog_takeway_generation_settings'
        );

        add_settings_field(
            'auto_generate',
            'Auto-generate on publish',
            [$this, 'render_auto_generate_field'],
            'blog_takeway_settings',
            'blog_takeway_generation_settings'
        );

        add_settings_section(
            'blog_takeway_display_settings',
            'Display Settings',
            [$this, 'render_display_settings_section'],
            'blog_takeway_settings'
        );

        add_settings_field(
            'display_position',
            'Summary Position',
            [$this, 'render_position_field'],
            'blog_takeway_settings',
            'blog_takeway_display_settings'
        );

        add_settings_field(
            'enable_takeaways',
            'Enable Takeaways',
            [$this, 'render_takeaways_field'],
            'blog_takeway_settings',
            'blog_takeway_display_settings'
        );
    }

    /**
     * Sanitize settings
     */
    public function sanitize_settings($input) {
        $sanitized = [];
        
        // Save API settings to database
        if (isset($input['ai_api_key']) && isset($input['ai_model'])) {
            $database = new Blog_Summary_Database();
            $database->save_api_settings(
                sanitize_text_field($input['ai_api_key']),
                sanitize_text_field($input['ai_model'])
            );
        }
        
        // Other settings still go to wp_options
        if (isset($input['summary_length'])) {
            $sanitized['summary_length'] = sanitize_text_field($input['summary_length']);
        }
        
        if (isset($input['summary_style'])) {
            $sanitized['summary_style'] = sanitize_text_field($input['summary_style']);
        }
        
        if (isset($input['auto_generate'])) {
            $sanitized['auto_generate'] = (bool) $input['auto_generate'];
        }
        
        if (isset($input['display_position'])) {
            $sanitized['display_position'] = sanitize_text_field($input['display_position']);
        }
        
        if (isset($input['enable_takeaways'])) {
            $sanitized['enable_takeaways'] = (bool) $input['enable_takeaways'];
        }
        
        return $sanitized;
    }

    /**
     * Render dashboard page
     */
    public function render_dashboard_page() {
        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have sufficient permissions to access this page.', 'blog-takeway'));
        }
        
        $database = new Blog_Summary_Database();
        $stats = $database->get_statistics();
        $table_info = $database->get_table_info();
        
        include BLOG_TAKEWAY_PLUGIN_DIR . 'templates/admin/dashboard.php';
    }

    /**
     * Render settings page
     */
    public function render_settings_page() {
        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have sufficient permissions to access this page.', 'blog-takeway'));
        }
        
        include BLOG_TAKEWAY_PLUGIN_DIR . 'templates/admin/settings.php';
    }

    /**
     * Render bulk generator page
     */
    public function render_bulk_generator_page() {
        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have sufficient permissions to access this page.', 'blog-takeway'));
        }
        
        // Show all published posts so users can (re)generate for any post
        $posts = get_posts([
            'post_type' => 'post',
            'post_status' => 'publish',
            'numberposts' => -1,
            'orderby' => 'date',
            'order' => 'DESC',
        ]);
        
        include BLOG_TAKEWAY_PLUGIN_DIR . 'templates/admin/bulk-generator.php';
    }

    // Logs page removed

    /**
     * Render AI settings section
     */
    public function render_ai_settings_section() {
        echo '<p>Configure your OpenAI API settings for AI-powered summary generation.</p>';
    }

    /**
     * Render API key field
     */
    public function render_api_key_field() {
        $database = new Blog_Summary_Database();
        $api_settings = $database->get_api_settings();
        $api_key = $api_settings ? $api_settings['api_key'] : '';
        
        echo '<input type="password" id="ai_api_key" name="blog_takeway_settings[ai_api_key]" value="' . esc_attr($api_key) . '" class="regular-text" />';
        echo '<p class="description">Enter your OpenAI API key. <a href="https://platform.openai.com/api-keys" target="_blank">Get your API key here</a>.</p>';
        echo '<button type="button" class="button" id="test-api-connection">Test Connection</button>';
        echo '<span id="api-test-result"></span>';
    }

    /**
     * Render model field
     */
    public function render_model_field() {
        $database = new Blog_Summary_Database();
        $api_settings = $database->get_api_settings();
        $model = $api_settings ? $api_settings['selected_model'] : 'gpt-3.5-turbo';
        
        $models = [
            'gpt-3.5-turbo' => 'GPT-3.5 Turbo (Fast & Cost-effective)',
            'gpt-4' => 'GPT-4 (Most Capable)',
            'gpt-4-turbo' => 'GPT-4 Turbo (Latest Version)'
        ];
        
        echo '<select id="ai_model" name="blog_takeway_settings[ai_model]">';
        foreach ($models as $value => $label) {
            $selected = selected($model, $value, false);
            echo '<option value="' . esc_attr($value) . '" ' . $selected . '>' . esc_html($label) . '</option>';
        }
        echo '</select>';
        echo '<p class="description">Choose the AI model for summary generation. GPT-4 is more capable but costs more.</p>';
    }

    /**
     * Render generation settings section
     */
    public function render_generation_settings_section() {
        echo '<p>Configure how summaries are generated and their characteristics.</p>';
    }

    /**
     * Render length field
     */
    public function render_length_field() {
        $settings = get_option('blog_takeway_settings', []);
        $length = isset($settings['summary_length']) ? $settings['summary_length'] : 'medium';
        
        $options = [
            'short' => 'Short (2-3 sentences, ~50-75 words)',
            'medium' => 'Medium (3-4 sentences, ~100-125 words)',
            'long' => 'Long (4-6 sentences, ~150-200 words)',
        ];
        
        foreach ($options as $value => $label) {
            $checked = checked($length, $value, false);
            echo '<label><input type="radio" name="blog_takeway_settings[summary_length]" value="' . esc_attr($value) . '" ' . $checked . ' /> ' . esc_html($label) . '</label><br>';
        }
    }

    /**
     * Render style field
     */
    public function render_style_field() {
        $settings = get_option('blog_takeway_settings', []);
        $style = isset($settings['summary_style']) ? $settings['summary_style'] : 'professional';
        
        $options = [
            'professional' => 'Professional (Clear, business-like tone)',
            'casual' => 'Casual (Friendly, conversational tone)',
            'technical' => 'Technical (Expert-level, industry-specific)',
            'educational' => 'Educational (Instructive, learning-focused)',
        ];
        
        foreach ($options as $value => $label) {
            $checked = checked($style, $value, false);
            echo '<label><input type="radio" name="blog_takeway_settings[summary_style]" value="' . esc_attr($value) . '" ' . $checked . ' /> ' . esc_html($label) . '</label><br>';
        }
    }

    /**
     * Render auto-generate field
     */
    public function render_auto_generate_field() {
        $settings = get_option('blog_takeway_settings', []);
        $auto_generate = isset($settings['auto_generate']) ? $settings['auto_generate'] : true;
        
        echo '<label><input type="checkbox" name="blog_takeway_settings[auto_generate]" value="1" ' . checked($auto_generate, true, false) . ' /> Automatically generate summaries when posts are published</label>';
        echo '<p class="description">If enabled, summaries will be generated automatically for new posts.</p>';
    }

    /**
     * Render display settings section
     */
    public function render_display_settings_section() {
        echo '<p>Configure how summaries are displayed on your blog posts.</p>';
    }

    /**
     * Render position field
     */
    public function render_position_field() {
        $settings = get_option('blog_takeway_settings', []);
        $position = isset($settings['display_position']) ? $settings['display_position'] : 'after_title';
        
        $options = [
            'after_title' => 'After post title (before content)',
            'before_content' => 'Before post content',
            'after_content' => 'After post content',
        ];
        
        foreach ($options as $value => $label) {
            $checked = checked($position, $value, false);
            echo '<label><input type="radio" name="blog_takeway_settings[display_position]" value="' . esc_attr($value) . '" ' . $checked . ' /> ' . esc_html($label) . '</label><br>';
        }
    }

    /**
     * Render takeaways field
     */
    public function render_takeaways_field() {
        $settings = get_option('blog_takeway_settings', []);
        $enable_takeaways = isset($settings['enable_takeaways']) ? $settings['enable_takeaways'] : true;
        
        echo '<label><input type="checkbox" name="blog_takeway_settings[enable_takeaways]" value="1" ' . checked($enable_takeaways, true, false) . ' /> Display key takeaways alongside summaries</label>';
        echo '<p class="description">If enabled, key takeaways will be displayed as bullet points.</p>';
    }

    /**
     * AJAX handler for generating summary
     */
    public function ajax_generate_summary() {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'] ?? '', 'blog_takeway_nonce')) {
            wp_send_json_error('Invalid nonce');
        }
        
        // Check user capabilities
        if (!current_user_can('edit_posts')) {
            wp_send_json_error('Insufficient permissions');
        }
        
        // Sanitize and validate input
        $post_id = absint($_POST['post_id'] ?? 0);
        $content = sanitize_textarea_field($_POST['content'] ?? '');
        
        if (!$post_id || !$content) {
            wp_send_json_error('Invalid parameters');
        }
        
        // Verify post exists and user can edit it
        $post = get_post($post_id);
        if (!$post || !current_user_can('edit_post', $post_id)) {
            wp_send_json_error('Invalid post or insufficient permissions');
        }
        
        $ai_handler = new AI_API_Handler();
        $result = $ai_handler->generate_summary($content);
        
        if (is_wp_error($result)) {
            wp_send_json_error($result->get_error_message());
        }
        
        // Save to blog_summaries table
        $database = new Blog_Summary_Database();
        $save_result = $database->save_blog_summary(
            $post_id,
            $result['takeaways'],
            $result['min_read_list']
        );

        if (is_wp_error($save_result)) {
            wp_send_json_error('Failed to save summary to database');
        }
        
        wp_send_json_success($result);
    }

    /**
     * AJAX handler for bulk generating summaries
     */
    public function ajax_bulk_generate_summaries() {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'] ?? '', 'blog_takeway_nonce')) {
            wp_send_json_error('Invalid nonce');
        }
        
        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Insufficient permissions');
        }
        
        // Sanitize and validate input
        $post_ids = array_map('absint', $_POST['post_ids'] ?? []);
        if (empty($post_ids)) {
            wp_send_json_error('No post IDs provided');
        }

        // Verify all posts exist and user can edit them
        foreach ($post_ids as $post_id) {
            $post = get_post($post_id);
            if (!$post || $post->post_type !== 'post' || !current_user_can('edit_post', $post_id)) {
                wp_send_json_error('Invalid post or insufficient permissions: ' . $post_id);
            }
        }

        // Process immediately to give instant feedback in admin
        $ai_handler   = new AI_API_Handler();
        $success_ids  = [];
        $error_ids    = [];

        foreach ($post_ids as $pid) {
            $post = get_post($pid);
            if (!$post || $post->post_type !== 'post') {
                $error_ids[] = $pid;
                continue;
            }

            $result = $ai_handler->generate_summary($post->post_content);
            if (is_wp_error($result)) {
                $error_ids[] = $pid;
                continue;
            }

            // Save to blog_summaries table
            $database = new Blog_Summary_Database();
            $save_result = $database->save_blog_summary(
                $pid,
                $result['takeaways'],
                $result['min_read_list']
            );

            if (is_wp_error($save_result)) {
                $error_ids[] = $pid;
                continue;
            }

            $success_ids[] = $pid;
        }

        wp_send_json_success([
            'processed'    => count($post_ids),
            'success'      => count($success_ids),
            'failed'       => count($error_ids),
            'success_ids'  => $success_ids,
            'error_ids'    => $error_ids,
            'message'      => 'Processed ' . count($post_ids) . ' posts'
        ]);
    }

    /**
     * AJAX handler for testing API connection
     */
    public function ajax_test_api_connection() {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'] ?? '', 'blog_takeway_nonce')) {
            wp_send_json_error('Invalid nonce');
        }
        
        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Insufficient permissions');
        }
        
        // Get API key from POST if testing new key
        $api_key = sanitize_text_field($_POST['api_key'] ?? '');
        
        if ($api_key) {
            // Testing new key
            $database = new Blog_Summary_Database();
            $database->save_api_settings($api_key, 'gpt-3.5-turbo');
        }
        
        $ai_handler = new AI_API_Handler();
        $result = $ai_handler->test_api_connection();
        
        if (is_wp_error($result)) {
            wp_send_json_error($result->get_error_message());
        }
        
        wp_send_json_success([
            'message' => 'API connection successful!',
            'model' => $ai_handler->get_current_model()
        ]);
    }
}
