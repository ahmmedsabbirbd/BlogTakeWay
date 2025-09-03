<?php

/**
 * Plugin Name:  Blog TakeWay – AI-Powered Blog Summaries & Takeaways
 * Plugin URI:   https://wppool.com/plugins/blog-takeway
 * Description:  Automatically generate AI-powered summaries and key takeaways for your blog posts. Features include bulk generation, custom styling, and responsive design for better reader engagement.
 * Version:      1.0.0
 * Requires PHP: 7.4
 * Author:       WPPOOL Team <support@wppool.com>
 * Author URI:   https://wppool.com/
 * Contributors: ahmmedsabbirbd
 * Text Domain:  blog-takeway
 * Domain Path:  /languages/
 * License:      GPL2
 * License URI:  http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @category WordPress
 * @package  BlogTakeWay
 * @author   WPPOOL Team <support@wppool.com>
 * @license  GPL-2.0+ http://www.gnu.org/licenses/gpl-2.0.txt
 * @link     https://wppool.com/
 */

if ( ! defined('ABSPATH') ) {
	exit;
}

// Load Composer autoloader if available
if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
    require_once __DIR__ . '/vendor/autoload.php';
}

/**
 * Main plugin class for Blog TakeWay
 *
 * 
 * Handles initialization, dependencies loading, and core functionality
 * of the Blog TakeWay plugin for WordPress.
 *
 * @category WordPress
 * @package  BlogTakeWay
 * @author   WPPOOL Team <support@wppool.com>
 * @license  GPL-2.0+ http://www.gnu.org/licenses/gpl-2.0.txt
 */
class BLOG_TAKEWAY {

    private static $instance = null;

    /**
     * Get singleton instance of this class
     *
     * @return BLOG_TAKEWAY Instance of this class
     */
    public static function get_instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor for initializing the plugin
     */
    private function __construct() {
        // Define constants
        define('BLOG_TAKEWAY_PLUGIN_FILE', __FILE__);
        define('BLOG_TAKEWAY_VERSION', '1.0.0');
        define('BLOG_TAKEWAY_PLUGIN_DIR', plugin_dir_path(__FILE__));
        define('BLOG_TAKEWAY_PLUGIN_URL', plugin_dir_url(__FILE__));
        define('BLOG_TAKEWAY_TEXT_DOMAIN', 'blog-takeway');

        // Initialize components
        add_action('init', [ $this, 'init' ]); 
        register_activation_hook(__FILE__, [ $this, 'activate' ]);
        register_deactivation_hook(__FILE__, [ $this, 'deactivate' ]);
        
        // Load required files
        $this->load_dependencies(); 
    }
    
    /**
     * Initialize plugin hooks and features
     *
     * @return void
     */
    public function init() {
        // Load dependencies first
        $this->load_dependencies();
        
        // Enqueue scripts
        add_action('wp_enqueue_scripts', [ $this, 'enqueue_scripts' ]);
        add_action('admin_enqueue_scripts', [ $this, 'enqueue_admin_scripts' ]);
        
        // Meta box removed
        
        // Auto-generate summary when post is created/updated
        add_action('wp_insert_post', [ $this, 'auto_generate_summary_on_save' ], 10, 3);
        
        // Add REST API endpoints
        add_action('rest_api_init', [ $this, 'register_rest_endpoints' ]);
        
        // Add cron job for bulk processing
        add_action('blog_takeway_bulk_generate_cron', [ $this, 'process_bulk_generation' ]);
        
        // Admin notice hook removed
    }

    /**
     * Load required plugin files and dependencies
     *
     * @return void
     */
    private function load_dependencies() {
        // Load Blog TakeWay classes
        include_once BLOG_TAKEWAY_PLUGIN_DIR . 'includes/class-blog-summary-database.php';
        include_once BLOG_TAKEWAY_PLUGIN_DIR . 'includes/class-blog-summary-manager.php';
        include_once BLOG_TAKEWAY_PLUGIN_DIR . 'includes/class-blog-summary-admin.php';
        include_once BLOG_TAKEWAY_PLUGIN_DIR . 'includes/class-ai-api-handler.php';

        // Initialize admin class early so admin_menu hooks register in time
        if (is_admin()) {
            Blog_Summary_Admin::get_instance();
        }

        // Initialize Summary Manager
        Blog_Summary_Manager::get_instance();
    }
 
