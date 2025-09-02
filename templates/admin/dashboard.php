<?php
if (!defined('ABSPATH')) exit;
?>

<div class="wrap">
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
                    ⚙️ Settings
                </a>
                <a href="<?php echo admin_url('admin.php?page=blog-takeway-logs'); ?>" class="button button-secondary">
                    📋 View Logs
                </a>
            </div>
        </div>

        <!-- Database Status -->
        <div class="database-status">
            <h2>Database Status</h2>
            <table class="widefat">
                <thead>
                    <tr>
                        <th>Table</th>
                        <th>Status</th>
                        <th>Records</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($table_info as $table_name => $info): ?>
                    <tr>
                        <td><strong><?php echo esc_html($table_name); ?></strong></td>
                        <td>
                            <?php if ($info['exists']): ?>
                                <span class="status-ok">✅ Active</span>
                            <?php else: ?>
                                <span class="status-error">❌ Missing</span>
                            <?php endif; ?>
                        </td>
                        <td><?php echo esc_html($info['rows']); ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>

        <!-- Recent Activity -->
        <div class="recent-activity">
            <h2>Recent Activity</h2>
            <div class="activity-list">
                <?php
                $recent_logs = $database->get_generation_logs(['limit' => 5]);
                if (!empty($recent_logs)):
                    foreach ($recent_logs as $log):
                        $post_title = get_the_title($log['post_id']);
                        $status_class = $log['status'] === 'success' ? 'success' : ($log['status'] === 'failed' ? 'error' : 'warning');
                ?>
                <div class="activity-item <?php echo esc_attr($status_class); ?>">
                    <div class="activity-icon">
                        <?php echo $log['status'] === 'success' ? '✅' : ($log['status'] === 'failed' ? '❌' : '⏳'); ?>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">
                            <?php echo esc_html($log['operation_type']); ?> for 
                            <a href="<?php echo get_edit_post_link($log['post_id']); ?>"><?php echo esc_html($post_title); ?></a>
                        </div>
                        <div class="activity-meta">
                            <?php echo esc_html($log['ai_model']); ?> • 
                            <?php echo esc_html(human_time_diff(strtotime($log['created_at']))); ?> ago
                        </div>
                    </div>
                </div>
                <?php 
                    endforeach;
                else:
                ?>
                <p class="no-activity">No recent activity found.</p>
                <?php endif; ?>
            </div>
        </div>

        <!-- System Information -->
        <div class="system-info">
            <h2>System Information</h2>
            <table class="widefat">
                <tbody>
                    <tr>
                        <td><strong>Plugin Version:</strong></td>
                        <td><?php echo esc_html(BLOG_TAKEWAY_VERSION); ?></td>
                    </tr>
                    <tr>
                        <td><strong>WordPress Version:</strong></td>
                        <td><?php echo esc_html(get_bloginfo('version')); ?></td>
                    </tr>
                    <tr>
                        <td><strong>PHP Version:</strong></td>
                        <td><?php echo esc_html(PHP_VERSION); ?></td>
                    </tr>
                    <tr>
                        <td><strong>Database Connection:</strong></td>
                        <td>
                            <?php if ($database->test_connection()): ?>
                                <span class="status-ok">✅ Connected</span>
                            <?php else: ?>
                                <span class="status-error">❌ Failed</span>
                            <?php endif; ?>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<style>
.blog-takeway-dashboard {
    margin-top: 20px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.stat-card {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-icon {
    font-size: 2em;
    margin-bottom: 10px;
}

.stat-content h3 {
    margin: 0 0 5px 0;
    font-size: 2em;
    color: #0073aa;
}

.stat-content p {
    margin: 0;
    color: #666;
}

.quick-actions {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 30px;
}

.action-buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.database-status,
.recent-activity,
.system-info {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 30px;
}

.status-ok {
    color: #46b450;
    font-weight: bold;
}

.status-error {
    color: #dc3232;
    font-weight: bold;
}

.status-warning {
    color: #ffb900;
    font-weight: bold;
}

.activity-list {
    max-height: 300px;
    overflow-y: auto;
}

.activity-item {
    display: flex;
    align-items: center;
    padding: 15px;
    border: 1px solid #eee;
    border-radius: 5px;
    margin-bottom: 10px;
}

.activity-item.success {
    border-left: 4px solid #46b450;
}

.activity-item.error {
    border-left: 4px solid #dc3232;
}

.activity-item.warning {
    border-left: 4px solid #ffb900;
}

.activity-icon {
    font-size: 1.5em;
    margin-right: 15px;
}

.activity-title {
    font-weight: bold;
    margin-bottom: 5px;
}

.activity-meta {
    color: #666;
    font-size: 0.9em;
}

.no-activity {
    text-align: center;
    color: #666;
    font-style: italic;
}

@media (max-width: 768px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }
    
    .action-buttons {
        flex-direction: column;
    }
    
    .action-buttons .button {
        text-align: center;
    }
}
</style>
