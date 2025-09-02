<?php
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Blog Summary Manager Class
 *
 * @category WordPress
 * @package  BlogTakeWay
 * @author   WPPOOL Team <support@wppool.com>
 * @license  GPL-2.0+ https://www.gnu.org/licenses/gpl-2.0.html
 */

class Blog_Summary_Manager {

    private static $instance = null;
    private $database;
    private $ai_handler;

    /**
     * Get singleton instance of the class
     *
     * @since 1.0.0
     *
     * @return Blog_Summary_Manager Instance of the class
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
        $this->database = new Blog_Summary_Database();
        $this->ai_handler = new AI_API_Handler();
        
        $this->init_hooks();
    }

    /**
     * Initialize WordPress hooks
     */
    private function init_hooks() {
        // Auto-generate summaries on post publish
        add_action('wp_insert_post', [$this, 'auto_generate_summary'], 10, 3);
        
        // Add shortcode support
        add_shortcode('blog_summary', [$this, 'summary_shortcode']);
        add_shortcode('blog_takeaways', [$this, 'takeaways_shortcode']);
        
        // Add widget support
        add_action('widgets_init', [$this, 'register_widgets']);
        
        // Add REST API support
        add_action('rest_api_init', [$this, 'register_rest_routes']);
        
        // Add cron job for cache cleanup
        add_action('blog_takeway_cache_cleanup', [$this, 'cleanup_expired_cache']);
        
        // Schedule cache cleanup if not already scheduled
        if (!wp_next_scheduled('blog_takeway_cache_cleanup')) {
            wp_schedule_event(time(), 'daily', 'blog_takeway_cache_cleanup');
        }
    }

    /**
     * Auto-generate summary when post is published
     *
     * @param int $post_id The post ID
     * @param WP_Post $post The post object
     * @param bool $update Whether this is an update
     */
    public function auto_generate_summary($post_id, $post, $update) {
        // Only process posts, not pages or other post types
        if ($post->post_type !== 'post') {
            return;
        }

        // Check if auto-generation is enabled
        $settings = get_option('blog_takeway_settings', []);
        if (!isset($settings['auto_generate']) || !$settings['auto_generate']) {
            return;
        }

        // Skip if this is an update and summary already exists
        if ($update) {
            $existing_summary = get_post_meta($post_id, '_blog_takeway_summary', true);
            if (!empty($existing_summary)) {
                return;
            }
        }

        // Skip if post is not published
        if ($post->post_status !== 'publish') {
            return;
        }

        // Skip if content is too short
        if (strlen(wp_strip_all_tags($post->post_content)) < 100) {
            return;
        }

        // Generate summary asynchronously to avoid blocking the publish process
        wp_schedule_single_event(time() + 30, 'blog_takeway_generate_summary_cron', [$post_id]);
    }

    /**
     * Generate summary for a specific post
     *
     * @param int $post_id The post ID
     * @return array|WP_Error Generated summary or error
     */
    public function generate_summary_for_post($post_id) {
        $post = get_post($post_id);
        if (!$post || $post->post_type !== 'post') {
            return new WP_Error('invalid_post', 'Invalid post ID or post type');
        }

        // Check if summary already exists
        $existing_summary = get_post_meta($post_id, '_blog_takeway_summary', true);
        if (!empty($existing_summary)) {
            return [
                'summary' => $existing_summary,
                'takeaways' => get_post_meta($post_id, '_blog_takeway_takeaways', true),
                'status' => 'existing',
            ];
        }

        // Generate new summary
        $result = $this->ai_handler->generate_summary($post->post_content);
        
        if (is_wp_error($result)) {
            // Log the error
            $this->database->log_generation(
                $post_id,
                'generate',
                'failed',
                $this->ai_handler->get_usage_statistics()['model'],
                0,
                0,
                $result->get_error_message()
            );
            return $result;
        }

        // Save to database
        $db_result = $this->database->save_summary(
            $post_id,
            $result['summary'],
            $result['takeaways'],
            $result['model']
        );

        if (is_wp_error($db_result)) {
            return $db_result;
        }

        // Save to post meta for backward compatibility
        update_post_meta($post_id, '_blog_takeway_summary', $result['summary']);
        update_post_meta($post_id, '_blog_takeway_takeaways', $result['takeaways']);

        return $result;
    }

