<?php
if (!defined('ABSPATH')) exit;

$post_id = get_the_ID();
$summary = get_post_meta($post_id, '_blog_takeway_summary', true);
$takeaways = get_post_meta($post_id, '_blog_takeway_takeaways', true);
$ai_model = get_post_meta($post_id, '_blog_takeway_ai_model', true);
$last_generated = get_post_meta($post_id, '_blog_takeway_last_generated', true);
$cache_expiry = get_post_meta($post_id, '_blog_takeway_cache_expiry', true);
?>

<div class="blog-takeway-meta-box">
    <!-- Summary Status -->
    <div class="summary-status">
        <?php if ($summary): ?>
            <div class="status-indicator success">
                <span class="status-icon">✅</span>
                <span class="status-text">Summary Available</span>
            </div>
            <?php if ($last_generated): ?>
                <div class="generation-info">
                    <small>Generated: <?php echo esc_html(date('M j, Y g:i A', strtotime($last_generated))); ?></small>
                    <?php if ($ai_model): ?>
                        <small>• Model: <?php echo esc_html($ai_model); ?></small>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
        <?php else: ?>
            <div class="status-indicator warning">
                <span class="status-icon">⚠️</span>
                <span class="status-text">No Summary Available</span>
            </div>
        <?php endif; ?>
    </div>
    
    <!-- Action Buttons -->
    <div class="action-buttons">
        <?php if (!$summary): ?>
            <button type="button" class="button button-primary" id="generate-summary">
                🚀 Generate AI Summary
            </button>
        <?php else: ?>
            <button type="button" class="button" id="regenerate-summary">
                🔄 Regenerate Summary
            </button>
            <button type="button" class="button" id="edit-summary">
                ✏️ Edit Summary
            </button>
        <?php endif; ?>
        <button type="button" class="button" id="clear-summary">
            🗑️ Clear Summary
        </button>
    </div>
    
    <!-- Summary Editor -->
    <div class="summary-editor" style="display: <?php echo $summary ? 'block' : 'none'; ?>;">
        <div class="editor-section">
            <label for="summary-content">
                <strong>Summary:</strong>
                <span class="char-count" id="summary-char-count">0</span> characters
            </label>
            <textarea id="summary-content" name="blog_takeway_summary" rows="6" 
                      placeholder="Enter or edit the AI-generated summary..."><?php echo esc_textarea($summary); ?></textarea>
        </div>
        
        <div class="editor-section">
            <label for="takeaways-content">
                <strong>Key Takeaways:</strong>
                <span class="char-count" id="takeaways-char-count">0</span> characters
            </label>
            <textarea id="takeaways-content" name="blog_takeway_takeaways" rows="4" 
                      placeholder="Enter or edit the key takeaways..."><?php echo esc_textarea($takeaways); ?></textarea>
            <p class="description">Enter one takeaway per line, or use bullet points for better formatting.</p>
        </div>
        
        <div class="editor-section">
            <label for="ai-model">
                <strong>AI Model Used:</strong>
            </label>
            <input type="text" id="ai-model" name="blog_takeway_ai_model" 
                   value="<?php echo esc_attr($ai_model); ?>" placeholder="e.g., gpt-4, gpt-3.5-turbo">
        </div>
        
        <div class="editor-section">
            <label for="cache-expiry">
                <strong>Cache Expiry:</strong>
            </label>
            <input type="datetime-local" id="cache-expiry" name="blog_takeway_cache_expiry" 
                   value="<?php echo esc_attr($cache_expiry ? date('Y-m-d\TH:i', strtotime($cache_expiry)) : ''); ?>">
            <p class="description">Leave empty for no expiry, or set a future date to cache the summary.</p>
        </div>
    </div>
    
    <!-- Generation Progress -->
    <div class="generation-progress" style="display: none;">
        <div class="progress-header">
            <h4>Generating Summary...</h4>
            <div class="progress-status" id="progress-status">Initializing...</div>
        </div>
        <div class="progress-bar">
            <div class="progress-fill"></div>
        </div>
        <div class="progress-details">
            <span id="progress-step">Preparing content...</span>
            <span id="progress-time">0s</span>
        </div>
    </div>
    
    <!-- Generation Results -->
    <div class="generation-results" style="display: none;">
        <div class="results-header">
            <h4>Generation Complete!</h4>
        </div>
        <div class="results-content" id="results-content"></div>
        <div class="results-actions">
            <button type="button" class="button button-primary" id="apply-results">Apply Results</button>
            <button type="button" class="button" id="discard-results">Discard</button>
        </div>
    </div>
    
    <!-- Help Section -->
    <div class="help-section">
        <h4>💡 Tips</h4>
        <ul>
            <li><strong>Auto-generation:</strong> Summaries are automatically generated when posts are published.</li>
            <li><strong>Manual editing:</strong> You can edit AI-generated content to match your style and tone.</li>
            <li><strong>Caching:</strong> Set cache expiry to avoid regenerating summaries for unchanged content.</li>
            <li><strong>Takeaways:</strong> Use bullet points or numbered lists for better readability.</li>
        </ul>
    </div>
