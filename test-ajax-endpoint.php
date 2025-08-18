<?php
/**
 * Test AJAX endpoint for promo bars
 */

// Include WordPress
require_once('../../../wp-load.php');

// Check if user is logged in and has permissions
if (!current_user_can('manage_options')) {
    die('Unauthorized');
}

// Simulate AJAX request
$_POST['action'] = 'promobarx_get_promo_bars';
$_POST['nonce'] = wp_create_nonce('promobarx_admin_nonce');

// Include the plugin
require_once('promo-bar-x.php');

// Initialize the manager
$manager = new PromoBarX_TopBar_Manager();

// Call the AJAX method
try {
    $manager->ajax_get_promo_bars();
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
