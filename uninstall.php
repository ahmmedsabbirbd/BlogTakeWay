<?php

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
    exit;
}

class PromoBarX_Uninstaller {

    /**
     * Array of table names
     *
     * @var array
     */
    private $tables;

    /**
     * Array of option names
     *
     * @var array
     */
    private $options;

    /**
     * Initialize the uninstaller
     */
    public function __construct() {
        $this->tables = [
            'promo_conversations',
            'promo_messages',
            'promo_user_states',
            'promo_inquiries',
            'promo_inquiry_notes',
            'promo_embeddings',
            'promo_pdf_queue',
        ];

        $this->options = [
            'promo_settings',
            'promo_last_pdf_processing',
        ];
    }

    /**
     * Run the uninstallation process
     */
    public function uninstall() {
        $this->drop_tables();
        $this->remove_options();
        $this->clear_cache();
    }

    /**
     * Drop all plugin tables
     */
    private function drop_tables() {
        global $wpdb;
        // @codingStandardsIgnoreStart
        foreach ( $this->tables as $table ) {
            $table_name = $wpdb->prefix . $table;
            $wpdb->query("DROP TABLE IF EXISTS `" . esc_sql($table_name) . "`");
        }
        // @codingStandardsIgnoreEnd
    }

    /**
     * Remove all plugin options
     */
    private function remove_options() {
        // @codingStandardsIgnoreStart
        foreach ( $this->options as $option ) {
			delete_option( $option );
        }
        // @codingStandardsIgnoreEnd
    }

    /**
     * Clear WordPress cache
     */
    private function clear_cache() {
        // @codingStandardsIgnoreStart
        wp_cache_flush();
        // @codingStandardsIgnoreEnd
    }
}

// Execute the uninstallation
$uninstaller = new PromoBarX_Uninstaller();
$uninstaller->uninstall();
