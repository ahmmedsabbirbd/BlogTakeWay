=== Aisk – AI Powered Chatbot | Support Assistant | Support Bot | Live Chat ===
Contributors: aisk, zrshishir, ahmmedsabbirbd
Tags: chatbot, live chat, customer support, live support, woocommerce
Requires at least: 5.0
Tested up to: 6.8
Stable tag: 2.2.1
Requires PHP: 7.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

AI chatbot for WordPress & WooCommerce with WhatsApp & Telegram integration. Provides instant answers, product recommendations, order status, inquiry submit and much more.

== Description ==

Aisk is a revolutionary AI-powered WhatsApp & Telegram supported chatbot designed specifically for WooCommerce stores and WordPress websites. Say goodbye to repetitive support tickets and hello to automated, intelligent customer service that works around the clock.

= 🚀 Why Choose AISK? =

* AISK Chat is 100% FREE!
* Reduce support tickets by up to 80%
* Provide instant 24/7 customer support
* Free up your team's time for complex issues
* Increase customer satisfaction with quick responses
* Boost sales with intelligent product recommendations
* Seamlessly integrate with WhatsApp and Telegram
* Enhanced sitemap processing for better content discovery
* Improved URL handling and content extraction
* Advanced error handling and logging

= 🛍️ WooCommerce Integration =

AISK is built from the ground up for WooCommerce stores:

* **Smart Product Search**: Helps customers find products based on descriptions, colors, sizes, categories, and more
* **Order Management**: Customers can track orders, view status, and access invoices using their order number and email
* **Intelligent Recommendations**: Suggests relevant products based on customer queries and browsing history
* **Shopping Cart Assistance**: Helps with cart-related questions and checkout process
* **Real-time Inventory**: Provides accurate stock information and availability
* **Enhanced Content Discovery**: Improved sitemap processing for better product and content indexing

= 🔍 Content Processing =

* Let your chatbot answer from your website content, woocommerce products, as well as your PDF and external site URLs. All the data are processed right in your server. 

= 🎯 Key Features =

**Smart Customer Support**
* Instant responses to common customer queries
* Natural language understanding for human-like conversations
* Learning capability to improve responses over time
* Multi-language support
* Custom response templates
* Enhanced content discovery and processing

**Multi-Channel Integration**
* WhatsApp integration for direct messaging
* Telegram bot integration
* Contact form integration
* Email notification system
* Seamless channel switching
* Improved error handling across all channels

**Advanced Administration**
* Intuitive dashboard for managing conversations
* Detailed analytics and insights
* Customizable chat widget
* Knowledge base management
* Custom branding options
* Enhanced logging and monitoring

**Security & Privacy**
* GDPR compliant
* Secure data handling
* Advanced encryption
* Role-based access control
* Data retention policies
* Enhanced URL validation and sanitization

= 🔥 Features =

* Advanced WooCommerce integration
* WhatsApp and Telegram integration
* Custom branding and themes
* Advanced analytics and reporting
* Priority support
* Custom AI training
* Multiple language support
* Unlimited conversations

= 💡 Use Cases =

1. **Product Support**
    * Answer product-specific questions
    * Provide sizing guides
    * Share product recommendations
    * Handle availability inquiries

2. **Order Management**
    * Track order status
    * Handle shipping inquiries

3. **Customer Service**
    * Answer FAQs
    * Handle common support issues
    * Provide store policies
    * Collect customer feedback

4. **Sales Assistance**
    * Recommend products
    * Answer pricing questions
    * Handle discount inquiries
    * Guide through checkout

= 🔧 Easy Setup =

1. Install and activate the plugin
2. Enter your API credentials
3. Customize your chat widget
4. Configure your knowledge base
5. Start automating your customer support!

= 🌟 Benefits =

For Store Owners:
* Reduce support costs
* Increase customer satisfaction
* Boost sales through smart recommendations
* Save time on repetitive queries
* Get valuable customer insights

For Customers:
* 24/7 instant support
* Quick access to order information
* Personalized product recommendations
* Seamless shopping experience
* Multiple communication channels

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/aisk-ai-chat` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Use the Settings->AISK screen to configure the plugin
4. Configure your API credentials in the plugin settings

== Development Setup ==

For developers who want to contribute or modify the plugin:

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install PHP dependencies
   composer install
   
   # Install Node.js dependencies
   npm install
   ```
3. Build the plugin:
   ```bash
   # Development build with hot reloading
   npm run dev
   
   # Production build
   npm run build
   
   # Build for WordPress.org submission
   npm run build:wp
   ```

The build process uses:
- Vite for bundling and development
- React for UI components
- Tailwind CSS for styling
- TypeScript for type safety

Source files are located in:
- `src/components/` - React components
- `src/styles/` - CSS and styling files
- `src/admin/` - Admin interface components
- `src/lib/` - Utility functions and shared code

The build process will:
- Compile frontend assets (React, CSS)
- Install production PHP dependencies
- Create a WordPress.org-ready zip file

== Frequently Asked Questions ==

= Is AISK compatible with my theme? =

Yes, AISK is designed to work with any WordPress theme. The chat widget is fully responsive and customizable to match your site's design.

= Do I need coding knowledge to use AISK? =

No, AISK is designed to be user-friendly and requires no coding knowledge. The intuitive admin interface makes it easy to set up and manage.