</div>

<style>
.blog-takeway-meta-box {
    padding: 15px;
    background: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-top: 15px;
}

.summary-status {
    margin-bottom: 20px;
    padding: 15px;
    background: white;
    border-radius: 6px;
    border: 1px solid #e5e5e5;
}

.status-indicator {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

.status-indicator.success {
    color: #2e7d32;
}

.status-indicator.warning {
    color: #f57c00;
}

.status-icon {
    font-size: 1.2em;
}

.status-text {
    font-weight: bold;
}

.generation-info {
    color: #666;
    font-size: 0.9em;
}

.generation-info small {
    margin-right: 15px;
}

.action-buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.summary-editor {
    background: white;
    padding: 20px;
    border-radius: 6px;
    border: 1px solid #e5e5e5;
    margin-bottom: 20px;
}

.editor-section {
    margin-bottom: 20px;
}

.editor-section:last-child {
    margin-bottom: 0;
}

.editor-section label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: #333;
}

.char-count {
    float: right;
    font-weight: normal;
    color: #666;
    font-size: 0.9em;
}

.editor-section textarea,
.editor-section input[type="text"],
.editor-section input[type="datetime-local"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: inherit;
    font-size: 14px;
}

.editor-section textarea:focus,
.editor-section input:focus {
    border-color: #0073aa;
    outline: none;
    box-shadow: 0 0 0 1px #0073aa;
}

.editor-section .description {
    margin-top: 5px;
    color: #666;
    font-size: 0.9em;
    font-style: italic;
}

.generation-progress {
    background: white;
    padding: 20px;
    border-radius: 6px;
    border: 1px solid #e5e5e5;
    margin-bottom: 20px;
    text-align: center;
}

.progress-header h4 {
    margin: 0 0 15px 0;
    color: #0073aa;
}

