<?php
/**
 * Fix Database Schema
 * 
 * This script manually triggers the database schema migration
 * to ensure all new columns are properly added
 */

// Load WordPress
require_once('../../../wp-load.php');

// Initialize database
$database = new PromoBarX_Database();

echo "<h1>Database Schema Fix</h1>\n";

// Check current schema
echo "<h2>Current Schema Check</h2>\n";

$columns = $database->wpdb->get_results("DESCRIBE {$database->table_prefix}promo_bar_assignments");
$column_names = array_column($columns, 'Field');

echo "<h3>Current Columns:</h3>\n";
echo "<ul>\n";
foreach ($column_names as $column) {
    echo "<li>{$column}</li>\n";
}
echo "</ul>\n";

// Check if new columns are missing
$missing_columns = [];
$required_columns = ['condition_logic', 'condition_data', 'frequency_cap', 'traffic_percentage'];

foreach ($required_columns as $column) {
    if (!in_array($column, $column_names)) {
        $missing_columns[] = $column;
    }
}

if (!empty($missing_columns)) {
    echo "<h2>Missing Columns Found</h2>\n";
    echo "<p>Missing columns: " . implode(', ', $missing_columns) . "</p>\n";
    
    // Trigger migration
    echo "<h2>Running Migration</h2>\n";
    
    $migration_result = $database->migrate_assignments_table_schema();
    
    if ($migration_result) {
        echo "<p>✅ Migration completed successfully</p>\n";
    } else {
        echo "<p>❌ Migration failed</p>\n";
    }
    
    // Check schema again
    echo "<h2>Updated Schema Check</h2>\n";
    
    $updated_columns = $database->wpdb->get_results("DESCRIBE {$database->table_prefix}promo_bar_assignments");
    $updated_column_names = array_column($updated_columns, 'Field');
    
    echo "<h3>Updated Columns:</h3>\n";
    echo "<ul>\n";
    foreach ($updated_column_names as $column) {
        echo "<li>{$column}</li>\n";
    }
    echo "</ul>\n";
    
    // Check if all required columns are now present
    $still_missing = [];
    foreach ($required_columns as $column) {
        if (!in_array($column, $updated_column_names)) {
            $still_missing[] = $column;
        }
    }
    
    if (empty($still_missing)) {
        echo "<p>✅ All required columns are now present</p>\n";
    } else {
        echo "<p>❌ Still missing columns: " . implode(', ', $still_missing) . "</p>\n";
    }
    
} else {
    echo "<p>✅ All required columns are already present</p>\n";
}

// Test assignment types
echo "<h2>Assignment Types Check</h2>\n";

$assignment_type_column = $database->wpdb->get_row("SHOW COLUMNS FROM {$database->table_prefix}promo_bar_assignments LIKE 'assignment_type'");

if ($assignment_type_column) {
    $enum_values = str_replace(['enum(', ')', "'"], '', $assignment_type_column->Type);
    $enum_array = explode(',', $enum_values);
    
    echo "<h3>Available Assignment Types:</h3>\n";
    echo "<ul>\n";
    foreach ($enum_array as $type) {
        echo "<li>{$type}</li>\n";
    }
    echo "</ul>\n";
    
    $required_types = ['user_role', 'device_type', 'referrer', 'country', 'time_based'];
    $missing_types = [];
    
    foreach ($required_types as $type) {
        if (!in_array($type, $enum_array)) {
            $missing_types[] = $type;
        }
    }
    
    if (!empty($missing_types)) {
        echo "<p>❌ Missing assignment types: " . implode(', ', $missing_types) . "</p>\n";
    } else {
        echo "<p>✅ All required assignment types are available</p>\n";
    }
}

echo "<h2>Schema Fix Complete!</h2>\n";
echo "<p>The database schema has been checked and updated if necessary.</p>\n";
?>
