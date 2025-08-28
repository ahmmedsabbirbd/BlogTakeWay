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
        
        // Page assignment AJAX handlers
        add_action('wp_ajax_promobarx_get_pages', [$this, 'ajax_get_pages']);
        add_action('wp_ajax_promobarx_get_post_types', [$this, 'ajax_get_post_types']);
        add_action('wp_ajax_promobarx_get_taxonomies', [$this, 'ajax_get_taxonomies']);
        add_action('wp_ajax_promobarx_get_assignments', [$this, 'ajax_get_assignments']);
        add_action('wp_ajax_promobarx_save_assignments', [$this, 'ajax_save_assignments']);
        add_action('wp_ajax_promobarx_force_create_tables', [$this, 'ajax_force_create_tables']);
        add_action('wp_ajax_promobarx_force_recreate_assignments_table', [$this, 'ajax_force_recreate_assignments_table']);
        add_action('wp_ajax_promobarx_get_analytics', [$this, 'ajax_get_analytics']);
    }

    /**
     * Get active promo bar for current page
     */
    public function get_active_promo_bar() {
        global $wp_query;
        
        $current_url = isset($_SERVER['REQUEST_URI']) ? sanitize_text_field(wp_unslash($_SERVER['REQUEST_URI'])) : '';
        $post_id = get_queried_object_id();
        $post_type = get_post_type();
        

        
        // Get user context for advanced targeting
        $user_context = $this->get_user_context();

        
        // Get all promo bars with their assignments (we'll filter by status and countdown in the loop)
        $promo_bars = $this->database->get_promo_bars_with_assignments(['status' => 'active']);

        
        $matching_promo_bars = [];
        
        foreach ($promo_bars as $promo_bar) {

            
            // Check status and countdown date first
            if ($this->is_countdown_blocked($promo_bar->id, $user_context)) {

                continue;
            }
            
            // Check if promo bar has matching assignments (no scoring, just match/no match)
            if ($this->has_matching_assignments($promo_bar, $current_url, $post_id, $post_type)) {

                $matching_promo_bars[] = $promo_bar;
            } else {

            }
        }
        

        
        if (!empty($matching_promo_bars)) {
            // Sort by max priority from assignments (highest priority first)
            usort($matching_promo_bars, function($a, $b) {
                $a_priority = isset($a->max_priority) ? $a->max_priority : 0;
                $b_priority = isset($b->max_priority) ? $b->max_priority : 0;
                return $b_priority - $a_priority;
            });
            
            $selected = $matching_promo_bars[0];
            $selected_priority = isset($selected->max_priority) ? $selected->max_priority : 0;

            
            // Check if promo bar is scheduled
            if ($this->is_promo_bar_scheduled($selected)) {

                return $selected;
            } else {

            }
        } else {

        }
        
        return null;
    }

    /**
     * Check if promo bar has matching assignments
     */
    private function has_matching_assignments($promo_bar, $current_url, $post_id, $post_type) {

        
        // Check if promo bar has assignments
        if (!isset($promo_bar->assignments) || empty($promo_bar->assignments)) {

            return false;
        }
        
        // Check each assignment - if any match, return true
        foreach ($promo_bar->assignments as $assignment) {
            if ($this->assignment_matches($assignment, $current_url, $post_id, $post_type)) {

                return true;
            }
        }
        

        return false;
    }

    /**
     * Check if a single assignment matches the current page
     */
    private function assignment_matches($assignment, $current_url, $post_id, $post_type) {
        $assignment_type = $assignment['assignment_type'] ?? 'global';
        $target_id = $assignment['target_id'] ?? 0;
        $target_value = $assignment['target_value'] ?? '';
        

        
        switch ($assignment_type) {
            case 'global':

                return true;
                
            case 'page':
                if ($target_id == $post_id) {

                    return true;
                }
                break;
                
            case 'post_type':
                if ($target_value === $post_type) {

                    return true;
                }
                break;
                
            case 'category':
                if (has_category($target_value, $post_id)) {

                    return true;
                }
                break;
                
            case 'tag':
                if (has_tag($target_value, $post_id)) {

                    return true;
                }
                break;
                
            case 'custom':
                if ($this->matches_custom_condition($target_value, $current_url, $post_id)) {

                    return true;
                }
                break;
        }
        

        return false;
    }

    /**
     * Check if promo bar matches custom condition
     */
    private function matches_custom_condition($condition, $current_url, $post_id) {
        // Simple URL matching for now
        return strpos($current_url, $condition) !== false;
    }

    /**
     * Get user context for advanced targeting
     */
    private function get_user_context() {
        $context = [
            'user_id' => get_current_user_id(),
            'user_roles' => $this->get_user_roles(),
            'is_logged_in' => is_user_logged_in(),
            'device_type' => $this->get_device_type(),
            'referrer' => $this->get_referrer(),
            'country' => $this->get_user_country(),
            'ip_address' => $this->get_user_ip(),
            'timezone' => $this->get_user_timezone(),
            'session_id' => $this->get_session_id(),
            'current_time' => current_time('mysql'),
            'day_of_week' => gmdate('N'), // 1 (Monday) to 7 (Sunday)
            'hour' => gmdate('G'), // 0-23
        ];
        
        return $context;
    }

    /**
     * Get user roles
     */
    private function get_user_roles() {
        if (!is_user_logged_in()) {
            return ['guest'];
        }
        
        $user = wp_get_current_user();
        return $user->roles ?: ['subscriber'];
    }

    /**
     * Get device type
     */
    private function get_device_type() {
        $user_agent = isset($_SERVER['HTTP_USER_AGENT']) ? sanitize_text_field(wp_unslash($_SERVER['HTTP_USER_AGENT'])) : '';
        
        if (preg_match('/(tablet|ipad|playbook)|(android(?!.*(mobi|opera mini)))/i', strtolower($user_agent))) {
            return 'tablet';
        }
        
        if (preg_match('/(up.browser|up.link|mmp|symbian|smartphone|midp|wap|phone|android|iemobile)/i', strtolower($user_agent))) {
            return 'mobile';
        }
        
        return 'desktop';
    }

    /**
     * Get referrer
     */
    private function get_referrer() {
        return isset($_SERVER['HTTP_REFERER']) ? sanitize_text_field(wp_unslash($_SERVER['HTTP_REFERER'])) : '';
    }

    /**
     * Get user country (simplified)
     */
    private function get_user_country() {
        // This is a simplified implementation
        // In production, you might want to use a proper geolocation service
        return 'unknown';
    }

    /**
     * Get user IP address
     */
    private function get_user_ip() {
        $ip_keys = ['HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'];
        
        foreach ($ip_keys as $key) {
            if (array_key_exists($key, $_SERVER) === true) {
                foreach (explode(',', sanitize_text_field(wp_unslash($_SERVER[$key]))) as $ip) {
                    $ip = trim($ip);
                    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false) {
                        return $ip;
                    }
                }
            }
        }
        
        return isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'])) : 'unknown';
    }

    /**
     * Get user timezone
     */
    private function get_user_timezone() {
        return wp_timezone_string();
    }

    /**
     * Get session ID
     */
    private function get_session_id() {
        if (!session_id()) {
            session_start();
        }
        return session_id();
    }

    /**
     * Check if promo bar should be shown based on status and countdown date
     */
    private function is_countdown_blocked($promo_bar_id, $user_context) {
        global $wpdb;
        
        // Try to get from cache first
        $cache_key = 'promobarx_promo_bar_' . $promo_bar_id;
        $promo_bar = wp_cache_get($cache_key, 'promobarx');
        
        if (false === $promo_bar) {
            // Get the promo bar data to check status and countdown_date
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery
            $promo_bar = $wpdb->get_row($wpdb->prepare(
                "SELECT status, countdown_date FROM {$wpdb->prefix}promo_bars WHERE id = %d",
                $promo_bar_id
            ));
            
            // Cache for 5 minutes
            wp_cache_set($cache_key, $promo_bar, 'promobarx', 300);
        }
        
        if (!$promo_bar) {
            return true; // If promo bar doesn't exist, block it
        }
        
        // First check: Status must be 'active'
        if ($promo_bar->status !== 'active') {

            return true; // Block non-active promo bars
        }
        
        // Second check: If countdown_date is set, current time must be LESS than countdown_date (show before expiry)
        if (!empty($promo_bar->countdown_date)) {
            $current_time = current_time('mysql');
            $countdown_date = $promo_bar->countdown_date;
            
            if ($current_time >= $countdown_date) {

                return true; // Return true to skip this promo bar (countdown has expired)
            }
        }
        
        return false; // Show the promo bar (active status and countdown date has passed or no countdown)
    }



    /**
     * Log analytics event
     */
    private function log_analytics_event($promo_bar_id, $event_type) {
        global $wpdb;
        
        $data = [
            'promo_bar_id' => $promo_bar_id,
            'event_type' => $event_type,
            'page_url' => isset($_SERVER['REQUEST_URI']) ? sanitize_text_field(wp_unslash($_SERVER['REQUEST_URI'])) : '',
            'user_agent' => isset($_SERVER['HTTP_USER_AGENT']) ? sanitize_text_field(wp_unslash($_SERVER['HTTP_USER_AGENT'])) : '',
            'ip_address' => $this->get_user_ip(),
            'user_id' => get_current_user_id(),
            'session_id' => $this->get_session_id(),
            'created_at' => current_time('mysql')
        ];
        
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery
        $wpdb->insert(
            $wpdb->prefix . 'promo_bar_analytics',
            $data,
            ['%d', '%s', '%s', '%s', '%s', '%d', '%s', '%s']
        );
    }

    /**
     * Check if promo bar is scheduled to show
     */
    private function is_promo_bar_scheduled($promo_bar) {
        global $wpdb;
        
        // Try to get from cache first
        $cache_key = 'promobarx_schedule_' . $promo_bar->id;
        $schedule = wp_cache_get($cache_key, 'promobarx');
        
        if (false === $schedule) {
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery
            $schedule = $wpdb->get_row($wpdb->prepare(
                "SELECT * FROM {$wpdb->prefix}promo_bar_schedules WHERE promo_bar_id = %d",
                $promo_bar->id
            ));
            
            // Cache for 10 minutes
            wp_cache_set($cache_key, $schedule, 'promobarx', 600);
        }
        
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
            $current_time = gmdate('H:i:s');
            if ($current_time < $schedule->start_time || $current_time > $schedule->end_time) {
                return false;
            }
        }
        
        // Check days of week
        if ($schedule->days_of_week) {
            $days = json_decode($schedule->days_of_week, true);
            $current_day = gmdate('N'); // 1 (Monday) to 7 (Sunday)
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

        
        $promo_bar = $this->get_active_promo_bar();
        
        if (!$promo_bar) {

            return;
        }
        

        
        // Check if user has closed this promo bar
        $cookie_name = 'promobarx_closed_' . $promo_bar->id;
        if (isset($_COOKIE[$cookie_name])) {

            return;
        }
        

        $this->render_topbar_html($promo_bar);
        
        // Also pass data to React component
        $this->render_react_data($promo_bar);
    }

    /**
     * Render top bar HTML
     */
    private function render_topbar_html($promo_bar) {
        $styling = json_decode($promo_bar->styling, true) ?: [];
        $cta_style = json_decode($promo_bar->cta_style, true) ?: [];
        $countdown_style = json_decode($promo_bar->countdown_style, true) ?: [];
        $close_style = json_decode($promo_bar->close_button_style, true) ?: [];
        
        // Extract individual element styling from the main styling object
        $title_color = $styling['title_color'] ?? $styling['color'] ?? '#ffffff';
        $title_font_size = $styling['title_font_size'] ?? 'inherit';
        $countdown_color = $styling['countdown_color'] ?? $styling['color'] ?? '#ffffff';
        $countdown_font_size = $styling['countdown_font_size'] ?? 'inherit';
        $cta_text_color = $styling['cta_text_color'] ?? $styling['background'] ?? '#3b82f6';
        $cta_font_size = $styling['cta_font_size'] ?? 'inherit';
        
        // Get template config if applicable
        $template_config = [];
        if ($promo_bar->template_id > 0) {
            global $wpdb;
            
            // Try to get from cache first
            $cache_key = 'promobarx_template_' . $promo_bar->template_id;
            $template = wp_cache_get($cache_key, 'promobarx');
            
            if (false === $template) {
                // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery
                $template = $wpdb->get_row($wpdb->prepare(
                    "SELECT config FROM {$wpdb->prefix}promo_bar_templates WHERE id = %d",
                    $promo_bar->template_id
                ));
                
                // Cache for 30 minutes (templates don't change often)
                wp_cache_set($cache_key, $template, 'promobarx', 1800);
            }
            
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
            <div class="promobarx-content" onclick="promobarxTrackEvent(<?php echo esc_js($promo_bar->id); ?>, 'click')">
                <?php if (!empty($promo_bar->title)): ?>
                    <?php 
                    $title_style = '';
                    if ($title_color) {
                        $title_style .= 'color: ' . esc_attr($title_color) . ';';
                    }
                    if ($title_font_size && $title_font_size !== 'inherit') {
                        $title_style .= 'font-size: ' . esc_attr($title_font_size) . ';';
                    }
                    ?>
                    <div class="promobarx-title" style="<?php echo esc_attr($title_style); ?>"><?php echo esc_html($promo_bar->title); ?></div>
                <?php endif; ?>
                
                <?php if ($promo_bar->countdown_enabled && !empty($promo_bar->countdown_date)): ?>
                    <?php 
                    $countdown_individual_style = '';
                    if ($countdown_color) {
                        $countdown_individual_style .= 'color: ' . esc_attr($countdown_color) . ';';
                    }
                    if ($countdown_font_size && $countdown_font_size !== 'inherit') {
                        $countdown_individual_style .= 'font-size: ' . esc_attr($countdown_font_size) . ';';
                    }
                    $final_countdown_style = $countdown_individual_style . $countdown_styles;
                    ?>
                    <div class="promobarx-countdown" style="<?php echo esc_attr($final_countdown_style); ?>" data-end="<?php echo esc_attr($promo_bar->countdown_date); ?>">
                        <span class="countdown-days">00</span>d 
                        <span class="countdown-hours">00</span>h 
                        <span class="countdown-minutes">00</span>m 
                        <span class="countdown-seconds">00</span>s
                    </div>
                <?php endif; ?>
                
                <?php if (!empty($promo_bar->cta_text) && !empty($promo_bar->cta_url)): ?>
                    <?php 
                    $cta_individual_style = '';
                    if ($cta_text_color) {
                        $cta_individual_style .= 'color: ' . esc_attr($cta_text_color) . ';';
                    }
                    if ($cta_font_size && $cta_font_size !== 'inherit') {
                        $cta_individual_style .= 'font-size: ' . esc_attr($cta_font_size) . ';';
                    }
                    $final_cta_style = $cta_styles . $cta_individual_style;
                    ?>
                    <a href="<?php echo esc_url($promo_bar->cta_url); ?>" class="promobarx-cta" style="<?php echo esc_attr($final_cta_style); ?>" onclick="event.stopPropagation(); promobarxTrackEvent(<?php echo esc_js($promo_bar->id); ?>, 'cta_click')">
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
        
        /* Add padding to body when promo bar is visible */
        body.promobarx-active {
            padding-top: var(--promobarx-height, 60px) !important;
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
     * Render React data for the promo bar
     */
    private function render_react_data($promo_bar) {
        ?>
        <script>
        window.promobarxData = {
            promoBar: <?php echo json_encode($promo_bar); ?>,
            nonce: '<?php echo esc_attr(wp_create_nonce('promobarx_track')); ?>',
            ajaxurl: '<?php echo esc_url(admin_url('admin-ajax.php')); ?>'
        };
        </script>
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
        // Add body padding when promo bar is visible
        document.addEventListener('DOMContentLoaded', function() {
            const promoBar = document.querySelector('.promobarx-topbar');
            if (promoBar) {
                // Calculate the actual height of the promo bar
                const promoBarHeight = promoBar.offsetHeight;
                
                // Set the CSS custom property with the actual height
                document.documentElement.style.setProperty('--promobarx-height', promoBarHeight + 'px');
                
                // Add the active class to body
                document.body.classList.add('promobarx-active');
            }
        });
        
        // Function to update promo bar height on window resize
        function updatePromoBarHeight() {
            const promoBar = document.querySelector('.promobarx-topbar');
            if (promoBar && document.body.classList.contains('promobarx-active')) {
                const promoBarHeight = promoBar.offsetHeight;
 
                document.documentElement.style.setProperty('--promobarx-height', promoBarHeight + 'px');
            }
        }
        
        // Listen for window resize events
        window.addEventListener('resize', updatePromoBarHeight);
        window.addEventListener('load', updatePromoBarHeight);
        
        function promobarxTrackEvent(promoId, eventType) {
            fetch('<?php echo esc_url(admin_url('admin-ajax.php')); ?>', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'action=promobarx_track_event&promo_id=' + promoId + '&event_type=' + eventType + '&nonce=<?php echo esc_attr(wp_create_nonce('promobarx_track')); ?>'
            });
        }
        
        function promobarxCloseBar(promoId) {
            const bar = document.getElementById('promobarx-topbar-' + promoId);
            if (bar) {
                bar.style.transform = 'translateY(-100%)';
                setTimeout(() => {
                    bar.style.display = 'none';
                    // Remove body padding when promo bar is hidden
                    document.body.classList.remove('promobarx-active');
                    // Remove the CSS custom property
                    document.documentElement.style.removeProperty('--promobarx-height');
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

        
        // Verify nonce
        if (!isset($_POST['nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['nonce'])), 'promobarx_admin_nonce')) {
            // Security: Nonce verification failed
            wp_send_json_error('Security check failed. Please refresh the page and try again.');
            return;
        }
        
        // Check user permissions
        if (!current_user_can('manage_options')) {
            // Security: Unauthorized access attempt
            wp_send_json_error('You do not have permission to perform this action.');
            return;
        }
        
        // Validate required fields
        $required_fields = ['name', 'title'];
        $missing_fields = [];
        foreach ($required_fields as $field) {
            if (!isset($_POST[$field]) || empty(trim(sanitize_text_field(wp_unslash($_POST[$field]))))) {
                $missing_fields[] = $field;
            }
        }
        
        if (!empty($missing_fields)) {

            wp_send_json_error('Please fill in all required fields: ' . implode(', ', $missing_fields));
            return;
        }
        
        $data = $_POST;
        try {
            $result = $this->database->save_promo_bar($data);

            
            if ($result) {
                wp_send_json_success(['id' => $result]);
            } else {
                // Get the last database error for debugging
                global $wpdb;
                $db_error = $wpdb->last_error;

                
                if (!empty($db_error)) {
                    wp_send_json_error('Database error: ' . $db_error);
                } else {
                    wp_send_json_error('Failed to save promo bar. Please check the data and try again.');
                }
            }
        } catch (Exception $e) {

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
        
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
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
        
        $promo_id = isset($_POST['promo_id']) ? intval($_POST['promo_id']) : 0;
        $event_type = isset($_POST['event_type']) ? sanitize_text_field(wp_unslash($_POST['event_type'])) : '';
        
        $data = [
            'page_url' => isset($_SERVER['HTTP_REFERER']) ? sanitize_text_field(wp_unslash($_SERVER['HTTP_REFERER'])) : '',
            'user_agent' => isset($_SERVER['HTTP_USER_AGENT']) ? sanitize_text_field(wp_unslash($_SERVER['HTTP_USER_AGENT'])) : '',
            'ip_address' => isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'])) : '',
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
            'status' => isset($_POST['status']) ? sanitize_text_field(wp_unslash($_POST['status'])) : 'all',
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
        
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;

        
        $promo_bar = $this->database->get_promo_bar($id);
        
        if ($promo_bar) {

            wp_send_json_success($promo_bar);
        } else {

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
        
        $category = isset($_POST['category']) ? sanitize_text_field(wp_unslash($_POST['category'])) : '';
        $templates = $this->database->get_templates($category);
        wp_send_json_success($templates);
    }

    /**
     * AJAX get available pages and posts
     */
    public function ajax_get_pages() {
        check_ajax_referer('promobarx_admin_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }
        
        $search = isset($_POST['search']) ? sanitize_text_field(wp_unslash($_POST['search'])) : '';
        $post_type = isset($_POST['post_type']) ? sanitize_text_field(wp_unslash($_POST['post_type'])) : 'page';
        
        $args = [
            'post_type' => $post_type,
            'post_status' => 'publish',
            'posts_per_page' => 50,
            'orderby' => 'title',
            'order' => 'ASC'
        ];
        
        if (!empty($search)) {
            $args['s'] = $search;
        }
        
        $posts = get_posts($args);
        $pages = [];
        
        foreach ($posts as $post) {
            $pages[] = [
                'id' => $post->ID,
                'title' => $post->post_title,
                'type' => $post->post_type,
                'url' => get_permalink($post->ID)
            ];
        }
        
        wp_send_json_success($pages);
    }

    /**
     * AJAX get post types
     */
    public function ajax_get_post_types() {
        check_ajax_referer('promobarx_admin_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }
        
        $post_types = get_post_types(['public' => true], 'objects');
        $types = [];
        
        foreach ($post_types as $post_type) {
            $types[] = [
                'name' => $post_type->name,
                'label' => $post_type->labels->name,
                'singular_label' => $post_type->labels->singular_name
            ];
        }
        
        wp_send_json_success($types);
    }

    /**
     * AJAX get categories and tags
     */
    public function ajax_get_taxonomies() {
        check_ajax_referer('promobarx_admin_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }
        
        $taxonomy = isset($_POST['taxonomy']) ? sanitize_text_field(wp_unslash($_POST['taxonomy'])) : 'category';
        $search = isset($_POST['search']) ? sanitize_text_field(wp_unslash($_POST['search'])) : '';
        
        $args = [
            'taxonomy' => $taxonomy,
            'hide_empty' => false,
            'number' => 50,
            'orderby' => 'name',
            'order' => 'ASC'
        ];
        
        if (!empty($search)) {
            $args['name__like'] = $search;
        }
        
        $terms = get_terms($args);
        $taxonomies = [];
        
        foreach ($terms as $term) {
            $taxonomies[] = [
                'id' => $term->term_id,
                'name' => $term->name,
                'slug' => $term->slug,
                'taxonomy' => $term->taxonomy
            ];
        }
        
        wp_send_json_success($taxonomies);
    }

    /**
     * AJAX get assignments for a promo bar
     */
    public function ajax_get_assignments() {
        check_ajax_referer('promobarx_admin_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }
        
        $promo_bar_id = isset($_POST['promo_bar_id']) ? intval($_POST['promo_bar_id']) : 0;

        
        // Get assignments from the new assignments table
        $assignments = $this->database->get_assignments($promo_bar_id);
        
        if ($assignments) {
            // Convert to array format for frontend
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
            

            wp_send_json_success($assignments_array);
        } else {

            wp_send_json_success([]);
        }
    }

    /**
     * AJAX save assignments for a promo bar
     */
    public function ajax_save_assignments() {

        
        check_ajax_referer('promobarx_admin_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }
        
        $promo_bar_id = isset($_POST['promo_bar_id']) ? intval($_POST['promo_bar_id']) : 0;
        
        // Sanitize assignments input - could be JSON string or array
        if (isset($_POST['assignments']) && is_string($_POST['assignments'])) {
            $assignments_raw = sanitize_textarea_field(wp_unslash($_POST['assignments']));
        } elseif (isset($_POST['assignments']) && is_array($_POST['assignments'])) {
            $assignments_raw = array_map('sanitize_text_field', wp_unslash($_POST['assignments']));
        } else {
            $assignments_raw = [];
        }
        
        // Use the sanitized assignments data
        $assignments = $assignments_raw;
        


        
        // If assignments is a JSON string, decode it
        if (is_string($assignments)) {
            $assignments = json_decode($assignments, true);

        }
        
        if (!is_array($assignments)) {

            wp_send_json_error('Invalid assignments data');
            return;
        }
        
        // Validate assignments
        $valid_assignments = [];
        foreach ($assignments as $assignment) {
            if (!isset($assignment['assignment_type'])) {
                continue;
            }
            
            $valid_assignment = [
                'assignment_type' => sanitize_text_field($assignment['assignment_type']),
                'target_id' => isset($assignment['target_id']) ? intval($assignment['target_id']) : 0,
                'target_value' => isset($assignment['target_value']) ? sanitize_text_field($assignment['target_value']) : '',
                'priority' => isset($assignment['priority']) ? intval($assignment['priority']) : 0
            ];
            
            $valid_assignments[] = $valid_assignment;
        }
        

        
        // Save assignments using the new assignment system
        $result = $this->database->save_assignments($promo_bar_id, $valid_assignments);
        

        
        if ($result) {
            wp_send_json_success('Assignments saved successfully');
        } else {
            wp_send_json_error('Failed to save assignments');
        }
    }

    /**
     * AJAX force create tables
     */
    public function ajax_force_create_tables() {
        check_ajax_referer('promobarx_admin_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }
        
        $results = $this->database->force_create_tables();
        
        if (in_array('MISSING', $results)) {
            wp_send_json_error('Some tables could not be created: ' . wp_json_encode($results));
        } else {
            wp_send_json_success('All tables created successfully: ' . wp_json_encode($results));
        }
    }

    /**
     * AJAX force recreate assignments table
     */
    public function ajax_force_recreate_assignments_table() {
        check_ajax_referer('promobarx_admin_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }
        
        $result = $this->database->force_recreate_assignments_table();
        
        if ($result) {
            wp_send_json_success('Assignments table recreated successfully');
        } else {
            wp_send_json_error('Failed to recreate assignments table: ' . $this->database->wpdb->last_error);
        }
    }

    /**
     * Get analytics data for a promo bar
     */
    public function get_analytics_data($promo_bar_id, $days = 30) {
        global $wpdb;
        
        // Try to get from cache first
        $cache_key = 'promobarx_analytics_' . $promo_bar_id . '_' . $days;
        $results = wp_cache_get($cache_key, 'promobarx');
        
        if (false === $results) {
            $start_date = gmdate('Y-m-d H:i:s', strtotime("-{$days} days"));
            
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery
            $results = $wpdb->get_results($wpdb->prepare(
                "SELECT event_type, COUNT(*) as count, DATE(created_at) as date
                 FROM {$wpdb->prefix}promo_bar_analytics 
                 WHERE promo_bar_id = %d AND created_at >= %s
                 GROUP BY event_type, DATE(created_at)
                 ORDER BY date DESC, event_type",
                $promo_bar_id,
                $start_date
            ));
            
            // Cache for 5 minutes (analytics change frequently)
            wp_cache_set($cache_key, $results, 'promobarx', 300);
        }
        
        return $results;
    }

    /**
     * Get assignment statistics
     */
    public function get_assignment_stats() {
        global $wpdb;
        
        // Try to get from cache first
        $cache_key = 'promobarx_assignment_stats';
        $stats = wp_cache_get($cache_key, 'promobarx');
        
        if (false === $stats) {
            $stats = [
                'total_promo_bars' => 0,
                'active_promo_bars' => 0,
                'total_assignments' => 0,
                'assignment_types' => [],
                'most_used_assignments' => []
            ];
            
            // Total promo bars
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery
            $stats['total_promo_bars'] = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}promo_bars");
            
            // Active promo bars
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery
            $stats['active_promo_bars'] = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}promo_bars WHERE status = 'active'");
            
            // Total assignments
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery
            $stats['total_assignments'] = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}promo_bar_assignments");
            
            // Assignment types breakdown
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery
            $assignment_types = $wpdb->get_results(
                "SELECT assignment_type, COUNT(*) as count 
                 FROM {$wpdb->prefix}promo_bar_assignments 
                 GROUP BY assignment_type 
                 ORDER BY count DESC"
            );
            
            foreach ($assignment_types as $type) {
                $stats['assignment_types'][$type->assignment_type] = $type->count;
            }
            
            // Most used assignments
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery
            $most_used = $wpdb->get_results(
                "SELECT assignment_type, target_value, COUNT(*) as count 
                 FROM {$wpdb->prefix}promo_bar_assignments 
                 WHERE target_value != ''
                 GROUP BY assignment_type, target_value 
                 ORDER BY count DESC 
                 LIMIT 10"
            );
            
            $stats['most_used_assignments'] = $most_used;
            
            // Cache for 15 minutes (stats don't change very frequently)
            wp_cache_set($cache_key, $stats, 'promobarx', 900);
        }
        
        return $stats;
    }



    /**
     * AJAX get analytics data for promo bars
     */
    public function ajax_get_analytics() {
        check_ajax_referer('promobarx_admin_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }
        
        global $wpdb;
        
        // Try to get from cache first
        $cache_key = 'promobarx_all_analytics';
        $analytics_by_promo_bar = wp_cache_get($cache_key, 'promobarx');
        
        if (false === $analytics_by_promo_bar) {
            // Get analytics data for all promo bars
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery
            $analytics_results = $wpdb->get_results(
                "SELECT 
                    pba.promo_bar_id,
                    pba.event_type,
                    COUNT(*) as count
                FROM {$wpdb->prefix}promo_bar_analytics pba
                INNER JOIN {$wpdb->prefix}promo_bars pb ON pba.promo_bar_id = pb.id
                GROUP BY pba.promo_bar_id, pba.event_type
                ORDER BY pba.promo_bar_id, pba.event_type"
            );
            
            // Organize data by promo bar ID
            $analytics_by_promo_bar = [];
            foreach ($analytics_results as $result) {
                if (!isset($analytics_by_promo_bar[$result->promo_bar_id])) {
                    $analytics_by_promo_bar[$result->promo_bar_id] = [
                        'impression' => 0,
                        'click' => 0,
                        'close' => 0,
                        'cta_click' => 0
                    ];
                }
                $analytics_by_promo_bar[$result->promo_bar_id][$result->event_type] = intval($result->count);
            }
            
            // Cache for 5 minutes (analytics change frequently)
            wp_cache_set($cache_key, $analytics_by_promo_bar, 'promobarx', 300);
        }
        
        wp_send_json_success($analytics_by_promo_bar);
    }
}
