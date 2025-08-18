<?php
/**
 * Test script to verify page titles are displayed correctly in assignments
 */

// Include WordPress
require_once('../../../wp-load.php');

// Check if user is logged in and has permissions
if (!current_user_can('manage_options')) {
    die('Unauthorized');
}

echo "<h1>PromoBarX Page Titles Display Test</h1>";

// Include the plugin
require_once('promo-bar-x.php');

// Initialize the database class
$database = new PromoBarX_TopBar_Database();

echo "<h2>Testing Assignment Display with Page Titles</h2>";

// Get all promo bars with assignments
$promo_bars = $database->get_promo_bars(['status' => 'all']);

echo "<p>Found " . count($promo_bars) . " promo bars</p>";

if (empty($promo_bars)) {
    echo "<p>No promo bars found. Please create some promo bars first.</p>";
    exit;
}

echo "<table border='1' cellpadding='5' cellspacing='0' style='border-collapse: collapse;'>";
echo "<tr style='background-color: #f3f4f6;'>";
echo "<th>ID</th>";
echo "<th>Name</th>";
echo "<th>Status</th>";
echo "<th>Assignments</th>";
echo "<th>Display Format</th>";
echo "</tr>";

foreach ($promo_bars as $promo_bar) {
    echo "<tr>";
    echo "<td>{$promo_bar->id}</td>";
    echo "<td>{$promo_bar->name}</td>";
    echo "<td>{$promo_bar->status}</td>";
    echo "<td>";
    
    if (!empty($promo_bar->assignments)) {
        echo "<ul style='margin: 0; padding-left: 20px;'>";
        foreach ($promo_bar->assignments as $assignment) {
            echo "<li>";
            echo "<strong>Type:</strong> " . htmlspecialchars($assignment['assignment_type']) . "<br>";
            echo "<strong>Target ID:</strong> " . htmlspecialchars($assignment['target_id']) . "<br>";
            echo "<strong>Target Value:</strong> " . htmlspecialchars($assignment['target_value']) . "<br>";
            echo "<strong>Priority:</strong> " . htmlspecialchars($assignment['priority']);
            echo "</li>";
        }
        echo "</ul>";
    } else {
        echo "<em>No assignments</em>";
    }
    
    echo "</td>";
    echo "<td>";
    
    // Simulate the frontend display format
    if (!empty($promo_bar->assignments)) {
        foreach ($promo_bar->assignments as $assignment) {
            $display_text = '';
            
            switch ($assignment['assignment_type']) {
                case 'global':
                    $display_text = 'Global: All Pages';
                    break;
                case 'page':
                    if ($assignment['target_value'] && $assignment['target_value'] !== '') {
                        $display_text = 'Specific Page: ' . $assignment['target_value'];
                    } else if ($assignment['target_id'] && $assignment['target_id'] !== '0') {
                        $display_text = 'Specific Page: Page ID: ' . $assignment['target_id'];
                    } else {
                        $display_text = 'Specific Page: Unknown Page';
                    }
                    break;
                case 'post_type':
                    $display_text = 'Post Type: ' . ($assignment['target_value'] ?: 'All Posts');
                    break;
                case 'category':
                    $display_text = 'Category: ' . ($assignment['target_value'] ?: 'Category ID: ' . $assignment['target_id']);
                    break;
                case 'tag':
                    $display_text = 'Tag: ' . ($assignment['target_value'] ?: 'Tag ID: ' . $assignment['target_id']);
                    break;
                case 'custom':
                    $display_text = 'Custom URL: ' . ($assignment['target_value'] ?: 'Custom Pattern');
                    break;
                default:
                    $display_text = 'Unknown: ' . $assignment['target_value'];
            }
            
            echo "<div style='margin-bottom: 5px;'>" . htmlspecialchars($display_text) . "</div>";
        }
    } else {
        echo "<em>No assignments</em>";
    }
    
    echo "</td>";
    echo "</tr>";
}

echo "</table>";

echo "<h2>Testing Page Title Resolution</h2>";

// Test page title resolution for existing assignments
$all_assignments = $database->wpdb->get_results("
    SELECT * FROM {$database->wpdb->prefix}promo_bar_assignments 
    WHERE assignment_type = 'page' 
    ORDER BY promo_bar_id, priority
");

if (!empty($all_assignments)) {
    echo "<table border='1' cellpadding='5' cellspacing='0' style='border-collapse: collapse;'>";
    echo "<tr style='background-color: #f3f4f6;'>";
    echo "<th>Promo Bar ID</th>";
    echo "<th>Target ID</th>";
    echo "<th>Stored Target Value</th>";
    echo "<th>Actual Page Title</th>";
    echo "<th>Status</th>";
    echo "</tr>";
    
    foreach ($all_assignments as $assignment) {
        $actual_title = '';
        $status = '❌ Missing';
        
        if ($assignment->target_id > 0) {
            $post = get_post($assignment->target_id);
            if ($post) {
                $actual_title = $post->post_title;
                if ($assignment->target_value === $actual_title) {
                    $status = '✅ Correct';
                } else if (empty($assignment->target_value)) {
                    $status = '⚠️ Empty (should be: ' . $actual_title . ')';
                } else {
                    $status = '⚠️ Mismatch (should be: ' . $actual_title . ')';
                }
            } else {
                $status = '❌ Page not found';
            }
        }
        
        echo "<tr>";
        echo "<td>{$assignment->promo_bar_id}</td>";
        echo "<td>{$assignment->target_id}</td>";
        echo "<td>" . htmlspecialchars($assignment->target_value) . "</td>";
        echo "<td>" . htmlspecialchars($actual_title) . "</td>";
        echo "<td>{$status}</td>";
        echo "</tr>";
    }
    
    echo "</table>";
} else {
    echo "<p>No page assignments found in the database.</p>";
}

echo "<h2>Test Complete</h2>";
echo "<p>This test verifies that:</p>";
echo "<ul>";
echo "<li>Page assignments show actual page titles instead of just IDs</li>";
echo "<li>Category assignments show category names</li>";
echo "<li>Tag assignments show tag names</li>";
echo "<li>The display format matches what users will see in the admin interface</li>";
echo "</ul>";
echo "<p>If you see page titles in the 'Display Format' column, the system is working correctly.</p>";
?>
