import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Settings } from 'lucide-react';
import TopBarEditor from './TopBarEditor';

// Simple component without complex state management
const TopBarManager = () => {
    const [promoBars, setPromoBars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPromoBar, setSelectedPromoBar] = useState(null);
    const [showEditor, setShowEditor] = useState(false);
    const [activeTab, setActiveTab] = useState('manage');
    const [editingPromoBarId, setEditingPromoBarId] = useState(null);

    // Single useEffect for initialization
    useEffect(() => {
        initializeManager();
    }, []);

    const initializeManager = async () => {
        try {
            if (window.promobarxAdmin && window.promobarxAdmin.ajaxurl && window.promobarxAdmin.nonce) {
                await loadPromoBars();
            } else {
                console.log('PromoBarX Admin Data:', {
                    promobarxAdmin: window.promobarxAdmin,
                    ajaxurl: window.promobarxAdmin?.ajaxurl,
                    nonce: window.promobarxAdmin?.nonce
                });
                setLoading(false);
            }
        } catch (error) {
            console.error('Error initializing manager:', error);
            setLoading(false);
        }
    };

    const loadPromoBars = async () => {
        try {
            const response = await fetch(window.promobarxAdmin.ajaxurl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'action=promobarx_get_promo_bars&nonce=' + window.promobarxAdmin.nonce
            });
            
            const data = await response.json();
            if (data.success) {
                setPromoBars(data.data);
            }
        } catch (error) {
            console.error('Error loading promo bars:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        setSelectedPromoBar(null);
        setShowEditor(true);
    };

    const handleEdit = async (promoBar) => {
        setEditingPromoBarId(promoBar.id);
        try {
            // Fetch the complete promo bar data from server
            const response = await fetch(window.promobarxAdmin.ajaxurl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=promobarx_get_promo_bar&id=${promoBar.id}&nonce=${window.promobarxAdmin.nonce}`
            });
            
            const data = await response.json();
            if (data.success) {
                console.log('Fetched promo bar data for editing:', data.data);
                setSelectedPromoBar(data.data);
                setShowEditor(true);
            } else {
                console.error('Failed to fetch promo bar data:', data.data);
                console.log('Using fallback data from list:', promoBar);
                // Fallback to using the data from the list
                setSelectedPromoBar(promoBar);
                setShowEditor(true);
            }
        } catch (error) {
            console.error('Error fetching promo bar data:', error);
            console.log('Using fallback data from list due to error:', promoBar);
            // Fallback to using the data from the list
            setSelectedPromoBar(promoBar);
            setShowEditor(true);
        } finally {
            setEditingPromoBarId(null);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this promo bar?')) {
            return;
        }

        try {
            const response = await fetch(window.promobarxAdmin.ajaxurl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=promobarx_delete&id=${id}&nonce=${window.promobarxAdmin.nonce}`
            });
            
            const data = await response.json();
            if (data.success) {
                await loadPromoBars();
            }
        } catch (error) {
            console.error('Error deleting promo bar:', error);
        }
    };

    const handleToggleStatus = async (promoBar) => {
        const newStatus = promoBar.status === 'active' ? 'paused' : 'active';
        
        try {
            const response = await fetch(window.promobarxAdmin.ajaxurl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=promobarx_save&id=${promoBar.id}&status=${newStatus}&nonce=${window.promobarxAdmin.nonce}`
            });
            
            const data = await response.json();
            if (data.success) {
                await loadPromoBars();
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleTemplateSelect = (templateData) => {
        setSelectedPromoBar(templateData);
        setShowEditor(true);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
            active: { color: 'bg-green-100 text-green-800', label: 'Active' },
            paused: { color: 'bg-yellow-100 text-yellow-800', label: 'Paused' },
            archived: { color: 'bg-red-100 text-red-800', label: 'Archived' }
        };

        const config = statusConfig[status] || statusConfig.draft;
        
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
                {config.label}
            </span>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Main render
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Promo Bar Manager</h1>
                    <p className="text-gray-600">Create and manage your promotional top bars</p>
                </div>
                <button
                    onClick={handleCreateNew}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Promo Bar
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {[
                        { id: 'manage', label: 'Manage Promo Bars', icon: Settings },
                        { id: 'quick-templates', label: 'Quick Templates', icon: Eye }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
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
            {activeTab === 'manage' && (
                <ManageTab 
                    promoBars={promoBars}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                    onCreateNew={handleCreateNew}
                    getStatusBadge={getStatusBadge}
                    formatDate={formatDate}
                />
            )}

            {activeTab === 'quick-templates' && (
                <QuickTemplatesTab onTemplateSelect={handleTemplateSelect} />
            )}

            {/* Editor Modal */}
            {showEditor && (
                <TopBarEditor
                    promoBar={selectedPromoBar}
                    onClose={() => {
                        setShowEditor(false);
                        setSelectedPromoBar(null);
                    }}
                    onSave={() => {
                        setShowEditor(false);
                        setSelectedPromoBar(null);
                        loadPromoBars();
                    }}
                />
            )}
        </div>
    );
};

// Separate component for Manage tab
const ManageTab = ({ promoBars, onEdit, onDelete, onToggleStatus, onCreateNew, getStatusBadge, formatDate }) => {
    return (
                <div className="space-y-4">
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">All Promo Bars</h3>
                        </div>
                        <div className="overflow-hidden">
                            {promoBars.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 mb-4">
                                        <Settings className="w-12 h-12 mx-auto" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No promo bars yet</h3>
                                    <p className="text-gray-600 mb-4">Create your first promotional top bar to get started</p>
                                    <button
                                onClick={onCreateNew}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create First Promo Bar
                                    </button>
                                </div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Assignments
                                            </th>

                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Created
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {promoBars.map((promoBar) => (
                                            <tr key={promoBar.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {promoBar.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {promoBar.title}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(promoBar.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <AssignmentSummary promoBarId={promoBar.id} />
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(promoBar.created_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <button
                                                    onClick={() => onToggleStatus(promoBar)}
                                                            className="text-gray-400 hover:text-gray-600"
                                                            title={promoBar.status === 'active' ? 'Pause' : 'Activate'}
                                                        >
                                                            {promoBar.status === 'active' ? (
                                                                <EyeOff className="w-4 h-4" />
                                                            ) : (
                                                                <Eye className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                        <button
                                                    onClick={() => onEdit(promoBar)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                            title="Edit"
                                                            disabled={editingPromoBarId === promoBar.id}
                                                        >
                                                            {editingPromoBarId === promoBar.id ? (
                                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                                            ) : (
                                                                <Edit className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                        <button
                                                    onClick={() => onDelete(promoBar.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
    );
};

// Separate component for Quick Templates tab
const QuickTemplatesTab = ({ onTemplateSelect }) => {
    const templates = [
        {
            name: 'Minimal Promo Bar',
            title: 'Special Offer',

            cta_text: 'Shop Now',
            cta_url: '#',
            styling: {
                background: '#ffffff',
                color: '#333333',
                font_family: 'Inter, sans-serif',
                font_size: '14px',
                padding: '12px 20px',
                border_bottom: '1px solid #e5e7eb'
            },
            preview: { bg: 'bg-white', text: 'text-gray-600', label: 'Minimal Design' }
        },
        {
            name: 'Bold Promo Bar',
            title: 'Flash Sale!',

            cta_text: 'Buy Now',
            cta_url: '#',
            styling: {
                background: '#dc2626',
                color: '#ffffff',
                font_family: 'Inter, sans-serif',
                font_size: '16px',
                padding: '16px 24px',
                border_bottom: 'none'
            },
            preview: { bg: 'bg-red-600', text: 'text-white', label: 'Bold Design' }
        },
        {
            name: 'E-commerce Promo Bar',
            title: 'Free Shipping',

            cta_text: 'Shop Now',
            cta_url: '#',
            styling: {
                background: '#059669',
                color: '#ffffff',
                font_family: 'Inter, sans-serif',
                font_size: '14px',
                padding: '12px 20px',
                border_bottom: 'none'
            },
            preview: { bg: 'bg-green-600', text: 'text-white', label: 'E-commerce Design' }
        }
    ];

    return (
        <div className="space-y-4">
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Templates</h3>
                <p className="text-gray-600 mb-6">Choose from pre-designed templates to get started quickly.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {templates.map((template, index) => (
                        <div 
                            key={index}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => onTemplateSelect(template)}
                        >
                            <div className={`w-full h-20 ${template.preview.bg} border-2 border-gray-200 rounded mb-3 flex items-center justify-center`}>
                                <span className={`text-sm ${template.preview.text} font-medium`}>
                                    {template.preview.label}
                                </span>
                            </div>
                            <h4 className="font-medium text-gray-900">{template.name.split(' ')[0]}</h4>
                            <p className="text-sm text-gray-600">
                                {template.name.includes('Minimal') ? 'Clean and simple design' :
                                 template.name.includes('Bold') ? 'Eye-catching and attention-grabbing' :
                                 'Perfect for online stores'}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Assignment Summary Component
const AssignmentSummary = ({ promoBarId }) => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAssignments();
    }, [promoBarId]);

    const loadAssignments = async () => {
        console.log('AssignmentSummary: Loading assignments for promo bar:', promoBarId);
        
        try {
            const body = `action=promobarx_get_assignments&promo_bar_id=${promoBarId}&nonce=${window.promobarxAdmin.nonce}`;
            console.log('AssignmentSummary: Request body:', body);
            
            const response = await fetch(window.promobarxAdmin.ajaxurl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: body
            });
            
            const data = await response.json();
            console.log('AssignmentSummary: Response:', data);
            
            if (data.success) {
                setAssignments(data.data || []);
            } else {
                console.error('AssignmentSummary: Failed to load assignments:', data);
            }
        } catch (error) {
            console.error('AssignmentSummary: Error loading assignments:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <span className="text-gray-400">Loading...</span>;
    }

    if (assignments.length === 0) {
        return <span className="text-gray-400">No assignments</span>;
    }

    const getAssignmentLabel = (assignment) => {
        switch (assignment.assignment_type) {
            case 'global':
                return 'All Pages';
            case 'page':
                return `Page: ${assignment.target_value || 'Unknown'}`;
            case 'post_type':
                return `All ${assignment.target_value || 'Posts'}`;
            case 'category':
                return `Category: ${assignment.target_value || 'Unknown'}`;
            case 'tag':
                return `Tag: ${assignment.target_value || 'Unknown'}`;
            case 'custom':
                return `Custom: ${assignment.target_value || 'Unknown'}`;
            default:
                return 'Unknown';
        }
    };

    return (
        <div className="space-y-1">
            {assignments.slice(0, 2).map((assignment, index) => (
                <div key={assignment.id || index} className="text-xs">
                    {getAssignmentLabel(assignment)}
                </div>
            ))}
            {assignments.length > 2 && (
                <div className="text-xs text-gray-400">
                    +{assignments.length - 2} more
                </div>
            )}
        </div>
    );
};

export default TopBarManager;