    /**
     * Handle plugin activation tasks
     *
     * @return void
     */
    public function activate() {
        // Initialize Blog TakeWay database
        $blog_summary_db = new Blog_Summary_Database();
        
        // Create default settings
        $this->create_default_settings();
        
        // Schedule cron job for bulk processing
        if (!wp_next_scheduled('blog_takeway_bulk_generate_cron')) {
            wp_schedule_event(time(), 'hourly', 'blog_takeway_bulk_generate_cron');
        }
        
        // Flush rewrite rules
        flush_rewrite_rules();
    }

    /**
     * Handle plugin deactivation tasks
     *
     * @return void
     */
    public function deactivate() {
        // Clear scheduled cron job
        wp_clear_scheduled_hook('blog_takeway_bulk_generate_cron');
        
        // Flush rewrite rules
        flush_rewrite_rules();
    }

    /**
     * Create default plugin settings
     *
     * @return void
     */
    private function create_default_settings() {
        $default_settings = [
            'ai_api_key' => '',
            'ai_api_endpoint' => 'https://api.openai.com/v1/chat/completions',
            'ai_model' => 'gpt-3.5-turbo',
            'summary_length' => 'medium',
            'summary_style' => 'professional',
            'auto_generate' => true,
            'display_position' => 'after_title',
            'enable_takeaways' => true,
            'cache_duration' => 86400, // 24 hours
        ];
        
        add_option('blog_takeway_settings', $default_settings);
    }

    /**
     * Enqueue required frontend scripts and styles
     *
     * @return void
     */
    public function enqueue_scripts() {
        if (is_single() && get_post_type() === 'post') {
            wp_enqueue_style(
                'blog-takeway-frontend',
                BLOG_TAKEWAY_PLUGIN_URL . 'build/chat-widget.css',
                [],
                BLOG_TAKEWAY_VERSION
            );
            
            wp_enqueue_script(
                'blog-takeway-frontend',
                BLOG_TAKEWAY_PLUGIN_URL . 'build/chat-widget.js',
                ['jquery'],
                BLOG_TAKEWAY_VERSION,
                true
            );
        }
    }

    /**
     * Enqueue admin scripts and styles
     *
     * @return void
     */
    public function enqueue_admin_scripts($hook) {
        if (strpos($hook, 'blog-takeway') !== false) {
            wp_enqueue_style(
                'blog-takeway-admin',
                BLOG_TAKEWAY_PLUGIN_URL . 'build/chat-admin.css',
                [],
                BLOG_TAKEWAY_VERSION
            );
            
            wp_enqueue_script(
                'blog-takeway-admin',
                BLOG_TAKEWAY_PLUGIN_URL . 'build/chat-admin.js',
                ['jquery', 'wp-api'],
                BLOG_TAKEWAY_VERSION,
                true
            );
            
            wp_localize_script('blog-takeway-admin', 'blogTakewayAjax', [
                'ajax_url' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('blog_takeway_nonce'),
                'rest_url' => rest_url('blog-takeway/v1/'),
            ]);
        }
    }

