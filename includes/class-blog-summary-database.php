<?php
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Database handling class for Blog TakeWay
 *
 * @category WordPress
 * @package  BlogTakeWay
 * @author   WPPOOL Team <support@wppool.com>
 * @license  GPL-2.0+ https://www.gnu.org/licenses/gpl-2.0.html
 */

class Blog_Summary_Database {

    private $wpdb;
    private $table_prefix;

    /**
     * Initialize the database class
     */
    public function __construct() {
        global $wpdb;
        $this->wpdb = $wpdb;
        $this->table_prefix = $this->wpdb->prefix;
        $this->create_tables();
    }

    /**
     * Create required database tables
     */
    public function create_tables() {
        $charset_collate = $this->wpdb->get_charset_collate();

        // Blog summaries table
        $sql_summaries = "CREATE TABLE IF NOT EXISTS {$this->table_prefix}blog_summaries (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            post_id bigint(20) NOT NULL,
            takeaways JSON,
            min_read_list JSON,
            generation_date datetime DEFAULT CURRENT_TIMESTAMP,
            last_updated datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            cache_expiry datetime,
            status enum('draft', 'published', 'archived') DEFAULT 'draft',
            PRIMARY KEY (id),
            UNIQUE KEY post_id (post_id),
            KEY status (status),
            KEY cache_expiry (cache_expiry)
        ) $charset_collate;";

