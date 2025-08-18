<?php
/**
 * Script to remove the default "Welcome Promo Bar" from the database
 * 
 * This script should be run once to clean up any existing default promo bars
 * that were created before the removal of the automatic creation.
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    // If not in WordPress context, try to load it
    $wp_load_path = dirname(__FILE__) . '/../../../wp-load.php';
    if (file_exists($wp_load_path)) {
        require_once $wp_load_path;
    } else {
        die('WordPress not found. Please run this script from within WordPress.');
    }
}

// Ensure we're in admin context
if (!current_user_can('manage_options')) {
    die('Insufficient permissions to run this script.');
}

global $wpdb;

echo "<h2>Removing Default Promo Bar</h2>";

// Find and remove any "Welcome Promo Bar" entries
$default_promo_bars = $wpdb->get_results(
    $wpdb->prepare(
        "SELECT id, name FROM {$wpdb->prefix}promo_bars WHERE name = %s",
        'Welcome Promo Bar'
    )
);

if (empty($default_promo_bars)) {
    echo "<p>✅ No default promo bars found. Nothing to remove.</p>";
} else {
    echo "<p>Found " . count($default_promo_bars) . " default promo bar(s) to remove:</p>";
    
    foreach ($default_promo_bars as $promo_bar) {
        echo "<p>Removing promo bar ID {$promo_bar->id}: {$promo_bar->name}</p>";
        
        // Delete the promo bar
        $result = $wpdb->delete(
            $wpdb->prefix . 'promo_bars',
            ['id' => $promo_bar->id],
            ['%d']
        );
        
        if ($result !== false) {
            echo "<p>✅ Successfully removed promo bar ID {$promo_bar->id}</p>";
        } else {
            echo "<p>❌ Failed to remove promo bar ID {$promo_bar->id}: " . $wpdb->last_error . "</p>";
        }
    }
}

echo "<p><strong>Default promo bar removal completed!</strong></p>";
echo "<p>The automatic creation of default promo bars has been disabled.</p>";
echo "<p>You can now create your own custom promo bars through the admin interface.</p>";
