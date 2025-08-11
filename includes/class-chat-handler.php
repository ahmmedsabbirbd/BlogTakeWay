<?php
/**
 * Chat Handler Class for AISK
 *
 * This file contains the chat handling functionality for the AISK plugin,
 * managing conversations, messages, and AI interactions.
 *
 * @category WordPress
 * @package  AISK
 * @author   AISK Team <support@aisk.chat>
 * @license  GPL-2.0+ https://www.gnu.org/licenses/gpl-2.0.html
 * @link     https://aisk.chat
 */

if ( ! defined('ABSPATH') ) {
	exit;
}

/**
 * AISK Chat Handler Class
 *
 * Handles all chat related functionality including message processing,
 * intent classification, and conversation management.
 *
 * @category Class
 * @package  AISK
 * @author   AISK Team <support@aisk.chat>
 * @license  GPL-2.0+ https://www.gnu.org/licenses/gpl-2.0.html
 * @link     https://aisk.chat
 */
class AISK_Chat_Handler {

    private $embeddings_handler;
    private $product_handler;
    private $order_handler;
    private $chat_storage;
    private $auth_key;

    private $openai_key;

    /**
     * Constructor for the Chat Handler
     *
     * Initializes handlers and loads required settings
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function __construct() {
        $this->embeddings_handler = new AISK_Embeddings_Handler();
        $this->product_handler = new AISK_Product_Handler();
        $this->order_handler = new AISK_Order_Handler();
        $this->chat_storage = AISK_Chat_Storage::get_instance();
        $settings = get_option('aisk_settings');

        $this->auth_key = isset($settings['general']['auth_key']) ? $settings['general']['auth_key'] : '';
        $this->openai_key = isset($settings['general']['openai_key']) ? $settings['general']['openai_key'] : '';

        add_action('rest_api_init', [ $this, 'register_routes' ]);
    }

    /**
     * Register REST API routes
     *
     * Sets up all the REST API endpoints for chat functionality
     *
     * @since 1.0.0
     *
     * @return void
     */

    public function register_routes() {
        // Chat endpoint - Public access with nonce verification
        register_rest_route(
            'aisk/v1', '/chat', [
                'methods' => 'POST',
                'callback' => [ $this, 'handle_chat_request' ],
                'permission_callback' => [ $this, 'verify_chat_request_authenticated' ],
            ]
        );

        // Auth endpoint - Public access with nonce verification
        register_rest_route(
            'aisk/v1', '/auth', [
                'methods' => 'POST',
                'callback' => [ $this, 'handle_auth_request' ],
                'permission_callback' => [ $this, 'verify_auth_request' ],
            ]
        );

        // Conversations endpoints - Authenticated access required
        register_rest_route(
            'aisk/v1', '/conversations', [
                [
                    'methods' => 'GET',
                    'callback' => [ $this, 'get_conversations' ],
                    'permission_callback' => [ $this, 'verify_chat_request_authenticated' ],
                ],
                [
                    'methods' => 'POST',
                    'callback' => [ $this, 'create_conversation' ],
                    'permission_callback' => [ $this, 'verify_chat_request_authenticated' ],
                ],
            ]
        );

        // Single conversation endpoint - Authenticated access required
        register_rest_route(
            'aisk/v1', '/conversations/(?P<id>[a-zA-Z0-9-]+)', [
                'methods' => 'GET',
                'callback' => [ $this, 'get_conversation' ],
                'permission_callback' => [ $this, 'verify_chat_request_authenticated' ],
                'args' => [
                    'id' => [
                        'required' => true,
                        'validate_callback' => function ( $param ) {
                            return is_string($param) && ! empty($param);
                        },
                    ],
                ],
            ]
        );

        // Messages endpoint - Authenticated access required
        register_rest_route(
            'aisk/v1', '/messages/(?P<conversation_id>[a-zA-Z0-9-]+)', [
                'methods' => 'GET',
                'callback' => [ $this, 'get_messages' ],
                'permission_callback' => [ $this, 'verify_conversation_access' ],
                'args' => [
                    'conversation_id' => [
                        'required' => true,
                        'validate_callback' => function ( $param ) {
                            return is_string($param) && ! empty($param);
                        },
                    ],
                ],
            ]
        );

        // Submit inquiry endpoint - Public access with nonce verification
        register_rest_route(
            'aisk/v1', '/submit-inquiry', [
                'methods' => 'POST',
                'callback' => [ $this, 'handle_inquiry_submission' ],
                'permission_callback' => [ $this, 'verify_chat_request_authenticated' ],
            ]
        );

        // Admin-only endpoints
        register_rest_route(
            'aisk/v1', '/inquiries', [
                'methods' => 'GET',
                'callback' => [ $this, 'get_inquiries' ],
                'permission_callback' => function () {
                    return current_user_can('manage_woocommerce');
                },
                'args' => [
                    'page' => [
                        'default' => 1,
                        'sanitize_callback' => 'absint',
                    ],
                    'per_page' => [
                        'default' => 20,
                        'sanitize_callback' => 'absint',
                    ],
                    'status' => [
                        'validate_callback' => function ( $param ) {
                            return in_array($param, [ 'pending', 'in_progress', 'resolved', '' ]);
                        },
                    ],
                    'search' => [
                        'sanitize_callback' => 'sanitize_text_field',
                    ],
                    'start_date' => [
                        'sanitize_callback' => 'sanitize_text_field',
                    ],
                    'end_date' => [
                        'sanitize_callback' => 'sanitize_text_field',
                    ],
                ],
            ]
        );

        // Get single inquiry details
        register_rest_route(
            'aisk/v1', '/inquiries/(?P<id>\d+)', [
				'methods' => 'GET',
				'callback' => [ $this, 'get_inquiry_details' ],
				'permission_callback' => function () {
					return current_user_can('manage_woocommerce');
				},
				'args' => [
					'id' => [
						'validate_callback' => function ( $param ) {
							return is_numeric($param);
						},
					],
				],
            ]
        );

        // Get inquiry notes
        register_rest_route(
            'aisk/v1', '/inquiries/(?P<id>\d+)/notes', [
				[
					'methods' => 'GET',
					'callback' => [ $this, 'get_inquiry_notes' ],
					'permission_callback' => function () {
						return current_user_can('manage_woocommerce');
					},
				],
				[
					'methods' => 'POST',
					'callback' => [ $this, 'add_inquiry_note' ],
					'permission_callback' => function () {
						return current_user_can('manage_woocommerce');
					},
				],
            ]
        );

        // Update inquiry status
        register_rest_route(
            'aisk/v1', '/inquiries/(?P<id>\d+)/status', [
				'methods' => 'POST',
				'callback' => [ $this, 'update_inquiry_status' ],
				'permission_callback' => function () {
					return current_user_can('manage_woocommerce');
				},
				'args' => [
					'id' => [
						'validate_callback' => function ( $param ) {
							return is_numeric($param);
						},
					],
					'status' => [
						'required' => true,
						'validate_callback' => function ( $param ) {
							return in_array($param, [ 'pending', 'in_progress', 'resolved' ]);
						},
					],
				],
            ]
        );
    }

