<?php
if (!defined('ABSPATH')) exit;
?>

<div class="wrap blog-takeway-wrap">
    <h1 class="wp-heading-inline">Blog TakeWay Dashboard</h1>
    
    <div class="blog-takeway-dashboard">
        <!-- Statistics Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">📊</div>
                <div class="stat-content">
                    <h3><?php echo esc_html($stats['total_summaries']); ?></h3>
                    <p>Total Summaries</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">✅</div>
                <div class="stat-content">
                    <h3><?php echo esc_html($stats['published_summaries']); ?></h3>
                    <p>Published</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">🔄</div>
                <div class="stat-content">
                    <h3><?php echo esc_html($stats['recent_generations']); ?></h3>
                    <p>Recent (7 days)</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">⏰</div>
                <div class="stat-content">
                    <h3><?php echo esc_html($stats['cache_expired']); ?></h3>
                    <p>Cache Expired</p>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
            <h2>Quick Actions</h2>
            <div class="action-buttons">
                <a href="<?php echo admin_url('admin.php?page=blog-takeway-bulk-generator'); ?>" class="button button-primary">
                    🚀 Bulk Generate Summaries
                </a>
                <a href="<?php echo admin_url('admin.php?page=blog-takeway-settings'); ?>" class="button button-secondary">
                    ⚙️ Configure Settings
                </a>
            </div>
        </div>
    </div>
</div>

<style>
/* Dashboard Wrapper */
.blog-takeway-wrap {
    margin: 20px;
    max-width: 1200px;
}

/* Statistics Grid */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
}

.stat-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 24px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease;
}

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
    font-size: 32px;
    margin-bottom: 16px;
}

.stat-content h3 {
    margin: 0 0 8px 0;
    font-size: 28px;
    color: #1a56db;
    font-weight: 600;
}

.stat-content p {
    margin: 0;
    color: #6b7280;
    font-size: 14px;
}

/* Quick Actions */
.quick-actions {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 32px;
}

.quick-actions h2 {
    margin: 0 0 16px 0;
    font-size: 18px;
    color: #111827;
}

.action-buttons {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
}

.action-buttons .button {
    padding: 8px 16px;
    height: auto;
    font-size: 14px;
    line-height: 1.5;
}

/* Responsive Design */
@media (max-width: 782px) {
    .blog-takeway-wrap {
        margin: 10px;
    }

    .stats-grid {
        grid-template-columns: 1fr;
        gap: 16px;
    }

    .stat-card,
    .quick-actions {
        padding: 16px;
    }

    .action-buttons {
        flex-direction: column;
    }

    .action-buttons .button {
        width: 100%;
        text-align: center;
    }
}
</style>