        // API tokens and settings table
        $sql_settings = "CREATE TABLE IF NOT EXISTS {$this->table_prefix}api_tokens (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            api_key varchar(255) NOT NULL,
            selected_model varchar(100) NOT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) $charset_collate;";

        // Execute table creation
        $this->wpdb->query($sql_summaries);
        $this->wpdb->query($sql_settings);
    }

    /**
     * Save or update blog summary
     *
     * @param int $post_id The post ID
     * @param string $summary The summary text
     * @param array $takeaways The takeaways array
     * @param string $ai_model The AI model used
     * @return bool|WP_Error Success status or error
     */
    public function save_summary($post_id, $summary, $takeaways = [], $ai_model = '') {
        if (!$post_id || !$summary) {
            return new WP_Error('invalid_data', 'Invalid post ID or summary');
        }

        $table_name = $this->table_prefix . 'blog_summaries';
        
        // Check if summary already exists
        $existing = $this->wpdb->get_row(
            $this->wpdb->prepare(
                "SELECT id FROM {$table_name} WHERE post_id = %d",
                $post_id
            )
        );

        $data = [
            'post_id' => $post_id,
            'summary' => $summary,
            'takeaways' => json_encode($takeaways),
            'ai_model' => $ai_model,
            'last_updated' => current_time('mysql'),
            'cache_expiry' => $this->calculate_cache_expiry(),
        ];

        if ($existing) {
            // Update existing summary
            $result = $this->wpdb->update(
                $table_name,
                $data,
                ['post_id' => $post_id],
                ['%d', '%s', '%s', '%s', '%s', '%s'],
                ['%d']
            );
        } else {
            // Insert new summary
            $data['generation_date'] = current_time('mysql');
            $data['status'] = 'published';
            
            $result = $this->wpdb->insert(
                $table_name,
                $data,
                ['%d', '%s', '%s', '%s', '%s', '%s', '%s', '%s']
            );
        }

        if ($result === false) {
            return new WP_Error('database_error', 'Failed to save summary to database');
        }

        // Log the operation
        $this->log_generation($post_id, 'generate', 'success', $ai_model);

        return true;
    }

    /**
     * Get summary for a specific post
     *
     * @param int $post_id The post ID
     * @param bool $check_cache Whether to check cache expiry
     * @return array|false Summary data or false if not found
     */
    public function get_summary($post_id, $check_cache = true) {
        if (!$post_id) {
            return false;
        }

        $table_name = $this->table_prefix . 'blog_summaries';
        
        $query = $this->wpdb->prepare(
            "SELECT * FROM {$table_name} WHERE post_id = %d",
            $post_id
        );

        if ($check_cache) {
            $query .= " AND (cache_expiry IS NULL OR cache_expiry > NOW())";
        }

        $result = $this->wpdb->get_row($query, ARRAY_A);

        if ($result) {
            $result['takeaways'] = json_decode($result['takeaways'], true);
            return $result;
        }

        return false;
    }

    /**
     * Get all summaries with optional filters
     *
     * @param array $args Query arguments
     * @return array Array of summaries
     */
    public function get_summaries($args = []) {
        $defaults = [
            'status' => 'published',
            'limit' => 20,
            'offset' => 0,
            'orderby' => 'generation_date',
            'order' => 'DESC',
        ];

        $args = wp_parse_args($args, $defaults);
        $table_name = $this->table_prefix . 'blog_summaries';

        $where_clauses = [];
        $where_values = [];

        if (!empty($args['status'])) {
            $where_clauses[] = 'status = %s';
            $where_values[] = $args['status'];
        }

        $where_sql = '';
        if (!empty($where_clauses)) {
            $where_sql = 'WHERE ' . implode(' AND ', $where_clauses);
        }

        $order_sql = "ORDER BY {$args['orderby']} {$args['order']}";
        $limit_sql = "LIMIT {$args['offset']}, {$args['limit']}";

        $query = "SELECT * FROM {$table_name} {$where_sql} {$order_sql} {$limit_sql}";

        if (!empty($where_values)) {
            $query = $this->wpdb->prepare($query, $where_values);
        }

        $results = $this->wpdb->get_results($query, ARRAY_A);

        // Decode takeaways JSON
        foreach ($results as &$result) {
            $result['takeaways'] = json_decode($result['takeaways'], true);
        }

        return $results;
    }

    /**
     * Delete summary for a specific post
     *
     * @param int $post_id The post ID
     * @return bool Success status
     */
    public function delete_summary($post_id) {
        if (!$post_id) {
            return false;
        }

        $table_name = $this->table_prefix . 'blog_summaries';
        
        $result = $this->wpdb->delete(
            $table_name,
            ['post_id' => $post_id],
            ['%d']
        );

        return $result !== false;
    }

    /**
     * Bulk delete summaries
     *
     * @param array $post_ids Array of post IDs
     * @return int Number of deleted summaries
     */
    public function bulk_delete_summaries($post_ids) {
        if (empty($post_ids) || !is_array($post_ids)) {
            return 0;
        }

        $table_name = $this->table_prefix . 'blog_summaries';
        
        $post_ids = array_map('intval', $post_ids);
        $post_ids_placeholders = implode(',', array_fill(0, count($post_ids), '%d'));
        
        $query = $this->wpdb->prepare(
            "DELETE FROM {$table_name} WHERE post_id IN ({$post_ids_placeholders})",
            $post_ids
        );

        $result = $this->wpdb->query($query);
        
        return $result !== false ? $result : 0;
    }

    /**
     * Get summary statistics
     *
     * @return array Statistics data
     */
    public function get_statistics() {
        $table_name = $this->table_prefix . 'blog_summaries';
        
        $stats = [
            'total_summaries' => 0,
            'published_summaries' => 0,
            'draft_summaries' => 0,
            'archived_summaries' => 0,
            'recent_generations' => 0,
            'cache_expired' => 0,
        ];

        // Total summaries
        $stats['total_summaries'] = $this->wpdb->get_var("SELECT COUNT(*) FROM {$table_name}");

        // Status counts
        $status_counts = $this->wpdb->get_results(
            "SELECT status, COUNT(*) as count FROM {$table_name} GROUP BY status",
            ARRAY_A
        );

        foreach ($status_counts as $status_count) {
            $key = $status_count['status'] . '_summaries';
            if (isset($stats[$key])) {
                $stats[$key] = $status_count['count'];
            }
        }

        // Recent generations (last 7 days)
        $stats['recent_generations'] = $this->wpdb->get_var(
            "SELECT COUNT(*) FROM {$table_name} WHERE generation_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)"
        );

        // Expired cache
        $stats['cache_expired'] = $this->wpdb->get_var(
            "SELECT COUNT(*) FROM {$table_name} WHERE cache_expiry < NOW()"
        );

        return $stats;
    }

    /**
     * Clean expired cache entries
     *
     * @return int Number of cleaned entries
     */
    public function clean_expired_cache() {
        $table_name = $this->table_prefix . 'blog_summaries';
        
        $result = $this->wpdb->query(
            "DELETE FROM {$table_name} WHERE cache_expiry < NOW()"
        );

        return $result !== false ? $result : 0;
    }

    /**
     * Log generation operation
     *
     * @param int $post_id The post ID
     * @param string $operation_type The operation type
     * @param string $status The operation status
     * @param string $ai_model The AI model used
     * @param int $tokens_used Number of tokens used
     * @param float $processing_time Processing time in seconds
     * @param string $error_message Error message if failed
     * @return bool Success status
     */
    public function log_generation($post_id, $operation_type, $status, $ai_model = '', $tokens_used = 0, $processing_time = 0, $error_message = '') {
        $table_name = $this->table_prefix . 'summary_generation_logs';
        
        $data = [
            'post_id' => $post_id,
            'operation_type' => $operation_type,
            'status' => $status,
            'ai_model' => $ai_model,
            'tokens_used' => $tokens_used,
            'processing_time' => $processing_time,
            'error_message' => $error_message,
        ];

        $result = $this->wpdb->insert(
            $table_name,
            $data,
            ['%d', '%s', '%s', '%s', '%d', '%f', '%s']
        );

        return $result !== false;
    }

    /**
     * Get generation logs
     *
     * @param array $args Query arguments
     * @return array Array of logs
     */
    public function get_generation_logs($args = []) {
        $defaults = [
            'post_id' => 0,
            'status' => '',
            'operation_type' => '',
            'limit' => 50,
            'offset' => 0,
            'orderby' => 'created_at',
            'order' => 'DESC',
        ];

        $args = wp_parse_args($args, $defaults);
        $table_name = $this->table_prefix . 'summary_generation_logs';

        $where_clauses = [];
        $where_values = [];

        if (!empty($args['post_id'])) {
            $where_clauses[] = 'post_id = %d';
            $where_values[] = $args['post_id'];
        }

        if (!empty($args['status'])) {
            $where_clauses[] = 'status = %s';
            $where_values[] = $args['status'];
        }

        if (!empty($args['operation_type'])) {
            $where_clauses[] = 'operation_type = %s';
            $where_values[] = $args['operation_type'];
        }

        $where_sql = '';
        if (!empty($where_clauses)) {
            $where_sql = 'WHERE ' . implode(' AND ', $where_clauses);
        }

        $order_sql = "ORDER BY {$args['orderby']} {$args['order']}";
        $limit_sql = "LIMIT {$args['offset']}, {$args['limit']}";

        $query = "SELECT * FROM {$table_name} {$where_sql} {$order_sql} {$limit_sql}";

        if (!empty($where_values)) {
            $query = $this->wpdb->prepare($query, $where_values);
        }

        return $this->wpdb->get_results($query, ARRAY_A);
    }

    /**
     * Calculate cache expiry time
     *
     * @return string MySQL datetime string
     */
    private function calculate_cache_expiry() {
        $settings = get_option('blog_takeway_settings', []);
        $cache_duration = isset($settings['cache_duration']) ? $settings['cache_duration'] : 86400; // 24 hours default
        
        return date('Y-m-d H:i:s', time() + $cache_duration);
    }

    /**
     * Test database connectivity
     *
     * @return bool Connection status
     */
    public function test_connection() {
        $test_query = $this->wpdb->get_var("SELECT 1");
        return $test_query === '1';
    }

    /**
     * Get table information
     *
     * @return array Table information
     */
    public function get_table_info() {
        $tables = [
            'blog_summaries' => $this->table_prefix . 'blog_summaries',
            'api_tokens' => $this->table_prefix . 'api_tokens',
        ];

        $info = [];
        foreach ($tables as $table_name => $full_table_name) {
            $info[$table_name] = [
                'exists' => $this->wpdb->get_var("SHOW TABLES LIKE '{$full_table_name}'") === $full_table_name,
                'rows' => $this->wpdb->get_var("SELECT COUNT(*) FROM {$full_table_name}") ?? 0,
            ];
        }

        return $info;
    }

    /**
     * Save API token and selected model
     */
    public function save_api_settings($api_key, $selected_model) {
        $table_name = $this->table_prefix . 'api_tokens';
        
        $existing = $this->wpdb->get_row("SELECT id FROM {$table_name} LIMIT 1");
        
        $data = [
            'api_key' => $api_key,
            'selected_model' => $selected_model,
            'updated_at' => current_time('mysql'),
        ];
        
        if ($existing) {
            $result = $this->wpdb->update(
                $table_name,
                $data,
                ['id' => $existing->id],
                ['%s', '%s', '%s'],
                ['%d']
            );
        } else {
            $data['created_at'] = current_time('mysql');
            $result = $this->wpdb->insert(
                $table_name,
                $data,
                ['%s', '%s', '%s', '%s']
            );
        }
        
        return $result !== false;
    }

    /**
     * Get API settings
     */
    public function get_api_settings() {
        $table_name = $this->table_prefix . 'api_tokens';
        return $this->wpdb->get_row("SELECT * FROM {$table_name} ORDER BY id DESC LIMIT 1", ARRAY_A);
    }

    /**
     * Save blog summary with proper JSON structure
     */
    public function save_blog_summary($post_id, $takeaways = [], $min_read_list = []) {
        if (!$post_id) {
            return new WP_Error('invalid_data', 'Invalid post ID');
        }

        $table_name = $this->table_prefix . 'blog_summaries';
        
        $existing = $this->wpdb->get_row(
            $this->wpdb->prepare(
                "SELECT id FROM {$table_name} WHERE post_id = %d",
                $post_id
            )
        );

        $data = [
            'post_id' => $post_id,
            'takeaways' => json_encode($takeaways),
            'min_read_list' => json_encode($min_read_list),
            'last_updated' => current_time('mysql'),
        ];

        if ($existing) {
            $result = $this->wpdb->update(
                $table_name,
                $data,
                ['post_id' => $post_id],
                ['%d', '%s', '%s', '%s'],
                ['%d']
            );
        } else {
            $data['generation_date'] = current_time('mysql');
            $data['status'] = 'published';
            
            $result = $this->wpdb->insert(
                $table_name,
                $data,
                ['%d', '%s', '%s', '%s', '%s', '%s']
            );
        }

        return $result !== false ? true : new WP_Error('database_error', 'Failed to save summary');
    }
}
