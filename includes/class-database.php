<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/**
 * Database handling class for AISK plugin
 *
 * @category WordPress
 * @package  AISK
 * @author   Aisk Team <support@aisk.chat>
 * @license  GPL-2.0+ https://www.gnu.org/licenses/gpl-2.0.html
 * @link     https://aisk.chat
 */

/**
 * AISK_Database Class
 *
 * @category WordPress
 * @package  AISK
 * @author   Aisk Team <support@aisk.chat>
 * @license  GPL-2.0+ https://www.gnu.org/licenses/gpl-2.0.html
 * @link     https://aisk.chat
 */
class AISK_Database {


    private $wpdb;
    private $table_prefix;
    private $embedding_table;

    /**
     * Initialize the database class
     *
     * @return void
     */
    public function __construct() {
        $this->create_tables();
    }

    /**
     * Create required database tables
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function create_tables() {
        global $wpdb;
        $this->wpdb = $wpdb;
        $this->table_prefix = $this->wpdb->prefix;
        $this->embedding_table = $this->table_prefix . 'aisk_embeddings';
        $charset_collate = $this->wpdb->get_charset_collate();

        $sql_conversations = "CREATE TABLE IF NOT EXISTS {$this->table_prefix}aisk_conversations (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            conversation_id varchar(50) NOT NULL,
            user_id bigint(20),
            user_name varchar(100),
            user_email varchar(100),
            user_phone varchar(50),
            platform varchar(20) DEFAULT 'web',
            ip_address varchar(45),
            city varchar(100),
            country varchar(100),
            country_code varchar(2),
            intents JSON,
            user_agent varchar(255),
            page_url varchar(255),
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY conversation_id (conversation_id),
            KEY user_id (user_id),
            KEY user_phone (user_phone),
            KEY platform (platform),
            KEY city (city),
            KEY country (country)
        ) $charset_collate;";

        // Messages table
        $sql_messages = "CREATE TABLE IF NOT EXISTS {$this->table_prefix}aisk_messages (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            conversation_id varchar(50) NOT NULL,
            message_type enum('user', 'bot') NOT NULL,
            message TEXT NOT NULL,
            metadata JSON,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY conversation_id (conversation_id),
            KEY message_type (message_type)
        ) $charset_collate;";

        // Add new table for user states
        $sql_states = "CREATE TABLE IF NOT EXISTS {$this->table_prefix}aisk_user_states (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            platform_user_id varchar(50) NOT NULL,
            platform varchar(20) NOT NULL,
            state_data JSON,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY platform_user (platform_user_id, platform)
        ) $charset_collate;";

        $sql_inquiries = "CREATE TABLE IF NOT EXISTS {$this->table_prefix}aisk_inquiries (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            conversation_id varchar(50) NOT NULL,
            order_number varchar(50) NOT NULL,
            customer_email varchar(100),
            customer_phone varchar(30),
            note TEXT NOT NULL,
            status varchar(20) DEFAULT 'pending',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY conversation_id (conversation_id),
            KEY order_number (order_number),
            KEY status (status)
        ) $charset_collate;";

        $sql_inquiry_notes = "CREATE TABLE IF NOT EXISTS {$this->table_prefix}aisk_inquiry_notes (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            inquiry_id bigint(20) NOT NULL,
            note text NOT NULL,
            author_id bigint(20) NOT NULL,
            author varchar(100) NOT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY inquiry_id (inquiry_id)
        ) $charset_collate;";

        $sql_embeddings = "CREATE TABLE IF NOT EXISTS {$this->table_prefix}aisk_embeddings (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            content_type varchar(50) NOT NULL,
            content_id bigint(20) NOT NULL,
            crawled_url varchar(255) DEFAULT NULL,
            file_path varchar(255) DEFAULT NULL,
            embedding longtext NOT NULL,
            content_chunk longtext NOT NULL,
            parent_url varchar(255) DEFAULT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY content_type_id (content_type, content_id),
            KEY parent_url (parent_url)
        ) {$charset_collate};";

        include_once ABSPATH . 'wp-admin/includes/upgrade.php';

        dbDelta($sql_conversations);
        dbDelta($sql_messages);
        dbDelta($sql_states);
        dbDelta($sql_inquiries);
        dbDelta($sql_inquiry_notes);
        dbDelta($sql_embeddings);
    }

    /**
     * Store embedding data in database
     *
     * @param array $data Embedding data to store
     *
     * @since 1.0.0
     *
     * @return int|false Number of rows affected or false on error
     */
    public function store_embedding( $data ) {
        // Remove any existing embeddings for this content
        $this->delete_embedding($data['content_type'], $data['content_id']);

        // Insert new embedding
        return $this->wpdb->insert(
            $this->embedding_table,
            [
                'content_type' => $data['content_type'],
                'content_id' => $data['content_id'],
                'embedding' => $data['embedding'],
                'content_chunk' => $data['content_chunk'],
            ],
            [ '%s', '%d', '%s', '%s' ]
        );
    }

    /**
     * Delete embedding for specific content
     *
     * @param string $content_type Content type to delete
     * @param int    $content_id   Content ID to delete
     *
     * @since 1.0.0
     *
     * @return int|false Number of rows affected or false on error
     */
    public function delete_embedding( $content_type, $content_id ) {
        return $this->wpdb->delete(
            $this->embedding_table,
            [
                'content_type' => $content_type,
                'content_id' => $content_id,
            ],
            [ '%s', '%d' ]
        );
    }

    /**
     * Get embeddings for specific content
     *
     * @param string $content_type Content type to retrieve
     * @param int    $content_id   Content ID to retrieve
     *
     * @since 1.0.0
     *
     * @return array Array of embedding results
     */
    public function get_embeddings($content_type, $content_id)
    {
        $cache_key = 'aisk_embedding_' . $content_type . '_' . $content_id;
        $embeddings = wp_cache_get($cache_key, 'aisk_embeddings');
        
        if (false === $embeddings) {
            // @codingStandardsIgnoreStart
            global $wpdb;
            
            $embeddings = $wpdb->get_results(
                $wpdb->prepare(
                    "SELECT * FROM {$this->embedding_table} 
                    WHERE content_type = %s AND content_id = %d",
                    $content_type,
                    $content_id
                )
            );
            // @codingStandardsIgnoreEnd
            
            if ($embeddings) {
                wp_cache_set($cache_key, $embeddings, 'aisk_embeddings', 3600); // Cache for 1 hour
            }
        }
        
        return $embeddings ?: array();
    }

    /**
     * Get all embeddings from database
     *
     * @since 1.0.0
     *
     * @return array Array of all embeddings
     */
    public function get_all_embeddings()
    {
        $cache_key = 'aisk_all_embeddings';
        $embeddings = wp_cache_get($cache_key, 'aisk_embeddings');
        
        if (false === $embeddings) {
            // @codingStandardsIgnoreStart
            global $wpdb;
            
            $embeddings = $wpdb->get_results(
                "SELECT * FROM {$this->embedding_table}"
            );
            // @codingStandardsIgnoreEnd
            
            if ($embeddings) {
                wp_cache_set($cache_key, $embeddings, 'aisk_embeddings', 3600); // Cache for 1 hour
            }
        }
        
        return $embeddings ?: array();
    }

    /**
     * Clear all embeddings from database
     *
     * @since 1.0.0
     *
     * @return int|false Number of rows affected or false on error
     */
    public function clear_all_embeddings() {
        global $wpdb;
        return $wpdb->query( $wpdb->prepare( 'TRUNCATE TABLE %s', $this->embedding_table ) );
    }
}
