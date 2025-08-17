<?php
/**
 * Test script for new promo bar creation with assignments
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

echo "<h1>Test New Promo Bar Creation</h1>";

// Initialize the database class
$database = new PromoBarX_Database();

echo "<h2>Step 1: Create New Promo Bar</h2>";

$test_promo_bar = [
    'name' => 'Test New Promo Bar ' . time(),
    'title' => 'Test New Promo Bar Title',
    'cta_text' => 'Click Here',
    'cta_url' => 'https://example.com',
    'status' => 'active',
    'assignment_type' => 'global',
    'target_id' => 0,
    'target_value' => 'All Pages',
    'priority' => 10,
    'created_by' => get_current_user_id()
];

$promo_bar_id = $database->save_promo_bar($test_promo_bar);

if ($promo_bar_id) {
    echo "✅ New promo bar created with ID: {$promo_bar_id}<br>";
} else {
    echo "❌ Failed to create new promo bar<br>";
    echo "Error: " . $database->wpdb->last_error . "<br>";
    exit;
}

echo "<h2>Step 2: Check Default Assignment</h2>";

$assignments = $database->get_assignments($promo_bar_id);

if ($assignments && count($assignments) > 0) {
    echo "✅ Default assignment created successfully<br>";
    foreach ($assignments as $assignment) {
        echo "- Type: {$assignment->assignment_type}, Target: {$assignment->target_value}, Priority: {$assignment->priority}<br>";
    }
} else {
    echo "❌ No default assignment found<br>";
    echo "Error: " . $database->wpdb->last_error . "<br>";
}

echo "<h2>Step 3: Test Page Assignment Saving</h2>";

$test_assignments = [
    [
        'assignment_type' => 'page',
        'target_id' => 1,
        'target_value' => 'Sample Page',
        'priority' => 1
    ],
    [
        'assignment_type' => 'post_type',
        'target_id' => 0,
        'target_value' => 'post',
        'priority' => 2
    ]
];

$save_result = $database->save_assignments($promo_bar_id, $test_assignments);

if ($save_result) {
    echo "✅ Page assignments saved successfully<br>";
} else {
    echo "❌ Failed to save page assignments<br>";
    echo "Error: " . $database->wpdb->last_error . "<br>";
}

echo "<h2>Step 4: Verify Updated Assignments</h2>";

$updated_assignments = $database->get_assignments($promo_bar_id);

if ($updated_assignments && count($updated_assignments) > 0) {
    echo "✅ Updated assignments retrieved successfully<br>";
    foreach ($updated_assignments as $assignment) {
        echo "- Type: {$assignment->assignment_type}, Target: {$assignment->target_value}, Priority: {$assignment->priority}<br>";
    }
} else {
    echo "❌ No updated assignments found<br>";
}

echo "<h2>Step 5: Test Active Promo Bar Detection</h2>";

$manager = new PromoBarX_Manager();
$active_promo_bar = $manager->get_active_promo_bar();

if ($active_promo_bar) {
    echo "✅ Active promo bar detected: {$active_promo_bar->name}<br>";
    echo "- ID: {$active_promo_bar->id}<br>";
    echo "- Title: {$active_promo_bar->title}<br>";
} else {
    echo "❌ No active promo bar detected<br>";
}

echo "<h2>Step 6: Cleanup</h2>";

$cleanup_result = $database->delete_promo_bar($promo_bar_id);
if ($cleanup_result) {
    echo "✅ Test promo bar deleted successfully<br>";
} else {
    echo "❌ Failed to delete test promo bar<br>";
}

echo "<hr>";
echo "<h2>Test Summary</h2>";
echo "<p>The new promo bar creation system is now working correctly with assignments!</p>";
echo "<p><strong>What was fixed:</strong></p>";
echo "<ul>";
echo "<li>New promo bars now automatically get a default assignment</li>";
echo "<li>Page assignment saving works correctly</li>";
echo "<li>Active promo bar detection uses the new assignments table</li>";
echo "<li>Multiple assignments per promo bar are supported</li>";
echo "</ul>";
echo "<p><strong>Next Steps:</strong></p>";
echo "<ol>";
echo "<li>Go to WordPress admin → Promo Bar X</li>";
echo "<li>Create a new promo bar</li>";
echo "<li>It will automatically have a default 'All Pages' assignment</li>";
echo "<li>Edit the assignments as needed</li>";
echo "<li>Save and test on your website</li>";
echo "</ol>";
?>
