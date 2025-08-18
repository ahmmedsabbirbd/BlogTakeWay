<?php
/**
 * Test script to check promo bars and their assignments
 */

// Load WordPress
require_once('../../../wp-load.php');

echo "<h1>Promo Bar Database Check</h1>\n";

// Check promo bars table
echo "<h2>Promo Bars Table</h2>\n";
global $wpdb;

$promo_bars = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}promo_bars");
echo "<p><strong>Total Promo Bars:</strong> " . count($promo_bars) . "</p>\n";

foreach ($promo_bars as $promo_bar) {
    echo "<p><strong>ID:</strong> {$promo_bar->id}, <strong>Name:</strong> {$promo_bar->name}, <strong>Status:</strong> {$promo_bar->status}</p>\n";
}

// Check assignments table
echo "<h2>Assignments Table</h2>\n";

$assignments = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}promo_bar_assignments");
echo "<p><strong>Total Assignments:</strong> " . count($assignments) . "</p>\n";

foreach ($assignments as $assignment) {
    echo "<p><strong>ID:</strong> {$assignment->id}, <strong>Promo Bar ID:</strong> {$assignment->promo_bar_id}, <strong>Type:</strong> {$assignment->assignment_type}, <strong>Target Value:</strong> {$assignment->target_value}</p>\n";
}

// Test the get_promo_bars_with_assignments method
echo "<h2>Test get_promo_bars_with_assignments Method</h2>\n";

$database = new PromoBarX_Database();
$promo_bars_with_assignments = $database->get_promo_bars_with_assignments(['status' => 'active']);

echo "<p><strong>Active Promo Bars with Assignments:</strong> " . count($promo_bars_with_assignments) . "</p>\n";

foreach ($promo_bars_with_assignments as $promo_bar) {
    echo "<p><strong>ID:</strong> {$promo_bar->id}, <strong>Name:</strong> {$promo_bar->name}</p>\n";
    echo "<p><strong>Assignments Count:</strong> " . count($promo_bar->assignments) . "</p>\n";
    
    if (!empty($promo_bar->assignments)) {
        echo "<ul>\n";
        foreach ($promo_bar->assignments as $assignment) {
            echo "<li>Type: {$assignment['assignment_type']}, Target: {$assignment['target_value']}, Priority: {$assignment['priority']}</li>\n";
        }
        echo "</ul>\n";
    } else {
        echo "<p><em>No assignments found</em></p>\n";
    }
}

// Test current page context
echo "<h2>Current Page Context</h2>\n";

$current_url = $_SERVER['REQUEST_URI'] ?? '';
$post_id = get_queried_object_id();
$post_type = get_post_type();

echo "<p><strong>Current URL:</strong> {$current_url}</p>\n";
echo "<p><strong>Post ID:</strong> {$post_id}</p>\n";
echo "<p><strong>Post Type:</strong> {$post_type}</p>\n";

// Test get_active_promo_bar method
echo "<h2>Test get_active_promo_bar Method</h2>\n";

$manager = PromoBarX_Manager::get_instance();
$active_promo_bar = $manager->get_active_promo_bar();

if ($active_promo_bar) {
    echo "<p>✅ <strong>Active Promo Bar Found:</strong> {$active_promo_bar->name} (ID: {$active_promo_bar->id})</p>\n";
    echo "<p><strong>Assignments:</strong> " . count($active_promo_bar->assignments) . "</p>\n";
    
    if (!empty($active_promo_bar->assignments)) {
        echo "<ul>\n";
        foreach ($active_promo_bar->assignments as $assignment) {
            echo "<li>Type: {$assignment['assignment_type']}, Target: {$assignment['target_value']}, Priority: {$assignment['priority']}</li>\n";
        }
        echo "</ul>\n";
    }
} else {
    echo "<p>❌ <strong>No Active Promo Bar Found</strong></p>\n";
}
?>
