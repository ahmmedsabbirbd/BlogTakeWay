<?php
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Database handling class for Promo Bar X
 *
 * @category WordPress
 * @package  PromoBarX
 * @author   WPPOOL Team <support@wppool.com>
 * @license  GPL-2.0+ https://www.gnu.org/licenses/gpl-2.0.html
 */

class PromoBarX_Database {

    private $wpdb;
    private $table_prefix;

    /**
     * Initialize the database class
     */
    public function __construct() {
        $this->create_tables();
    }

    /**
     * Create required database tables
     */
    public function create_tables() {
        global $wpdb;
        $this->wpdb = $wpdb;
        $this->table_prefix = $this->wpdb->prefix;
        $charset_collate = $this->wpdb->get_charset_collate();

        // Main top bars table
        $sql_promo_bars = "CREATE TABLE IF NOT EXISTS {$this->table_prefix}promo_bars (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            name varchar(255) NOT NULL,
            title varchar(500),
            subtitle varchar(500),
            cta_text varchar(255),
            cta_url varchar(500),
            cta_style JSON,
            countdown_enabled tinyint(1) DEFAULT 0,
            countdown_date datetime,
            countdown_style JSON,
            close_button_enabled tinyint(1) DEFAULT 1,
            close_button_style JSON,
            styling JSON,
            template_id bigint(20) DEFAULT 0,
            status enum('draft', 'active', 'paused', 'archived') DEFAULT 'draft',
            priority int(11) DEFAULT 0,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            created_by bigint(20),
            PRIMARY KEY (id),
            KEY status (status),
            KEY priority (priority),
            KEY template_id (template_id)
        ) $charset_collate;";

