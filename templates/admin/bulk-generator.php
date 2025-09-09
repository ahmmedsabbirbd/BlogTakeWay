<?php
if (!defined('ABSPATH')) exit;
?>

<div class="wrap">
    <h1 class="wp-heading-inline">Bulk Summary Generator</h1>
    
    <div class="post-takeaways-bulk-generator">
        <!-- Posts list -->
        <div class="posts-section">
            <h2><?php esc_html_e('All Posts', 'post-takeaways'); ?></h2>
            <p><?php esc_html_e('Select any posts to (re)generate AI summaries and takeaways. Status shows whether a summary already exists.', 'post-takeaways'); ?></p>
            
            <?php if (!empty($posts)): ?>
                <div class="posts-controls">
                    <div class="controls-left">
                        <button type="button" class="button" id="select-all"><?php esc_html_e('Select All', 'post-takeaways'); ?></button>
                        <button type="button" class="button" id="deselect-all"><?php esc_html_e('Deselect All', 'post-takeaways'); ?></button>
                        <button type="button" class="button button-primary" id="generate-selected">
                            🚀 <?php esc_html_e('Generate Summaries', 'post-takeaways'); ?>
                        </button>
                    </div>
                    <div class="controls-right">
                        <select id="filter-summary" class="filter-select">
                            <option value="all"><?php esc_html_e('All Posts', 'post-takeaways'); ?></option>
                            <option value="with-summary"><?php esc_html_e('With Summary', 'post-takeaways'); ?></option>
                            <option value="without-summary"><?php esc_html_e('Without Summary', 'post-takeaways'); ?></option>
                        </select>
                        <select id="sort-posts" class="filter-select">
                            <option value="title-asc"><?php esc_html_e('Title (A-Z)', 'post-takeaways'); ?></option>
                            <option value="title-desc"><?php esc_html_e('Title (Z-A)', 'post-takeaways'); ?></option>
                            <option value="date-desc"><?php esc_html_e('Newest First', 'post-takeaways'); ?></option>
                            <option value="date-asc"><?php esc_html_e('Oldest First', 'post-takeaways'); ?></option>
                        </select>
                    </div>
                </div>
                
                <div class="posts-list">
                    <?php foreach ($posts as $post): ?>
                        <?php 
                            global $wpdb;
                            $has_summary = $wpdb->get_var($wpdb->prepare(
                                "SELECT COUNT(*) FROM {$wpdb->prefix}blog_summaries WHERE post_id = %d AND status = 'published'",
                                $post->ID
                            ));
                            $status_class = $has_summary ? 'has-summary' : 'missing-summary';
                            $status_text  = $has_summary ? 'Has Summary' : 'Missing Summary';
                        ?>
                        <div class="post-item">
                            <label class="post-checkbox">
                                <input type="checkbox" name="selected_posts[]" value="<?php echo esc_attr($post->ID); ?>" class="post-selector">
                                <span class="checkmark"></span>
                            </label>
                            <div class="post-info">
                                <h3 class="post-title">
                                    <a href="<?php echo esc_url(get_edit_post_link($post->ID)); ?>" target="_blank">
                                        <?php echo esc_html($post->post_title); ?>
                                    </a>
                                    <span class="summary-status <?php echo esc_attr($status_class); ?>"><?php echo esc_html($status_text); ?></span>
                                </h3>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
                
                <div class="bulk-actions">
                    <div class="selection-info">
                        <span id="selected-count">0</span> posts selected
                    </div>
                    <button type="button" class="button button-primary button-large" id="generate-bulk" disabled>
                        🚀 Generate Summaries (<span id="bulk-count">0</span>)
                    </button>
                </div>
                
            <?php else: ?>
                <div class="no-posts">
                    <p>🎉 All published posts already have summaries!</p>
                    <p>You can manually edit existing summaries or regenerate them from individual post edit pages.</p>
                </div>
            <?php endif; ?>
        </div>
        
        <!-- Generation Progress -->
        <div class="generation-progress" style="display: none;">
            <h2>Generation Progress</h2>
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="progress-text">
                <span id="progress-current">0</span> of <span id="progress-total">0</span> completed
            </div>
            <div class="progress-status" id="progress-status">Initializing...</div>
        </div>
        
        <!-- Generation Results -->
        <div class="generation-results" style="display: none;">
            <h2>Generation Results</h2>
            <div class="results-summary">
                <div class="result-item success">
                    <span class="result-icon">✅</span>
                    <span class="result-text">Successfully generated: <span id="success-count">0</span></span>
                </div>
                <div class="result-item error" style="display: none;">
                    <span class="result-icon">❌</span>
                    <span class="result-text">Failed: <span id="error-count">0</span></span>
                </div>
            </div>
            <div class="results-details" id="results-details"></div>
        </div>
        
        <!-- Help Section -->
        <div class="help-section">
            <h2>💡 Tips for Bulk Generation</h2>
            <div class="tips-grid">
                <div class="tip-card">
                    <h3>⏰ Timing</h3>
                    <p>Run bulk generation during off-peak hours to avoid rate limiting and reduce costs.</p>
                </div>
                <div class="tip-card">
                    <h3>📊 Batch Size</h3>
                    <p>Process posts in smaller batches (10-20) for better reliability and easier error tracking.</p>
                </div>
                <div class="tip-card">
                    <h3>💰 Cost Management</h3>
                    <p>Monitor your OpenAI API usage and set spending limits to control costs.</p>
                </div>
                <div class="tip-card">
                    <h3>🔍 Quality Check</h3>
                    <p>Review generated summaries and adjust settings if needed for better results.</p>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
