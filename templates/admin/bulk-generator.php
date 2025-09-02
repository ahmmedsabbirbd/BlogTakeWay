<?php
if (!defined('ABSPATH')) exit;
?>

<div class="wrap">
    <h1 class="wp-heading-inline">Bulk Summary Generator</h1>
    
    <div class="blog-takeway-bulk-generator">
        <!-- Posts list -->
        <div class="posts-section">
            <h2>All Posts</h2>
            <p>Select any posts to (re)generate AI summaries and takeaways. Status shows whether a summary already exists.</p>
            
            <?php if (!empty($posts)): ?>
                <div class="posts-controls">
                    <button type="button" class="button" id="select-all">Select All</button>
                    <button type="button" class="button" id="deselect-all">Deselect All</button>
                    <button type="button" class="button button-primary" id="generate-selected">
                        🚀 Generate Summaries for Selected Posts
                    </button>
                </div>
                
                <div class="posts-list">
                    <?php foreach ($posts as $post): ?>
                        <?php 
                            $has_summary = (bool) get_post_meta($post->ID, '_blog_takeway_summary', true);
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
                                    <a href="<?php echo get_edit_post_link($post->ID); ?>" target="_blank">
                                        <?php echo esc_html($post->post_title); ?>
                                    </a>
                                </h3>
                                <div class="post-meta">
                                    <span class="post-date"><?php echo get_the_date('', $post->ID); ?></span>
                                    <span class="post-status"><?php echo esc_html($post->post_status); ?></span>
                                    <span class="word-count"><?php echo str_word_count(strip_tags($post->post_content)); ?> words</span>
                                    <span class="summary-status <?php echo esc_attr($status_class); ?>"><?php echo esc_html($status_text); ?></span>
                                </div>
                                <div class="post-excerpt">
                                    <?php echo esc_html(wp_trim_words($post->post_content, 30)); ?>
                                </div>
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
                <div class="result-item error">
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
.blog-takeway-bulk-generator {
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
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.posts-list {
    max-height: 500px;
    overflow-y: auto;
    border: 1px solid #e5e5e5;
    border-radius: 5px;
}

.post-item {
    display: flex;
    align-items: flex-start;
    padding: 15px;
    border-bottom: 1px solid #f0f0f0;
    transition: background-color 0.2s;
}

.post-item:hover {
    background-color: #f9f9f9;
}

.post-item:last-child {
    border-bottom: none;
}

.post-checkbox {
    display: flex;
    align-items: center;
    margin-right: 15px;
    margin-top: 5px;
}

.post-checkbox input[type="checkbox"] {
    margin: 0;
}

.post-info {
    flex: 1;
}

.post-title {
    margin: 0 0 8px 0;
    font-size: 1.1em;
}

.post-title a {
    text-decoration: none;
    color: #0073aa;
}

.post-title a:hover {
    text-decoration: underline;
}

.post-meta {
    display: flex;
    gap: 15px;
    margin-bottom: 8px;
    font-size: 0.9em;
    color: #666;
}

.summary-status {
    padding: 2px 8px;
    border-radius: 999px;
    font-weight: 600;
    font-size: 0.8em;
}
.summary-status.has-summary {
    background: #e6f4ea;
    color: #1e7e34;
    border: 1px solid #c7ebd1;
}
.summary-status.missing-summary {
    background: #fff4e5;
    color: #9a5d00;
    border: 1px solid #ffe1b8;
}

.post-excerpt {
    color: #666;
    font-size: 0.9em;
    line-height: 1.4;
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
    
    // Select all posts
    $('#select-all').on('click', function() {
        $('.post-selector').prop('checked', true);
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
        
        if (confirm('Generate summaries for ' + selectedIds.length + ' selected posts? This may take some time and incur API costs.')) {
            startBulkGeneration(selectedIds);
        }
    });
    
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
            url: blogTakewayAjax.ajax_url,
            type: 'POST',
            data: {
                action: 'bulk_generate_summaries',
                nonce: blogTakewayAjax.nonce,
                post_ids: postIds
            },
            success: function(response) {
                if (response.success) {
                    var data = response.data || {};
                    $('#progress-status').text('Completed. Success: ' + (data.success || 0) + ', Failed: ' + (data.failed || 0));
                    $('.progress-fill').css('width', '100%');
                    $('#progress-current').text(postIds.length);
                    showResults(postIds.length, data.success || 0, data.failed || 0);
                    // Update status pills for immediate feedback
                    if (Array.isArray(data.success_ids)) {
                        data.success_ids.forEach(function(id){
                            var meta = $('.post-selector[value="' + id + '"]').closest('.post-item').find('.summary-status');
                            meta.removeClass('missing-summary').addClass('has-summary').text('Has Summary');
                        });
                    }
                } else {
                    $('#progress-status').text('Error: ' + response.data);
                    button.prop('disabled', false);
                }
            },
            error: function() {
                $('#progress-status').text('Failed to schedule bulk generation.');
                button.prop('disabled', false);
            }
        });
    }
    
    // Show results
    function showResults(total, success, errors) {
        $('.generation-progress').hide();
        $('.generation-results').show();
        $('#generate-bulk').prop('disabled', false);
        
        $('#success-count').text(success);
        $('#error-count').text(errors);
        
        var details = '<p>Bulk generation has been scheduled. You can monitor progress in the <a href="' + 
                     blogTakewayAjax.rest_url.replace('/wp-json/', '/wp-admin/admin.php?page=blog-takeway-logs') + '">Generation Logs</a> page.</p>';
        $('#results-details').html(details);
    }
    
    // Initialize
    updateSelectionCount();
});
</script>