= Can I customize the chatbot's responses? =

Yes, you can customize responses, train the AI with your specific knowledge base, and set up custom response templates.

= Does AISK support multiple languages? =

Yes, AISK supports multiple languages and can detect and respond in the customer's preferred language.

= Is AISK GDPR compliant? =

Yes, AISK is fully GDPR compliant and includes features for data privacy and protection.

== Screenshots ==

1. Modern chat widget interface
2. Admin dashboard overview
3. WooCommerce order management
4. WhatsApp integration
5. Analytics dashboard
6. Settings panel

== Changelog ==

= 2.2.1 =
* Add: Integrated Gleap AI for enhanced support and user feedback. 

= 2.2.0 =
* Add: Integrated Appsero to track plugin installs, uninstalls, and collect uninstall feedback.

= 2.1.0 =
* Fixed: Error when clicking "Generate Embeddings" (embedding generation now works as expected).
* Fixed: Issue where "Unprocessed items: 1" always showed, even after generating embeddings (unprocessed item count now updates correctly).

= 2.0.9 =
* Improved: Widget Header Logo displays correctly on both the chatbot and dashboard.
* Improved: Add an option to remove the Widget Header Logo.
* Improved: Add an option to remove the Chat Bubble Icon.

= 2.0.8 =
* Improved: UX for rolling messages in ChatWidgetSettings: Empty lines are now automatically removed when saving, making message management smoother for admins.

= 2.0.7 =
* Improved: Update readme.txt to streamline feature descriptions and remove outdated sections

= 2.0.6 =
* Improved: After updating "Contact Information & Custom Content," notify user to regenerate embedding.
* Fix: Excluded Post/Page feature not working.

= 2.0.5 =
* Fix: Incognito mode chatbot support


= 2.0.4 =
* Update documentation on readme

= 2.0.3 =
* Version bump for maintenance and compliance with WordPress.org guidelines
* Improved input sanitization for chat messages
* Improved error exception message to make clear about the error

= 2.0.2 =
* Updated version number for maintenance release
* Removed openai api key from classify intent api call

= 2.0.1 =
* Improved Composer dependency handling
* Enhanced error logging for missing dependencies
* Better initialization of admin class
* More robust plugin activation process
* Updated Composer autoloader check to be more graceful
* Improved error handling during plugin initialization
* Enhanced admin menu registration process
* Better handling of plugin dependencies
* Fixed issue with admin menu not appearing in WordPress dashboard
* Resolved plugin initialization timing issues
* Fixed silent failures in plugin activation
* Improved error reporting for missing dependencies

= 2.0.0 =
* Major performance improvements in PDF processing
* Enhanced text extraction and cleaning capabilities
* Optimized memory management for large files
* Improved batch processing for embeddings
* Advanced caching system for processed content
* Better error handling and recovery mechanisms
* Upgraded PDF processing engine for better reliability
* Improved text cleaning algorithms
* Enhanced memory usage optimization
* Streamlined embedding generation process
* Better handling of large PDF files
* More efficient database operations

= 1.2.3 =
* Replaced discouraged `set_time_limit()` function with WordPress filters
* Improved time limit handling in PDF processing and URL crawling
* Enhanced error handling for time-sensitive operations
* Fixed PHP warnings related to time limit management
* Improved compatibility with strict PHP settings
* Enhanced reliability of long-running operations

= 1.2.2 =
* Fixed missing version parameter in wp_register_style() calls
* Improved asset versioning for better cache control
* Enhanced style loading reliability
* Fixed product image sequential display issues
* Added support for managing unsupported image extensions
* Updated version number across all plugin files
* Improved code documentation

= 1.2.1 =
* Removed PDF queue handler system
* Cleaned up and refactored PDF processing
* Removed debug logging
* Updated property and variable names
* Verified PDF upload and status flows
* Ensured consistent behavior across PDF features

= 1.2.0 =
* All date/time fields now stored in UTC
* Backend API returns ISO 8601 UTC strings
* Frontend displays dates in user's local timezone
* Fixed timezone inconsistencies across environments
* Improved date parsing and handling

== Upgrade Notice ==

= 2.0.1 =
This update improves Composer dependency handling and plugin initialization. Includes enhanced error logging, more robust activation process, and fixes for admin menu visibility issues. Recommended update for all installations.

= 2.0.0 =
Major update with performance improvements for PDF processing and content handling. Includes optimized memory management, advanced caching, and improved text extraction. Better error handling and resource management for large files.

= 1.2.3 =
Improves time limit management by replacing set_time_limit() with WordPress filters. Enhances compatibility with strict PHP settings and improves reliability of long-running operations.

= 1.2.2 =
This update fixes missing version parameters in style registrations, improving asset caching and loading reliability. Also includes fixes for product image display and unsupported image extensions.

= 1.2.1 =
This update removes the PDF queue handler system and simplifies the PDF processing workflow. The changes include cleanup of backend code, improved frontend component organization, and verification of PDF functionality.

= 1.2.0 =
This update ensures all date/time fields are stored and displayed consistently in UTC and the user's local timezone, fixing issues with inconsistent times across different servers.

== Support ==

Visit [aisk.chat](https://aisk.chat) for documentation and support.#   p r o m o - b a r - x  
 