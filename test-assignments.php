<?php
/**
 * Test script for PromoBarX assignments functionality
 * Place this file in the plugin root directory and access it via browser
 */

// Load WordPress
require_once('../../../wp-load.php');

// Check if user is logged in and has admin privileges
if (!current_user_can('manage_options')) {
    wp_die('Unauthorized access');
}

echo "<h1>PromoBarX Assignments Test</h1>";

// Initialize the database class
$database = new PromoBarX_Database();

echo "<h2>1. Testing Database Connection</h2>";
$connection_test = $database->test_database_connection();
echo "Database connection test: " . ($connection_test ? "PASSED" : "FAILED") . "<br>";

echo "<h2>2. Checking Table Existence</h2>";
global $wpdb;
$tables = [
    'promo_bars',
    'promo_bar_templates', 
    'promo_bar_schedules',
    'promo_bar_analytics'
];

foreach ($tables as $table) {
    $table_exists = $wpdb->get_var("SHOW TABLES LIKE '{$wpdb->prefix}{$table}'");
    echo "Table {$wpdb->prefix}{$table}: " . ($table_exists ? "EXISTS" : "MISSING") . "<br>";
}

echo "<h2>3. Testing Assignment Saving</h2>";

// Get the first promo bar
$promo_bars = $database->get_promo_bars(['status' => 'all', 'limit' => 1]);
if (!empty($promo_bars)) {
    $promo_bar = $promo_bars[0];
    echo "Found promo bar: {$promo_bar->name} (ID: {$promo_bar->id})<br>";
    
    // Test assignments
    $test_assignments = [
        [
            'assignment_type' => 'global',
            'target_id' => 0,
            'target_value' => '',
            'priority' => 10
        ],
        [
            'assignment_type' => 'page',
            'target_id' => 1,
            'target_value' => '',
            'priority' => 5
        ]
    ];
    
    echo "Saving test assignments...<br>";
    $save_result = $database->save_assignments($promo_bar->id, $test_assignments);
    echo "Save result: " . ($save_result ? "SUCCESS" : "FAILED") . "<br>";
    
    // Retrieve assignments
    $saved_assignments = $database->get_assignments($promo_bar->id);
    echo "Retrieved " . count($saved_assignments) . " assignments:<br>";
    foreach ($saved_assignments as $assignment) {
        echo "- Type: {$assignment->assignment_type}, Target ID: {$assignment->target_id}, Priority: {$assignment->priority}<br>";
    }
    
} else {
    echo "No promo bars found. Creating a test promo bar...<br>";
    
    $test_promo_bar = [
        'name' => 'Test Promo Bar',
        'title' => 'Test Title',
        'status' => 'active'
    ];
    
    $promo_bar_id = $database->save_promo_bar($test_promo_bar);
    if ($promo_bar_id) {
        echo "Created test promo bar with ID: {$promo_bar_id}<br>";
        
        // Test assignments
        $test_assignments = [
            [
                'assignment_type' => 'global',
                'target_id' => 0,
                'target_value' => '',
                'priority' => 10
            ]
        ];
        
        $save_result = $database->save_assignments($promo_bar_id, $test_assignments);
        echo "Save assignments result: " . ($save_result ? "SUCCESS" : "FAILED") . "<br>";
    } else {
        echo "Failed to create test promo bar<br>";
    }
}

echo "<h2>4. Database Errors</h2>";
echo "Last SQL Error: " . $wpdb->last_error . "<br>";

echo "<h2>5. WordPress Debug Log</h2>";
$debug_log = WP_CONTENT_DIR . '/debug.log';
if (file_exists($debug_log)) {
    $log_content = file_get_contents($debug_log);
    $promobarx_logs = array_filter(explode("\n", $log_content), function($line) {
        return strpos($line, 'PromoBarX') !== false;
    });
    
    if (!empty($promobarx_logs)) {
        echo "<pre>" . implode("\n", array_slice($promobarx_logs, -20)) . "</pre>";
    } else {
        echo "No PromoBarX logs found in debug.log<br>";
    }
} else {
    echo "Debug log file not found at: {$debug_log}<br>";
}

?>
