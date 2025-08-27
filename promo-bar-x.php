<?php

/**
 * Plugin Name:  Promo Bar X – Customizable Campaign Top Bar | Countdown | CTA
 * Plugin URI:   https://wppool.com/plugins/promo-bar-x
 * Description:  Customizable and minimal top bar for WordPress with title, countdown timer, CTA button, and close option. Built in block style for easy CMS/product team editing, scheduling, and campaign management without code.
 * Version:      1.0.0
 * Requires PHP: 7.4
 * Author:       WPPOOL Team <support@wppool.com>
 * Author URI:   https://wppool.com/
 * Contributors: ahmmedsabbirbd
 * Text Domain:  promo-bar-x
 * Domain Path:  /languages/
 * License:      GPL2
 * License URI:  http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @category WordPress
 * @package  PromoBarX
 * @author   WPPOOL Team <support@wppool.com>
 * @license  GPL-2.0+ http://www.gnu.org/licenses/gpl-2.0.txt
 * @link     https://wppool.com/
 *
 * Third-party Libraries:
 * - (Optional) Any countdown or block editor library you integrate for timer and UI features
 */



if (defined('WP_DEBUG') && WP_DEBUG) {
    ob_start();
    register_activation_hook(__FILE__, function() {
        $output = ob_get_contents();
        if (!empty($output)) {
            // Silent handling of activation output in production
            return;
        }
    });
}

if ( ! defined('ABSPATH') ) {
	exit;
}

// Load Composer autoloader if available
if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
    require_once __DIR__ . '/vendor/autoload.php';
} else {
    // Log error but don't stop plugin execution
    if ( defined('WP_DEBUG') && WP_DEBUG ) {
        // error_log('Promo Bar X: Composer autoloader not found. Some features may not work properly.');
    }
}

/**
 * Main plugin class for Promo Bar X
 *
 * Handles initialization, dependencies loading, and core functionality
 * of the Promo Bar X plugin for WordPress.
 *
 * @category WordPress
 * @package  PromoBarX
 * @author   WPPOOL Team <support@wppool.com>
 * @license  GPL-2.0+ http://www.gnu.org/licenses/gpl-2.0.txt
 */
class PROMO_BAR_X {

    private static $instance = null;
    private $pdf_queue_handler = null;

    /**
     * Get singleton instance of this class
     *
     * @return PROMO_BAR_X Instance of this class
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
        define('PromoBarX_PLUGIN_FILE', __FILE__);
        define('PromoBarX_VERSION', '2.2.1');
        define('PromoBarX_PLUGIN_DIR', plugin_dir_path(__FILE__));
        define('PromoBarX_PLUGIN_URL', plugin_dir_url(__FILE__));
        define('PromoBarX_TEXT_DOMAIN', 'promo-bar-x');
        define('PromoBarX_CHAT_SESSION_COOKIE', 'promo_chat_session'); 

        // Initialize components
        add_action('init', [ $this, 'init' ]); 
        register_activation_hook(__FILE__, [ $this, 'activate' ]);
        
        $this->include_appsero_client();
        $this->appsero_init_tracker_promo_bar_x();

        // Load required files
        $this->load_dependencies(); 
    }

    /**
     * Initialize the plugin tracker
     *
     * @return void
     */
    public function appsero_init_tracker_promo_bar_x() {
        $client = new PromoBarX\Appsero\Client( '90ca1ab2-d744-4bbc-9914-54f176c8820a', 'Promo Bar X – Customizable Campaign Top Bar | Countdown | CTA', PromoBarX_PLUGIN_FILE );

        // Active insights.
        $client->insights()->init();
    }

    /**
     * Includes the Appsero client by creating a class alias if necessary.
     *
     * If the 'Appsero\Client' class is not defined, it will create an alias to
     * 'PROMO_BAR_X\Appsero\Client'.
     *
     * @version 1.0.0
     * @return void
     */
    public function include_appsero_client() {
        if ( ! class_exists( 'PromoBarX\Appsero\Client' ) ) {
            require_once __DIR__ . '/appsero/client/src/Client.php';
        }

        if ( ! class_exists('PromoBarX\Appsero\Client') ) {
            class_alias('PromoBarX\Appsero\Client','PromoBarX\Appsero\Client');
        }
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

        // Add chat widget to footer
        add_action('wp_footer', [ $this, 'render_chat_widget' ]);
 
    }

    /**
     * Load required plugin files and dependencies
     *
     * @return void
     */
    private function load_dependencies() {

        // Load Promo Bar X classes
        include_once PromoBarX_PLUGIN_DIR . 'includes/class-topbar-database.php';
        include_once PromoBarX_PLUGIN_DIR . 'includes/class-topbar-manager.php';
        include_once PromoBarX_PLUGIN_DIR . 'includes/class-topbar-admin.php';

        // Initialize admin class
        if (is_admin()) {
            add_action('admin_init', function() {
                TOP_Admin::get_instance();
            });
        }

        // Initialize Top Bar Manager
        PromoBarX_Manager::get_instance();
    }
 
    

    /**
     * Handle plugin activation tasks
     *
     * @return void
     */
    public function activate() {

        
        
        // Initialize PromoBarX database and create default promo bar

        $promobarx_db = new PromoBarX_Database();
        

    }

    /**
     * Enqueue required frontend scripts and styles
     *
     * @return void
     */
    public function enqueue_scripts() {
        if ( ! is_page('promo-bar-x-p') ) {
            // PROMO_Scripts::load_chat_widget_assets();
        }
    }

    /**
     * Render the chat widget container in footer
     *
     * @return void
     */
    public function render_chat_widget() {
        // Check if we're on the contact form page
        if ( ! is_page('promo-bar-x-p') ) {
            // PROMO_Scripts::load_chat_widget_assets();
        }
    }

}

// Initialize the plugin
PROMO_BAR_X::get_instance();