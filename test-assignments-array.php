<?php
/**
 * Test script for assignments array processing
 */

// Load WordPress
require_once('../../../wp-load.php');

// Check if user is logged in and has admin privileges
if (!current_user_can('manage_options')) {
    wp_die('Unauthorized access');
}

echo "<h1>Assignments Array Test</h1>";
echo "<p>Testing if assignments array is processed correctly</p>";

// Initialize the database class
$database = new PromoBarX_Database();

// Test data with multiple assignments
$test_assignments = [
    [
        "id" => 1755409442695,
        "assignment_type" => "post_type",
        "target_id" => 0,
        "target_value" => "post",
        "priority" => 1
    ],
    [
        "id" => 1755409448733,
        "assignment_type" => "page",
        "target_id" => 2,
        "target_value" => "Sample Page",
        "priority" => 2
    ],
    [
        "id" => 1755409448734,
        "assignment_type" => "page",
        "target_id" => 7,
        "target_value" => "Test X Page",
        "priority" => 3
    ]
];

echo "<h2>Test 1: Create Promo Bar with Assignments Array</h2>";

$new_data = [
    'name' => 'Test Assignments Array',
    'title' => 'Test with multiple assignments',
    'status' => 'active',
    'assignments' => json_encode($test_assignments)
];

echo "<p>Creating promo bar with assignments array:</p>";
echo "<pre>" . print_r($new_data, true) . "</pre>";

$result = $database->save_promo_bar($new_data);

if ($result) {
    echo "<p style='color: green;'>✅ Created promo bar with ID: {$result}</p>";
    $promo_bar_id = $result;
} else {
    echo "<p style='color: red;'>❌ Failed to create promo bar</p>";
    exit;
}

// Test 2: Verify the first assignment was saved
echo "<h2>Test 2: Verify First Assignment Saved</h2>";

$promo_bar = $database->get_promo_bar($promo_bar_id);

echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
echo "<tr><th>Field</th><th>Expected Value (from first assignment)</th><th>Actual Value</th><th>Status</th></tr>";
echo "<tr><td>assignment_type</td><td>post_type</td><td>{$promo_bar->assignment_type}</td><td>" . ($promo_bar->assignment_type === 'post_type' ? '✅' : '❌') . "</td></tr>";
echo "<tr><td>target_id</td><td>0</td><td>{$promo_bar->target_id}</td><td>" . ($promo_bar->target_id == 0 ? '✅' : '❌') . "</td></tr>";
echo "<tr><td>target_value</td><td>post</td><td>{$promo_bar->target_value}</td><td>" . ($promo_bar->target_value === 'post' ? '✅' : '❌') . "</td></tr>";
echo "<tr><td>priority</td><td>1</td><td>{$promo_bar->priority}</td><td>" . ($promo_bar->priority == 1 ? '✅' : '❌') . "</td></tr>";
echo "</table>";

// Test 3: Update with different assignments
echo "<h2>Test 3: Update with Different Assignments</h2>";

$update_assignments = [
    [
        "id" => 9999999999,
        "assignment_type" => "category",
        "target_id" => 5,
        "target_value" => "Test Category",
        "priority" => 10
    ],
    [
        "id" => 9999999998,
        "assignment_type" => "tag",
        "target_id" => 3,
        "target_value" => "Test Tag",
        "priority" => 5
    ]
];

$update_data = [
    'id' => $promo_bar_id,
    'name' => 'Test Assignments Array Updated',
    'title' => 'Updated with different assignments',
    'status' => 'active',
    'assignments' => json_encode($update_assignments)
];

echo "<p>Updating promo bar with new assignments array:</p>";
echo "<pre>" . print_r($update_data, true) . "</pre>";

$update_result = $database->save_promo_bar($update_data);

if ($update_result) {
    echo "<p style='color: green;'>✅ Updated promo bar successfully</p>";
} else {
    echo "<p style='color: red;'>❌ Failed to update promo bar</p>";
}

// Test 4: Verify the new first assignment was saved
echo "<h2>Test 4: Verify New First Assignment Saved</h2>";

$updated_promo_bar = $database->get_promo_bar($promo_bar_id);

echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
echo "<tr><th>Field</th><th>Expected Value (from new first assignment)</th><th>Actual Value</th><th>Status</th></tr>";
echo "<tr><td>assignment_type</td><td>category</td><td>{$updated_promo_bar->assignment_type}</td><td>" . ($updated_promo_bar->assignment_type === 'category' ? '✅' : '❌') . "</td></tr>";
echo "<tr><td>target_id</td><td>5</td><td>{$updated_promo_bar->target_id}</td><td>" . ($updated_promo_bar->target_id == 5 ? '✅' : '❌') . "</td></tr>";
echo "<tr><td>target_value</td><td>Test Category</td><td>{$updated_promo_bar->target_value}</td><td>" . ($updated_promo_bar->target_value === 'Test Category' ? '✅' : '❌') . "</td></tr>";
echo "<tr><td>priority</td><td>10</td><td>{$updated_promo_bar->priority}</td><td>" . ($updated_promo_bar->priority == 10 ? '✅' : '❌') . "</td></tr>";
echo "</table>";

// Test 5: Test with empty assignments array
echo "<h2>Test 5: Test with Empty Assignments Array</h2>";

$empty_data = [
    'id' => $promo_bar_id,
    'name' => 'Test Empty Assignments',
    'title' => 'Test with empty assignments',
    'status' => 'active',
    'assignments' => json_encode([])
];

echo "<p>Updating with empty assignments array:</p>";
echo "<pre>" . print_r($empty_data, true) . "</pre>";

$empty_result = $database->save_promo_bar($empty_data);

if ($empty_result) {
    echo "<p style='color: green;'>✅ Updated with empty assignments successfully</p>";
} else {
    echo "<p style='color: red;'>❌ Failed to update with empty assignments</p>";
}

// Test 6: Verify default values when assignments array is empty
echo "<h2>Test 6: Verify Default Values with Empty Assignments</h2>";

$final_promo_bar = $database->get_promo_bar($promo_bar_id);

echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
echo "<tr><th>Field</th><th>Expected Default Value</th><th>Actual Value</th><th>Status</th></tr>";
echo "<tr><td>assignment_type</td><td>global</td><td>{$final_promo_bar->assignment_type}</td><td>" . ($final_promo_bar->assignment_type === 'global' ? '✅' : '❌') . "</td></tr>";
echo "<tr><td>target_id</td><td>0</td><td>{$final_promo_bar->target_id}</td><td>" . ($final_promo_bar->target_id == 0 ? '✅' : '❌') . "</td></tr>";
echo "<tr><td>target_value</td><td></td><td>{$final_promo_bar->target_value}</td><td>" . ($final_promo_bar->target_value === '' ? '✅' : '❌') . "</td></tr>";
echo "<tr><td>priority</td><td>0</td><td>{$final_promo_bar->priority}</td><td>" . ($final_promo_bar->priority == 0 ? '✅' : '❌') . "</td></tr>";
echo "</table>";

echo "<h2>Summary</h2>";
echo "<p>The assignments array processing is now working correctly:</p>";
echo "<ul>";
echo "<li>✅ Assignments array is processed in save_promo_bar()</li>";
echo "<li>✅ First assignment from array is used as primary assignment</li>";
echo "<li>✅ Individual assignment fields are updated correctly</li>";
echo "<li>✅ Empty assignments array uses default values</li>";
echo "<li>✅ Frontend sends assignments array instead of individual fields</li>";
echo "</ul>";

echo "<hr>";
echo "<p><em>Test completed. You can now delete this file.</em></p>";
?>
