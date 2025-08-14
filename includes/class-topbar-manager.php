<?php
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Main Top Bar Manager Class
 *
 * @category WordPress
 * @package  PromoBarX
 * @author   WPPOOL Team <support@wppool.com>
 * @license  GPL-2.0+ https://www.gnu.org/licenses/gpl-2.0.html
 */

class PromoBarX_Manager {

    private $database;
    private static $instance = null;

    /**
     * Get singleton instance
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor
     */
    private function __construct() {
        $this->database = new PromoBarX_Database();
        $this->init_hooks();
    }

    /**
     * Initialize WordPress hooks
     */
    private function init_hooks() {
        add_action('wp_head', [$this, 'render_topbar']);
        add_action('wp_footer', [$this, 'render_topbar_scripts']);
        add_action('wp_ajax_promobarx_save', [$this, 'ajax_save_promo_bar']);
        add_action('wp_ajax_promobarx_delete', [$this, 'ajax_delete_promo_bar']);
        add_action('wp_ajax_promobarx_track_event', [$this, 'ajax_track_event']);
        add_action('wp_ajax_nopriv_promobarx_track_event', [$this, 'ajax_track_event']);
        add_action('wp_ajax_promobarx_get_promo_bars', [$this, 'ajax_get_promo_bars']);
        add_action('wp_ajax_promobarx_get_promo_bar', [$this, 'ajax_get_promo_bar']);
        add_action('wp_ajax_promobarx_get_templates', [$this, 'ajax_get_templates']);
    }

    /**
     * Get active promo bar for current page
     */
    public function get_active_promo_bar() {
        global $wp_query;
        
        $current_url = $_SERVER['REQUEST_URI'] ?? '';
        $post_id = get_queried_object_id();
        $post_type = get_post_type();
        
        error_log('PromoBarX: get_active_promo_bar() called');
        error_log('PromoBarX: Current URL: ' . $current_url);
        error_log('PromoBarX: Post ID: ' . $post_id);
        error_log('PromoBarX: Post Type: ' . $post_type);
        
        // Get all active promo bars
        $promo_bars = $this->database->get_promo_bars(['status' => 'active']);
        error_log('PromoBarX: Found ' . count($promo_bars) . ' active promo bars');
        
        $candidates = [];
        
        foreach ($promo_bars as $promo_bar) {
            error_log('PromoBarX: Checking promo bar ID: ' . $promo_bar->id . ', Name: ' . $promo_bar->name);
            $score = $this->calculate_page_match_score($promo_bar, $current_url, $post_id, $post_type);
            error_log('PromoBarX: Score for promo bar ' . $promo_bar->id . ': ' . $score);
            if ($score > 0) {
                $candidates[] = [
                    'promo_bar' => $promo_bar,
                    'score' => $score
                ];
            }
        }
        
        error_log('PromoBarX: Found ' . count($candidates) . ' candidates');
        
        // Sort by score and priority
        usort($candidates, function($a, $b) {
            if ($a['score'] !== $b['score']) {
                return $b['score'] - $a['score'];
            }
            return $b['promo_bar']->priority - $a['promo_bar']->priority;
        });
        
        if (!empty($candidates)) {
            $selected = $candidates[0]['promo_bar'];
            error_log('PromoBarX: Selected promo bar ID: ' . $selected->id . ', Name: ' . $selected->name);
            
            // Check if promo bar is scheduled
            if ($this->is_promo_bar_scheduled($selected)) {
                error_log('PromoBarX: Promo bar is scheduled to show');
                return $selected;
            } else {
                error_log('PromoBarX: Promo bar is not scheduled to show');
            }
        } else {
            error_log('PromoBarX: No candidates found');
        }
        
        return null;
    }