    /**
     * Bulk generate summaries for multiple posts
     *
     * @param array $post_ids Array of post IDs
     * @param array $options Generation options
     * @return array Results for each post
     */
    public function bulk_generate_summaries($post_ids, $options = []) {
        $results = [];
        $success_count = 0;
        $error_count = 0;

        foreach ($post_ids as $post_id) {
            $result = $this->generate_summary_for_post($post_id);
            
            if (is_wp_error($result)) {
                $results[$post_id] = [
                    'success' => false,
                    'error' => $result->get_error_message(),
                ];
                $error_count++;
            } else {
                $results[$post_id] = [
                    'success' => true,
                    'summary' => $result['summary'],
                    'takeaways' => $result['takeaways'],
                ];
                $success_count++;
            }

            // Add delay between requests to avoid rate limiting
            usleep(500000); // 0.5 second delay
        }

        return [
            'results' => $results,
            'total' => count($post_ids),
            'success' => $success_count,
            'errors' => $error_count,
        ];
    }

    /**
     * Get summary for a post with caching
     *
     * @param int $post_id The post ID
     * @param bool $force_refresh Force refresh from database
     * @return array|false Summary data or false if not found
     */
    public function get_summary($post_id, $force_refresh = false) {
        // Try to get from database first
        $db_summary = $this->database->get_summary($post_id, !$force_refresh);
        
        if ($db_summary) {
            return $db_summary;
        }

        // Fallback to post meta
        $summary = get_post_meta($post_id, '_blog_takeway_summary', true);
        $takeaways = get_post_meta($post_id, '_blog_takeway_takeaways', true);
        
        if (!empty($summary)) {
            return [
                'summary' => $summary,
                'takeaways' => $takeaways,
                'status' => 'meta_fallback',
            ];
        }

        return false;
    }

    /**
     * Update summary for a post
     *
     * @param int $post_id The post ID
     * @param string $summary The summary text
     * @param array $takeaways The takeaways array
     * @return bool|WP_Error Success status or error
     */
    public function update_summary($post_id, $summary, $takeaways = []) {
        if (!$post_id || !$summary) {
            return new WP_Error('invalid_data', 'Invalid post ID or summary');
        }

        // Update database
        $db_result = $this->database->save_summary($post_id, $summary, $takeaways);
        
        if (is_wp_error($db_result)) {
            return $db_result;
        }

        // Update post meta for backward compatibility
        update_post_meta($post_id, '_blog_takeway_summary', $summary);
        update_post_meta($post_id, '_blog_takeway_takeaways', $takeaways);

        return true;
    }

    /**
     * Delete summary for a post
     *
     * @param int $post_id The post ID
     * @return bool Success status
     */
    public function delete_summary($post_id) {
        // Delete from database
        $db_result = $this->database->delete_summary($post_id);
        
        // Delete from post meta
        delete_post_meta($post_id, '_blog_takeway_summary');
        delete_post_meta($post_id, '_blog_takeway_takeaways');

        return $db_result;
    }

    /**
     * Summary shortcode
     *
     * @param array $atts Shortcode attributes
     * @return string Shortcode output
     */
    public function summary_shortcode($atts) {
        $atts = shortcode_atts([
            'post_id' => get_the_ID(),
            'show_title' => 'true',
            'class' => '',
        ], $atts);

        $post_id = intval($atts['post_id']);
        $summary_data = $this->get_summary($post_id);
        
        if (!$summary_data || empty($summary_data['summary'])) {
            return '';
        }

        $class = !empty($atts['class']) ? ' ' . esc_attr($atts['class']) : '';
        $show_title = filter_var($atts['show_title'], FILTER_VALIDATE_BOOLEAN);
        
        $output = '<div class="blog-takeway-summary-shortcode' . $class . '">';
        
        if ($show_title) {
            $output .= '<h3 class="summary-title">📝 Summary</h3>';
        }
        
        $output .= '<div class="summary-content">' . wpautop($summary_data['summary']) . '</div>';
        $output .= '</div>';
        
        return $output;
    }

