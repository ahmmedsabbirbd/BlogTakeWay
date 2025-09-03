<?php
if (!defined('ABSPATH')) exit;

// Get data from database
$database = new Blog_Summary_Database();
$summary_data = $database->get_summary(get_the_ID());

if (!$summary_data) return;

// Data is already decoded in get_summary()
$takeaways = $summary_data['takeaways'];
$min_read_list = json_decode($summary_data['min_read_list'], true);
?>

<div class="blog-takeway-wrapper">
    <!-- Left Side - Min Read & TOC -->
    <div class="min-read-section">
        <h2 class="min-read-title"><?php echo esc_html($min_read_list['min_read']); ?> Min Read</h2>
        
        <?php if (!empty($min_read_list['list_with_connection_with_section'])): ?>
            <div class="toc-list">
                <?php foreach ($min_read_list['list_with_connection_with_section'] as $section): ?>
                    <a href="#<?php echo sanitize_title($section); ?>" class="toc-item">
                        <?php echo esc_html($section); ?>
                    </a>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>

    <!-- Right Side - Key Takeaways -->
    <div class="key-takeaways-section">
        <div class="key-takeaways-header">
            <span class="star-icon">✨</span>
            <h2>Key Takeaways</h2>
        </div>

        <?php if (!empty($takeaways)): ?>
            <ul class="takeaways-list">
                <?php foreach ($takeaways as $takeaway): ?>
                    <li><?php echo esc_html($takeaway); ?></li>
                <?php endforeach; ?>
            </ul>
        <?php endif; ?>

        <!-- Share Section -->
        <div class="share-section">
            <span>Share</span>
            <div class="share-buttons">
                <button class="share-btn linkedin">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </button>
                <button class="share-btn twitter">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                </button>
                <button class="share-btn facebook">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </button>
            </div>
        </div>
    </div>
</div>

<style>
.blog-takeway-wrapper {
    display: flex;
    gap: 40px;
    margin: 40px 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Left Side Styles */
.min-read-section {
    flex: 0 0 250px;
}

.min-read-title {
    font-size: 20px;
    font-weight: 600;
    color: #111827;
    margin: 0 0 20px 0;
    padding-bottom: 10px;
    border-bottom: 2px solid #6366f1;
}

.toc-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.toc-item {
    color: #4B5563;
    text-decoration: none;
    font-size: 15px;
    line-height: 1.5;
    transition: color 0.2s;
}

.toc-item:hover {
    color: #6366f1;
}

/* Right Side Styles */
.key-takeaways-section {
    flex: 1;
    background: #F0F7FF;
    border-radius: 12px;
    padding: 32px;
}

.key-takeaways-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
}

.star-icon {
    font-size: 24px;
}

.key-takeaways-header h2 {
    margin: 0;
    font-size: 24px;
    color: #111827;
}

.takeaways-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.takeaways-list li {
    position: relative;
    padding-left: 24px;
    color: #374151;
    line-height: 1.6;
    font-size: 15px;
}

.takeaways-list li::before {
    content: "•";
    position: absolute;
    left: 8px;
    color: #6366f1;
    font-weight: bold;
}

/* Share Section */
.share-section {
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid #E5E7EB;
    display: flex;
    align-items: center;
    gap: 16px;
}

.share-section span {
    font-size: 15px;
    color: #4B5563;
    font-weight: 500;
}

.share-buttons {
    display: flex;
    gap: 12px;
}

.share-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: #F3F4F6;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
}

.share-btn:hover {
    background: #E5E7EB;
}

.share-btn svg {
    width: 20px;
    height: 20px;
    color: #4B5563;
}

/* Responsive Design */
@media (max-width: 768px) {
    .blog-takeway-wrapper {
        flex-direction: column;
        gap: 24px;
    }

    .min-read-section {
        flex: none;
    }

    .key-takeaways-section {
        padding: 24px;
    }

    .share-section {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }
}
</style>

<script>
jQuery(document).ready(function($) {
    // Share functionality
    $('.share-btn.linkedin').click(function() {
        window.open('https://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(window.location.href), '_blank');
    });
    
    $('.share-btn.twitter').click(function() {
        window.open('https://twitter.com/intent/tweet?url=' + encodeURIComponent(window.location.href), '_blank');
    });
    
    $('.share-btn.facebook').click(function() {
        window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href), '_blank');
    });

    // Smooth scroll for TOC
    $('.toc-item').click(function(e) {
        e.preventDefault();
        var target = $(this).attr('href');
        $('html, body').animate({
            scrollTop: $(target).offset().top - 100
        }, 500);
    });
});
</script>