<?php
/**
 * Simple Test script for PromoBarX Assignment System
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

echo "<h1>PromoBarX Assignment System Test</h1>";

// Initialize the database class
$database = new PromoBarX_Database();

// Test 1: Check if assignments table exists
echo "<h2>1. Database Table Check</h2>";
global $wpdb;
$table_exists = $wpdb->get_var(
    $wpdb->prepare(
        "SHOW TABLES LIKE %s",
        $wpdb->prefix . 'promo_bar_assignments'
    )
);

if ($table_exists) {
    echo "✅ Assignments table exists<br>";
} else {
    echo "❌ Assignments table does not exist<br>";
    // Try to create it
    $database->create_tables();
    echo "Attempted to create tables<br>";
    
    // Check again
    $table_exists = $wpdb->get_var(
        $wpdb->prepare(
            "SHOW TABLES LIKE %s",
            $wpdb->prefix . 'promo_bar_assignments'
        )
    );
    
    if ($table_exists) {
        echo "✅ Assignments table created successfully<br>";
    } else {
        echo "❌ Failed to create assignments table<br>";
    }
}

// Test 2: Create a test promo bar
echo "<h2>2. Create Test Promo Bar</h2>";
$test_promo_bar = [
    'name' => 'Assignment Test Promo Bar ' . time(),
    'title' => 'Test Assignment Title',
    'status' => 'active',
    'created_by' => get_current_user_id()
];

$promo_bar_id = $database->save_promo_bar($test_promo_bar);

if ($promo_bar_id) {
    echo "✅ Test promo bar created with ID: {$promo_bar_id}<br>";
} else {
    echo "❌ Failed to create test promo bar<br>";
    exit;
}

// Test 3: Save assignments
echo "<h2>3. Save Assignments Test</h2>";
$test_assignments = [
    [
        'assignment_type' => 'global',
        'target_id' => 0,
        'target_value' => 'All Pages',
        'priority' => 1
    ],
    [
        'assignment_type' => 'page',
        'target_id' => 1,
        'target_value' => 'Sample Page',
        'priority' => 2
    ],
    [
        'assignment_type' => 'post_type',
        'target_id' => 0,
        'target_value' => 'post',
        'priority' => 3
    ]
];

$save_result = $database->save_assignments($promo_bar_id, $test_assignments);

if ($save_result) {
    echo "✅ Assignments saved successfully<br>";
} else {
    echo "❌ Failed to save assignments<br>";
    echo "Database error: " . $wpdb->last_error . "<br>";
}

// Test 4: Retrieve assignments
echo "<h2>4. Retrieve Assignments Test</h2>";
$retrieved_assignments = $database->get_assignments($promo_bar_id);

if ($retrieved_assignments) {
    echo "✅ Retrieved " . count($retrieved_assignments) . " assignments:<br>";
    echo "<ul>";
    foreach ($retrieved_assignments as $assignment) {
        echo "<li>Type: {$assignment->assignment_type}, Target: {$assignment->target_value}, Priority: {$assignment->priority}</li>";
    }
    echo "</ul>";
} else {
    echo "❌ Failed to retrieve assignments<br>";
    echo "Database error: " . $wpdb->last_error . "<br>";
}

// Test 5: Test AJAX handlers
echo "<h2>5. AJAX Handler Test</h2>";

// Simulate AJAX get assignments
$_POST = [
    'action' => 'promobarx_get_assignments',
    'promo_bar_id' => $promo_bar_id,
    'nonce' => wp_create_nonce('promobarx_admin_nonce')
];

ob_start();
try {
    $manager = new PromoBarX_Manager();
    $manager->ajax_get_assignments();
    $ajax_output = ob_get_clean();
    
    echo "✅ AJAX get assignments response:<br>";
    echo "<pre>" . htmlspecialchars($ajax_output) . "</pre>";
} catch (Exception $e) {
    ob_end_clean();
    echo "❌ AJAX get assignments failed: " . $e->getMessage() . "<br>";
}

// Test 6: Test assignment deletion
echo "<h2>6. Assignment Deletion Test</h2>";
$delete_result = $database->delete_assignments($promo_bar_id);

if ($delete_result) {
    echo "✅ Assignments deleted successfully<br>";
    
    // Verify deletion
    $remaining_assignments = $database->get_assignments($promo_bar_id);
    if (empty($remaining_assignments)) {
        echo "✅ Verification: No assignments remain<br>";
    } else {
        echo "❌ Verification failed: " . count($remaining_assignments) . " assignments still exist<br>";
    }
} else {
    echo "❌ Failed to delete assignments<br>";
    echo "Database error: " . $wpdb->last_error . "<br>";
}

// Test 7: Clean up
echo "<h2>7. Cleanup</h2>";
$cleanup_result = $database->delete_promo_bar($promo_bar_id);

if ($cleanup_result) {
    echo "✅ Test promo bar deleted successfully<br>";
} else {
    echo "❌ Failed to delete test promo bar<br>";
}

echo "<hr>";
echo "<h2>Test Summary</h2>";
echo "<p>✅ Assignment system test completed. Check the results above.</p>";
echo "<p><strong>What was tested:</strong></p>";
echo "<ul>";
echo "<li>✅ Database table creation</li>";
echo "<li>✅ Assignment saving functionality</li>";
echo "<li>✅ Assignment retrieval functionality</li>";
echo "<li>✅ AJAX handler integration</li>";
echo "<li>✅ Assignment deletion</li>";
echo "<li>✅ Data cleanup</li>";
echo "</ul>";
echo "<p><strong>Next Steps:</strong></p>";
echo "<ul>";
echo "<li>Test the frontend assignment manager</li>";
echo "<li>Verify page matching logic</li>";
echo "<li>Test assignment priority system</li>";
echo "</ul>";
?>
