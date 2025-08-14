<?php
/**
 * Debug script for PromoBarX save issues
 * Place this file in your WordPress root directory and access it via browser
 * to test the database connection and save functionality
 */

// Load WordPress
require_once('wp-load.php');

// Check if user is logged in and has admin privileges
if (!current_user_can('manage_options')) {
    die('Access denied. You must be logged in as an administrator.');
}

echo "<h1>PromoBarX Database Debug</h1>";

// Test basic WordPress database connection
echo "<h2>1. WordPress Database Connection Test</h2>";
global $wpdb;
if ($wpdb->db_connect()) {
    echo "✅ WordPress database connection: OK<br>";
} else {
    echo "❌ WordPress database connection: FAILED<br>";
    die();
}

// Test if PromoBarX tables exist
echo "<h2>2. PromoBarX Tables Test</h2>";
$table_prefix = $wpdb->prefix;
$promo_bars_table = $table_prefix . 'promo_bars';

$table_exists = $wpdb->get_var("SHOW TABLES LIKE '$promo_bars_table'");
if ($table_exists) {
    echo "✅ Promo bars table exists: OK<br>";
} else {
    echo "❌ Promo bars table does not exist<br>";
    echo "Attempting to create tables...<br>";
    
    // Try to create tables
    if (class_exists('PromoBarX_Database')) {
        $database = new PromoBarX_Database();
        echo "✅ PromoBarX_Database class loaded<br>";
    } else {
        echo "❌ PromoBarX_Database class not found<br>";
    }
}

// Test table structure
echo "<h2>3. Table Structure Test</h2>";
if ($table_exists) {
    $columns = $wpdb->get_results("DESCRIBE $promo_bars_table");
    if ($columns) {
        echo "✅ Table structure accessible<br>";
        echo "<h3>Columns:</h3><ul>";
        foreach ($columns as $column) {
            echo "<li>{$column->Field} - {$column->Type}</li>";
        }
        echo "</ul>";
    } else {
        echo "❌ Could not get table structure<br>";
    }
}

// Test insert operation
echo "<h2>4. Insert Test</h2>";
if ($table_exists) {
    $test_data = [
        'name' => 'Test Promo Bar ' . time(),
        'title' => 'Test Title',
        'subtitle' => 'Test Subtitle',
        'cta_text' => 'Test CTA',
        'cta_url' => 'https://example.com',
        'cta_style' => json_encode(['background' => '#000000']),
        'styling' => json_encode(['background' => '#ffffff']),
        'status' => 'draft',
        'created_by' => get_current_user_id()
    ];
    
    $result = $wpdb->insert($promo_bars_table, $test_data);
    if ($result !== false) {
        $insert_id = $wpdb->insert_id;
        echo "✅ Insert test successful. ID: $insert_id<br>";
        
        // Clean up test data
        $wpdb->delete($promo_bars_table, ['id' => $insert_id]);
        echo "✅ Test data cleaned up<br>";
    } else {
        echo "❌ Insert test failed<br>";
        echo "Error: " . $wpdb->last_error . "<br>";
    }
}

// Test PromoBarX save method
echo "<h2>5. PromoBarX Save Method Test</h2>";
if (class_exists('PromoBarX_Database')) {
    $database = new PromoBarX_Database();
    
    $test_data = [
        'name' => 'Test Save Method ' . time(),
        'title' => 'Test Title',
        'subtitle' => 'Test Subtitle',
        'cta_text' => 'Test CTA',
        'cta_url' => 'https://example.com',
        'styling' => json_encode(['background' => '#ffffff']),
        'status' => 'draft'
    ];
    
    $result = $database->save_promo_bar($test_data);
    if ($result) {
        echo "✅ PromoBarX save method successful. ID: $result<br>";
        
        // Clean up test data
        $database->delete_promo_bar($result);
        echo "✅ Test data cleaned up<br>";
    } else {
        echo "❌ PromoBarX save method failed<br>";
    }
} else {
    echo "❌ PromoBarX_Database class not available<br>";
}

echo "<h2>6. PHP Error Log Check</h2>";
$error_log = ini_get('error_log');
if ($error_log) {
    echo "Error log location: $error_log<br>";
    if (file_exists($error_log)) {
        echo "✅ Error log file exists<br>";
        $recent_errors = shell_exec("tail -20 $error_log 2>/dev/null");
        if ($recent_errors) {
            echo "<h3>Recent errors:</h3><pre>" . htmlspecialchars($recent_errors) . "</pre>";
        }
    } else {
        echo "❌ Error log file not found<br>";
    }
} else {
    echo "❌ Error log not configured<br>";
}

echo "<h2>7. WordPress Debug Info</h2>";
echo "WP_DEBUG: " . (defined('WP_DEBUG') && WP_DEBUG ? 'Enabled' : 'Disabled') . "<br>";
echo "WP_DEBUG_LOG: " . (defined('WP_DEBUG_LOG') && WP_DEBUG_LOG ? 'Enabled' : 'Disabled') . "<br>";
echo "WP_DEBUG_DISPLAY: " . (defined('WP_DEBUG_DISPLAY') && WP_DEBUG_DISPLAY ? 'Enabled' : 'Disabled') . "<br>";

if (defined('WP_DEBUG_LOG') && WP_DEBUG_LOG) {
    $wp_debug_log = WP_CONTENT_DIR . '/debug.log';
    if (file_exists($wp_debug_log)) {
        echo "✅ WordPress debug log exists<br>";
        $recent_wp_errors = shell_exec("tail -20 $wp_debug_log 2>/dev/null");
        if ($recent_wp_errors) {
            echo "<h3>Recent WordPress debug errors:</h3><pre>" . htmlspecialchars($recent_wp_errors) . "</pre>";
        }
    } else {
        echo "❌ WordPress debug log not found<br>";
    }
}

echo "<h2>Debug Complete</h2>";
echo "Check the output above for any issues. If you see ❌ marks, those indicate problems that need to be resolved.";
?>
