<?php
/**
 * Test script to debug update functionality for assignments
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

echo "<h1>Test Update Assignments Functionality</h1>";

// Initialize the database class
$database = new PromoBarX_Database();

echo "<h2>Step 1: Create Initial Promo Bar</h2>";

$initial_promo_bar = [
    'name' => 'Test Update ' . time(),
    'title' => 'Initial Promo Bar',
    'cta_text' => 'Initial CTA',
    'cta_url' => 'https://initial.com',
    'status' => 'active',
    'priority' => 1,
    'created_by' => get_current_user_id(),
    'assignments' => [
        [
            'assignment_type' => 'global',
            'target_id' => 0,
            'target_value' => 'All Pages',
            'priority' => 1
        ]
    ]
];

$promo_bar_id = $database->save_promo_bar($initial_promo_bar);

if ($promo_bar_id) {
    echo "✅ Initial promo bar created with ID: {$promo_bar_id}<br>";
} else {
    echo "❌ Failed to create initial promo bar<br>";
    exit;
}

echo "<h2>Step 2: Verify Initial Assignments</h2>";

$initial_assignments = $database->get_assignments($promo_bar_id);
if ($initial_assignments) {
    echo "✅ Initial assignments:<br>";
    foreach ($initial_assignments as $assignment) {
        echo "- Type: {$assignment->assignment_type}, Target: {$assignment->target_value}<br>";
    }
} else {
    echo "❌ No initial assignments found<br>";
}

echo "<h2>Step 3: Update Promo Bar with New Assignments</h2>";

$update_data = [
    'id' => $promo_bar_id, // This triggers update mode
    'name' => 'Updated Test ' . time(),
    'title' => 'Updated Promo Bar',
    'cta_text' => 'Updated CTA',
    'cta_url' => 'https://updated.com',
    'status' => 'active',
    'priority' => 5,
    // New specific assignments
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

echo "<h3>Update data being sent:</h3>";
echo "<pre>" . print_r($update_data, true) . "</pre>";

$update_result = $database->save_promo_bar($update_data);

if ($update_result) {
    echo "✅ Promo bar updated successfully<br>";
} else {
    echo "❌ Failed to update promo bar<br>";
    echo "Error: " . $database->wpdb->last_error . "<br>";
}

echo "<h2>Step 4: Verify Updated Assignments</h2>";

$updated_assignments = $database->get_assignments($promo_bar_id);

if ($updated_assignments && count($updated_assignments) > 0) {
    echo "✅ Updated assignments:<br>";
    foreach ($updated_assignments as $assignment) {
        echo "- Type: {$assignment->assignment_type}, Target: {$assignment->target_value}, Priority: {$assignment->priority}<br>";
    }
    
    // Check if the assignments were actually updated
    $has_specific = false;
    foreach ($updated_assignments as $assignment) {
        if ($assignment->assignment_type === 'page' || $assignment->assignment_type === 'category') {
            $has_specific = true;
            break;
        }
    }
    
    if ($has_specific) {
        echo "✅ SUCCESS: Specific assignments were saved during update!<br>";
    } else {
        echo "❌ ERROR: No specific assignments found after update!<br>";
    }
    
    // Check if old global assignment was removed
    $has_global = false;
    foreach ($updated_assignments as $assignment) {
        if ($assignment->assignment_type === 'global') {
            $has_global = true;
            break;
        }
    }
    
    if ($has_global) {
        echo "❌ WARNING: Old global assignment still exists (should have been replaced)<br>";
    } else {
        echo "✅ SUCCESS: Old global assignment was properly removed<br>";
    }
    
} else {
    echo "❌ No assignments found after update<br>";
}

echo "<h2>Step 5: Test AJAX Update Simulation</h2>";

// Simulate AJAX update request
$_POST = [
    'action' => 'promobarx_save',
    'id' => $promo_bar_id,
    'name' => 'AJAX Updated ' . time(),
    'title' => 'AJAX Updated Title',
    'cta_text' => 'AJAX Updated CTA',
    'cta_url' => 'https://ajax-updated.com',
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

echo "<h3>AJAX update data:</h3>";
echo "<pre>" . print_r($_POST, true) . "</pre>";

$ajax_update_result = $database->save_promo_bar($_POST);

if ($ajax_update_result) {
    echo "✅ AJAX update successful<br>";
    
    $ajax_updated_assignments = $database->get_assignments($promo_bar_id);
    if ($ajax_updated_assignments) {
        echo "✅ AJAX updated assignments:<br>";
        foreach ($ajax_updated_assignments as $assignment) {
            echo "- Type: {$assignment->assignment_type}, Target: {$assignment->target_value}<br>";
        }
    }
} else {
    echo "❌ AJAX update failed<br>";
}

echo "<h2>Step 6: Test Frontend Update Process</h2>";

// Test the exact data structure that the frontend sends
$frontend_update_data = [
    'id' => $promo_bar_id,
    'name' => 'Frontend Updated ' . time(),
    'title' => 'Frontend Updated Title',
    'cta_text' => 'Frontend CTA',
    'cta_url' => 'https://frontend.com',
    'status' => 'active',
    'priority' => 15,
    'styling' => json_encode(['background' => '#ffffff']),
    'cta_style' => json_encode(['background' => '#000000']),
    'countdown_style' => json_encode([]),
    'close_button_style' => json_encode([]),
    'assignments' => [
        [
            'assignment_type' => 'page',
            'target_id' => 10,
            'target_value' => 'Contact Page',
            'priority' => 1
        ]
    ]
];

echo "<h3>Frontend update data:</h3>";
echo "<pre>" . print_r($frontend_update_data, true) . "</pre>";

$frontend_result = $database->save_promo_bar($frontend_update_data);

if ($frontend_result) {
    echo "✅ Frontend update successful<br>";
    
    $frontend_assignments = $database->get_assignments($promo_bar_id);
    if ($frontend_assignments) {
        echo "✅ Frontend updated assignments:<br>";
        foreach ($frontend_assignments as $assignment) {
            echo "- Type: {$assignment->assignment_type}, Target: {$assignment->target_value}<br>";
        }
    }
} else {
    echo "❌ Frontend update failed<br>";
}

echo "<h2>Step 7: Cleanup</h2>";

$cleanup = $database->delete_promo_bar($promo_bar_id);

if ($cleanup) {
    echo "✅ Test promo bar deleted successfully<br>";
} else {
    echo "❌ Failed to delete test promo bar<br>";
}

echo "<hr>";
echo "<h2>Test Summary</h2>";
echo "<p>This test verifies that assignments are properly updated when editing existing promo bars.</p>";
echo "<p><strong>What was tested:</strong></p>";
echo "<ul>";
echo "<li>Initial promo bar creation with assignments</li>";
echo "<li>Update existing promo bar with new assignments</li>";
echo "<li>AJAX update simulation</li>";
echo "<li>Frontend update data structure</li>";
echo "<li>Assignment replacement (old assignments removed, new ones added)</li>";
echo "</ul>";
?>
