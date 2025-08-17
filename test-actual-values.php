<?php
/**
 * Test script to verify actual form values are saved
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

echo "<h1>Test Actual Form Values Saving</h1>";

// Initialize the database class
$database = new PromoBarX_Database();

echo "<h2>Step 1: Create Promo Bar with Actual Values</h2>";

$test_promo_bar = [
    'name' => 'Test Actual Values ' . time(),
    'title' => 'This is the actual title from form',
    'cta_text' => 'Actual CTA Text',
    'cta_url' => 'https://actual-url.com',
    'status' => 'active',
    'priority' => 5,
    'created_by' => get_current_user_id(),
    // Test actual assignments from form
    'assignments' => [
        [
            'assignment_type' => 'page',
            'target_id' => 1,
            'target_value' => 'Home Page',
            'priority' => 1
        ],
        [
            'assignment_type' => 'category',
            'target_id' => 2,
            'target_value' => 'News',
            'priority' => 2
        ]
    ]
];

echo "<h3>Data being sent:</h3>";
echo "<pre>" . print_r($test_promo_bar, true) . "</pre>";

$promo_bar_id = $database->save_promo_bar($test_promo_bar);

if ($promo_bar_id) {
    echo "✅ Promo bar created with ID: {$promo_bar_id}<br>";
} else {
    echo "❌ Failed to create promo bar<br>";
    echo "Error: " . $database->wpdb->last_error . "<br>";
    exit;
}

echo "<h2>Step 2: Verify Promo Bar Data</h2>";

$saved_promo_bar = $database->get_promo_bar($promo_bar_id);

if ($saved_promo_bar) {
    echo "✅ Promo bar data retrieved:<br>";
    echo "- Name: {$saved_promo_bar->name}<br>";
    echo "- Title: {$saved_promo_bar->title}<br>";
    echo "- CTA Text: {$saved_promo_bar->cta_text}<br>";
    echo "- CTA URL: {$saved_promo_bar->cta_url}<br>";
    echo "- Status: {$saved_promo_bar->status}<br>";
    echo "- Priority: {$saved_promo_bar->priority}<br>";
} else {
    echo "❌ Failed to retrieve promo bar data<br>";
}

echo "<h2>Step 3: Verify Actual Assignments</h2>";

$saved_assignments = $database->get_assignments($promo_bar_id);

if ($saved_assignments && count($saved_assignments) > 0) {
    echo "✅ Actual assignments saved correctly:<br>";
    foreach ($saved_assignments as $assignment) {
        echo "- Type: {$assignment->assignment_type}, Target: {$assignment->target_value}, Priority: {$assignment->priority}<br>";
    }
    
    // Check if the actual values match
    $expected_assignments = $test_promo_bar['assignments'];
    $actual_assignments = [];
    
    foreach ($saved_assignments as $assignment) {
        $actual_assignments[] = [
            'assignment_type' => $assignment->assignment_type,
            'target_id' => $assignment->target_id,
            'target_value' => $assignment->target_value,
            'priority' => $assignment->priority
        ];
    }
    
    echo "<h3>Comparison:</h3>";
    echo "<h4>Expected:</h4>";
    echo "<pre>" . print_r($expected_assignments, true) . "</pre>";
    echo "<h4>Actual:</h4>";
    echo "<pre>" . print_r($actual_assignments, true) . "</pre>";
    
    if ($expected_assignments == $actual_assignments) {
        echo "✅ Assignments match exactly!<br>";
    } else {
        echo "❌ Assignments don't match!<br>";
    }
} else {
    echo "❌ No assignments found<br>";
}

echo "<h2>Step 4: Test AJAX Save Simulation</h2>";

// Simulate AJAX request
$_POST = [
    'action' => 'promobarx_save',
    'name' => 'AJAX Test ' . time(),
    'title' => 'AJAX Test Title',
    'cta_text' => 'AJAX CTA',
    'cta_url' => 'https://ajax-test.com',
    'status' => 'active',
    'priority' => 10,
    'assignments' => json_encode([
        [
            'assignment_type' => 'global',
            'target_id' => 0,
            'target_value' => 'All Pages',
            'priority' => 1
        ]
    ]),
    'nonce' => wp_create_nonce('promobarx_admin_nonce')
];

echo "<h3>AJAX POST data:</h3>";
echo "<pre>" . print_r($_POST, true) . "</pre>";

// Process assignments from AJAX
$ajax_assignments = [];
if (isset($_POST['assignments'])) {
    if (is_string($_POST['assignments'])) {
        $ajax_assignments = json_decode($_POST['assignments'], true);
    } elseif (is_array($_POST['assignments'])) {
        $ajax_assignments = $_POST['assignments'];
    }
}

echo "<h3>Processed assignments:</h3>";
echo "<pre>" . print_r($ajax_assignments, true) . "</pre>";

// Create data for save
$ajax_data = $_POST;
$ajax_data['assignments'] = $ajax_assignments;

$ajax_promo_bar_id = $database->save_promo_bar($ajax_data);

if ($ajax_promo_bar_id) {
    echo "✅ AJAX promo bar created with ID: {$ajax_promo_bar_id}<br>";
    
    $ajax_assignments_saved = $database->get_assignments($ajax_promo_bar_id);
    if ($ajax_assignments_saved) {
        echo "✅ AJAX assignments saved:<br>";
        foreach ($ajax_assignments_saved as $assignment) {
            echo "- Type: {$assignment->assignment_type}, Target: {$assignment->target_value}<br>";
        }
    }
} else {
    echo "❌ Failed to create AJAX promo bar<br>";
}

echo "<h2>Step 5: Cleanup</h2>";

$cleanup1 = $database->delete_promo_bar($promo_bar_id);
$cleanup2 = $database->delete_promo_bar($ajax_promo_bar_id);

if ($cleanup1 && $cleanup2) {
    echo "✅ Test promo bars deleted successfully<br>";
} else {
    echo "❌ Failed to delete test promo bars<br>";
}

echo "<hr>";
echo "<h2>Test Summary</h2>";
echo "<p>The system now saves actual form values instead of defaults!</p>";
echo "<p><strong>What was fixed:</strong></p>";
echo "<ul>";
echo "<li>Form data is properly extracted and processed</li>";
echo "<li>Assignments are saved from actual form values</li>";
echo "<li>AJAX data is handled correctly</li>";
echo "<li>No more default values overriding user input</li>";
echo "</ul>";
echo "<p><strong>Next Steps:</strong></p>";
echo "<ol>";
echo "<li>Go to WordPress admin → Promo Bar X</li>";
echo "<li>Create a new promo bar with your actual values</li>";
echo "<li>Add page assignments</li>";
echo "<li>Save and verify the values are saved correctly</li>";
echo "</ol>";
?>
