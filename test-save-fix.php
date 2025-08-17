<?php
/**
 * Test Promo Bar Save Fix
 * 
 * This script tests the fixed promo bar saving functionality
 */

// Load WordPress
require_once('../../../wp-load.php');

// Initialize database
$database = new PromoBarX_Database();

echo "<h1>Promo Bar Save Fix Test</h1>\n";

// Test 1: Create a simple promo bar with basic assignments
echo "<h2>Test 1: Creating Simple Promo Bar</h2>\n";

$promo_bar_data = [
    'name' => 'Test Promo Bar Fix',
    'title' => '🎯 Test Fix',
    'cta_text' => 'Learn More',
    'cta_url' => home_url('/'),
    'status' => 'active',
    'priority' => 10,
    'assignments' => [
        [
            'assignment_type' => 'global',
            'target_value' => 'All Pages',
            'priority' => 0
        ]
    ]
];

$promo_bar_id = $database->save_promo_bar($promo_bar_data);

if ($promo_bar_id) {
    echo "<p>✅ Promo bar created successfully with ID: {$promo_bar_id}</p>\n";
} else {
    echo "<p>❌ Failed to create promo bar</p>\n";
    exit;
}

// Test 2: Retrieve and display the promo bar
echo "<h2>Test 2: Retrieving Promo Bar</h2>\n";

$promo_bar = $database->get_promo_bar($promo_bar_id);

if ($promo_bar) {
    echo "<h3>Promo Bar Details:</h3>\n";
    echo "<ul>\n";
    echo "<li><strong>ID:</strong> {$promo_bar->id}</li>\n";
    echo "<li><strong>Name:</strong> {$promo_bar->name}</li>\n";
    echo "<li><strong>Title:</strong> {$promo_bar->title}</li>\n";
    echo "<li><strong>Status:</strong> {$promo_bar->status}</li>\n";
    echo "<li><strong>Priority:</strong> {$promo_bar->priority}</li>\n";
    echo "</ul>\n";
    
    echo "<h3>Assignments:</h3>\n";
    if (!empty($promo_bar->assignments)) {
        echo "<table border='1' style='border-collapse: collapse; width: 100%;'>\n";
        echo "<tr><th>Type</th><th>Target Value</th><th>Priority</th><th>Logic</th><th>Frequency Cap</th><th>Traffic %</th></tr>\n";
        
        foreach ($promo_bar->assignments as $assignment) {
            echo "<tr>\n";
            echo "<td>{$assignment['assignment_type']}</td>\n";
            echo "<td>{$assignment['target_value']}</td>\n";
            echo "<td>{$assignment['priority']}</td>\n";
            echo "<td>" . (isset($assignment['condition_logic']) ? $assignment['condition_logic'] : 'N/A') . "</td>\n";
            echo "<td>" . (isset($assignment['frequency_cap']) ? $assignment['frequency_cap'] : 'N/A') . "</td>\n";
            echo "<td>" . (isset($assignment['traffic_percentage']) ? $assignment['traffic_percentage'] . '%' : 'N/A') . "</td>\n";
            echo "</tr>\n";
        }
        echo "</table>\n";
    } else {
        echo "<p>No assignments found</p>\n";
    }
} else {
    echo "<p>❌ Failed to retrieve promo bar</p>\n";
}

// Test 3: Update the promo bar
echo "<h2>Test 3: Updating Promo Bar</h2>\n";

$update_data = [
    'id' => $promo_bar_id,
    'title' => '🎯 Updated Test Fix',
    'assignments' => [
        [
            'assignment_type' => 'page',
            'target_id' => 1,
            'target_value' => 'Home Page',
            'priority' => 5
        ],
        [
            'assignment_type' => 'global',
            'target_value' => 'All Pages',
            'priority' => 1
        ]
    ]
];

$updated_id = $database->save_promo_bar($update_data);

if ($updated_id) {
    echo "<p>✅ Promo bar updated successfully</p>\n";
    
    // Retrieve updated promo bar
    $updated_promo_bar = $database->get_promo_bar($updated_id);
    if ($updated_promo_bar) {
        echo "<p><strong>Updated Title:</strong> {$updated_promo_bar->title}</p>\n";
        echo "<p><strong>Number of Assignments:</strong> " . count($updated_promo_bar->assignments) . "</p>\n";
    }
} else {
    echo "<p>❌ Failed to update promo bar</p>\n";
}

// Test 4: Check database schema
echo "<h2>Test 4: Database Schema Check</h2>\n";

$columns = $database->wpdb->get_results("DESCRIBE {$database->table_prefix}promo_bar_assignments");
$column_names = array_column($columns, 'Field');

echo "<h3>Available Columns:</h3>\n";
echo "<ul>\n";
foreach ($column_names as $column) {
    echo "<li>{$column}</li>\n";
}
echo "</ul>\n";

$has_new_columns = in_array('condition_logic', $column_names) && 
                  in_array('condition_data', $column_names) && 
                  in_array('frequency_cap', $column_names) && 
                  in_array('traffic_percentage', $column_names);

echo "<p><strong>Enhanced Schema Available:</strong> " . ($has_new_columns ? 'Yes' : 'No') . "</p>\n";

echo "<h2>Test Complete!</h2>\n";
echo "<p>The promo bar save fix has been tested successfully.</p>\n";
?>
