<?php
/**
 * AISK Admin Class
 *
 * @category WordPress
 * @package  AISK
 * @author   Aisk Team <support@aisk.chat>
 * @license  GPL-2.0+ http://www.gnu.org/licenses/gpl-2.0.txt
 * @link     https://aisk.com
 */

if ( ! defined('ABSPATH') ) {
	exit;
}

/**
 * AISK Admin Class handles all admin-related functionality
 *
 * @category Class
 * @package  AISK
 * @author   Aisk Team <support@aisk.chat>
 * @license  GPL-2.0+ http://www.gnu.org/licenses/gpl-2.0.txt
 * @link     https://aisk.com
 */
class AISK_Admin {


    private $plugin_slug = 'promo-bar-x';
    private static $instance = null;

    /**
     * Get singleton instance of the class
     *
     * @since 1.0.0
     *
     * @return AISK_Admin Instance of the class
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

        add_action('rest_api_init', [ $this, 'aisk_register_settings_endpoints' ]);
    }
    
    /**
     * Menu Left Style
     */
    public function enqueue_admin_styles( $hook_suffix ) {
        wp_enqueue_style( 
            'promo-bar-x-admin-style', 
            plugin_dir_url( dirname( __FILE__ ) ) . 'assets/css/admin-style.css',
            [],
            PromoBarX_VERSION
        );
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
            esc_html__( 'PromoBarX', 'promo-bar-x' ),
            esc_html__( 'PromoBarX', 'promo-bar-x' ),
            'manage_options',
            $this->plugin_slug,
            [ $this, 'render_dashboard_page' ],
            plugin_dir_url( dirname( __FILE__ ) ) . 'assets/images/icons/menu-icon-short.svg', 
            30
        );

        // Add Settings submenu
        add_submenu_page(
            $this->plugin_slug,
            esc_html__( 'Settings', 'promo-bar-x' ),
            esc_html__( 'Settings', 'promo-bar-x' ),
            'manage_options',
            $this->plugin_slug . '-settings',
            [ $this, 'render_settings_page' ]
        );

        // Remove default submenu page
        remove_submenu_page($this->plugin_slug, $this->plugin_slug);
    }
    /**
     * Enqueue admin scripts and styles
     *
     * @param string $hook Current admin page hook
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function enqueue_admin_scripts($hook) {
        // Check if we're on any of our plugin pages
        $allowed_hooks = [
            'toplevel_page_' . $this->plugin_slug,
            $this->plugin_slug . '_page_' . $this->plugin_slug . '-settings',
        ];

        // Also check if the hook contains our plugin slug (more flexible approach)
        $is_plugin_page = in_array($hook, $allowed_hooks) || strpos($hook, $this->plugin_slug) !== false;

        if (!$is_plugin_page) {
            return;
        }

        // First load the common chat widget assets
        AISK_Scripts::load_chat_widget_assets();

        // Then load admin-specific assets
        wp_enqueue_media();

        // Register and enqueue admin styles
        wp_register_style(
            'promo-bar-x-admin',
            PromoBarX_PLUGIN_URL . 'build/chat-admin.css',
            [],
            PromoBarX_VERSION
        );
        wp_enqueue_style('promo-bar-x-admin');

        // Register and enqueue admin scripts
        wp_register_script(
            'promo-bar-x-admin',
            PromoBarX_PLUGIN_URL . 'build/chat-admin.js',
            ['wp-element', 'wp-components', 'wp-api-fetch', 'wp-i18n'],
            PromoBarX_VERSION,
            [
                'in_footer' => true,
                'strategy' => 'defer'
            ]
        );
        wp_enqueue_script('promo-bar-x-admin');

        wp_localize_script(
            'promo-bar-x-admin',
            'AiskSettings',
            [
                'apiUrl' => rest_url('aisk/v1'),
                'nonce' => wp_create_nonce('wp_rest'),
                'pluginUrl' => PromoBarX_PLUGIN_URL,
                'isWooCommerceActive' => class_exists('WooCommerce'),
                'maxUploadSize' => wp_max_upload_size(),
            ]
        );
        wp_set_script_translations('promo-bar-x-admin', 'promo-bar-x');
    }

    /**
     * Register REST API endpoints for settings
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function aisk_register_settings_endpoints() {
        register_rest_route(
            'aisk/v1', '/settings', [
				[
					'methods' => 'GET',
					'callback' => [ $this, 'aisk_get_settings' ],
					'permission_callback' => function () {
						return current_user_can('manage_options');
					},
				],
				[
					'methods' => 'POST',
					'callback' => [ $this, 'aisk_update_settings' ],
					'permission_callback' => function () {
						return current_user_can('manage_options');
					},
				],
            ]
        );
        register_rest_route('aisk/v1', '/install-woocommerce', array(
            'methods' => 'POST',
            'callback' => array( $this, 'install_woocommerce' ),
            'permission_callback' => function () {
                return current_user_can('activate_plugins');
            },
        ));
    }

    public function install_woocommerce() {
        if ( ! class_exists('WooCommerce') ) {
            require_once ABSPATH . 'wp-admin/includes/plugin.php';
            require_once ABSPATH . 'wp-admin/includes/plugin-install.php';
            require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
            require_once ABSPATH . 'wp-admin/includes/class-plugin-upgrader.php';
            require_once ABSPATH . 'wp-admin/includes/file.php';

            try {
                // Check if WooCommerce is already installed
                $installed_path = 'woocommerce/woocommerce.php';
                if ( ! file_exists( WP_PLUGIN_DIR . '/' . $installed_path ) ) {
                    // Get WooCommerce download URL
                    $api = plugins_api('plugin_information', array(
                        'slug' => 'woocommerce',
                        'fields' => array( 'download_link' => true ),
                    ));

                    if ( is_wp_error($api) ) {
                        return new WP_Error( 'api_error', $api->get_error_message() );
                    }

                    // Install WooCommerce
                    $skin = new WP_Ajax_Upgrader_Skin();
                    $upgrader = new Plugin_Upgrader($skin);
                    $result = $upgrader->install($api->download_link);

                    if ( is_wp_error($result) ) {
                        return new WP_Error('installation_failed', $result->get_error_message());
                    }
                }

                // Activate WooCommerce
                if ( ! is_plugin_active($installed_path) ) {
                    $result = activate_plugin($installed_path);
                    if ( is_wp_error($result) ) {
                        return new WP_Error( 'activation_failed', $result->get_error_message() );
                    }
                }

                return array(
                    'success' => true,
                    'message' => 'WooCommerce installed and activated successfully',
                    'isActive' => true,
                );

            } catch ( Exception $e ) {
                return new WP_Error('installation_error', $e->getMessage());
            }
        }

        return array(
            'success' => true,
            'message' => 'WooCommerce is already installed and activated',
            'isActive' => true,
        );
    }
 
    /**
     * Render settings admin page
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function render_settings_page() {
        echo '<div id="promo-bar-x-settings-app"></div>';
    }

    /**
     * Get plugin settings
     *
     * @since 1.0.0
     *
     * @return WP_REST_Response
     */
    public function aisk_get_settings() {
        $settings = get_option('aisk_settings', []);
        return rest_ensure_response($settings);
    }

    /**
     * Update plugin settings
     *
     * @param WP_REST_Request $request Request object
     *
     * @since 1.0.0
     *
     * @return WP_REST_Response
     */
    public function aisk_update_settings( $request ) {
        $settings = $request->get_json_params();
        update_option('aisk_settings', $settings);
        return rest_ensure_response([ 'success' => true ]);
    }
}

AISK_Admin::get_instance();
