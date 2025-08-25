<?php
/**
 * Simple CTA Text Color Test
 */

// Include WordPress
require_once('../../../wp-load.php');

// Check if we have any promo bars
global $wpdb;
$table_name = $wpdb->prefix . 'promo_bars';
$promo_bars = $wpdb->get_results("SELECT * FROM {$table_name} ORDER BY id DESC LIMIT 1");

echo "<h1>Simple CTA Text Color Test</h1>\n";

if (empty($promo_bars)) {
    echo "<p>No promo bars found in database.</p>\n";
    exit;
}

$promo_bar = $promo_bars[0];
echo "<h2>Testing Promo Bar: {$promo_bar->name}</h2>\n";

// Parse styling JSON
$styling = json_decode($promo_bar->styling, true);
$cta_style = json_decode($promo_bar->cta_style, true);

echo "<h3>Styling Data:</h3>\n";
echo "<p><strong>CTA Text Color:</strong> " . ($styling['cta_text_color'] ?? 'NOT SET') . "</p>\n";
echo "<p><strong>CTA Style Color:</strong> " . ($cta_style['color'] ?? 'NOT SET') . "</p>\n";

// Test rendering with different colors
echo "<h3>Test Renders:</h3>\n";

// Test 1: Default (should be white from CSS)
echo "<div style='background: #2563eb; padding: 15px; margin: 10px 0; border-radius: 5px;'>\n";
echo "<p style='color: white; margin: 0 0 10px 0;'>Default CTA (should be white):</p>\n";
echo "<a href='#' style='display: inline-block; padding: 8px 16px; background: rgba(255,255,255,0.2); border-radius: 4px; text-decoration: none; font-weight: 500;'>Default CTA</a>\n";
echo "</div>\n";

// Test 2: With individual styling
if ($styling['cta_text_color']) {
    echo "<div style='background: #2563eb; padding: 15px; margin: 10px 0; border-radius: 5px;'>\n";
    echo "<p style='color: white; margin: 0 0 10px 0;'>With CTA Text Color ({$styling['cta_text_color']}):</p>\n";
    echo "<a href='#' style='display: inline-block; padding: 8px 16px; background: rgba(255,255,255,0.2); border-radius: 4px; text-decoration: none; font-weight: 500; color: {$styling['cta_text_color']};'>{$styling['cta_text_color']} CTA</a>\n";
    echo "</div>\n";
}

// Test 3: With CTA style color
if ($cta_style['color']) {
    echo "<div style='background: #2563eb; padding: 15px; margin: 10px 0; border-radius: 5px;'>\n";
    echo "<p style='color: white; margin: 0 0 10px 0;'>With CTA Style Color ({$cta_style['color']}):</p>\n";
    echo "<a href='#' style='display: inline-block; padding: 8px 16px; background: rgba(255,255,255,0.2); border-radius: 4px; text-decoration: none; font-weight: 500; color: {$cta_style['color']};'>{$cta_style['color']} CTA</a>\n";
    echo "</div>\n";
}

// Test 4: Combined (individual should override)
if ($styling['cta_text_color'] && $cta_style['color']) {
    echo "<div style='background: #2563eb; padding: 15px; margin: 10px 0; border-radius: 5px;'>\n";
    echo "<p style='color: white; margin: 0 0 10px 0;'>Combined (individual should override):</p>\n";
    echo "<a href='#' style='display: inline-block; padding: 8px 16px; background: rgba(255,255,255,0.2); border-radius: 4px; text-decoration: none; font-weight: 500; color: {$cta_style['color']}; color: {$styling['cta_text_color']};'>{$styling['cta_text_color']} CTA (should override)</a>\n";
    echo "</div>\n";
}

echo "<h3>Expected Result:</h3>\n";
echo "<p>If the CTA text color is working correctly, you should see the custom color applied to the CTA button text.</p>\n";
echo "<p>The individual CTA text color should override any other color settings.</p>\n";
?>
