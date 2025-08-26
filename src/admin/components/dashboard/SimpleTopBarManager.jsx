import React, { useState, useEffect } from 'react';

const SimpleTopBarManager = ({ containerId }) => {
    const [promoBars, setPromoBars] = useState([]);
    const [analyticsData, setAnalyticsData] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('manage');

    useEffect(() => {
        console.log('SimpleTopBarManager: Component mounted');
        console.log('SimpleTopBarManager: window.promobarxAdmin:', window.promobarxAdmin);
        
        if (window.promobarxAdmin && window.promobarxAdmin.ajaxurl && window.promobarxAdmin.nonce) {
            console.log('SimpleTopBarManager: Admin data available, loading promo bars');
            loadPromoBars();
            loadAnalyticsData();
        } else {
            console.error('SimpleTopBarManager: Admin data not available');
            console.error('SimpleTopBarManager: promobarxAdmin:', window.promobarxAdmin);
            setLoading(false);
        }
    }, []);

    const loadPromoBars = async () => {
        try {
            console.log('Loading promo bars...');
            console.log('Admin data:', window.promobarxAdmin);
            
            const response = await fetch(window.promobarxAdmin.ajaxurl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'action=promobarx_get_promo_bars&nonce=' + window.promobarxAdmin.nonce
            });
            
            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);
            
            if (data.success) {
                setPromoBars(data.data);
                console.log('Promo bars loaded:', data.data);
            } else {
                console.error('Failed to load promo bars:', data);
            }
        } catch (error) {
            console.error('Error loading promo bars:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadAnalyticsData = async () => {
        try {
            console.log('Loading analytics data...');
            
            const response = await fetch(window.promobarxAdmin.ajaxurl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'action=promobarx_get_analytics&nonce=' + window.promobarxAdmin.nonce
            });
            
            const data = await response.json();
            console.log('Analytics response:', data);
            
            if (data.success) {
                setAnalyticsData(data.data);
                console.log('Analytics data loaded:', data.data);
            } else {
                console.error('Failed to load analytics data:', data);
            }
        } catch (error) {
            console.error('Error loading analytics data:', error);
        }
    };

    const deletePromoBar = async (id) => {
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

    const toggleStatus = async (promoBar) => {
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

    const createNew = () => {
        window.location.href = 'admin.php?page=promo-bar-x-editor';
    };

    const editPromoBar = (promoBar) => {
        window.location.href = `admin.php?page=promo-bar-x-editor&id=${promoBar.id}`;
    };

    const getStatusBadge = (status) => {
        const config = {
            draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
            active: { color: 'bg-green-100 text-green-800', label: 'Active' },
            paused: { color: 'bg-yellow-100 text-yellow-800', label: 'Paused' },
            archived: { color: 'bg-red-100 text-red-800', label: 'Archived' }
        };
        
        const statusConfig = config[status] || config.draft;
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig.color}`}>
                {statusConfig.label}
            </span>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatAssignmentType = (assignmentType) => {
        const types = {
            'global': 'Global',
            'page': 'Specific Page',
            'post_type': 'Post Type',
            'category': 'Category',
            'tag': 'Tag',
            'custom': 'Custom URL'
        };
        return types[assignmentType] || assignmentType;
    };

    const formatAssignmentValue = (assignment) => {
        if (assignment.assignment_type === 'global') {
            return 'All Pages';
        } else if (assignment.assignment_type === 'page') {
            // Try to get the actual page title
            if (assignment.target_value && assignment.target_value !== '') {
                return assignment.target_value;
            } else if (assignment.target_id && assignment.target_id !== '0') {
                return `Page ID: ${assignment.target_id}`;
            } else {
                return 'Unknown Page';
            }
        } else if (assignment.assignment_type === 'post_type') {
            return assignment.target_value || 'All Posts';
        } else if (assignment.assignment_type === 'category') {
            return assignment.target_value || `Category ID: ${assignment.target_id}`;
        } else if (assignment.assignment_type === 'tag') {
            return assignment.target_value || `Tag ID: ${assignment.target_id}`;
        } else if (assignment.assignment_type === 'custom') {
            return assignment.target_value || 'Custom Pattern';
        }
        return assignment.target_value || 'Unknown';
    };

    const formatCountdownDisplay = (promoBar) => {
        if (!promoBar.countdown_enabled) {
            return <span className="text-gray-400 italic">Disabled</span>;
        }
        
        if (!promoBar.countdown_date) {
            return <span className="text-yellow-600">Enabled (No date set)</span>;
        }
        
        const countdownDate = new Date(promoBar.countdown_date);
        const now = new Date();
        
        if (countdownDate <= now) {
            return <span className="text-red-600">Expired</span>;
        }
        
        // Calculate time remaining
        const timeDiff = countdownDate - now;
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        
        let timeDisplay = '';
        if (days > 0) {
            timeDisplay = `${days}d ${hours}h`;
        } else if (hours > 0) {
            timeDisplay = `${hours}h ${minutes}m`;
        } else {
            timeDisplay = `${minutes}m`;
        }
        
        return (
            <div>
                <div className="text-sm font-medium text-green-600">Active</div>
                <div className="text-xs text-gray-500">{timeDisplay} remaining</div>
                <div className="text-xs text-gray-400">{formatDate(promoBar.countdown_date)}</div>
            </div>
        );
    };

    const getAssignmentDisplay = (assignments) => {
        if (!assignments || assignments.length === 0) {
            return <span className="text-gray-400 italic">No assignments</span>;
        }

        return (
            <div className="space-y-1">
                {assignments.map((assignment, index) => (
                    <div key={index} className="text-xs">
                        <span className="font-medium text-gray-700">
                            {formatAssignmentType(assignment.assignment_type)}:
                        </span>
                        <span className="text-gray-600 ml-1">
                            {formatAssignmentValue(assignment)}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    const getMaxPriority = (assignments) => {
        if (!assignments || assignments.length === 0) {
            return 0;
        }
        return Math.max(...assignments.map(a => parseInt(a.priority) || 0));
    };

    const getAnalyticsDisplay = (promoBarId) => {
        const analytics = analyticsData[promoBarId] || {
            impression: 0,
            click: 0,
            close: 0,
            cta_click: 0
        };

        return (
            <div className="space-y-1">
                <div className="text-xs">
                    <span className="font-medium text-blue-600">👁️ {analytics.impression}</span>
                    <span className="text-gray-500 ml-2">impressions</span>
                </div>
                <div className="text-xs">
                    <span className="font-medium text-green-600">🖱️ {analytics.click}</span>
                    <span className="text-gray-500 ml-2">clicks</span>
                </div>
                <div className="text-xs">
                    <span className="font-medium text-red-600">❌ {analytics.close}</span>
                    <span className="text-gray-500 ml-2">closes</span>
                </div>
                <div className="text-xs">
                    <span className="font-medium text-purple-600">🎯 {analytics.cta_click}</span>
                    <span className="text-gray-500 ml-2">CTA clicks</span>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading promo bars...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Promo Bar Manager</h1>
                    <p className="text-gray-600">Create and manage your promotional top bars</p>
                </div>
                <button 
                    onClick={createNew}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Create New Promo Bar
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button 
                        onClick={() => setActiveTab('manage')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'manage' 
                                ? 'border-blue-500 text-blue-600' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Manage Promo Bars
                    </button>
                    <button 
                        onClick={() => setActiveTab('templates')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'templates' 
                                ? 'border-blue-500 text-blue-600' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Quick Templates
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'manage' ? (
                <div className="space-y-4">
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">All Promo Bars</h3>
                        </div>
                        {promoBars.length === 0 ? (
                            <div className="text-center py-12">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No promo bars yet</h3>
                                <p className="text-gray-600 mb-4">Create your first promotional top bar to get started</p>
                                <button 
                                    onClick={createNew}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Create First Promo Bar
                                </button>
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> 
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Countdown</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignments</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Analytics</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {promoBars.map((promoBar) => (
                                        <tr key={promoBar.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{promoBar.name}</div>
                                                    <div className="text-sm text-gray-500">{promoBar.title}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(promoBar.status)}</td> 
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {formatCountdownDisplay(promoBar)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getAssignmentDisplay(promoBar.assignments)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getAnalyticsDisplay(promoBar.id)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    getMaxPriority(promoBar.assignments) > 0 
                                                        ? 'bg-blue-100 text-blue-800' 
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {getMaxPriority(promoBar.assignments)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(promoBar.created_at)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button 
                                                        onClick={() => toggleStatus(promoBar)}
                                                        className="text-gray-400 hover:text-gray-600"
                                                        title={promoBar.status === 'active' ? 'Pause' : 'Activate'}
                                                    >
                                                        {promoBar.status === 'active' ? '⏸️' : '▶️'}
                                                    </button>
                                                    <button 
                                                        onClick={() => editPromoBar(promoBar)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="Edit"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button 
                                                        onClick={() => deletePromoBar(promoBar.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Delete"
                                                    >
                                                        🗑️
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
            ) : (
                <div className="space-y-4">
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Templates</h3>
                        <p className="text-gray-600 mb-6">Choose from pre-designed templates to get started quickly.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div 
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={createNew}
                            >
                                <h4 className="font-medium text-gray-900">Minimal</h4>
                                <p className="text-sm text-gray-600">Clean and simple design</p>
                            </div>
                            
                            <div 
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={createNew}
                            >
                                <h4 className="font-medium text-gray-900">Bold</h4>
                                <p className="text-sm text-gray-600">Eye-catching and attention-grabbing</p>
                            </div>
                            
                            <div 
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={createNew}
                            >
                                <h4 className="font-medium text-gray-900">E-commerce</h4>
                                <p className="text-sm text-gray-600">Perfect for online stores</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SimpleTopBarManager;
