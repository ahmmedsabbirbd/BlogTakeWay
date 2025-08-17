<?php
/**
 * Simple test for assignments array processing
 */

echo "<h1>Simple Assignments Array Test</h1>";

// Test data
$test_data = [
    'name' => 'Test Promo Bar',
    'title' => 'Test Title',
    'status' => 'active',
    'assignments' => json_encode([
        [
            "id" => 1755409442695,
            "assignment_type" => "post_type",
            "target_id" => 0,
            "target_value" => "post",
            "priority" => 1
        ],
        [
            "id" => 1755409448733,
            "assignment_type" => "page",
            "target_id" => 2,
            "target_value" => "Sample Page",
            "priority" => 2
        ]
    ])
];

echo "<h2>Test Data:</h2>";
echo "<pre>" . print_r($test_data, true) . "</pre>";

// Simulate the sanitize_promo_bar_data function
function sanitize_promo_bar_data($data) {
    $sanitized = [];
    
    // Sanitize basic text fields
    $text_fields = ['name', 'title', 'cta_text', 'cta_url', 'target_value'];
    foreach ($text_fields as $field) {
        if (isset($data[$field])) {
            $sanitized[$field] = htmlspecialchars($data[$field]);
        }
    }
    
    // Sanitize numeric fields
    $numeric_fields = ['template_id', 'priority', 'created_by', 'target_id'];
    foreach ($numeric_fields as $field) {
        if (isset($data[$field])) {
            $sanitized[$field] = intval($data[$field]);
        }
    }
    
    // Sanitize status field
    if (isset($data['status'])) {
        $allowed_statuses = ['draft', 'active', 'paused', 'archived'];
        $sanitized['status'] = in_array($data['status'], $allowed_statuses) ? $data['status'] : 'draft';
    }
    
    // Handle assignments array
    if (isset($data['assignments'])) {
        $sanitized['assignments'] = $data['assignments'];
    }
    
    return $sanitized;
}

// Simulate the save_promo_bar logic
function process_assignments_array($data) {
    // Step 1: Sanitize data
    $sanitized_data = sanitize_promo_bar_data($data);
    echo "<h2>Step 1: Sanitized Data:</h2>";
    echo "<pre>" . print_r($sanitized_data, true) . "</pre>";
    
    // Step 2: Set defaults
    $defaults = [
        'name' => '',
        'title' => '',
        'assignment_type' => 'global',
        'target_id' => 0,
        'target_value' => '',
        'priority' => 0,
        'status' => 'draft'
    ];
    
    $data = array_merge($defaults, $sanitized_data);
    echo "<h2>Step 2: Data with Defaults:</h2>";
    echo "<pre>" . print_r($data, true) . "</pre>";
    
    // Step 3: Handle assignments array
    if (isset($data['assignments']) && !empty($data['assignments'])) {
        $assignments = $data['assignments'];
        
        // If assignments is a JSON string, decode it
        if (is_string($assignments)) {
            $assignments = json_decode($assignments, true);
        }
        
        if (is_array($assignments) && !empty($assignments)) {
            // Use the first assignment as the primary assignment
            $primary_assignment = $assignments[0];
            
            $data['assignment_type'] = $primary_assignment['assignment_type'] ?? 'global';
            $data['target_id'] = intval($primary_assignment['target_id'] ?? 0);
            $data['target_value'] = $primary_assignment['target_value'] ?? '';
            $data['priority'] = intval($primary_assignment['priority'] ?? 0);
            
            echo "<h2>Step 3: Primary Assignment:</h2>";
            echo "<pre>" . print_r($primary_assignment, true) . "</pre>";
        }
    }
    
    // Step 4: Remove assignments array
    unset($data['assignments']);
    
    echo "<h2>Step 4: Final Data for Database:</h2>";
    echo "<pre>" . print_r($data, true) . "</pre>";
    
    return $data;
}

// Run the test
$final_data = process_assignments_array($test_data);

echo "<h2>Test Results:</h2>";
echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
echo "<tr><th>Field</th><th>Expected Value</th><th>Actual Value</th><th>Status</th></tr>";
echo "<tr><td>assignment_type</td><td>post_type</td><td>{$final_data['assignment_type']}</td><td>" . ($final_data['assignment_type'] === 'post_type' ? '✅' : '❌') . "</td></tr>";
echo "<tr><td>target_id</td><td>0</td><td>{$final_data['target_id']}</td><td>" . ($final_data['target_id'] == 0 ? '✅' : '❌') . "</td></tr>";
echo "<tr><td>target_value</td><td>post</td><td>{$final_data['target_value']}</td><td>" . ($final_data['target_value'] === 'post' ? '✅' : '❌') . "</td></tr>";
echo "<tr><td>priority</td><td>1</td><td>{$final_data['priority']}</td><td>" . ($final_data['priority'] == 1 ? '✅' : '❌') . "</td></tr>";
echo "</table>";

echo "<h2>Summary:</h2>";
if ($final_data['assignment_type'] === 'post_type' && 
    $final_data['target_id'] == 0 && 
    $final_data['target_value'] === 'post' && 
    $final_data['priority'] == 1) {
    echo "<p style='color: green;'>✅ All tests passed! The assignments array processing is working correctly.</p>";
} else {
    echo "<p style='color: red;'>❌ Some tests failed. Check the implementation.</p>";
}
?>
