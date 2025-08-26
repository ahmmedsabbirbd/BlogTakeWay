<?php
// Test script to verify click tracking functionality
require_once('../../../wp-config.php');

echo "<h1>Click Tracking Test</h1>";

global $wpdb;

// Check if promo bars exist
$promo_bars = $wpdb->get_results("SELECT id, name, title, cta_text FROM {$wpdb->prefix}promo_bars LIMIT 3");
echo "<p><strong>Found promo bars:</strong> " . count($promo_bars) . "</p>";

if (empty($promo_bars)) {
    echo "<p style='color: red;'>No promo bars found. Please create promo bars first.</p>";
    exit;
}

// Display current analytics data
echo "<h2>Current Analytics Data:</h2>";
$analytics_summary = $wpdb->get_results("
    SELECT 
        pba.promo_bar_id,
        pb.name as promo_bar_name,
        pba.event_type,
        COUNT(*) as count
    FROM {$wpdb->prefix}promo_bar_analytics pba
    INNER JOIN {$wpdb->prefix}promo_bars pb ON pba.promo_bar_id = pb.id
    GROUP BY pba.promo_bar_id, pba.event_type
    ORDER BY pba.promo_bar_id, pba.event_type
");

if (!empty($analytics_summary)) {
    echo "<table border='1' style='border-collapse: collapse; width: 100%; margin-bottom: 20px;'>";
    echo "<tr><th>Promo Bar ID</th><th>Name</th><th>Event Type</th><th>Count</th></tr>";
    foreach ($analytics_summary as $summary) {
        echo "<tr>";
        echo "<td>{$summary->promo_bar_id}</td>";
        echo "<td>{$summary->promo_bar_name}</td>";
        echo "<td>{$summary->event_type}</td>";
        echo "<td>{$summary->count}</td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "<p>No analytics data found.</p>";
}

// Test promo bar display
echo "<h2>Test Promo Bar Display:</h2>";
echo "<p>Below is a test promo bar. Try clicking on different areas:</p>";
echo "<ul>";
echo "<li><strong>General area:</strong> Should track 'click' event</li>";
echo "<li><strong>CTA button:</strong> Should track 'cta_click' event</li>";
echo "<li><strong>Close button:</strong> Should track 'close' event</li>";
echo "</ul>";

$test_promo_bar = $promo_bars[0];
?>

<style>
.promobarx-topbar {
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.4;
    text-align: center;
    transition: all 0.3s ease;
    background: #2563eb;
    color: white;
    margin: 20px 0;
    border-radius: 8px;
}

.promobarx-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
    cursor: pointer;
}

.promobarx-title {
    font-weight: 600;
}

.promobarx-cta {
    display: inline-block;
    padding: 8px 16px;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;
    white-space: nowrap;
    background: rgba(255,255,255,0.2);
    color: white;
}

.promobarx-cta:hover {
    transform: translateY(-1px);
    background: rgba(255,255,255,0.3);
}

.promobarx-close {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: all 0.2s ease;
    opacity: 0.7;
    color: white;
}

.promobarx-close:hover {
    opacity: 1;
    background: rgba(255,255,255,0.1);
}
</style>

<div id="promobarx-topbar-<?php echo esc_attr($test_promo_bar->id); ?>" class="promobarx-topbar">
    <div class="promobarx-content" onclick="promobarxTrackEvent(<?php echo esc_js($test_promo_bar->id); ?>, 'click')">
        <?php if (!empty($test_promo_bar->title)): ?>
            <div class="promobarx-title"><?php echo esc_html($test_promo_bar->title); ?></div>
        <?php endif; ?>
        
        <?php if (!empty($test_promo_bar->cta_text)): ?>
            <a href="#" class="promobarx-cta" onclick="event.stopPropagation(); promobarxTrackEvent(<?php echo esc_js($test_promo_bar->id); ?>, 'cta_click')">
                <?php echo esc_html($test_promo_bar->cta_text); ?>
            </a>
        <?php endif; ?>
    </div>
    
    <button class="promobarx-close" onclick="promobarxCloseBar(<?php echo esc_js($test_promo_bar->id); ?>)">
        ×
    </button>
</div>

<script>
function promobarxTrackEvent(promoId, eventType) {
    console.log('Tracking event:', eventType, 'for promo bar:', promoId);
    
    fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'action=promobarx_track_event&promo_id=' + promoId + '&event_type=' + eventType + '&nonce=<?php echo wp_create_nonce('promobarx_track'); ?>'
    })
    .then(response => response.json())
    .then(data => {
        console.log('Tracking response:', data);
        if (data.success) {
            alert('✅ Event tracked successfully: ' + eventType);
        } else {
            alert('❌ Failed to track event: ' + eventType);
        }
    })
    .catch(error => {
        console.error('Tracking error:', error);
        alert('❌ Error tracking event: ' + error.message);
    });
}

function promobarxCloseBar(promoId) {
    console.log('Closing promo bar:', promoId);
    
    const bar = document.getElementById('promobarx-topbar-' + promoId);
    if (bar) {
        bar.style.display = 'none';
    }
    
    // Track close event
    promobarxTrackEvent(promoId, 'close');
}

// Track impression on page load
document.addEventListener('DOMContentLoaded', function() {
    promobarxTrackEvent(<?php echo esc_js($test_promo_bar->id); ?>, 'impression');
});
</script>

<div style="margin-top: 20px; padding: 15px; background: #f0f0f0; border-radius: 5px;">
    <h3>Instructions:</h3>
    <ol>
        <li><strong>Click anywhere on the blue area</strong> (except CTA button) → Should track 'click'</li>
        <li><strong>Click the CTA button</strong> → Should track 'cta_click'</li>
        <li><strong>Click the × close button</strong> → Should track 'close'</li>
        <li><strong>Page load</strong> → Should track 'impression'</li>
    </ol>
    
    <p><strong>Check the browser console</strong> to see tracking logs and responses.</p>
</div>

<?php
// Show recent analytics after potential interactions
echo "<h2>Recent Analytics (after testing):</h2>";
echo "<p><a href='#' onclick='location.reload(); return false;'>🔄 Refresh to see updated data</a></p>";
?>
