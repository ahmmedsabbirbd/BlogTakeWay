# Changelog

All notable changes to the Aisk AI Chatbot plugin will be documented in this file.

## [2.2.1] - 2024-07-29

### Add
- Add: Integrated Gleap AI for enhanced support and user feedback.

## [2.2.0] - 2024-07-28

### Add
- Add: Integrated Appsero to track plugin installs, uninstalls, and collect uninstall feedback.

## [2.1.0] - 2024-07-24

### Fixed
- Resolved: Error when clicking "Generate Embeddings" (embedding generation now works as expected).
- Resolved: Issue where "Unprocessed items: 1" always showed, even after generating embeddings (unprocessed item count now updates correctly).

## [2.0.9] - 2025-07-16

### Changed
- Improved: Widget Header Logo displays correctly on both the chatbot and dashboard.
- Improved: Add an option to remove the Widget Header Logo.
- Improved: Add an option to remove the Chat Bubble Icon.

## [2.0.8] - 2024-07-14

### Changed
- Improved: UX for rolling messages in ChatWidgetSettings: Empty lines are now automatically removed when saving, making message management smoother for admins.

## [2.0.7] - 2025-07-10

### Changed
- Improved: Update readme.txt to streamline feature descriptions and remove outdated sections

## [2.0.6] - 2025-07-09

### Changed
- Improved: After updating "Contact Information & Custom Content," notify user to regenerate embedding.
- Fix: Excluded Post/Page feature not working.

## [2.0.5] - 2025-07-07

### Changed
- Fix: Incognito mode chatbot support

## [2.0.4] - 2025-06-25

### Changed
- Update documentation on readme

## [2.0.3] - 2025-06-25

### Changed
- Version bump for maintenance and compliance with WordPress.org guidelines
- Improved input sanitization for chat messages
- Improved error exception message to make clear about the error

## [2.0.2] - 2025-06-25

### Changed
- Updated version number for maintenance release
- Removed openai api key from classify intent request api
- Removed unnecessary auth key check

## [2.0.1] - 2025-06-03

### Added
- Improved Composer dependency handling
- Enhanced error logging for missing dependencies
- Better initialization of admin class
- More robust plugin activation process

### Changed
- Updated Composer autoloader check to be more graceful
- Improved error handling during plugin initialization
- Enhanced admin menu registration process
- Better handling of plugin dependencies
- Reduced debug log spam for missing Composer autoloader

### Fixed
- Fixed issue with admin menu not appearing in WordPress dashboard
- Resolved plugin initialization timing issues
- Fixed silent failures in plugin activation
- Improved error reporting for missing dependencies
- Fixed excessive logging of Composer autoloader errors
- Resolved API endpoint issues due to missing dependencies

## [2.0.0] - 2025-06-20

### Added
- Major performance improvements in PDF processing
- Enhanced text extraction and cleaning capabilities
- Optimized memory management for large files
- Improved batch processing for embeddings
- Advanced caching system for processed content
- Better error handling and recovery mechanisms

### Changed
- Upgraded PDF processing engine for better reliability
- Improved text cleaning algorithms
- Enhanced memory usage optimization
- Streamlined embedding generation process
- Better handling of large PDF files
- More efficient database operations

### Fixed
- Memory leaks in PDF processing
- Performance bottlenecks in text extraction
- Database optimization issues
- Error handling in batch processing
- Resource management for large files

## [1.2.3] - 2025-06-19

### Changed
- Replaced discouraged `set_time_limit()` function with WordPress filters for time limit management
- Improved time limit handling in PDF processing and URL crawling
- Enhanced error handling for time-sensitive operations

### Fixed
- Fixed PHP warnings related to time limit management
- Improved compatibility with strict PHP settings
- Enhanced reliability of long-running operations

## [1.2.2] - 2025-06-18

### Fixed
- Fixed missing version parameter in wp_register_style() calls
- Improved asset versioning for better cache control
- Enhanced style loading reliability
- Fixed product image sequential display issues
- Added support for managing unsupported image extensions

### Changed
- Updated version number across all plugin files
- Improved code documentation

## [1.2.1] - 2025-06-17

### Removed
- Deleted class-pdf-queue-handler.php from the backend codebase
- Removed all routes, hooks, and functions referencing the PDF queue handler