    /**
     * Render summary HTML
     *
     * @param string $summary The summary text
     * @param array $takeaways The takeaways array
     * @return string HTML output
     */
    private function render_summary_html($summary, $takeaways) {
        $post_id = get_the_ID();
        $html  = '<div class="blog-takeway-summary" id="blog-takeway-summary-' . $post_id . '">';

        // Inline styles for left sidebar layout with expandable takeaways
        $html .= '<style>
            .btw-layout{display:flex;gap:32px;margin:32px 0;align-items:flex-start}
            .btw-sidebar{flex:0 0 320px;position:sticky;top:24px}
            .btw-main{flex:1;min-width:0}
            .btw-summary-card{background:#ffffff;border:1px solid #e6e8eb;border-radius:16px;padding:24px;box-shadow:0 4px 12px rgba(0,0,0,0.08);margin-bottom:24px}
            .btw-summary-card h3{margin:0 0 16px;font-size:20px;line-height:1.3;color:#1b1f23;display:flex;align-items:center;gap:8px}
            .btw-summary-card .content{color:#3f4a54;line-height:1.7;font-size:15px}
            .btw-takeaways-card{background:linear-gradient(135deg,#e9f0ff 0%,#f1f6ff 100%);border:1px solid #d6e2ff;border-radius:20px;padding:24px;box-shadow:0 8px 24px rgba(30,64,175,0.12)}
            .btw-takeaways-card h3{margin:0 0 20px;font-size:22px;line-height:1.3;color:#1b3a8a;display:flex;align-items:center;gap:10px;cursor:pointer;user-select:none}
            .btw-takeaways-card h3:hover{color:#1e40af}
            .btw-chip{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:999px;background:#1d4ed8;color:#fff;font-weight:700;font-size:16px}
            .btw-takeaways-list{list-style:none;margin:0;padding:0;max-height:400px;overflow:hidden;transition:max-height 0.3s ease}
            .btw-takeaways-list.collapsed{max-height:0}
            .btw-takeaway-item{display:flex;gap:12px;align-items:flex-start;background:#ffffff;border:1px solid #e3e9ff;border-radius:12px;padding:14px 16px;margin:12px 0;transition:all 0.2s ease}
            .btw-takeaway-item:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(30,64,175,0.15)}
            .btw-dot{color:#1d4ed8;font-size:20px;line-height:1;margin-top:2px;flex-shrink:0}
            .btw-text{color:#1f2937;line-height:1.6;font-size:14px}
            .btw-toggle-icon{transition:transform 0.3s ease;font-size:18px;margin-left:auto}
            .btw-takeaways-list.collapsed + .btw-toggle-icon{transform:rotate(-90deg)}
            @media (max-width: 1024px){.btw-layout{flex-direction:column}.btw-sidebar{flex:none;position:static;width:100%}}
            @media (max-width: 768px){.btw-sidebar{flex:none;width:100%}.btw-summary-card,.btw-takeaways-card{padding:20px}}
        </style>';

        $html .= '<div class="btw-layout">';
        
        // Left Sidebar with Summary and Takeaways
        $html .= '<aside class="btw-sidebar">';

        if (!empty($summary)) {
            $html .= '<div class="btw-summary-card" aria-labelledby="btw-summary-title-' . $post_id . '">';
            $html .= '<h3 id="btw-summary-title-' . $post_id . '">📝 Summary</h3>';
            $html .= '<div class="content">' . wpautop(wp_kses_post($summary)) . '</div>';
            $html .= '</div>';
        }

        if (!empty($takeaways)) {
            // Normalize takeaways to an array
            $items = is_array($takeaways) ? $takeaways : (array) $takeaways;
            $html .= '<div class="btw-takeaways-card" aria-labelledby="btw-takeaways-title-' . $post_id . '">';
            $html .= '<h3 id="btw-takeaways-title-' . $post_id . '" class="btw-toggle-trigger" data-target="takeaways-' . $post_id . '">';
            $html .= '<span class="btw-chip">✦</span> Key Takeaways';
            $html .= '<span class="btw-toggle-icon">▼</span>';
            $html .= '</h3>';
            $html .= '<ul class="btw-takeaways-list" id="takeaways-' . $post_id . '">';
            foreach ($items as $t) {
                $text = wp_kses_post(is_string($t) ? $t : (string) $t);
                if ($text === '') { continue; }
                $html .= '<li class="btw-takeaway-item"><span class="btw-dot">•</span><span class="btw-text">' . $text . '</span></li>';
            }
            $html .= '</ul>';
            $html .= '</div>';
        }

        $html .= '</aside>'; // .btw-sidebar

        // Main content area (empty div for layout purposes)
        $html .= '<div class="btw-main"></div>';

        $html .= '</div>'; // .btw-layout

        // JavaScript for expandable takeaways
        $html .= '<script>
        jQuery(document).ready(function($) {
            $(".btw-toggle-trigger").on("click", function() {
                var targetId = $(this).data("target");
                var list = $("#" + targetId);
                var icon = $(this).find(".btw-toggle-icon");
                
                if (list.hasClass("collapsed")) {
                    list.removeClass("collapsed");
                    icon.text("▼");
                } else {
                    list.addClass("collapsed");
                    icon.text("▶");
                }
            });
        });
        </script>';

        $html .= '</div>'; // .blog-takeway-summary

        return $html;
    }

    // Meta box functions removed

    /**
     * Auto-generate summary when post is created/updated
     *
     * @param int $post_id The post ID
     * @param WP_Post $post The post object
     * @param bool $update Whether this is an existing post being updated or not
     * @return void
     */
    public function auto_generate_summary_on_save($post_id, $post, $update) {
        // Skip if not a post or is autosave/revision
        if ($post->post_type !== 'post' || wp_is_post_autosave($post_id) || wp_is_post_revision($post_id)) {
            return;
        }

        // Skip if post is not published
        if ($post->post_status !== 'publish') {
            return;
        }

        // Generate summary and takeaways
        $ai_handler = new AI_API_Handler();
        $result = $ai_handler->generate_summary($post->post_content);
        
        if (is_wp_error($result)) {
            return;
        }

        // Save to blog_summaries table
        $database = new Blog_Summary_Database();
        $database->save_blog_summary(
            $post_id,
            $result['takeaways'],
            $result['min_read_list']
        );
    }

    /**
     * Register REST API endpoints
     *
     * @return void
     */
    public function register_rest_endpoints() {
        register_rest_route('blog-takeway/v1', '/generate-summary', [
            'methods' => 'POST',
            'callback' => [$this, 'generate_summary_endpoint'],
            'permission_callback' => function() {
                return current_user_can('edit_posts');
            },
        ]);
        
        register_rest_route('blog-takeway/v1', '/bulk-generate', [
            'methods' => 'POST',
            'callback' => [$this, 'bulk_generate_endpoint'],
            'permission_callback' => function() {
                return current_user_can('manage_options');
            },
        ]);
    }

    /**
     * Generate summary endpoint
     *
     * @param WP_REST_Request $request The request object
     * @return WP_REST_Response The response
     */
    public function generate_summary_endpoint($request) {
        $post_id = $request->get_param('post_id');
        $content = $request->get_param('content');
        
        if (!$post_id || !$content) {
            return new WP_REST_Response(['error' => 'Missing required parameters'], 400);
        }
        
        $ai_handler = new AI_API_Handler();
        $result = $ai_handler->generate_summary($content);
        
        if (is_wp_error($result)) {
            return new WP_REST_Response(['error' => $result->get_error_message()], 500);
        }
        
        // Save the generated summary
        update_post_meta($post_id, '_blog_takeway_summary', $result['summary']);
        update_post_meta($post_id, '_blog_takeway_takeaways', $result['takeaways']);
        
        return new WP_REST_Response($result);
    }

    /**
     * Bulk generate endpoint
     *
     * @param WP_REST_Request $request The request object
     * @return WP_REST_Response The response
     */
    public function bulk_generate_endpoint($request) {
        $post_ids = $request->get_param('post_ids');
        
        if (!$post_ids || !is_array($post_ids)) {
            return new WP_REST_Response(['error' => 'Missing post IDs'], 400);
        }
        
        // Schedule bulk generation
        wp_schedule_single_event(time(), 'blog_takeway_bulk_generate_cron', [$post_ids]);
        
        return new WP_REST_Response(['message' => 'Bulk generation scheduled']);
    }

    /**
     * Process bulk generation
     *
     * @param array $post_ids Array of post IDs
     * @return void
     */
    public function process_bulk_generation($post_ids) {
        $ai_handler = new AI_API_Handler();
        $database = new Blog_Summary_Database();
        
        foreach ($post_ids as $post_id) {
            $post = get_post($post_id);
            if ($post && $post->post_type === 'post' && $post->post_status === 'publish') {
                $result = $ai_handler->generate_summary($post->post_content);
                if (!is_wp_error($result)) {
                    $database->save_blog_summary(
                        $post_id,
                        $result['takeaways'],
                        $result['min_read_list']
                    );
                }
            }
        }
    }

    // Admin notice removed
}

// Initialize the plugin
BLOG_TAKEWAY::get_instance();
