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

        
        // Test basic connectivity
        $test_query = $this->wpdb->get_var("SELECT 1");
        if ($test_query !== '1') {

            return false;
        }
        
        // Test if promo_bars table exists
        $table_name = $this->table_prefix . 'promo_bars';
        $like_pattern = $this->wpdb->esc_like($table_name);
        $prepared_query = $this->wpdb->prepare("SHOW TABLES LIKE %s", $like_pattern);
        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Table name is safe, using esc_like for LIKE pattern
        $table_exists = $this->wpdb->get_var($prepared_query);
        
        if (!$table_exists) {
            return false;
        }
        
        // Test table structure
        $table_name = $this->wpdb->_escape($this->table_prefix . 'promo_bars');
        // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Table name is safe, using table prefix
        $columns = $this->wpdb->get_results("DESCRIBE {$this->table_prefix}promo_bars");
        
        if (empty($columns)) {
            return false;
        }
        

        return true;
    }

    /**
     * Create required database tables
     */
    public function create_tables() {
        $charset_collate = $this->wpdb->get_charset_collate();
        


        // Main top bars table
        $sql_promo_bars = "CREATE TABLE IF NOT EXISTS {$this->table_prefix}promo_bars (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            name varchar(255) NOT NULL,
            title text,
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

        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Table creation query with dynamic table names
        $result = $this->wpdb->query($sql_promo_bars);
        if ($result === false) {
            // Failed to create promo_bars table
        }

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
            KEY priority (priority),
            FOREIGN KEY (promo_bar_id) REFERENCES {$this->table_prefix}promo_bars(id) ON DELETE CASCADE
        ) $charset_collate;";

        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Table creation query with dynamic table names
        $result = $this->wpdb->query($sql_assignments);
        if ($result === false) {
            // Failed to create promo_bar_assignments table
        }

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

        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Table creation query with dynamic table names
        $result = $this->wpdb->query($sql_templates);
        if ($result === false) {
            // Failed to create templates table
        }

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

        
        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Table creation query with dynamic table names
        $result = $this->wpdb->query($sql_schedules);
        if ($result === false) {
            // Failed to create schedules table
        }

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

        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Table creation query with dynamic table names
        $result = $this->wpdb->query($sql_analytics);
        if ($result === false) {
            // Failed to create analytics table
        }

        // Create default templates
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
            $table_name = $this->table_prefix . 'promo_bar_templates';
            $prepared_query = $this->wpdb->prepare(
                // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Table name is safe, using table prefix, user input is prepared
                "SELECT id FROM {$this->table_prefix}promo_bar_templates WHERE name = %s",
                $template['name']
            );
            // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Table name is safe, user input is prepared
            $exists = $this->wpdb->get_var($prepared_query);

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

        // Use LEFT JOIN to get priority and assignment data from assignments table
        $sql = "SELECT pb.*, 
                       COALESCE(MAX(pa.priority), 0) as max_priority,
                       GROUP_CONCAT(
                           CONCAT(pa.assignment_type, ':', pa.target_id, ':', pa.target_value, ':', pa.priority)
                           ORDER BY pa.priority DESC, pa.id ASC
                           SEPARATOR '|'
                       ) as assignments_data
                FROM {$this->table_prefix}promo_bars pb
                LEFT JOIN {$this->table_prefix}promo_bar_assignments pa ON pb.id = pa.promo_bar_id
                {$where_clause}
                GROUP BY pb.id
                ORDER BY max_priority DESC, pb.created_at DESC {$limit_clause}";

        if (!empty($values)) {
            // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Dynamic query with safe table names and prepared placeholders
            $prepared_query = $this->wpdb->prepare($sql, $values);
            // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Dynamic query with safe table names and prepared placeholders
            $results = $this->wpdb->get_results($prepared_query);
        } else {
            // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Query with safe table names, no user input
            $results = $this->wpdb->get_results($sql);
        }
        
        // Process assignments data for each promo bar
        foreach ($results as $promo_bar) {
            if (!empty($promo_bar->assignments_data)) {
                $assignments_array = [];
                $assignments_parts = explode('|', $promo_bar->assignments_data);
                
                foreach ($assignments_parts as $part) {
                    $assignment_parts = explode(':', $part);
                    if (count($assignment_parts) >= 4) {
                        $assignments_array[] = [
                            'assignment_type' => $assignment_parts[0],
                            'target_id' => $assignment_parts[1],
                            'target_value' => $assignment_parts[2],
                            'priority' => $assignment_parts[3]
                        ];
                    }
                }
                
                $promo_bar->assignments = $assignments_array;
            } else {
                $promo_bar->assignments = [];
            }
            
            // Remove the raw assignments_data field
            unset($promo_bar->assignments_data);
        }

        return $results;
    }

    /**
     * Get promo bar by ID
     */
    public function get_promo_bar($id) {

        
        $prepared_query = $this->wpdb->prepare(
            // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Table name is safe, using table prefix, user input is prepared
            "SELECT * FROM {$this->table_prefix}promo_bars WHERE id = %d",
            $id
        );
        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Table name is safe, user input is prepared
        $result = $this->wpdb->get_row($prepared_query);
        
        if ($this->wpdb->last_error) {
            // Error getting promo bar from database
        }
        
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
            

        }
        
        return $result;
    }

    /**
     * Update promo bar
     */
    public function update_promo_bar($id, $data) {

        
        $data['updated_at'] = current_time('mysql');
        
        $result = $this->wpdb->update(
            $this->table_prefix . 'promo_bars',
            $data,
            ['id' => $id],
            null,
            ['%d']
        );
        

        
        return $result !== false;
    }

    /**
     * Create or update promo bar
     */
    public function save_promo_bar($data) {

        
        // Test database connection first
        if (!$this->test_database_connection()) {
            // Database connection test failed
            return false;
        }
        
        // Extract assignments data before sanitization
        $assignments_data = [];
        if (isset($data['assignments'])) {
            
            
            if (is_array($data['assignments'])) {

                $assignments_data = $data['assignments'];
            } elseif (is_string($data['assignments'])) {

                
                // First attempt: direct JSON decode
                $decoded = json_decode($data['assignments'], true);

                
                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {

                    $assignments_data = $decoded;
                } else {
                    // Second attempt: try with stripslashes (in case of double encoding)
                    $stripped = stripslashes($data['assignments']);
                    
                    $decoded = json_decode($stripped, true);

                    
                    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {

                        $assignments_data = $decoded;
                    } else {
                        // JSON decode failed for assignments data
                    }
                }
            } else {

            }
        } else {

        }


        
        // Remove assignments from main data to avoid conflicts
        unset($data['assignments']);
        
        // Validate and sanitize input data
        $sanitized_data = $this->sanitize_promo_bar_data($data);
        if (is_wp_error($sanitized_data)) {
            // Data validation failed
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


        // Ensure required fields are not empty
        if (empty($data['name'])) {

            return false;
        }

        if (isset($data['id'])) {
            // Update existing
            $id = intval($data['id']);
            unset($data['id']);
            $data['updated_at'] = current_time('mysql');
            

            
            // Check if promo bar exists
            $existing = $this->get_promo_bar($id);
            if (!$existing) {

                return false;
            }
            
            $result = $this->wpdb->update(
                $this->table_prefix . 'promo_bars',
                $data,
                ['id' => $id]
            );
            

            
            if ($result === false) {
                // Database update failed
                return false;
            }

           
            
            // Update assignments if provided
            if (!empty($assignments_data)) {

                $assignment_result = $this->save_assignments($id, $assignments_data);
                if (!$assignment_result) {
                    // Failed to update assignments
                }
            }
            
            return $id;
        } else {
            // Create new
            $data['created_at'] = current_time('mysql');
            $data['updated_at'] = current_time('mysql');
            

            
            $result = $this->wpdb->insert(
                $this->table_prefix . 'promo_bars',
                $data
            );
            

            
            if ($result === false) {
                // Database insert failed
                return false;
            }
            
            $new_promo_bar_id = $this->wpdb->insert_id;
            
            // Create assignments for new promo bar
            if (!empty($assignments_data)) {

                $assignment_result = $this->save_assignments($new_promo_bar_id, $assignments_data);
                
                if ($assignment_result) {

                } else {
                    // Failed to create assignments
                }
            } else {
                // Create default assignment if no assignments provided
                $default_assignment = [
                    'assignment_type' => 'global',
                    'target_id' => 0,
                    'target_value' => 'All Pages',
                    'priority' => 0
                ];
                

                $assignment_result = $this->save_assignments($new_promo_bar_id, [$default_assignment]);
                
                if ($assignment_result) {

                } else {
                    // Failed to create default assignment
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
        $text_fields = ['name', 'cta_text', 'cta_url'];
        foreach ($text_fields as $field) {
            if (isset($data[$field])) {
                $sanitized[$field] = sanitize_text_field($data[$field]);
            }
        }
        
        // Sanitize title field - allow HTML for rich text editing
        if (isset($data['title'])) {
            // Use wp_kses to allow safe HTML tags for rich text editing
            $allowed_html = array(
                'a' => array(
                    'href' => array(),
                    'target' => array(),
                    'rel' => array(),
                    'title' => array()
                ),
                'b' => array(),
                'strong' => array(),
                'i' => array(),
                'em' => array(),
                'u' => array(),
                'br' => array(),
                'span' => array(
                    'style' => array()
                )
            );
            $sanitized['title'] = wp_kses($data['title'], $allowed_html);
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
                // Handle both boolean and string values
                $value = $data[$field];
                if (is_string($value)) {
                    // Convert string values to boolean
                    $sanitized[$field] = in_array(strtolower($value), ['true', '1', 'yes', 'on']) ? 1 : 0;
                } else {
                    // Handle boolean and numeric values
                    $sanitized[$field] = $value ? 1 : 0;
                }
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
                    // Clean the string first - remove any potential encoding issues
                    $clean_value = trim($data[$field]);
                    
                    // If it's already a JSON string, validate it
                    $decoded = json_decode($clean_value, true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $sanitized[$field] = $clean_value;
                    } else {
                        // Invalid JSON in field
                        
                        // Try to fix common JSON issues
                        $fixed_value = $this->fix_json_string($clean_value);
                        $decoded = json_decode($fixed_value, true);
                        if (json_last_error() === JSON_ERROR_NONE) {
                            $sanitized[$field] = $fixed_value;

                        } else {
                            $sanitized[$field] = json_encode([]);

                        }
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
     * Fix common JSON string issues
     */
    private function fix_json_string($json_string) {
        // Remove any BOM or hidden characters
        $json_string = preg_replace('/[\x00-\x1F\x7F]/', '', $json_string);
        
        // Remove any HTML entities that might have been encoded
        $json_string = html_entity_decode($json_string, ENT_QUOTES, 'UTF-8');
        
        // Try to fix common encoding issues
        $json_string = str_replace(['\\"', '\\\'', '\\\\'], ['"', "'", '\\'], $json_string);
        
        // Remove any trailing commas before closing braces/brackets
        $json_string = preg_replace('/,(\s*[}\]])/', '$1', $json_string);
        
        return $json_string;
    }

    /**
     * Delete promo bar
     */
    public function delete_promo_bar($id) {
        // First, delete existing assignments for this promo bar
        $delete_result = $this->delete_assignments($id);
        
        // Then delete the promo bar
        $result = $this->wpdb->delete(
            $this->table_prefix . 'promo_bars',
            ['id' => $id],
            ['%d']
        );
        
        return $result !== false;
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
            // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Dynamic query with safe table names and prepared placeholders
            $prepared_query = $this->wpdb->prepare($sql, $values);
            // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Dynamic query with safe table names and prepared placeholders
            return $this->wpdb->get_results($prepared_query);
        }

        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Query with safe table names, no user input
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
        $table_name = $this->table_prefix . 'promo_bar_analytics';
        $sql = "SELECT 
                event_type,
                COUNT(*) as count,
                DATE(created_at) as date
            FROM {$this->table_prefix}promo_bar_analytics 
            WHERE promo_bar_id = %d 
            AND created_at >= DATE_SUB(NOW(), INTERVAL %d DAY)
            GROUP BY event_type, DATE(created_at)
            ORDER BY date DESC, event_type";
        // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared,WordPress.DB.PreparedSQL.NotPrepared -- Table name is safe, using table prefix, user input is prepared
        $prepared_query = $this->wpdb->prepare($sql, $promo_bar_id, $days);
        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Table name is safe, user input is prepared
        return $this->wpdb->get_results($prepared_query);
    }

    /**
     * Save assignments for a promo bar
     */
    public function save_assignments($promo_bar_id, $assignments) {

      
        // First, delete existing assignments for this promo bar
        $delete_result = $this->delete_assignments($promo_bar_id);


        // If no assignments provided, we're done
        if (empty($assignments)) {

            return true;
        }

        // Insert new assignments
        $values = [];
        $placeholders = [];

        foreach ($assignments as $assignment) {
            $target_value = isset($assignment['target_value']) ? sanitize_text_field($assignment['target_value']) : '';
            $target_id = isset($assignment['target_id']) ? intval($assignment['target_id']) : 0;
            
            // For page assignments, ensure we have the page title
            if ($assignment['assignment_type'] === 'page' && $target_id > 0 && empty($target_value)) {
                $post = get_post($target_id);
                if ($post) {
                    $target_value = $post->post_title;
                }
            }
            
            // For category assignments, ensure we have the category name
            if ($assignment['assignment_type'] === 'category' && $target_id > 0 && empty($target_value)) {
                $term = get_term($target_id, 'category');
                if ($term && !is_wp_error($term)) {
                    $target_value = $term->name;
                }
            }
            
            // For tag assignments, ensure we have the tag name
            if ($assignment['assignment_type'] === 'tag' && $target_id > 0 && empty($target_value)) {
                $term = get_term($target_id, 'post_tag');
                if ($term && !is_wp_error($term)) {
                    $target_value = $term->name;
                }
            }
            
            $values[] = $promo_bar_id;
            $values[] = sanitize_text_field($assignment['assignment_type']);
            $values[] = $target_id;
            $values[] = $target_value;
            $values[] = isset($assignment['priority']) ? intval($assignment['priority']) : 0;
            $values[] = current_time('mysql');
            $values[] = current_time('mysql');

            $placeholders[] = "(%d, %s, %d, %s, %d, %s, %s)";
        }

        $sql = "INSERT INTO {$this->table_prefix}promo_bar_assignments 
                (promo_bar_id, assignment_type, target_id, target_value, priority, created_at, updated_at) 
                VALUES " . implode(', ', $placeholders);



        // Try direct insert first
        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Bulk insert with safe table names and prepared placeholders
        $prepared_query = $this->wpdb->prepare($sql, $values);
        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Bulk insert with safe table names and prepared placeholders
        $result = $this->wpdb->query($prepared_query);
        


        if ($result === false) {

            
            // Try individual inserts as fallback
            $success_count = 0;
            foreach ($assignments as $assignment) {
                $target_value = isset($assignment['target_value']) ? sanitize_text_field($assignment['target_value']) : '';
                $target_id = isset($assignment['target_id']) ? intval($assignment['target_id']) : 0;
                
                // For page assignments, ensure we have the page title
                if ($assignment['assignment_type'] === 'page' && $target_id > 0 && empty($target_value)) {
                    $post = get_post($target_id);
                    if ($post) {
                        $target_value = $post->post_title;
                    }
                }
                
                // For category assignments, ensure we have the category name
                if ($assignment['assignment_type'] === 'category' && $target_id > 0 && empty($target_value)) {
                    $term = get_term($target_id, 'category');
                    if ($term && !is_wp_error($term)) {
                        $target_value = $term->name;
                    }
                }
                
                // For tag assignments, ensure we have the tag name
                if ($assignment['assignment_type'] === 'tag' && $target_id > 0 && empty($target_value)) {
                    $term = get_term($target_id, 'post_tag');
                    if ($term && !is_wp_error($term)) {
                        $target_value = $term->name;
                    }
                }
                
                $insert_data = [
                    'promo_bar_id' => $promo_bar_id,
                    'assignment_type' => sanitize_text_field($assignment['assignment_type']),
                    'target_id' => $target_id,
                    'target_value' => $target_value,
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
                    // Individual insert failed
                }
            }
            

            return $success_count > 0;
        }

        return $result !== false;
    }

    /**
     * Get assignments for a promo bar
     */
    public function get_assignments($promo_bar_id) {

        
        $prepared_query = $this->wpdb->prepare(
            // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Table name is safe, using table prefix, user input is prepared
            "SELECT * FROM {$this->table_prefix}promo_bar_assignments 
             WHERE promo_bar_id = %d 
             ORDER BY priority DESC, id ASC",
            $promo_bar_id
        );
        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Table name is safe, user input is prepared
        $assignments = $this->wpdb->get_results($prepared_query);
        

        
        return $assignments;
    }

    /**
     * Delete assignments for a promo bar
     */
    public function delete_assignments($promo_bar_id) {

        
        $result = $this->wpdb->delete(
            $this->table_prefix . 'promo_bar_assignments',
            ['promo_bar_id' => $promo_bar_id],
            ['%d']
        );
        

        
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
            // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Dynamic query with safe table names and prepared placeholders
            $prepared_query = $this->wpdb->prepare($sql, $values);
            // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Dynamic query with safe table names and prepared placeholders
            $results = $this->wpdb->get_results($prepared_query);
        } else {
            // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Query with safe table names, no user input
            $results = $this->wpdb->get_results($sql);
        }
        
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
            $full_table_name = $this->table_prefix . $table;
            $like_pattern = $this->wpdb->esc_like($full_table_name);
            $prepared_query = $this->wpdb->prepare("SHOW TABLES LIKE %s", $like_pattern);
            // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Table name is safe, using esc_like for LIKE pattern
            $table_exists = $this->wpdb->get_var($prepared_query);
            $results[$table] = $table_exists ? 'EXISTS' : 'MISSING';
        }
        

        return $results;
    }

    /**
     * Force recreate assignments table
     */
    public function force_recreate_assignments_table() {

        
        // Drop the table if it exists
        $table_name = $this->wpdb->_escape($this->table_prefix . 'promo_bar_assignments');
        // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Table name is safe, using table prefix
        $drop_result = $this->wpdb->query("DROP TABLE IF EXISTS {$this->table_prefix}promo_bar_assignments");

        
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
        
        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Table creation query with dynamic table names
        $create_result = $this->wpdb->query($sql_assignments);

        
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

        
        // Check if migration is needed
        $table_name = $this->wpdb->_escape($this->table_prefix . 'promo_bars');
        // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Table name is safe, using table prefix
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

            return true;
        }
        

        
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

                // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- ALTER TABLE with safe table name and safe column definitions
                $result = $this->wpdb->query($alter_sql);
                if ($result === false) {
                    throw new Exception('Failed to add new columns: ' . $this->wpdb->last_error);
                }
            }
            
            // Step 2: Migrate data from old assignments column to new columns
            if (in_array('assignments', $column_names)) {

                
                $table_name = $this->table_prefix . 'promo_bars';
                // phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Table name is safe, using controlled table prefix
                $promo_bars = $this->wpdb->get_results(
                    "SELECT id, assignments FROM `{$table_name}` WHERE assignments IS NOT NULL AND assignments != 'null' AND assignments != '[]'"
                );
                // phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
                
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
                            // Failed to migrate data for promo bar
                        }
                    }
                }
                
                // Step 3: Remove old assignments column

                $table_name = $this->table_prefix . 'promo_bars';
                // phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Table name is safe, using controlled table prefix
                $drop_result = $this->wpdb->query(
                    "ALTER TABLE `{$table_name}` DROP COLUMN assignments"
                );
                // phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
                
                if ($drop_result === false) {
                    throw new Exception('Failed to remove assignments column: ' . $this->wpdb->last_error);
                }
            }
            
            // Commit transaction
            $this->wpdb->query('COMMIT');
            

            return true;
            
        } catch (Exception $e) {
            // Rollback transaction
            $this->wpdb->query('ROLLBACK');
            // Migration failed - check database logs
            return false;
        }
    }
}
