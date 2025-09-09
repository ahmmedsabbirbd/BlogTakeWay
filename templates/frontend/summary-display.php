<?php
if ( ! defined('ABSPATH') ) {
	exit;
}

// Get data from database
$database = new Blog_Summary_Database();
$summary_data = $database->get_summary(get_the_ID());

if ( ! $summary_data ) {
	return;
}

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

<!-- Article Content with Key Takeaways -->
<div class="article-content-container ast-post-format- ast-no-thumb single-layout-1">
    <!-- Key Takeaways Section -->
    <div class="key-takeaways-section">
        <div class="key-takeaways-header">
            <span class="key-takeaways-title"><?php esc_html_e('Key Takeaways', 'post-takeaways'); ?></span>
        </div>

        <div class="takeaways-content">
            <?php if ( ! empty($summary_data['takeaways']) ) : ?>
                <ul class="takeaways-list">
                    <?php foreach ( $summary_data['takeaways'] as $takeaway ) { ?>
                        <li><?php echo esc_html($takeaway); ?></li>
                    <?php } ?>
                </ul>
            <?php endif; ?>
        </div>
    </div>
</div>

<style>
/* First Div: Min Read Container - Main Article */
.min-read-container {
    width: 400px;
    min-width: 400px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 2rem;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
}
 

/* Sticky Sidebar State - Relative to Article Container */
.min-read-container.sticky-sidebar {
    position: sticky;
    top: 2rem;
    left: 2rem;
    width: 400px;
    min-width: 400px;
    height: fit-content;
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
    z-index: 100; 
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

/* Article Container - Make it relative for absolute positioning */
article.post-38, 
article.post, 
article.type-post, 
article.status-publish, 
article.format-standard, 
article.hentry, 
article.category-uncategorized, 
article.ast-article-single,
article.post-takeaways-enhanced {
    position: relative;
}

/* post-takeaways Wrapper */
.post-takeaways-wrapper {
    display: flex;
    gap: 2rem;
    align-items: flex-start;
    position: relative;
}

/* Min Read Container - Sidebar */
.min-read-container {
    flex: 0 0 400px;
    position: sticky;
    top: 2rem;
    height: fit-content;
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
}

/* Article Content Wrapper */
.article-content-wrapper {
    flex: 1;
    min-width: 0;
    padding: 2rem 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    transition: all 0.3s ease;
}

/* Second Div: Article Content Container */
.article-content-container {
    width: 100%;
    padding: 2rem 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    transition: all 0.3s ease;
}

/* Min Read Section */
.min-read-section {
    margin-bottom: 2rem;
}

.min-read-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 1rem 0;
}

.reading-progress {
    margin-top: 1rem;
}

.progress-bar {
    width: 100%;
    height: 4px;
    background: #e5e7eb;
    border-radius: 2px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: #6366f1;
    width: 0%;
    transition: width 0.3s ease;
    border-radius: 2px;
}

/* Table of Contents */
.toc-section {
    margin-top: 1.5rem;
}

.toc-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.toc-item {
    color: #4b5563;
    text-decoration: none;
    font-size: 0.9rem;
    transition: all 0.2s ease;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    line-height: 1.4;
    border-left: 3px solid transparent;
    display: block;
}

.toc-item:hover {
    color: #6366f1;
    background: #f8fafc;
    border-left-color: #6366f1;
}

.toc-item.active {
    color: #6366f1;
    background: #f0f4ff;
    border-left-color: #6366f1;
    font-weight: 500;
}

/* Main Content Area */
.blog-content-wrapper {
    flex: 1;
    min-width: 0;
}

/* Key Takeaways Section */
.key-takeaways-section {
    background: #F0F7FF;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 2rem;
}

.key-takeaways-header {
    display: flex;
    align-items: center;
    padding: 1.5rem 2rem;
    background: #ffffff;
    border-bottom: 1px solid #e5e7eb;
}

.key-takeaways-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1F2937;
}

