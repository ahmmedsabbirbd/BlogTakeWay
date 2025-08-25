<?php
/**
 * Test script to debug assignment priority issues
 */

// Include WordPress
require_once('../../../wp-load.php');

// Check if we're in admin
if (!current_user_can('manage_options')) {
    wp_die('Unauthorized access');
}

echo "<h1>Assignment Priority Debug Test</h1>";

// Get the database class
global $wpdb;
$table_prefix = $wpdb->prefix . 'promo_bar_x_';

// Test 1: Check current assignments in database
echo "<h2>1. Current Assignments in Database</h2>";
$assignments_table = $table_prefix . 'assignments';
$results = $wpdb->get_results("SELECT * FROM {$assignments_table} ORDER BY promo_bar_id, priority");

if ($results) {
    echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
    echo "<tr><th>ID</th><th>Promo Bar ID</th><th>Assignment Type</th><th>Target ID</th><th>Target Value</th><th>Priority</th><th>Created At</th></tr>";
    foreach ($results as $row) {
        echo "<tr>";
        echo "<td>{$row->id}</td>";
        echo "<td>{$row->promo_bar_id}</td>";
        echo "<td>{$row->assignment_type}</td>";
        echo "<td>{$row->target_id}</td>";
        echo "<td>{$row->target_value}</td>";
        echo "<td>{$row->priority}</td>";
        echo "<td>{$row->created_at}</td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "<p>No assignments found in database.</p>";
}

// Test 2: Check promo bars table
echo "<h2>2. Promo Bars Table Structure</h2>";
$promo_bars_table = $table_prefix . 'promo_bars';
$table_structure = $wpdb->get_results("DESCRIBE {$promo_bars_table}");

if ($table_structure) {
    echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
    echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";
    foreach ($table_structure as $field) {
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
}

// Test 3: Check a specific promo bar's assignments
echo "<h2>3. Sample Promo Bar Assignments (JSON format)</h2>";
$sample_promo_bar = $wpdb->get_row("SELECT * FROM {$promo_bars_table} LIMIT 1");

if ($sample_promo_bar) {
    echo "<p><strong>Promo Bar ID:</strong> {$sample_promo_bar->id}</p>";
    echo "<p><strong>Name:</strong> {$sample_promo_bar->name}</p>";
    echo "<p><strong>Assignments (JSON):</strong></p>";
    echo "<pre style='background: #f5f5f5; padding: 10px; border: 1px solid #ddd;'>";
    echo htmlspecialchars($sample_promo_bar->assignments);
    echo "</pre>";
    
    // Parse and display assignments
    if ($sample_promo_bar->assignments) {
        $assignments = json_decode($sample_promo_bar->assignments, true);
        if ($assignments) {
            echo "<p><strong>Parsed Assignments:</strong></p>";
            echo "<pre style='background: #f5f5f5; padding: 10px; border: 1px solid #ddd;'>";
            print_r($assignments);
            echo "</pre>";
        }
    }
}

// Test 4: Simulate the JavaScript assignment structure
echo "<h2>4. JavaScript Assignment Structure Simulation</h2>";
echo "<p>This shows how assignments should look in the JavaScript currentAssignments array:</p>";

$js_assignments = [
    [
        'id' => '166',
        'assignment_type' => 'page',
        'target_id' => '10',
        'target_value' => 'Promo bar test x',
        'priority' => 1
    ],
    [
        'id' => '167',
        'assignment_type' => 'category',
        'target_id' => '5',
        'target_value' => 'Test Category',
        'priority' => 2
    ]
];

echo "<pre style='background: #f5f5f5; padding: 10px; border: 1px solid #ddd;'>";
echo "// Expected JavaScript structure:\n";
echo "let currentAssignments = " . json_encode($js_assignments, JSON_PRETTY_PRINT) . ";\n\n";
echo "// When saving:\n";
echo "data.assignments = JSON.stringify(currentAssignments);\n";
echo "</pre>";

// Test 5: Check if there are any assignments without priority
echo "<h2>5. Assignments Without Priority</h2>";
$assignments_without_priority = $wpdb->get_results("SELECT * FROM {$assignments_table} WHERE priority IS NULL OR priority = 0");

if ($assignments_without_priority) {
    echo "<p><strong>Found " . count($assignments_without_priority) . " assignments without priority:</strong></p>";
    echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
    echo "<tr><th>ID</th><th>Promo Bar ID</th><th>Assignment Type</th><th>Target Value</th><th>Priority</th></tr>";
    foreach ($assignments_without_priority as $row) {
        echo "<tr>";
        echo "<td>{$row->id}</td>";
        echo "<td>{$row->promo_bar_id}</td>";
        echo "<td>{$row->assignment_type}</td>";
        echo "<td>{$row->target_value}</td>";
        echo "<td>{$row->priority}</td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "<p>All assignments have priority values.</p>";
}

echo "<h2>6. Debug Information</h2>";
echo "<p><strong>Current time:</strong> " . date('Y-m-d H:i:s') . "</p>";
echo "<p><strong>WordPress version:</strong> " . get_bloginfo('version') . "</p>";
echo "<p><strong>Database prefix:</strong> " . $wpdb->prefix . "</p>";
echo "<p><strong>Plugin table prefix:</strong> " . $table_prefix . "</p>";

echo "<h2>7. Recommendations</h2>";
echo "<ol>";
echo "<li>Check if assignments are being saved with proper priority values in the database</li>";
echo "<li>Verify that the JavaScript currentAssignments array is being updated correctly</li>";
echo "<li>Ensure that the updateAssignmentPriority function is working properly</li>";
echo "<li>Check if there's a mismatch between the database structure and the JavaScript data structure</li>";
echo "</ol>";
?>
