<?php
/**
 * Test script for PromoBarX assignment schema migration
 * 
 * This script will test the migration and show the results
 */

// Load WordPress
require_once('../../../wp-load.php');

// Check if user is logged in and has admin privileges
if (!current_user_can('manage_options')) {
    wp_die('Unauthorized access');
}

echo "<h1>PromoBarX Assignment Schema Migration Test</h1>";

// Initialize the database class
$database = new PromoBarX_Database();

echo "<h2>1. Testing Migration</h2>";

// Run the migration
$migration_result = $database->migrate_assignment_schema();

if ($migration_result) {
    echo "<p style='color: green;'><strong>Migration completed successfully!</strong></p>";
} else {
    echo "<p style='color: red;'><strong>Migration failed!</strong></p>";
}

echo "<h2>2. Verifying Schema</h2>";
global $wpdb;

// Check current table structure
$columns = $wpdb->get_results("DESCRIBE {$wpdb->prefix}promo_bars");
$column_names = array_column($columns, 'Field');

echo "<h3>Current Columns in wp_promo_bars:</h3>";
echo "<ul>";
foreach ($column_names as $column) {
    echo "<li>{$column}</li>";
}
echo "</ul>";

// Check for required columns
$required_columns = ['assignment_type', 'target_id', 'target_value', 'priority'];
$missing_columns = [];

foreach ($required_columns as $column) {
    if (!in_array($column, $column_names)) {
        $missing_columns[] = $column;
    }
}

if (empty($missing_columns)) {
    echo "<p style='color: green;'><strong>All required columns are present!</strong></p>";
} else {
    echo "<p style='color: red;'><strong>Missing columns: " . implode(', ', $missing_columns) . "</strong></p>";
}

// Check if old assignments column is removed
if (in_array('assignments', $column_names)) {
    echo "<p style='color: red;'><strong>Old 'assignments' column still exists!</strong></p>";
} else {
    echo "<p style='color: green;'><strong>Old 'assignments' column has been removed!</strong></p>";
}

echo "<h2>3. Testing Data</h2>";

// Get sample data
$sample_data = $wpdb->get_results("SELECT id, name, assignment_type, target_id, target_value, priority FROM {$wpdb->prefix}promo_bars LIMIT 5");

if (!empty($sample_data)) {
    echo "<h3>Sample Data:</h3>";
    echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
    echo "<tr><th>ID</th><th>Name</th><th>Assignment Type</th><th>Target ID</th><th>Target Value</th><th>Priority</th></tr>";
    foreach ($sample_data as $row) {
        echo "<tr>";
        echo "<td>{$row->id}</td>";
        echo "<td>{$row->name}</td>";
        echo "<td>{$row->assignment_type}</td>";
        echo "<td>{$row->target_id}</td>";
        echo "<td>{$row->target_value}</td>";
        echo "<td>{$row->priority}</td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "<p>No promo bars found in the database.</p>";
}

echo "<h2>4. Testing Assignment Functionality</h2>";

// Test the assignment methods
if (!empty($sample_data)) {
    $test_promo_bar = $sample_data[0];
    
    echo "<h3>Testing Assignment Methods for Promo Bar ID: {$test_promo_bar->id}</h3>";
    
    // Test getting assignments
    $assignments = $database->get_assignments($test_promo_bar->id);
    echo "<p>Assignments retrieved: " . count($assignments) . "</p>";
    
    // Test assignment summary
    $summary = $database->get_assignment_summary($test_promo_bar->id);
    echo "<p>Assignment summary: " . implode(', ', $summary) . "</p>";
}

echo "<h2>5. Migration Summary</h2>";
echo "<p>The wp_promo_bars table has been updated with the new assignment schema:</p>";
echo "<ul>";
echo "<li><strong>assignment_type</strong> - enum('global', 'page', 'post_type', 'category', 'tag', 'custom')</li>";
echo "<li><strong>target_id</strong> - bigint(20) for storing target IDs</li>";
echo "<li><strong>target_value</strong> - varchar(255) for storing target values</li>";
echo "<li><strong>priority</strong> - int(11) for assignment priority</li>";
echo "</ul>";
echo "<p>The old 'assignments' JSON column has been removed.</p>";

echo "<hr>";
echo "<p><em>Migration test completed. You can now delete this file.</em></p>";
?>
