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
        global $wpdb;
        $this->wpdb = $wpdb;
        $this->table_prefix = $this->wpdb->prefix;
        $this->create_tables();
        $this->migrate_assignment_schema();
    }

    /**
     * Test database connectivity and table existence
     */
    public function test_database_connection() {
        error_log('PromoBarX Database: Testing database connection');
        
        // Test basic connectivity
        $test_query = $this->wpdb->get_var("SELECT 1");
        if ($test_query !== '1') {
            error_log('PromoBarX Database: Basic connectivity test failed');
            return false;
        }
        
        // Test if promo_bars table exists
        $table_exists = $this->wpdb->get_var(
            $this->wpdb->prepare(
                "SHOW TABLES LIKE %s",
                $this->table_prefix . 'promo_bars'
            )
        );
        
        if (!$table_exists) {
            error_log('PromoBarX Database: promo_bars table does not exist');
            return false;
        }
        
        // Test table structure
        $columns = $this->wpdb->get_results(
            "DESCRIBE {$this->table_prefix}promo_bars"
        );
        
        if (empty($columns)) {
            error_log('PromoBarX Database: Could not get table structure');
            return false;
        }
        
        error_log('PromoBarX Database: Database connection test passed');
        return true;
    }

    /**
     * Create required database tables
     */
    public function create_tables() {
        $charset_collate = $this->wpdb->get_charset_collate();
        
        error_log('PromoBarX Database: Creating tables with prefix: ' . $this->table_prefix);

        // Main top bars table
        $sql_promo_bars = "CREATE TABLE IF NOT EXISTS {$this->table_prefix}promo_bars (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            name varchar(255) NOT NULL,
            title varchar(500),
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
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            created_by bigint(20),
            PRIMARY KEY (id),
            KEY status (status),
            KEY template_id (template_id)
        ) $charset_collate;";

        error_log('PromoBarX Database: Creating promo_bars table');
        $result = $this->wpdb->query($sql_promo_bars);
        error_log('PromoBarX Database: promo_bars table creation result: ' . $result);
        error_log('PromoBarX Database: Last SQL error: ' . $this->wpdb->last_error);

        // Assignments table for multiple assignments per promo bar
        $sql_assignments = "CREATE TABLE IF NOT EXISTS {$this->table_prefix}promo_bar_assignments (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            promo_bar_id bigint(20) NOT NULL,
            assignment_type enum('global', 'page', 'post_type', 'category', 'tag', 'custom') NOT NULL,
            target_id bigint(20) DEFAULT 0,
            target_value varchar(255) DEFAULT '',
            priority int(11) DEFAULT 0,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY promo_bar_id (promo_bar_id),
            KEY assignment_type (assignment_type),
            KEY target_id (target_id),
            KEY priority (priority)
        ) $charset_collate;";

        error_log('PromoBarX Database: Creating promo_bar_assignments table');
        $result = $this->wpdb->query($sql_assignments);
        error_log('PromoBarX Database: promo_bar_assignments table creation result: ' . $result);
        error_log('PromoBarX Database: Last SQL error: ' . $this->wpdb->last_error);

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

        error_log('PromoBarX Database: Creating promo_bar_assignments table');
        $result = $this->wpdb->query($sql_templates);
        error_log('PromoBarX Database: promo_bar_assignments table creation result: ' . $result);
        error_log('PromoBarX Database: Last SQL error: ' . $this->wpdb->last_error);

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

        
        error_log('PromoBarX Database: Creating promo_bar_assignments table');
        $result = $this->wpdb->query($sql_schedules);
        error_log('PromoBarX Database: promo_bar_assignments table creation result: ' . $result);
        error_log('PromoBarX Database: Last SQL error: ' . $this->wpdb->last_error);

        // Analytics table
        $sql_analytics = "CREATE TABLE IF NOT EXISTS {$this->table_prefix}promo_bar_analytics (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            promo_bar_id bigint(20) NOT NULL,
            event_type enum('impression', 'click', 'close', 'cta_click') NOT NULL,
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
            FOREIGN KEY (promo_bar_id) REFERENCES {$this->table_prefix}promo_bars(id) ON DELETE CASCADE
        ) $charset_collate;";

        error_log('PromoBarX Database: Creating analytics table');
        $result = $this->wpdb->query($sql_analytics);
        error_log('PromoBarX Database: analytics table creation result: ' . $result);
        error_log('PromoBarX Database: Last SQL error: ' . $this->wpdb->last_error);

        // Create default templates
        $this->insert_default_templates();
        
        // Create default promo bar
        $this->insert_default_promo_bar();
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
     * Insert default promo bar
     */
    private function insert_default_promo_bar() {
        // Check if default promo bar already exists
        $exists = $this->wpdb->get_var(
            $this->wpdb->prepare(
                "SELECT id FROM {$this->table_prefix}promo_bars WHERE name = %s",
                'Welcome Promo Bar'
            )
        );

        if (!$exists) {
            $default_promo_bar = [
                'name' => 'Welcome Promo Bar',
                'title' => '🎉 Welcome to ' . get_bloginfo('name') . '!',
                'cta_text' => 'Explore Now',
                'cta_url' => home_url('/'),
                'cta_style' => json_encode([
                    'background' => '#ffffff',
                    'color' => '#3b82f6',
                    'padding' => '8px 16px',
                    'border_radius' => '4px',
                    'font_weight' => '500'
                ]),
                'countdown_enabled' => 0,
                'countdown_date' => null,
                'countdown_style' => json_encode([
                    'color' => '#dc2626',
                    'font_weight' => '600',
                    'font_family' => 'monospace'
                ]),
                'close_button_enabled' => 1,
                'close_button_style' => json_encode([
                    'color' => '#6b7280',
                    'font_size' => '20px',
                    'padding' => '4px 8px'
                ]),
                'styling' => json_encode([
                    'background' => '#3b82f6',
                    'color' => '#ffffff',
                    'font_family' => 'Inter, sans-serif',
                    'font_size' => '14px',
                    'padding' => '12px 20px',
                    'position' => 'top'
                ]),
                'template_id' => 0,
                'status' => 'active',
                'created_by' => get_current_user_id(),
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql')
            ];

            $result = $this->wpdb->insert(
                $this->table_prefix . 'promo_bars',
                $default_promo_bar
            );

            if ($result) {
                $promo_bar_id = $this->wpdb->insert_id;
                
            
                
                error_log('PromoBarX: Default promo bar created with ID: ' . $promo_bar_id);
            } else {
                error_log('PromoBarX: Failed to create default promo bar');
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
            'orderby' => 'created_at DESC'
        ];

        $args = wp_parse_args($args, $defaults);
        $where = [];
        $values = [];

        if ($args['status'] !== 'all') {
            $where[] = 'pb.status = %s';
            $values[] = $args['status'];
        }

        $where_clause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';
        $limit_clause = $args['limit'] > 0 ? 'LIMIT ' . intval($args['limit']) : '';

        // Use LEFT JOIN to get priority from assignments table
        $sql = "SELECT pb.*, 
                       COALESCE(MAX(pa.priority), 0) as max_priority
                FROM {$this->table_prefix}promo_bars pb
                LEFT JOIN {$this->table_prefix}promo_bar_assignments pa ON pb.id = pa.promo_bar_id
                {$where_clause}
                GROUP BY pb.id
                ORDER BY max_priority DESC, pb.created_at DESC {$limit_clause}";

        if (!empty($values)) {
            $sql = $this->wpdb->prepare($sql, $values);
        }

        return $this->wpdb->get_results($sql);
    }

    /**
     * Get promo bar by ID
     */
    public function get_promo_bar($id) {
        error_log('PromoBarX Database: Getting promo bar with ID: ' . $id);
        
        $sql = $this->wpdb->prepare(
            "SELECT * FROM {$this->table_prefix}promo_bars WHERE id = %d",
            $id
        );
        
        error_log('PromoBarX Database: SQL query: ' . $sql);
        
        $result = $this->wpdb->get_row($sql);
        
        error_log('PromoBarX Database: Query result: ' . print_r($result, true));
        error_log('PromoBarX Database: Last SQL error: ' . $this->wpdb->last_error);
        
        if ($result) {
            // Get assignments for this promo bar
            $assignments = $this->get_assignments($id);
            
            // Convert assignments to array format for frontend
            $assignments_array = [];
            foreach ($assignments as $assignment) {
                $assignments_array[] = [
                    'id' => $assignment->id,
                    'assignment_type' => $assignment->assignment_type,
                    'target_id' => $assignment->target_id,
                    'target_value' => $assignment->target_value,
                    'priority' => $assignment->priority
                ];
            }
            
            // Add assignments to the result
            $result->assignments = $assignments_array;
            
            error_log('PromoBarX Database: Added assignments to result: ' . print_r($assignments_array, true));
        }
        
        return $result;
    }

    /**
     * Update promo bar
     */
    public function update_promo_bar($id, $data) {
        error_log('PromoBarX Database: Updating promo bar with ID: ' . $id);
        error_log('PromoBarX Database: Update data: ' . print_r($data, true));
        
        $data['updated_at'] = current_time('mysql');
        
        $result = $this->wpdb->update(
            $this->table_prefix . 'promo_bars',
            $data,
            ['id' => $id],
            null,
            ['%d']
        );
        
        error_log('PromoBarX Database: Update result: ' . print_r($result, true));
        error_log('PromoBarX Database: Last SQL error: ' . $this->wpdb->last_error);
        
        return $result !== false;
    }

    /**
     * Create or update promo bar
     */
    public function save_promo_bar($data) {
        error_log('PromoBarX Database: Save method called with data: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' . print_r($data, true));
        
        // Test database connection first
        if (!$this->test_database_connection()) {
            error_log('PromoBarX Database: Database connection test failed');
            return false;
        }
        
        // Extract assignments data before sanitization
        $assignments_data = [];
        if (isset($data['assignments'])) {
            error_log('PromoBarX Database: Assignments field type: ' . gettype($data['assignments']));
            error_log('PromoBarX Database: Assignments field content: ' . print_r($data['assignments'], true));
            
            if (is_array($data['assignments'])) {
                error_log('PromoBarX Database: Assignments is array, using directly');
                $assignments_data = $data['assignments'];
            } elseif (is_string($data['assignments'])) {
                error_log('PromoBarX Database: Assignments is string, attempting JSON decode');
                
                // First attempt: direct JSON decode
                $decoded = json_decode($data['assignments'], true);
                error_log('PromoBarX Database: First JSON decode result: ' . print_r($decoded, true));
                error_log('PromoBarX Database: First JSON last error: ' . json_last_error_msg());
                
                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                    error_log('PromoBarX Database: First JSON decode successful, using decoded data');
                    $assignments_data = $decoded;
                } else {
                    // Second attempt: try with stripslashes (in case of double encoding)
                    error_log('PromoBarX Database: First decode failed, trying with stripslashes');
                    $stripped = stripslashes($data['assignments']);
                    error_log('PromoBarX Database: Stripped string: ' . $stripped);
                    
                    $decoded = json_decode($stripped, true);
                    error_log('PromoBarX Database: Second JSON decode result: ' . print_r($decoded, true));
                    error_log('PromoBarX Database: Second JSON last error: ' . json_last_error_msg());
                    
                    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                        error_log('PromoBarX Database: Second JSON decode successful, using decoded data');
                        $assignments_data = $decoded;
                    } else {
                        error_log('PromoBarX Database: Both JSON decode attempts failed');
                    }
                }
            } else {
                error_log('PromoBarX Database: Assignments is neither array nor string, type: ' . gettype($data['assignments']));
            }
        } else {
            error_log('PromoBarX Database: Assignments field not set in data');
        }

        error_log('PromoBarX Database: Final assignments_data: ' . print_r($assignments_data, true));
        
        // Remove assignments from main data to avoid conflicts
        unset($data['assignments']);
        
        // Validate and sanitize input data
        $sanitized_data = $this->sanitize_promo_bar_data($data);
        if (is_wp_error($sanitized_data)) {
            error_log('PromoBarX Database: Data validation failed: ' . $sanitized_data->get_error_message());
            return false;
        }
        
        $defaults = [
            'name' => '',
            'title' => '',
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
            'created_by' => get_current_user_id()
        ];

        $data = wp_parse_args($sanitized_data, $defaults);
        error_log('PromoBarX Database: Parsed data: ' . print_r($data, true));

        // Ensure required fields are not empty
        if (empty($data['name'])) {
            error_log('PromoBarX Database: Name is required but empty');
            return false;
        }

        if (isset($data['id'])) {
            // Update existing
            $id = intval($data['id']);
            unset($data['id']);
            $data['updated_at'] = current_time('mysql');
            
            error_log('PromoBarX Database: Updating existing promo bar with ID: ' . $id);
            error_log('PromoBarX Database: Update data: ' . print_r($data, true));
            
            // Check if promo bar exists
            $existing = $this->get_promo_bar($id);
            if (!$existing) {
                error_log('PromoBarX Database: Promo bar with ID ' . $id . ' does not exist');
                return false;
            }
            
            $result = $this->wpdb->update(
                $this->table_prefix . 'promo_bars',
                $data,
                ['id' => $id]
            );
            
            error_log('PromoBarX Database: Update result: ' . print_r($result, true));
            error_log('PromoBarX Database: Last SQL error: ' . $this->wpdb->last_error);
            
            if ($result === false) {
                error_log('PromoBarX Database: Update failed with error: ' . $this->wpdb->last_error);
                return false;
            }

           
            
            // Update assignments if provided
            if (!empty($assignments_data)) {
                error_log('PromoBarX Database: Updating assignments for promo bar ID: ' . $id);
                $assignment_result = $this->save_assignments($id, $assignments_data);
                if (!$assignment_result) {
                    error_log('PromoBarX Database: Failed to update assignments');
                }
            }
            
            return $id;
        } else {
            // Create new
            $data['created_at'] = current_time('mysql');
            $data['updated_at'] = current_time('mysql');
            
            error_log('PromoBarX Database: Creating new promo bar');
            error_log('PromoBarX Database: Insert data: ' . print_r($data, true));
            
            $result = $this->wpdb->insert(
                $this->table_prefix . 'promo_bars',
                $data
            );
            
            error_log('PromoBarX Database: Insert result: ' . print_r($result, true));
            error_log('PromoBarX Database: Insert ID: ' . $this->wpdb->insert_id);
            error_log('PromoBarX Database: Last SQL error: ' . $this->wpdb->last_error);
            
            if ($result === false) {
                error_log('PromoBarX Database: Insert failed with error: ' . $this->wpdb->last_error);
                return false;
            }
            
            $new_promo_bar_id = $this->wpdb->insert_id;
            
            // Create assignments for new promo bar
            if (!empty($assignments_data)) {
                error_log('PromoBarX Database: Creating assignments for new promo bar ID: ' . $new_promo_bar_id);
                error_log('PromoBarX Database: Assignments data: ' . print_r($assignments_data, true));
                $assignment_result = $this->save_assignments($new_promo_bar_id, $assignments_data);
                
                if ($assignment_result) {
                    error_log('PromoBarX Database: Assignments created successfully');
                } else {
                    error_log('PromoBarX Database: Failed to create assignments');
                }
            } else {
                // Create default assignment if no assignments provided
                $default_assignment = [
                    'assignment_type' => 'global',
                    'target_id' => 0,
                    'target_value' => 'All Pages',
                    'priority' => 0
                ];
                
                error_log('PromoBarX Database: Creating default assignment for new promo bar ID: ' . $new_promo_bar_id);
                $assignment_result = $this->save_assignments($new_promo_bar_id, [$default_assignment]);
                
                if ($assignment_result) {
                    error_log('PromoBarX Database: Default assignment created successfully');
                } else {
                    error_log('PromoBarX Database: Failed to create default assignment');
                }
            }
            
            return $new_promo_bar_id;
        }
    }

    /**
     * Sanitize and validate promo bar data
     */
    private function sanitize_promo_bar_data($data) {
        $sanitized = [];
        
        // Sanitize basic text fields
        $text_fields = ['name', 'title', 'cta_text', 'cta_url'];
        foreach ($text_fields as $field) {
            if (isset($data[$field])) {
                $sanitized[$field] = sanitize_text_field($data[$field]);
            }
        }
        
        // Sanitize numeric fields
        $numeric_fields = ['template_id', 'created_by'];
        foreach ($numeric_fields as $field) {
            if (isset($data[$field])) {
                $sanitized[$field] = intval($data[$field]);
            }
        }
        
        // Sanitize boolean fields
        $boolean_fields = ['countdown_enabled', 'close_button_enabled'];
        foreach ($boolean_fields as $field) {
            if (isset($data[$field])) {
                $sanitized[$field] = $data[$field] ? 1 : 0;
            }
        }
        
        // Sanitize status field
        if (isset($data['status'])) {
            $allowed_statuses = ['draft', 'active', 'paused', 'archived'];
            $sanitized['status'] = in_array($data['status'], $allowed_statuses) ? $data['status'] : 'draft';
        }
        
        // Sanitize date fields
        if (isset($data['countdown_date']) && !empty($data['countdown_date'])) {
            $sanitized['countdown_date'] = sanitize_text_field($data['countdown_date']);
        }
        
        // Sanitize JSON fields
        $json_fields = ['cta_style', 'countdown_style', 'close_button_style', 'styling'];
        foreach ($json_fields as $field) {
            if (isset($data[$field])) {
                if (is_string($data[$field])) {
                    // If it's already a JSON string, validate it
                    $decoded = json_decode($data[$field], true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $sanitized[$field] = $data[$field];
                    } else {
                        error_log('PromoBarX Database: Invalid JSON in field ' . $field . ': ' . json_last_error_msg());
                        $sanitized[$field] = json_encode([]);
                    }
                } elseif (is_array($data[$field])) {
                    // If it's an array, encode it
                    $sanitized[$field] = json_encode($data[$field]);
                } else {
                    $sanitized[$field] = json_encode([]);
                }
            }
        }
        
        // Handle ID field for updates
        if (isset($data['id'])) {
            $sanitized['id'] = intval($data['id']);
        }
        
        return $sanitized;
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

    /**
     * Save assignments for a promo bar
     */
    public function save_assignments($promo_bar_id, $assignments) {
        error_log('PromoBarX Database: Saving assignments for promo bar ID: ' . $promo_bar_id);
        error_log('PromoBarX Database: Assignments data: ' . print_r($assignments, true));
      
        // First, delete existing assignments for this promo bar
        $delete_result = $this->delete_assignments($promo_bar_id);
        error_log('PromoBarX Database: Delete existing assignments result: ' . ($delete_result ? 'true' : 'false'));

        // If no assignments provided, we're done
        if (empty($assignments)) {
            error_log('PromoBarX Database: No assignments provided, returning true');
            return true;
        }

        // Insert new assignments
        $values = [];
        $placeholders = [];

        foreach ($assignments as $assignment) {
            $values[] = $promo_bar_id;
            $values[] = sanitize_text_field($assignment['assignment_type']);
            $values[] = isset($assignment['target_id']) ? intval($assignment['target_id']) : 0;
            $values[] = isset($assignment['target_value']) ? sanitize_text_field($assignment['target_value']) : '';
            $values[] = isset($assignment['priority']) ? intval($assignment['priority']) : 0;
            $values[] = current_time('mysql');
            $values[] = current_time('mysql');

            $placeholders[] = "(%d, %s, %d, %s, %d, %s, %s)";
        }

        $sql = "INSERT INTO {$this->table_prefix}promo_bar_assignments 
                (promo_bar_id, assignment_type, target_id, target_value, priority, created_at, updated_at) 
                VALUES " . implode(', ', $placeholders);

        error_log('PromoBarX Database: Insert SQL: ' . $sql);
        error_log('PromoBarX Database: Insert values: ' . print_r($values, true));

        // Try direct insert first
        $result = $this->wpdb->query($this->wpdb->prepare($sql, $values));
        
        error_log('PromoBarX Database: Insert result: ' . $result);
        error_log('PromoBarX Database: Last SQL error: ' . $this->wpdb->last_error);
        error_log('PromoBarX Database: Last SQL query: ' . $this->wpdb->last_query);

        if ($result === false) {
            error_log('PromoBarX Database: Insert failed, trying individual inserts');
            
            // Try individual inserts as fallback
            $success_count = 0;
            foreach ($assignments as $assignment) {
                $insert_data = [
                    'promo_bar_id' => $promo_bar_id,
                    'assignment_type' => sanitize_text_field($assignment['assignment_type']),
                    'target_id' => isset($assignment['target_id']) ? intval($assignment['target_id']) : 0,
                    'target_value' => isset($assignment['target_value']) ? sanitize_text_field($assignment['target_value']) : '',
                    'priority' => isset($assignment['priority']) ? intval($assignment['priority']) : 0,
                    'created_at' => current_time('mysql'),
                    'updated_at' => current_time('mysql')
                ];
                
                $individual_result = $this->wpdb->insert(
                    $this->table_prefix . 'promo_bar_assignments',
                    $insert_data
                );
                
                if ($individual_result !== false) {
                    $success_count++;
                } else {
                    error_log('PromoBarX Database: Individual insert failed for assignment: ' . print_r($assignment, true));
                    error_log('PromoBarX Database: Individual insert error: ' . $this->wpdb->last_error);
                }
            }
            
            error_log('PromoBarX Database: Individual inserts completed. Success: ' . $success_count . '/' . count($assignments));
            return $success_count > 0;
        }

        return $result !== false;
    }

    /**
     * Get assignments for a promo bar
     */
    public function get_assignments($promo_bar_id) {
        error_log('PromoBarX Database: Getting assignments for promo bar ID: ' . $promo_bar_id);
        
        $sql = $this->wpdb->prepare(
            "SELECT * FROM {$this->table_prefix}promo_bar_assignments 
             WHERE promo_bar_id = %d 
             ORDER BY priority DESC, id ASC",
            $promo_bar_id
        );
        
        $assignments = $this->wpdb->get_results($sql);
        
        error_log('PromoBarX Database: Found ' . count($assignments) . ' assignments');
        error_log('PromoBarX Database: Assignments: bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' . print_r($assignments, true));
        
        return $assignments;
    }

    /**
     * Delete assignments for a promo bar
     */
    public function delete_assignments($promo_bar_id) {
        error_log('PromoBarX Database: Deleting assignments for promo bar ID: ' . $promo_bar_id);
        
        $result = $this->wpdb->delete(
            $this->table_prefix . 'promo_bar_assignments',
            ['promo_bar_id' => $promo_bar_id],
            ['%d']
        );
        
        error_log('PromoBarX Database: Delete result: ' . $result);
        error_log('PromoBarX Database: Last SQL error: ' . $this->wpdb->last_error);
        
        return $result !== false;
    }

    /**
     * Get all promo bars with their assignments for current page
     */
    public function get_promo_bars_with_assignments($args = []) {
        $defaults = [
            'status' => 'active',
            'limit' => -1,
            'orderby' => 'created_at DESC'
        ];

        $args = wp_parse_args($args, $defaults);
        $where = [];
        $values = [];

        if ($args['status'] !== 'all') {
            $where[] = 'pb.status = %s';
            $values[] = $args['status'];
        }

        $where_clause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';
        $limit_clause = $args['limit'] > 0 ? 'LIMIT ' . intval($args['limit']) : '';

        $sql = "SELECT pb.*, 
                       GROUP_CONCAT(
                           CONCAT(pa.assignment_type, ':', pa.target_id, ':', pa.target_value, ':', pa.priority)
                           ORDER BY pa.priority DESC, pa.id ASC
                           SEPARATOR '|'
                       ) as assignments_data,
                       COALESCE(MAX(pa.priority), 0) as max_priority
                FROM {$this->table_prefix}promo_bars pb
                LEFT JOIN {$this->table_prefix}promo_bar_assignments pa ON pb.id = pa.promo_bar_id
                {$where_clause}
                GROUP BY pb.id
                ORDER BY max_priority DESC, pb.created_at DESC {$limit_clause}";

        if (!empty($values)) {
            $sql = $this->wpdb->prepare($sql, $values);
        }

        $results = $this->wpdb->get_results($sql);
        
        // Parse assignments data
        foreach ($results as $result) {
            $result->assignments = [];
            if (!empty($result->assignments_data)) {
                $assignments_array = explode('|', $result->assignments_data);
                foreach ($assignments_array as $assignment_str) {
                    $parts = explode(':', $assignment_str);
                    if (count($parts) >= 4) {
                        $result->assignments[] = [
                            'assignment_type' => $parts[0],
                            'target_id' => intval($parts[1]),
                            'target_value' => $parts[2],
                            'priority' => intval($parts[3])
                        ];
                    }
                }
            }
            unset($result->assignments_data);
        }

        return $results;
    }

    /**
     * Force create tables (useful for debugging)
     */
    public function force_create_tables() {
        error_log('PromoBarX Database: Force creating tables');
        $this->create_tables();
        
        // Verify tables were created
        $tables = [
            'promo_bars',
            'promo_bar_assignments',
            'promo_bar_templates', 
            'promo_bar_schedules',
            'promo_bar_analytics'
        ];
        
        $results = [];
        foreach ($tables as $table) {
            $table_exists = $this->wpdb->get_var(
                $this->wpdb->prepare(
                    "SHOW TABLES LIKE %s",
                    $this->table_prefix . $table
                )
            );
            $results[$table] = $table_exists ? 'EXISTS' : 'MISSING';
        }
        
        error_log('PromoBarX Database: Table creation verification: ' . print_r($results, true));
        return $results;
    }

    /**
     * Force recreate assignments table
     */
    public function force_recreate_assignments_table() {
        error_log('PromoBarX Database: Force recreating assignments table');
        
        // Drop the table if it exists
        $drop_result = $this->wpdb->query("DROP TABLE IF EXISTS {$this->table_prefix}promo_bar_assignments");
        error_log('PromoBarX Database: Drop table result: ' . $drop_result);
        
        // Recreate the table
        $charset_collate = $this->wpdb->get_charset_collate();
        $sql_assignments = "CREATE TABLE {$this->table_prefix}promo_bar_assignments (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            promo_bar_id bigint(20) NOT NULL,
            assignment_type enum('global', 'page', 'post_type', 'category', 'tag', 'custom') NOT NULL,
            target_id bigint(20) DEFAULT 0,
            target_value varchar(255) DEFAULT '',
            priority int(11) DEFAULT 0,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY promo_bar_id (promo_bar_id),
            KEY assignment_type (assignment_type),
            KEY target_id (target_id),
            KEY priority (priority)
        ) $charset_collate;";
        
        $create_result = $this->wpdb->query($sql_assignments);
        error_log('PromoBarX Database: Create table result: ' . $create_result);
        error_log('PromoBarX Database: Last SQL error: ' . $this->wpdb->last_error);
        
        return $create_result !== false;
    }

    /**
     * Get assignment summary for a promo bar
     */
    public function get_assignment_summary($promo_bar_id) {
        $assignments = $this->get_assignments($promo_bar_id);
        $summary = [];

        foreach ($assignments as $assignment) {
            switch ($assignment->assignment_type) {
                case 'global':
                    $summary[] = 'All Pages';
                    break;
                case 'page':
                    $post = get_post($assignment->target_id);
                    if ($post) {
                        $summary[] = 'Page: ' . $post->post_title;
                    }
                    break;
                case 'post_type':
                    $post_type_obj = get_post_type_object($assignment->target_value);
                    if ($post_type_obj) {
                        $summary[] = 'All ' . $post_type_obj->labels->name;
                    }
                    break;
                case 'category':
                    $term = get_term($assignment->target_id, 'category');
                    if ($term && !is_wp_error($term)) {
                        $summary[] = 'Category: ' . $term->name;
                    }
                    break;
                case 'tag':
                    $term = get_term($assignment->target_id, 'post_tag');
                    if ($term && !is_wp_error($term)) {
                        $summary[] = 'Tag: ' . $term->name;
                    }
                    break;
                case 'custom':
                    $summary[] = 'Custom: ' . $assignment->target_value;
                    break;
            }
        }

        return $summary;
    }

    /**
     * Migrate database schema to add new assignment columns and remove old assignments column
     */
    public function migrate_assignment_schema() {
        error_log('PromoBarX Database: Starting assignment schema migration');
        
        // Check if migration is needed
        $columns = $this->wpdb->get_results("DESCRIBE {$this->table_prefix}promo_bars");
        $column_names = array_column($columns, 'Field');
        
        $migration_needed = false;
        
        // Check if new columns don't exist
        if (!in_array('assignment_type', $column_names)) {
            $migration_needed = true;
        }
        if (!in_array('target_id', $column_names)) {
            $migration_needed = true;
        }
        if (!in_array('target_value', $column_names)) {
            $migration_needed = true;
        }
        if (!in_array('priority', $column_names)) {
            $migration_needed = true;
        }
        
        // Check if old assignments column exists
        if (in_array('assignments', $column_names)) {
            $migration_needed = true;
        }
        
        if (!$migration_needed) {
            error_log('PromoBarX Database: Migration not needed - schema is up to date');
            return true;
        }
        
        error_log('PromoBarX Database: Migration needed - proceeding with schema update');
        
        // Start transaction
        $this->wpdb->query('START TRANSACTION');
        
        try {
            // Step 1: Add new columns
            $alter_queries = [];
            
            if (!in_array('assignment_type', $column_names)) {
                $alter_queries[] = "ADD COLUMN assignment_type enum('global', 'page', 'post_type', 'category', 'tag', 'custom') DEFAULT 'global'";
            }
            
            if (!in_array('target_id', $column_names)) {
                $alter_queries[] = "ADD COLUMN target_id bigint(20) DEFAULT 0";
            }
            
            if (!in_array('target_value', $column_names)) {
                $alter_queries[] = "ADD COLUMN target_value varchar(255) DEFAULT ''";
            }
            
            if (!in_array('priority', $column_names)) {
                $alter_queries[] = "ADD COLUMN priority int(11) DEFAULT 0";
            }
            
            // Execute alter queries
            if (!empty($alter_queries)) {
                $alter_sql = "ALTER TABLE {$this->table_prefix}promo_bars " . implode(', ', $alter_queries);
                error_log('PromoBarX Database: Executing alter query: ' . $alter_sql);
                
                $result = $this->wpdb->query($alter_sql);
                if ($result === false) {
                    throw new Exception('Failed to add new columns: ' . $this->wpdb->last_error);
                }
            }
            
            // Step 2: Migrate data from old assignments column to new columns
            if (in_array('assignments', $column_names)) {
                error_log('PromoBarX Database: Migrating data from assignments column');
                
                $promo_bars = $this->wpdb->get_results("SELECT id, assignments FROM {$this->table_prefix}promo_bars WHERE assignments IS NOT NULL AND assignments != 'null' AND assignments != '[]'");
                
                foreach ($promo_bars as $promo_bar) {
                    $assignments = json_decode($promo_bar->assignments, true);
                    
                    if (is_array($assignments) && !empty($assignments)) {
                        // Use the first assignment as the primary assignment
                        $primary_assignment = $assignments[0];
                        
                        $update_data = [
                            'assignment_type' => isset($primary_assignment['assignment_type']) ? $primary_assignment['assignment_type'] : 'global',
                            'target_id' => isset($primary_assignment['target_id']) ? intval($primary_assignment['target_id']) : 0,
                            'target_value' => isset($primary_assignment['target_value']) ? $primary_assignment['target_value'] : '',
                            'priority' => isset($primary_assignment['priority']) ? intval($primary_assignment['priority']) : 0
                        ];
                        
                        $result = $this->wpdb->update(
                            $this->table_prefix . 'promo_bars',
                            $update_data,
                            ['id' => $promo_bar->id],
                            ['%s', '%d', '%s', '%d'],
                            ['%d']
                        );
                        
                        if ($result === false) {
                            error_log('PromoBarX Database: Failed to migrate data for promo bar ID: ' . $promo_bar->id);
                        }
                    }
                }
                
                // Step 3: Remove old assignments column
                error_log('PromoBarX Database: Removing assignments column');
                $drop_result = $this->wpdb->query("ALTER TABLE {$this->table_prefix}promo_bars DROP COLUMN assignments");
                
                if ($drop_result === false) {
                    throw new Exception('Failed to remove assignments column: ' . $this->wpdb->last_error);
                }
            }
            
            // Commit transaction
            $this->wpdb->query('COMMIT');
            
            error_log('PromoBarX Database: Migration completed successfully');
            return true;
            
        } catch (Exception $e) {
            // Rollback transaction
            $this->wpdb->query('ROLLBACK');
            error_log('PromoBarX Database: Migration failed: ' . $e->getMessage());
            return false;
        }
    }
}