    /**
     * Takeaways shortcode
     *
     * @param array $atts Shortcode attributes
     * @return string Shortcode output
     */
    public function takeaways_shortcode($atts) {
        $atts = shortcode_atts([
            'post_id' => get_the_ID(),
            'show_title' => 'true',
            'class' => '',
        ], $atts);

        $post_id = intval($atts['post_id']);
        $summary_data = $this->get_summary($post_id);
        
        if (!$summary_data || empty($summary_data['takeaways'])) {
            return '';
        }

        $class = !empty($atts['class']) ? ' ' . esc_attr($atts['class']) : '';
        $show_title = filter_var($atts['show_title'], FILTER_VALIDATE_BOOLEAN);
        
        $output = '<div class="blog-takeway-takeaways-shortcode' . $class . '">';
        
        if ($show_title) {
            $output .= '<h3 class="takeaways-title">🎯 Key Takeaways</h3>';
        }
        
        $output .= '<ul class="takeaways-list">';
        foreach ($summary_data['takeaways'] as $takeaway) {
            $output .= '<li>' . esc_html($takeaway) . '</li>';
        }
        $output .= '</ul>';
        $output .= '</div>';
        
        return $output;
    }

    /**
     * Register widgets
     */
    public function register_widgets() {
        register_widget('Blog_Summary_Widget');
    }

    /**
     * Register REST API routes
     */
    public function register_rest_routes() {
        register_rest_route('blog-takeway/v1', '/summary/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_summary_rest'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('blog-takeway/v1', '/summary/(?P<id>\d+)', [
            'methods' => 'PUT',
            'callback' => [$this, 'update_summary_rest'],
            'permission_callback' => function() {
                return current_user_can('edit_posts');
            },
        ]);
        
        register_rest_route('blog-takeway/v1', '/summary/(?P<id>\d+)', [
            'methods' => 'DELETE',
            'callback' => [$this, 'delete_summary_rest'],
            'permission_callback' => function() {
                return current_user_can('delete_posts');
            },
        ]);
    }

    /**
     * Get summary REST endpoint
     */
    public function get_summary_rest($request) {
        $post_id = $request->get_param('id');
        $summary = $this->get_summary($post_id);
        
        if (!$summary) {
            return new WP_REST_Response(['error' => 'Summary not found'], 404);
        }
        
        return new WP_REST_Response($summary);
    }

    /**
     * Update summary REST endpoint
     */
    public function update_summary_rest($request) {
        $post_id = $request->get_param('id');
        $summary = $request->get_param('summary');
        $takeaways = $request->get_param('takeaways');
        
        if (!$summary) {
            return new WP_REST_Response(['error' => 'Summary is required'], 400);
        }
        
        $result = $this->update_summary($post_id, $summary, $takeaways);
        
        if (is_wp_error($result)) {
            return new WP_REST_Response(['error' => $result->get_error_message()], 500);
        }
        
        return new WP_REST_Response(['message' => 'Summary updated successfully']);
    }

    /**
     * Delete summary REST endpoint
     */
    public function delete_summary_rest($request) {
        $post_id = $request->get_param('id');
        $result = $this->delete_summary($post_id);
        
        if (!$result) {
            return new WP_REST_Response(['error' => 'Failed to delete summary'], 500);
        }
        
        return new WP_REST_Response(['message' => 'Summary deleted successfully']);
    }

    /**
     * Cleanup expired cache entries
     */
    public function cleanup_expired_cache() {
        $cleaned = $this->database->clean_expired_cache();
        
        if ($cleaned > 0) {
            error_log("Blog TakeWay: Cleaned up {$cleaned} expired cache entries");
        }
    }

    /**
     * Get plugin statistics
     */
    public function get_statistics() {
        return $this->database->get_statistics();
    }

    /**
     * Get generation logs
     */
    public function get_generation_logs($args = []) {
        return $this->database->get_generation_logs($args);
    }

    /**
     * Test AI API connection
     */
    public function test_ai_connection() {
        return $this->ai_handler->test_api_connection();
    }

    /**
     * Get available AI models
     */
    public function get_available_models() {
        return $this->ai_handler->get_available_models();
    }
}

/**
 * Blog Summary Widget Class
 */
class Blog_Summary_Widget extends WP_Widget {

