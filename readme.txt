=== Aisk – AI Powered Chatbot | Support Assistant | Support Bot | Live Chat ===
Contributors: aisk, zrshishir, ahmmedsabbirbd
Tags: chatbot, live chat, customer support, live support, woocommerce
Requires at least: 5.0
Tested up to: 6.8
Stable tag: 2.2.1
Requires PHP: 7.4
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

AI-powered chatbot with WhatsApp & Telegram integration. Provides instant support from the KB, product recommendations, and order status.

== Description ==

Aisk is a revolutionary AI-powered WhatsApp & Telegram supported chatbot designed specifically for WooCommerce stores and WordPress websites. Say goodbye to repetitive support tickets and hello to automated, intelligent customer service that works around the clock.

= 🚀 Why Choose AISK? =

* 💯 AISK Chat is 100% FREE!
* 📉 Reduce support tickets by up to 80%
* ⏱️ Provide instant 24/7 customer support
* 👨‍💼 Free up your team's time for complex issues
* 😊 Increase customer satisfaction with quick responses
* 📈 Boost sales with intelligent product recommendations
* 📱 Seamlessly integrate with WhatsApp and Telegram
* 🔗 Improved URL handling and content extraction

= 🛍️ WooCommerce Integration =

AISK is built from the ground up for WooCommerce stores:

* **Smart Product Search**: Helps customers find products based on descriptions, colors, sizes, categories, and more
* **Order Management: Customers can track orders, view status, and submit inquiries about their orders using their order number and email. The plugin includes a simple form that allows customers to send order-related questions directly to the business.
* **Intelligent Recommendations**: Suggests relevant products based on customer queries and browsing history

= 🚀 Key Features =

= ✨ Automated Responses, No Delays. Ever. =
Answer customer questions instantly 24/7 through your website, WhatsApp, and Telegram using your existing content. Aisk handles routine inquiries automatically across all channels, eliminating wait times and preventing abandoned carts, with seamless handoff to your team when needed.

= 🛒 Smart Product Recommendations That Convert =
When customers describe what they want, Aisk instantly suggests matching products with images and purchase links, increasing conversions and order values through personalized recommendations.

= 📦 Order Tracking Made Effortless =
Customers check order status, shipping updates, and tracking information themselves through your website, WhatsApp or Telegram after quick verification, reducing support inquiries by 90%.

= 📱 WhatsApp & Telegram Integration =
Turn the world's most popular messaging platforms into your 24/7 sales and support channels. With Aisk's messaging integrations, customers can browse products, check order status, and get instant support using the apps they already check dozens of times daily.

= 🔄 Complete Omnichannel Support =
Unify your website, WhatsApp, and Telegram conversations in a single dashboard. This ensures consistent responses across channels, eliminates communication silos, and provides your team complete visibility of customer interactions from every source.

= 📚 Unlimited Knowledge Sources =
Import knowledge from:
- 📄 PDF Documents (product manuals, guidelines, policies)
- 🌐 External Websites (with advanced crawling controls)
- ✏️ Custom Knowledge (direct input for FAQs and special instructions)

= 🤝 Seamless Human Handoff with Form Integration =
When AI reaches its limits, Aisk.chat offers support information or creates tickets through its shortcode support. Integrate any contact form plugin directly within the chat interface and connect to your existing CRM system or help desk software without additional costs.

= ⚙️ Installation =

Getting started with Aisk.chat is quick and easy:

1. **Install & Activate**
   Download Aisk from the WordPress repository or upload the ZIP file. Go to Plugins → Add New → Upload, then "Install Now" and "Activate." Find Aisk in your WordPress dashboard menu.

2. **Set up Aisk and OpenAI Key**
   Enter your API keys in Aisk settings. Connect your OpenAI account to power AI conversations and your Aisk authentication key to activate all features. Our wizard guides you through obtaining and connecting these keys.

3. **Generate Smart Knowledge Base**
   Let Aisk learn about your business by generating embeddings from your website content. Click "Generate Embeddings" and Aisk will process your pages, posts, and products to create an intelligent knowledge base for accurate customer responses.

= 🛠️ Development =

Aisk.chat is built using modern web technologies and build tools. The source code is available in the `src/` directory of the plugin.

**Build Requirements:**
- Node.js 16.x or higher
- npm 7.x or higher

**Building from Source:**
1. Clone the repository
2. Install dependencies: `npm install`
3. Build the plugin: `npm run build`

The build process uses:
- Vite for bundling
- React for UI components
- Tailwind CSS for styling
- TypeScript for type safety

Source files are located in:
- `src/components/` - React components
- `src/styles/` - CSS and styling files
- `src/admin/` - Admin interface components
- `src/lib/` - Utility functions and shared code

The compiled files are generated in the `build/` directory.

= 📈 Results You Can Expect =

