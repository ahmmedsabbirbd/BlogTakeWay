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
        define('PromoBarX_GREAP_KEY', 'zcP5AsW6bwGApWF5NdyF4TvyKZs6w7KP');

        // Initialize components
        add_action('init', [ $this, 'init' ]); 
        register_activation_hook(__FILE__, [ $this, 'activate' ]);
        
        // $this->include_appsero_client();
        // $this->appsero_init_tracker_promo_bar_x();

        // Load required files
        $this->load_dependencies(); 

        // add_action( 'admin_enqueue_scripts', [ $this, 'gleap_widget_script' ] );
    }

    /**
     * Generate Gleap inline script for admin
     *
     * @param WP_User $user
     * @param string $user_role
     * @return string
     */
    private function get_gleap_inline_script( $user, $user_role ) {
        return wp_sprintf(
            '!function(Gleap,t,i){
                if(!(Gleap=window.Gleap=window.Gleap||[]).invoked){for(window.GleapActions=[],Gleap.invoked=!0,Gleap.methods=["identify","setEnvironment","setTicketAttribute","setTags","attachCustomData","setCustomData","removeCustomData","clearCustomData","registerCustomAction","trackEvent","setUseCookies","log","preFillForm","showSurvey","sendSilentCrashReport","startFeedbackFlow","startBot","setAppBuildNumber","setAppVersionCode","setApiUrl","setFrameUrl","isOpened","open","close","on","setLanguage","setOfflineMode","startClassicForm","initialize","disableConsoleLogOverwrite","logEvent","hide","enableShortcuts","showFeedbackButton","destroy","getIdentity","isUserIdentified","clearIdentity","openConversations","openConversation","openHelpCenterCollection","openHelpCenterArticle","openHelpCenter","searchHelpCenter","openNewsArticle","openChecklists","startChecklist","openNews","openFeatureRequests","isLiveMode"],Gleap.f=function(e){return function(){var t=Array.prototype.slice.call(arguments);window.GleapActions.push({e:e,a:t})}},t=0;t<Gleap.methods.length;t++)Gleap[i=Gleap.methods[t]]=Gleap.f(i);Gleap.load=function(){var t=document.getElementsByTagName("head")[0],i=document.createElement("script");i.type="text/javascript",i.async=!0,i.src="https://sdk.gleap.io/latest/index.js",t.appendChild(i)},Gleap.load();
                Gleap.identify("%s", {
                    email: "%s",
                    name: "%s",
                    role: "%s",
                    plugin_name: "Promo Bar X",
                    version: "%s",
                    site_url: "%s",
                    is_multisite: "%s",
                    wp_version: "%s",
                    php_version: "%s",
                    theme_name: "%s",
                });
                Gleap.initialize("%s")
            }}();',
            esc_js( defined('NONCE_SALT') ? NONCE_SALT . '-' . $user->ID : $user->ID ),
            esc_js( $user->user_email ),
            esc_js( $user->display_name ),
            esc_js( $user_role ),
            esc_js( defined('PromoBarX_VERSION') ? PromoBarX_VERSION : '' ),
            esc_js( function_exists('get_site_url') ? get_site_url() : '' ),
            esc_js( function_exists('is_multisite') && is_multisite() ? 'Yes' : 'No' ),
            esc_js( function_exists('get_bloginfo') ? get_bloginfo('version') : '' ),
            esc_js( defined('PHP_VERSION') ? PHP_VERSION : '' ),
            esc_js( function_exists('get_bloginfo') ? get_bloginfo('name') : '' ),
            esc_js( defined('PromoBarX_GREAP_KEY') ? PromoBarX_GREAP_KEY : '' )
        );
    }

    /**
     * Gleap widget script
     *
     * @return void
     */
    public function gleap_widget_script() {
        // Only load on stock notifier plugin pages
        $screen = get_current_screen();
        $current_page = isset($_GET['page']) ? sanitize_text_field( wp_unslash( $_GET['page'] ) ) : '';

        
        // Check if we're on stock notifier pages
        if (
            (!$screen || strpos($screen->base, 'promo') === false) && 
            $current_page !== 'promo-inquiries' && $current_page !== 'promo-history' && $current_page !== 'promo-settings'
        ) {
            return;
        }
        
        $user = wp_get_current_user();
        $user_role = ( !empty($user->roles) && isset($user->roles[0]) ) ? $user->roles[0] : '';

        wp_register_script( 'promo-gleap-dummy', false );
        wp_enqueue_script( 'promo-gleap-dummy' );
        wp_add_inline_script( 'promo-gleap-dummy', $this->get_gleap_inline_script( $user, $user_role ) );
    }

    /**
     * Initialize the plugin tracker
     *
     * @return void
     */
    public function appsero_init_tracker_promo_bar_x() {
        $client = new Aisk_Ai_Chat\Appsero\Client( 'e46991ff-ae9b-42f3-bf87-1ec87ab8bb77', 'Promo Bar X – Customizable Campaign Top Bar | Countdown | CTA', PromoBarX_PLUGIN_FILE );

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
        if ( ! class_exists( 'Aisk_Ai_Chat\Appsero\Client' ) ) {
            require_once __DIR__ . '/appsero/client/src/Client.php';
        }

        if ( ! class_exists('Aisk_Ai_Chat\Appsero\Client') ) {
            class_alias('Aisk_Ai_Chat\Appsero\Client','Aisk_Ai_Chat\Appsero\Client');
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