    /**
     * Calculate page match score for a promo bar
     */
    private function calculate_page_match_score($promo_bar, $current_url, $post_id, $post_type) {
        global $wpdb;
        
        $score = 0;
        $assignments = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}promo_bar_assignments WHERE promo_bar_id = %d ORDER BY priority DESC",
            $promo_bar->id
        ));
        
        error_log('PromoBarX: Found ' . count($assignments) . ' assignments for promo bar ' . $promo_bar->id);
        
        foreach ($assignments as $assignment) {
            error_log('PromoBarX: Assignment type: ' . $assignment->assignment_type . ', Target ID: ' . $assignment->target_id . ', Target Value: ' . $assignment->target_value);
            switch ($assignment->assignment_type) {
                case 'global':
                    $score = 100;
                    error_log('PromoBarX: Global assignment - score set to 100');
                    break;
                    
                case 'page':
                    if ($assignment->target_id == $post_id) {
                        $score = 90;
                        error_log('PromoBarX: Page match - score set to 90');
                    }
                    break;
                    
                case 'post_type':
                    if ($assignment->target_value === $post_type) {
                        $score = 80;
                        error_log('PromoBarX: Post type match - score set to 80');
                    }
                    break;
                    
                case 'category':
                    if (has_category($assignment->target_value, $post_id)) {
                        $score = 70;
                        error_log('PromoBarX: Category match - score set to 70');
                    }
                    break;
                    
                case 'tag':
                    if (has_tag($assignment->target_value, $post_id)) {
                        $score = 60;
                        error_log('PromoBarX: Tag match - score set to 60');
                    }
                    break;
                    
                case 'custom':
                    if ($this->matches_custom_condition($assignment->target_value, $current_url, $post_id)) {
                        $score = 50;
                        error_log('PromoBarX: Custom condition match - score set to 50');
                    }
                    break;
            }
        }
        
        error_log('PromoBarX: Final score for promo bar ' . $promo_bar->id . ': ' . $score);
        return $score;
    }

    /**
     * Check if promo bar matches custom condition
     */
    private function matches_custom_condition($condition, $current_url, $post_id) {
        // Simple URL matching for now
        return strpos($current_url, $condition) !== false;
    }

    /**
     * Check if promo bar is scheduled to show
     */
    private function is_promo_bar_scheduled($promo_bar) {
        global $wpdb;
        
        $schedule = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}promo_bar_schedules WHERE promo_bar_id = %d",
            $promo_bar->id
        ));
        
        if (!$schedule) {
            return true; // No schedule means always show
        }
        
        $now = current_time('mysql');
        
        // Check date range
        if ($schedule->start_date && $now < $schedule->start_date) {
            return false;
        }
        
        if ($schedule->end_date && $now > $schedule->end_date) {
            return false;
        }
        
        // Check time range
        if ($schedule->start_time && $schedule->end_time) {
            $current_time = date('H:i:s');
            if ($current_time < $schedule->start_time || $current_time > $schedule->end_time) {
                return false;
            }
        }
        
        // Check days of week
        if ($schedule->days_of_week) {
            $days = json_decode($schedule->days_of_week, true);
            $current_day = date('N'); // 1 (Monday) to 7 (Sunday)
            if (!in_array($current_day, $days)) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * Render top bar in head
     */
    public function render_topbar() {
        error_log('PromoBarX: render_topbar() called');
        
        $promo_bar = $this->get_active_promo_bar();
        
        if (!$promo_bar) {
            error_log('PromoBarX: No active promo bar found');
            return;
        }
        
        error_log('PromoBarX: Found active promo bar - ID: ' . $promo_bar->id . ', Name: ' . $promo_bar->name);
        
        // Check if user has closed this promo bar
        $cookie_name = 'promobarx_closed_' . $promo_bar->id;
        if (isset($_COOKIE[$cookie_name])) {
            error_log('PromoBarX: Promo bar closed by user cookie');
            return;
        }
        
        error_log('PromoBarX: Rendering promo bar HTML');
        $this->render_topbar_html($promo_bar);
    }

    /**
     * Render top bar HTML
     */
    private function render_topbar_html($promo_bar) {
        $styling = json_decode($promo_bar->styling, true) ?: [];
        $cta_style = json_decode($promo_bar->cta_style, true) ?: [];
        $countdown_style = json_decode($promo_bar->countdown_style, true) ?: [];
        $close_style = json_decode($promo_bar->close_button_style, true) ?: [];
        
        // Get template config if applicable
        $template_config = [];
        if ($promo_bar->template_id > 0) {
            global $wpdb;
            $template = $wpdb->get_row($wpdb->prepare(
                "SELECT config FROM {$wpdb->prefix}promo_bar_templates WHERE id = %d",
                $promo_bar->template_id
            ));
            if ($template) {
                $template_config = json_decode($template->config, true) ?: [];
            }
        }
        
        // Generate inline styles
        $topbar_styles = $this->generate_inline_styles($styling);
        $cta_styles = $this->generate_inline_styles($cta_style);
        $countdown_styles = $this->generate_inline_styles($countdown_style);
        $close_styles = $this->generate_inline_styles($close_style);
        
        // Render the actual promo bar HTML
        ?>
        <div id="promobarx-topbar-<?php echo esc_attr($promo_bar->id); ?>" class="promobarx-topbar" style="<?php echo esc_attr($topbar_styles); ?>">
            <div class="promobarx-content">
                <?php if (!empty($promo_bar->title)): ?>
                    <div class="promobarx-title"><?php echo esc_html($promo_bar->title); ?></div>
                <?php endif; ?>
                
                <?php if ($promo_bar->countdown_enabled && !empty($promo_bar->countdown_end_date)): ?>
                    <div class="promobarx-countdown" style="<?php echo esc_attr($countdown_styles); ?>" data-end="<?php echo esc_attr($promo_bar->countdown_end_date); ?>">
                        <span class="countdown-days">00</span>d 
                        <span class="countdown-hours">00</span>h 
                        <span class="countdown-minutes">00</span>m 
                        <span class="countdown-seconds">00</span>s
                    </div>
                <?php endif; ?>
                
                <?php if (!empty($promo_bar->cta_text) && !empty($promo_bar->cta_url)): ?>
                    <a href="<?php echo esc_url($promo_bar->cta_url); ?>" class="promobarx-cta" style="<?php echo esc_attr($cta_styles); ?>" onclick="promobarxTrackEvent(<?php echo esc_js($promo_bar->id); ?>, 'click')">
                        <?php echo esc_html($promo_bar->cta_text); ?>
                    </a>
                <?php endif; ?>
            </div>
            
            <?php if ($promo_bar->close_button_enabled): ?>
                <button class="promobarx-close" style="<?php echo esc_attr($close_styles); ?>" onclick="promobarxCloseBar(<?php echo esc_js($promo_bar->id); ?>)">
                    ×
                </button>
            <?php endif; ?>
        </div>
        
        <style>
        .promobarx-topbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 12px 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            line-height: 1.4;
            text-align: center;
            transition: all 0.3s ease;
            background: #2563eb;
            color: white;
        }
        
        .promobarx-content {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
        }
        
        .promobarx-title {
            font-weight: 600;
        }
        
        .promobarx-countdown {
            font-weight: 600;
            font-family: monospace;
        }
        
        .promobarx-cta {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.2s ease;
            white-space: nowrap;
            background: rgba(255,255,255,0.2);
            color: white;
        }
        
        .promobarx-cta:hover {
            transform: translateY(-1px);
            background: rgba(255,255,255,0.3);
        }
        
        .promobarx-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;
            transition: all 0.2s ease;
            opacity: 0.7;
            color: white;
        }
        
        .promobarx-close:hover {
            opacity: 1;
            background: rgba(255,255,255,0.1);
        }
        
        @media (max-width: 768px) {
            .promobarx-content {
                flex-direction: column;
                gap: 10px;
            }
            
            .promobarx-topbar {
                padding: 10px 15px;
                font-size: 13px;
            }
        }
        </style>
        <?php
    }

    /**
     * Generate inline styles from array
     */
    private function generate_inline_styles($styles) {
        $css = '';
        foreach ($styles as $property => $value) {
            $css .= str_replace('_', '-', $property) . ': ' . $value . '; ';
        }
        return $css;
    }

    /**
     * Render top bar scripts
     */
    public function render_topbar_scripts() {
        $promo_bar = $this->get_active_promo_bar();
        
        if (!$promo_bar) {
            return;
        }
        
        ?>
        <script>
        function promobarxTrackEvent(promoId, eventType) {
            fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'action=promobarx_track_event&promo_id=' + promoId + '&event_type=' + eventType + '&nonce=<?php echo wp_create_nonce('promobarx_track'); ?>'
            });
        }
        
        function promobarxCloseBar(promoId) {
            const bar = document.getElementById('promobarx-topbar-' + promoId);
            if (bar) {
                bar.style.transform = 'translateY(-100%)';
                setTimeout(() => {
                    bar.style.display = 'none';
                }, 300);
            }
            
            // Set cookie
            const date = new Date();
            date.setTime(date.getTime() + (24 * 60 * 60 * 1000)); // 24 hours
            document.cookie = 'promobarx_closed_' + promoId + '=1; expires=' + date.toUTCString() + '; path=/';
            
            // Track close event
            promobarxTrackEvent(promoId, 'close');
        }
        
        // Countdown timer
        document.addEventListener('DOMContentLoaded', function() {
            const countdowns = document.querySelectorAll('.promobarx-countdown');
            countdowns.forEach(function(countdown) {
                const endDate = new Date(countdown.dataset.end).getTime();
                
                function updateCountdown() {
                    const now = new Date().getTime();
                    const distance = endDate - now;
                    
                    if (distance < 0) {
                        countdown.innerHTML = 'EXPIRED';
                        return;
                    }
                    
                    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    
                    const daysEl = countdown.querySelector('.countdown-days');
                    const hoursEl = countdown.querySelector('.countdown-hours');
                    const minutesEl = countdown.querySelector('.countdown-minutes');
                    const secondsEl = countdown.querySelector('.countdown-seconds');
                    
                    if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
                    if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
                    if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
                    if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
                }
                
                updateCountdown();
                setInterval(updateCountdown, 1000);
            });
        });
        
        // Track impression
        promobarxTrackEvent(<?php echo esc_js($promo_bar->id); ?>, 'impression');
        </script>
        <?php
    }

    /**
     * AJAX save promo bar
     */
    public function ajax_save_promo_bar() {
        // Debug logging
        error_log('PromoBarX: Save request received');
        error_log('PromoBarX: POST data: ' . print_r($_POST, true));
        
        // Verify nonce
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'promobarx_admin_nonce')) {
            error_log('PromoBarX: Nonce verification failed');
            wp_send_json_error('Security check failed. Please refresh the page and try again.');
            return;
        }
        
        // Check user permissions
        if (!current_user_can('manage_options')) {
            error_log('PromoBarX: Unauthorized access attempt');
            wp_send_json_error('You do not have permission to perform this action.');
            return;
        }
        
        // Validate required fields
        $required_fields = ['name', 'title'];
        $missing_fields = [];
        foreach ($required_fields as $field) {
            if (!isset($_POST[$field]) || empty(trim($_POST[$field]))) {
                $missing_fields[] = $field;
            }
        }
        
        if (!empty($missing_fields)) {
            error_log('PromoBarX: Missing required fields: ' . implode(', ', $missing_fields));
            wp_send_json_error('Please fill in all required fields: ' . implode(', ', $missing_fields));
            return;
        }
        
        $data = $_POST;
        error_log('PromoBarX: Data to save: ' . print_r($data, true));
        
        try {
            $result = $this->database->save_promo_bar($data);
            error_log('PromoBarX: Save result: ' . print_r($result, true));
            
            if ($result) {
                wp_send_json_success(['id' => $result]);
            } else {
                // Get the last database error for debugging
                global $wpdb;
                $db_error = $wpdb->last_error;
                error_log('PromoBarX: Database error: ' . $db_error);
                
                if (!empty($db_error)) {
                    wp_send_json_error('Database error: ' . $db_error);
                } else {
                    wp_send_json_error('Failed to save promo bar. Please check the data and try again.');
                }
            }
        } catch (Exception $e) {
            error_log('PromoBarX: Exception during save: ' . $e->getMessage());
            wp_send_json_error('An error occurred while saving: ' . $e->getMessage());
        }
    }

    /**
     * AJAX delete promo bar
     */
    public function ajax_delete_promo_bar() {
        check_ajax_referer('promobarx_admin_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }
        
        $id = intval($_POST['id']);
        $result = $this->database->delete_promo_bar($id);
        
        if ($result) {
            wp_send_json_success();
        } else {
            wp_send_json_error('Failed to delete promo bar');
        }
    }

    /**
     * AJAX track event
     */
    public function ajax_track_event() {
        check_ajax_referer('promobarx_track', 'nonce');
        
        $promo_id = intval($_POST['promo_id']);
        $event_type = sanitize_text_field($_POST['event_type']);
        
        $data = [
            'page_url' => $_SERVER['HTTP_REFERER'] ?? '',
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
            'ip_address' => $_SERVER['REMOTE_ADDR'] ?? '',
            'user_id' => get_current_user_id()
        ];
        
        $result = $this->database->track_event($promo_id, $event_type, $data);
        
        if ($result) {
            wp_send_json_success();
        } else {
            wp_send_json_error('Failed to track event');
        }
    }

    /**
     * AJAX get promo bars
     */
    public function ajax_get_promo_bars() {
        check_ajax_referer('promobarx_admin_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }
        
        $args = [
            'status' => isset($_POST['status']) ? sanitize_text_field($_POST['status']) : 'all',
            'limit' => isset($_POST['limit']) ? intval($_POST['limit']) : -1
        ];
        
        $promo_bars = $this->database->get_promo_bars($args);
        wp_send_json_success($promo_bars);
    }

    /**
     * AJAX get single promo bar
     */
    public function ajax_get_promo_bar() {
        check_ajax_referer('promobarx_admin_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }
        
        $id = intval($_POST['id']);
        error_log('PromoBarX: Fetching promo bar with ID: ' . $id);
        
        $promo_bar = $this->database->get_promo_bar($id);
        
        if ($promo_bar) {
            error_log('PromoBarX: Found promo bar data: ' . print_r($promo_bar, true));
            wp_send_json_success($promo_bar);
        } else {
            error_log('PromoBarX: Promo bar not found with ID: ' . $id);
            wp_send_json_error('Promo bar not found');
        }
    }

    /**
     * AJAX get templates
     */
    public function ajax_get_templates() {
        check_ajax_referer('promobarx_admin_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }
        
        $category = isset($_POST['category']) ? sanitize_text_field($_POST['category']) : '';
        $templates = $this->database->get_templates($category);
        wp_send_json_success($templates);
    }
}
