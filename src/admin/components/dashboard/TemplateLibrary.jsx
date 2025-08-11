import React, { useState, useEffect } from 'react';
import { X, Eye, Check } from 'lucide-react';

const TemplateLibrary = ({ onSelectTemplate, onClose }) => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        loadTemplates();
    }, [selectedCategory]);

    const loadTemplates = async () => {
        try {
            if (!window.promobarxAdmin || !window.promobarxAdmin.ajaxurl || !window.promobarxAdmin.nonce) {
                console.error('PromoBarX admin data not available');
                return;
            }
            
            const formData = new FormData();
            formData.append('action', 'promobarx_get_templates');
            formData.append('nonce', window.promobarxAdmin.nonce);
            if (selectedCategory !== 'all') {
                formData.append('category', selectedCategory);
            }

            const response = await fetch(window.promobarxAdmin.ajaxurl, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            if (data.success) {
                setTemplates(data.data);
            }
        } catch (error) {
            console.error('Error loading templates:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { id: 'all', label: 'All Templates' },
        { id: 'minimal', label: 'Minimal' },
        { id: 'bold', label: 'Bold' },
        { id: 'ecommerce', label: 'E-commerce' }
    ];

    const handleTemplateSelect = (template) => {
        if (onSelectTemplate) {
            onSelectTemplate(template);
        }
        if (onClose) {
            onClose();
        }
    };

    const renderTemplatePreview = (template) => {
        const config = template.config ? JSON.parse(template.config) : {};
        
        return (
            <div 
                className="w-full h-24 rounded-lg border-2 border-gray-200 relative overflow-hidden"
                style={{
                    background: config.background || '#ffffff',
                    color: config.text_color || '#333333',
                    fontFamily: config.font_family || 'Inter, sans-serif',
                    fontSize: config.font_size || '14px',
                    padding: config.padding || '12px 20px'
                }}
            >
                <div className="flex items-center justify-center h-full text-center">
                    <div className="text-sm font-medium">Sample Text</div>
                </div>
                {config.accent_color && (
                    <div 
                        className="absolute bottom-0 left-0 right-0 h-1"
                        style={{ background: config.accent_color }}
                    />
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading templates...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-5/6 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Template Library</h2>
                        <p className="text-sm text-gray-600">Choose from pre-designed templates</p>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Category Filter */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex space-x-4">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    selectedCategory === category.id
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Templates Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    {templates.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <Eye className="w-12 h-12 mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
                            <p className="text-gray-600">No templates available for the selected category.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {templates.map((template) => (
                                <div
                                    key={template.id}
                                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                                    onClick={() => handleTemplateSelect(template)}
                                >
                                    {/* Template Preview */}
                                    {renderTemplatePreview(template)}
                                    
                                    {/* Template Info */}
                                    <div className="mt-4">
                                        <h3 className="font-medium text-gray-900 mb-1">
                                            {template.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-3">
                                            {template.description}
                                        </p>
                                        
                                        {/* Category Badge */}
                                        {template.category && (
                                            <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                                                {template.category}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Select Button */}
                                    <button
                                        className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleTemplateSelect(template);
                                        }}
                                    >
                                        <Check className="w-4 h-4 mr-2" />
                                        Use Template
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TemplateLibrary;
