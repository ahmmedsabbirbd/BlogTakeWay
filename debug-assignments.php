<?php
/**
 * Debug page for PromoBarX assignments
 * Add this to your WordPress admin menu or access directly
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    require_once('../../../wp-load.php');
}

// Check permissions
if (!current_user_can('manage_options')) {
    wp_die('Unauthorized access');
}

// Handle form submissions
if (isset($_POST['action'])) {
    switch ($_POST['action']) {
        case 'force_create_tables':
            $database = new PromoBarX_Database();
            $results = $database->force_create_tables();
            $message = 'Tables created: ' . print_r($results, true);
            break;
            
        case 'test_assignment_save':
            $database = new PromoBarX_Database();
            $promo_bars = $database->get_promo_bars(['status' => 'all', 'limit' => 1]);
            if (!empty($promo_bars)) {
                $promo_bar = $promo_bars[0];
                $test_assignments = [
                    [
                        'assignment_type' => 'global',
                        'target_id' => 0,
                        'target_value' => '',
                        'priority' => 10
                    ]
                ];
                $result = $database->save_assignments($promo_bar->id, $test_assignments);
                $message = 'Assignment save test: ' . ($result ? 'SUCCESS' : 'FAILED');
            } else {
                $message = 'No promo bars found to test with';
            }
            break;
    }
}

?>
<!DOCTYPE html>
<html>
<head>
    <title>PromoBarX Assignments Debug</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .button { background: #0073aa; color: white; padding: 10px 15px; border: none; border-radius: 3px; cursor: pointer; }
        .button:hover { background: #005a87; }
        .success { background: #d4edda; border-color: #c3e6cb; color: #155724; }
        .error { background: #f8d7da; border-color: #f5c6cb; color: #721c24; }
        pre { background: #f8f9fa; padding: 10px; border-radius: 3px; overflow-x: auto; }
    </style>
</head>
<body>
    <div class="container">
        <h1>PromoBarX Assignments Debug</h1>
        
        <?php if (isset($message)): ?>
            <div class="section <?php echo strpos($message, 'SUCCESS') !== false ? 'success' : 'error'; ?>">
                <strong>Result:</strong> <?php echo htmlspecialchars($message); ?>
            </div>
        <?php endif; ?>
        
        <div class="section">
            <h2>Database Status</h2>
            <?php
            global $wpdb;
            $database = new PromoBarX_Database();
            
            // Test connection
            $connection_test = $database->test_database_connection();
            echo "<p><strong>Database Connection:</strong> " . ($connection_test ? "✅ PASSED" : "❌ FAILED") . "</p>";
            
            // Check tables
            $tables = [
                'promo_bars',
                'promo_bar_templates', 
                'promo_bar_schedules',
                'promo_bar_analytics'
            ];
            
            echo "<p><strong>Table Status:</strong></p><ul>";
            foreach ($tables as $table) {
                $table_exists = $wpdb->get_var("SHOW TABLES LIKE '{$wpdb->prefix}{$table}'");
                echo "<li>{$wpdb->prefix}{$table}: " . ($table_exists ? "✅ EXISTS" : "❌ MISSING") . "</li>";
            }
            echo "</ul>";
            
            // Check assignments table content
            $assignments_table = $wpdb->prefix . 'promo_bar_assignments';
            $count = $wpdb->get_var("SELECT COUNT(*) FROM {$assignments_table}");
            echo "<p><strong>Total Assignments:</strong> " . ($count !== null ? $count : 'ERROR') . "</p>";
            
            if ($count !== null && $count > 0) {
                $sample_assignments = $wpdb->get_results("SELECT * FROM {$assignments_table} LIMIT 5");
                echo "<p><strong>Sample Assignments:</strong></p><pre>";
                foreach ($sample_assignments as $assignment) {
                    echo "ID: {$assignment->id}, Promo Bar ID: {$assignment->promo_bar_id}, Type: {$assignment->assignment_type}, Target ID: {$assignment->target_id}\n";
                }
                echo "</pre>";
            }
            ?>
        </div>
        
        <div class="section">
            <h2>Actions</h2>
            <form method="post" style="margin: 10px 0;">
                <input type="hidden" name="action" value="force_create_tables">
                <button type="submit" class="button">Force Create Tables</button>
            </form>
            
            <form method="post" style="margin: 10px 0;">
                <input type="hidden" name="action" value="test_assignment_save">
                <button type="submit" class="button">Test Assignment Save</button>
            </form>
        </div>
        
        <div class="section">
            <h2>Recent Logs</h2>
            <?php
            $debug_log = WP_CONTENT_DIR . '/debug.log';
            if (file_exists($debug_log)) {
                $log_content = file_get_contents($debug_log);
                $promobarx_logs = array_filter(explode("\n", $log_content), function($line) {
                    return strpos($line, 'PromoBarX') !== false;
                });
                
                if (!empty($promobarx_logs)) {
                    echo "<pre>" . htmlspecialchars(implode("\n", array_slice($promobarx_logs, -20))) . "</pre>";
                } else {
                    echo "<p>No PromoBarX logs found in debug.log</p>";
                }
            } else {
                echo "<p>Debug log file not found at: {$debug_log}</p>";
            }
            ?>
        </div>
        
        <div class="section">
            <h2>AJAX Test</h2>
            <button onclick="testAjax()" class="button">Test AJAX Assignment Save</button>
            <div id="ajax-result"></div>
        </div>
    </div>
    
    <script>
    function testAjax() {
        const resultDiv = document.getElementById('ajax-result');
        resultDiv.innerHTML = 'Testing...';
        
        const formData = new FormData();
        formData.append('action', 'promobarx_save_assignments');
        formData.append('promo_bar_id', '1');
        formData.append('assignments', JSON.stringify([
            {
                assignment_type: 'global',
                target_id: 0,
                target_value: '',
                priority: 10
            }
        ]));
        formData.append('nonce', '<?php echo wp_create_nonce('promobarx_admin_nonce'); ?>');
        
        fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            resultDiv.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
        })
        .catch(error => {
            resultDiv.innerHTML = '<p style="color: red;">Error: ' + error.message + '</p>';
        });
    }
    </script>
</body>
</html>