### Changed
- Cleaned up and refactored PdfProcessing.jsx frontend component
- Removed debug/console logging statements
- Updated property and variable names for clarity
- Verified and tested PDF upload and status flows

### Verified
- Confirmed backend functionality without queue handler
- Ensured consistent behavior across PDF-related features
- Updated or removed affected test cases

## [1.2.0] - 2025-06-16

### Changed
- All created_at and updated_at fields are now stored in UTC in the database using gmdate('Y-m-d H:i:s') for DATETIME columns, ensuring consistency across all server environments.
- Backend API always returns ISO 8601 UTC strings for all date fields.
- Frontend consistently displays all dates/times in the user's local timezone, regardless of server or database timezone.
- Improved documentation and developer notes for timezone handling.

### Fixed
- Fixed issues where local and staging environments could show different times due to inconsistent timezone storage.
- Fixed potential ambiguity in date parsing by always using UTC for storage and ISO 8601 for API responses.

## [1.1.9] - 2025-06-15

### Added
- Added support for general inquiries intent type
- Enhanced intent classification system
- Improved response handling for store policies and business information
- Robust PDF queue processing system using Action Scheduler or fallback to WordPress cron
- Background PDF processing with retries, job status monitoring, and automatic cleanup
- REST API endpoints and React UI for PDF upload, status polling, and deletion
- Support for PDF processing with or without WooCommerce dependency
- Resource-efficient queue: batch size control, server load checks, and rate limiting
- Improved error handling and user feedback for PDF uploads and processing
- Automatic queue table creation and verification
- Hybrid dispatching: supports real cron, AJAX/manual triggers, and background jobs

### Changed
- Updated system prompt to better handle general inquiries
- Improved distinction between general conversation and information-seeking questions
- Enhanced response formatting for business-related queries
- Optimized PDF processing workflow: upload → queue → background process → status tracking
- Enhanced PDF extraction, chunking, and embedding reliability
- Improved admin UI for PDF status, progress, and error messages

### Fixed
- Fixed intent classification accuracy for store policy questions
- Improved handling of business hours and shipping inquiries
- Enhanced response quality for general business information
- Fixed issue where greeting message and suggested questions were not displayed when configured in the admin settings and no previous messages existed in the chat window.
- Fixed issues with Action Scheduler dependency and fallback logic
- Improved reliability of PDF job status and queue cleanup
- Fixed linter errors and exception handling in PDF processing code

## [1.1.8] - 2025-06-13

### Changed
- Reverted PDF processing UI to a simple upload/process flow (removed polling/status logic)
- Fixed issues with PDF job status lookup and improved reliability of PDF uploads
- Improved error handling and user feedback for PDF uploads
- Minor bug fixes and code cleanup

### Fixed
- The inquiry page does not load if WooCommerce is not installed initially (1st time).

## [1.1.7] - 2025-05-12

### Added
- Enhanced URL processing and validation
- Improved error handling for chat integrations
- Better support for timezone handling

### Fixed
- Various bug fixes and performance improvements
- Enhanced stability for WhatsApp and Telegram integrations

## [1.1.4] - 2025-05-07

### Changed
- Refactor uninstall script to simplify table drop query syntax
- Refactor WhatsApp handler for improved logging and code clarity
- Updated the from_number assignment to remove the 'whatsapp:' prefix for better compatibility.
- Cleaned up error logging in the handle_webhook method to enhance readability.
- Commented out the delay in media sending for potential future use, improving code maintainability.

## [1.1.3] - 2025-05-07

### Added
- Telegram and WhatsApp chat integration improvements and bug fixes.
- User and admin chat timestamps now always display in the user's local time zone, with clear time zone indication.
- Debugging tools for date/time display (removed in final release).

### Improved
- Product carousel and order inquiry flows in Telegram and WhatsApp bots.
- State management for inquiry submission in Telegram bot.
- Consistent date/time formatting across admin dashboard and chat widget.
- Enhanced error handling and logging for chat integrations.

### Fixed
- Fixed issue where inquiry submission in Telegram bot was not recognized.
- Fixed product image and content display issues in Telegram bot.
- Fixed admin dashboard date column always showing UTC instead of user local time.
- Fixed chat widget and chat history to always show timestamps in the user's local time zone. 

## [1.1.2] - 2025-05-04

### Added
- User-facing message when no subordinate URLs can be embedded (due to bot protection, caching, or JavaScript rendering)
- Dismissible yellow notice box for user messages above the form

