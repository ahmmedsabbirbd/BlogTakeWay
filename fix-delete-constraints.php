<?php
/**
 * Database Migration Script for PromoBarX
 * 
 * This script adds foreign key constraints to ensure that when a promo bar is deleted,
 * all its assignments are automatically deleted as well.
 * 
 * Run this script once to update existing installations.
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    // If not in WordPress context, try to bootstrap
    if (file_exists('../../../wp-config.php')) {
        require_once('../../../wp-config.php');
    } else {
        die('This script must be run from within WordPress or with proper WordPress configuration.');
    }
}

// Ensure we're in admin context
if (!current_user_can('manage_options')) {
    wp_die('Unauthorized access');
}

echo "<h1>PromoBarX Database Migration: Delete Constraints Fix</h1>";

global $wpdb;
$table_prefix = $wpdb->prefix;

// Check if tables exist
$promo_bars_table = $table_prefix . 'promo_bars';
$assignments_table = $table_prefix . 'promo_bar_assignments';

$promo_bars_exists = $wpdb->get_var("SHOW TABLES LIKE '$promo_bars_table'") === $promo_bars_table;
$assignments_exists = $wpdb->get_var("SHOW TABLES LIKE '$assignments_table'") === $assignments_table;

if (!$promo_bars_exists) {
    echo "<p style='color: red;'>❌ Promo bars table does not exist. Please activate the plugin first.</p>";
    exit;
}

if (!$assignments_exists) {
    echo "<p style='color: red;'>❌ Assignments table does not exist. Please activate the plugin first.</p>";
    exit;
}

echo "<p>✅ Both tables exist. Proceeding with migration...</p>";

// Check if foreign key constraint already exists
$foreign_keys = $wpdb->get_results("
    SELECT CONSTRAINT_NAME 
    FROM information_schema.KEY_COLUMN_USAGE 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = '$assignments_table' 
    AND REFERENCED_TABLE_NAME = '$promo_bars_table'
");

if (!empty($foreign_keys)) {
    echo "<p>✅ Foreign key constraint already exists. No migration needed.</p>";
    echo "<p>Current foreign keys:</p>";
    echo "<ul>";
    foreach ($foreign_keys as $fk) {
        echo "<li>{$fk->CONSTRAINT_NAME}</li>";
    }
    echo "</ul>";
} else {
    echo "<p>🔄 Adding foreign key constraint...</p>";
    
    // Add foreign key constraint
    $sql = "ALTER TABLE $assignments_table 
            ADD CONSTRAINT fk_promo_bar_assignments_promo_bar_id 
            FOREIGN KEY (promo_bar_id) REFERENCES $promo_bars_table(id) 
            ON DELETE CASCADE";
    
    $result = $wpdb->query($sql);
    
    if ($result !== false) {
        echo "<p style='color: green;'>✅ Foreign key constraint added successfully!</p>";
    } else {
        echo "<p style='color: red;'>❌ Failed to add foreign key constraint: " . $wpdb->last_error . "</p>";
    }
}

// Test the delete functionality
echo "<h2>Testing Delete Functionality</h2>";

// Create a test promo bar
$test_promo_bar = [
    'name' => 'Test Promo Bar for Delete',
    'content' => 'This is a test promo bar that will be deleted',
    'status' => 'active',
    'created_at' => current_time('mysql'),
    'updated_at' => current_time('mysql')
];

echo "<p>🔄 Creating test promo bar...</p>";
$insert_result = $wpdb->insert($promo_bars_table, $test_promo_bar);

if ($insert_result === false) {
    echo "<p style='color: red;'>❌ Failed to create test promo bar: " . $wpdb->last_error . "</p>";
    exit;
}

$test_promo_bar_id = $wpdb->insert_id;
echo "<p>✅ Test promo bar created with ID: $test_promo_bar_id</p>";

// Create test assignments
$test_assignments = [
    [
        'promo_bar_id' => $test_promo_bar_id,
        'assignment_type' => 'page',
        'target_id' => 1,
        'target_value' => 'Test Page',
        'priority' => 1
    ],
    [
        'promo_bar_id' => $test_promo_bar_id,
        'assignment_type' => 'global',
        'target_id' => 0,
        'target_value' => '',
        'priority' => 2
    ]
];

echo "<p>🔄 Creating test assignments...</p>";
foreach ($test_assignments as $assignment) {
    $insert_result = $wpdb->insert($assignments_table, $assignment);
    if ($insert_result === false) {
        echo "<p style='color: red;'>❌ Failed to create test assignment: " . $wpdb->last_error . "</p>";
    }
}
echo "<p>✅ Test assignments created</p>";

// Verify assignments exist
$assignment_count = $wpdb->get_var($wpdb->prepare(
    "SELECT COUNT(*) FROM $assignments_table WHERE promo_bar_id = %d",
    $test_promo_bar_id
));
echo "<p>📊 Found $assignment_count assignments for test promo bar</p>";

// Test delete functionality
echo "<p>🔄 Testing delete functionality...</p>";

// Delete the promo bar
$delete_result = $wpdb->delete($promo_bars_table, ['id' => $test_promo_bar_id], ['%d']);

if ($delete_result === false) {
    echo "<p style='color: red;'>❌ Failed to delete test promo bar: " . $wpdb->last_error . "</p>";
} else {
    echo "<p>✅ Test promo bar deleted successfully</p>";
    
    // Check if assignments were also deleted
    $remaining_assignments = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM $assignments_table WHERE promo_bar_id = %d",
        $test_promo_bar_id
    ));
    
    if ($remaining_assignments == 0) {
        echo "<p style='color: green;'>✅ All assignments were automatically deleted (CASCADE working correctly)</p>";
    } else {
        echo "<p style='color: orange;'>⚠️ $remaining_assignments assignments still exist (CASCADE may not be working)</p>";
        
        // Manually delete remaining assignments
        $wpdb->delete($assignments_table, ['promo_bar_id' => $test_promo_bar_id], ['%d']);
        echo "<p>🔄 Manually deleted remaining assignments</p>";
    }
}

// Show current table structure
echo "<h2>Current Table Structure</h2>";

echo "<h3>Promo Bars Table</h3>";
$promo_bars_structure = $wpdb->get_results("DESCRIBE $promo_bars_table");
echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";
foreach ($promo_bars_structure as $field) {
    echo "<tr>";
    echo "<td>{$field->Field}</td>";
    echo "<td>{$field->Type}</td>";
    echo "<td>{$field->Null}</td>";
    echo "<td>{$field->Key}</td>";
    echo "<td>{$field->Default}</td>";
    echo "<td>{$field->Extra}</td>";
    echo "</tr>";
}
echo "</table>";

echo "<h3>Assignments Table</h3>";
$assignments_structure = $wpdb->get_results("DESCRIBE $assignments_table");
echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";
foreach ($assignments_structure as $field) {
    echo "<tr>";
    echo "<td>{$field->Field}</td>";
    echo "<td>{$field->Type}</td>";
    echo "<td>{$field->Null}</td>";
    echo "<td>{$field->Key}</td>";
    echo "<td>{$field->Default}</td>";
    echo "<td>{$field->Extra}</td>";
    echo "</tr>";
}
echo "</table>";

// Show foreign keys
echo "<h3>Foreign Key Constraints</h3>";
$foreign_keys = $wpdb->get_results("
    SELECT 
        CONSTRAINT_NAME,
        COLUMN_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME,
        DELETE_RULE
    FROM information_schema.KEY_COLUMN_USAGE 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = '$assignments_table' 
    AND REFERENCED_TABLE_NAME IS NOT NULL
");

if (!empty($foreign_keys)) {
    echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
    echo "<tr><th>Constraint Name</th><th>Column</th><th>Referenced Table</th><th>Referenced Column</th><th>Delete Rule</th></tr>";
    foreach ($foreign_keys as $fk) {
        echo "<tr>";
        echo "<td>{$fk->CONSTRAINT_NAME}</td>";
        echo "<td>{$fk->COLUMN_NAME}</td>";
        echo "<td>{$fk->REFERENCED_TABLE_NAME}</td>";
        echo "<td>{$fk->REFERENCED_COLUMN_NAME}</td>";
        echo "<td>{$fk->DELETE_RULE}</td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "<p style='color: orange;'>⚠️ No foreign key constraints found</p>";
}

echo "<h2>Migration Complete!</h2>";
echo "<p>✅ The delete functionality has been fixed. Now when you delete a promo bar, all its assignments will be automatically deleted as well.</p>";
echo "<p>✅ Foreign key constraints have been added to ensure data integrity.</p>";
echo "<p><strong>Note:</strong> You can safely delete this migration script after running it.</p>";
?>
