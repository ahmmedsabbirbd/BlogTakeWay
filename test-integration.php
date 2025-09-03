<?php
// Load WordPress
require_once dirname(dirname(dirname(dirname(__FILE__)))) . '/wp-load.php';

// Test data
$api_key = 'test-api-key';
$selected_model = 'gpt-3.5-turbo';
$post_id = 1;
$sample_content = '
<h1>Introduction</h1>
This is a sample blog post about AI technology.

<h2>What is AI?</h2>
Artificial Intelligence is transforming our world.

<h2>Applications</h2>
AI has many applications in various fields.
';

// Initialize classes
$database = new Blog_Summary_Database();
$ai_handler = new AI_API_Handler();

// Test 1: Save API Settings
echo "Testing API Settings Save...\n";
$result = $database->save_api_settings($api_key, $selected_model);
echo $result ? "✅ API Settings saved\n" : "❌ Failed to save API settings\n";

// Test 2: Get API Settings
echo "\nTesting API Settings Retrieval...\n";
$settings = $database->get_api_settings();
echo $settings ? "✅ API Settings retrieved\n" : "❌ Failed to get API settings\n";
print_r($settings);

// Test 3: Generate Summary
echo "\nTesting Summary Generation...\n";
$summary = $ai_handler->generate_summary($sample_content);
echo !is_wp_error($summary) ? "✅ Summary generated\n" : "❌ Failed to generate summary\n";
print_r($summary);

// Test 4: Save Summary
echo "\nTesting Summary Save...\n";
if (!is_wp_error($summary)) {
    $result = $database->save_blog_summary(
        $post_id,
        $summary['takeaways'],
        $summary['min_read_list']
    );
    echo $result ? "✅ Summary saved\n" : "❌ Failed to save summary\n";
}