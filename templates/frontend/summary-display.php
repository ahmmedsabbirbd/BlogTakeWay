<?php
if (!defined('ABSPATH')) exit;

$summary = $args['summary'] ?? null;
$takeaways = $args['takeaways'] ?? null;
$position = $args['position'] ?? 'after_content';
$show_takeaways = $args['show_takeaways'] ?? true;

if (!$summary) return;
?>

<div class="blog-takeway-summary" data-position="<?php echo esc_attr($position); ?>">
    <div class="summary-container">
        <!-- Summary Section -->
        <div class="summary-section">
            <div class="summary-header">
                <h3 class="summary-title">
                    <span class="summary-icon">📝</span>
                    AI-Generated Summary
                </h3>
                <div class="summary-meta">
                    <span class="summary-model"><?php echo esc_html($summary['ai_model'] ?? 'AI'); ?></span>
                    <?php if ($summary['cache_expiry']): ?>
                        <span class="summary-cache">
                            <span class="cache-icon">⏰</span>
                            Cached until <?php echo esc_html(date('M j, Y', strtotime($summary['cache_expiry']))); ?>
                        </span>
                    <?php endif; ?>
                </div>
            </div>
            
            <div class="summary-content">
                <?php echo wp_kses_post($summary['summary']); ?>
            </div>
            
            <div class="summary-footer">
                <button type="button" class="summary-toggle" data-target="takeaways">
                    <span class="toggle-text">Show Key Takeaways</span>
                    <span class="toggle-icon">▼</span>
                </button>
            </div>
        </div>
        
        <!-- Takeaways Section -->
        <?php if ($show_takeaways && !empty($takeaways)): ?>
            <div class="takeaways-section" style="display: none;">
                <div class="takeaways-header">
                    <h4 class="takeaways-title">
                        <span class="takeaways-icon">🎯</span>
                        Key Takeaways
                    </h4>
                </div>
                
                <div class="takeaways-content">
                    <?php if (is_array($takeaways)): ?>
                        <ul class="takeaways-list">
                            <?php foreach ($takeaways as $takeaway): ?>
                                <li class="takeaway-item">
                                    <span class="takeaway-bullet">•</span>
                                    <span class="takeaway-text"><?php echo wp_kses_post($takeaway); ?></span>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                    <?php else: ?>
                        <div class="takeaways-text">
                            <?php echo wp_kses_post($takeaways); ?>
                        </div>
                    <?php endif; ?>
                </div>
                
                <div class="takeaways-footer">
                    <button type="button" class="summary-toggle" data-target="summary">
                        <span class="toggle-text">Show Summary</span>
                        <span class="toggle-icon">▲</span>
                    </button>
                </div>
            </div>
        <?php endif; ?>
    </div>
</div>

<style>
.blog-takeway-summary {
    margin: 30px 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.summary-container {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border: 1px solid #dee2e6;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.summary-container:hover {
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

.summary-section,
.takeaways-section {
    padding: 20px;
}

.summary-header,
.takeaways-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    flex-wrap: wrap;
    gap: 10px;
}

.summary-title,
.takeaways-title {
    margin: 0;
    font-size: 1.2em;
    font-weight: 600;
    color: #2c3e50;
    display: flex;
    align-items: center;
    gap: 8px;
}

.summary-icon,
.takeaways-icon {
    font-size: 1.1em;
}

.summary-meta {
    display: flex;
    gap: 15px;
    align-items: center;
    font-size: 0.85em;
    color: #6c757d;
}

.summary-model {
    background: #007bff;
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-weight: 500;
}

.summary-cache {
    display: flex;
    align-items: center;
    gap: 5px;
}

.cache-icon {
    font-size: 0.9em;
}

.summary-content,
.takeaways-content {
    line-height: 1.6;
    color: #495057;
    margin-bottom: 15px;
}

.takeaways-list {
    margin: 0;
    padding: 0;
    list-style: none;
}

.takeaway-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 12px;
    padding: 8px 0;
}

.takeaway-bullet {
    color: #007bff;
    font-weight: bold;
    font-size: 1.2em;
    margin-right: 12px;
    margin-top: 2px;
    flex-shrink: 0;
}

.takeaway-text {
    flex: 1;
    line-height: 1.5;
}

.summary-footer,
.takeaways-footer {
    border-top: 1px solid #dee2e6;
    padding-top: 15px;
    text-align: center;
}

.summary-toggle {
    background: none;
    border: 2px solid #007bff;
    color: #007bff;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 0.9em;
    font-weight: 500;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.summary-toggle:hover {
    background: #007bff;
    color: white;
    transform: translateY(-1px);
}

.toggle-icon {
    transition: transform 0.3s ease;
}

.summary-toggle[data-target="takeaways"]:hover .toggle-icon {
    transform: translateY(2px);
}

.summary-toggle[data-target="summary"]:hover .toggle-icon {
    transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 768px) {
    .summary-header,
    .takeaways-header {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .summary-meta {
        flex-direction: column;
        gap: 8px;
        align-items: flex-start;
    }
    
    .summary-container {
        margin: 20px 0;
    }
    
    .summary-section,
    .takeaways-section {
        padding: 15px;
    }
}

@media (max-width: 480px) {
    .summary-title,
    .takeaways-title {
        font-size: 1.1em;
    }
    
    .summary-content,
    .takeaways-content {
        font-size: 0.95em;
    }
    
    .summary-toggle {
        width: 100%;
        justify-content: center;
    }
}

/* Animation for section transitions */
.summary-section,
.takeaways-section {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.summary-section.hidden,
.takeaways-section.hidden {
    opacity: 0;
    transform: translateY(10px);
}

/* Print styles */
@media print {
    .blog-takeway-summary {
        break-inside: avoid;
        margin: 20px 0;
    }
    
    .summary-footer,
    .takeaways-footer {
        display: none;
    }
    
    .takeaways-section {
        display: block !important;
    }
}
</style>

<script>
jQuery(document).ready(function($) {
    $('.summary-toggle').on('click', function() {
        var target = $(this).data('target');
        var summarySection = $('.summary-section');
        var takeawaysSection = $('.takeaways-section');
        
        if (target === 'takeaways') {
            // Show takeaways, hide summary
            summarySection.addClass('hidden');
            setTimeout(function() {
                summarySection.hide();
                takeawaysSection.show().removeClass('hidden');
            }, 300);
            
            // Update button
            $(this).find('.toggle-text').text('Show Summary');
            $(this).find('.toggle-icon').text('▲');
            $(this).data('target', 'summary');
        } else {
            // Show summary, hide takeaways
            takeawaysSection.addClass('hidden');
            setTimeout(function() {
                takeawaysSection.hide();
                summarySection.show().removeClass('hidden');
            }, 300);
            
            // Update button
            $(this).find('.toggle-text').text('Show Key Takeaways');
            $(this).find('.toggle-icon').text('▼');
            $(this).data('target', 'takeaways');
        }
    });
    
    // Auto-hide summary after 10 seconds on mobile for better UX
    if (window.innerWidth <= 768) {
        setTimeout(function() {
            $('.summary-toggle[data-target="takeaways"]').click();
        }, 10000);
    }
});
</script>