    /**
     * Verify chat request permission
     *
     * @return bool Whether the request is authorized
     */
    public function verify_chat_request_authenticated() {
        // Verify nonce if present
        $nonce = isset( $_SERVER['HTTP_X_WP_NONCE'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_X_WP_NONCE'] ) ) : '';
        if ( ! empty( $nonce ) && ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
            return false;
        }

        // Allow if user is logged in or has a valid chat session
        if (is_user_logged_in() || ! empty( $_COOKIE[ PromoBarX_CHAT_SESSION_COOKIE ])) {
            return true;
        }

        // For incognito mode, be more lenient - allow based on nonce only
        // This is a fallback for cases where cookies don't work
        if (!empty($nonce) && wp_verify_nonce($nonce, 'wp_rest')) {
            return true;
        }

        return false;
    }

    /**
     * Verify auth request permission
     *
     * @return bool Whether the request is authorized
     */
    public function verify_auth_request() {
        // Verify nonce
        $nonce = isset( $_SERVER['HTTP_X_WP_NONCE'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_X_WP_NONCE'] ) ) : '';
        return ! empty( $nonce ) && wp_verify_nonce( $nonce, 'wp_rest' );
    }

    /**
     * Verify conversation access permission
     *
     * @param WP_REST_Request $request The request object
     * @return bool Whether the user has access to the conversation
     */
    public function verify_conversation_access($request) {
        // Allow access if user is logged in
        if (is_user_logged_in()) {
            return true;
        }

        // Get conversation ID from request
        $conversation_id = $request->get_param('conversation_id');
        if (empty($conversation_id)) {
            return false;
        }

        // Get conversation from storage
        $conversation = $this->chat_storage->get_conversation($conversation_id);
        if (!$conversation) {
            return false;
        }

        // Allow access if IP address matches
        $current_ip = isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'])) : '';
        if (!empty($conversation->ip_address) && $conversation->ip_address === $current_ip) {
            return true;
        }

        // Allow access if user agent matches
        $current_user_agent = isset($_SERVER['HTTP_USER_AGENT']) ? sanitize_text_field(wp_unslash($_SERVER['HTTP_USER_AGENT'])) : '';
        if (!empty($conversation->user_agent) && $conversation->user_agent === $current_user_agent) {
            return true;
        }

        return false;
    }
    /**
     * Handle incoming chat requests
     *
     * Processes chat messages, determines intent, and returns appropriate responses
     *
     * @param WP_REST_Request $request The incoming request object
     *
     * @since 1.0.0
     *
     * @return array | WP_Error Response object or error
     */
    public function handle_chat_request( $request ) {
        if ( empty($this->openai_key) ) {
            return new WP_Error('no_openai_key', 'OpenAI key required. Please configure in the settings.', [ 'status' => 400 ]);
        }

        if ( empty($this->auth_key) ) {
            return new WP_Error('no_auth_key', 'Aisk authentication key required. Please configure in the settings.', [ 'status' => 400 ]);
        }

        $params = $request->get_params();
        if ( empty($params['message']) ) {
            return new WP_Error('no_message', 'No message provided', [ 'status' => 400 ]);
        }

        $message = sanitize_text_field($params['message']);
        $conversation_id = isset($params['conversation_id']) ? sanitize_text_field($params['conversation_id']) : '';

        // Store user message
        if ( $conversation_id ) {
            $this->chat_storage->add_message($conversation_id, 'user', $message);
        }

        // Process based on intent
        try {
            
            $intent = $this->classify_intent($message, $conversation_id);
            
            if ( is_wp_error($intent) ) {
                return [
                    'message' => $intent->get_error_message(),
                    'status' => $intent->get_error_data()['status'],
                ];
            }

            // Check WooCommerce state for product-related intents
            $settings = get_option('aisk_settings');
            $is_woocommerce_enabled = !empty($settings['ai_config']['woocommerce_enabled']);
            
            if (!$is_woocommerce_enabled && in_array($intent['intent_type'], ['product_search', 'product_info_search'])) {
                return [
                    'message' => __("Product search is currently disabled. Please enable WooCommerce integration in the settings.", 'promo-bar-x'),
                    'products' => []
                ];
            }

            $response = null;
            switch ( $intent['intent_type'] ) {
                case 'product_search':
                    $content_type = [ 'product' ];
                    $response = $this->handle_product_search( $intent, $message, $content_type );
                    break;

                case 'product_info_search':
                    $content_type = [ 'product' ];
                    $response = $this->handle_product_info_search($message, $conversation_id, $content_type);
                    break;

                case 'order_status':
                    $response = $this->handle_order_status_request($intent);
                    break;

                case 'contact_support':
                    $content_type = ['settings'];
                    $contact_details = $this->handle_general_query($message, $conversation_id, $content_type);
                    
                    // Check if contact form is enabled from settings
                    $settings = get_option('aisk_settings');
                    $is_contact_form_enabled = !empty($settings['integrations']['contact_form']['enabled']);
                    
                    // Get the response type from the intent
                    $response_type = isset($intent['response_type']) ? $intent['response_type'] : 'info';
                    
                    // Only show form if explicitly requested and enabled
                    $should_show_form = $is_contact_form_enabled && $response_type === 'form';
                    
                    // Prepare the response
                    $response = [
                        'message' => $contact_details['message'],
                        'type' => 'contact_support',
                        'support' => $should_show_form,
                        'response_type' => $response_type
                    ];
                    break;

                case 'general_conversation':
                    $content_type = ['settings'];
                    $response = $this->handle_general_query($message, $conversation_id, $content_type);
                    break;

                case 'general_inquiries':
                    $content_type = ['settings', 'page', 'post'];
                    $response = $this->handle_general_query($message, $conversation_id, $content_type);
                    break;

                default:
                    $content_type = [ 'external_url', 'pdf', 'page', 'post', 'settings' ];
                    $response = $this->handle_general_query($message, $conversation_id, $content_type);
            }

            // Store bot response
            if ( $conversation_id && !empty($response['message']) ) {
                // Ensure we have a valid message type
                $message_type = 'bot';
                
                // Prepare metadata based on response type
                $metadata = [
                    'products' => isset($response['products']) ? $response['products'] : null,
                    'order' => isset($response['order']) ? $response['order'] : null,
                    'type' => isset($response['type']) ? $response['type'] : null,
                    'support' => isset($response['support']) ? $response['support'] : null,
                    'response_type' => isset($response['response_type']) ? $response['response_type'] : null,
                    'contact_info' => isset($response['contact_info']) ? $response['contact_info'] : null,
                    'form_fields' => isset($response['form_fields']) ? $response['form_fields'] : null
                ];
                
                // Store the message with metadata
                $this->chat_storage->add_message(
                    $conversation_id,
                    $message_type,
                    $response['message'],
                    $metadata
                );
            }

            // Ensure order data is included in the response
            if (isset($response['order'])) {
                $response['order_data'] = $response['order'];
            }
            
            return $response;
        } catch ( Exception $e ) {
            return new WP_Error(
                'processing_failed',
                $e->getMessage(),
                [ 'status' => 500 ]
            );
        }
    }

    /**
     * Get contact information from settings
     *
     * @return array Contact information
     */
    private function get_contact_info() {
        $settings = get_option('aisk_settings');
        return [
            'email' => isset($settings['contact']['email']) ? $settings['contact']['email'] : '',
            'phone' => isset($settings['contact']['phone']) ? $settings['contact']['phone'] : '',
            'hours' => isset($settings['contact']['hours']) ? $settings['contact']['hours'] : '',
            'address' => isset($settings['contact']['address']) ? $settings['contact']['address'] : '',
        ];
    }

    /**
     * Classify the intent of a message
     *
     * Determines the user's intent based on message content and conversation history
     *
     * @param string $message         The user's message
     * @param string $conversation_id The current conversation ID
     *
     * @since 1.0.0
     *
     * @return array|WP_Error Intent classification or error
     */
    private function classify_intent( $message, $conversation_id ) {
        try {
            // Get recent message history
            $message_history = $this->chat_storage->get_recent_message_history($conversation_id);

            $response = wp_remote_post(
                PromoBarX_APP_BASE . '/wp-json/aisk/v1/classify-intent',
                [
                    'headers' => [
                        'Content-Type' => 'application/json',
                        'X-Site-Url' => get_site_url(),
                    ],
                    'body' => json_encode([
                        'message' => $message,
                        'conversation_history' => $message_history,
                        'auth_key' => $this->auth_key,
                    ]),
                    'timeout' => 30, // Increased timeout to 30 seconds
                    'httpversion' => '1.1',
                    'blocking' => true,
                    'sslverify' => true,
                ]
            );

            if ( is_wp_error($response) ) {
                $error_message = $response->get_error_message();

                // Check for specific error types
                if ( strpos( $error_message, 'timed out' ) !== false ) {
                    throw new Exception('Request timed out. Please try again.', 504);
                }
                throw new Exception('Connection error: ' . $error_message, 503);
            }

            $body = json_decode(wp_remote_retrieve_body($response), true);
            $status = wp_remote_retrieve_response_code($response);
           
            if ( 200 !== $status ) {
                $error = isset($body['message']) ? $body['message'] : 'Unknown error';
                throw new Exception($error, $status);
            }

            if ( empty( $body ) ) {
                throw new Exception('Empty response from classification service', 503);
            }

            return $body;

        } catch ( Exception $e ) {
            return new WP_Error(
                'classification_failed',
                $e->getMessage(),
                [ 'status' => $e->getCode() ? $e->getCode() : 503 ]
            );
        }
    }

    /**
     * Handle inquiry submission
     *
     * @param WP_REST_Request $request The incoming request object
     * @return array|WP_Error Success response or error
     */
    public function handle_inquiry_submission($request) {
        $params = $request->get_params();

        $required_params = ['note', 'order_number', 'conversation_id'];
        $missing_params = array_filter(
            $required_params,
            function($param) use ($params) {
                return empty($params[$param]);
            }
        );

        if (!empty($missing_params)) {
            return new WP_Error(
                'missing_params',
                'Missing required parameters: ' . implode(', ', $missing_params),
                ['status' => 400]
            );
        }

        // Get customer details from order
        $order = wc_get_order($params['order_number']);
        if (!$order) {
            return new WP_Error('invalid_order', 'Order not found', ['status' => 404]);
        }

        // @codingStandardsIgnoreStart
        global $wpdb;
        $result = $wpdb->insert(
            $wpdb->prefix . 'aisk_inquiries',
            [
                'conversation_id' => $params['conversation_id'],
                'order_number' => $params['order_number'],
                'customer_email' => $order->get_billing_email(),
                'customer_phone' => $order->get_billing_phone(),
                'note' => sanitize_textarea_field($params['note']),
                'status' => 'pending',
                'created_at' => gmdate('Y-m-d H:i:s'),
                'updated_at' => gmdate('Y-m-d H:i:s'),
            ]
        );
        // @codingStandardsIgnoreEnd

        if (!$result) {
            return new WP_Error('db_error', 'Failed to save inquiry', ['status' => 500]);
        }

        // Clear any related caches
        wp_cache_delete('aisk_inquiries_' . md5(serialize(['conversation_id' => $params['conversation_id']])), 'aisk_inquiries');
        wp_cache_delete('aisk_inquiries_total_' . md5(serialize([])), 'aisk_inquiries');

        return [
            'success' => true,
            'message' => 'Inquiry submitted successfully',
        ];
    }

    /**
     * Get list of inquiries
     *
     * Retrieves paginated list of inquiries with optional filters
     *
     * @param WP_REST_Request $request The incoming request object
     *
     * @since 1.0.0
     *
     * @return array List of inquiries with pagination data
     */
    public function get_inquiries($request) {
        global $wpdb;

        // Get parameters
        $user_page = $request->get_param('page');
        $user_per_page = $request->get_param('per_page');
        $page = isset($user_page) ? $user_page : 1;
        $per_page = isset($user_per_page) ? $user_per_page : 20;
        $status = $request->get_param('status');
        $search = $request->get_param('search');
        $start_date = $request->get_param('start_date');
        $end_date = $request->get_param('end_date');

        $offset = ($page - 1) * $per_page;

        // Start building query
        $where_clauses = [];
        $where_values = [];

        // Add status filter
        if (!empty($status)) {
            $where_clauses[] = 'status = %s';
            $where_values[] = $status;
        }

        // Add date range filter in server's local timezone
        if (!empty($start_date)) {
            $where_clauses[] = 'created_at >= %s';
            // Format the start date with beginning of day
            $formatted_start_date = gmdate('Y-m-d H:i:s', strtotime($start_date . ' 00:00:00'));
            $where_values[] = $formatted_start_date;
        }

        if (!empty($end_date)) {
            $where_clauses[] = 'created_at <= %s';
            // Format the end date with end of day
            $formatted_end_date = gmdate('Y-m-d H:i:s', strtotime($end_date . ' 23:59:59'));
            $where_values[] = $formatted_end_date;
        }

        // Add search filter
        if (!empty($search)) {
            $search_term = '%' . $wpdb->esc_like($search) . '%';
            $where_clauses[] = '(order_number LIKE %s OR customer_email LIKE %s OR customer_phone LIKE %s)';
            $where_values[] = $search_term;
            $where_values[] = $search_term;
            $where_values[] = $search_term;
        }

        // Combine the where clauses
        $where_sql = '';
        if (!empty($where_clauses)) {
            $where_sql = 'WHERE ' . implode(' AND ', $where_clauses);
        }

        // Generate a unique cache key based on query parameters
        $cache_key = 'aisk_inquiries_' . md5(serialize([$where_sql, $where_values, $per_page, $offset]));

        // Try to get cached results
        $inquiries = wp_cache_get($cache_key, 'aisk_inquiries');
        if (false === $inquiries) {
            // @codingStandardsIgnoreStart
            $inquiries = $wpdb->get_results($wpdb->prepare(
                "SELECT * FROM {$wpdb->prefix}aisk_inquiries
                $where_sql
                ORDER BY created_at DESC
                LIMIT %d OFFSET %d",
                array_merge($where_values, [$per_page, $offset])
            ));
            // @codingStandardsIgnoreEnd
            wp_cache_set($cache_key, $inquiries, 'aisk_inquiries', 300); // Cache for 5 minutes
        }

        // Get total count for pagination
        $total_cache_key = 'aisk_inquiries_total_' . md5(serialize([$where_sql, $where_values]));
        $total = wp_cache_get($total_cache_key, 'aisk_inquiries');
        if (false === $total) {
            // @codingStandardsIgnoreStart
            if (empty($where_values)) {
                $total = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$wpdb->prefix}aisk_inquiries"));
            } else {
                $total = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$wpdb->prefix}aisk_inquiries %s", $where_sql));
            }
            // @codingStandardsIgnoreEnd
            wp_cache_set($total_cache_key, $total, 'aisk_inquiries', 300); // Cache for 5 minutes
        }

        // Convert created_at and updated_at to ISO 8601 with Z (UTC) for each inquiry
        if ($inquiries) {
            foreach ($inquiries as &$inquiry) {
                if (isset($inquiry->created_at)) {
                    $inquiry->created_at = gmdate('Y-m-d\TH:i:s\Z', strtotime($inquiry->created_at));
                }
                if (isset($inquiry->updated_at)) {
                    $inquiry->updated_at = gmdate('Y-m-d\TH:i:s\Z', strtotime($inquiry->updated_at));
                }
            }
        }

        return [
            'inquiries' => $inquiries ? $inquiries : [],
            'total' => (int) $total,
            'pages' => ceil($total / $per_page),
            'current_page' => $page,
        ];
    }

    /**
     * Get inquiry details
     *
     * @param WP_REST_Request $request The incoming request object
     * @return array|WP_Error Inquiry details or error
     */
    public function get_inquiry_details($request) {
        global $wpdb;
        $inquiry_id = $request->get_param('id');

        // Generate cache key
        $cache_key = 'aisk_inquiry_details_' . $inquiry_id;
        
        // Try to get cached inquiry
        $inquiry = wp_cache_get($cache_key, 'aisk_inquiries');
        
        if (false === $inquiry) {
            // @codingStandardsIgnoreStart
            $inquiry = $wpdb->get_row(
                $wpdb->prepare(
                    "SELECT * FROM {$wpdb->prefix}aisk_inquiries WHERE id = %d",
                    $inquiry_id
                )
            );
            // @codingStandardsIgnoreEnd
            
            if ($inquiry) {
                wp_cache_set($cache_key, $inquiry, 'aisk_inquiries', 300); // Cache for 5 minutes
            }
        }

        if (!$inquiry) {
            return new WP_Error(
                'inquiry_not_found',
                'Inquiry not found',
                ['status' => 404]
            );
        }

        // Convert created_at and updated_at to ISO 8601 UTC
        if (isset($inquiry->created_at)) {
            $inquiry->created_at = gmdate('Y-m-d\TH:i:s\Z', strtotime($inquiry->created_at));
        }
        if (isset($inquiry->updated_at)) {
            $inquiry->updated_at = gmdate('Y-m-d\TH:i:s\Z', strtotime($inquiry->updated_at));
        }

        // Get notes for this inquiry
        $notes = $this->get_inquiry_notes($request);
        // Convert created_at for each note
        if ($notes) {
            foreach ($notes as &$note) {
                if (isset($note->created_at)) {
                    $note->created_at = gmdate('Y-m-d\TH:i:s\Z', strtotime($note->created_at));
                }
            }
        }

        return [
            'inquiry' => $inquiry,
            'notes' => $notes,
        ];
    }

    /**
     * Get inquiry notes
     *
     * @param WP_REST_Request $request The incoming request object
     * @return array List of inquiry notes
     */
    public function get_inquiry_notes($request) {
        global $wpdb;
        $inquiry_id = $request->get_param('id');

        // Generate cache key
        $cache_key = 'aisk_inquiry_notes_' . $inquiry_id;
        
        // Try to get cached notes
        $notes = wp_cache_get($cache_key, 'aisk_inquiries');
        
        if (false === $notes) {
            // @codingStandardsIgnoreStart
            $notes = $wpdb->get_results(
                $wpdb->prepare(
                    "SELECT * FROM {$wpdb->prefix}aisk_inquiry_notes 
                    WHERE inquiry_id = %d 
                    ORDER BY created_at DESC",
                    $inquiry_id
                )
            );
            // @codingStandardsIgnoreEnd
            
            if ($notes) {
                wp_cache_set($cache_key, $notes, 'aisk_inquiries', 300); // Cache for 5 minutes
            }
        }

        return $notes;
    }

    /**
     * Add note to inquiry
     *
     * @param WP_REST_Request $request The incoming request object
     * @return array|WP_Error Success response or error
     */
    public function add_inquiry_note($request) {
        global $wpdb;

        $inquiry_id = $request->get_param('id');
        $note = sanitize_textarea_field($request->get_param('note'));
        $current_user = wp_get_current_user();

        if (empty($note)) {
            return new WP_Error(
                'empty_note',
                'Note cannot be empty',
                ['status' => 400]
            );
        }

        // @codingStandardsIgnoreStart
        $result = $wpdb->insert(
            $wpdb->prefix . 'aisk_inquiry_notes',
            [
                'inquiry_id' => $inquiry_id,
                'note' => $note,
                'author_id' => get_current_user_id(),
                'author' => $current_user->display_name,
                'created_at' => gmdate('Y-m-d H:i:s'),
            ],
            ['%d', '%s', '%d', '%s', '%s']
        );
        // @codingStandardsIgnoreEnd

        if (false === $result) {
            return new WP_Error(
                'note_creation_failed',
                'Failed to create note',
                ['status' => 500]
            );
        }

        // Clear related caches
        wp_cache_delete('aisk_inquiry_notes_' . $inquiry_id, 'aisk_inquiries');
        wp_cache_delete('aisk_inquiry_details_' . $inquiry_id, 'aisk_inquiries');

        // Send email notification to customer
        $this->send_note_notification($inquiry_id, $note);

        return [
            'success' => true,
            'note_id' => $wpdb->insert_id,
        ];
    }

    /**
     * Send note notification
     *
     * @param int    $inquiry_id The inquiry ID
     * @param string $note       The note content
     * @return void
     */
    private function send_note_notification($inquiry_id, $note) {
        global $wpdb;

        // Get inquiry details from cache or database
        $cache_key = 'aisk_inquiry_details_' . $inquiry_id;
        $inquiry = wp_cache_get($cache_key, 'aisk_inquiries');
        
        if (false === $inquiry) {
            // @codingStandardsIgnoreStart
            $inquiry = $wpdb->get_row(
                $wpdb->prepare(
                    "SELECT * FROM {$wpdb->prefix}aisk_inquiries WHERE id = %d",
                    $inquiry_id
                )
            );
            // @codingStandardsIgnoreEnd
            
            if ($inquiry) {
                wp_cache_set($cache_key, $inquiry, 'aisk_inquiries', 300);
            }
        }

        if (!$inquiry) {
            return;
        }

        $to = $inquiry->customer_email;
        $subject = sprintf('Update on your inquiry #%d', $inquiry_id);

        $message = "Hello,\n\n";
        $message .= "There has been an update on your inquiry:\n\n";
        $message .= $note . "\n\n";
        $message .= "Best regards,\n";
        $message .= get_bloginfo('name');

        wp_mail($to, $subject, $message);
    }

    /**
     * Update inquiry status
     *
     * @param WP_REST_Request $request The incoming request object
     * @return array|WP_Error Success response or error
     */
    public function update_inquiry_status($request) {
        global $wpdb;

        $inquiry_id = $request->get_param('id');
        $new_status = $request->get_param('status');

        // Get current inquiry data from cache or database
        $cache_key = 'aisk_inquiry_details_' . $inquiry_id;
        $inquiry = wp_cache_get($cache_key, 'aisk_inquiries');
        
        if (false === $inquiry) {
            // @codingStandardsIgnoreStart
            $inquiry = $wpdb->get_row(
                $wpdb->prepare(
                    "SELECT * FROM {$wpdb->prefix}aisk_inquiries WHERE id = %d",
                    $inquiry_id
                )
            );
            // @codingStandardsIgnoreEnd
        }

        if (!$inquiry) {
            return new WP_Error('inquiry_not_found', 'Inquiry not found', ['status' => 404]);
        }

        // Update status
        // @codingStandardsIgnoreStart
        $result = $wpdb->update(
            $wpdb->prefix . 'aisk_inquiries',
            [
                'status' => $new_status,
                'updated_at' => gmdate('Y-m-d H:i:s'),
            ],
            ['id' => $inquiry_id],
            ['%s'],
            ['%d']
        );
        // @codingStandardsIgnoreEnd

        if (false === $result) {
            return new WP_Error('status_update_failed', 'Failed to update status', ['status' => 500]);
        }

        // Clear related caches
        wp_cache_delete($cache_key, 'aisk_inquiries');
        wp_cache_delete('aisk_inquiry_notes_' . $inquiry_id, 'aisk_inquiries');

        // Send email notification
        $this->send_status_notification($inquiry, $new_status);

        return [
            'success' => true,
            'status' => $new_status,
        ];
    }

    /**
     * Send status notification
     *
     * @param object $inquiry    The inquiry object
     * @param string $new_status The new status
     * @return void
     */
    private function send_status_notification($inquiry, $new_status) {
        $to = $inquiry->customer_email;
        $subject = sprintf('Update on your inquiry #%d', $inquiry->id);

        $status_messages = [
            'pending' => 'Your inquiry is pending review by our support team.',
            'in_progress' => 'Our support team is currently working on your inquiry.',
            'resolved' => 'Your inquiry has been resolved. Please let us know if you need any further assistance.',
        ];

        $message = "Hello,\n\n";
        $message .= 'The status of your inquiry has been updated to: ' . strtoupper($new_status) . "\n\n";
        $message .= $status_messages[ $new_status ] . "\n\n";
        $message .= 'Order Number: ' . $inquiry->order_number . "\n";
        $message .= 'Original Inquiry: ' . $inquiry->note . "\n\n";
        $message .= "Best regards,\n";
        $message .= get_bloginfo('name');

        wp_mail($to, $subject, $message);
    }

    /**
     * Create new conversation
     *
     * Creates a new chat conversation with user details
     *
     * @param WP_REST_Request $request The incoming request object
     *
     * @since 1.0.0
     *
     * @return array New conversation details
     */
    public function create_conversation( $request ) {
        $user_id = get_current_user_id();
        $params = $request->get_params();
        
        $conversation_data = [
            'user_id' => $user_id ? $user_id : null,
            'user_name' => $user_id ? wp_get_current_user()->display_name : null,
            'user_email' => $user_id ? wp_get_current_user()->user_email : null,
            'ip_address' => isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'])) : null,
            'user_agent' => sanitize_text_field(isset($params['userAgent']) ? $params['userAgent'] : ''),
            'page_url' => esc_url_raw(isset($params['url']) ? $params['url'] : ''),
            'platform' => 'web',
            'city' => isset($params['city']) ? sanitize_text_field($params['city']) : null,
            'country' => isset($params['country']) ? sanitize_text_field($params['country']) : null,
            'country_code' => isset($params['country_code']) ? sanitize_text_field($params['country_code']) : null,
            'intents' => json_encode([]),
        ];

        try {
            $conversation_id = $this->chat_storage->create_conversation($conversation_data);
            
            // Verify the conversation was created
            $created_conversation = $this->chat_storage->get_conversation($conversation_id);
            
            if (!$created_conversation) {
                return new WP_Error('conversation_creation_failed', 'Failed to verify conversation creation');
            }

            // Add welcome message
            // $settings = get_option('aisk_settings');
            // $welcome_message = isset($settings['general']['welcome_message']) 
            //     ? $settings['general']['welcome_message'] 
            //     : 'Hello! How can I assist you today?';
            
            // $this->chat_storage->add_message($conversation_id, 'bot', $welcome_message);
            
            return [
                'conversation_id' => $conversation_id,
                'created_at' => gmdate('c'),
            ];
        } catch (Exception $e) {
            return new WP_Error('conversation_creation_failed', $e->getMessage());
        }
    }

    /**
     * Update conversation intents
     *
     * @param string $conversation_id The conversation ID
     * @param array  $intents         The intents to store
     * @return int|false Number of rows affected or false on error
     */
    public function update_conversation_intents($conversation_id, $intents) {
        // Generate cache key
        $cache_key = 'aisk_conversation_intents_' . $conversation_id;
        
        // @codingStandardsIgnoreStart
        global $wpdb;
        $result = $wpdb->update(
            $wpdb->prefix . 'aisk_conversations',
            [
                'intents' => json_encode($intents),
                'updated_at' => gmdate('c'),
            ],
            ['conversation_id' => $conversation_id]
        );
        // @codingStandardsIgnoreEnd

        if ($result !== false) {
            // Clear the cache after successful update
            wp_cache_delete($cache_key, 'aisk_conversations');
            wp_cache_delete('aisk_conversations_' . md5(serialize(['conversation_id' => $conversation_id])), 'aisk_conversations');
        }

        return $result;
    }

    /**
     * Get conversations
     *
     * @param WP_REST_Request $request The incoming request object
     * @return array List of conversations
     */
    public function get_conversations($request) {
        global $wpdb;

        $page = max(1, intval($request->get_param('page')));
        $per_page = max(10, intval($request->get_param('per_page')));
        $location_filter = sanitize_text_field($request->get_param('location_filter'));
        $time_filter = sanitize_text_field($request->get_param('time_filter'));

        // Generate cache key based on request parameters
        $cache_key = 'aisk_conversations_' . md5(serialize([
            'page' => $page,
            'per_page' => $per_page,
            'location' => $location_filter,
            'time' => $time_filter,
            'user_id' => get_current_user_id(),
            'is_admin' => current_user_can('manage_options')
        ]));

        // Try to get cached results
        $cached_data = wp_cache_get($cache_key, 'aisk_conversations');
        if (false !== $cached_data) {
            return $cached_data;
        }

        if (current_user_can('manage_options')) {
            // Admin query
            $query = "SELECT * FROM {$wpdb->prefix}aisk_conversations WHERE 1=1";
            $params = [];

            if ($location_filter !== 'all' && !empty($location_filter)) {
                $query .= " AND LOWER(city) = LOWER(%s)";
                $params[] = $location_filter;
            }
            if (!empty($time_filter)) {
                $query .= " AND created_at >= DATE_SUB(NOW(), INTERVAL %s DAY)";
                $params[] = intval(str_replace('days', '', $time_filter));
            }

            // @codingStandardsIgnoreStart
            $total_query = str_replace("SELECT *", "SELECT COUNT(*)", $query);
            $total = !empty($params) ? $wpdb->get_var($wpdb->prepare($total_query, ...$params)) : $wpdb->get_var($total_query);
            
            $query .= " ORDER BY created_at DESC LIMIT %d OFFSET %d";
            $params[] = $per_page;
            $params[] = ($page - 1) * $per_page;

            $conversations = !empty($params) ? $wpdb->get_results($wpdb->prepare($query, ...$params)) : $wpdb->get_results($query);

            $locations_query = "SELECT DISTINCT city FROM {$wpdb->prefix}aisk_conversations WHERE city IS NOT NULL AND city != '' ORDER BY city ASC";
            $locations = $wpdb->get_col($locations_query);
            // @codingStandardsIgnoreEnd

            $result = [
                'conversations' => $conversations,
                'total' => intval($total),
                'pages' => ceil($total / $per_page),
                'current_page' => $page,
                'locations' => $locations,
            ];
        } else {
            // For non-admin users
            $user_id = get_current_user_id();
            $ip_address = isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'])) : '';
            $user_agent = isset($_SERVER['HTTP_USER_AGENT']) ? sanitize_text_field(wp_unslash($_SERVER['HTTP_USER_AGENT'])) : '';
            
            $query = "SELECT * FROM {$wpdb->prefix}aisk_conversations WHERE ";
            $params = [];
            
            if ($user_id) {
                $query .= "user_id = %d";
                $params[] = $user_id;
            } else {
                $query .= "(ip_address = %s AND user_agent = %s)";
                $params[] = $ip_address;
                $params[] = $user_agent;
            }
            
            if (!empty($time_filter)) {
                $query .= " AND created_at >= DATE_SUB(NOW(), INTERVAL %s DAY)";
                $params[] = intval(str_replace('days', '', $time_filter));
            }
            
            if ($location_filter !== 'all' && !empty($location_filter)) {
                $query .= " AND LOWER(city) = LOWER(%s)";
                $params[] = $location_filter;
            }
            
            // @codingStandardsIgnoreStart
            $total_query = str_replace("SELECT *", "SELECT COUNT(*)", $query);
            $total = $wpdb->get_var($wpdb->prepare($total_query, ...$params));
            
            $query .= " ORDER BY created_at DESC LIMIT %d OFFSET %d";
            $params[] = $per_page;
            $params[] = ($page - 1) * $per_page;
            
            $conversations = $wpdb->get_results($wpdb->prepare($query, ...$params));
            // @codingStandardsIgnoreEnd
            
            $result = [
                'conversations' => $conversations ? $conversations : [],
                'total' => intval($total),
                'pages' => ceil($total / $per_page),
                'current_page' => $page,
            ];
        }

        // Cache the results for 5 minutes
        wp_cache_set($cache_key, $result, 'aisk_conversations', 300);

        return $result;
    }

    /**
     * Get single conversation
     *
     * Retrieves details of a specific conversation
     *
     * @param WP_REST_Request $request The incoming request object
     *
     * @since 1.0.0
     *
     * @return array|WP_Error Conversation details or error
     */
    public function get_conversation( $request ) {
        $conversation_id = $request->get_param('id');
        $conversation = $this->chat_storage->get_conversation($conversation_id);

        if ( ! $conversation ) {
            return new WP_Error(
                'conversation_not_found',
                'Conversation not found',
                [ 'status' => 404 ]
            );
        }

        // Check if user has access to this conversation
        if ( ! current_user_can('manage_options') ) {
            $user_id = get_current_user_id();
            $ip_address = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';
            $user_agent = isset( $_SERVER['HTTP_USER_AGENT'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) ) : '';

            // For authenticated users, check user_id
            if ($user_id) {
                if ($conversation->user_id !== $user_id) {
                    return new WP_Error(
                        'unauthorized',
                        'You do not have permission to view this conversation',
                        [ 'status' => 403 ]
                    );
                }
            } else {
                // For unauthenticated users, check both IP and user agent
                if ($conversation->ip_address !== $ip_address || $conversation->user_agent !== $user_agent) {
                    return new WP_Error(
                        'unauthorized',
                        'You do not have permission to view this conversation',
                        [ 'status' => 403 ]
                    );
                }
            }
        }

        return $conversation;
    }

    /**
     * Get conversation messages
     *
     * Retrieves messages for a specific conversation
     *
     * @param WP_REST_Request $request The incoming request object
     *
     * @since 1.0.0
     *
     * @return array|WP_Error List of messages or error
     */
    public function get_messages($request) {
        $conversation_id = $request->get_param('conversation_id');
        if (empty($conversation_id)) {
            return new WP_Error(
                'missing_conversation_id',
                'Conversation ID is required',
                ['status' => 400]
            );
        }

        // Verify access to the conversation
        if (!$this->verify_conversation_access($request)) {
            return new WP_Error(
                'unauthorized',
                'You do not have access to this conversation',
                ['status' => 401]
            );
        }

        $messages = $this->chat_storage->get_messages($conversation_id);
        
        if (empty($messages)) {
            return [];
        }

        return $messages;
    }

    /**
     * Handle product search
     *
     * Processes product search requests and returns matching products
     *
     * @param array $intent The classified intent data
     *
     * @since 1.0.0
     *
     * @return array Search response with products
     */

    private function handle_product_search( $intent, $message, $content_type = '' ) {
        // Check if WooCommerce is enabled
        $settings = get_option('aisk_settings');
        if (empty($settings['ai_config']['woocommerce_enabled'])) {
            return [
                'message' => __("Product search is currently disabled. Please enable WooCommerce integration in the settings.", 'promo-bar-x'),
                'products' => []
            ];
        }

        // Get relevant content from embeddings
        $similar_ids = $this->embeddings_handler->find_similar_content( $message, 5, 0.3, $content_type, 'product_search' );
        $products = $this->product_handler->search_products($similar_ids);

        if ( empty($products) ) {
            $default_message = sprintf(
                /* translators: %s: product category or 'products' */
                /* translators: %s: Content type (e.g., products, articles) */
            __("I couldn't find any %s matching your request. Could you please try describing what you're looking for in a different way?", 'promo-bar-x'),
                isset($intent['category']) ? $intent['category'] : __('products', 'promo-bar-x')
            );

            return [
                'message' => isset($intent['responses']['not_found']) ? $intent['responses']['not_found'] : $default_message,
                'products' => [],
            ];
        }

        return [
            'message' => isset($intent['responses']['found']) ? $intent['responses']['found'] : __('Awesome! Here are some products you might like:', 'promo-bar-x'),
            'products' => $products,
        ];
    }

    /**
     * Handle order requests
     *
     * Processes order-related requests and returns order information
     *
     * @param array $intent The classified intent data
     *
     * @since 1.0.0
     *
     * @return array Order response data
     */
    private function handle_order_status_request( $intent ) {
        $response = $this->order_handler->get_order_status($intent);

        if ( 'order_verified' !== $response['type'] ) {
            return [
                'message' => $response['message'],
                'order' => $response,
            ];
        }

        // Format order details for OrderStatus component
        $order_info = $response['order_info'];
        $formatted_order = [
            'order_number' => $order_info['order_number'],
            'status' => $order_info['status'],
            'date_created' => $order_info['date_created'],
            'total' => $order_info['total'],
            'shipping_method' => $order_info['shipping_method'],
            'shipping_address' => $order_info['shipping_address'],
            'tracking_number' => $order_info['tracking_number'] ?? '',
            'items' => array_map(function($item) {
                return [
                    'name' => $item['name'],
                    'quantity' => $item['quantity'],
                    'total' => $item['total'],
                    'image' => $item['image'] ?? ''
                ];
            }, $order_info['items'] ?? [])
        ];

        return [
            'message' => $this->order_handler->format_order_status_response($response),
            'order' => [
                'type' => 'order_verified',
                'order_info' => $formatted_order
            ]
        ];
    }

    /**
     * Handle general query
     *
     * Processes general chat queries using AI
     *
     * @param string $message         The user's message
     * @param string $conversation_id The conversation ID
     *
     * @since 1.0.0
     *
     * @return array Response message
     */
    private function handle_general_query( $message, $conversation_id, $content_type = '' ) {
        try {
            $response = $this->get_ai_response( $message, $conversation_id, $content_type );
            if (is_wp_error($response)) {
                return [
                    'message' => $response->get_error_message()
                ];
            }
            return $response;
        } catch ( Exception $e ) {
            return [
                'message' => "I apologize, but I'm having trouble processing your request. Please try again in a moment.",
            ];
        }
    }

    private function handle_product_info_search( $message, $conversation_id, $content_type = '' ) {
        try {
            // First, try with 'product' content type only
            $primary_content_types = ['product'];
            $response = $this->get_ai_response($message, $conversation_id, $primary_content_types);
            // If the response is empty or generic, fallback to broader content types
            $no_info_phrases = [
                "I'm sorry, but I don't have specific information",
                "I don't have specific information",
                "I recommend checking",
                "I apologize, but I'm having trouble processing your request. Please try again in a moment."
            ];
            $is_empty = false;
            if (is_array($response) && isset($response['message'])) {
                foreach ($no_info_phrases as $phrase) {
                    if (stripos($response['message'], $phrase) !== false) {
                        $is_empty = true;
                        break;
                    }
                }
            } elseif (is_string($response)) {
                foreach ($no_info_phrases as $phrase) {
                    if (stripos($response, $phrase) !== false) {
                        $is_empty = true;
                        break;
                    }
                }
            }
            // If empty or generic, fallback to all content types
            if ($is_empty || empty($response) || (is_array($response) && empty($response['message']))) {
                $fallback_content_types = ['external_url', 'post', 'page', 'pdf', 'webpage'];
                $response = $this->get_ai_response($message, $conversation_id, $fallback_content_types);
            }
            return is_array($response) ? $response : [ 'message' => $response ];
        } catch ( Exception $e ) {
            return [
                'message' => "I apologize, but I'm having trouble processing your request. Please try again in a moment.",
            ];
        }
    }

    /**
     * Get AI response
     *
     * Retrieves AI-generated response for a message
     *
     * @param string $message         The user's message
     * @param string $conversation_id The conversation ID
     *
     * @since 1.0.0
     *
     * @return array|WP_Error AI response or error
     */
    private function get_ai_response( $message, $conversation_id, $content_type = '' ) {
        try {
            // Get conversation history
            $history = $this->chat_storage->get_recent_message_history($conversation_id, 5);
            $conversation_context = '';
            
            // Format conversation history
            foreach ($history as $msg) {
                $role = $msg['bot'] ? 'Assistant' : 'User';
                $conversation_context .= "{$role}: {$msg['message']}\n";
            }

            // Get relevant content with lower similarity threshold
            $similar_content = $this->embeddings_handler->find_similar_content(
                $message,  
                6,        
                0.3,      // Lowered threshold for better matches
                $content_type,
                ''        
            );

            // Enhanced context preparation
            $content_context = '';
            if (!empty($similar_content)) {
                // Sort content by similarity score if available
                if (isset($similar_content[0]['similarity_score'])) {
                    usort($similar_content, function($a, $b) {
                        $scoreA = isset($a['similarity_score']) ? $a['similarity_score'] : 0;
                        $scoreB = isset($b['similarity_score']) ? $b['similarity_score'] : 0;
                        return $scoreB <=> $scoreA;
                    });
                }

                // Add most relevant content first
                foreach ($similar_content as $content) {
                    if (!isset($content['content_type']) || !isset($content['content_chunk'])) {
                        continue; // Skip invalid entries
                    }

                    if ($content['content_type'] === 'settings') {
                        // For settings, directly use the content as it contains structured information
                        $content_context .= $content['content_chunk'] . "\n\n";
                    } else {
                        $content_context .= "Source ({$content['content_type']}): " . $content['content_chunk'] . "\n\n";
                    }
                }
            }

            // Prepare system message with enhanced context and instructions
            $system_message = "You are a helpful AI assistant for an e-commerce website. ";
            $system_message .= "Use the following information to answer the user's question accurately and directly:\n\n";
            $system_message .= $content_context;
            $system_message .= "\nPrevious conversation:\n" . $conversation_context;
            $system_message .= "\nImportant instructions:";
            $system_message .= "\n1. For general conversation (greetings, small talk):";
            $system_message .= "\n   - Use friendly, casual responses";
            $system_message .= "\n   - Match the user's tone and formality level";
            $system_message .= "\n   - Keep it light and welcoming";
            $system_message .= "\n2. For general inquiries (store policies, information):";
            $system_message .= "\n   - Use informative, helpful responses";
            $system_message .= "\n   - Be clear about what information you're providing";
            $system_message .= "\n   - Include relevant details from the context";
            $system_message .= "\n3. If the question is about store information (hours, contact, etc), use ONLY the provided store information.";
            $system_message .= "\n4. Give direct, specific answers based on the provided information.";
            $system_message .= "\n5. Do not make assumptions or provide generic responses when specific information is available.";
            $system_message .= "\n6. If specific information is not found in the context, acknowledge that and suggest contacting support.";
            $system_message .= "\n7. For contact support queries:";
            $system_message .= "\n   - If user needs to submit a form (account issues, technical problems, urgent assistance), set response_type to 'form'";
            $system_message .= "\n   - If user just needs information (store hours, location, general contact), set response_type to 'info'";

            // Prepare messages for API with enhanced instructions
            $messages = [
                ['role' => 'system', 'content' => $system_message],
                ['role' => 'user', 'content' => $message]
            ];

            // Call OpenAI API with adjusted parameters
            $response = wp_remote_post('https://api.openai.com/v1/chat/completions', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->openai_key,
                    'Content-Type' => 'application/json',
                ],
                'body' => json_encode([
                    'model' => 'gpt-4o-mini',
                    'messages' => $messages,
                    'temperature' => 0.3, // Lowered for more consistent responses
                    'max_tokens' => 500,
                    'presence_penalty' => 0.3, // Adjusted for better context adherence
                    'frequency_penalty' => 0.3
                ]),
                'timeout' => 30
            ]);

            if (is_wp_error($response)) {
                return new WP_Error('api_error', 'Failed to generate response');
            }

            $body = json_decode(wp_remote_retrieve_body($response), true);
            
            if (empty($body['choices'][0]['message']['content'])) {
                return new WP_Error('api_error', 'Invalid response from API');
            }

            if (isset($body['error'])) {
                $body['choices'][0]['message']['content'] = $body['error']['message'];
            }

            $ai_response = $body['choices'][0]['message']['content'];

            // Return response with content type
            return [
                'message' => $ai_response,
                'content_type' => $content_type
            ];

        } catch (Exception $e) {
            return new WP_Error('response_error', 'Failed to generate response: ' . $e->getMessage());
        }
    }