- **78% reduction** in basic support tickets within the first month
- **23% increase** in after-hours conversions
- **91% positive feedback** from customers using the chatbot
- **4.3 hours** saved daily by the average store owner

= 📞 Support =

If you have any questions or need assistance, please visit our [support forum](https://wordpress.org/support/plugin/aisk-ai-chat/) or [contact us directly](https://aisk.chat/support/).

= 📝 License =

This project is licensed under the GPL-2.0+ License - see the LICENSE file for details.

= 🔌 External Services =

This plugin connects to several external services to provide its functionality. Here's a detailed breakdown of each service and how it's used:

== OpenAI API ==
- **Purpose**: Used for generating AI responses and creating embeddings from your content
- **Data Sent**: 
  - Content from your website (posts, pages, products)
  - User queries and messages
  - Custom knowledge base content
- **When**: 
  - During initial setup when generating embeddings
  - When processing user messages
  - When updating the knowledge base
- **Links**:
  - [Terms of Service](https://openai.com/policies/terms-of-use)
  - [Privacy Policy](https://openai.com/policies/privacy-policy)

== Telegram Bot API ==
- **Purpose**: Enables chat functionality through Telegram messenger
- **Data Sent**:
  - User messages
  - Bot responses
  - Product information
  - Order status updates
- **When**: 
  - When users interact with the Telegram bot
  - When sending automated responses
  - When processing order inquiries
- **Links**:
  - [Terms of Service](https://telegram.org/terms)
  - [Privacy Policy](https://telegram.org/privacy)

== Twilio API ==
- **Purpose**: Enables WhatsApp integration for customer support
- **Data Sent**:
  - User messages
  - Bot responses
  - Product information
  - Order status updates
- **When**:
  - When users interact via WhatsApp
  - When sending automated responses
  - When processing order inquiries
- **Links**:
  - [Terms of Service](https://www.twilio.com/legal/tos)
  - [Privacy Policy](https://www.twilio.com/legal/privacy)

== IPAPI.co ==
- **Purpose**: Used to detect user's location for showing location in the chat list display
- **Data Sent**:
  - User's IP address
- **When**:
  - When the chat widget is loaded
  - When location-based features are requested
- **Links**:
  - [Terms of Service](https://ipapi.co/terms/)
  - [Privacy Policy](https://ipapi.co/privacy/)

== Data Privacy ==
All data transmission to these services is done securely using HTTPS. The plugin only sends necessary data required for its functionality. You can control what data is sent by:
1. Configuring which content types are included in the knowledge base
2. Managing integration settings in the plugin dashboard
3. Using the privacy settings to control data collection

---

Developed with ❤️ by [Aisk.chat Team](https://aisk.chat)

== Frequently Asked Questions ==

= How much does Aisk.chat cost? =
Aisk.chat is completely free of costs. Use Aisk at full fledge without any limitation as there are no Free or Paid plan. All features are open for everyone without any limit. You don't need to have any credit card to start using Aisk.chat. It's because we don't run it on our server. The only thing you will need is the Keys from OpenAI to generate Embedding and answers.

= Do I need OpenAI keys to use Aisk.chat? =
Yes, Aisk.chat requires an OpenAI API key to function. This is because we leverage OpenAI's powerful language models to provide intelligent responses to customer inquiries. You'll need to create an OpenAI account and obtain an API key, which you'll enter in the Aisk dashboard during setup. This approach gives you direct ownership of your AI usage and data while allowing us to provide advanced AI capabilities. We provide step-by-step guidance on obtaining and configuring your OpenAI key during the setup process.

= Can I train Aisk from my own knowledge base? =
Absolutely. Aisk is designed to learn from your specific business content. During setup, the "Generate Embeddings" process analyzes your website pages, product descriptions, FAQs, and other content to create a customized knowledge base. This ensures the chatbot provides accurate, relevant answers based on your unique business information. You can update this knowledge base anytime you add new content to your site by regenerating embeddings.

= Can I add external sites, PDFs, or content as a knowledge base? =
Yes, Aisk supports importing external content to enhance its knowledge base. You can add PDFs, documents, external website content, and custom text sources through the "External Knowledge" section in the dashboard. This feature is particularly useful for adding training manuals, detailed product specifications, or support documentation that isn't published on your main website. All imported content is processed and made searchable for the AI to reference when answering customer questions.

= What happens when the AI can't answer a customer's question? =
If there is any scenario when Aisk couldn't find any answer in the provided knowledge or products, it will offer support information or ask if you would like to create a support ticket. Thus Aisk behaves super friendly when it comes to customer satisfaction and ease.

= Will Aisk work with my existing WooCommerce store? =
Yes, Aisk is built specifically for WooCommerce integration. It can access your product catalog, pricing, inventory status, and order information to provide accurate responses to customer inquiries. The chatbot can suggest products based on customer descriptions, help with checkout questions, and provide order tracking information automatically. Simply activate the WooCommerce integration in the Aisk settings panel.

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
* Improved UX for rolling messages in ChatWidgetSettings: Empty lines are now automatically removed when saving, making message management smoother for admins.

= 2.0.7 =
* Improved: Update readme.txt to streamline feature descriptions and remove outdated sections

= 2.0.6 =
* Improved: After updating "Contact Information & Custom Content," notify user to regenerate embedding.
* Fix: Excluded Post/Page feature not working.

= 2.0.5 =
* Fix: Incognito mode chatbot support

= 2.0.4 =
* Update documentation
* Version bump for maintenance release

= 2.0.3 =
* Version bump for maintenance and compliance with WordPress.org guidelines
* Improved input sanitization for chat messages
* Improved error exception message to make clear about the error

= 2.0.2 =
* Remove openai api key from requests to classify intent api
* Removed unnecessary auth key check
* Updated version number for maintenance release

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

= 1.2.3 =
* Replaced discouraged `set_time_limit()` function with WordPress filters
* Improved time limit handling in PDF processing and URL crawling
* Enhanced error handling for time-sensitive operations
* Fixed PHP warnings related to time limit management
* Improved compatibility with strict PHP settings

= 1.2.2 =
* Fixed missing version parameter in wp_register_style() calls
* Improved asset versioning for better cache control
* Enhanced style loading reliability
* Fixed product image sequential display issues
* Added support for managing unsupported image extensions

= 1.2.1 =
* Removed PDF queue handler system
* Simplified PDF processing workflow
* Improved frontend component organization
* Enhanced PDF functionality reliability
* Cleaned up backend code

= 1.2.0 =
* All created_at and updated_at fields are now stored in UTC in the database using gmdate('Y-m-d H:i:s') for DATETIME columns, ensuring consistency across all server environments.
* Backend API always returns ISO 8601 UTC strings for all date fields.
* Frontend consistently displays all dates/times in the user's local timezone, regardless of server or database timezone.
* Improved documentation and developer notes for timezone handling.
* Fixed issues where local and staging environments could show different times due to inconsistent timezone storage.
* Fixed potential ambiguity in date parsing by always using UTC for storage and ISO 8601 for API responses.

= 1.1.9 =
Added support for general inquiries, improved intent classification, and enhanced business info responses. Improved PDF queue, error handling, and admin UI. Fixed linter errors and greeting message display issue.

= 1.1.8 =
* Reverted PDF processing UI to a simple upload/process flow (removed polling/status logic)
* Fixed issues with PDF job status lookup and improved reliability of PDF uploads
* Improved error handling and user feedback for PDF uploads
* Minor bug fixes and code cleanup
- The inquiry page does not load if WooCommerce is not installed initially (1st time).

= 1.1.7 =
* Enhanced URL processing and content extraction capabilities
* Improved error handling and logging mechanisms
* Added better timezone support across chat interfaces
* Optimized database queries for improved performance
* Fixed various UI/UX issues and improved accessibility

= 1.1.4 =
* Refactor uninstall script to simplify table drop query syntax
* Refactor WhatsApp handler for improved logging and code clarity
* Updated the from_number assignment to remove the 'whatsapp:' prefix for better compatibility.
* Cleaned up error logging in the handle_webhook method to enhance readability.
* Commented out the delay in media sending for potential future use, improving code maintainability.

= 1.1.3 =
* Telegram and WhatsApp chat integration improvements and bug fixes.
* User and admin chat timestamps now always display in the user's local time zone, with clear time zone indication.
* Product carousel and order inquiry flows improved in Telegram and WhatsApp bots.
* State management for inquiry submission in Telegram bot.
* Consistent date/time formatting across admin dashboard and chat widget.
* Enhanced error handling and logging for chat integrations.
* Fixed issue where inquiry submission in Telegram bot was not recognized.
* Fixed product image and content display issues in Telegram bot.
* Fixed admin dashboard date column always showing UTC instead of user local time.
* Fixed chat widget and chat history to always show timestamps in the user's local time zone.

= 1.1.2 =
* Added user-facing message when no subordinate URLs can be embedded (due to bot protection, caching, or JavaScript rendering)
* User notice is now shown in a dismissible yellow box above the form
* Improved frontend UX for user and system messages
* No changes to embedding logic for main page content
* Various UI/UX and accessibility improvements

= 1.1.1 =
* Enhanced chat widget performance and responsiveness
* Improved error handling and logging
* Added support for custom chat widget styling
* Fixed compatibility issues with latest WordPress versions
* Optimized database queries for better performance
* Added new integration options for third-party services
* Improved documentation and user guides
* Enhanced sitemap processing for better content discovery
* Improved URL handling and content extraction
* Advanced error handling and logging

= 1.0.0 =
* Initial release

== Upgrade Notice ==
= 2.0.9 =
* Improved: Widget Header Logo displays correctly on both the chatbot and dashboard.
* Improved: Add an option to remove the Widget Header Logo.
* Improved: Add an option to remove the Chat Bubble Icon.

= 2.0.8 =
Improved UX for rolling messages in ChatWidgetSettings: Empty lines are now automatically removed when saving, making message management smoother for admins.

= 2.0.7 =
Improved: Update readme.txt to streamline feature descriptions and remove outdated sections

= 2.0.6 =
Improved: After updating "Contact Information & Custom Content," notify user to regenerate embedding.
Fix: Excluded Post/Page feature not working.

= 2.0.5 =
Fix: Incognito mode chatbot support

= 2.0.4 =
Update documentation on readme

= 2.0.3 =
Improved error exception message to make clear about the error.

= 2.0.2 =
This is a maintenance release with version number updates. If you're using version 2.0.1, this update is optional.

**IMPORTANT**: This release removes the OpenAI API key from requests to classify intent.

= 2.0.1 =
This update improves Composer dependency handling and plugin initialization. Includes enhanced error logging, more robust activation process, and fixes for admin menu visibility issues. Recommended update for all installations.

= 2.0.0 =
Major update with performance improvements for PDF processing and content handling. Includes optimized memory management, advanced caching, and improved text extraction. Better error handling and resource management for large files.

= 1.2.3 =
Improves time limit management by replacing set_time_limit() with WordPress filters. Enhances compatibility with strict PHP settings and improves reliability of long-running operations.

= 1.2.2 =
This update fixes missing version parameters in style registrations, improving asset caching and loading reliability. No action required for existing installations.

= 1.2.1 =
This update removes the PDF queue handler system and simplifies the PDF processing workflow. The changes include cleanup of backend code, improved frontend component organization, and verification of PDF functionality. No action required for existing installations.

= 1.2.0 =
This update ensures all date/time fields are stored and displayed consistently in UTC and the user's local timezone, fixing issues with inconsistent times across different servers. Update to 1.2.0 for robust, reliable date/time handling in all environments.

= 1.1.9 =
Added support for general inquiries, improved intent classification, and enhanced business info responses. Improved PDF queue, error handling, and admin UI. Fixed linter errors and greeting message display issue.

= 1.1.8 =
This release reverts the PDF processing UI to a simpler, more reliable flow. If you previously used background polling/status for PDFs, please note this is no longer present. No data loss will occur.

= 1.1.7 =
Major improvements to URL processing, error handling, and timezone support. Enhanced content extraction capabilities and optimized database performance. Various UI/UX improvements and accessibility fixes.

= 1.1.4 =
Refactor uninstall script to simplify table drop query syntax. Refactor WhatsApp handler for improved logging and code clarity. Updated the from_number assignment to remove the 'whatsapp:' prefix for better compatibility.

= 1.1.3 =
Updated whatsapp chat, telegram and time zone of the main chatbot.

= 1.1.2 =
Added user-facing message when no subordinate URLs can be embedded (due to bot protection, caching, or JavaScript rendering)

= 1.1.1 =
Updated WooCommerce integration to include Enhanced Content Discovery

= 1.1.0 =
New features added to AISK - enhance content discovery and processing

= 1.0.0 =
Initial release of AISK - start automating your WooCommerce customer support today!

== Development ==

This plugin uses modern development tools and follows WordPress coding standards. Here's how to set up the development environment:

== Screenshots ==

1. Chat widget interface
2. Admin dashboard
3. Settings panel
4. WhatsApp integration
5. Telegram integration
6. Product recommendations
7. Order tracking
8. PDF processing
9. Analytics dashboard
10. Customization options
11. Knowledge base management
12. Integration settings
13. Support ticket creation

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/aisk-ai-chat` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Use the Settings->Aisk screen to configure the plugin
4. Enter your OpenAI API key in the settings
5. Generate embeddings to create your AI knowledge base
6. Configure WhatsApp and Telegram integrations (optional)

== Support ==

Visit [aisk.chat](https://aisk.chat) for documentation and support.

## Privacy Policy 
Aisk – AI Powered Chatbot | Support Assistant | Support Bot | Live Chat uses [Appsero](https://appsero.com) SDK to collect some telemetry data upon user's confirmation. This helps us to troubleshoot problems faster & make product improvements.

Appsero SDK **does not gather any data by default.** The SDK only starts gathering basic telemetry data **when a user allows it via the admin notice**. We collect the data to ensure a great user experience for all our users. 

Integrating Appsero SDK **DOES NOT IMMEDIATELY** start gathering data, **without confirmation from users in any case.**

Learn more about how [Appsero collects and uses this data](https://appsero.com/privacy-policy/).