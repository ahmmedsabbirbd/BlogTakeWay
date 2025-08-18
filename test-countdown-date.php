<?php
/**
 * Test Countdown Date Functionality
 * 
 * This file tests the new countdown date feature for promotional bars.
 * It verifies that promo bars with countdown dates are only shown after the countdown date has passed.
 */

// Load WordPress
require_once('../../../wp-load.php');

// Check if user can manage options
if (!current_user_can('manage_options')) {
    wp_die('Access denied');
}

echo "<h1>PromoBarX - Status and Countdown Date Test</h1>\n";

// Get the promo bar manager
$manager = new PromoBarX_Manager();

// Test 1: Check current time
$current_time = current_time('mysql');
echo "<h2>Current Time</h2>\n";
echo "<p><strong>Current Time:</strong> {$current_time}</p>\n";

// Test 2: Check a promo bar with countdown date in the future
echo "<h2>Test 1: Future Countdown Date</h2>\n";
$future_date = date('Y-m-d H:i:s', strtotime('+1 day'));
echo "<p><strong>Future Date:</strong> {$future_date}</p>\n";

// Simulate checking a promo bar with future countdown
global $wpdb;
$test_promo_bar_id = 1; // Assuming promo bar ID 1 exists

// Update a promo bar with future countdown date for testing
$wpdb->update(
    $wpdb->prefix . 'promo_bars',
    ['countdown_date' => $future_date],
    ['id' => $test_promo_bar_id],
    ['%s'],
    ['%d']
);

$user_context = $manager->get_user_context();
$is_blocked = $manager->is_countdown_blocked($test_promo_bar_id, $user_context);

echo "<p><strong>Promo Bar {$test_promo_bar_id} with future countdown:</strong> " . ($is_blocked ? "❌ BLOCKED (Correct - countdown not reached)" : "✅ SHOWN (Incorrect)") . "</p>\n";

// Test 3: Check a promo bar with countdown date in the past
echo "<h2>Test 2: Past Countdown Date</h2>\n";
$past_date = date('Y-m-d H:i:s', strtotime('-1 day'));
echo "<p><strong>Past Date:</strong> {$past_date}</p>\n";

// Update the same promo bar with past countdown date
$wpdb->update(
    $wpdb->prefix . 'promo_bars',
    ['countdown_date' => $past_date],
    ['id' => $test_promo_bar_id],
    ['%s'],
    ['%d']
);

$is_blocked = $manager->is_countdown_blocked($test_promo_bar_id, $user_context);

echo "<p><strong>Promo Bar {$test_promo_bar_id} with past countdown:</strong> " . ($is_blocked ? "❌ BLOCKED (Incorrect)" : "✅ SHOWN (Correct)") . "</p>\n";

// Test 4: Check a promo bar with no countdown date
echo "<h2>Test 3: No Countdown Date</h2>\n";

// Remove countdown date
$wpdb->update(
    $wpdb->prefix . 'promo_bars',
    ['countdown_date' => null],
    ['id' => $test_promo_bar_id],
    ['%s'],
    ['%d']
);

$is_blocked = $manager->is_countdown_blocked($test_promo_bar_id, $user_context);

echo "<p><strong>Promo Bar {$test_promo_bar_id} with no countdown:</strong> " . ($is_blocked ? "❌ BLOCKED (Incorrect)" : "✅ SHOWN (Correct)") . "</p>\n";

// Test 5: Check database query
echo "<h2>Test 4: Database Query</h2>\n";
$promo_bar = $wpdb->get_row($wpdb->prepare(
    "SELECT id, name, countdown_date FROM {$wpdb->prefix}promo_bars WHERE id = %d",
    $test_promo_bar_id
));

if ($promo_bar) {
    echo "<p><strong>Promo Bar ID:</strong> {$promo_bar->id}</p>\n";
    echo "<p><strong>Name:</strong> {$promo_bar->name}</p>\n";
    echo "<p><strong>Countdown Date:</strong> " . ($promo_bar->countdown_date ? $promo_bar->countdown_date : 'NULL') . "</p>\n";
} else {
    echo "<p><strong>Error:</strong> Promo bar not found</p>\n";
}

echo "<h2>Summary</h2>\n";
echo "<p>The status and countdown date functionality should:</p>\n";
echo "<ul>\n";
echo "<li>✅ Only show promo bars with status = 'active'</li>\n";
echo "<li>✅ Block promo bars with future countdown dates (current time <= countdown_date)</li>\n";
echo "<li>✅ Show promo bars with past countdown dates (current time > countdown_date)</li>\n";
echo "<li>✅ Show promo bars with no countdown date</li>\n";
echo "</ul>\n";

echo "<p><em>Note: This test modifies the database. Please restore your data if needed.</em></p>\n";
?>
