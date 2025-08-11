import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { __ } from '@wordpress/i18n';
const MiscSettings = ({ settings, updateSettings }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{__('Miscellaneous Settings', 'promo-bar-x')}</CardTitle>
                <CardDescription>{__('Additional configuration options', 'promo-bar-x')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="custom_css">{__('Custom CSS', 'promo-bar-x')}</Label>
                    <Textarea
                        id="custom_css"
                        value={settings.misc.custom_css}
                        onChange={(e) => updateSettings('misc', 'custom_css', e.target.value)}
                        placeholder={__('Add your custom CSS', 'promo-bar-x')}
                        className="font-mono h-[480px]"
                        spellCheck="false"
                    />
                    <div className="mt-2 text-sm text-muted-foreground">
                        <p>{__('Available CSS classes for customization:', 'promo-bar-x')}</p>
                        <ul className="mt-2 list-disc pl-4 space-y-1">
                            <li><code>.support-buddy-widget</code> - {__('Main widget container', 'promo-bar-x')}</li>
                            <li><code>.support-buddy-container</code> - {__('Chat container', 'promo-bar-x')}</li>
                            <li><code>.support-buddy-header</code> - {__('Header section', 'promo-bar-x')}</li>
                            <li><code>.support-buddy-messages</code> - {__('Messages container', 'promo-bar-x')}</li>
                            <li><code>.support-buddy-message.user</code> - {__('User message bubbles', 'promo-bar-x')}</li>
                            <li><code>.support-buddy-message.bot</code> - {__('Bot message bubbles', 'promo-bar-x')}</li>
                            <li><code>.support-buddy-input</code> - {__('Input section', 'promo-bar-x')}</li>
                            <li><code>.support-buddy-footer</code> - {__('Footer section', 'promo-bar-x')}</li>
                        </ul>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                        {__('Add custom CSS to modify the chat widget appearance. Changes will be applied to the frontend chat widget.', 'promo-bar-x')}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default MiscSettings;