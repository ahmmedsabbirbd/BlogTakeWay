<?php
if ( ! defined('ABSPATH') ) {
	exit;
}
?>

<div class="wrap">
    <h1 class="wp-heading-inline">Post Takeaways Settings</h1>
    
    <div class="post-takeaways-settings">
        <form method="post" action="options.php">
            <?php
            settings_fields('post_takeaways_settings');
            do_settings_sections('post_takeaways_settings');
            submit_button('Save Settings');
            ?>
        </form>
        
        <!-- API Test Section -->
        <div class="api-test-section">
            <h2><?php esc_html_e('Test API Connection', 'post-takeaways'); ?></h2>
            <p><?php esc_html_e('Test your OpenAI API connection to ensure everything is working properly.', 'post-takeaways'); ?></p>
            <button type="button" class="button button-secondary" id="test-api-connection">
                🧪 <?php esc_html_e('Test API Connection', 'post-takeaways'); ?>
            </button>
            <div id="api-test-result"></div>
        </div>
        
        <!-- Usage Information -->
        <div class="usage-info">
            <h2><?php esc_html_e('Usage Information', 'post-takeaways'); ?></h2>
            <div class="info-grid">
                <div class="info-card">
                    <h3>📊 <?php esc_html_e('Token Usage', 'post-takeaways'); ?></h3>
                    <p><?php esc_html_e('Monitor your OpenAI API token usage to manage costs effectively.', 'post-takeaways'); ?></p>
                    <ul>
                        <li><strong><?php esc_html_e('Short summaries:', 'post-takeaways'); ?></strong> <?php esc_html_e('~50-75 words (200 tokens)', 'post-takeaways'); ?></li>
                        <li><strong><?php esc_html_e('Medium summaries:', 'post-takeaways'); ?></strong> <?php esc_html_e('~100-125 words (300 tokens)', 'post-takeaways'); ?></li>
                        <li><strong><?php esc_html_e('Long summaries:', 'post-takeaways'); ?></strong> <?php esc_html_e('~150-200 words (500 tokens)', 'post-takeaways'); ?></li>
                    </ul>
                </div>
                
                <div class="info-card">
                    <h3>⚡ <?php esc_html_e('Performance Tips', 'post-takeaways'); ?></h3>
                    <ul>
                        <li><?php esc_html_e('Use GPT-3.5-turbo for cost-effective summaries', 'post-takeaways'); ?></li>
                        <li><?php esc_html_e('Enable caching to reduce API calls', 'post-takeaways'); ?></li>
                        <li><?php esc_html_e('Use bulk generation during off-peak hours', 'post-takeaways'); ?></li>
                        <li><?php esc_html_e('Monitor generation logs for errors', 'post-takeaways'); ?></li>
                    </ul>
                </div>
                
                <div class="info-card">
                    <h3>🔧 <?php esc_html_e('Troubleshooting', 'post-takeaways'); ?></h3>
                    <ul>
                        <li><?php esc_html_e('Ensure your API key is valid and has sufficient credits', 'post-takeaways'); ?></li>
                        <li><?php esc_html_e('Check that your content meets minimum length requirements', 'post-takeaways'); ?></li>
                        <li><?php esc_html_e('Verify your WordPress cron jobs are running', 'post-takeaways'); ?></li>
                        <li><?php esc_html_e('Review generation logs for specific error messages', 'post-takeaways'); ?></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
.post-takeaways-settings {
    margin-top: 20px;
}

.api-test-section,
.usage-info {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin-top: 30px;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.info-card {
    background: #f9f9f9;
    border: 1px solid #e5e5e5;
    border-radius: 5px;
    padding: 15px;
}

.info-card h3 {
    margin-top: 0;
    color: #0073aa;
}

.info-card ul {
    margin: 10px 0;
    padding-left: 20px;
}

.info-card li {
    margin-bottom: 5px;
}

#api-test-result {
    margin-top: 15px;
    padding: 10px;
    border-radius: 4px;
    display: none;
}

#api-test-result.success {
    background-color: #d4edda;
    border: 1px solid #c3e6cb;
    color: #155724;
}

#api-test-result.error {
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    color: #721c24;
}

#api-test-result.loading {
    background-color: #d1ecf1;
    border: 1px solid #bee5eb;
    color: #0c5460;
}

@media (max-width: 768px) {
    .info-grid {
        grid-template-columns: 1fr;
    }
}
</style>

<script>
jQuery(document).ready(function($) {
    $('#test-api-connection').on('click', function() {
        var button = $(this);
        var resultDiv = $('#api-test-result');
        
        button.prop('disabled', true).text('Testing...');
        resultDiv.removeClass('success error').addClass('loading').show().text('Testing API connection...');
        
        $.ajax({
            url: post-takeawaysAjax.ajax_url,
            type: 'POST',
            data: {
                action: 'test_api_connection',
                nonce: post-takeawaysAjax.nonce
            },
            success: function(response) {
                if (response.success) {
                    resultDiv.removeClass('loading').addClass('success').text('✅ ' + response.data.message);
                } else {
                    resultDiv.removeClass('loading').addClass('error').text('❌ ' + response.data);
                }
            },
            error: function() {
                resultDiv.removeClass('loading').addClass('error').text('❌ Connection test failed. Please check your settings.');
            },
            complete: function() {
                button.prop('disabled', false).text('🧪 Test API Connection');
            }
        });
    });
});
</script>
