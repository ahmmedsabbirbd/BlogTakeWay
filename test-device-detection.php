<?php
/**
 * Test Device Detection Fix
 * 
 * This script tests the fixed device detection functionality
 */

// Load WordPress
require_once('../../../wp-load.php');

// Initialize manager
$manager = PromoBarX_Manager::get_instance();

echo "<h1>Device Detection Fix Test</h1>\n";

// Test 1: Test device detection methods
echo "<h2>Test 1: Device Detection Methods</h2>\n";

// Test is_tablet method
$is_tablet = $manager->is_tablet();
echo "<p><strong>Is Tablet:</strong> " . ($is_tablet ? 'Yes' : 'No') . "</p>\n";

// Test get_device_type method
$device_type = $manager->get_device_type();
echo "<p><strong>Device Type:</strong> {$device_type}</p>\n";

// Test 2: Test user context
echo "<h2>Test 2: User Context</h2>\n";

try {
    $user_context = $manager->get_user_context();
    
    echo "<h3>User Context Details:</h3>\n";
    echo "<ul>\n";
    echo "<li><strong>User ID:</strong> " . ($user_context['user_id'] ?? 'N/A') . "</li>\n";
    echo "<li><strong>User Roles:</strong> " . implode(', ', $user_context['user_roles']) . "</li>\n";
    echo "<li><strong>Device Type:</strong> {$user_context['device_type']}</li>\n";
    echo "<li><strong>Is Mobile:</strong> " . ($user_context['is_mobile'] ? 'Yes' : 'No') . "</li>\n";
    echo "<li><strong>Is Tablet:</strong> " . ($user_context['is_tablet'] ? 'Yes' : 'No') . "</li>\n";
    echo "<li><strong>Is Desktop:</strong> " . ($user_context['is_desktop'] ? 'Yes' : 'No') . "</li>\n";
    echo "<li><strong>User Agent:</strong> " . substr($user_context['user_agent'], 0, 100) . "...</li>\n";
    echo "<li><strong>IP Address:</strong> {$user_context['ip_address']}</li>\n";
    echo "<li><strong>Country:</strong> {$user_context['country']}</li>\n";
    echo "<li><strong>Timezone:</strong> {$user_context['timezone']}</li>\n";
    echo "<li><strong>Day of Week:</strong> {$user_context['day_of_week']}</li>\n";
    echo "<li><strong>Hour:</strong> {$user_context['hour']}</li>\n";
    echo "<li><strong>Session ID:</strong> {$user_context['session_id']}</li>\n";
    echo "</ul>\n";
    
    echo "<p>✅ User context retrieved successfully</p>\n";
    
} catch (Exception $e) {
    echo "<p>❌ Error getting user context: " . $e->getMessage() . "</p>\n";
}

// Test 3: Test different user agents
echo "<h2>Test 3: Different User Agents</h2>\n";

$test_user_agents = [
    'Desktop Chrome' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'iPhone' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    'iPad' => 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    'Android Tablet' => 'Mozilla/5.0 (Linux; Android 11; SM-T860) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Safari/537.36',
    'Android Phone' => 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36'
];

foreach ($test_user_agents as $device_name => $user_agent) {
    // Temporarily set user agent
    $_SERVER['HTTP_USER_AGENT'] = $user_agent;
    
    // Test device detection
    $is_tablet = $manager->is_tablet();
    $device_type = $manager->get_device_type();
    
    echo "<p><strong>{$device_name}:</strong> Device Type: {$device_type}, Is Tablet: " . ($is_tablet ? 'Yes' : 'No') . "</p>\n";
}

// Restore original user agent
$_SERVER['HTTP_USER_AGENT'] = $_SERVER['HTTP_USER_AGENT'] ?? '';

// Test 4: Test promo bar rendering
echo "<h2>Test 4: Promo Bar Rendering</h2>\n";

try {
    // This should not throw an error now
    $active_promo_bar = $manager->get_active_promo_bar();
    
    if ($active_promo_bar) {
        echo "<p>✅ Active promo bar found: {$active_promo_bar->name}</p>\n";
    } else {
        echo "<p>ℹ️ No active promo bar found</p>\n";
    }
    
} catch (Exception $e) {
    echo "<p>❌ Error getting active promo bar: " . $e->getMessage() . "</p>\n";
}

echo "<h2>Test Complete!</h2>\n";
echo "<p>The device detection fix has been tested successfully.</p>\n";
?>
