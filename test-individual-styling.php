<?php
/**
 * Test Individual Element Styling
 * 
 * This file tests whether individual element styling (title_color, countdown_color, cta_text_color, etc.)
 * is being saved and applied correctly.
 */

// Include WordPress
require_once('../../../wp-load.php');

// Check if we have any promo bars
global $wpdb;
$table_name = $wpdb->prefix . 'promo_bars';
$promo_bars = $wpdb->get_results("SELECT * FROM {$table_name} ORDER BY id DESC LIMIT 5");

echo "<h1>Individual Element Styling Test</h1>\n";

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
    
    // Check for individual element styling
    $individual_fields = [
        'title_color',
        'title_font_size', 
        'countdown_color',
        'countdown_font_size',
        'cta_text_color',
        'cta_font_size'
    ];
    
    echo "<h3>Individual Element Styling Fields:</h3>\n";
    foreach ($individual_fields as $field) {
        $value = $styling[$field] ?? 'NOT SET';
        echo "<p><strong>{$field}:</strong> {$value}</p>\n";
    }
    
    // Test rendering
    echo "<h3>Rendered Preview:</h3>\n";
    echo "<div style='border: 1px solid #ccc; padding: 20px; margin: 10px 0;'>\n";
    
    // Extract individual element styling
    $title_color = $styling['title_color'] ?? $styling['color'] ?? '#333333';
    $title_font_size = $styling['title_font_size'] ?? 'inherit';
    $countdown_color = $styling['countdown_color'] ?? $styling['color'] ?? '#333333';
    $countdown_font_size = $styling['countdown_font_size'] ?? 'inherit';
    $cta_text_color = $styling['cta_text_color'] ?? $styling['background'] ?? '#3b82f6';
    $cta_font_size = $styling['cta_font_size'] ?? 'inherit';
    
    // Generate styles
    $title_style = '';
    if ($title_color) {
        $title_style .= 'color: ' . esc_attr($title_color) . ';';
    }
    if ($title_font_size && $title_font_size !== 'inherit') {
        $title_style .= 'font-size: ' . esc_attr($title_font_size) . ';';
    }
    
    $countdown_style = '';
    if ($countdown_color) {
        $countdown_style .= 'color: ' . esc_attr($countdown_color) . ';';
    }
    if ($countdown_font_size && $countdown_font_size !== 'inherit') {
        $countdown_style .= 'font-size: ' . esc_attr($countdown_font_size) . ';';
    }
    
    $cta_style = '';
    if ($cta_text_color) {
        $cta_style .= 'color: ' . esc_attr($cta_text_color) . ';';
    }
    if ($cta_font_size && $cta_font_size !== 'inherit') {
        $cta_style .= 'font-size: ' . esc_attr($cta_font_size) . ';';
    }
    
    echo "<div style='background: #f5f5f5; padding: 15px; border-radius: 5px;'>\n";
    
    if ($promo_bar->title) {
        echo "<div style='font-weight: 600; margin-bottom: 10px; {$title_style}'>{$promo_bar->title}</div>\n";
    }
    
    if ($promo_bar->countdown_enabled && $promo_bar->countdown_date) {
        echo "<div style='font-family: monospace; font-weight: 600; margin-bottom: 10px; {$countdown_style}'>00d 00h 00m 00s</div>\n";
    }
    
    if ($promo_bar->cta_text && $promo_bar->cta_url) {
        echo "<a href='{$promo_bar->cta_url}' style='display: inline-block; padding: 8px 16px; background: #4F46E5; border-radius: 4px; text-decoration: none; font-weight: 500; {$cta_style}'>{$promo_bar->cta_text}</a>\n";
    }
    
    echo "</div>\n";
    echo "</div>\n";
    
    echo "<hr>\n";
}

echo "<h2>Test Complete</h2>\n";
echo "<p>If you can see the individual element styling being applied above, then the feature is working correctly.</p>\n";
?>
