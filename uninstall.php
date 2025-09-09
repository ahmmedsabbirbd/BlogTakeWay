<?php

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
    exit;
}

class Post_Takeaways_Uninstaller {

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
     * Array of post meta keys
     *
     * @var array
     */
    private $post_meta_keys;

    /**
     * Array of transient keys
     *
     * @var array
     */
    private $transient_keys;

    /**
     * Initialize the uninstaller
     */
    public function __construct() {
        $this->tables = [
            'blog_summaries',
            'api_tokens',
        ];

        $this->options = [
            'post_takeaways_settings',
        ];

        $this->post_meta_keys = [
            '_post_takeaways_summary',
            '_post_takeaways_takeaways',
        ];

        $this->transient_keys = [
            'post_takeaways_cache_',
            'post_takeaways_bulk_',
        ];
    }

    /**
     * Run the uninstallation process
     */
    public function uninstall() {
        $this->clear_scheduled_cron_jobs();
        $this->drop_tables();
        $this->remove_options();
        $this->remove_post_meta();
        $this->clear_transients();
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
     * Clear scheduled cron jobs
     */
    private function clear_scheduled_cron_jobs() {
        // @codingStandardsIgnoreStart
        wp_clear_scheduled_hook('post_takeaways_bulk_generate_cron');
        wp_clear_scheduled_hook('post_takeaways_cleanup_orphaned_cron');
        // @codingStandardsIgnoreEnd
    }

    /**
     * Remove post meta data
     */
    private function remove_post_meta() {
        global $wpdb;

        // @codingStandardsIgnoreStart
        foreach ( $this->post_meta_keys as $meta_key ) {
            $wpdb->delete(
                $wpdb->postmeta,
                ['meta_key' => $meta_key],
                ['%s']
            );
        }
        // @codingStandardsIgnoreEnd
    }

    /**
     * Clear transients
     */
    private function clear_transients() {
        global $wpdb;

        // @codingStandardsIgnoreStart
        foreach ( $this->transient_keys as $transient_key ) {
            // Delete transients with wildcard pattern
            $wpdb->query(
                $wpdb->prepare(
                    "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
                    '_transient_' . $transient_key . '%',
                    '_transient_timeout_' . $transient_key . '%'
                )
            );
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
$uninstaller = new Post_Takeaways_Uninstaller();
$uninstaller->uninstall();
