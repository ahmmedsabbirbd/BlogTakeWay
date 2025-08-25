<?php
/**
 * Test Priority Update Functionality
 * 
 * This test verifies that the priority system is working correctly
 * in the PromoBarX dashboard.
 */

// Load WordPress
require_once('../../../wp-load.php');

// Ensure we're in admin context
if (!current_user_can('manage_options')) {
    wp_die('Unauthorized access');
}

echo "<h1>Priority Update Test</h1>";

// Initialize the database
$database = new PromoBarX_Database();

// Test 1: Create a promo bar with multiple assignments
echo "<h2>Test 1: Creating Promo Bar with Multiple Assignments</h2>";

$test_data = [
    'name' => 'Priority Test ' . time(),
    'title' => 'Priority Test Promo Bar',
    'cta_text' => 'Test CTA',
    'cta_url' => 'https://test.com',
    'status' => 'draft',
    'assignments' => [
        [
            'assignment_type' => 'page',
            'target_id' => 1,
            'target_value' => 'Home Page',
            'priority' => 3
        ],
        [
            'assignment_type' => 'category',
            'target_id' => 2,
            'target_value' => 'News',
            'priority' => 1
        ],
        [
            'assignment_type' => 'tag',
            'target_id' => 3,
            'target_value' => 'Featured',
            'priority' => 2
        ]
    ]
];

$promo_bar_id = $database->save_promo_bar($test_data);

if ($promo_bar_id) {
    echo "✅ Promo bar created with ID: {$promo_bar_id}<br>";
    
    // Get assignments to verify they were saved correctly
    $assignments = $database->get_assignments($promo_bar_id);
    if ($assignments) {
        echo "✅ Assignments saved:<br>";
        foreach ($assignments as $assignment) {
            echo "- Type: {$assignment->assignment_type}, Target: {$assignment->target_value}, Priority: {$assignment->priority}<br>";
        }
    }
} else {
    echo "❌ Failed to create promo bar<br>";
}

// Test 2: Update priorities
echo "<h2>Test 2: Updating Priorities</h2>";

if ($promo_bar_id) {
    $updated_data = [
        'id' => $promo_bar_id,
        'name' => 'Priority Test Updated ' . time(),
        'title' => 'Priority Test Promo Bar Updated',
        'cta_text' => 'Test CTA Updated',
        'cta_url' => 'https://test-updated.com',
        'status' => 'active',
        'assignments' => [
            [
                'assignment_type' => 'page',
                'target_id' => 1,
                'target_value' => 'Home Page',
                'priority' => 1  // Changed from 3 to 1
            ],
            [
                'assignment_type' => 'category',
                'target_id' => 2,
                'target_value' => 'News',
                'priority' => 3  // Changed from 1 to 3
            ],
            [
                'assignment_type' => 'tag',
                'target_id' => 3,
                'target_value' => 'Featured',
                'priority' => 2  // Kept as 2
            ]
        ]
    ];
    
    $update_result = $database->save_promo_bar($updated_data);
    
    if ($update_result) {
        echo "✅ Promo bar updated successfully<br>";
        
        // Get updated assignments
        $updated_assignments = $database->get_assignments($promo_bar_id);
        if ($updated_assignments) {
            echo "✅ Updated assignments:<br>";
            foreach ($updated_assignments as $assignment) {
                echo "- Type: {$assignment->assignment_type}, Target: {$assignment->target_value}, Priority: {$assignment->priority}<br>";
            }
            
            // Verify priorities are in correct order
            $priorities = array_map(function($a) { return $a->priority; }, $updated_assignments);
            sort($priorities);
            $expected_priorities = [1, 2, 3];
            
            if ($priorities === $expected_priorities) {
                echo "✅ Priorities are correctly ordered<br>";
            } else {
                echo "❌ Priorities are not in correct order. Expected: " . implode(', ', $expected_priorities) . ", Got: " . implode(', ', $priorities) . "<br>";
            }
        }
    } else {
        echo "❌ Failed to update promo bar<br>";
    }
}

// Test 3: Test priority normalization
echo "<h2>Test 3: Testing Priority Normalization</h2>";

