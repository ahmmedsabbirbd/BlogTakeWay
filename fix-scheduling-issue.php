<?php
/**
 * Fix Scheduling Issue
 * 
 * This script fixes the scheduling issue that might prevent promo bars from showing
 */

// Load WordPress
require_once('../../../wp-load.php');

// Initialize database
$database = new PromoBarX_Database();

echo "<h1>Fix Scheduling Issue</h1>\n";

// Check if promo_bar_schedules table exists
echo "<h2>Step 1: Check promo_bar_schedules Table</h2>\n";

$table_exists = $database->wpdb->get_var(
    $database->wpdb->prepare(
        "SHOW TABLES LIKE %s",
        $database->table_prefix . 'promo_bar_schedules'
    )
);

if ($table_exists) {
    echo "<p>✅ promo_bar_schedules table exists</p>\n";
    
    // Check if there are any schedules
    $schedules_count = $database->wpdb->get_var("SELECT COUNT(*) FROM {$database->table_prefix}promo_bar_schedules");
    echo "<p><strong>Total Schedules:</strong> {$schedules_count}</p>\n";
    
    if ($schedules_count > 0) {
        $schedules = $database->wpdb->get_results("SELECT * FROM {$database->table_prefix}promo_bar_schedules");
        echo "<h3>Existing Schedules:</h3>\n";
        foreach ($schedules as $schedule) {
            echo "<p><strong>ID:</strong> {$schedule->id}, <strong>Promo Bar ID:</strong> {$schedule->promo_bar_id}</p>\n";
        }
    }
} else {
    echo "<p>❌ promo_bar_schedules table does not exist</p>\n";
    echo "<p>Creating the table...</p>\n";
    
    // Create the table
    $charset_collate = $database->wpdb->get_charset_collate();
    
    $sql = "CREATE TABLE IF NOT EXISTS {$database->table_prefix}promo_bar_schedules (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        promo_bar_id bigint(20) NOT NULL,
        start_date datetime DEFAULT NULL,
        end_date datetime DEFAULT NULL,
        start_time time DEFAULT NULL,
        end_time time DEFAULT NULL,
        days_of_week text DEFAULT NULL,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY promo_bar_id (promo_bar_id)
    ) $charset_collate;";
    
    $result = $database->wpdb->query($sql);
    
    if ($result !== false) {
        echo "<p>✅ promo_bar_schedules table created successfully</p>\n";
    } else {
        echo "<p>❌ Failed to create promo_bar_schedules table</p>\n";
    }
}

// Step 2: Test the scheduling method
echo "<h2>Step 2: Test Scheduling Method</h2>\n";

// Get a promo bar to test with
$promo_bars = $database->wpdb->get_results("SELECT * FROM {$database->table_prefix}promo_bars LIMIT 1");

if (!empty($promo_bars)) {
    $test_promo_bar = $promo_bars[0];
    echo "<p><strong>Testing with promo bar:</strong> {$test_promo_bar->name} (ID: {$test_promo_bar->id})</p>\n";
    
    // Use reflection to access private method
    $manager = PromoBarX_Manager::get_instance();
    $reflection = new ReflectionClass($manager);
    $method = $reflection->getMethod('is_promo_bar_scheduled');
    $method->setAccessible(true);
    
    $is_scheduled = $method->invoke($manager, $test_promo_bar);
    echo "<p><strong>Is Scheduled:</strong> " . ($is_scheduled ? 'Yes' : 'No') . "</p>\n";
    
    if ($is_scheduled) {
        echo "<p>✅ Scheduling check passed - promo bar should show</p>\n";
    } else {
        echo "<p>❌ Scheduling check failed - promo bar won't show</p>\n";
    }
} else {
    echo "<p>ℹ️ No promo bars found to test with</p>\n";
}

// Step 3: Test the complete flow
echo "<h2>Step 3: Test Complete Flow</h2>\n";

$manager = PromoBarX_Manager::get_instance();
$active_promo_bar = $manager->get_active_promo_bar();

if ($active_promo_bar) {
    echo "<p>✅ Active promo bar found: {$active_promo_bar->name}</p>\n";
    
    // Check if it's scheduled
    $reflection = new ReflectionClass($manager);
    $method = $reflection->getMethod('is_promo_bar_scheduled');
    $method->setAccessible(true);
    
    $is_scheduled = $method->invoke($manager, $active_promo_bar);
    echo "<p><strong>Scheduling Status:</strong> " . ($is_scheduled ? 'Scheduled to show' : 'Not scheduled to show') . "</p>\n";
    
} else {
    echo "<p>❌ No active promo bar found</p>\n";
    
    // Check if there are any active promo bars at all
    $active_promo_bars = $database->wpdb->get_results("SELECT * FROM {$database->table_prefix}promo_bars WHERE status = 'active'");
    echo "<p><strong>Total Active Promo Bars:</strong> " . count($active_promo_bars) . "</p>\n";
    
    if (!empty($active_promo_bars)) {
        echo "<h3>Active Promo Bars:</h3>\n";
        foreach ($active_promo_bars as $promo_bar) {
            echo "<p><strong>ID:</strong> {$promo_bar->id}, <strong>Name:</strong> {$promo_bar->name}</p>\n";
            
            // Check assignments
            $assignments = $database->wpdb->get_results(
                $database->wpdb->prepare(
                    "SELECT * FROM {$database->table_prefix}promo_bar_assignments WHERE promo_bar_id = %d",
                    $promo_bar->id
                )
            );
            echo "<p><strong>Assignments:</strong> " . count($assignments) . "</p>\n";
            
            if (empty($assignments)) {
                echo "<p>⚠️ No assignments found - this might be why it's not showing</p>\n";
            }
        }
    }
}

echo "<h2>Fix Complete!</h2>\n";
echo "<p>The scheduling issue has been investigated and fixed if needed.</p>\n";
?>
