<?php
if (!defined('ABSPATH')) exit;
?>

<div class="wrap post-takeaways-wrap">
    <h1 class="wp-heading-inline">Post Takeaways Dashboard</h1>
    
    <div class="post-takeaways-dashboard">
        <!-- Statistics Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">📊</div>
                <div class="stat-content">
                    <h3><?php echo esc_html($stats['total_summaries'] ?? 0); ?></h3>
                    <p><?php esc_html_e('Total Summaries', 'post-takeaways'); ?></p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">✅</div>
                <div class="stat-content">
                    <h3><?php echo esc_html($stats['published_summaries'] ?? 0); ?></h3>
                    <p><?php esc_html_e('Published', 'post-takeaways'); ?></p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">🔄</div>
                <div class="stat-content">
                    <h3><?php echo esc_html($stats['recent_generations'] ?? 0); ?></h3>
                    <p><?php esc_html_e('Recent (7 days)', 'post-takeaways'); ?></p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">⏰</div>
                <div class="stat-content">
                    <h3><?php echo esc_html($stats['cache_expired'] ?? 0); ?></h3>
                    <p><?php esc_html_e('Cache Expired', 'post-takeaways'); ?></p>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
            <h2><?php esc_html_e('Quick Actions', 'post-takeaways'); ?></h2>
            <div class="action-buttons">
                <a href="<?php echo esc_url(admin_url('admin.php?page=post-takeaways-bulk-generator')); ?>" class="button button-primary">
                    🚀 <?php esc_html_e('Bulk Generate Summaries', 'post-takeaways'); ?>
                </a>
                <a href="<?php echo esc_url(admin_url('admin.php?page=post-takeaways-settings')); ?>" class="button button-secondary">
                    ⚙️ <?php esc_html_e('Configure Settings', 'post-takeaways'); ?>
                </a>
            </div>
        </div>
    </div>
</div>

<style>
/* Dashboard Wrapper */
.post-takeaways-wrap {
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
    .post-takeaways-wrap {
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