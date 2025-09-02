<?php
if (!defined('ABSPATH')) exit;
?>

<div class="wrap">
    <h1 class="wp-heading-inline">Blog TakeWay Settings</h1>
    
    <div class="blog-takeway-settings">
        <form method="post" action="options.php">
            <?php
            settings_fields('blog_takeway_settings');
            do_settings_sections('blog_takeway_settings');
            submit_button('Save Settings');
            ?>
        </form>
        
        <!-- API Test Section -->
        <div class="api-test-section">
            <h2>Test API Connection</h2>
            <p>Test your OpenAI API connection to ensure everything is working properly.</p>
            <button type="button" class="button button-secondary" id="test-api-connection">
                🧪 Test API Connection
            </button>
            <div id="api-test-result"></div>
        </div>
        
        <!-- Usage Information -->
        <div class="usage-info">
            <h2>Usage Information</h2>
            <div class="info-grid">
                <div class="info-card">
                    <h3>📊 Token Usage</h3>
                    <p>Monitor your OpenAI API token usage to manage costs effectively.</p>
                    <ul>
                        <li><strong>Short summaries:</strong> ~50-75 words (200 tokens)</li>
                        <li><strong>Medium summaries:</strong> ~100-125 words (300 tokens)</li>
                        <li><strong>Long summaries:</strong> ~150-200 words (500 tokens)</li>
                    </ul>
                </div>
                
                <div class="info-card">
                    <h3>⚡ Performance Tips</h3>
                    <ul>
                        <li>Use GPT-3.5-turbo for cost-effective summaries</li>
                        <li>Enable caching to reduce API calls</li>
                        <li>Use bulk generation during off-peak hours</li>
                        <li>Monitor generation logs for errors</li>
                    </ul>
                </div>
                
                <div class="info-card">
                    <h3>🔧 Troubleshooting</h3>
                    <ul>
                        <li>Ensure your API key is valid and has sufficient credits</li>
                        <li>Check that your content meets minimum length requirements</li>
                        <li>Verify your WordPress cron jobs are running</li>
                        <li>Review generation logs for specific error messages</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
.blog-takeway-settings {
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
            url: blogTakewayAjax.ajax_url,
            type: 'POST',
            data: {
                action: 'test_api_connection',
                nonce: blogTakewayAjax.nonce
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
