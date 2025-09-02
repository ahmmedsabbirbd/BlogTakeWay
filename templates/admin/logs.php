<?php
if (!defined('ABSPATH')) exit;
?>

<div class="wrap">
    <h1 class="wp-heading-inline">Generation Logs</h1>
    
    <div class="blog-takeway-logs">
        <!-- Logs Overview -->
        <div class="logs-overview">
            <div class="overview-stats">
                <div class="stat-card">
                    <div class="stat-number"><?php echo esc_html($total_logs); ?></div>
                    <div class="stat-label">Total Operations</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number"><?php echo esc_html($successful_logs); ?></div>
                    <div class="stat-label">Successful</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number"><?php echo esc_html($failed_logs); ?></div>
                    <div class="stat-label">Failed</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number"><?php echo esc_html($total_tokens); ?></div>
                    <div class="stat-label">Total Tokens Used</div>
                </div>
            </div>
        </div>
        
        <!-- Logs Filters -->
        <div class="logs-filters">
            <form method="get" class="filter-form">
                <input type="hidden" name="page" value="blog-takeway-logs">
                
                <div class="filter-row">
                    <div class="filter-group">
                        <label for="status-filter">Status:</label>
                        <select name="status" id="status-filter">
                            <option value="">All Statuses</option>
                            <option value="success" <?php selected($filters['status'], 'success'); ?>>Success</option>
                            <option value="failed" <?php selected($filters['status'], 'failed'); ?>>Failed</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label for="operation-filter">Operation:</label>
                        <select name="operation" id="operation-filter">
                            <option value="">All Operations</option>
                            <option value="generate" <?php selected($filters['operation'], 'generate'); ?>>Generate Summary</option>
                            <option value="regenerate" <?php selected($filters['operation'], 'regenerate'); ?>>Regenerate Summary</option>
                            <option value="bulk" <?php selected($filters['operation'], 'bulk'); ?>>Bulk Generation</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label for="date-from">From:</label>
                        <input type="date" name="date_from" id="date-from" value="<?php echo esc_attr($filters['date_from']); ?>">
                    </div>
                    
                    <div class="filter-group">
                        <label for="date-to">To:</label>
                        <input type="date" name="date_to" id="date-to" value="<?php echo esc_attr($filters['date_to']); ?>">
                    </div>
                    
                    <div class="filter-group">
                        <button type="submit" class="button">Filter Logs</button>
                        <a href="?page=blog-takeway-logs" class="button">Clear Filters</a>
                    </div>
                </div>
            </form>
        </div>
        
        <!-- Logs Table -->
        <div class="logs-table-container">
            <?php if (!empty($logs)): ?>
                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th>Date/Time</th>
                            <th>Operation</th>
                            <th>Post</th>
                            <th>Status</th>
                            <th>Tokens Used</th>
                            <th>Duration</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($logs as $log): ?>
                            <tr>
                                <td>
                                    <strong><?php echo esc_html(date('M j, Y', strtotime($log->created_at))); ?></strong><br>
                                    <small><?php echo esc_html(date('g:i A', strtotime($log->created_at))); ?></small>
                                </td>
                                <td>
                                    <span class="operation-badge operation-<?php echo esc_attr($log->operation); ?>">
                                        <?php echo esc_html(ucfirst($log->operation)); ?>
                                    </span>
                                </td>
                                <td>
                                    <?php if ($log->post_id): ?>
                                        <a href="<?php echo get_edit_post_link($log->post_id); ?>" target="_blank">
                                            <?php echo esc_html(get_the_title($log->post_id)); ?>
                                        </a>
                                    <?php else: ?>
                                        <em>N/A</em>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <span class="status-badge status-<?php echo esc_attr($log->status); ?>">
                                        <?php echo esc_html(ucfirst($log->status)); ?>
                                    </span>
                                </td>
                                <td>
                                    <?php if ($log->tokens_used): ?>
                                        <?php echo number_format($log->tokens_used); ?>
                                    <?php else: ?>
                                        <em>N/A</em>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if ($log->duration): ?>
                                        <?php echo number_format($log->duration, 2); ?>s
                                    <?php else: ?>
                                        <em>N/A</em>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if ($log->error_message): ?>
                                        <button type="button" class="button button-small view-error" 
                                                data-error="<?php echo esc_attr($log->error_message); ?>">
                                            View Error
                                        </button>
                                    <?php elseif ($log->ai_model): ?>
                                        <span class="ai-model"><?php echo esc_html($log->ai_model); ?></span>
                                    <?php else: ?>
                                        <em>N/A</em>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
                
                <!-- Pagination -->
                <?php if ($total_pages > 1): ?>
                    <div class="tablenav">
                        <div class="tablenav-pages">
                            <?php
                            $page_links = paginate_links(array(
                                'base' => add_query_arg('paged', '%#%'),
                                'format' => '',
                                'prev_text' => __('&laquo;'),
                                'next_text' => __('&raquo;'),
                                'total' => $total_pages,
                                'current' => $current_page,
                                'type' => 'array'
                            ));
                            
                            if ($page_links) {
                                echo '<span class="pagination-links">' . join("\n", $page_links) . '</span>';
                            }
                            ?>
                        </div>
                    </div>
                <?php endif; ?>
                
            <?php else: ?>
                <div class="no-logs">
                    <p>No generation logs found.</p>
                    <?php if (!empty($filters)): ?>
                        <p>Try adjusting your filters or <a href="?page=blog-takeway-logs">clear all filters</a>.</p>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
        </div>
        
        <!-- Logs Actions -->
        <div class="logs-actions">
            <div class="action-buttons">
                <button type="button" class="button" id="export-logs">📊 Export Logs (CSV)</button>
                <button type="button" class="button" id="clear-old-logs">🗑️ Clear Old Logs</button>
                <button type="button" class="button" id="refresh-logs">🔄 Refresh</button>
            </div>
            
            <div class="logs-info">
                <p><strong>Note:</strong> Logs are automatically cleaned up after 90 days to maintain database performance.</p>
            </div>
        </div>
    </div>
