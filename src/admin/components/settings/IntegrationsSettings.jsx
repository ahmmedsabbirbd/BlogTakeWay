import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Mail, Send, Copy, Check, ExternalLink } from 'lucide-react';
import { __ } from '@wordpress/i18n';
import { Button } from "@/components/ui/button";
const IntegrationsSettings = ({ settings, updateSettings }) => {
    const [copiedWhatsapp, setCopiedWhatsapp] = useState(false);
    const [copiedTelegram, setCopiedTelegram] = useState(false);
    const updateIntegrationSettings = (integration, key, value) => {
        updateSettings('integrations', integration, {
            ...settings.integrations[integration],
            [key]: value
        });
    };
    const copyToClipboard = (text, type) => {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text)
                    .then(() => {
                        if (type === 'whatsapp') {
                            setCopiedWhatsapp(true);
                            setTimeout(() => setCopiedWhatsapp(false), 2000);
                        } else if (type === 'telegram') {
                            setCopiedTelegram(true);
                            setTimeout(() => setCopiedTelegram(false), 2000);
                        }
                    })
                    .catch(err => {
                        console.error('Failed to copy: ', err);
                        fallbackCopyToClipboard(text, type);
                    });
            } else {
                fallbackCopyToClipboard(text, type);
            }
        } catch (error) {
            console.error('Copy failed:', error);
            fallbackCopyToClipboard(text, type);
        }
    };

    const fallbackCopyToClipboard = (text, type) => {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;

            // Make the textarea out of viewport
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);

            textArea.focus();
            textArea.select();

            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);

            if (successful) {
                if (type === 'whatsapp') {
                    setCopiedWhatsapp(true);
                    setTimeout(() => setCopiedWhatsapp(false), 2000);
                } else if (type === 'telegram') {
                    setCopiedTelegram(true);
                    setTimeout(() => setCopiedTelegram(false), 2000);
                }
            }
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }
    };
    return (
        <Tabs defaultValue="whatsapp" className="w-full">
            <TabsList className="mb-4">
                <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    {__('WhatsApp', 'promo-bar-x')}
                </TabsTrigger>
                <TabsTrigger value="telegram" className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    {__('Telegram', 'promo-bar-x')}
                </TabsTrigger>
                <TabsTrigger value="contact_form" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {__('Contact Form', 'promo-bar-x')}
                </TabsTrigger>
            </TabsList>

            {/* WhatsApp Settings */}
            <TabsContent value="whatsapp">
                <Card>
                    <CardHeader>
                        <CardTitle>{__('WhatsApp Integration', 'promo-bar-x')}</CardTitle>
                        <CardDescription>{__('Configure WhatsApp messaging integration', 'promo-bar-x')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>{__('Enable WhatsApp', 'promo-bar-x')}</Label>
                                <p className="text-sm text-gray-500">{__('Activate WhatsApp integration', 'promo-bar-x')}</p>
                                <Switch
                                    checked={settings.integrations.whatsapp.enabled}
                                    onCheckedChange={(checked) => updateIntegrationSettings('whatsapp', 'enabled', checked)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="account_sid">{__('Twilio Account SID', 'promo-bar-x')}</Label>
                            <Input
                                id="account_sid"
                                value={settings.integrations.whatsapp.account_sid}
                                onChange={(e) => updateIntegrationSettings('whatsapp', 'account_sid', e.target.value)}
                                type="password"
                            />
                            <p className="text-xs text-muted-foreground">
                                {__('Get your SID from', 'promo-bar-x')}{" "}
                                <a
                                    href="https://www.twilio.com/try-twilio"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary/80 underline"
                                >
                                    Twilio Console
                                </a>
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="auth_token">{__('Twilio Auth Token', 'promo-bar-x')}</Label>
                            <Input
                                id="auth_token"
                                value={settings.integrations.whatsapp.auth_token}
                                onChange={(e) => updateIntegrationSettings('whatsapp', 'auth_token', e.target.value)}
                                type="password"
                            />
                            <p className="text-xs text-muted-foreground">
                                {__('Get your auth token from', 'promo-bar-x')}{" "}
                                <a
                                    href="https://www.twilio.com/try-twilio"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary/80 underline"
                                >
                                    Twilio Console
                                </a>
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone_number">{__('WhatsApp Number', 'promo-bar-x')}</Label>
                            <Input
                                id="phone_number"
                                value={settings.integrations.whatsapp.phone_number}
                                onChange={(e) => updateIntegrationSettings('whatsapp', 'phone_number', e.target.value)}
                                placeholder={__('whatsapp:+1234567890', 'promo-bar-x')}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="whatsapp_welcome">{__('Welcome Message', 'promo-bar-x')}</Label>
                            <Textarea
                                id="whatsapp_welcome"
                                value={settings.integrations.whatsapp.welcome_message}
                                onChange={(e) => updateIntegrationSettings('whatsapp', 'welcome_message', e.target.value)}
                                placeholder={__('Enter welcome message', 'promo-bar-x')}
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>{__('Webhook URL', 'promo-bar-x')}</Label>
                            <div className="p-2 bg-gray-100 rounded-md flex items-center justify-between">
                                <code className="text-sm">{window.location.origin}/wp-json/aisk/v1/whatsapp-webhook</code>
                                {/* <code className="text-sm">https://ff13-103-31-154-235.ngrok-free.app/wp-json/aisk/v1/whatsapp-webhook</code> */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(`${window.location.origin}/wp-json/aisk/v1/whatsapp-webhook`, 'whatsapp')}
                                >
                                    {copiedWhatsapp ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                            <p className="text-sm text-gray-500">{__('Set this as your Twilio WhatsApp webhook URL', 'promo-bar-x')}</p>
                        </div>

                        {/* <div className="flex items-center space-x-2">
                            <Switch
                                id="template_messages"
                                checked={settings.integrations.whatsapp.enable_template_messages}
                                onCheckedChange={(checked) => updateIntegrationSettings('whatsapp', 'enable_template_messages', checked)}
                            />
                            <Label htmlFor="template_messages">{__('Enable template messages', 'promo-bar-x')}</Label>
                        </div> */}
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Telegram Settings */}
            <TabsContent value="telegram">
                <Card>
                    <CardHeader>
                        <CardTitle>{__('Telegram Integration', 'promo-bar-x')}</CardTitle>
                        <CardDescription>{__('Configure Telegram bot integration', 'promo-bar-x')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>{__('Enable Telegram', 'promo-bar-x')}</Label>
                                <p className="text-sm text-gray-500">{__('Activate Telegram integration', 'promo-bar-x')}</p>
                                <Switch
                                    checked={settings.integrations.telegram.enabled}
                                    onCheckedChange={(checked) => updateIntegrationSettings('telegram', 'enabled', checked)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bot_token">{__('Bot Token', 'promo-bar-x')}</Label>
                            <Input
                                id="bot_token"
                                value={settings.integrations.telegram.bot_token}
                                onChange={(e) => updateIntegrationSettings('telegram', 'bot_token', e.target.value)}
                                type="password"
                            />
                            <p className="text-sm text-gray-500">{__('Enter the bot token provided by @BotFather', 'promo-bar-x')}</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bot_username">{__('Bot Username', 'promo-bar-x')}</Label>
                            <Input
                                id="bot_username"
                                value={settings.integrations.telegram.bot_username}
                                onChange={(e) => updateIntegrationSettings('telegram', 'bot_username', e.target.value)}
                                placeholder={__('@YourBotUsername', 'promo-bar-x')}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="telegram_welcome">{__('Welcome Message', 'promo-bar-x')}</Label>
                            <Textarea
                                id="telegram_welcome"
                                value={settings.integrations.telegram.welcome_message}
                                onChange={(e) => updateIntegrationSettings('telegram', 'welcome_message', e.target.value)}
                                placeholder={__('Enter welcome message', 'promo-bar-x')}
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>{__('Webhook URL', 'promo-bar-x')}</Label>
                            <div className="p-2 bg-gray-100 rounded-md flex items-center justify-between overflow-x-auto">
                                <code className="text-sm whitespace-nowrap">
                                    https://api.telegram.org/bot%3CTOKEN%3E/setWebhook?url={window.location.origin}/wp-json/aisk/v1/telegram-webhook
                                </code>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(`https://api.telegram.org/bot${settings.integrations.telegram.bot_token || '%3CTOKEN%3E'}/setWebhook?url=${window.location.origin}/wp-json/aisk/v1/telegram-webhook`, 'telegram')}
                                    >
                                        {copiedTelegram ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => window.open(`https://api.telegram.org/bot${settings.integrations.telegram.bot_token || '%3CTOKEN%3E'}/setWebhook?url=${window.location.origin}/wp-json/aisk/v1/telegram-webhook`, '_blank')}
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500">{__('Visit this URL in your browser to set up the webhook', 'promo-bar-x')}</p>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Contact Form Settings */}
            <TabsContent value="contact_form">
                <Card>
                    <CardHeader>
                        <CardTitle>{__('Contact Form Integration', 'promo-bar-x')}</CardTitle>
                        <CardDescription>{__('Configure contact form integration', 'promo-bar-x')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>{__('Enable Contact Form', 'promo-bar-x')}</Label>
                                <p className="text-sm text-gray-500">{__('Activate contact form integration', 'promo-bar-x')}</p>
                                <Switch
                                    checked={settings.integrations.contact_form.enabled}
                                    onCheckedChange={(checked) => updateIntegrationSettings('contact_form', 'enabled', checked)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="shortcode">{__('Form Shortcode', 'promo-bar-x')}</Label>
                            <Input
                                id="shortcode"
                                value={settings.integrations.contact_form.shortcode}
                                onChange={(e) => updateIntegrationSettings('contact_form', 'shortcode', e.target.value)}
                                placeholder={__('[contact-form-7 id=\'\']', 'promo-bar-x')}
                            />
                            <p className="text-sm text-gray-500">{__('Enter your contact form shortcode', 'promo-bar-x')}</p>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
};

export default IntegrationsSettings;