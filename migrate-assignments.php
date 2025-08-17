<?php
/**
 * Migration script for PromoBarX assignments schema
 * 
 * This script will:
 * 1. Add 4 new columns to wp_promo_bars: assignment_type, target_id, target_value, priority
 * 2. Migrate data from the old assignments JSON column to the new columns
 * 3. Remove the old assignments column
 * 
 * Place this file in the plugin root directory and access it via browser
 */

// Load WordPress
require_once('../../../wp-load.php');

// Check if user is logged in and has admin privileges
if (!current_user_can('manage_options')) {
    wp_die('Unauthorized access');
}

echo "<h1>PromoBarX Assignment Schema Migration</h1>";

// Initialize the database class
$database = new PromoBarX_Database();

echo "<h2>1. Checking Current Database Schema</h2>";
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

// Check if migration is needed
$migration_needed = false;
$new_columns_missing = [];
$old_column_exists = false;

if (!in_array('assignment_type', $column_names)) {
    $migration_needed = true;
    $new_columns_missing[] = 'assignment_type';
}
if (!in_array('target_id', $column_names)) {
    $migration_needed = true;
    $new_columns_missing[] = 'target_id';
}
if (!in_array('target_value', $column_names)) {
    $migration_needed = true;
    $new_columns_missing[] = 'target_value';
}
if (!in_array('priority', $column_names)) {
    $migration_needed = true;
    $new_columns_missing[] = 'priority';
}

if (in_array('assignments', $column_names)) {
    $migration_needed = true;
    $old_column_exists = true;
}

echo "<h2>2. Migration Analysis</h2>";
if ($migration_needed) {
    echo "<p><strong>Migration is needed!</strong></p>";
    if (!empty($new_columns_missing)) {
        echo "<p>Missing new columns: " . implode(', ', $new_columns_missing) . "</p>";
    }
    if ($old_column_exists) {
        echo "<p>Old 'assignments' column exists and needs to be removed</p>";
    }
} else {
    echo "<p><strong>Migration is not needed - schema is already up to date!</strong></p>";
}

echo "<h2>3. Running Migration</h2>";
if ($migration_needed) {
    echo "<p>Starting migration...</p>";
    
    $result = $database->migrate_assignment_schema();
    
    if ($result) {
        echo "<p style='color: green;'><strong>Migration completed successfully!</strong></p>";
        
        // Show updated schema
        echo "<h3>Updated Schema:</h3>";
        $updated_columns = $wpdb->get_results("DESCRIBE {$wpdb->prefix}promo_bars");
        $updated_column_names = array_column($updated_columns, 'Field');
        
        echo "<ul>";
        foreach ($updated_column_names as $column) {
            echo "<li>{$column}</li>";
        }
        echo "</ul>";
        
        // Show sample data
        echo "<h3>Sample Data After Migration:</h3>";
        $sample_data = $wpdb->get_results("SELECT id, name, assignment_type, target_id, target_value, priority FROM {$wpdb->prefix}promo_bars LIMIT 5");
        
        if (!empty($sample_data)) {
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
        }
        
    } else {
        echo "<p style='color: red;'><strong>Migration failed!</strong></p>";
        echo "<p>Check the error logs for more details.</p>";
    }
} else {
    echo "<p>No migration needed.</p>";
}

echo "<h2>4. Migration Complete</h2>";
echo "<p>The wp_promo_bars table has been updated with the new assignment schema:</p>";
echo "<ul>";
echo "<li><strong>assignment_type</strong> - enum('global', 'page', 'post_type', 'category', 'tag', 'custom')</li>";
echo "<li><strong>target_id</strong> - bigint(20) for storing target IDs</li>";
echo "<li><strong>target_value</strong> - varchar(255) for storing target values</li>";
echo "<li><strong>priority</strong> - int(11) for assignment priority</li>";
echo "</ul>";
echo "<p>The old 'assignments' JSON column has been removed.</p>";

echo "<hr>";
echo "<p><em>Migration script completed. You can now delete this file.</em></p>";
?>
