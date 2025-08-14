import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { useToast } from '../../hooks/use-toast';
import { 
  Settings, 
  Palette, 
  MessageSquare, 
  Globe, 
  Zap, 
  Save, 
  Eye, 
  EyeOff,
  Copy,
  Check,
  AlertCircle,
  Info
} from 'lucide-react';

const EnhancedSettingsApp = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      enablePromoBar: true,
      barPosition: 'top',
      barHeight: '60px',
      autoHide: false,
      hideDelay: 3000,
      showOnMobile: true,
      showOnDesktop: true,
    },
    appearance: {
      backgroundColor: '#2563eb',
      textColor: '#ffffff',
      fontSize: '16px',
      fontWeight: '500',
      borderRadius: '4px',
      shadow: true,
      animation: 'slide-down',
      customCSS: '',
    },
    content: {
      message: '🎉 Special Offer: Get 20% off on all products! Limited time only.',
      ctaText: 'Shop Now',
      ctaUrl: '/shop',
      showCloseButton: true,
      closeButtonText: '×',
      showCountdown: false,
      countdownDate: '',
    },
    targeting: {
      showOnPages: ['home', 'shop', 'product'],
      excludePages: [],
      userRoles: ['all'],
      deviceTypes: ['desktop', 'mobile', 'tablet'],
      showAfterScroll: false,
      scrollPercentage: 50,
      showAfterTime: false,
      timeDelay: 5000,
    },
    analytics: {
      trackClicks: true,
      trackViews: true,
      trackConversions: true,
      googleAnalytics: false,
      gaEventName: 'promo_bar_click',
    }
  });

  const { toast } = useToast();

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      const timer = setTimeout(() => {
        handleAutoSave();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [settings, hasUnsavedChanges]);

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleAutoSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasUnsavedChanges(false);
      toast({
        title: "Settings auto-saved",
        description: "Your changes have been automatically saved.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Auto-save failed",
        description: "Please save manually.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setHasUnsavedChanges(false);
      toast({
        title: "Settings saved successfully",
        description: "All changes have been applied.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    // Reset to default settings
    setSettings({
      general: {
        enablePromoBar: true,
        barPosition: 'top',
        barHeight: '60px',
        autoHide: false,
        hideDelay: 3000,
        showOnMobile: true,
        showOnDesktop: true,
      },
      appearance: {
        backgroundColor: '#2563eb',
        textColor: '#ffffff',
        fontSize: '16px',
        fontWeight: '500',
        borderRadius: '4px',
        shadow: true,
        animation: 'slide-down',
        customCSS: '',
      },
      content: {
        message: '🎉 Special Offer: Get 20% off on all products! Limited time only.',
        ctaText: 'Shop Now',
        ctaUrl: '/shop',
        showCloseButton: true,
        closeButtonText: '×',
        showCountdown: false,
        countdownDate: '',
      },
      targeting: {
        showOnPages: ['home', 'shop', 'product'],
        excludePages: [],
        userRoles: ['all'],
        deviceTypes: ['desktop', 'mobile', 'tablet'],
        showAfterScroll: false,
        scrollPercentage: 50,
        showAfterTime: false,
        timeDelay: 5000,
      },
      analytics: {
        trackClicks: true,
        trackViews: true,
        trackConversions: true,
        googleAnalytics: false,
        gaEventName: 'promo_bar_click',
      }
    });
    setHasUnsavedChanges(false);
    toast({
      title: "Settings reset",
      description: "All settings have been reset to defaults.",
      variant: "default",
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard.",
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Settings className="w-8 h-8 text-blue-600" />
                Promo Bar Settings
              </h1>
              <p className="text-gray-600 mt-2">
                Configure your promotional bar to maximize conversions and user engagement
              </p>
            </div>
            <div className="flex items-center gap-3">
              {hasUnsavedChanges && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Unsaved changes
                </Badge>
              )}
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isLoading}
              >
                Reset to Defaults
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading || !hasUnsavedChanges}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Progress indicator */}
          {isLoading && (
            <div className="mt-4">
              <Progress value={hasUnsavedChanges ? 50 : 100} className="h-2" />
            </div>
          )}
        </div>

        {/* Main Settings */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="targeting" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Targeting
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  General Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enablePromoBar">Enable Promo Bar</Label>
                      <Switch
                        id="enablePromoBar"
                        checked={settings.general.enablePromoBar}
                        onCheckedChange={(checked) => 
                          handleSettingChange('general', 'enablePromoBar', checked)
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="barPosition">Bar Position</Label>
                      <Select
                        value={settings.general.barPosition}
                        onValueChange={(value) => 
                          handleSettingChange('general', 'barPosition', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top">Top</SelectItem>
                          <SelectItem value="bottom">Bottom</SelectItem>
                          <SelectItem value="floating">Floating</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="barHeight">Bar Height</Label>
                      <Input
                        id="barHeight"
                        value={settings.general.barHeight}
                        onChange={(e) => 
                          handleSettingChange('general', 'barHeight', e.target.value)
                        }
                        placeholder="60px"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="autoHide">Auto Hide</Label>
                      <Switch
                        id="autoHide"
                        checked={settings.general.autoHide}
                        onCheckedChange={(checked) => 
                          handleSettingChange('general', 'autoHide', checked)
                        }
                      />
                    </div>

                    {settings.general.autoHide && (
                      <div className="space-y-2">
                        <Label htmlFor="hideDelay">Hide Delay (ms)</Label>
                        <Input
                          id="hideDelay"
                          type="number"
                          value={settings.general.hideDelay}
                          onChange={(e) => 
                            handleSettingChange('general', 'hideDelay', parseInt(e.target.value))
                          }
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Device Visibility</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={settings.general.showOnMobile}
                            onCheckedChange={(checked) => 
                              handleSettingChange('general', 'showOnMobile', checked)
                            }
                          />
                          <Label>Show on Mobile</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={settings.general.showOnDesktop}
                            onCheckedChange={(checked) => 
                              handleSettingChange('general', 'showOnDesktop', checked)
                            }
                          />
                          <Label>Show on Desktop</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Visual Design
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="backgroundColor">Background Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="backgroundColor"
                          value={settings.appearance.backgroundColor}
                          onChange={(e) => 
                            handleSettingChange('appearance', 'backgroundColor', e.target.value)
                          }
                          type="color"
                          className="w-16 h-10"
                        />
                        <Input
                          value={settings.appearance.backgroundColor}
                          onChange={(e) => 
                            handleSettingChange('appearance', 'backgroundColor', e.target.value)
                          }
                          placeholder="#2563eb"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="textColor">Text Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="textColor"
                          value={settings.appearance.textColor}
                          onChange={(e) => 
                            handleSettingChange('appearance', 'textColor', e.target.value)
                          }
                          type="color"
                          className="w-16 h-10"
                        />
                        <Input
                          value={settings.appearance.textColor}
                          onChange={(e) => 
                            handleSettingChange('appearance', 'textColor', e.target.value)
                          }
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fontSize">Font Size</Label>
                      <Select
                        value={settings.appearance.fontSize}
                        onValueChange={(value) => 
                          handleSettingChange('appearance', 'fontSize', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="14px">Small (14px)</SelectItem>
                          <SelectItem value="16px">Medium (16px)</SelectItem>
                          <SelectItem value="18px">Large (18px)</SelectItem>
                          <SelectItem value="20px">Extra Large (20px)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fontWeight">Font Weight</Label>
                      <Select
                        value={settings.appearance.fontWeight}
                        onValueChange={(value) => 
                          handleSettingChange('appearance', 'fontWeight', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="400">Normal</SelectItem>
                          <SelectItem value="500">Medium</SelectItem>
                          <SelectItem value="600">Semi Bold</SelectItem>
                          <SelectItem value="700">Bold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="borderRadius">Border Radius</Label>
                      <Input
                        id="borderRadius"
                        value={settings.appearance.borderRadius}
                        onChange={(e) => 
                          handleSettingChange('appearance', 'borderRadius', e.target.value)
                        }
                        placeholder="4px"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="shadow">Enable Shadow</Label>
                      <Switch
                        id="shadow"
                        checked={settings.appearance.shadow}
                        onCheckedChange={(checked) => 
                          handleSettingChange('appearance', 'shadow', checked)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="animation">Animation</Label>
                      <Select
                        value={settings.appearance.animation}
                        onValueChange={(value) => 
                          handleSettingChange('appearance', 'animation', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="slide-down">Slide Down</SelectItem>
                          <SelectItem value="slide-up">Slide Up</SelectItem>
                          <SelectItem value="fade-in">Fade In</SelectItem>
                          <SelectItem value="bounce">Bounce</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customCSS">Custom CSS</Label>
                  <Textarea
                    id="customCSS"
                    value={settings.appearance.customCSS}
                    onChange={(e) => 
                      handleSettingChange('appearance', 'customCSS', e.target.value)
                    }
                    placeholder="/* Add your custom CSS here */"
                    rows={4}
                  />
                  <p className="text-sm text-gray-500">
                    Add custom CSS to further customize the promo bar appearance
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Settings */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Content & Messaging
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="message">Promotional Message</Label>
                    <Textarea
                      id="message"
                      value={settings.content.message}
                      onChange={(e) => 
                        handleSettingChange('content', 'message', e.target.value)
                      }
                      placeholder="Enter your promotional message here..."
                      rows={3}
                    />
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Use emojis and compelling copy to increase engagement</span>
                      <span>{settings.content.message.length}/200</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ctaText">Call-to-Action Text</Label>
                      <Input
                        id="ctaText"
                        value={settings.content.ctaText}
                        onChange={(e) => 
                          handleSettingChange('content', 'ctaText', e.target.value)
                        }
                        placeholder="Shop Now"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ctaUrl">Call-to-Action URL</Label>
                      <Input
                        id="ctaUrl"
                        value={settings.content.ctaUrl}
                        onChange={(e) => 
                          handleSettingChange('content', 'ctaUrl', e.target.value)
                        }
                        placeholder="/shop"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="showCloseButton">Show Close Button</Label>
                    <Switch
                      id="showCloseButton"
                      checked={settings.content.showCloseButton}
                      onCheckedChange={(checked) => 
                        handleSettingChange('content', 'showCloseButton', checked)
                      }
                    />
                  </div>

                  {settings.content.showCloseButton && (
                    <div className="space-y-2">
                      <Label htmlFor="closeButtonText">Close Button Text</Label>
                      <Input
                        id="closeButtonText"
                        value={settings.content.closeButtonText}
                        onChange={(e) => 
                          handleSettingChange('content', 'closeButtonText', e.target.value)
                        }
                        placeholder="×"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Label htmlFor="showCountdown">Show Countdown Timer</Label>
                    <Switch
                      id="showCountdown"
                      checked={settings.content.showCountdown}
                      onCheckedChange={(checked) => 
                        handleSettingChange('content', 'showCountdown', checked)
                      }
                    />
                  </div>

                  {settings.content.showCountdown && (
                    <div className="space-y-2">
                      <Label htmlFor="countdownDate">Countdown End Date</Label>
                      <Input
                        id="countdownDate"
                        type="datetime-local"
                        value={settings.content.countdownDate}
                        onChange={(e) => 
                          handleSettingChange('content', 'countdownDate', e.target.value)
                        }
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Targeting Settings */}
          <TabsContent value="targeting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Audience Targeting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Show on Pages</Label>
                      <div className="space-y-2">
                        {['home', 'shop', 'product', 'cart', 'checkout'].map((page) => (
                          <div key={page} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`page-${page}`}
                              checked={settings.targeting.showOnPages.includes(page)}
                              onChange={(e) => {
                                const newPages = e.target.checked
                                  ? [...settings.targeting.showOnPages, page]
                                  : settings.targeting.showOnPages.filter(p => p !== page);
                                handleSettingChange('targeting', 'showOnPages', newPages);
                              }}
                            />
                            <Label htmlFor={`page-${page}`} className="capitalize">
                              {page}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>User Roles</Label>
                      <Select
                        value={settings.targeting.userRoles[0]}
                        onValueChange={(value) => 
                          handleSettingChange('targeting', 'userRoles', [value])
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="guest">Guests Only</SelectItem>
                          <SelectItem value="logged-in">Logged-in Users</SelectItem>
                          <SelectItem value="subscriber">Subscribers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Device Types</Label>
                      <div className="space-y-2">
                        {['desktop', 'mobile', 'tablet'].map((device) => (
                          <div key={device} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`device-${device}`}
                              checked={settings.targeting.deviceTypes.includes(device)}
                              onChange={(e) => {
                                const newDevices = e.target.checked
                                  ? [...settings.targeting.deviceTypes, device]
                                  : settings.targeting.deviceTypes.filter(d => d !== device);
                                handleSettingChange('targeting', 'deviceTypes', newDevices);
                              }}
                            />
                            <Label htmlFor={`device-${device}`} className="capitalize">
                              {device}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="showAfterScroll">Show After Scroll</Label>
                      <Switch
                        id="showAfterScroll"
                        checked={settings.targeting.showAfterScroll}
                        onCheckedChange={(checked) => 
                          handleSettingChange('targeting', 'showAfterScroll', checked)
                        }
                      />
                    </div>

                    {settings.targeting.showAfterScroll && (
                      <div className="space-y-2">
                        <Label htmlFor="scrollPercentage">Scroll Percentage</Label>
                        <Input
                          id="scrollPercentage"
                          type="number"
                          min="0"
                          max="100"
                          value={settings.targeting.scrollPercentage}
                          onChange={(e) => 
                            handleSettingChange('targeting', 'scrollPercentage', parseInt(e.target.value))
                          }
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <Label htmlFor="showAfterTime">Show After Time Delay</Label>
                      <Switch
                        id="showAfterTime"
                        checked={settings.targeting.showAfterTime}
                        onCheckedChange={(checked) => 
                          handleSettingChange('targeting', 'showAfterTime', checked)
                        }
                      />
                    </div>

                    {settings.targeting.showAfterTime && (
                      <div className="space-y-2">
                        <Label htmlFor="timeDelay">Time Delay (ms)</Label>
                        <Input
                          id="timeDelay"
                          type="number"
                          value={settings.targeting.timeDelay}
                          onChange={(e) => 
                            handleSettingChange('targeting', 'timeDelay', parseInt(e.target.value))
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Settings */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Analytics & Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="trackClicks">Track Clicks</Label>
                      <Switch
                        id="trackClicks"
                        checked={settings.analytics.trackClicks}
                        onCheckedChange={(checked) => 
                          handleSettingChange('analytics', 'trackClicks', checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="trackViews">Track Views</Label>
                      <Switch
                        id="trackViews"
                        checked={settings.analytics.trackViews}
                        onCheckedChange={(checked) => 
                          handleSettingChange('analytics', 'trackViews', checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="trackConversions">Track Conversions</Label>
                      <Switch
                        id="trackConversions"
                        checked={settings.analytics.trackConversions}
                        onCheckedChange={(checked) => 
                          handleSettingChange('analytics', 'trackConversions', checked)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="googleAnalytics">Google Analytics Integration</Label>
                      <Switch
                        id="googleAnalytics"
                        checked={settings.analytics.googleAnalytics}
                        onCheckedChange={(checked) => 
                          handleSettingChange('analytics', 'googleAnalytics', checked)
                        }
                      />
                    </div>

                    {settings.analytics.googleAnalytics && (
                      <div className="space-y-2">
                        <Label htmlFor="gaEventName">GA Event Name</Label>
                        <Input
                          id="gaEventName"
                          value={settings.analytics.gaEventName}
                          onChange={(e) => 
                            handleSettingChange('analytics', 'gaEventName', e.target.value)
                          }
                          placeholder="promo_bar_click"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Analytics Preview */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Analytics Preview</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Views:</span>
                      <span className="font-medium">1,234</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Clicks:</span>
                      <span className="font-medium">89</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Click-through Rate:</span>
                      <span className="font-medium text-green-600">7.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversions:</span>
                      <span className="font-medium text-blue-600">23</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Preview Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Live Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="w-full p-4 rounded-lg border-2 border-dashed border-gray-300"
              style={{
                backgroundColor: settings.appearance.backgroundColor,
                color: settings.appearance.textColor,
                fontSize: settings.appearance.fontSize,
                fontWeight: settings.appearance.fontWeight,
                borderRadius: settings.appearance.borderRadius,
                boxShadow: settings.appearance.shadow ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                position: 'relative',
                minHeight: settings.general.barHeight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div className="flex-1">
                {settings.content.message}
              </div>
              <div className="flex items-center gap-3">
                {settings.content.showCountdown && settings.content.countdownDate && (
                  <span className="text-sm font-medium">
                    ⏰ {new Date(settings.content.countdownDate).toLocaleDateString()}
                  </span>
                )}
                <Button
                  size="sm"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  {settings.content.ctaText}
                </Button>
                {settings.content.showCloseButton && (
                  <button className="text-white hover:text-gray-200 text-xl font-bold">
                    {settings.content.closeButtonText}
                  </button>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              This is a preview of how your promo bar will appear on your website
            </p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Button
            variant="outline"
            onClick={() => copyToClipboard(JSON.stringify(settings, null, 2))}
            className="flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Export Settings
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              // Import settings functionality
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.json';
              input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    try {
                      const importedSettings = JSON.parse(e.target.result);
                      setSettings(importedSettings);
                      setHasUnsavedChanges(true);
                      toast({
                        title: "Settings imported",
                        description: "Your settings have been imported successfully.",
                        variant: "default",
                      });
                    } catch (error) {
                      toast({
                        title: "Import failed",
                        description: "Invalid settings file.",
                        variant: "destructive",
                      });
                    }
                  };
                  reader.readAsText(file);
                }
              };
              input.click();
            }}
            className="flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Import Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSettingsApp;