### Improved
- Frontend UX for user and system messages
- Various UI/UX and accessibility improvements

### Fixed
- No changes to embedding logic for main page content

## [1.1.1] - 2025-05-03

### Added
- Enhanced sitemap URL fetching with support for more sitemap formats
- Improved error handling and logging for sitemap processing
- Support for additional sitemap locations and formats
- Better handling of XML namespaces in sitemaps
- Enhanced URL normalization and validation
- New test script for sitemap URL fetching verification
- Support for handling Rank Math SEO redirects
- Improved error detection for SEO plugin conflicts
- Enhanced logging for sitemap processing failures
- Support for multiple sitemap index files
- Better handling of sitemap URL discovery
- Improved content extraction from sitemaps
- Enhanced URL validation and sanitization
- Support for custom sitemap locations
- Better handling of sitemap URL patterns

### Changed
- Optimized sitemap parsing logic for better performance
- Improved URL deduplication process
- Enhanced error reporting for sitemap fetching
- Updated URL processing to handle more edge cases
- Refined content extraction from sitemaps
- Improved handling of duplicate URLs in database
- Enhanced content comparison logic
- Updated URL processing workflow
- Improved error message formatting
- Enhanced sitemap discovery process
- Optimized database queries for URL processing
- Improved content chunking logic
- Enhanced URL validation rules
- Updated error handling for SEO plugin conflicts
- Improved sitemap URL extraction

### Fixed
- Issues with duplicate URLs in database
- Problems with sitemap URL fetching for certain websites
- XML parsing errors in sitemap processing
- URL normalization issues
- Content duplication in database entries
- Issues with Rank Math SEO redirects
- Problems with sitemap discovery
- URL validation edge cases
- Content extraction errors
- Database query optimization issues
- Memory leaks in URL processing
- Performance bottlenecks in sitemap parsing
- Issues with URL deduplication
- Problems with content comparison
- Errors in sitemap URL extraction

### Security
- Enhanced URL validation and sanitization
- Improved error handling to prevent information disclosure
- Added additional checks for external URLs
- Enhanced input validation for sitemap URLs
- Improved security for URL processing
- Added validation for sitemap content
- Enhanced error message security
- Improved handling of malformed URLs
- Added security checks for sitemap processing
- Enhanced protection against malicious URLs

## [1.1.0] - 2025-05-01

### Added
- Enhanced content type priority system for more accurate responses
- Strict content matching rules for settings-related queries
- Improved response type handling for contact support queries
- New content hierarchy structure for better organization
- Explicit fallback rules for content types
- Support for custom chat widget styling with CSS customization options
- New integration options for third-party services
- Enhanced documentation and user guides
- Improved error handling and logging system
- Advanced chat widget customization options
- Enhanced security features for data transmission

### Changed
- Updated system prompt with clearer intent classification rules
- Improved content type matching logic
- Enhanced response type determination for contact support
- Refined query classification system
- Updated response formatting rules
- Improved chat widget performance and responsiveness
- Optimized database queries for better performance
- Enhanced error handling and logging system
- Updated compatibility with latest WordPress versions (up to 6.7)
- Improved memory usage and resource optimization
- Enhanced chat session management

### Fixed
- Mixed content responses in settings-related queries
- Inconsistent response type handling in contact support
- Content priority issues in search results
- Query classification accuracy
- Response formatting inconsistencies
- Compatibility issues with latest WordPress versions
- Various minor bugs and issues
- Performance bottlenecks in chat widget rendering
- Database query optimization for better scalability
- Memory leaks in long chat sessions
- Widget loading issues on slow connections

### Security
- Enhanced data transmission security with improved HTTPS encryption
- Added additional validation for external API calls
- Improved user data protection measures
- Enhanced session security
- Improved API key management

## [1.0.0] - 2025-03-15

### Added
- Initial release of Aisk AI Chatbot
- AI-powered customer support system
- WooCommerce integration
- WhatsApp and Telegram integration
- Product search and recommendations
- Order management features
- Contact form integration
- Support for multiple languages
- PDF file processing for knowledge base
- Geolocation-based features
- Customizable chat widget appearance
- Admin dashboard for configuration
- Real-time chat analytics
- Automated response system
- Integration with OpenAI API
- Support for Twilio WhatsApp API
- Telegram bot integration
- IP-based geolocation services
- PDF content extraction capabilities
