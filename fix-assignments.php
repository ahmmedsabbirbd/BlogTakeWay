<?php
/**
 * Fix script for PromoBarX Assignment Saving Issue
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

echo "<h1>PromoBarX Assignment Fix</h1>";

// Initialize the database class
$database = new PromoBarX_Database();

echo "<h2>Step 1: Force Recreate Assignments Table</h2>";
$recreate_result = $database->force_recreate_assignments_table();

if ($recreate_result) {
    echo "✅ Assignments table recreated successfully<br>";
} else {
    echo "❌ Failed to recreate assignments table<br>";
    echo "Error: " . $database->wpdb->last_error . "<br>";
    exit;
}

echo "<h2>Step 2: Test Assignment Saving</h2>";

// Create a test promo bar
$test_promo_bar = [
    'name' => 'Fix Test Promo Bar ' . time(),
    'title' => 'Fix Test Title',
    'status' => 'active',
    'created_by' => get_current_user_id()
];

$promo_bar_id = $database->save_promo_bar($test_promo_bar);

if (!$promo_bar_id) {
    echo "❌ Failed to create test promo bar<br>";
    exit;
}

echo "✅ Test promo bar created with ID: {$promo_bar_id}<br>";

// Test assignment saving
$test_assignments = [
    [
        'assignment_type' => 'global',
        'target_id' => 0,
        'target_value' => 'All Pages',
        'priority' => 1
    ]
];

$save_result = $database->save_assignments($promo_bar_id, $test_assignments);

if ($save_result) {
    echo "✅ Assignments saved successfully<br>";
} else {
    echo "❌ Failed to save assignments<br>";
    echo "Error: " . $database->wpdb->last_error . "<br>";
}

// Verify assignments
$saved_assignments = $database->get_assignments($promo_bar_id);

if ($saved_assignments && count($saved_assignments) > 0) {
    echo "✅ Verified assignments were saved correctly<br>";
    foreach ($saved_assignments as $assignment) {
        echo "- Type: {$assignment->assignment_type}, Target: {$assignment->target_value}<br>";
    }
} else {
    echo "❌ Assignments not found after saving<br>";
}

// Clean up
$database->delete_promo_bar($promo_bar_id);

echo "<hr>";
echo "<h2>Fix Complete</h2>";
echo "<p>The assignments table has been recreated and tested. Try saving assignments again in the admin panel.</p>";
echo "<p><strong>Next Steps:</strong></p>";
echo "<ol>";
echo "<li>Go to WordPress admin → Promo Bar X</li>";
echo "<li>Create or edit a promo bar</li>";
echo "<li>Click 'Page Assignment'</li>";
echo "<li>Add assignments and save</li>";
echo "<li>Verify assignments are saved correctly</li>";
echo "</ol>";
?>
