<?php
/**
 * Test Page Assignment UI
 * This file helps test the Page Assignment feature
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    require_once('../../../wp-load.php');
}

// Check if user is admin
if (!current_user_can('manage_options')) {
    wp_die('Unauthorized access');
}

?>
<!DOCTYPE html>
<html>
<head>
    <title>PromoBarX - Page Assignment Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .test-section { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .success { background: #d4edda; border-color: #c3e6cb; }
        .error { background: #f8d7da; border-color: #f5c6cb; }
        .info { background: #d1ecf1; border-color: #bee5eb; }
        button { padding: 10px 20px; margin: 5px; background: #0073aa; color: white; border: none; border-radius: 3px; cursor: pointer; }
        button:hover { background: #005a87; }
        .code { background: #f8f9fa; padding: 10px; border-radius: 3px; font-family: monospace; }
    </style>
</head>
<body>
    <h1>PromoBarX - Page Assignment Feature Test</h1>
    
    <div class="test-section info">
        <h2>🔍 How to Access Page Assignment Feature</h2>
        <p><strong>Step 1:</strong> Go to your WordPress admin panel</p>
        <p><strong>Step 2:</strong> Navigate to <strong>PromoBarX → Dashboard</strong></p>
        <p><strong>Step 3:</strong> Click <strong>"Create New Promo Bar"</strong> or edit an existing one</p>
        <p><strong>Step 4:</strong> Look for the <strong>"Page Assignment"</strong> tab in the editor</p>
        <p><strong>Step 5:</strong> Click <strong>"Manage Page Assignments"</strong> button</p>
    </div>

    <div class="test-section">
        <h2>🧪 Database Check</h2>
        <?php
        global $wpdb;
        
        // Check if assignments table exists
        $table_name = $wpdb->prefix . 'promo_bar_assignments';
        $table_exists = $wpdb->get_var("SHOW TABLES LIKE '$table_name'") == $table_name;
        
        if ($table_exists) {
            echo '<div class="success">✅ Assignments table exists: <strong>' . $table_name . '</strong></div>';
            
            // Check table structure
            $columns = $wpdb->get_results("DESCRIBE $table_name");
            echo '<h3>Table Structure:</h3><div class="code">';
            foreach ($columns as $column) {
                echo $column->Field . ' - ' . $column->Type . '<br>';
            }
            echo '</div>';
            
            // Count assignments
            $count = $wpdb->get_var("SELECT COUNT(*) FROM $table_name");
            echo '<p>Total assignments: <strong>' . $count . '</strong></p>';
            
        } else {
            echo '<div class="error">❌ Assignments table does not exist: <strong>' . $table_name . '</strong></div>';
            echo '<p>This might be why the feature is not working. Try deactivating and reactivating the plugin.</p>';
        }
        ?>
    </div>

    <div class="test-section">
        <h2>🔧 AJAX Endpoints Check</h2>
        <?php
        $ajax_actions = [
            'promobarx_get_assignments',
            'promobarx_save_assignments', 
            'promobarx_get_pages',
            'promobarx_get_taxonomies'
        ];
        
        foreach ($ajax_actions as $action) {
            if (has_action("wp_ajax_$action")) {
                echo '<div class="success">✅ AJAX action registered: <strong>' . $action . '</strong></div>';
            } else {
                echo '<div class="error">❌ AJAX action missing: <strong>' . $action . '</strong></div>';
            }
        }
        ?>
    </div>

    <div class="test-section">
        <h2>📝 Test AJAX Calls</h2>
        <button onclick="testGetPages()">Test Get Pages</button>
        <button onclick="testGetTaxonomies()">Test Get Categories</button>
        <button onclick="testGetAssignments()">Test Get Assignments</button>
        <div id="ajax-results" style="margin-top: 10px;"></div>
    </div>

    <div class="test-section">
        <h2>🎯 Quick Access Links</h2>
        <a href="<?php echo admin_url('admin.php?page=promobarx-dashboard'); ?>">
            <button>Go to PromoBarX Dashboard</button>
        </a>
        <a href="<?php echo admin_url('admin.php?page=promobarx-dashboard&action=create'); ?>">
            <button>Create New Promo Bar</button>
        </a>
    </div>

    <script>
        function testGetPages() {
            const data = new FormData();
            data.append('action', 'promobarx_get_pages');
            data.append('search', 'test');
            data.append('nonce', '<?php echo wp_create_nonce('promobarx_admin_nonce'); ?>');
            
            fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
                method: 'POST',
                body: data
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('ajax-results').innerHTML = 
                    '<div class="success">✅ Get Pages Response: ' + JSON.stringify(data, null, 2) + '</div>';
            })
            .catch(error => {
                document.getElementById('ajax-results').innerHTML = 
                    '<div class="error">❌ Error: ' + error.message + '</div>';
            });
        }

        function testGetTaxonomies() {
            const data = new FormData();
            data.append('action', 'promobarx_get_taxonomies');
            data.append('taxonomy', 'category');
            data.append('search', 'test');
            data.append('nonce', '<?php echo wp_create_nonce('promobarx_admin_nonce'); ?>');
            
            fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
                method: 'POST',
                body: data
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('ajax-results').innerHTML = 
                    '<div class="success">✅ Get Taxonomies Response: ' + JSON.stringify(data, null, 2) + '</div>';
            })
            .catch(error => {
                document.getElementById('ajax-results').innerHTML = 
                    '<div class="error">❌ Error: ' + error.message + '</div>';
            });
        }

        function testGetAssignments() {
            const data = new FormData();
            data.append('action', 'promobarx_get_assignments');
            data.append('promo_bar_id', '1');
            data.append('nonce', '<?php echo wp_create_nonce('promobarx_admin_nonce'); ?>');
            
            fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
                method: 'POST',
                body: data
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('ajax-results').innerHTML = 
                    '<div class="success">✅ Get Assignments Response: ' + JSON.stringify(data, null, 2) + '</div>';
            })
            .catch(error => {
                document.getElementById('ajax-results').innerHTML = 
                    '<div class="error">❌ Error: ' + error.message + '</div>';
            });
        }
    </script>
</body>
</html>