        // Templates table
        $sql_templates = "CREATE TABLE IF NOT EXISTS {$this->table_prefix}promo_bar_templates (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            name varchar(255) NOT NULL,
            description text,
            category varchar(100),
            preview_image varchar(500),
            config JSON,
            is_default tinyint(1) DEFAULT 0,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY category (category),
            KEY is_default (is_default)
        ) $charset_collate;";

        // Scheduling table
        $sql_schedules = "CREATE TABLE IF NOT EXISTS {$this->table_prefix}promo_bar_schedules (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            promo_bar_id bigint(20) NOT NULL,
            start_date datetime,
            end_date datetime,
            timezone varchar(50) DEFAULT 'UTC',
            days_of_week JSON,
            start_time time,
            end_time time,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY promo_bar_id (promo_bar_id),
            KEY start_date (start_date),
            KEY end_date (end_date),
            FOREIGN KEY (promo_bar_id) REFERENCES {$this->table_prefix}promo_bars(id) ON DELETE CASCADE
        ) $charset_collate;";

        // Page assignments table
        $sql_assignments = "CREATE TABLE IF NOT EXISTS {$this->table_prefix}promo_bar_assignments (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            promo_bar_id bigint(20) NOT NULL,
            assignment_type enum('global', 'page', 'post_type', 'category', 'tag', 'custom') NOT NULL,
            target_id bigint(20),
            target_value varchar(255),
            priority int(11) DEFAULT 0,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY promo_bar_id (promo_bar_id),
            KEY assignment_type (assignment_type),
            KEY target_id (target_id),
            FOREIGN KEY (promo_bar_id) REFERENCES {$this->table_prefix}promo_bars(id) ON DELETE CASCADE
        ) $charset_collate;";

        // Analytics table
        $sql_analytics = "CREATE TABLE IF NOT EXISTS {$this->table_prefix}promo_bar_analytics (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            promo_bar_id bigint(20) NOT NULL,
            event_type enum('impression', 'click', 'close', 'conversion') NOT NULL,
            page_url varchar(500),
            user_agent text,
            ip_address varchar(45),
            user_id bigint(20),
            session_id varchar(100),
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY promo_bar_id (promo_bar_id),
            KEY event_type (event_type),
            KEY created_at (created_at),
            KEY user_id (user_id),
            FOREIGN KEY (promo_bar_id) REFERENCES {$this->table_prefix}promo_bars(id) ON DELETE CASCADE
        ) $charset_collate;";

        // Execute table creation
        $this->wpdb->query($sql_promo_bars);
        $this->wpdb->query($sql_templates);
        $this->wpdb->query($sql_schedules);
        $this->wpdb->query($sql_assignments);
        $this->wpdb->query($sql_analytics);

        // Insert default templates
        $this->insert_default_templates();
    }

    /**
     * Insert default templates
     */
    private function insert_default_templates() {
        $default_templates = [
            [
                'name' => 'Minimal Modern',
                'description' => 'Clean and modern design with subtle styling',
                'category' => 'minimal',
                'config' => json_encode([
                    'background' => '#ffffff',
                    'text_color' => '#333333',
                    'accent_color' => '#4F46E5',
                    'font_family' => 'Inter, sans-serif',
                    'padding' => '12px 20px',
                    'border_bottom' => '1px solid #e5e7eb'
                ])
            ],
            [
                'name' => 'Bold Attention',
                'description' => 'High-contrast design to grab attention',
                'category' => 'bold',
                'config' => json_encode([
                    'background' => '#dc2626',
                    'text_color' => '#ffffff',
                    'accent_color' => '#fbbf24',
                    'font_family' => 'Inter, sans-serif',
                    'padding' => '16px 24px',
                    'font_weight' => '600'
                ])
            ],
            [
                'name' => 'Sale Banner',
                'description' => 'Perfect for flash sales and promotions',
                'category' => 'ecommerce',
                'config' => json_encode([
                    'background' => 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    'text_color' => '#ffffff',
                    'accent_color' => '#fbbf24',
                    'font_family' => 'Inter, sans-serif',
                    'padding' => '14px 20px',
                    'animation' => 'pulse'
                ])
            ]
        ];

        foreach ($default_templates as $template) {
            $exists = $this->wpdb->get_var(
                $this->wpdb->prepare(
                    "SELECT id FROM {$this->table_prefix}promo_bar_templates WHERE name = %s",
                    $template['name']
                )
            );

            if (!$exists) {
                $this->wpdb->insert(
                    $this->table_prefix . 'promo_bar_templates',
                    $template
                );
            }
        }
    }

    /**
     * Get all promo bars
     */
    public function get_promo_bars($args = []) {
        $defaults = [
            'status' => 'active',
            'limit' => -1,
            'orderby' => 'priority DESC, created_at DESC'
        ];

        $args = wp_parse_args($args, $defaults);
        $where = [];
        $values = [];

        if ($args['status'] !== 'all') {
            $where[] = 'status = %s';
            $values[] = $args['status'];
        }

        $where_clause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';
        $limit_clause = $args['limit'] > 0 ? 'LIMIT ' . intval($args['limit']) : '';

        $sql = "SELECT * FROM {$this->table_prefix}promo_bars {$where_clause} ORDER BY {$args['orderby']} {$limit_clause}";

        if (!empty($values)) {
            $sql = $this->wpdb->prepare($sql, $values);
        }

        return $this->wpdb->get_results($sql);
    }

    /**
     * Get promo bar by ID
     */
    public function get_promo_bar($id) {
        return $this->wpdb->get_row(
            $this->wpdb->prepare(
                "SELECT * FROM {$this->table_prefix}promo_bars WHERE id = %d",
                $id
            )
        );
    }

    /**
     * Create or update promo bar
     */
    public function save_promo_bar($data) {
        $defaults = [
            'name' => '',
            'title' => '',
            'subtitle' => '',
            'cta_text' => '',
            'cta_url' => '',
            'cta_style' => json_encode([]),
            'countdown_enabled' => 0,
            'countdown_date' => null,
            'countdown_style' => json_encode([]),
            'close_button_enabled' => 1,
            'close_button_style' => json_encode([]),
            'styling' => json_encode([]),
            'template_id' => 0,
            'status' => 'draft',
            'priority' => 0,
            'created_by' => get_current_user_id()
        ];

        $data = wp_parse_args($data, $defaults);

        if (isset($data['id'])) {
            // Update existing
            $id = $data['id'];
            unset($data['id']);
            $data['updated_at'] = current_time('mysql');
            
            $result = $this->wpdb->update(
                $this->table_prefix . 'promo_bars',
                $data,
                ['id' => $id]
            );
            
            return $result !== false ? $id : false;
        } else {
            // Create new
            $data['created_at'] = current_time('mysql');
            $data['updated_at'] = current_time('mysql');
            
            $result = $this->wpdb->insert(
                $this->table_prefix . 'promo_bars',
                $data
            );
            
            return $result ? $this->wpdb->insert_id : false;
        }
    }

    /**
     * Delete promo bar
     */
    public function delete_promo_bar($id) {
        return $this->wpdb->delete(
            $this->table_prefix . 'promo_bars',
            ['id' => $id],
            ['%d']
        );
    }

    /**
     * Get templates
     */
    public function get_templates($category = '') {
        $where = '';
        $values = [];

        if ($category) {
            $where = 'WHERE category = %s';
            $values = [$category];
        }

        $sql = "SELECT * FROM {$this->table_prefix}promo_bar_templates {$where} ORDER BY name ASC";
        
        if (!empty($values)) {
            $sql = $this->wpdb->prepare($sql, $values);
        }

        return $this->wpdb->get_results($sql);
    }

    /**
     * Track analytics event
     */
    public function track_event($promo_bar_id, $event_type, $data = []) {
        $event_data = [
            'promo_bar_id' => $promo_bar_id,
            'event_type' => $event_type,
            'page_url' => isset($data['page_url']) ? $data['page_url'] : '',
            'user_agent' => isset($data['user_agent']) ? $data['user_agent'] : '',
            'ip_address' => isset($data['ip_address']) ? $data['ip_address'] : '',
            'user_id' => isset($data['user_id']) ? $data['user_id'] : get_current_user_id(),
            'session_id' => isset($data['session_id']) ? $data['session_id'] : session_id()
        ];

        return $this->wpdb->insert(
            $this->table_prefix . 'promo_bar_analytics',
            $event_data
        );
    }

    /**
     * Get analytics for a promo bar
     */
    public function get_analytics($promo_bar_id, $days = 30) {
        $sql = $this->wpdb->prepare(
            "SELECT 
                event_type,
                COUNT(*) as count,
                DATE(created_at) as date
            FROM {$this->table_prefix}promo_bar_analytics 
            WHERE promo_bar_id = %d 
            AND created_at >= DATE_SUB(NOW(), INTERVAL %d DAY)
            GROUP BY event_type, DATE(created_at)
            ORDER BY date DESC, event_type",
            $promo_bar_id,
            $days
        );

        return $this->wpdb->get_results($sql);
    }
}