    public function __construct() {
        parent::__construct(
            'blog_summary_widget',
            'Blog Summary Widget',
            ['description' => 'Display blog summary and takeaways in a widget']
        );
    }

    public function widget($args, $instance) {
        $title = !empty($instance['title']) ? $instance['title'] : 'Blog Summary';
        $show_summary = !empty($instance['show_summary']);
        $show_takeaways = !empty($instance['show_takeaways']);
        $post_id = !empty($instance['post_id']) ? intval($instance['post_id']) : get_the_ID();

        if (!$post_id) {
            return;
        }

        $manager = Blog_Summary_Manager::get_instance();
        $summary_data = $manager->get_summary($post_id);

        if (!$summary_data) {
            return;
        }

        echo $args['before_widget'];
        echo $args['before_title'] . esc_html($title) . $args['after_title'];

        if ($show_summary && !empty($summary_data['summary'])) {
            echo '<div class="widget-summary">';
            echo '<h4>📝 Summary</h4>';
            echo '<p>' . esc_html($summary_data['summary']) . '</p>';
            echo '</div>';
        }

        if ($show_takeaways && !empty($summary_data['takeaways'])) {
            echo '<div class="widget-takeaways">';
            echo '<h4>🎯 Key Takeaways</h4>';
            echo '<ul>';
            foreach ($summary_data['takeaways'] as $takeaway) {
                echo '<li>' . esc_html($takeaway) . '</li>';
            }
            echo '</ul>';
            echo '</div>';
        }

        echo $args['after_widget'];
    }

    public function form($instance) {
        $title = !empty($instance['title']) ? $instance['title'] : 'Blog Summary';
        $show_summary = !empty($instance['show_summary']);
        $show_takeaways = !empty($instance['show_takeaways']);
        $post_id = !empty($instance['post_id']) ? $instance['post_id'] : '';
        ?>
        <p>
            <label for="<?php echo $this->get_field_id('title'); ?>">Title:</label>
            <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo esc_attr($title); ?>">
        </p>
        <p>
            <label for="<?php echo $this->get_field_id('post_id'); ?>">Post ID (leave empty for current post):</label>
            <input class="widefat" id="<?php echo $this->get_field_id('post_id'); ?>" name="<?php echo $this->get_field_name('post_id'); ?>" type="number" value="<?php echo esc_attr($post_id); ?>">
        </p>
        <p>
            <input class="checkbox" type="checkbox" <?php checked($show_summary); ?> id="<?php echo $this->get_field_id('show_summary'); ?>" name="<?php echo $this->get_field_name('show_summary'); ?>" />
            <label for="<?php echo $this->get_field_id('show_summary'); ?>">Show Summary</label>
        </p>
        <p>
            <input class="checkbox" type="checkbox" <?php checked($show_takeaways); ?> id="<?php echo $this->get_field_id('show_takeaways'); ?>" name="<?php echo $this->get_field_name('show_takeaways'); ?>" />
            <label for="<?php echo $this->get_field_id('show_takeaways'); ?>">Show Takeaways</label>
        </p>
        <?php
    }

    public function update($new_instance, $old_instance) {
        $instance = [];
        $instance['title'] = !empty($new_instance['title']) ? strip_tags($new_instance['title']) : '';
        $instance['post_id'] = !empty($new_instance['post_id']) ? intval($new_instance['post_id']) : '';
        $instance['show_summary'] = !empty($new_instance['show_summary']);
        $instance['show_takeaways'] = !empty($new_instance['show_takeaways']);
        return $instance;
    }
}
