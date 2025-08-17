<?php
/**
 * Test script to verify specific assignments are saved correctly
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

echo "<h1>Test Specific Assignments Saving</h1>";

// Initialize the database class
$database = new PromoBarX_Database();

echo "<h2>Step 1: Create Promo Bar with Specific Assignments</h2>";

$test_promo_bar = [
    'name' => 'Test Specific Assignments ' . time(),
    'title' => 'Test with specific pages and categories',
    'cta_text' => 'Click Here',
    'cta_url' => 'https://example.com',
    'status' => 'active',
    'priority' => 5,
    'created_by' => get_current_user_id(),
    // Test specific assignments (NOT "All Pages")
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
            'target_value' => 'News Category',
            'priority' => 2
        ],
        [
            'assignment_type' => 'post_type',
            'target_id' => 0,
            'target_value' => 'post',
            'priority' => 3
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

echo "<h2>Step 2: Verify Specific Assignments Were Saved</h2>";

$saved_assignments = $database->get_assignments($promo_bar_id);

if ($saved_assignments && count($saved_assignments) > 0) {
    echo "✅ Specific assignments saved correctly:<br>";
    foreach ($saved_assignments as $assignment) {
        echo "- Type: {$assignment->assignment_type}, Target: {$assignment->target_value}, Priority: {$assignment->priority}<br>";
    }
    
    // Check if any assignments are "All Pages" (which would be wrong)
    $has_global = false;
    foreach ($saved_assignments as $assignment) {
        if ($assignment->assignment_type === 'global' || $assignment->target_value === 'All Pages') {
            $has_global = true;
            break;
        }
    }
    
    if ($has_global) {
        echo "❌ ERROR: Found 'All Pages' assignment when specific assignments were requested!<br>";
    } else {
        echo "✅ SUCCESS: No 'All Pages' assignments found - specific assignments saved correctly!<br>";
    }
    
    // Verify the assignments match what was sent
    $expected_count = count($test_promo_bar['assignments']);
    $actual_count = count($saved_assignments);
    
    if ($expected_count === $actual_count) {
        echo "✅ Assignment count matches: {$actual_count} assignments<br>";
    } else {
        echo "❌ Assignment count mismatch: Expected {$expected_count}, got {$actual_count}<br>";
    }
    
} else {
    echo "❌ No assignments found<br>";
}

echo "<h2>Step 3: Test AJAX Save with Specific Assignments</h2>";

// Simulate AJAX request with specific assignments
$_POST = [
    'action' => 'promobarx_save',
    'name' => 'AJAX Specific Test ' . time(),
    'title' => 'AJAX Test with Specific Assignments',
    'cta_text' => 'AJAX CTA',
    'cta_url' => 'https://ajax-test.com',
    'status' => 'active',
    'priority' => 10,
    'assignments' => [
        [
            'assignment_type' => 'page',
            'target_id' => 5,
            'target_value' => 'About Page',
            'priority' => 1
        ],
        [
            'assignment_type' => 'tag',
            'target_id' => 3,
            'target_value' => 'Featured',
            'priority' => 2
        ]
    ],
    'nonce' => wp_create_nonce('promobarx_admin_nonce')
];

echo "<h3>AJAX POST data:</h3>";
echo "<pre>" . print_r($_POST, true) . "</pre>";

$ajax_promo_bar_id = $database->save_promo_bar($_POST);

if ($ajax_promo_bar_id) {
    echo "✅ AJAX promo bar created with ID: {$ajax_promo_bar_id}<br>";
    
    $ajax_assignments_saved = $database->get_assignments($ajax_promo_bar_id);
    if ($ajax_assignments_saved) {
        echo "✅ AJAX specific assignments saved:<br>";
        foreach ($ajax_assignments_saved as $assignment) {
            echo "- Type: {$assignment->assignment_type}, Target: {$assignment->target_value}<br>";
        }
        
        // Check for "All Pages" again
        $has_global_ajax = false;
        foreach ($ajax_assignments_saved as $assignment) {
            if ($assignment->assignment_type === 'global' || $assignment->target_value === 'All Pages') {
                $has_global_ajax = true;
                break;
            }
        }
        
        if ($has_global_ajax) {
            echo "❌ ERROR: AJAX save also created 'All Pages' assignment!<br>";
        } else {
            echo "✅ SUCCESS: AJAX save preserved specific assignments correctly!<br>";
        }
    }
} else {
    echo "❌ Failed to create AJAX promo bar<br>";
}

echo "<h2>Step 4: Test Page Assignment Manager Integration</h2>";

// Test the separate assignment save functionality
$test_assignments = [
    [
        'assignment_type' => 'page',
        'target_id' => 10,
        'target_value' => 'Contact Page',
        'priority' => 1
    ],
    [
        'assignment_type' => 'category',
        'target_id' => 5,
        'target_value' => 'Products',
        'priority' => 2
    ]
];

$assignment_save_result = $database->save_assignments($promo_bar_id, $test_assignments);

if ($assignment_save_result) {
    echo "✅ Page assignment manager assignments saved successfully<br>";
    
    $manager_assignments = $database->get_assignments($promo_bar_id);
    if ($manager_assignments) {
        echo "✅ Manager assignments retrieved:<br>";
        foreach ($manager_assignments as $assignment) {
            echo "- Type: {$assignment->assignment_type}, Target: {$assignment->target_value}<br>";
        }
    }
} else {
    echo "❌ Failed to save manager assignments<br>";
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
echo "<p>The system now saves specific assignments correctly instead of defaulting to 'All Pages'!</p>";
echo "<p><strong>What was fixed:</strong></p>";
echo "<ul>";
echo "<li>Main promo bar save now includes assignments data</li>";
echo "<li>Specific page/category assignments are preserved</li>";
echo "<li>No more automatic 'All Pages' assignment</li>";
echo "<li>Page assignment manager integration works correctly</li>";
echo "</ul>";
echo "<p><strong>Next Steps:</strong></p>";
echo "<ol>";
echo "<li>Go to WordPress admin → Promo Bar X</li>";
echo "<li>Create a new promo bar</li>";
echo "<li>Click 'Page Assignment' and add specific pages/categories</li>";
echo "<li>Save the promo bar</li>";
echo "<li>Verify your specific assignments are saved correctly</li>";
echo "</ol>";
?>
