<?php
if (!defined('ABSPATH')) exit;

// Get data from database
$database = new Blog_Summary_Database();
$summary_data = $database->get_summary(get_the_ID());

if (!$summary_data) return;

// Get min_read from database
$min_read_list = json_decode($summary_data['min_read_list'], true);
$min_read = $min_read_list['min_read'] ?? '5';

// Get current post content
$post = get_post();
$content = $post->post_content;

// Extract all headings from content
preg_match_all('/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i', $content, $matches);
$headings = $matches[1] ?? [];
?>

<div class="blog-takeway-wrapper">
    <!-- Left Side - Min Read & TOC -->
    <div class="min-read-section">
        <h2 class="min-read-title"><?php echo esc_html($min_read); ?> Min Read</h2>
        
        <?php if (!empty($headings)): ?>
            <div class="toc-list">
                <?php foreach ($headings as $heading): ?>
                    <a href="#<?php echo sanitize_title(strip_tags($heading)); ?>" class="toc-item">
                        <?php echo esc_html(strip_tags($heading)); ?>
                    </a>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>

    <!-- Right Side - Key Takeaways -->
    <div class="key-takeaways-section">
        <div class="key-takeaways-header" id="toggleTakeaways">
            <span class="plus-icon">+</span>
            <span class="key-takeaways-title">Key Takeaways</span>
            <span class="arrow-icon">▼</span>
        </div>

        <div class="takeaways-content" style="display: none;">
            <?php if (!empty($summary_data['takeaways'])): ?>
                <ul class="takeaways-list">
                    <?php foreach ($summary_data['takeaways'] as $takeaway): ?>
                        <li><?php echo esc_html($takeaway); ?></li>
                    <?php endforeach; ?>
                </ul>
            <?php endif; ?>
        </div>
    </div>
</div>

<style>
.blog-takeway-wrapper {
    display: flex;
    gap: 2rem;
    margin: 2rem 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Left Side Styles */
.min-read-section {
    flex: 0 0 250px;
}

.min-read-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 1rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #6366f1;
}

.toc-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.toc-item {
    color: #4b5563;
    text-decoration: none;
    font-size: 0.95rem;
    transition: color 0.2s;
    padding: 0.25rem 0;
    line-height: 1.4;
}

.toc-item:hover {
    color: #6366f1;
}

/* Right Side Styles */
.key-takeaways-section {
    flex: 1;
    background: #F0F7FF;
    border-radius: 8px;
    overflow: hidden;
}

.key-takeaways-header {
    display: flex;
    align-items: center;
    padding: 1rem 1.5rem;
    cursor: pointer;
    user-select: none;
    gap: 1rem;
}

.plus-icon {
    color: #4B5563;
    font-size: 1.2rem;
    font-weight: bold;
}

.key-takeaways-title {
    flex: 1;
    font-size: 1rem;
    font-weight: 600;
    color: #1F2937;
}

.arrow-icon {
    color: #4B5563;
    font-size: 0.8rem;
    transition: transform 0.3s ease;
}

.arrow-icon.open {
    transform: rotate(180deg);
}

.takeaways-content {
    padding: 0 1.5rem 1.5rem;
}

.takeaways-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.takeaways-list li {
    position: relative;
    padding-left: 1.25rem;
    color: #374151;
    line-height: 1.6;
    font-size: 0.95rem;
}

.takeaways-list li::before {
    content: "•";
    position: absolute;
    left: 0;
    color: #6366f1;
    font-weight: bold;
}

@media (max-width: 768px) {
    .blog-takeway-wrapper {
        flex-direction: column;
        gap: 1.5rem;
    }

    .min-read-section {
        flex: none;
    }

    .key-takeaways-section {
        padding: 1rem;
    }
}
</style>

<script>
jQuery(document).ready(function($) {
    // Add IDs to all headings in the content
    $('h1, h2, h3, h4, h5, h6').each(function() {
        var id = sanitizeTitle($(this).text());
        $(this).attr('id', id);
    });

    // Toggle takeaways section
    $('#toggleTakeaways').click(function() {
        var content = $('.takeaways-content');
        var arrow = $('.arrow-icon');
        var plus = $('.plus-icon');
        
        content.slideToggle(300);
        arrow.toggleClass('open');
        plus.text(plus.text() === '+' ? '-' : '+');
    });

    // Smooth scroll for TOC links
    $('.toc-item').click(function(e) {
        e.preventDefault();
        var target = $(this).attr('href');
        $('html, body').animate({
            scrollTop: $(target).offset().top - 100
        }, 500);
    });

    // Helper function to sanitize titles for IDs
    function sanitizeTitle(text) {
        return text.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
});
</script>