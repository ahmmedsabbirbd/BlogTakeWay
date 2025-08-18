<?php
/**
 * Test script to verify assignment information display
 */

// Include WordPress
require_once('../../../wp-load.php');

// Check if user is logged in and has permissions
if (!current_user_can('manage_options')) {
    die('Unauthorized');
}

echo "<h1>PromoBarX Assignment Display Test</h1>";

// Include the plugin
require_once('promo-bar-x.php');

// Initialize the database class
$database = new PromoBarX_TopBar_Database();

echo "<h2>Testing get_promo_bars() with assignments</h2>";

// Get all promo bars with assignments
$promo_bars = $database->get_promo_bars(['status' => 'all']);

echo "<p>Found " . count($promo_bars) . " promo bars</p>";

if (empty($promo_bars)) {
    echo "<p>No promo bars found. Please create some promo bars first.</p>";
    exit;
}

echo "<table border='1' cellpadding='5' cellspacing='0' style='border-collapse: collapse;'>";
echo "<tr style='background-color: #f3f4f6;'>";
echo "<th>ID</th>";
echo "<th>Name</th>";
echo "<th>Status</th>";
echo "<th>Assignments Count</th>";
echo "<th>Max Priority</th>";
echo "<th>Assignments Details</th>";
echo "</tr>";

foreach ($promo_bars as $promo_bar) {
    echo "<tr>";
    echo "<td>{$promo_bar->id}</td>";
    echo "<td>{$promo_bar->name}</td>";
    echo "<td>{$promo_bar->status}</td>";
    echo "<td>" . count($promo_bar->assignments) . "</td>";
    echo "<td>" . (isset($promo_bar->max_priority) ? $promo_bar->max_priority : 'N/A') . "</td>";
    echo "<td>";
    
    if (!empty($promo_bar->assignments)) {
        echo "<ul style='margin: 0; padding-left: 20px;'>";
        foreach ($promo_bar->assignments as $assignment) {
            echo "<li>";
            echo "<strong>Type:</strong> " . htmlspecialchars($assignment['assignment_type']) . "<br>";
            echo "<strong>Target ID:</strong> " . htmlspecialchars($assignment['target_id']) . "<br>";
            echo "<strong>Target Value:</strong> " . htmlspecialchars($assignment['target_value']) . "<br>";
            echo "<strong>Priority:</strong> " . htmlspecialchars($assignment['priority']);
            echo "</li>";
        }
        echo "</ul>";
    } else {
        echo "<em>No assignments</em>";
    }
    
    echo "</td>";
    echo "</tr>";
}

echo "</table>";

echo "<h2>Testing AJAX endpoint</h2>";

// Simulate AJAX request
$_POST['action'] = 'promobarx_get_promo_bars';
$_POST['nonce'] = wp_create_nonce('promobarx_admin_nonce');

// Initialize the manager
$manager = new PromoBarX_TopBar_Manager();

// Capture the output
ob_start();
try {
    $manager->ajax_get_promo_bars();
    $ajax_output = ob_get_contents();
} catch (Exception $e) {
    $ajax_output = "Error: " . $e->getMessage();
}
ob_end_clean();

echo "<p>AJAX Response:</p>";
echo "<pre>" . htmlspecialchars($ajax_output) . "</pre>";

echo "<h2>Database Schema Check</h2>";

// Check if assignments table exists
global $wpdb;
$table_name = $wpdb->prefix . 'promo_bar_assignments';
$table_exists = $wpdb->get_var("SHOW TABLES LIKE '$table_name'") == $table_name;

echo "<p>Assignments table exists: " . ($table_exists ? '✅ Yes' : '❌ No') . "</p>";

if ($table_exists) {
    // Check table structure
    $columns = $wpdb->get_results("DESCRIBE $table_name");
    echo "<p>Table columns:</p>";
    echo "<ul>";
    foreach ($columns as $column) {
        echo "<li><strong>{$column->Field}:</strong> {$column->Type} {$column->Null} {$column->Key} {$column->Default}</li>";
    }
    echo "</ul>";
    
    // Check for data
    $count = $wpdb->get_var("SELECT COUNT(*) FROM $table_name");
    echo "<p>Total assignments: $count</p>";
}

echo "<h2>Test Complete</h2>";
echo "<p>If you see assignment information above, the system is working correctly.</p>";
echo "<p>You can now check the admin interface to see the assignments displayed in the promo bars table.</p>";
?>
