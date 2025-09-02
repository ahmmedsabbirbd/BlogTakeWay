# Blog TakeWay – AI-Powered Blog Summaries & Takeaways

A powerful WordPress plugin that automatically generates intelligent summaries and key takeaways for your blog posts using OpenAI's advanced AI models.

## 🚀 Features

### Frontend Features
- **Automatic Summary Display**: AI-generated summaries appear on individual blog pages
- **Key Takeaways**: Bullet-pointed insights extracted from your content
- **Responsive Design**: Beautiful, mobile-friendly summary sections
- **Customizable Positioning**: Choose where summaries appear (before/after content)
- **Shortcode Support**: Use `[blog_summary]` and `[blog_takeaways]` anywhere

### Admin Dashboard Features
- **AI API Configuration**: Easy setup for OpenAI API integration
- **Bulk Summary Generation**: Process multiple posts at once
- **Manual Summary Editing**: Fine-tune AI-generated content
- **Generation Settings**: Control summary length, style, and tone
- **Comprehensive Dashboard**: View statistics, database status, and recent activity
- **Generation Logs**: Track all AI operations and API usage

### Backend Functionality
- **OpenAI Integration**: Seamless connection to GPT-4, GPT-3.5-turbo, and more
- **Smart Caching**: Intelligent caching system with configurable expiry
- **Auto-Generation**: Automatic summaries when posts are published
- **Database Storage**: Efficient storage for summaries and generation logs
- **REST API**: Full API endpoints for external integrations
- **Widget Support**: Display summaries in sidebars and widget areas
- **Cron Jobs**: Automated bulk processing and cache cleanup

## 📋 Requirements

- WordPress 5.0 or higher
- PHP 7.4 or higher
- MySQL 5.6 or higher
- OpenAI API key
- cURL extension enabled

## 🛠️ Installation

### Method 1: WordPress Admin (Recommended)
1. Download the plugin ZIP file
2. Go to **Plugins > Add New** in your WordPress admin
3. Click **Upload Plugin** and select the ZIP file
4. Click **Install Now** and then **Activate**

### Method 2: Manual Installation
1. Extract the plugin files to `/wp-content/plugins/blog-takeway/`
2. Activate the plugin through the **Plugins** menu in WordPress
3. Go to **Blog TakeWay > Settings** to configure your OpenAI API key

## ⚙️ Configuration

### 1. OpenAI API Setup
1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Go to **Blog TakeWay > Settings**
3. Enter your API key and select your preferred model
4. Click **Test API Connection** to verify setup

### 2. Generation Settings
- **Summary Length**: Choose between short, medium, or long summaries
- **Style**: Select from professional, casual, academic, or creative tones
- **Auto-Generate**: Enable automatic summary generation on post publish
- **Cache Duration**: Set how long summaries are cached (default: 30 days)

### 3. Display Settings
- **Summary Position**: Choose where summaries appear on posts
- **Enable Takeaways**: Toggle key takeaways display
- **Responsive Design**: Automatically adapts to mobile devices

## 📖 Usage

### Automatic Generation
Once configured, summaries are automatically generated when you:
- Publish a new post
- Update an existing post
- Use the bulk generator

### Manual Generation
1. Edit any post
2. Scroll to the **Blog TakeWay Summary** meta box
3. Click **Generate AI Summary** or **Regenerate Summary**
4. Review and edit the generated content
5. Save your changes

### Shortcodes
Use these shortcodes anywhere in your content:

```php
[blog_summary]          // Display the full summary
[blog_takeaways]        // Show only key takeaways
[blog_summary position="before_content"]  // Custom position
```

### Widget
Add the **Blog Summary Widget** to any widget area:
1. Go to **Appearance > Widgets**
2. Drag **Blog Summary** to your desired location
3. Configure display options

### REST API
Access summaries programmatically:

```php
// Get summary for a specific post
GET /wp-json/blog-takeway/v1/summary/{post_id}

// Update summary
POST /wp-json/blog-takeway/v1/summary/{post_id}

// Delete summary
DELETE /wp-json/blog-takeway/v1/summary/{post_id}
```

## 🔧 Development

### Building Frontend Assets
```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

### File Structure
```
blog-takeway/
├── includes/                    # PHP classes
│   ├── class-blog-summary-database.php
│   ├── class-blog-summary-manager.php
│   ├── class-blog-summary-admin.php
│   └── class-ai-api-handler.php
├── templates/                   # Template files
│   ├── admin/                  # Admin templates
│   └── frontend/               # Frontend templates
├── src/                        # React components
├── assets/                     # Static assets
├── build/                      # Built assets
└── blog-takeway.php           # Main plugin file
```

### Hooks and Filters
```php
// Modify summary generation options
add_filter('blog_takeway_generation_options', function($options) {
    $options['max_length'] = 300;
    return $options;
});

// Customize summary display
add_filter('blog_takeway_summary_html', function($html, $summary) {
    // Custom HTML formatting
    return $html;
}, 10, 2);

// Hook into summary generation
add_action('blog_takeway_summary_generated', function($post_id, $summary) {
    // Custom logic after generation
}, 10, 2);
```

## 📊 Database Tables

The plugin creates two custom tables:

### `wp_blog_summaries`
- `id`: Primary key
- `post_id`: Associated post ID
- `summary`: Generated summary text
- `takeaways`: Key takeaways (JSON)
- `ai_model`: AI model used
- `tokens_used`: API tokens consumed
- `cache_expiry`: Cache expiration date
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### `wp_summary_generation_logs`
- `id`: Primary key
- `post_id`: Associated post ID
- `operation`: Operation type (generate/regenerate/bulk)
- `status`: Success/failure status
- `error_message`: Error details if failed
- `tokens_used`: API tokens consumed
- `duration`: Generation time in seconds
- `ai_model`: AI model used
- `created_at`: Log timestamp

## 🚨 Troubleshooting

### Common Issues

**API Connection Failed**
- Verify your OpenAI API key is correct
- Check if your API key has sufficient credits
- Ensure cURL is enabled on your server

**Summaries Not Generating**
- Check if auto-generation is enabled in settings
- Verify the post content is not empty
- Check the generation logs for errors

**Performance Issues**
- Reduce cache duration for frequently updated content
- Use bulk generation during off-peak hours
- Monitor API usage and set spending limits

### Debug Mode
Enable WordPress debug mode to see detailed error messages:
```php
// In wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

## 🔒 Security

- All API calls use WordPress nonces for CSRF protection
- Input sanitization and validation on all user inputs
- Secure storage of API keys in WordPress options
- Rate limiting for API requests to prevent abuse

## 📈 Performance

- Intelligent caching system reduces API calls
- Database indexes optimize query performance
- Lazy loading of summary content
- Optimized CSS and JavaScript delivery

## 🤝 Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This plugin is licensed under the GPL v2 or later.

## 🆘 Support

- **Documentation**: [Plugin Documentation](https://blogtakeway.com/docs)
- **Support Forum**: [WordPress.org Support](https://wordpress.org/support/plugin/blog-takeway)
- **GitHub Issues**: [Report Bugs](https://github.com/blogtakeway/blog-takeway/issues)

## 🙏 Credits

- Built with ❤️ for the WordPress community
- Powered by OpenAI's advanced language models
- Uses modern web technologies for optimal performance

---

**Blog TakeWay** - Making your content more engaging, one summary at a time! 🚀
