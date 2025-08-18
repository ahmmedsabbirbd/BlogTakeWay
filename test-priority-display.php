<?php
/**
 * Test Priority Display
 * 
 * This file tests whether the priority field is being displayed correctly
 * in the admin interface after the migration to the assignments table.
 */

// Load WordPress
require_once('../../../wp-load.php');

// Check if user is logged in and has admin privileges
if (!current_user_can('manage_options')) {
    wp_die('Unauthorized access');
}

echo "<h1>Priority Display Test</h1>";

// Initialize the database class
$database = new PromoBarX_Database();

echo "<h2>1. Database Connection Test</h2>";
$connection_test = $database->test_database_connection();
echo "Database connection: " . ($connection_test ? "✅ PASS" : "❌ FAIL") . "<br>";

echo "<h2>2. Promo Bars with Priority Data</h2>";

// Get all promo bars with priority data
$promo_bars = $database->get_promo_bars(['status' => 'all']);

if (empty($promo_bars)) {
    echo "<p>No promo bars found.</p>";
} else {
    echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
    echo "<tr><th>ID</th><th>Name</th><th>Status</th><th>Max Priority</th><th>Created</th></tr>";
    
    foreach ($promo_bars as $promo_bar) {
        echo "<tr>";
        echo "<td>{$promo_bar->id}</td>";
        echo "<td>{$promo_bar->name}</td>";
        echo "<td>{$promo_bar->status}</td>";
        echo "<td style='background-color: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-weight: bold;'>{$promo_bar->max_priority}</td>";
        echo "<td>{$promo_bar->created_at}</td>";
        echo "</tr>";
    }
    echo "</table>";
}

echo "<h2>3. Assignments Data</h2>";

// Check assignments for each promo bar
foreach ($promo_bars as $promo_bar) {
    echo "<h3>Promo Bar: {$promo_bar->name} (ID: {$promo_bar->id})</h3>";
    
    $assignments = $database->get_assignments($promo_bar->id);
    
    if (empty($assignments)) {
        echo "<p>No assignments found.</p>";
    } else {
        echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
        echo "<tr><th>Assignment ID</th><th>Type</th><th>Target ID</th><th>Target Value</th><th>Priority</th></tr>";
        
        foreach ($assignments as $assignment) {
            echo "<tr>";
            echo "<td>{$assignment->id}</td>";
            echo "<td>{$assignment->assignment_type}</td>";
            echo "<td>{$assignment->target_id}</td>";
            echo "<td>{$assignment->target_value}</td>";
            echo "<td style='background-color: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 4px; font-weight: bold;'>{$assignment->priority}</td>";
            echo "</tr>";
        }
        echo "</table>";
    }
}

echo "<h2>4. AJAX Handler Test</h2>";

// Simulate the AJAX request
$_POST['action'] = 'promobarx_get_promo_bars';
$_POST['nonce'] = wp_create_nonce('promobarx_admin_nonce');
$_POST['status'] = 'all';

// Capture the output
ob_start();
$manager = new PromoBarX_Manager();
$manager->ajax_get_promo_bars();
$ajax_output = ob_get_clean();

echo "<p>AJAX Response:</p>";
echo "<pre>" . htmlspecialchars($ajax_output) . "</pre>";

echo "<h2>5. Summary</h2>";

$has_priority_data = false;
foreach ($promo_bars as $promo_bar) {
    if (isset($promo_bar->max_priority) && $promo_bar->max_priority > 0) {
        $has_priority_data = true;
        break;
    }
}

if ($has_priority_data) {
    echo "<p style='color: green;'>✅ Priority data is being retrieved correctly from the assignments table.</p>";
} else {
    echo "<p style='color: orange;'>⚠️ No priority data found. This might be normal if no assignments have been created yet.</p>";
}

echo "<p><strong>Next Steps:</strong></p>";
echo "<ul>";
echo "<li>Check the WordPress admin interface to see if priority is displayed correctly</li>";
echo "<li>Create some assignments with different priorities to test the display</li>";
echo "<li>Verify that the priority column shows the maximum priority from assignments</li>";
echo "</ul>";

echo "<h2>6. Manual Test Instructions</h2>";
echo "<ol>";
echo "<li>Go to WordPress Admin → Promo Bar X</li>";
echo "<li>Check the 'Manage Promo Bars' tab</li>";
echo "<li>Look for the 'Priority' column</li>";
echo "<li>Verify that priority values are displayed as blue badges</li>";
echo "<li>Create/edit a promo bar and add assignments with different priorities</li>";
echo "<li>Check that the priority column updates to show the highest priority</li>";
echo "</ol>";
?>
