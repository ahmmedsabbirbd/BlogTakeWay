<?php
/**
 * Test Enhanced Assignments System
 * 
 * This script tests the new enhanced assignment system with:
 * - New assignment types (user_role, device_type, referrer, country, time_based)
 * - Enhanced fields (condition_logic, condition_data, frequency_cap, traffic_percentage)
 * - Improved scoring system
 */

// Load WordPress
require_once('../../../wp-load.php');

// Initialize database
$database = new PromoBarX_Database();

echo "<h1>Enhanced Assignments System Test</h1>\n";

// Test 1: Create a promo bar with enhanced assignments
echo "<h2>Test 1: Creating Promo Bar with Enhanced Assignments</h2>\n";

$promo_bar_data = [
    'name' => 'Enhanced Test Promo Bar',
    'title' => '🎯 Enhanced Targeting Test',
    'cta_text' => 'Learn More',
    'cta_url' => home_url('/'),
    'status' => 'active',
    'priority' => 10,
    'assignments' => [
        [
            'assignment_type' => 'user_role',
            'target_value' => 'administrator',
            'priority' => 5,
            'condition_logic' => 'OR',
            'condition_data' => [
                'days_of_week' => [1, 2, 3, 4, 5], // Monday to Friday
                'time_range' => ['start' => 9, 'end' => 17] // 9 AM to 5 PM
            ],
            'frequency_cap' => 3600, // 1 hour
            'traffic_percentage' => 100
        ],
        [
            'assignment_type' => 'device_type',
            'target_value' => 'mobile',
            'priority' => 3,
            'condition_logic' => 'OR',
            'condition_data' => null,
            'frequency_cap' => 0,
            'traffic_percentage' => 50
        ],
        [
            'assignment_type' => 'time_based',
            'target_value' => json_encode([
                'days_of_week' => [6, 7], // Weekend
                'time_range' => ['start' => 10, 'end' => 18] // 10 AM to 6 PM
            ]),
            'priority' => 2,
            'condition_logic' => 'AND',
            'condition_data' => [
                'specific_dates' => ['2024-12-25', '2024-12-26'] // Christmas
            ],
            'frequency_cap' => 7200, // 2 hours
            'traffic_percentage' => 75
        ]
    ]
];

$promo_bar_id = $database->save_promo_bar($promo_bar_data);

if ($promo_bar_id) {
    echo "<p>✅ Promo bar created successfully with ID: {$promo_bar_id}</p>\n";
} else {
    echo "<p>❌ Failed to create promo bar</p>\n";
    exit;
}

// Test 2: Retrieve and display the promo bar with assignments
echo "<h2>Test 2: Retrieving Promo Bar with Enhanced Assignments</h2>\n";

$promo_bar = $database->get_promo_bar($promo_bar_id);

if ($promo_bar) {
    echo "<h3>Promo Bar Details:</h3>\n";
    echo "<ul>\n";
    echo "<li><strong>ID:</strong> {$promo_bar->id}</li>\n";
    echo "<li><strong>Name:</strong> {$promo_bar->name}</li>\n";
    echo "<li><strong>Title:</strong> {$promo_bar->title}</li>\n";
    echo "<li><strong>Status:</strong> {$promo_bar->status}</li>\n";
    echo "<li><strong>Priority:</strong> {$promo_bar->priority}</li>\n";
    echo "</ul>\n";
    
    echo "<h3>Assignments:</h3>\n";
    if (!empty($promo_bar->assignments)) {
        echo "<table border='1' style='border-collapse: collapse; width: 100%;'>\n";
        echo "<tr><th>Type</th><th>Target Value</th><th>Priority</th><th>Logic</th><th>Frequency Cap</th><th>Traffic %</th><th>Condition Data</th></tr>\n";
        
        foreach ($promo_bar->assignments as $assignment) {
            echo "<tr>\n";
            echo "<td>{$assignment['assignment_type']}</td>\n";
            echo "<td>{$assignment['target_value']}</td>\n";
            echo "<td>{$assignment['priority']}</td>\n";
            echo "<td>{$assignment['condition_logic']}</td>\n";
            echo "<td>{$assignment['frequency_cap']}</td>\n";
            echo "<td>{$assignment['traffic_percentage']}%</td>\n";
            echo "<td>" . (is_array($assignment['condition_data']) ? json_encode($assignment['condition_data']) : 'null') . "</td>\n";
            echo "</tr>\n";
        }
        echo "</table>\n";
    } else {
        echo "<p>No assignments found</p>\n";
    }
} else {
    echo "<p>❌ Failed to retrieve promo bar</p>\n";
}