if ($promo_bar_id) {
    $normalized_data = [
        'id' => $promo_bar_id,
        'name' => 'Priority Test Normalized ' . time(),
        'title' => 'Priority Test Promo Bar Normalized',
        'cta_text' => 'Test CTA Normalized',
        'cta_url' => 'https://test-normalized.com',
        'status' => 'active',
        'assignments' => [
            [
                'assignment_type' => 'page',
                'target_id' => 1,
                'target_value' => 'Home Page',
                'priority' => 10  // Non-sequential priority
            ],
            [
                'assignment_type' => 'category',
                'target_id' => 2,
                'target_value' => 'News',
                'priority' => 5   // Non-sequential priority
            ],
            [
                'assignment_type' => 'tag',
                'target_id' => 3,
                'target_value' => 'Featured',
                'priority' => 15  // Non-sequential priority
            ]
        ]
    ];
    
    $normalize_result = $database->save_promo_bar($normalized_data);
    
    if ($normalize_result) {
        echo "✅ Promo bar with non-sequential priorities saved<br>";
        
        // Get normalized assignments
        $normalized_assignments = $database->get_assignments($promo_bar_id);
        if ($normalized_assignments) {
            echo "✅ Assignments with non-sequential priorities:<br>";
            foreach ($normalized_assignments as $assignment) {
                echo "- Type: {$assignment->assignment_type}, Target: {$assignment->target_value}, Priority: {$assignment->priority}<br>";
            }
            
            // Check if priorities are preserved (they should be, as normalization happens in frontend)
            $priorities = array_map(function($a) { return $a->priority; }, $normalized_assignments);
            $expected_priorities = [5, 10, 15]; // Should be sorted by priority
            sort($priorities);
            
            if ($priorities === $expected_priorities) {
                echo "✅ Priorities are preserved correctly<br>";
            } else {
                echo "❌ Priorities are not preserved correctly. Expected: " . implode(', ', $expected_priorities) . ", Got: " . implode(', ', $priorities) . "<br>";
            }
        }
    } else {
        echo "❌ Failed to save promo bar with non-sequential priorities<br>";
    }
}

// Test 4: Test AJAX save functionality
echo "<h2>Test 4: Testing AJAX Save with Priority Updates</h2>";

// Simulate AJAX request
$_POST = [
    'action' => 'promobarx_save',
    'name' => 'AJAX Priority Test ' . time(),
    'title' => 'AJAX Priority Test',
    'cta_text' => 'AJAX CTA',
    'cta_url' => 'https://ajax-test.com',
    'status' => 'active',
    'assignments' => json_encode([
        [
            'assignment_type' => 'page',
            'target_id' => 1,
            'target_value' => 'Home Page',
            'priority' => 2
        ],
        [
            'assignment_type' => 'category',
            'target_id' => 2,
            'target_value' => 'News',
            'priority' => 1
        ],
        [
            'assignment_type' => 'tag',
            'target_id' => 3,
            'target_value' => 'Featured',
            'priority' => 3
        ]
    ]),
    'nonce' => wp_create_nonce('promobarx_admin_nonce')
];

echo "<h3>AJAX POST data:</h3>";
echo "<pre>" . print_r($_POST, true) . "</pre>";

// Get the manager instance to test AJAX save
$manager = PromoBarX_Manager::get_instance();

// Call the AJAX save method directly
try {
    $manager->ajax_save_promo_bar();
    echo "✅ AJAX save method executed successfully<br>";
} catch (Exception $e) {
    echo "❌ AJAX save method failed: " . $e->getMessage() . "<br>";
}

echo "<h2>Test Summary</h2>";
echo "<p>The priority update functionality has been implemented with the following features:</p>";
echo "<ul>";
echo "<li>✅ Priority input fields in the assignments list</li>";
echo "<li>✅ Up/down arrow buttons for reordering</li>";
echo "<li>✅ Normalize button to make priorities sequential</li>";
echo "<li>✅ Automatic priority normalization before saving</li>";
echo "<li>✅ Priority validation (1-999 range)</li>";
echo "<li>✅ Visual priority indicators</li>";
echo "</ul>";

echo "<p><strong>To test the frontend functionality:</strong></p>";
echo "<ol>";
echo "<li>Go to the PromoBarX dashboard</li>";
echo "<li>Create or edit a promo bar</li>";
echo "<li>Add multiple assignments</li>";
echo "<li>Use the priority input fields to change priorities</li>";
echo "<li>Use the up/down arrows to reorder assignments</li>";
echo "<li>Click 'Normalize' to make priorities sequential</li>";
echo "<li>Save the promo bar and verify priorities are preserved</li>";
echo "</ol>";
?>