</div>

<!-- Error Modal -->
<div id="error-modal" class="modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Error Details</h3>
            <span class="close">&times;</span>
        </div>
        <div class="modal-body">
            <pre id="error-content"></pre>
        </div>
    </div>
</div>

<style>
.blog-takeway-logs {
    margin-top: 20px;
}

.logs-overview,
.logs-filters,
.logs-table-container,
.logs-actions {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
}

.overview-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
}

.stat-card {
    text-align: center;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
    border: 1px solid #e5e5e5;
}

.stat-number {
    font-size: 2em;
    font-weight: bold;
    color: #0073aa;
    margin-bottom: 8px;
}

.stat-label {
    color: #666;
    font-size: 0.9em;
}

.filter-form {
    margin-bottom: 0;
}

.filter-row {
    display: flex;
    gap: 15px;
    align-items: end;
    flex-wrap: wrap;
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.filter-group label {
    font-weight: bold;
    font-size: 0.9em;
    color: #555;
}

.filter-group select,
.filter-group input {
    min-width: 150px;
}

.operation-badge,
.status-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8em;
    font-weight: bold;
    text-transform: uppercase;
}

.operation-generate { background: #e3f2fd; color: #1976d2; }
.operation-regenerate { background: #fff3e0; color: #f57c00; }
.operation-bulk { background: #e8f5e8; color: #388e3c; }

.status-success { background: #e8f5e8; color: #2e7d32; }
.status-failed { background: #ffebee; color: #c62828; }

.ai-model {
    font-family: monospace;
    font-size: 0.8em;
    color: #666;
    background: #f5f5f5;
    padding: 2px 6px;
    border-radius: 3px;
}

.logs-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
}

.action-buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.logs-info {
    color: #666;
    font-size: 0.9em;
}

.no-logs {
    text-align: center;
    padding: 40px 20px;
    color: #666;
}

/* Modal Styles */
.modal {
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
}

.modal-content {
    background-color: #fefefe;
    margin: 5% auto;
    padding: 0;
    border: 1px solid #888;
    width: 80%;
    max-width: 600px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.modal-header {
    padding: 15px 20px;
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    margin: 0;
}

.close {
    color: #aaa;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
}

.close:hover {
    color: #000;
}

.modal-body {
    padding: 20px;
}

#error-content {
    background: #f5f5f5;
    padding: 15px;
    border-radius: 5px;
    white-space: pre-wrap;
    font-family: monospace;
    font-size: 0.9em;
    max-height: 300px;
    overflow-y: auto;
}

@media (max-width: 768px) {
    .filter-row {
        flex-direction: column;
        align-items: stretch;
    }
    
    .filter-group select,
    .filter-group input {
        min-width: auto;
    }
    
    .logs-actions {
        flex-direction: column;
        align-items: stretch;
    }
    
    .action-buttons {
        justify-content: center;
    }
    
    .overview-stats {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>

<script>
jQuery(document).ready(function($) {
    // View error details
    $('.view-error').on('click', function() {
        var errorMessage = $(this).data('error');
        $('#error-content').text(errorMessage);
        $('#error-modal').show();
    });
    
    // Close modal
    $('.close').on('click', function() {
        $('#error-modal').hide();
    });
    
    // Close modal when clicking outside
    $(window).on('click', function(event) {
        if (event.target == $('#error-modal')[0]) {
            $('#error-modal').hide();
        }
    });
    
    // Export logs
    $('#export-logs').on('click', function() {
        var currentUrl = new URL(window.location);
        currentUrl.searchParams.set('export', 'csv');
        window.location.href = currentUrl.toString();
    });
    
    // Clear old logs
    $('#clear-old-logs').on('click', function() {
        if (confirm('This will permanently delete logs older than 90 days. Continue?')) {
            $.ajax({
                url: blogTakewayAjax.ajax_url,
                type: 'POST',
                data: {
                    action: 'clear_old_logs',
                    nonce: blogTakewayAjax.nonce
                },
                success: function(response) {
                    if (response.success) {
                        alert('Old logs cleared successfully!');
                        location.reload();
                    } else {
                        alert('Error: ' + response.data);
                    }
                },
                error: function() {
                    alert('Failed to clear old logs.');
                }
            });
        }
    });
    
    // Refresh logs
    $('#refresh-logs').on('click', function() {
        location.reload();
    });
    
    // Auto-refresh every 30 seconds if there are recent logs
    <?php if (!empty($logs) && strtotime($logs[0]->created_at) > strtotime('-5 minutes')): ?>
    setTimeout(function() {
        location.reload();
    }, 30000);
    <?php endif; ?>
});
</script>
