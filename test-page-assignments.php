<?php
/**
 * Test file for page assignment functionality
 * Place this in your WordPress root directory and access via browser
 */

// Load WordPress
require_once('wp-load.php');

// Check if user is logged in and has admin privileges
if (!current_user_can('manage_options')) {
    die('Access denied. You must be logged in as an administrator.');
}

echo "<h1>Page Assignment Test</h1>";

// Test 1: Check if AJAX handlers are registered
echo "<h2>1. Testing AJAX Handler Registration</h2>";
global $wp_filter;

$ajax_actions = [
    'promobarx_get_pages',
    'promobarx_get_post_types', 
    'promobarx_get_taxonomies',
    'promobarx_get_assignments',
    'promobarx_save_assignments'
];

foreach ($ajax_actions as $action) {
    if (isset($wp_filter['wp_ajax_' . $action])) {
        echo "✅ AJAX handler '{$action}' is registered<br>";
    } else {
        echo "❌ AJAX handler '{$action}' is NOT registered<br>";
    }
}

// Test 2: Check if database tables exist
echo "<h2>2. Testing Database Tables</h2>";
global $wpdb;

$tables = [
    $wpdb->prefix . 'promo_bars',
    $wpdb->prefix . 'promo_bar_assignments'
];

foreach ($tables as $table) {
    $exists = $wpdb->get_var("SHOW TABLES LIKE '$table'");
    if ($exists) {
        echo "✅ Table '{$table}' exists<br>";
    } else {
        echo "❌ Table '{$table}' does NOT exist<br>";
    }
}

// Test 3: Test page search functionality
echo "<h2>3. Testing Page Search</h2>";
$pages = get_posts([
    'post_type' => 'page',
    'post_status' => 'publish',
    'posts_per_page' => 5,
    'orderby' => 'title',
    'order' => 'ASC'
]);

if (!empty($pages)) {
    echo "✅ Found " . count($pages) . " pages:<br>";
    foreach ($pages as $page) {
        echo "- {$page->post_title} (ID: {$page->ID})<br>";
    }
} else {
    echo "❌ No pages found<br>";
}

// Test 4: Test post types
echo "<h2>4. Testing Post Types</h2>";
$post_types = get_post_types(['public' => true], 'objects');
if (!empty($post_types)) {
    echo "✅ Found " . count($post_types) . " post types:<br>";
    foreach ($post_types as $post_type) {
        echo "- {$post_type->name}: {$post_type->labels->name}<br>";
    }
} else {
    echo "❌ No post types found<br>";
}

// Test 5: Test categories
echo "<h2>5. Testing Categories</h2>";
$categories = get_terms([
    'taxonomy' => 'category',
    'hide_empty' => false,
    'number' => 5
]);

if (!empty($categories) && !is_wp_error($categories)) {
    echo "✅ Found " . count($categories) . " categories:<br>";
    foreach ($categories as $category) {
        echo "- {$category->name} (ID: {$category->term_id})<br>";
    }
} else {
    echo "❌ No categories found<br>";
}

// Test 6: Test AJAX endpoint directly
echo "<h2>6. Testing AJAX Endpoint</h2>";
echo "<p>Testing promobarx_get_pages endpoint...</p>";

// Simulate AJAX request
$_POST['action'] = 'promobarx_get_pages';
$_POST['search'] = '';
$_POST['post_type'] = 'page';
$_POST['nonce'] = wp_create_nonce('promobarx_admin_nonce');

// Capture output
ob_start();

// Include the AJAX handler
try {
    do_action('wp_ajax_promobarx_get_pages');
    $output = ob_get_clean();
    echo "✅ AJAX endpoint responded<br>";
    echo "<pre>" . htmlspecialchars($output) . "</pre>";
} catch (Exception $e) {
    echo "❌ AJAX endpoint failed: " . $e->getMessage() . "<br>";
}

echo "<h2>Test Complete</h2>";
echo "<p>Check the browser console for any JavaScript errors when using the page assignment feature.</p>";
?>
