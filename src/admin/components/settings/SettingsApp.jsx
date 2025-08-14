import { __ } from '@wordpress/i18n';
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/hooks/use-toast"
import {
    Settings,
    MessageSquare,
    Wand2,
    Share2,
    MoreHorizontal,
    HelpCircle,
    ExternalLink,
    CheckCircle2,
    XCircle
} from 'lucide-react';

import ChatWidgetSettings from './ChatWidgetSettings';
import AiConfigSettings from './AiConfigSettings';
import IntegrationsSettings from './IntegrationsSettings';
import MiscSettings from './MiscSettings';
import {buttonVariants} from "../../../components/ui/button";


const SettingsApp = () => {
    const { toast } = useToast()
    const [settings, setSettings] = useState({
        general: {
            auth_key: '',
            openai_key: '',
        },
        chatwidget: {
            chat_icon: '',
            widget_logo: '',
            widget_text: '',
            widget_color: '#1976d2',
            suggested_questions: [],
            widget_position: 'bottom-right',
            widget_greeting: '',
            widget_placeholder: '',
            widget_title: '',
    
        },
        ai_config: {
            woocommerce_enabled: false,
            included_post_types: ['post', 'page'],
            excluded_posts: [],
            excluded_pages: [],
            excluded_products: [],
            exclude_categories: [],
            contact_info: '',
            custom_content: '',
            batch_size: 10,
            max_context_length: 2000,
        },
        integrations: {
            whatsapp: {
                enabled: false,
                account_sid: '',
                auth_token: '',
                phone_number: '',
                welcome_message: '',
                enable_template_messages: false,
            },
            telegram: {
                enabled: false,
                bot_token: '',
                bot_username: '',
                welcome_message: '',
            },
            contact_form: {
                enabled: false,
                shortcode: '',
            },
        },
        misc: {
            custom_css: '',
        },
    });

    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [activeTab, setActiveTab] = useState("general");
    const [activeIntegrationTab, setActiveIntegrationTab] = useState("whatsapp");
    const { nonce, apiUrl } = settings;

    useEffect(() => {
        // Load settings from WordPress on mount
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const response = await fetch('/wp-json/aisk/v1/settings', {
                headers: {
                    'X-WP-Nonce': AiskSettings.nonce
                }
            });
            const data = await response.json();
            if (data) {
                setSettings(prevSettings => ({
                    ...prevSettings,
                    ...data
                }));
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    const saveSettings = async () => {
        setIsSaving(true);
        try {
            const response = await fetch('/wp-json/aisk/v1/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': AiskSettings.nonce
                },
                body: JSON.stringify(settings)
            });

            if (response.ok) {
                toast({
                    title: (
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>{__('Settings saved successfully!', 'promo-bar-x')}</span>
                        </div>
                    ),
                    description: __('Your changes have been applied.', 'promo-bar-x'),
                    className: "bg-green-50 border-green-200"
                });
            } else {
                throw new Error('Failed to save settings');
            }
        } catch (error) {
            toast({
                title: (
                    <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span>{__('Failed to save settings', 'promo-bar-x')}</span>
                    </div>
                ),
                description: __('Please try again or contact support if the problem persists.', 'promo-bar-x'),
                className: "bg-red-50 border-red-200"
            });
        } finally {
            setIsSaving(false);
        }
    };

    const updateSettings = (section, key, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
    };

    return (
        <>
            <div className="container mx-auto p-6">
                <Card className="mb-6">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-2xl">{__('PromoBarX Settings', 'promo-bar-x')}</CardTitle>
                                <CardDescription>
                                    {__('Configure your chatbot and integration settings', 'promo-bar-x')}
                                </CardDescription>
                            </div>
                            <div className="space-x-3">
                                <a href="https://aisk.chat/support"
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className={buttonVariants({ variant: "default" })}
                                >
                                    <HelpCircle className="w-4 h-4 mr-2" />
                                    {__('Need Help?', 'promo-bar-x')}
                                </a>

                                <a href="https://aisk.chat/docs"
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className={buttonVariants({ variant: "outline" })}
                                >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    {__('Documentation', 'promo-bar-x')}
                                </a>
                            </div>
                        </div>
                    </CardHeader>
                </Card>
                {saveMessage && (
                    <Alert className="mb-6">
                        <AlertDescription>{saveMessage}</AlertDescription>
                    </Alert>
                )}

                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="mb-4">
                        <TabsTrigger value="general" className="flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            {__('General', 'promo-bar-x')}
                        </TabsTrigger>
                        <TabsTrigger value="chatwidget" className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            {__('Chat Widget', 'promo-bar-x')}
                        </TabsTrigger>
                        <TabsTrigger value="ai_config" className="flex items-center gap-2">
                            <Wand2 className="w-4 h-4" />
                            {__('AI Config', 'promo-bar-x')}
                        </TabsTrigger>
                        <TabsTrigger value="integrations" className="flex items-center gap-2">
                            <Share2 className="w-4 h-4" />
                            {__('Integrations', 'promo-bar-x')}
                        </TabsTrigger>
                        <TabsTrigger value="misc" className="flex items-center gap-2">
                            <MoreHorizontal className="w-4 h-4" />
                            {__('Misc', 'promo-bar-x')}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="general">
                        <Card>
                            <CardHeader>
                                <CardTitle>{__('General Settings', 'promo-bar-x')}</CardTitle>
                                <CardDescription>
                                    {__('Configure your API keys and general settings', 'promo-bar-x')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 max-w-2xl">
                                <div className="space-y-2">
                                    <Label htmlFor="auth_key">{__('Aisk Auth Key', 'promo-bar-x')}</Label>
                                    <Input
                                        id="auth_key"
                                        value={settings.general.auth_key}
                                        onChange={(e) => updateSettings('general', 'auth_key', e.target.value)}
                                        type="password"
                                        className="max-w-xl"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {__('Get your auth key from', 'promo-bar-x')}{" "}
                                        <a
                                            href="https://app.aisk.chat/dashboard/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:text-primary/80 underline"
                                        >
                                            https://app.aisk.chat/dashboard/
                                        </a>
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="openai_key">{__('OpenAI API Key', 'promo-bar-x')}</Label>
                                    <Input
                                        id="openai_key"
                                        value={settings.general.openai_key}
                                        onChange={(e) => updateSettings('general', 'openai_key', e.target.value)}
                                        type="password"
                                        className="max-w-xl"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {__('Generate your API key at', 'promo-bar-x')}{" "}
                                        <a
                                            href="https://platform.openai.com/api-keys"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:text-primary/80 underline"
                                        >
                                            platform.openai.com/api-keys
                                        </a>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="chatwidget">
                        <ChatWidgetSettings
                            settings={settings}
                            updateSettings={updateSettings}
                        />
                    </TabsContent>

                    <TabsContent value="ai_config">
                        <AiConfigSettings
                            settings={settings}
                            updateSettings={updateSettings}
                        />
                    </TabsContent>

                    <TabsContent value="integrations">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <Tabs value={activeIntegrationTab} onValueChange={setActiveIntegrationTab}>

                                <TabsContent value="whatsapp">
                                    <IntegrationsSettings
                                        type="whatsapp"
                                        settings={settings}
                                        updateSettings={updateSettings}
                                    />
                                </TabsContent>

                                <TabsContent value="telegram">
                                    <IntegrationsSettings
                                        type="telegram"
                                        settings={settings}
                                        updateSettings={updateSettings}
                                    />
                                </TabsContent>

                                <TabsContent value="webhook">
                                    <IntegrationsSettings
                                        type="webhook"
                                        settings={settings}
                                        updateSettings={updateSettings}
                                    />
                                </TabsContent>

                                <TabsContent value="contact_form">
                                    <IntegrationsSettings
                                        type="contact_form"
                                        settings={settings}
                                        updateSettings={updateSettings}
                                    />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </TabsContent>

                    <TabsContent value="misc">
                        <MiscSettings
                            settings={settings}
                            updateSettings={updateSettings}
                        />
                    </TabsContent>

                </Tabs>

                <div className="mt-6 flex justify-end">
                    <Button
                        onClick={saveSettings}
                        disabled={isSaving}
                    >
                        {isSaving ? __('Saving...', 'promo-bar-x') : __('Save Settings', 'promo-bar-x')}
                    </Button>
                </div>
            </div>
            <Toaster />
        </>
    );
};

export default SettingsApp;