.post-takeaways-bulk-generator {
    margin-top: 20px;
}

.posts-section,
.generation-progress,
.generation-results,
.help-section {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 30px;
}

.posts-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    gap: 20px;
}

.controls-left {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.controls-right {
    display: flex;
    gap: 10px;
}

.filter-select {
    min-width: 150px;
    height: 30px;
    border-radius: 4px;
    border: 1px solid #ddd;
    padding: 0 8px;
    font-size: 13px;
    background-color: #fff;
}

.posts-list {
    max-height: 600px;
    overflow-y: auto;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.post-item {
    display: flex;
    align-items: center;
    padding: 12px 15px;
    border-bottom: 1px solid #f0f0f0;
    transition: all 0.2s ease;
}

.post-item:hover {
    background-color: #f8f9fa;
}

.post-item:last-child {
    border-bottom: none;
}

.post-checkbox {
    display: flex;
    align-items: center;
    margin-right: 12px;
}

.post-checkbox input[type="checkbox"] {
    margin: 0;
    width: 16px;
    height: 16px;
    border-radius: 3px;
    border-color: #ddd;
}

.post-info {
    flex: 1;
    display: flex;
    align-items: center;
}

.post-title {
    margin: 0;
    font-size: 14px;
    line-height: 1.4;
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
}

.post-title a {
    text-decoration: none;
    color: #1e1e1e;
    flex: 1;
}

.post-title a:hover {
    color: #2271b1;
}

.summary-status {
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: 500;
    font-size: 12px;
    white-space: nowrap;
}

.summary-status.has-summary {
    background: #e8f5e9;
    color: #1b5e20;
}

.summary-status.missing-summary {
    background: #fff3e0;
    color: #e65100;
}

.bulk-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e5e5e5;
}

.selection-info {
    font-weight: bold;
    color: #0073aa;
}

.progress-bar {
    width: 100%;
    height: 20px;
    background-color: #f0f0f0;
    border-radius: 10px;
    overflow: hidden;
    margin: 15px 0;
}

.progress-fill {
    height: 100%;
    background-color: #0073aa;
    width: 0%;
    transition: width 0.3s ease;
}

.progress-text {
    text-align: center;
    font-weight: bold;
    margin-bottom: 10px;
}

.progress-status {
    text-align: center;
    color: #666;
}

.results-summary {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
}

.result-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 15px;
    border-radius: 5px;
    font-weight: bold;
}

.result-item.success {
    background-color: #d4edda;
    color: #155724;
}

.result-item.error {
    background-color: #f8d7da;
    color: #721c24;
}

.result-icon {
    font-size: 1.2em;
}

.results-info {
    margin-top: 15px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 6px;
    border: 1px solid #e9ecef;
}

.results-info p {
    margin: 8px 0;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 14px;
}

.results-info .success-info {
    background: #e8f5e9;
    color: #1b5e20;
}

.results-info .error-info {
    background: #ffebee;
    color: #c62828;
}

.tips-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.tip-card {
    background: #f9f9f9;
    border: 1px solid #e5e5e5;
    border-radius: 5px;
    padding: 15px;
}

.tip-card h3 {
    margin-top: 0;
    color: #0073aa;
}

.no-posts {
    text-align: center;
    padding: 40px 20px;
    color: #666;
}

.no-posts p:first-child {
    font-size: 1.2em;
    color: #0073aa;
    margin-bottom: 10px;
}

