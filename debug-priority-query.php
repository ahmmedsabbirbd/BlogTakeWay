<?php
/**
 * Debug script to test priority query
 * Place this in your plugin root and access via browser
 */

// Load WordPress
require_once('../../../wp-load.php');

// Check if user is admin
if (!current_user_can('manage_options')) {
    die('Unauthorized');
}

echo "<h1>PromoBarX Priority Debug</h1>";

global $wpdb;

// Test 1: Check if tables exist
echo "<h2>1. Checking Tables</h2>";
$promo_bars_table = $wpdb->prefix . 'promo_bars';
$assignments_table = $wpdb->prefix . 'promo_bar_assignments';

$promo_bars_exists = $wpdb->get_var("SHOW TABLES LIKE '$promo_bars_table'") == $promo_bars_table;
$assignments_exists = $wpdb->get_var("SHOW TABLES LIKE '$assignments_table'") == $assignments_table;

echo "Promo bars table exists: " . ($promo_bars_exists ? 'YES' : 'NO') . "<br>";
echo "Assignments table exists: " . ($assignments_exists ? 'YES' : 'NO') . "<br>";

if (!$promo_bars_exists || !$assignments_exists) {
    die("Tables don't exist!");
}

// Test 2: Check promo bars data
echo "<h2>2. Promo Bars Data</h2>";
$promo_bars = $wpdb->get_results("SELECT * FROM $promo_bars_table");
echo "Total promo bars: " . count($promo_bars) . "<br>";
if (!empty($promo_bars)) {
    echo "<pre>First promo bar: " . print_r($promo_bars[0], true) . "</pre>";
}

// Test 3: Check assignments data
echo "<h2>3. Assignments Data</h2>";
$assignments = $wpdb->get_results("SELECT * FROM $assignments_table");
echo "Total assignments: " . count($assignments) . "<br>";
if (!empty($assignments)) {
    echo "<pre>First assignment: " . print_r($assignments[0], true) . "</pre>";
}

// Test 4: Test the actual query
echo "<h2>4. Testing Priority Query</h2>";
$sql = "SELECT pb.*, 
               COALESCE(MAX(pa.priority), 0) as max_priority
        FROM $promo_bars_table pb
        LEFT JOIN $assignments_table pa ON pb.id = pa.promo_bar_id
        GROUP BY pb.id
        ORDER BY max_priority DESC, pb.created_at DESC";

echo "SQL Query: <code>$sql</code><br><br>";

$results = $wpdb->get_results($sql);
echo "Query results count: " . count($results) . "<br>";
if (!empty($results)) {
    echo "<pre>First result: " . print_r($results[0], true) . "</pre>";
}

// Test 5: Check for any SQL errors
echo "<h2>5. SQL Errors</h2>";
if ($wpdb->last_error) {
    echo "Last SQL Error: " . $wpdb->last_error;
} else {
    echo "No SQL errors found.";
}

echo "<h2>6. All Results with Priority</h2>";
if (!empty($results)) {
    echo "<table border='1' style='border-collapse: collapse;'>";
    echo "<tr><th>ID</th><th>Name</th><th>Status</th><th>Max Priority</th></tr>";
    foreach ($results as $row) {
        echo "<tr>";
        echo "<td>" . $row->id . "</td>";
        echo "<td>" . $row->name . "</td>";
        echo "<td>" . $row->status . "</td>";
        echo "<td>" . $row->max_priority . "</td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "No results found.";
}
?>
