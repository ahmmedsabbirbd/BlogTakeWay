import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Search, Globe, FileText, Tag, Hash, Link } from 'lucide-react';

const PageAssignmentManager = ({ promoBar, onClose, onSave }) => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [activeTab, setActiveTab] = useState('global');

    useEffect(() => {
        if (promoBar && promoBar.id) {
            loadAssignments();
        } else {
            setLoading(false);
        }
    }, [promoBar]);

    const loadAssignments = async () => {
        console.log('Loading assignments for promo bar:', promoBar.id);
        
        try {
            const body = `action=promobarx_get_assignments&promo_bar_id=${promoBar.id}&nonce=${window.promobarxAdmin.nonce}`;
            console.log('Request body:', body);
            
            const response = await fetch(window.promobarxAdmin.ajaxurl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: body
            });
            
            const data = await response.json();
            console.log('Assignments response:', data);
            
            if (data.success) {
                setAssignments(data.data || []);
            } else {
                console.error('Failed to load assignments:', data);
            }
        } catch (error) {
            console.error('Error loading assignments:', error);
        } finally {
            setLoading(false);
        }
    };

    const searchPages = async (term, type = 'page') => {
        console.log('Searching pages with term:', term, 'type:', type);
        
        if (!term.trim()) {
            setSearchResults([]);
            return;
        }

        setSearching(true);
        try {
            const body = `action=promobarx_get_pages&search=${encodeURIComponent(term)}&post_type=${type}&nonce=${window.promobarxAdmin.nonce}`;
            console.log('Request body:', body);
            
            const response = await fetch(window.promobarxAdmin.ajaxurl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: body
            });
            
            const data = await response.json();
            console.log('Search response:', data);
            
            if (data.success) {
                setSearchResults(data.data || []);
            } else {
                console.error('Search failed:', data);
            }
        } catch (error) {
            console.error('Error searching pages:', error);
        } finally {
            setSearching(false);
        }
    };

    const searchTaxonomies = async (term, taxonomy = 'category') => {
        if (!term.trim()) {
            setSearchResults([]);
            return;
        }

        setSearching(true);
        try {
            const response = await fetch(window.promobarxAdmin.ajaxurl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=promobarx_get_taxonomies&search=${encodeURIComponent(term)}&taxonomy=${taxonomy}&nonce=${window.promobarxAdmin.nonce}`
            });
            
            const data = await response.json();
            if (data.success) {
                setSearchResults(data.data || []);
            }
        } catch (error) {
            console.error('Error searching taxonomies:', error);
        } finally {
            setSearching(false);
        }
    };

    const addAssignment = (type, data = {}) => {
        const newAssignment = {
            id: Date.now(), // Temporary ID for frontend
            assignment_type: type,
            target_id: data.id || 0,
            target_value: data.value || data.name || '',
            priority: assignments.length + 1,
            ...data
        };
        setAssignments([...assignments, newAssignment]);
    };

    const removeAssignment = (index) => {
        const newAssignments = assignments.filter((_, i) => i !== index);
        setAssignments(newAssignments);
    };

    const handleSave = async () => {
        if (!promoBar || !promoBar.id) {
            alert('No promo bar selected');
            return;
        }

        setSaving(true);
        try {
            const response = await fetch(window.promobarxAdmin.ajaxurl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'promobarx_save_assignments',
                    promo_bar_id: promoBar.id,
                    assignments: JSON.stringify(assignments),
                    nonce: window.promobarxAdmin.nonce
                })
            });

            const data = await response.json();
            if (data.success) {
                onSave(assignments); // Pass assignments back to parent
                onClose();
            } else {
                alert('Error saving assignments: ' + data.data);
            }
        } catch (error) {
            console.error('Error saving assignments:', error);
            alert('Error saving assignments');
        } finally {
            setSaving(false);
        }
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (activeTab === 'pages') {
            searchPages(term);
        } else if (activeTab === 'categories') {
            searchTaxonomies(term, 'category');
        } else if (activeTab === 'tags') {
            searchTaxonomies(term, 'post_tag');
        }
    };

    const getAssignmentLabel = (assignment) => {
        switch (assignment.assignment_type) {
            case 'global':
                return 'All Pages';
            case 'page':
                return `Page: ${assignment.target_value || 'Unknown Page'}`;
            case 'post_type':
                return `All ${assignment.target_value || 'Posts'}`;
            case 'category':
                return `Category: ${assignment.target_value || 'Unknown Category'}`;
            case 'tag':
                return `Tag: ${assignment.target_value || 'Unknown Tag'}`;
            case 'custom':
                return `Custom: ${assignment.target_value || 'Unknown Pattern'}`;
            default:
                return 'Unknown Assignment';
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading assignments...</p>
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
                        <h2 className="text-xl font-semibold text-gray-900">Page Assignment</h2>
                        <p className="text-sm text-gray-600">Choose where this promo bar should appear</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {saving ? 'Saving...' : 'Save'}
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
                    {/* Left Panel - Assignment Types */}
                    <div className="w-1/3 border-r border-gray-200 flex flex-col">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Assignment Types</h3>
                            
                            <div className="space-y-2">
                                <button
                                    onClick={() => setActiveTab('global')}
                                    className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                                        activeTab === 'global' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <Globe className="w-5 h-5 mr-3" />
                                    <div>
                                        <div className="font-medium">Global</div>
                                        <div className="text-sm text-gray-500">Show on all pages</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setActiveTab('pages')}
                                    className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                                        activeTab === 'pages' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <FileText className="w-5 h-5 mr-3" />
                                    <div>
                                        <div className="font-medium">Specific Pages</div>
                                        <div className="text-sm text-gray-500">Select individual pages</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setActiveTab('post_types')}
                                    className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                                        activeTab === 'post_types' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <FileText className="w-5 h-5 mr-3" />
                                    <div>
                                        <div className="font-medium">Post Types</div>
                                        <div className="text-sm text-gray-500">All pages of a type</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setActiveTab('categories')}
                                    className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                                        activeTab === 'categories' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <Tag className="w-5 h-5 mr-3" />
                                    <div>
                                        <div className="font-medium">Categories</div>
                                        <div className="text-sm text-gray-500">Pages in categories</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setActiveTab('tags')}
                                    className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                                        activeTab === 'tags' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <Hash className="w-5 h-5 mr-3" />
                                    <div>
                                        <div className="font-medium">Tags</div>
                                        <div className="text-sm text-gray-500">Pages with tags</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setActiveTab('custom')}
                                    className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                                        activeTab === 'custom' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <Link className="w-5 h-5 mr-3" />
                                    <div>
                                        <div className="font-medium">Custom URLs</div>
                                        <div className="text-sm text-gray-500">URL patterns</div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Current Assignments */}
                        <div className="flex-1 p-4 overflow-y-auto">
                            <h4 className="font-medium text-gray-900 mb-3">Current Assignments</h4>
                            {assignments.length === 0 ? (
                                <p className="text-gray-500 text-sm">No assignments yet</p>
                            ) : (
                                <div className="space-y-2">
                                    {assignments.map((assignment, index) => (
                                        <div key={assignment.id || index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                            <span className="text-sm text-gray-700">{getAssignmentLabel(assignment)}</span>
                                            <button
                                                onClick={() => removeAssignment(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel - Assignment Options */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        {activeTab === 'global' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">Global Assignment</h3>
                                <p className="text-gray-600">This promo bar will appear on all pages of your website.</p>
                                <button
                                    onClick={() => addAssignment('global')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Global Assignment
                                </button>
                            </div>
                        )}

                        {activeTab === 'pages' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">Specific Pages</h3>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search pages..."
                                        value={searchTerm}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                                </div>
                                
                                {searching && (
                                    <div className="text-center py-4">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                                    </div>
                                )}
                                
                                {searchResults.length > 0 && (
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {searchResults.map((page) => (
                                            <button
                                                key={page.id}
                                                onClick={() => addAssignment('page', { id: page.id, value: page.title })}
                                                className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                                            >
                                                <div className="font-medium">{page.title}</div>
                                                <div className="text-sm text-gray-500">{page.type} • {page.url}</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'post_types' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">Post Types</h3>
                                <p className="text-gray-600">Select a post type to show this promo bar on all pages of that type.</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {['page', 'post', 'product'].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => addAssignment('post_type', { value: type })}
                                            className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 text-left"
                                        >
                                            <div className="font-medium capitalize">{type}s</div>
                                            <div className="text-sm text-gray-500">All {type} pages</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'categories' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">Categories</h3>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search categories..."
                                        value={searchTerm}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                                </div>
                                
                                {searchResults.length > 0 && (
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {searchResults.map((category) => (
                                            <button
                                                key={category.id}
                                                onClick={() => addAssignment('category', { id: category.id, value: category.name })}
                                                className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                                            >
                                                <div className="font-medium">{category.name}</div>
                                                <div className="text-sm text-gray-500">Category</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'tags' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">Tags</h3>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search tags..."
                                        value={searchTerm}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                                </div>
                                
                                {searchResults.length > 0 && (
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {searchResults.map((tag) => (
                                            <button
                                                key={tag.id}
                                                onClick={() => addAssignment('tag', { id: tag.id, value: tag.name })}
                                                className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                                            >
                                                <div className="font-medium">{tag.name}</div>
                                                <div className="text-sm text-gray-500">Tag</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'custom' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">Custom URL Patterns</h3>
                                <p className="text-gray-600">Enter URL patterns to match specific pages.</p>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="e.g., /shop/*, /blog/2024/*"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={() => {
                                            if (searchTerm.trim()) {
                                                addAssignment('custom', { value: searchTerm.trim() });
                                                setSearchTerm('');
                                            }
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Add Custom Pattern
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageAssignmentManager;
