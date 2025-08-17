<?php
/**
 * Debug script for WordPress save functionality
 */

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Load WordPress
require_once('../../../wp-load.php');

// Check if user is logged in and has admin privileges
if (!current_user_can('manage_options')) {
    wp_die('Unauthorized access');
}

echo "<h1>Debug Save Functionality</h1>";

// Initialize the database class
$database = new PromoBarX_Database();

// Test data with assignments array
$test_data = [
    'name' => 'Debug Test Promo Bar',
    'title' => 'Debug Test Title',
    'status' => 'active',
    'assignments' => json_encode([
        [
            "id" => 1755409442695,
            "assignment_type" => "post_type",
            "target_id" => 0,
            "target_value" => "post",
            "priority" => 1
        ]
    ])
];

echo "<h2>Test Data:</h2>";
echo "<pre>" . print_r($test_data, true) . "</pre>";

// Test the save_promo_bar method
echo "<h2>Testing save_promo_bar method:</h2>";

try {
    $result = $database->save_promo_bar($test_data);
    
    if ($result) {
        echo "<p style='color: green;'>✅ Save successful! Promo bar ID: {$result}</p>";
        
        // Get the saved promo bar
        $saved_promo_bar = $database->get_promo_bar($result);
        
        echo "<h3>Saved Promo Bar Data:</h3>";
        echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
        echo "<tr><th>Field</th><th>Value</th></tr>";
        echo "<tr><td>ID</td><td>{$saved_promo_bar->id}</td></tr>";
        echo "<tr><td>Name</td><td>{$saved_promo_bar->name}</td></tr>";
        echo "<tr><td>Title</td><td>{$saved_promo_bar->title}</td></tr>";
        echo "<tr><td>Status</td><td>{$saved_promo_bar->status}</td></tr>";
        echo "<tr><td>Assignment Type</td><td>{$saved_promo_bar->assignment_type}</td></tr>";
        echo "<tr><td>Target ID</td><td>{$saved_promo_bar->target_id}</td></tr>";
        echo "<tr><td>Target Value</td><td>{$saved_promo_bar->target_value}</td></tr>";
        echo "<tr><td>Priority</td><td>{$saved_promo_bar->priority}</td></tr>";
        echo "</table>";
        
        // Check if assignments were processed correctly
        echo "<h3>Assignment Processing Check:</h3>";
        $expected_assignment_type = 'post_type';
        $expected_target_id = 0;
        $expected_target_value = 'post';
        $expected_priority = 1;
        
        $assignment_correct = ($saved_promo_bar->assignment_type === $expected_assignment_type);
        $target_id_correct = ($saved_promo_bar->target_id == $expected_target_id);
        $target_value_correct = ($saved_promo_bar->target_value === $expected_target_value);
        $priority_correct = ($saved_promo_bar->priority == $expected_priority);
        
        echo "<p>Assignment Type: {$saved_promo_bar->assignment_type} (Expected: {$expected_assignment_type}) - " . ($assignment_correct ? '✅' : '❌') . "</p>";
        echo "<p>Target ID: {$saved_promo_bar->target_id} (Expected: {$expected_target_id}) - " . ($target_id_correct ? '✅' : '❌') . "</p>";
        echo "<p>Target Value: {$saved_promo_bar->target_value} (Expected: {$expected_target_value}) - " . ($target_value_correct ? '✅' : '❌') . "</p>";
        echo "<p>Priority: {$saved_promo_bar->priority} (Expected: {$expected_priority}) - " . ($priority_correct ? '✅' : '❌') . "</p>";
        
        if ($assignment_correct && $target_id_correct && $target_value_correct && $priority_correct) {
            echo "<p style='color: green; font-weight: bold;'>✅ All assignment fields saved correctly!</p>";
        } else {
            echo "<p style='color: red; font-weight: bold;'>❌ Some assignment fields were not saved correctly.</p>";
        }
        
    } else {
        echo "<p style='color: red;'>❌ Save failed!</p>";
        
        // Get the last database error
        global $wpdb;
        echo "<p>Database Error: " . $wpdb->last_error . "</p>";
    }
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Exception occurred: " . $e->getMessage() . "</p>";
}

// Test the AJAX save handler
echo "<h2>Testing AJAX Save Handler:</h2>";

// Simulate AJAX request
$_POST = $test_data;
$_POST['action'] = 'promobarx_save';
$_POST['nonce'] = wp_create_nonce('promobarx_admin_nonce');

// Capture output
ob_start();

try {
    // Call the AJAX handler directly
    $manager = new PromoBarX_Manager();
    $manager->ajax_save_promo_bar();
    
    $ajax_output = ob_get_clean();
    
    echo "<h3>AJAX Handler Output:</h3>";
    echo "<pre>" . htmlspecialchars($ajax_output) . "</pre>";
    
} catch (Exception $e) {
    ob_end_clean();
    echo "<p style='color: red;'>❌ AJAX Exception: " . $e->getMessage() . "</p>";
}

echo "<hr>";
echo "<p><em>Debug completed. Check the results above.</em></p>";
?>
