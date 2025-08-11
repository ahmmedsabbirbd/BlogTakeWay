import React, { useState, useEffect } from 'react';
import { X, Save, Eye, Palette, Type, MousePointer, Clock, Link, Settings } from 'lucide-react';
import ColorPicker from '../ui/ColorPicker';

const TopBarEditor = ({ promoBar, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        subtitle: '',
        cta_text: '',
        cta_url: '',
        countdown_enabled: false,
        countdown_date: '',
        close_button_enabled: true,
        status: 'draft',
        priority: 0,
        template_id: 0,
        styling: {
            background: '#ffffff',
            color: '#333333',
            font_family: 'Inter, sans-serif',
            font_size: '14px',
            padding: '12px 20px',
            border_bottom: '1px solid #e5e7eb'
        },
        cta_style: {
            background: '#4F46E5',
            color: '#ffffff',
            padding: '8px 16px',
            border_radius: '4px',
            font_weight: '500'
        },
        countdown_style: {
            color: '#dc2626',
            font_weight: '600',
            font_family: 'monospace'
        },
        close_button_style: {
            color: '#6b7280',
            font_size: '20px',
            padding: '4px 8px'
        }
    });

    const [activeTab, setActiveTab] = useState('content');
    const [showPreview, setShowPreview] = useState(true);

    useEffect(() => {
        if (promoBar) {
            setFormData({
                ...formData,
                ...promoBar,
                styling: { ...formData.styling, ...(promoBar.styling ? JSON.parse(promoBar.styling) : {}) },
                cta_style: { ...formData.cta_style, ...(promoBar.cta_style ? JSON.parse(promoBar.cta_style) : {}) },
                countdown_style: { ...formData.countdown_style, ...(promoBar.countdown_style ? JSON.parse(promoBar.countdown_style) : {}) },
                close_button_style: { ...formData.close_button_style, ...(promoBar.close_button_style ? JSON.parse(promoBar.close_button_style) : {}) }
            });
        }
    }, [promoBar]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleStyleChange = (styleType, property, value) => {
        setFormData(prev => ({
            ...prev,
            [styleType]: {
                ...prev[styleType],
                [property]: value
            }
        }));
    };

    const handleSave = async () => {
        try {
            if (!window.promobarxAdmin || !window.promobarxAdmin.ajaxurl || !window.promobarxAdmin.nonce) {
                console.error('PromoBarX admin data not available');
                return;
            }
            
            const saveData = {
                ...formData,
                styling: JSON.stringify(formData.styling),
                cta_style: JSON.stringify(formData.cta_style),
                countdown_style: JSON.stringify(formData.countdown_style),
                close_button_style: JSON.stringify(formData.close_button_style)
            };

            const response = await fetch(window.promobarxAdmin.ajaxurl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'promobarx_save',
                    nonce: window.promobarxAdmin.nonce,
                    ...saveData
                })
            });

            const data = await response.json();
            if (data.success) {
                onSave();
            } else {
                alert('Error saving promo bar: ' + data.data);
            }
        } catch (error) {
            console.error('Error saving promo bar:', error);
            alert('Error saving promo bar');
        }
    };

    const generatePreviewStyles = () => {
        const styles = {
            background: formData.styling.background,
            color: formData.styling.color,
            fontFamily: formData.styling.font_family,
            fontSize: formData.styling.font_size,
            padding: formData.styling.padding,
            borderBottom: formData.styling.border_bottom
        };

        return Object.entries(styles)
            .filter(([_, value]) => value)
            .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
            .join('; ');
    };

    const generateCTAStyles = () => {
        const styles = {
            background: formData.cta_style.background,
            color: formData.cta_style.color,
            padding: formData.cta_style.padding,
            borderRadius: formData.cta_style.border_radius,
            fontWeight: formData.cta_style.font_weight
        };

        return Object.entries(styles)
            .filter(([_, value]) => value)
            .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
            .join('; ');
    };

    const generateCountdownStyles = () => {
        const styles = {
            color: formData.countdown_style.color,
            fontWeight: formData.countdown_style.font_weight,
            fontFamily: formData.countdown_style.font_family
        };

        return Object.entries(styles)
            .filter(([_, value]) => value)
            .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
            .join('; ');
    };

    const generateCloseStyles = () => {
        const styles = {
            color: formData.close_button_style.color,
            fontSize: formData.close_button_style.font_size,
            padding: formData.close_button_style.padding
        };

        return Object.entries(styles)
            .filter(([_, value]) => value)
            .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
            .join('; ');
    };

    const tabs = [
        { id: 'content', label: 'Content', icon: Type },
        { id: 'styling', label: 'Styling', icon: Palette },
        { id: 'cta', label: 'CTA Button', icon: MousePointer },
        { id: 'countdown', label: 'Countdown', icon: Clock },
        { id: 'settings', label: 'Settings', icon: Settings }
    ];

    // Check if admin data is available
    if (!window.promobarxAdmin || !window.promobarxAdmin.ajaxurl || !window.promobarxAdmin.nonce) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading PromoBarX admin...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-5/6 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            {promoBar ? 'Edit Promo Bar' : 'Create New Promo Bar'}
                        </h2>
                        <p className="text-sm text-gray-600">Design your promotional top bar</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className={`px-3 py-2 rounded-md text-sm font-medium ${
                                showPreview 
                                    ? 'bg-blue-100 text-blue-700' 
                                    : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                            <Eye className="w-4 h-4 inline mr-1" />
                            Preview
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <Save className="w-4 h-4 inline mr-2" />
                            Save
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Editor Panel */}
                    <div className="w-1/2 border-r border-gray-200 flex flex-col">
                        {/* Tabs */}
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 px-6">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-3 px-1 border-b-2 font-medium text-sm ${
                                            activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        <tab.icon className="w-4 h-4 inline mr-2" />
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {activeTab === 'content' && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Promo Bar Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter promo bar name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => handleInputChange('title', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter main title"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Subtitle
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.subtitle}
                                            onChange={(e) => handleInputChange('subtitle', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter subtitle (optional)"
                                        />
                                    </div>

                                    <div className="flex space-x-4">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                CTA Text
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.cta_text}
                                                onChange={(e) => handleInputChange('cta_text', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Shop Now"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                CTA URL
                                            </label>
                                            <input
                                                type="url"
                                                value={formData.cta_url}
                                                onChange={(e) => handleInputChange('cta_url', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="https://example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.countdown_enabled}
                                                onChange={(e) => handleInputChange('countdown_enabled', e.target.checked)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Enable Countdown Timer</span>
                                        </label>
                                    </div>

                                    {formData.countdown_enabled && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Countdown End Date
                                            </label>
                                            <input
                                                type="datetime-local"
                                                value={formData.countdown_date}
                                                onChange={(e) => handleInputChange('countdown_date', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    )}

                                    <div className="flex items-center space-x-4">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.close_button_enabled}
                                                onChange={(e) => handleInputChange('close_button_enabled', e.target.checked)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Show Close Button</span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'styling' && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Background Color
                                        </label>
                                        <ColorPicker
                                            color={formData.styling.background}
                                            onChange={(color) => handleStyleChange('styling', 'background', color)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Text Color
                                        </label>
                                        <ColorPicker
                                            color={formData.styling.color}
                                            onChange={(color) => handleStyleChange('styling', 'color', color)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Font Family
                                        </label>
                                        <select
                                            value={formData.styling.font_family}
                                            onChange={(e) => handleStyleChange('styling', 'font_family', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="Inter, sans-serif">Inter</option>
                                            <option value="Arial, sans-serif">Arial</option>
                                            <option value="Helvetica, sans-serif">Helvetica</option>
                                            <option value="Georgia, serif">Georgia</option>
                                            <option value="Times New Roman, serif">Times New Roman</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Font Size
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.styling.font_size}
                                            onChange={(e) => handleStyleChange('styling', 'font_size', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="14px"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Padding
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.styling.padding}
                                            onChange={(e) => handleStyleChange('styling', 'padding', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="12px 20px"
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'cta' && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Button Background Color
                                        </label>
                                        <ColorPicker
                                            color={formData.cta_style.background}
                                            onChange={(color) => handleStyleChange('cta_style', 'background', color)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Button Text Color
                                        </label>
                                        <ColorPicker
                                            color={formData.cta_style.color}
                                            onChange={(color) => handleStyleChange('cta_style', 'color', color)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Button Padding
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.cta_style.padding}
                                            onChange={(e) => handleStyleChange('cta_style', 'padding', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="8px 16px"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Border Radius
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.cta_style.border_radius}
                                            onChange={(e) => handleStyleChange('cta_style', 'border_radius', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="4px"
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'countdown' && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Countdown Color
                                        </label>
                                        <ColorPicker
                                            color={formData.countdown_style.color}
                                            onChange={(color) => handleStyleChange('countdown_style', 'color', color)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Font Weight
                                        </label>
                                        <select
                                            value={formData.countdown_style.font_weight}
                                            onChange={(e) => handleStyleChange('countdown_style', 'font_weight', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="400">Normal</option>
                                            <option value="500">Medium</option>
                                            <option value="600">Semi Bold</option>
                                            <option value="700">Bold</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'settings' && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => handleInputChange('status', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="active">Active</option>
                                            <option value="paused">Paused</option>
                                            <option value="archived">Archived</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Priority
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.priority}
                                            onChange={(e) => handleInputChange('priority', parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            min="0"
                                            max="100"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">Higher priority promo bars will be shown first</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Preview Panel */}
                    {showPreview && (
                        <div className="w-1/2 bg-gray-50 p-6">
                            <div className="mb-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Live Preview</h3>
                                <p className="text-sm text-gray-600">See how your promo bar will look on the frontend</p>
                            </div>
                            
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <div 
                                    className="promobarx-preview"
                                    style={generatePreviewStyles()}
                                >
                                    <div className="flex items-center justify-center gap-4 p-4">
                                        {formData.title && (
                                            <div className="font-semibold">{formData.title}</div>
                                        )}
                                        
                                        {formData.subtitle && (
                                            <div className="opacity-90">{formData.subtitle}</div>
                                        )}
                                        
                                        {formData.countdown_enabled && formData.countdown_date && (
                                            <div 
                                                className="font-mono font-semibold"
                                                style={generateCountdownStyles()}
                                            >
                                                00d 00h 00m 00s
                                            </div>
                                        )}
                                        
                                        {formData.cta_text && (
                                            <a 
                                                href="#"
                                                className="inline-block px-4 py-2 rounded text-decoration-none font-medium transition-transform hover:transform hover:-translate-y-0.5"
                                                style={generateCTAStyles()}
                                            >
                                                {formData.cta_text}
                                            </a>
                                        )}
                                    </div>
                                    
                                    {formData.close_button_enabled && (
                                        <button 
                                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                                            style={generateCloseStyles()}
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopBarEditor;