    /**
     * Prepare context for AI
     *
     * Formats content for AI context
     *
     * @param array $similar_content Array of similar content
     *
     * @since 1.0.0
     *
     * @return string Formatted context
     */
    private function prepare_context($similar_content) {
        $context = '';
        
        // Group content by type
        $grouped_content = [];
        foreach ($similar_content as $content) {
            $type = $content['content_type'];
            if (!isset($grouped_content[$type])) {
                $grouped_content[$type] = [];
            }
            $grouped_content[$type][] = $content;
        }

        // Add content type headers and format content
        foreach ($grouped_content as $type => $contents) {
            switch ($type) {
                case 'product':
                    $context .= esc_html__('Product Information:', 'promo-bar-x') . "\n";
                    foreach ($contents as $content) {
                        $context .= "- " . esc_html($content['content_chunk']) . "\n";
                    }
                    break;
                case 'order':
                    $context .= esc_html__('Order Information:', 'promo-bar-x') . "\n";
                    foreach ($contents as $content) {
                        $context .= "- " . esc_html($content['content_chunk']) . "\n";
                    }
                    break;
                case 'pdf':
                    $context .= esc_html__('Document Information:', 'promo-bar-x') . "\n";
                    foreach ($contents as $content) {
                        $context .= "- " . esc_html($content['content_chunk']) . "\n";
                    }
                    break;
                case 'external_url':
                    $context .= esc_html__('External Resource Information:', 'promo-bar-x') . "\n";
                    foreach ($contents as $content) {
                        $context .= "- " . esc_html($content['content_chunk']) . "\n";
                    }
                    break;
                case 'post':
                    $context .= esc_html__('Blog Post Information:', 'promo-bar-x') . "\n";
                    foreach ($contents as $content) {
                        $context .= "- " . esc_html($content['content_chunk']) . "\n";
                    }
                    break;
                case 'page':
                    $context .= esc_html__('Page Information:', 'promo-bar-x') . "\n";
                    foreach ($contents as $content) {
                        $context .= "- " . esc_html($content['content_chunk']) . "\n";
                    }
                    break;
                case 'settings':
                    $context .= esc_html__('Store Information:', 'promo-bar-x') . "\n";
                    foreach ($contents as $content) {
                        $context .= "- " . esc_html($content['content_chunk']) . "\n";
                    }
                    break;
                default:
                    $context .= esc_html__('Additional Information:', 'promo-bar-x') . "\n";
                    foreach ($contents as $content) {
                        $context .= "- " . esc_html($content['content_chunk']) . "\n";
                    }
            }
            $context .= "\n";
        }

        return $context;
    }
}

new AISK_Chat_Handler();
