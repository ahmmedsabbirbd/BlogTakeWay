<?php
/**
 * Debug script for PromoBarX Assignment Saving
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

echo "<h1>PromoBarX Assignment Save Debug</h1>";

// Initialize the database class
$database = new PromoBarX_Database();

// Test 1: Check if assignments table exists
echo "<h2>1. Check Assignments Table</h2>";
global $wpdb;
$table_exists = $wpdb->get_var(
    $wpdb->prepare(
        "SHOW TABLES LIKE %s",
        $wpdb->prefix . 'promo_bar_assignments'
    )
);

if ($table_exists) {
    echo "✅ Assignments table exists<br>";
} else {
    echo "❌ Assignments table does not exist<br>";
    echo "Creating tables...<br>";
    $database->create_tables();
    
    // Check again
    $table_exists = $wpdb->get_var(
        $wpdb->prepare(
            "SHOW TABLES LIKE %s",
            $wpdb->prefix . 'promo_bar_assignments'
        )
    );
    
    if ($table_exists) {
        echo "✅ Assignments table created successfully<br>";
    } else {
        echo "❌ Failed to create assignments table<br>";
        echo "Error: " . $wpdb->last_error . "<br>";
        exit;
    }
}

// Test 2: Check table structure
echo "<h2>2. Check Table Structure</h2>";
$columns = $wpdb->get_results("DESCRIBE {$wpdb->prefix}promo_bar_assignments");
echo "Table columns:<br>";
foreach ($columns as $column) {
    echo "- {$column->Field}: {$column->Type}<br>";
}

// Test 3: Create a test promo bar
echo "<h2>3. Create Test Promo Bar</h2>";
$test_promo_bar = [
    'name' => 'Debug Test Promo Bar ' . time(),
    'title' => 'Debug Test Title',
    'status' => 'active',
    'created_by' => get_current_user_id()
];

$promo_bar_id = $database->save_promo_bar($test_promo_bar);

if ($promo_bar_id) {
    echo "✅ Test promo bar created with ID: {$promo_bar_id}<br>";
} else {
    echo "❌ Failed to create test promo bar<br>";
    echo "Error: " . $wpdb->last_error . "<br>";
    exit;
}

// Test 4: Test assignment saving
echo "<h2>4. Test Assignment Saving</h2>";
$test_assignments = [
    [
        'assignment_type' => 'global',
        'target_id' => 0,
        'target_value' => 'All Pages',
        'priority' => 1
    ],
    [
        'assignment_type' => 'page',
        'target_id' => 1,
        'target_value' => 'Sample Page',
        'priority' => 2
    ]
];

echo "Attempting to save assignments...<br>";
$save_result = $database->save_assignments($promo_bar_id, $test_assignments);

if ($save_result) {
    echo "✅ Assignments saved successfully<br>";
} else {
    echo "❌ Failed to save assignments<br>";
    echo "Database error: " . $wpdb->last_error . "<br>";
}

// Test 5: Verify assignments were saved
echo "<h2>5. Verify Saved Assignments</h2>";
$saved_assignments = $database->get_assignments($promo_bar_id);

if ($saved_assignments) {
    echo "✅ Retrieved " . count($saved_assignments) . " assignments:<br>";
    foreach ($saved_assignments as $assignment) {
        echo "- Type: {$assignment->assignment_type}, Target: {$assignment->target_value}, Priority: {$assignment->priority}<br>";
    }
} else {
    echo "❌ No assignments found<br>";
    echo "Database error: " . $wpdb->last_error . "<br>";
}

// Test 6: Test AJAX save assignments
echo "<h2>6. Test AJAX Save Assignments</h2>";

// Simulate AJAX request
$_POST = [
    'action' => 'promobarx_save_assignments',
    'promo_bar_id' => $promo_bar_id,
    'assignments' => json_encode($test_assignments),
    'nonce' => wp_create_nonce('promobarx_admin_nonce')
];

ob_start();
try {
    $manager = new PromoBarX_Manager();
    $manager->ajax_save_assignments();
    $ajax_output = ob_get_clean();
    
    echo "✅ AJAX save assignments response:<br>";
    echo "<pre>" . htmlspecialchars($ajax_output) . "</pre>";
} catch (Exception $e) {
    ob_end_clean();
    echo "❌ AJAX save assignments failed: " . $e->getMessage() . "<br>";
}

// Test 7: Check database directly
echo "<h2>7. Direct Database Check</h2>";
$direct_check = $wpdb->get_results(
    $wpdb->prepare(
        "SELECT * FROM {$wpdb->prefix}promo_bar_assignments WHERE promo_bar_id = %d",
        $promo_bar_id
    )
);

if ($direct_check) {
    echo "✅ Direct database check found " . count($direct_check) . " assignments<br>";
    foreach ($direct_check as $assignment) {
        echo "- ID: {$assignment->id}, Type: {$assignment->assignment_type}, Target: {$assignment->target_value}<br>";
    }
} else {
    echo "❌ Direct database check found no assignments<br>";
    echo "SQL: SELECT * FROM {$wpdb->prefix}promo_bar_assignments WHERE promo_bar_id = {$promo_bar_id}<br>";
    echo "Error: " . $wpdb->last_error . "<br>";
}

// Test 8: Clean up
echo "<h2>8. Cleanup</h2>";
$cleanup_result = $database->delete_promo_bar($promo_bar_id);
if ($cleanup_result) {
    echo "✅ Test promo bar deleted successfully<br>";
} else {
    echo "❌ Failed to delete test promo bar<br>";
}

echo "<hr>";
echo "<h2>Debug Summary</h2>";
echo "<p>Check the results above to identify where the assignment saving is failing.</p>";
echo "<p><strong>Common Issues:</strong></p>";
echo "<ul>";
echo "<li>Table doesn't exist</li>";
echo "<li>Foreign key constraint failure</li>";
echo "<li>Data type mismatch</li>";
echo "<li>Permission issues</li>";
echo "</ul>";
?>