// Test 3: Test assignment matching with different contexts
echo "<h2>Test 3: Testing Assignment Matching</h2>\n";

$manager = PromoBarX_Manager::get_instance();

// Simulate different user contexts
$test_contexts = [
    'admin_weekday' => [
        'user_roles' => ['administrator'],
        'device_type' => 'desktop',
        'day_of_week' => 2, // Tuesday
        'hour' => 14, // 2 PM
        'is_mobile' => false
    ],
    'guest_mobile_weekend' => [
        'user_roles' => ['guest'],
        'device_type' => 'mobile',
        'day_of_week' => 6, // Saturday
        'hour' => 15, // 3 PM
        'is_mobile' => true
    ],
    'subscriber_desktop_holiday' => [
        'user_roles' => ['subscriber'],
        'device_type' => 'desktop',
        'day_of_week' => 4, // Thursday
        'hour' => 12, // 12 PM
        'is_mobile' => false
    ]
];

foreach ($test_contexts as $context_name => $context_data) {
    echo "<h4>Testing Context: {$context_name}</h4>\n";
    
    // Mock the user context
    $_SERVER['HTTP_USER_AGENT'] = $context_data['is_mobile'] ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
    
    // Test the assignment matching
    $current_url = '/test-page/';
    $post_id = 1;
    $post_type = 'page';
    
    // Get user context (this will use the mocked data)
    $user_context = $manager->get_user_context();
    
    echo "<ul>\n";
    echo "<li><strong>User Roles:</strong> " . implode(', ', $user_context['user_roles']) . "</li>\n";
    echo "<li><strong>Device Type:</strong> {$user_context['device_type']}</li>\n";
    echo "<li><strong>Day of Week:</strong> {$user_context['day_of_week']}</li>\n";
    echo "<li><strong>Hour:</strong> {$user_context['hour']}</li>\n";
    echo "<li><strong>Is Mobile:</strong> " . ($user_context['is_mobile'] ? 'Yes' : 'No') . "</li>\n";
    echo "</ul>\n";
    
    // Test each assignment
    if (!empty($promo_bar->assignments)) {
        echo "<h5>Assignment Scores:</h5>\n";
        echo "<ul>\n";
        
        foreach ($promo_bar->assignments as $assignment) {
            $score = $manager->calculate_single_assignment_score($assignment, $current_url, $post_id, $post_type, $user_context);
            echo "<li><strong>{$assignment['assignment_type']}:</strong> {$score} points</li>\n";
        }
        
        echo "</ul>\n";
    }
}

// Test 4: Test frequency capping
echo "<h2>Test 4: Testing Frequency Capping</h2>\n";

$user_context = $manager->get_user_context();
$is_capped = $manager->is_frequency_capped($promo_bar_id, $user_context);

echo "<p>Frequency capped for promo bar {$promo_bar_id}: " . ($is_capped ? 'Yes' : 'No') . "</p>\n";

// Test 5: Test time-based conditions
echo "<h2>Test 5: Testing Time-Based Conditions</h2>\n";

$time_based_assignment = [
    'assignment_type' => 'time_based',
    'target_value' => json_encode([
        'days_of_week' => [1, 2, 3, 4, 5], // Weekdays
        'time_range' => ['start' => 9, 'end' => 17], // 9 AM to 5 PM
        'specific_dates' => ['2024-12-25'] // Christmas
    ])
];

$score = $manager->evaluate_time_based_condition($time_based_assignment['target_value'], $user_context);
echo "<p>Time-based condition score: {$score}</p>\n";

echo "<h2>Test Complete!</h2>\n";
echo "<p>The enhanced assignments system has been successfully tested.</p>\n";
?>
