<?php
// Script to add sample analytics data for testing
require_once('../../../wp-config.php');

echo "<h1>Adding Sample Analytics Data</h1>";

global $wpdb;

// Check if promo bars exist
$promo_bars = $wpdb->get_results("SELECT id, name FROM {$wpdb->prefix}promo_bars LIMIT 5");
echo "<p><strong>Found promo bars:</strong> " . count($promo_bars) . "</p>";

if (empty($promo_bars)) {
    echo "<p style='color: red;'>No promo bars found. Please create promo bars first.</p>";
    exit;
}

// Sample analytics data
$sample_analytics = [
    [
        'promo_bar_id' => $promo_bars[0]->id,
        'event_type' => 'impression',
        'count' => 150
    ],
    [
        'promo_bar_id' => $promo_bars[0]->id,
        'event_type' => 'click',
        'count' => 25
    ],
    [
        'promo_bar_id' => $promo_bars[0]->id,
        'event_type' => 'close',
        'count' => 15
    ],
    [
        'promo_bar_id' => $promo_bars[0]->id,
        'event_type' => 'cta_click',
        'count' => 8
    ]
];

// Add more data for other promo bars if they exist
if (count($promo_bars) > 1) {
    $sample_analytics[] = [
        'promo_bar_id' => $promo_bars[1]->id,
        'event_type' => 'impression',
        'count' => 89
    ];
    $sample_analytics[] = [
        'promo_bar_id' => $promo_bars[1]->id,
        'event_type' => 'click',
        'count' => 12
    ];
    $sample_analytics[] = [
        'promo_bar_id' => $promo_bars[1]->id,
        'event_type' => 'close',
        'count' => 8
    ];
    $sample_analytics[] = [
        'promo_bar_id' => $promo_bars[1]->id,
        'event_type' => 'cta_click',
        'count' => 5
    ];
}

if (count($promo_bars) > 2) {
    $sample_analytics[] = [
        'promo_bar_id' => $promo_bars[2]->id,
        'event_type' => 'impression',
        'count' => 234
    ];
    $sample_analytics[] = [
        'promo_bar_id' => $promo_bars[2]->id,
        'event_type' => 'click',
        'count' => 45
    ];
    $sample_analytics[] = [
        'promo_bar_id' => $promo_bars[2]->id,
        'event_type' => 'close',
        'count' => 23
    ];
    $sample_analytics[] = [
        'promo_bar_id' => $promo_bars[2]->id,
        'event_type' => 'cta_click',
        'count' => 18
    ];
}

echo "<h2>Adding Sample Analytics Data:</h2>";

$inserted_count = 0;
foreach ($sample_analytics as $analytics) {
    // Insert multiple records for each count
    for ($i = 0; $i < $analytics['count']; $i++) {
        $data = [
            'promo_bar_id' => $analytics['promo_bar_id'],
            'event_type' => $analytics['event_type'],
            'page_url' => '/',
            'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'ip_address' => '127.0.0.1',
            'user_id' => 1,
            'session_id' => 'test_session_' . $analytics['promo_bar_id'] . '_' . $i,
            'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 30) . ' days'))
        ];
        
        $result = $wpdb->insert(
            $wpdb->prefix . 'promo_bar_analytics',
            $data,
            ['%d', '%s', '%s', '%s', '%s', '%d', '%s', '%s']
        );
        
        if ($result !== false) {
            $inserted_count++;
        }
    }
    
    echo "<p style='color: green;'>✓ Added {$analytics['count']} {$analytics['event_type']} events for promo bar ID {$analytics['promo_bar_id']}</p>";
}

echo "<h2>Summary:</h2>";
echo "<p><strong>Total analytics records inserted:</strong> $inserted_count</p>";

// Verify the data
echo "<h2>Verification:</h2>";
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
    echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
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
}

echo "<h2>Next Steps:</h2>";
echo "<p>1. Go to WordPress Admin → PromoBarX → Top Bar Manager</p>";
echo "<p>2. The 'All Promo Bars' section should now show analytics data</p>";
echo "<p>3. Each promo bar will display impression, click, close, and CTA click counts</p>";
?>
