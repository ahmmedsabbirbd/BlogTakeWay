import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi-select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { __ } from '@wordpress/i18n';

// Import the separated components
import UrlProcessing from '@/components/aiconfig/UrlProcessing';
import PdfProcessing from '@/components/aiconfig/PdfProcessing';

const AiConfigSettings = ({ settings, updateSettings }) => {

    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [processMessage, setProcessMessage] = useState('');
    const [unprocessedCount, setUnprocessedCount] = useState(0);
    const [cleanupStatus, setCleanupStatus] = useState('');
    const [posts, setPosts] = useState([]);
    const [pages, setPages] = useState([]);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isWooCommerceActive, setIsWooCommerceActive] = useState(false);
    const [isCleaningUp, setIsCleaningUp] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    
    // Track original values for contact info and custom content
    const [originalContactInfo, setOriginalContactInfo] = useState('');
    const [originalCustomContent, setOriginalCustomContent] = useState('');
    const [hasSettingsChanges, setHasSettingsChanges] = useState(false);
    
    // Use ref to track if original values have been initialized
    const hasInitialized = useRef(false);

    // Initialize REST URL and nonce
    const restUrl = window?.wpApiSettings?.root || window?.AiskData?.restUrl || '/wp-json/';
    const nonce = window?.wpApiSettings?.nonce || window?.AiskData?.nonce;

    useEffect(() => {
        if (!nonce) {
            setError(__('Authentication token missing. Please refresh the page.', 'aisk-ai-chat'));
            return;
        }

        if (!restUrl) {
            setError(__('API endpoint not configured. Please refresh the page.', 'aisk-ai-chat'));
            return;
        }

        loadUnprocessedCount();
        loadPostsAndPages();

        // Check if WooCommerce is active using the global variable
        setIsWooCommerceActive(!!window?.AiskSettings?.isWooCommerceActive);
    }, []);

    // Set original values when settings are loaded (only once)
    useEffect(() => {
        if (!hasInitialized.current && settings.ai_config) {
            console.log('Initializing original values:', {
                contact_info: settings.ai_config.contact_info,
                custom_content: settings.ai_config.custom_content
            });
            setOriginalContactInfo(settings.ai_config.contact_info || '');
            setOriginalCustomContent(settings.ai_config.custom_content || '');
            hasInitialized.current = true;
        }
    }, [settings.ai_config]);

    // Track changes in contact info and custom content
    useEffect(() => {
        if (hasInitialized.current) {
            const contactChanged = settings.ai_config.contact_info !== originalContactInfo;
            const contentChanged = settings.ai_config.custom_content !== originalCustomContent;
            
            console.log('Change detection:', {
                contactChanged,
                contentChanged,
                currentContact: settings.ai_config.contact_info,
                originalContact: originalContactInfo,
                currentContent: settings.ai_config.custom_content,
                originalContent: originalCustomContent
            });
            
            if (contactChanged || contentChanged) {
                setHasSettingsChanges(true);
            } else {
                setHasSettingsChanges(false);
            }
        }
    }, [settings.ai_config.contact_info, settings.ai_config.custom_content, originalContactInfo, originalCustomContent]);

    const loadUnprocessedCount = async () => {

        try {
            if (!nonce) {
                throw new Error(__('Authentication token missing. Please refresh the page.', 'aisk-ai-chat'));
            }

            if (!restUrl) {
                throw new Error(__('API endpoint not configured. Please refresh the page.', 'aisk-ai-chat'));
            }


            const response = await fetch(`${restUrl}aisk/v1/get-unprocessed-count`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': nonce,
                    'X-WP-Nonce-Valid': 'true'
                },
                credentials: 'same-origin'
            });

            // Check if we got redirected to login page
            const responseText = await response.text();
            if (responseText.includes('wp-login.php') || responseText.includes('login')) {
                throw new Error(__('Authentication required. Please refresh the page and try again.', 'aisk-ai-chat'));
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Try to parse as JSON
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                throw new Error(__('Invalid response format from server', 'aisk-ai-chat'));
            }

            if (data && typeof data === 'object') {
                if ('success' in data && 'count' in data) {
                    setUnprocessedCount(data.count);
                } else if (data.message === __('No content available to process', 'aisk-ai-chat')) {
                    setUnprocessedCount(0);
                } else {
                    throw new Error(__('Invalid response structure from server', 'aisk-ai-chat'));
                }
            } else {
                throw new Error(__('Invalid response data from server', 'aisk-ai-chat'));
            }
        } catch (error) {
            setError(error.message || __('Failed to load unprocessed count. Please try again.', 'aisk-ai-chat'));
            setUnprocessedCount(0);
        }
    };

    const loadPostsAndPages = async () => {
        setIsLoading(true);
        setError('');
        try {
            // Separate promises for posts, pages, and products
            const postsPromise = fetch(`${restUrl}wp/v2/posts?per_page=100`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': nonce
                },
                credentials: 'same-origin'
            });

            const pagesPromise = fetch(`${restUrl}wp/v2/pages?per_page=100`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': nonce
                },
                credentials: 'same-origin'
            });

            // Handle posts and pages separately from products
            const [postsResponse, pagesResponse] = await Promise.all([postsPromise, pagesPromise]);
            const postsData = await postsResponse.json();
            const pagesData = await pagesResponse.json();

            // Set posts and pages regardless of WooCommerce
            setPosts(postsData.map(post => ({
                value: post.id.toString(),
                label: post.title.rendered,
                type: 'post'
            })));

            setPages(pagesData.map(page => ({
                value: page.id.toString(),
                label: page.title.rendered,
                type: 'page'
            })));

            // Only try to load products if WooCommerce is active
            if (window?.AiskSettings?.isWooCommerceActive) {
                try {
                    const productsResponse = await fetch(`${restUrl}wc/v3/products?per_page=100`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-WP-Nonce': nonce
                        },
                        credentials: 'same-origin'
                    });
                    const productsData = await productsResponse.json();
                    setProducts(productsData.map(product => ({
                        value: product.id.toString(),
                        label: product.name,
                        type: 'product'
                    })));
                } catch (error) {
                    console.error('Error loading WooCommerce products:', error);
                    // Don't set main error for WooCommerce issues
                }
            }

            // Only show no content error if both posts and pages are empty
            if (!postsData.length && !pagesData.length) {
                setError(__('No posts or pages found. Please create some content first.', 'aisk-ai-chat'));
            }
        } catch (error) {
            console.error('Error loading content:', error);
            setError(__('Failed to load posts and pages. Please try again.', 'aisk-ai-chat'));
        } finally {
            setIsLoading(false);
        }
    };

    const processContent = async () => {

        try {
            setProcessing(true);
            setError(null);
            setSuccessMessage(null);

            if (!nonce) {
                throw new Error(__('Authentication token missing. Please refresh the page.', 'aisk-ai-chat'));
            }

            if (!restUrl) {
                throw new Error(__('API endpoint not configured. Please refresh the page.', 'aisk-ai-chat'));
            }

            // If there are settings changes, update the original values first
            if (hasSettingsChanges) {
                console.log('Resetting settings changes after processing');
                setOriginalContactInfo(settings.ai_config.contact_info || '');
                setOriginalCustomContent(settings.ai_config.custom_content || '');
                setHasSettingsChanges(false);
            }

            const response = await fetch(`${restUrl}aisk/v1/process-content`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': nonce,
                    'X-WP-Nonce-Valid': 'true'
                },
                credentials: 'same-origin'
            });

            // Log response details for debugging
            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`Server returned status ${response.status}: ${errorText}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Invalid content type:', contentType);
                console.error('Response text:', text);
                throw new Error(`Invalid content type: ${contentType}. Expected application/json`);
            }

            const data = await response.json();
            console.log('Processed data:', data);

            if (data.success) {
                let message = __('Successfully processed content', 'aisk-ai-chat');
                if (data.processed > 0) {
                    message += `: ${data.processed} ${__('items processed', 'aisk-ai-chat')}`;
                    if (data.total > 0) {
                        message += `, ${data.total} ${__('remaining', 'aisk-ai-chat')}`;
                    }
                } else {
                    message += `: ${__('No items to process', 'aisk-ai-chat')}`;
                }

                setSuccessMessage(message);

                if (data.errors && data.errors.length > 0) {
                    console.warn('Processing completed with errors:', data.errors);
                    // Show errors in a non-blocking way
                    data.errors.forEach(error => {
                        console.error('Processing error:', error);
                    });
                }

                // Refresh unprocessed count after processing
                await loadUnprocessedCount();
            } else {
                throw new Error(data.message || __('Failed to process content', 'aisk-ai-chat'));
            }
        } catch (error) {
            console.error('Error processing content:', error);
            setError(error.message || __('Error processing content', 'aisk-ai-chat'));
        } finally {
            setProcessing(false);
        }
    };

    // Function to handle content exclusion updates with cleanup
    const handleExclusionUpdate = async (section, field, selected) => {
        // First update the settings in state
        updateSettings(section, field, selected);

        // Then clean up the excluded content from embeddings
        await cleanupExcludedEmbeddings();
    };

    // Function to clean up excluded content embeddings
    const cleanupExcludedEmbeddings = async () => {
        setIsCleaningUp(true);
        setCleanupStatus(__('Removing embeddings for excluded content...', 'aisk-ai-chat'));

        try {
            const response = await fetch('/wp-json/aisk/v1/cleanup-excluded-embeddings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': nonce
                }
            });

            const data = await response.json();

            if (data.success) {
                setCleanupStatus(data.message || __('Successfully removed embeddings for excluded content.', 'aisk-ai-chat'));
                // Refresh unprocessed count after cleanup
                await loadUnprocessedCount();
            } else {
                setCleanupStatus(`${__('Error:', 'aisk-ai-chat')} ${data.message || __('Failed to remove embeddings for excluded content.', 'aisk-ai-chat')}`);
            }
        } catch (error) {
            console.error('Error cleaning up excluded embeddings:', error);
            setCleanupStatus(`${__('Error:', 'aisk-ai-chat')} ${error.message || __('Failed to remove embeddings for excluded content.', 'aisk-ai-chat')}`);
        } finally {
            // Clear status message after a delay
            setTimeout(() => {
                setCleanupStatus('');
                setIsCleaningUp(false);
            }, 3000);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{__('AI Configuration', 'aisk-ai-chat')}</CardTitle>
                <CardDescription>
                    {__('Configure AI settings and process your content for the chatbot', 'aisk-ai-chat')}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* WooCommerce Integration */}
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label>{__('WooCommerce Integration', 'aisk-ai-chat')}</Label>
                        <p className="text-sm text-gray-500">
                            {__('Enable AI processing for WooCommerce products', 'aisk-ai-chat')}
                        </p>
                        <div className="flex items-center gap-4">
                            <Switch
                                checked={settings.ai_config.woocommerce_enabled}
                                disabled={!isWooCommerceActive}
                                onCheckedChange={(checked) => {
                                    updateSettings('ai_config', 'woocommerce_enabled', checked);
                                }}
                            />
                            {!isWooCommerceActive && (
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="text-blue-500 hover:text-blue-700 p-0"
                                    onClick={async () => {
                                        setProcessing(true);
                                        setProcessMessage(__('Installing WooCommerce...', 'aisk-ai-chat'));

                                        try {
                                            const response = await fetch('/wp-json/aisk/v1/install-woocommerce', {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'X-WP-Nonce': nonce
                                                }
                                            });

                                            const data = await response.json();

                                            if (data.success) {
                                                setIsWooCommerceActive(true);
                                                setProcessMessage(__('WooCommerce installed and activated successfully!', 'aisk-ai-chat'));
                                                setTimeout(() => {
                                                    setProcessing(false);
                                                    setProcessMessage('');
                                                }, 2000);
                                            } else {
                                                setProcessMessage(data.message || __('Failed to install WooCommerce', 'aisk-ai-chat'));
                                                setTimeout(() => {
                                                    setProcessing(false);
                                                    setProcessMessage('');
                                                }, 2000);
                                            }
                                        } catch (error) {
                                            console.error('Error installing WooCommerce:', error);
                                            setProcessMessage(__('Error installing WooCommerce', 'aisk-ai-chat'));
                                            setTimeout(() => {
                                                setProcessing(false);
                                                setProcessMessage('');
                                            }, 2000);
                                        }
                                    }}
                                >
                                    {__('Install & Activate WooCommerce', 'aisk-ai-chat')}
                                </Button>
                            )}
                            {processing && processMessage && (
                                <p className="text-sm text-green-500">{processMessage}</p>
                            )}
                        </div>
                    </div>
                </div>

                {settings.ai_config.woocommerce_enabled && isWooCommerceActive && (
                    <div>
                        <Label className="mb-2 block">{__('Excluded Products', 'aisk-ai-chat')}</Label>
                        <MultiSelect
                            options={products}
                            selected={settings.ai_config.excluded_products || []}
                            onChange={(selected) => handleExclusionUpdate('ai_config', 'excluded_products', selected)}
                            placeholder={isLoading ?
                                __('Loading products...', 'aisk-ai-chat') :
                                products.length ?
                                    settings.ai_config.excluded_products?.length ?
                                        '' :
                                        __('Select products to exclude...', 'aisk-ai-chat') :
                                    __('No products found', 'aisk-ai-chat')
                            }
                            disabled={isLoading || !products.length || isCleaningUp}
                            type="product"
                        />
                    </div>
                )}

                {/* Content Types */}
                <div className="space-y-3">
                    <Label>{__('Content Types', 'aisk-ai-chat')}</Label>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="posts"
                                checked={settings.ai_config.included_post_types.includes('post')}
                                onCheckedChange={(checked) => {
                                    const types = checked
                                        ? [...settings.ai_config.included_post_types, 'post']
                                        : settings.ai_config.included_post_types.filter(t => t !== 'post');
                                    updateSettings('ai_config', 'included_post_types', types);
                                }}
                            />
                            <label htmlFor="posts" className="text-sm font-medium">{__('Posts', 'aisk-ai-chat')}</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="pages"
                                checked={settings.ai_config.included_post_types.includes('page')}
                                onCheckedChange={(checked) => {
                                    const types = checked
                                        ? [...settings.ai_config.included_post_types, 'page']
                                        : settings.ai_config.included_post_types.filter(t => t !== 'page');
                                    updateSettings('ai_config', 'included_post_types', types);
                                }}
                            />
                            <label htmlFor="pages" className="text-sm font-medium">{__('Pages', 'aisk-ai-chat')}</label>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    {error ? (
                        <Alert>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    ) : (
                        <div className="space-y-4">
                            {settings.ai_config.included_post_types.includes('post') && (
                                <div>
                                    <Label className="mb-2 block">{__('Excluded Posts', 'aisk-ai-chat')}</Label>
                                    <MultiSelect
                                        options={posts}
                                        selected={settings.ai_config.excluded_posts || []}
                                        onChange={(selected) => handleExclusionUpdate('ai_config', 'excluded_posts', selected)}
                                        placeholder={isLoading ?
                                            __('Loading posts...', 'aisk-ai-chat') :
                                            posts.length ?
                                                settings.ai_config.excluded_posts?.length ?
                                                    '' :
                                                    __('Select posts to exclude...', 'aisk-ai-chat') :
                                                __('No posts found', 'aisk-ai-chat')
                                        }
                                        disabled={isLoading || !posts.length || isCleaningUp}
                                        type="post"
                                    />
                                </div>
                            )}
                            {settings.ai_config.included_post_types.includes('page') && (
                                <div>
                                    <Label className="mb-2 block">{__('Excluded Pages', 'aisk-ai-chat')}</Label>
                                    <MultiSelect
                                        options={pages}
                                        selected={settings.ai_config.excluded_pages || []}
                                        onChange={(selected) => handleExclusionUpdate('ai_config', 'excluded_pages', selected)}
                                        placeholder={isLoading ?
                                            __('Loading pages...', 'aisk-ai-chat') :
                                            pages.length ?
                                                settings.ai_config.excluded_pages?.length ?
                                                    '' :
                                                    __('Select pages to exclude...', 'aisk-ai-chat') :
                                                __('No pages found', 'aisk-ai-chat')
                                        }
                                        disabled={isLoading || !pages.length || isCleaningUp}
                                        type="page"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* External Sources Section - Using the separated UrlProcessing component */}
                <UrlProcessing settings={settings} updateSettings={updateSettings} />

                {/* PDF Sources Section - Using the separated PdfProcessing component */}
                <PdfProcessing
                    settings={settings}
                    updateSettings={updateSettings}
                    isActiveConfigTab={true}
                />

                {/* Contact Information */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="contact_info">{__('Contact Information', 'aisk-ai-chat')}</Label>
                        {settings.ai_config.contact_info !== originalContactInfo && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {__('Modified', 'aisk-ai-chat')}
                            </span>
                        )}
                    </div>
                    <Textarea
                        id="contact_info"
                        value={settings.ai_config.contact_info || ''}
                        onChange={(e) => updateSettings('ai_config', 'contact_info', e.target.value)}
                        placeholder={__(
                            'Store Hours: Mon-Fri 9am-5pm\n' +
                            'Phone: (555) 123-4567\n' +
                            'Email: support@example.com\n' +
                            'Address: 123 Main St, City, State 12345\n' +
                            'Support Team: John (Sales), Mary (Technical Support)',
                            'aisk-ai-chat'
                        )}
                        className={`h-40 ${settings.ai_config.contact_info !== originalContactInfo ? 'border-blue-300 bg-blue-50' : ''}`}
                    />
                    <p className="text-sm text-muted-foreground text-gray-500">
                        {__('Add contact information that the chatbot can share when users ask about contacting support or visiting your store.', 'aisk-ai-chat')}
                    </p>
                </div>

                {/* Custom Content */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="custom_content">{__('Custom Content', 'aisk-ai-chat')}</Label>
                        {settings.ai_config.custom_content !== originalCustomContent && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {__('Modified', 'aisk-ai-chat')}
                            </span>
                        )}
                    </div>
                    <Textarea
                        id="custom_content"
                        value={settings.ai_config.custom_content || ''}
                        onChange={(e) => updateSettings('ai_config', 'custom_content', e.target.value)}
                        placeholder={__(
                            'Return Policy: Items can be returned within 30 days of purchase with original receipt.\n' +
                            'Shipping Information: Free shipping on orders over $50. Standard shipping takes 3-5 business days.\n' +
                            'Store Locations: Downtown Store (123 Main St), Mall Store (456 Shopping Ave)',
                            'aisk-ai-chat'
                        )}
                        className={`h-60 ${settings.ai_config.custom_content !== originalCustomContent ? 'border-blue-300 bg-blue-50' : ''}`}
                    />
                    <p className="text-sm text-muted-foreground text-gray-500">
                        {__('Add any additional information that you want the chatbot to know about your business, policies, or services.', 'aisk-ai-chat')}
                    </p>
                </div>

                {/* Batch Size */}
                <div className="space-y-2">
                    <Label htmlFor="batch_size">{__('Processing Batch Size', 'aisk-ai-chat')}</Label>
                    <Input
                        id="batch_size"
                        type="number"
                        min="1"
                        max="50"
                        value={settings.ai_config.batch_size}
                        onChange={(e) => updateSettings('ai_config', 'batch_size', parseInt(e.target.value))}
                    />
                    <p className="text-sm text-gray-500">
                        {__('Number of items to process in each batch', 'aisk-ai-chat')}
                    </p>
                </div>

                {/* Knowledge Base Processing */}
                <div className="space-y-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                        <div>
                            <h4 className="text-sm font-medium">{__('Knowledge Base Processing', 'aisk-ai-chat')}</h4>
                            <p className="text-sm text-gray-500">
                                {__('Unprocessed items:', 'aisk-ai-chat')} {unprocessedCount + (hasSettingsChanges ? 1 : 0)}
                                {hasSettingsChanges && (
                                    <span className="text-blue-600 ml-1">
                                        ({__('includes Contact Information & Custom Content changes', 'aisk-ai-chat')})
                                    </span>
                                )}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={cleanupExcludedEmbeddings}
                                disabled={processing || isCleaningUp}
                            >
                                {isCleaningUp ? __('Cleaning...', 'aisk-ai-chat') : __('Clean Excluded Content', 'aisk-ai-chat')}
                            </Button>

                            <Button
                                onClick={processContent}
                                disabled={processing || isCleaningUp}
                            >
                                {processing ? __('Processing...', 'aisk-ai-chat') : __('Generate Embeddings', 'aisk-ai-chat')}
                            </Button>
                        </div>
                    </div>

                    {(processing || processMessage || isCleaningUp || cleanupStatus) && (
                        <div className="space-y-2">
                            {processing && <Progress value={progress} />}
                            {processMessage && (
                                <p className={`text-sm ${processMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                                    {processMessage}
                                </p>
                            )}
                            {cleanupStatus && (
                                <p className={`text-sm ${cleanupStatus.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                                    {cleanupStatus}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default AiConfigSettings;