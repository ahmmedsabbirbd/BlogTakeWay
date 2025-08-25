<?php
/**
 * Test CTA Text Color
 * 
 * This file tests whether the CTA text color is being applied correctly.
 */

// Include WordPress
require_once('../../../wp-load.php');

// Check if we have any promo bars
global $wpdb;
$table_name = $wpdb->prefix . 'promo_bars';
$promo_bars = $wpdb->get_results("SELECT * FROM {$table_name} ORDER BY id DESC LIMIT 3");

echo "<h1>CTA Text Color Test</h1>\n";

if (empty($promo_bars)) {
    echo "<p>No promo bars found in database.</p>\n";
    exit;
}

foreach ($promo_bars as $promo_bar) {
    echo "<h2>Promo Bar ID: {$promo_bar->id} - {$promo_bar->name}</h2>\n";
    
    // Parse styling JSON
    $styling = json_decode($promo_bar->styling, true);
    if (!$styling) {
        $styling = [];
    }
    
    echo "<h3>Styling Data:</h3>\n";
    echo "<pre>" . print_r($styling, true) . "</pre>\n";
    
    // Check CTA text color specifically
    $cta_text_color = $styling['cta_text_color'] ?? 'NOT SET';
    $cta_font_size = $styling['cta_font_size'] ?? 'NOT SET';
    
    echo "<h3>CTA Styling:</h3>\n";
    echo "<p><strong>CTA Text Color:</strong> {$cta_text_color}</p>\n";
    echo "<p><strong>CTA Font Size:</strong> {$cta_font_size}</p>\n";
    
    // Test rendering
    echo "<h3>Rendered Preview:</h3>\n";
    echo "<div style='border: 1px solid #ccc; padding: 20px; margin: 10px 0;'>\n";
    
    // Extract CTA styling
    $cta_text_color = $styling['cta_text_color'] ?? $styling['background'] ?? '#3b82f6';
    $cta_font_size = $styling['cta_font_size'] ?? 'inherit';
    
    // Generate CTA style
    $cta_style = '';
    if ($cta_text_color) {
        $cta_style .= 'color: ' . esc_attr($cta_text_color) . ';';
    }
    if ($cta_font_size && $cta_font_size !== 'inherit') {
        $cta_style .= 'font-size: ' . esc_attr($cta_font_size) . ';';
    }
    
    echo "<div style='background: #f5f5f5; padding: 15px; border-radius: 5px;'>\n";
    
    if ($promo_bar->cta_text && $promo_bar->cta_url) {
        echo "<a href='{$promo_bar->cta_url}' style='display: inline-block; padding: 8px 16px; background: #4F46E5; border-radius: 4px; text-decoration: none; font-weight: 500; {$cta_style}'>{$promo_bar->cta_text}</a>\n";
    } else {
        echo "<p>No CTA text or URL set</p>\n";
    }
    
    echo "</div>\n";
    echo "</div>\n";
    
    echo "<hr>\n";
}

echo "<h2>Test Complete</h2>\n";
echo "<p>If you can see the CTA text color being applied above, then the feature is working correctly.</p>\n";
echo "<p>Note: The CTA text color should override the default white color.</p>\n";
?>
