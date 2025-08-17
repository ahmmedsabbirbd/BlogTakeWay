<?php
/**
 * Debug Conditional Promo Bar Display
 * 
 * This script helps identify why conditional promo bar display isn't working
 */

// Load WordPress
require_once('../../../wp-load.php');

// Initialize database and manager
$database = new PromoBarX_Database();
$manager = PromoBarX_Manager::get_instance();

echo "<h1>Debug Conditional Promo Bar Display</h1>\n";

// Test 1: Check database tables
echo "<h2>Test 1: Database Tables</h2>\n";

$tables = [
    'promo_bars',
    'promo_bar_assignments'
];

foreach ($tables as $table) {
    $table_exists = $database->wpdb->get_var(
        $database->wpdb->prepare(
            "SHOW TABLES LIKE %s",
            $database->table_prefix . $table
        )
    );
    echo "<p><strong>{$table}:</strong> " . ($table_exists ? '✅ EXISTS' : '❌ MISSING') . "</p>\n";
}

// Test 2: Check promo bars
echo "<h2>Test 2: Promo Bars</h2>\n";

$promo_bars = $database->wpdb->get_results("SELECT * FROM {$database->table_prefix}promo_bars");
echo "<p><strong>Total Promo Bars:</strong> " . count($promo_bars) . "</p>\n";

foreach ($promo_bars as $promo_bar) {
    echo "<p><strong>ID:</strong> {$promo_bar->id}, <strong>Name:</strong> {$promo_bar->name}, <strong>Status:</strong> {$promo_bar->status}</p>\n";
}

// Test 3: Check assignments
echo "<h2>Test 3: Assignments</h2>\n";

$assignments = $database->wpdb->get_results("SELECT * FROM {$database->table_prefix}promo_bar_assignments");
echo "<p><strong>Total Assignments:</strong> " . count($assignments) . "</p>\n";

foreach ($assignments as $assignment) {
    echo "<p><strong>ID:</strong> {$assignment->id}, <strong>Promo Bar ID:</strong> {$assignment->promo_bar_id}, <strong>Type:</strong> {$assignment->assignment_type}, <strong>Target:</strong> {$assignment->target_value}</p>\n";
}

// Test 4: Test get_promo_bars_with_assignments method
echo "<h2>Test 4: get_promo_bars_with_assignments Method</h2>\n";

$promo_bars_with_assignments = $database->get_promo_bars_with_assignments(['status' => 'active']);
echo "<p><strong>Active Promo Bars with Assignments:</strong> " . count($promo_bars_with_assignments) . "</p>\n";

foreach ($promo_bars_with_assignments as $promo_bar) {
    echo "<p><strong>ID:</strong> {$promo_bar->id}, <strong>Name:</strong> {$promo_bar->name}</p>\n";
    echo "<p><strong>Assignments:</strong> " . count($promo_bar->assignments) . "</p>\n";
    
    if (!empty($promo_bar->assignments)) {
        echo "<ul>\n";
        foreach ($promo_bar->assignments as $assignment) {
            echo "<li>Type: {$assignment['assignment_type']}, Target: {$assignment['target_value']}, Priority: {$assignment['priority']}</li>\n";
        }
        echo "</ul>\n";
    }
}

// Test 5: Test current page context
echo "<h2>Test 5: Current Page Context</h2>\n";

$current_url = $_SERVER['REQUEST_URI'] ?? '';
$post_id = get_queried_object_id();
$post_type = get_post_type();

echo "<p><strong>Current URL:</strong> {$current_url}</p>\n";
echo "<p><strong>Post ID:</strong> {$post_id}</p>\n";
echo "<p><strong>Post Type:</strong> {$post_type}</p>\n";

// Test 6: Test get_active_promo_bar method
echo "<h2>Test 6: get_active_promo_bar Method</h2>\n";

try {
    $active_promo_bar = $manager->get_active_promo_bar();
    
    if ($active_promo_bar) {
        echo "<p>✅ <strong>Active Promo Bar Found:</strong> {$active_promo_bar->name} (ID: {$active_promo_bar->id})</p>\n";
    } else {
        echo "<p>❌ <strong>No Active Promo Bar Found</strong></p>\n";
    }
    
} catch (Exception $e) {
    echo "<p>❌ <strong>Error:</strong> " . $e->getMessage() . "</p>\n";
}

// Test 7: Test individual promo bar scoring
echo "<h2>Test 7: Individual Promo Bar Scoring</h2>\n";

foreach ($promo_bars_with_assignments as $promo_bar) {
    echo "<h3>Testing Promo Bar: {$promo_bar->name}</h3>\n";
    
    // Use reflection to access private method
    $reflection = new ReflectionClass($manager);
    $method = $reflection->getMethod('calculate_page_match_score');
    $method->setAccessible(true);
    
    $score = $method->invoke($manager, $promo_bar, $current_url, $post_id, $post_type);
    echo "<p><strong>Score:</strong> {$score}</p>\n";
}

echo "<h2>Debug Complete!</h2>\n";
?>