.progress-status {
    color: #666;
    margin-bottom: 15px;
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

.progress-details {
    display: flex;
    justify-content: space-between;
    color: #666;
    font-size: 0.9em;
}

.generation-results {
    background: white;
    padding: 20px;
    border-radius: 6px;
    border: 1px solid #e5e5e5;
    margin-bottom: 20px;
}

.results-header h4 {
    margin: 0 0 15px 0;
    color: #2e7d32;
}

.results-content {
    margin-bottom: 20px;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 4px;
    border: 1px solid #e5e5e5;
}

.results-actions {
    display: flex;
    gap: 10px;
    justify-content: center;
}

.help-section {
    background: white;
    padding: 15px;
    border-radius: 6px;
    border: 1px solid #e5e5e5;
}

.help-section h4 {
    margin: 0 0 10px 0;
    color: #0073aa;
}

.help-section ul {
    margin: 0;
    padding-left: 20px;
}

.help-section li {
    margin-bottom: 8px;
    color: #555;
    line-height: 1.4;
}

.help-section li:last-child {
    margin-bottom: 0;
}

@media (max-width: 768px) {
    .action-buttons {
        flex-direction: column;
    }
    
    .action-buttons .button {
        width: 100%;
        text-align: center;
    }
    
    .progress-details {
        flex-direction: column;
        gap: 5px;
    }
}
</style>

<script>
jQuery(document).ready(function($) {
    var originalSummary = $('#summary-content').val();
    var originalTakeaways = $('#takeaways-content').val();
    var generationStartTime = 0;
    var progressInterval = null;
    
    // Character count updates
    function updateCharCount(textareaId, counterId) {
        var textarea = $('#' + textareaId);
        var counter = $('#' + counterId);
        
        textarea.on('input', function() {
            counter.text($(this).val().length);
        });
        
        // Initialize count
        counter.text(textarea.val().length);
    }
    
    updateCharCount('summary-content', 'summary-char-count');
    updateCharCount('takeaways-content', 'takeaways-char-count');
    
    // Generate summary
    $('#generate-summary, #regenerate-summary').on('click', function() {
        if (confirm('Generate AI summary for this post? This will use your OpenAI API credits.')) {
            startGeneration();
        }
    });
    
    // Edit summary
    $('#edit-summary').on('click', function() {
        $('.summary-editor').show();
        $(this).hide();
    });
    
    // Clear summary
    $('#clear-summary').on('click', function() {
        if (confirm('Clear the current summary and takeaways? This action cannot be undone.')) {
            clearSummary();
        }
    });
    
    // Apply results
    $('#apply-results').on('click', function() {
        applyResults();
    });
    
    // Discard results
    $('#discard-results').on('click', function() {
        discardResults();
    });
    
    // Start generation process
    function startGeneration() {
        var button = $('#generate-summary, #regenerate-summary');
        var progressSection = $('.generation-progress');
        var resultsSection = $('.generation-results');
        var editorSection = $('.summary-editor');
        
        // Show progress, hide other sections
        progressSection.show();
        resultsSection.hide();
        editorSection.hide();
        button.prop('disabled', true);
        
        // Initialize progress
        generationStartTime = Date.now();
        updateProgress('Preparing content...', 0);
        startProgressAnimation();
        
        // Send generation request
        $.ajax({
            url: blogTakewayAjax.ajax_url,
            type: 'POST',
            data: {
                action: 'generate_summary',
                nonce: blogTakewayAjax.nonce,
                post_id: <?php echo $post_id; ?>,
                regenerate: $('#regenerate-summary').length > 0
            },
            success: function(response) {
                if (response.success) {
                    updateProgress('Generation complete!', 100);
                    setTimeout(function() {
                        showResults(response.data);
                    }, 1000);
                } else {
                    updateProgress('Error: ' + response.data, 0);
                    setTimeout(function() {
                        resetGeneration();
                    }, 3000);
                }
            },
            error: function() {
                updateProgress('Failed to generate summary.', 0);
                setTimeout(function() {
                    resetGeneration();
                }, 3000);
            }
        });
    }
    
    // Update progress display
    function updateProgress(status, percentage) {
        $('#progress-status').text(status);
        $('#progress-step').text(status);
        $('.progress-fill').css('width', percentage + '%');
        
        var elapsed = Math.floor((Date.now() - generationStartTime) / 1000);
        $('#progress-time').text(elapsed + 's');
    }
    
    // Start progress animation
    function startProgressAnimation() {
        var steps = [
            { text: 'Analyzing content...', progress: 20 },
            { text: 'Generating summary...', progress: 50 },
            { text: 'Creating takeaways...', progress: 80 },
            { text: 'Finalizing...', progress: 95 }
        ];
        
        var currentStep = 0;
        progressInterval = setInterval(function() {
            if (currentStep < steps.length) {
                updateProgress(steps[currentStep].text, steps[currentStep].progress);
                currentStep++;
            }
        }, 2000);
    }
    
    // Show generation results
    function showResults(data) {
        clearInterval(progressInterval);
        
        $('.generation-progress').hide();
        $('.generation-results').show();
        
        var resultsHtml = '<div class="generated-summary">';
        resultsHtml += '<h5>Generated Summary:</h5>';
        resultsHtml += '<p>' + data.summary + '</p>';
        
        if (data.takeaways && data.takeaways.length > 0) {
            resultsHtml += '<h5>Key Takeaways:</h5>';
            resultsHtml += '<ul>';
            data.takeaways.forEach(function(takeaway) {
                resultsHtml += '<li>' + takeaway + '</li>';
            });
            resultsHtml += '</ul>';
        }
        
        resultsHtml += '</div>';
        
        $('#results-content').html(resultsHtml);
        
        // Store results for later application
        window.generatedResults = data;
    }
    
    // Apply generated results
    function applyResults() {
        if (window.generatedResults) {
            $('#summary-content').val(window.generatedResults.summary);
            $('#takeaways-content').val(window.generatedResults.takeaways.join('\n'));
            
            // Update character counts
            $('#summary-char-count').text(window.generatedResults.summary.length);
            $('#takeaways-char-count').text(window.generatedResults.takeaways.join('\n').length);
            
            // Show editor with new content
            $('.generation-results').hide();
            $('.summary-editor').show();
            
            // Reset button states
            $('#generate-summary').hide();
            $('#regenerate-summary').show();
            
            // Clear stored results
            delete window.generatedResults;
        }
    }
    
    // Discard generated results
    function discardResults() {
        $('.generation-results').hide();
        $('.summary-editor').show();
        
        // Reset button states
        $('#generate-summary').hide();
        $('#regenerate-summary').show();
        
        // Clear stored results
        delete window.generatedResults;
    }
    
    // Clear summary
    function clearSummary() {
        $('#summary-content').val('');
        $('#takeaways-content').val('');
        $('#ai-model').val('');
        $('#cache-expiry').val('');
        
        // Update character counts
        $('#summary-char-count').text('0');
        $('#takeaways-char-count').text('0');
        
        // Hide editor, show generate button
        $('.summary-editor').hide();
        $('#regenerate-summary').hide();
        $('#edit-summary').hide();
        $('#generate-summary').show();
        
        // Update status
        $('.status-indicator').removeClass('success').addClass('warning');
        $('.status-text').text('No Summary Available');
        $('.generation-info').remove();
    }
    
    // Reset generation state
    function resetGeneration() {
        $('.generation-progress').hide();
        $('.summary-editor').show();
        
        var button = $('#generate-summary, #regenerate-summary');
        button.prop('disabled', false);
        
        clearInterval(progressInterval);
    }
    
    // Auto-save on content change
    var saveTimeout;
    $('.summary-editor textarea, .summary-editor input').on('input', function() {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(function() {
            // Trigger WordPress auto-save
            if (typeof wp !== 'undefined' && wp.autosave) {
                wp.autosave.server.triggerSave();
            }
        }, 2000);
    });
});
</script>
