<?php
/**
 * Test Conditional Display
 * 
 * This script creates a promo bar with assignments and tests conditional display
 */

// Load WordPress
require_once('../../../wp-load.php');

// Initialize database and manager
$database = new PromoBarX_Database();
$manager = PromoBarX_Manager::get_instance();

echo "<h1>Test Conditional Promo Bar Display</h1>\n";

// Step 1: Create a test promo bar
echo "<h2>Step 1: Creating Test Promo Bar</h2>\n";

$promo_bar_data = [
    'name' => 'Conditional Test Promo Bar',
    'title' => '🎯 Conditional Display Test',
    'cta_text' => 'Learn More',
    'cta_url' => home_url('/'),
    'status' => 'active',
    'priority' => 10,
    'assignments' => [
        [
            'assignment_type' => 'global',
            'target_value' => 'All Pages',
            'priority' => 0
        ]
    ]
];

$promo_bar_id = $database->save_promo_bar($promo_bar_data);

if ($promo_bar_id) {
    echo "<p>✅ Promo bar created successfully with ID: {$promo_bar_id}</p>\n";
} else {
    echo "<p>❌ Failed to create promo bar</p>\n";
    exit;
}

// Step 2: Test the promo bar retrieval
echo "<h2>Step 2: Testing Promo Bar Retrieval</h2>\n";

$promo_bar = $database->get_promo_bar($promo_bar_id);
if ($promo_bar) {
    echo "<p>✅ Promo bar retrieved successfully</p>\n";
    echo "<p><strong>Name:</strong> {$promo_bar->name}</p>\n";
    echo "<p><strong>Status:</strong> {$promo_bar->status}</p>\n";
    echo "<p><strong>Assignments:</strong> " . count($promo_bar->assignments) . "</p>\n";
    
    if (!empty($promo_bar->assignments)) {
        echo "<ul>\n";
        foreach ($promo_bar->assignments as $assignment) {
            echo "<li>Type: {$assignment['assignment_type']}, Target: {$assignment['target_value']}</li>\n";
        }
        echo "</ul>\n";
    }
} else {
    echo "<p>❌ Failed to retrieve promo bar</p>\n";
}

// Step 3: Test active promo bar detection
echo "<h2>Step 3: Testing Active Promo Bar Detection</h2>\n";

$active_promo_bar = $manager->get_active_promo_bar();
if ($active_promo_bar) {
    echo "<p>✅ Active promo bar found: {$active_promo_bar->name}</p>\n";
} else {
    echo "<p>❌ No active promo bar found</p>\n";
}

// Step 4: Create a page-specific promo bar
echo "<h2>Step 4: Creating Page-Specific Promo Bar</h2>\n";

$current_post_id = get_queried_object_id();
if ($current_post_id) {
    $page_promo_bar_data = [
        'name' => 'Page-Specific Test Promo Bar',
        'title' => '📄 Page-Specific Display Test',
        'cta_text' => 'Page Action',
        'cta_url' => home_url('/'),
        'status' => 'active',
        'priority' => 20, // Higher priority
        'assignments' => [
            [
                'assignment_type' => 'page',
                'target_id' => $current_post_id,
                'target_value' => 'Current Page',
                'priority' => 0
            ]
        ]
    ];

    $page_promo_bar_id = $database->save_promo_bar($page_promo_bar_data);
    
    if ($page_promo_bar_id) {
        echo "<p>✅ Page-specific promo bar created with ID: {$page_promo_bar_id}</p>\n";
        echo "<p><strong>Target Post ID:</strong> {$current_post_id}</p>\n";
        
        // Test again
        $active_promo_bar = $manager->get_active_promo_bar();
        if ($active_promo_bar) {
            echo "<p>✅ Active promo bar found: {$active_promo_bar->name}</p>\n";
            echo "<p><strong>Expected:</strong> Page-Specific Test Promo Bar (higher priority)</p>\n";
        } else {
            echo "<p>❌ No active promo bar found</p>\n";
        }
    } else {
        echo "<p>❌ Failed to create page-specific promo bar</p>\n";
    }
} else {
    echo "<p>ℹ️ No current post ID found (might be on homepage or archive)</p>\n";
}

// Step 5: Test different assignment types
echo "<h2>Step 5: Testing Different Assignment Types</h2>\n";

$post_type = get_post_type();
if ($post_type) {
    $post_type_promo_bar_data = [
        'name' => 'Post Type Test Promo Bar',
        'title' => '📝 Post Type Display Test',
        'cta_text' => 'Post Type Action',
        'cta_url' => home_url('/'),
        'status' => 'active',
        'priority' => 15,
        'assignments' => [
            [
                'assignment_type' => 'post_type',
                'target_value' => $post_type,
                'priority' => 0
            ]
        ]
    ];

    $post_type_promo_bar_id = $database->save_promo_bar($post_type_promo_bar_data);
    
    if ($post_type_promo_bar_id) {
        echo "<p>✅ Post type promo bar created with ID: {$post_type_promo_bar_id}</p>\n";
        echo "<p><strong>Target Post Type:</strong> {$post_type}</p>\n";
    } else {
        echo "<p>❌ Failed to create post type promo bar</p>\n";
    }
} else {
    echo "<p>ℹ️ No current post type found</p>\n";
}

// Step 6: Final test
echo "<h2>Step 6: Final Conditional Display Test</h2>\n";

$all_promo_bars = $database->get_promo_bars_with_assignments(['status' => 'active']);
echo "<p><strong>Total Active Promo Bars:</strong> " . count($all_promo_bars) . "</p>\n";

foreach ($all_promo_bars as $promo_bar) {
    echo "<h3>Promo Bar: {$promo_bar->name}</h3>\n";
    echo "<p><strong>Priority:</strong> {$promo_bar->priority}</p>\n";
    echo "<p><strong>Assignments:</strong> " . count($promo_bar->assignments) . "</p>\n";
    
    if (!empty($promo_bar->assignments)) {
        echo "<ul>\n";
        foreach ($promo_bar->assignments as $assignment) {
            echo "<li>Type: {$assignment['assignment_type']}, Target: {$assignment['target_value']}</li>\n";
        }
        echo "</ul>\n";
    }
}

$final_active_promo_bar = $manager->get_active_promo_bar();
if ($final_active_promo_bar) {
    echo "<p>✅ <strong>Final Active Promo Bar:</strong> {$final_active_promo_bar->name}</p>\n";
    echo "<p><strong>Priority:</strong> {$final_active_promo_bar->priority}</p>\n";
} else {
    echo "<p>❌ No active promo bar found in final test</p>\n";
}

echo "<h2>Test Complete!</h2>\n";
echo "<p>The conditional display system has been tested. Check the results above.</p>\n";
?>
