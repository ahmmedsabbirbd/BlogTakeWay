<?php
/**
 * Page Assignment Test Page
 * This helps you test the Page Assignment feature
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
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 40px; }
        .header h1 { color: #2563eb; margin-bottom: 10px; }
        .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 40px; }
        .feature-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; }
        .feature-card h3 { color: #1e293b; margin-bottom: 10px; }
        .feature-card p { color: #64748b; margin-bottom: 15px; }
        .btn { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; transition: background 0.2s; }
        .btn:hover { background: #1d4ed8; }
        .btn-secondary { background: #6b7280; }
        .btn-secondary:hover { background: #4b5563; }
        .btn-success { background: #059669; }
        .btn-success:hover { background: #047857; }
        .status { padding: 15px; border-radius: 6px; margin-bottom: 20px; }
        .status.success { background: #d1fae5; border: 1px solid #a7f3d0; color: #065f46; }
        .status.error { background: #fee2e2; border: 1px solid #fecaca; color: #991b1b; }
        .status.info { background: #dbeafe; border: 1px solid #bfdbfe; color: #1e40af; }
        .code { background: #f1f5f9; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 14px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 PromoBarX - Page Assignment Feature</h1>
            <p>Test and access the Page Assignment functionality</p>
        </div>

        <div class="status info">
            <strong>📋 How to Access Page Assignment:</strong><br>
            1. Go to WordPress Admin → PromoBarX → Dashboard<br>
            2. Click "Create New Promo Bar" or edit an existing one<br>
            3. Scroll down to the "Page Assignment" section<br>
            4. Choose your assignment type and configure it
        </div>

        <div class="feature-grid">
            <div class="feature-card">
                <h3>🌐 Global Assignment</h3>
                <p>Show the promo bar on all pages of your website</p>
                <a href="<?php echo admin_url('admin.php?page=promo-bar-x-topbar-manager'); ?>" class="btn">Go to Manager</a>
            </div>

            <div class="feature-card">
                <h3>📄 Specific Pages</h3>
                <p>Choose individual pages where the promo bar should appear</p>
                <a href="<?php echo admin_url('admin.php?page=promo-bar-x-topbar-manager&action=create'); ?>" class="btn btn-success">Create New Promo Bar</a>
            </div>

            <div class="feature-card">
                <h3>🏷️ Categories & Tags</h3>
                <p>Show on all pages in specific categories or with specific tags</p>
                <a href="<?php echo admin_url('admin.php?page=promo-bar-x-topbar-manager'); ?>" class="btn btn-secondary">View Existing</a>
            </div>

            <div class="feature-card">
                <h3>🔗 Custom URL Patterns</h3>
                <p>Use URL patterns like /shop/* to match specific page types</p>
                <a href="<?php echo admin_url('admin.php?page=promo-bar-x-topbar-manager&action=create'); ?>" class="btn btn-success">Create New Promo Bar</a>
            </div>
        </div>

        <div class="status success">
            <strong>✅ Available Assignment Types:</strong><br>
            • <strong>Global:</strong> All pages<br>
            • <strong>Specific Pages:</strong> Individual page selection<br>
            • <strong>Post Types:</strong> All posts, pages, or custom post types<br>
            • <strong>Categories:</strong> All pages in specific categories<br>
            • <strong>Tags:</strong> All pages with specific tags<br>
            • <strong>Custom URLs:</strong> URL pattern matching
        </div>

        <div style="text-align: center; margin-top: 40px;">
            <h3>Quick Test</h3>
            <p>Test the AJAX endpoints to ensure everything is working:</p>
            <button onclick="testEndpoints()" class="btn">Test AJAX Endpoints</button>
            <div id="test-results" style="margin-top: 20px;"></div>
        </div>

        <div style="margin-top: 40px; padding: 20px; background: #f8fafc; border-radius: 8px;">
            <h3>🔧 Troubleshooting</h3>
            <p><strong>If you can't see the Page Assignment section:</strong></p>
            <ol>
                <li>Make sure you're using the latest version of the plugin</li>
                <li>Check that the database tables are created properly</li>
                <li>Verify that AJAX endpoints are working</li>
                <li>Try refreshing the page or clearing browser cache</li>
            </ol>
            
            <p><strong>Database Check:</strong></p>
            <?php
            global $wpdb;
            $table_name = $wpdb->prefix . 'promo_bar_assignments';
            $table_exists = $wpdb->get_var("SHOW TABLES LIKE '$table_name'") == $table_name;
            if ($table_exists) {
                echo '<div class="status success">✅ Assignments table exists</div>';
            } else {
                echo '<div class="status error">❌ Assignments table missing. Try deactivating and reactivating the plugin.</div>';
            }
            ?>
        </div>
    </div>

    <script>
        function testEndpoints() {
            const resultsDiv = document.getElementById('test-results');
            resultsDiv.innerHTML = '<div class="status info">Testing endpoints...</div>';
            
            // Test get pages endpoint
            testEndpoint('promobarx_get_pages', { search: 'test' }, 'Get Pages')
                .then(() => testEndpoint('promobarx_get_taxonomies', { taxonomy: 'category' }, 'Get Categories'))
                .then(() => {
                    resultsDiv.innerHTML = '<div class="status success">✅ All endpoints working correctly!</div>';
                })
                .catch(error => {
                    resultsDiv.innerHTML = '<div class="status error">❌ Error: ' + error.message + '</div>';
                });
        }
        
        function testEndpoint(action, data, name) {
            return new Promise((resolve, reject) => {
                if (!window.promobarxAdmin || !window.promobarxAdmin.ajaxurl) {
                    reject(new Error('Admin data not available'));
                    return;
                }
                
                const formData = new FormData();
                formData.append('action', action);
                formData.append('nonce', window.promobarxAdmin.nonce);
                
                Object.keys(data).forEach(key => {
                    formData.append(key, data[key]);
                });
                
                fetch(window.promobarxAdmin.ajaxurl, {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        console.log(name + ' endpoint working:', result);
                        resolve(result);
                    } else {
                        reject(new Error(name + ' failed: ' + (result.data || 'Unknown error')));
                    }
                })
                .catch(error => {
                    reject(new Error(name + ' error: ' + error.message));
                });
            });
        }
    </script>
</body>
</html>