.takeaways-content {
    padding: 0 2rem 2rem;
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
    padding-left: 1.5rem;
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

/* Responsive Design */
@media (max-width: 1024px) {
    .post-takeaways-wrapper {
        flex-direction: column;
        gap: 1.5rem;
    }
    
    .min-read-container {
        flex: none;
        position: relative;
        top: auto;
        width: 100%;
        max-height: none;
        margin: 1.5rem 0;
        padding: 1.5rem;
    }
    
    .article-content-wrapper {
        flex: none;
        width: 100%;
        padding: 1.5rem 0;
    }
}

@media (max-width: 768px) {
    .post-takeaways-wrapper {
        gap: 1rem;
    }
    
    .min-read-container {
        margin: 1rem 0;
        padding: 1rem;
    }
    
    .article-content-wrapper {
        padding: 1rem 0;
    }
    
    .min-read-title {
        font-size: 1.25rem;
    }
    
    .toc-item {
        padding: 0.5rem 0.75rem;
        font-size: 0.85rem;
    }
}

@media (max-width: 480px) {
    .min-read-container {
        margin: 0.5rem 0;
        padding: 1rem;
    }
    
    .article-content-wrapper {
        padding: 0.5rem 0;
    }
    
    .key-takeaways-header {
        padding: 1rem 1.5rem;
    }
    
    .takeaways-content {
        padding: 0 1.5rem 1.5rem;
    }
}

</style>

<script>
jQuery(document).ready(function($) {
    // Find the article element
    var articleElement = $('main');
    
    // If main element not found, check for .main-container
    if (articleElement.length === 0) {
        articleElement = $('.main-container');
    }
    
    if (articleElement.length > 0) {
        // Check if already processed to prevent infinite loops
        if (articleElement.hasClass('post-takeaways-enhanced') || articleElement.find('.post-takeaways-wrapper').length > 0) {
            return; // Already processed, exit
        }
        
        // Add post-takeaways plugin class to the article element
        articleElement.addClass('post-takeaways-enhanced');
        
        // Get all existing content
        var allContent = articleElement.html();
        
        // Find comments section and separate it properly
        var commentsSection = '';
        var articleContent = allContent;
        
        // Look for common comment selectors
        var commentSelectors = [
            '#comments', '.comments', '#respond', '.comment-respond',
            '.comments-area', '#commentform', '.comment-form'
        ];
        
        var tempDiv = $('<div>').html(allContent);
        var commentsFound = false;
        
        commentSelectors.forEach(function(selector) {
            var commentElement = tempDiv.find(selector);
            if (commentElement.length > 0 && !commentsFound) {
                // Get the entire comments section
                commentsSection = commentElement.prop('outerHTML');
                // Remove comments from article content using the exact HTML
                articleContent = allContent.replace(commentsSection, '');
                commentsFound = true;
            }
        });
        
        // Clean up any extra whitespace
        articleContent = articleContent.trim();
        
        // Create min-read-container HTML
        var minReadHTML = `
            <div class="min-read-container">
                <div class="min-read-section">
                    <h2 class="min-read-title"><?php echo esc_html($min_read); ?> Min Read</h2>
                    <div class="reading-progress">
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                    </div>
                </div>
                <?php if ( ! empty($headings) ) : ?>
                    <div class="toc-section">
                        <div class="toc-list">
                            <?php foreach ( $headings as $heading ) { ?>
                                <a href="#<?php echo esc_attr(sanitize_title(wp_strip_all_tags($heading))); ?>" class="toc-item">
                                    <?php echo esc_html(wp_strip_all_tags($heading)); ?>
                                </a>
                            <?php } ?>
                        </div>
                    </div>
                <?php endif; ?>
            </div>
        `;
        
        // Create wrapper div containing only min-read and article content (no comments)
        var wrapperHTML = `
            <div class="post-takeaways-wrapper">
                ${minReadHTML}
                <div class="article-content-wrapper">
                    ${articleContent}
                </div>
            </div>
            ${commentsSection}
        `;
        
        // Replace the content with the new wrapper structure
        articleElement.html(wrapperHTML);
    }

    // Add IDs to all headings in the content
    $('h1, h2, h3, h4, h5, h6').each(function() {
        var id = sanitizeTitle($(this).text());
        $(this).attr('id', id);
    });

    // Key Takeaways section is now always visible - no toggle needed

    // Sticky sidebar functionality - relative to article container
    var minReadContainer = $('.min-read-container');
    var articleContent = $('.article-content-container');
    var articleContainer = articleElement; // Use the already found article element
    var minReadOffset = 0;
    var articleOffset = 0;
    var isSticky = false;
    
    // Initialize offsets after min-read-container is created
    if (minReadContainer.length > 0) {
        minReadOffset = minReadContainer.offset().top;
        articleOffset = articleContainer.offset().top;
    }

    function handleStickySidebar() {
        var scrollTop = $(window).scrollTop();
        var relativeScrollTop = scrollTop - articleOffset;
        
        // Check if we should make it sticky (when scrolled past the min-read section within the article)
        if (relativeScrollTop > (minReadOffset - articleOffset) && !isSticky) {
            minReadContainer.addClass('sticky-sidebar');
            articleContent.addClass('sidebar-active');
            isSticky = true;
        }
        // Check if we should make it normal again (when scrolled back to top of article)
        // else if (relativeScrollTop <= (minReadOffset - articleOffset) && isSticky) {
        //     minReadContainer.removeClass('sticky-sidebar');
        //     articleContent.removeClass('sidebar-active');
        //     isSticky = false;
        // }
    }

    // Handle scroll events
    $(window).on('scroll', function() {
        handleStickySidebar();
        updateReadingProgress();
        updateActiveTOC();
    });

    // Handle window resize
    $(window).on('resize', function() {
        // if (!isSticky && minReadContainer.length > 0) {
        //     minReadOffset = minReadContainer.offset().top;
        //     articleOffset = articleContainer.offset().top;
        // }
    });

    // Smooth scroll for TOC links
    $('.toc-item').click(function(e) {
        e.preventDefault();
        var target = $(this).attr('href');
        $('html, body').animate({
            scrollTop: $(target).offset().top - 100
        }, 500);
    });

    // Reading progress functionality
    function updateReadingProgress() {
        var winHeight = $(window).height();
        var docHeight = $(document).height();
        var scrollTop = $(window).scrollTop();
        var scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
        
        $('.progress-fill').css('width', scrollPercent + '%');
    }

    // Active TOC highlighting
    function updateActiveTOC() {
        var scrollPos = $(window).scrollTop() + 150;
        
        $('.toc-item').each(function() {
            var target = $(this).attr('href');
            if (target) {
                var targetElement = $(target);
                if (targetElement.length) {
                    var targetTop = targetElement.offset().top;
                    var targetBottom = targetTop + targetElement.outerHeight();
                    
                    if (scrollPos >= targetTop && scrollPos < targetBottom) {
                        $('.toc-item').removeClass('active');
                        $(this).addClass('active');
                    }
                }
            }
        });
    }

    // Update progress and active TOC on scroll
    $(window).on('scroll', function() {
        updateReadingProgress();
        updateActiveTOC();
    });

    // Initial call
    updateReadingProgress();
    updateActiveTOC();

    // Helper function to sanitize titles for IDs
    function sanitizeTitle(text) {
        return text.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
});
</script>