@media (max-width: 768px) {
    .posts-controls {
        flex-direction: column;
    }
    
    .bulk-actions {
        flex-direction: column;
        gap: 15px;
        text-align: center;
    }
    
    .results-summary {
        flex-direction: column;
    }
    
    .tips-grid {
        grid-template-columns: 1fr;
    }
}

/* API Status Messages */
.api-status-success,
.api-status-warning,
.api-status-error {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px 20px;
    margin-bottom: 20px;
    text-align: center;
    font-weight: 500;
}

.api-status-success {
    background: #e8f5e9;
    border-color: #4caf50;
    color: #1b5e20;
}

.api-status-warning {
    background: #fff3e0;
    border-color: #ff9800;
    color: #e65100;
}

.api-status-error {
    background: #ffebee;
    border-color: #f44336;
    color: #c62828;
}

.api-status-warning a {
    color: #e65100;
    text-decoration: underline;
    font-weight: bold;
}

.api-status-warning a:hover {
    color: #bf360c;
}
</style>

<script>
jQuery(document).ready(function($) {
    var selectedPosts = [];
    var totalPosts = <?php echo count($posts); ?>;
    
    // Update selection count
    function updateSelectionCount() {
        var count = $('.post-selector:checked').length;
        $('#selected-count').text(count);
        $('#bulk-count').text(count);
        $('#generate-bulk').prop('disabled', count === 0);
    }
    
    // Filter posts
    function filterPosts() {
        var summaryFilter = $('#filter-summary').val();
        
        $('.post-item').each(function() {
            var $item = $(this);
            var hasSummary = $item.find('.summary-status').hasClass('has-summary');
            
            if (summaryFilter === 'all' ||
                (summaryFilter === 'with-summary' && hasSummary) ||
                (summaryFilter === 'without-summary' && !hasSummary)) {
                $item.show();
            } else {
                $item.hide();
            }
        });
    }
    
    // Sort posts
    function sortPosts() {
        var sortValue = $('#sort-posts').val();
        var $postsList = $('.posts-list');
        var $posts = $('.post-item').get();
        
        $posts.sort(function(a, b) {
            var $titleA = $(a).find('.post-title a').text().toLowerCase();
            var $titleB = $(b).find('.post-title a').text().toLowerCase();
            
            if (sortValue === 'title-asc') {
                return $titleA.localeCompare($titleB);
            } else if (sortValue === 'title-desc') {
                return $titleB.localeCompare($titleA);
            }
            // Add date sorting if needed
            return 0;
        });
        
        $.each($posts, function(idx, item) {
            $postsList.append(item);
        });
    }
    
    // Event handlers
    $('#filter-summary').on('change', filterPosts);
    $('#sort-posts').on('change', sortPosts);
    
    // Select all posts
    $('#select-all').on('click', function() {
        $('.post-selector:visible').prop('checked', true);
        updateSelectionCount();
    });
    
    // Deselect all posts
    $('#deselect-all').on('click', function() {
        $('.post-selector').prop('checked', false);
        updateSelectionCount();
    });
    
    // Update count when checkboxes change
    $('.post-selector').on('change', updateSelectionCount);
    
    // Generate summaries for selected posts
    $('#generate-bulk').on('click', function() {
        var selectedIds = [];
        $('.post-selector:checked').each(function() {
            selectedIds.push($(this).val());
        });
        
        if (selectedIds.length === 0) {
            alert('Please select at least one post.');
            return;
        }
        
        // Check if API key is configured first
        $.ajax({
            url: post-takeawaysAjax.ajax_url,
            type: 'POST',
            data: {
                action: 'test_api_connection',
                nonce: post-takeawaysAjax.nonce
            },
            success: function(response) {
                if (response.success) {
                    // API is configured, proceed with bulk generation
                    proceedWithBulkGeneration(selectedIds);
                } else {
                    alert('❌ API Key Not Configured!\n\nPlease configure your OpenAI API key in the Post Takeaways settings before generating summaries.');
                }
            },
            error: function() {
                alert('❌ Cannot verify API configuration!\n\nPlease check your Post Takeaways settings and ensure the API key is properly configured.');
            }
        });
    });
    
    // Proceed with bulk generation after API check
    function proceedWithBulkGeneration(selectedIds) {
        var confirmMsg = 'Are you sure you want to generate summaries for ' + selectedIds.length + ' selected posts?\n\n';
        confirmMsg += '⚠️ Important Notes:\n';
        confirmMsg += '1. This will use your OpenAI API credits\n';
        confirmMsg += '2. Each post will cost tokens based on its length\n';
        confirmMsg += '3. The process cannot be interrupted once started\n\n';
        confirmMsg += 'Do you want to continue?';
        
        if (confirm(confirmMsg)) {
            startBulkGeneration(selectedIds);
        }
    }
    
    // Start bulk generation
    function startBulkGeneration(postIds) {
        var button = $('#generate-bulk');
        var progressSection = $('.generation-progress');
        var resultsSection = $('.generation-results');
        
        // Show progress section
        progressSection.show();
        resultsSection.hide();
        button.prop('disabled', true);
        
        // Initialize progress
        $('#progress-total').text(postIds.length);
        $('#progress-current').text('0');
        $('.progress-fill').css('width', '0%');
        $('#progress-status').text('Starting generation...');
        
        // Send bulk generation request
        $.ajax({
            url: post-takeawaysAjax.ajax_url,
            type: 'POST',
            data: {
                action: 'bulk_generate_summaries',
                nonce: post-takeawaysAjax.nonce,
                post_ids: postIds
            },
            success: function(response) {
                if (response.success) {
                    var data = response.data || {};
                    var successCount = parseInt(data.success) || 0;
                    var failedCount = parseInt(data.failed) || 0;
                    var totalProcessed = successCount + failedCount;
                    
                    // Update progress status - only show failed count if there are failures
                    if (failedCount > 0) {
                        $('#progress-status').text('Completed. Success: ' + successCount + ', Failed: ' + failedCount);
                    } else {
                        $('#progress-status').text('Completed. Success: ' + successCount);
                    }
                    $('.progress-fill').css('width', '100%');
                    $('#progress-current').text(totalProcessed);
                    showResults(postIds.length, successCount, failedCount);
                    
                    // Update status pills for immediate feedback
                    if (Array.isArray(data.success_ids)) {
                        data.success_ids.forEach(function(id){
                            var meta = $('.post-selector[value="' + id + '"]').closest('.post-item').find('.summary-status');
                            meta.removeClass('missing-summary').addClass('has-summary').text('Has Summary');
                        });
                    }
                    
                    // Update status pills for failed items if available
                    if (Array.isArray(data.failed_ids)) {
                        data.failed_ids.forEach(function(id){
                            var meta = $('.post-selector[value="' + id + '"]').closest('.post-item').find('.summary-status');
                            meta.removeClass('has-summary').addClass('missing-summary').text('Generation Failed');
                        });
                    }
                } else {
                    var errorMsg = response.data || 'Unknown error occurred';
                    $('#progress-status').text('Error: ' + errorMsg);
                    showResults(postIds.length, 0, postIds.length);
                    button.prop('disabled', false);
                }
            },
            error: function(xhr, status, error) {
                var errorMsg = 'Failed to schedule bulk generation. ' + (error || 'Server error occurred.');
                $('#progress-status').text(errorMsg);
                showResults(postIds.length, 0, postIds.length);
                button.prop('disabled', false);
            }
        });
    }
    
    // Show results
    function showResults(total, success, failed) {
        $('.generation-progress').hide();
        
        // Ensure we have valid numbers
        success = parseInt(success) || 0;
        failed = parseInt(failed) || 0;
        
        $('#success-count').text(success);
        $('#error-count').text(failed);
        
        // Show/hide error result item based on failed count
        if (failed > 0) {
            $('.result-item.error').show();
        } else {
            $('.result-item.error').hide();
        }
        
        // Update the results details with more information
        var details = '<div class="results-info">';
        if (success > 0) {
            details += '<p class="success-info">✅ Successfully generated summaries for ' + success + ' posts.</p>';
        }
        if (failed > 0) {
            details += '<p class="error-info">❌ Failed to generate summaries for ' + failed + ' posts.</p>';
        }
        details += '</div>';
        
        $('#results-details').html(details);
        
        // Show generation results only if there are errors or if we want to show success info
        if (failed > 0 || success > 0) {
            $('.generation-results').show();
        } else {
            $('.generation-results').hide();
        }
        
        $('#generate-bulk').prop('disabled', false);
        
        // Update the UI to reflect the final state
        $('.progress-fill').css('width', '100%');
        $('#progress-current').text(total);
        
        // Update progress status - only show failed count if there are failures
        if (failed > 0) {
            $('#progress-status').text('Completed. Success: ' + success + ', Failed: ' + failed);
        } else {
            $('#progress-status').text('Completed. Success: ' + success);
        }
    }
    
    // Initialize
    updateSelectionCount();
});
</script>
