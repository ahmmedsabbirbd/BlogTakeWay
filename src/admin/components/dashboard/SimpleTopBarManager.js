// Simple TopBar Manager - No React, No Complex State
(function() {
    'use strict';
    
    // Simple state management
    let state = {
        promoBars: [],
        loading: true,
        activeTab: 'manage'
    };
    
    // DOM elements
    let container = null;
    
    // Initialize the manager
    function init(containerId) {
        container = document.getElementById(containerId);
        if (!container) {
            console.error('Container not found:', containerId);
            return;
        }
        
        // Show loading
        showLoading();
        
        // Check admin data
        if (window.promobarxAdmin && window.promobarxAdmin.ajaxurl && window.promobarxAdmin.nonce) {
            loadPromoBars();
        } else {
            console.log('Admin data not available');
            state.loading = false;
            render();
        }
    }
    
    // Show loading state
    function showLoading() {
        container.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 256px;">
                <div style="width: 32px; height: 32px; border: 2px solid #e5e7eb; border-top: 2px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
    }
    
    // Load promo bars from server
    async function loadPromoBars() {
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
                state.promoBars = data.data;
            }
        } catch (error) {
            console.error('Error loading promo bars:', error);
        } finally {
            state.loading = false;
            render();
        }
    }
    
    // Delete promo bar
    async function deletePromoBar(id) {
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
    }
    
    // Toggle promo bar status
    async function toggleStatus(promoBar) {
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
    }
    
    // Create new promo bar
    function createNew() {
        // Simple redirect to create page
        window.location.href = 'admin.php?page=promo-bar-x-editor';
    }
    
    // Edit promo bar
    function editPromoBar(promoBar) {
        window.location.href = `admin.php?page=promo-bar-x-editor&id=${promoBar.id}`;
    }
    
    // Switch tabs
    function switchTab(tab) {
        state.activeTab = tab;
        render();
    }
    
    // Get status badge HTML
    function getStatusBadge(status) {
        const config = {
            draft: { color: 'background-color: #f3f4f6; color: #374151;', label: 'Draft' },
            active: { color: 'background-color: #d1fae5; color: #065f46;', label: 'Active' },
            paused: { color: 'background-color: #fef3c7; color: #92400e;', label: 'Paused' },
            archived: { color: 'background-color: #fee2e2; color: #991b1b;', label: 'Archived' }
        };
        
        const statusConfig = config[status] || config.draft;
        return `<span style="padding: 4px 8px; border-radius: 9999px; font-size: 12px; font-weight: 500; ${statusConfig.color}">${statusConfig.label}</span>`;
    }
    
    // Format date
    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString();
    }
    
    // Render the main interface
    function render() {
        if (state.loading) {
            showLoading();
            return;
        }
        
        container.innerHTML = `
            <div style="margin-bottom: 24px;">
                <!-- Header -->
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
                    <div>
                        <h1 style="font-size: 24px; font-weight: bold; color: #111827; margin: 0 0 4px 0;">Promo Bar Manager</h1>
                        <p style="color: #6b7280; margin: 0;">Create and manage your promotional top bars</p>
                    </div>
                    <button onclick="window.simpleTopBarManager.createNew()" style="display: inline-flex; align-items: center; padding: 8px 16px; background-color: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
                        <svg style="width: 16px; height: 16px; margin-right: 8px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Create New Promo Bar
                    </button>
                </div>

                <!-- Tabs -->
                <div style="border-bottom: 1px solid #e5e7eb; margin-bottom: 24px;">
                    <nav style="display: flex; gap: 32px;">
                        <button onclick="window.simpleTopBarManager.switchTab('manage')" style="padding: 8px 4px; border-bottom: 2px solid ${state.activeTab === 'manage' ? '#3b82f6' : 'transparent'}; color: ${state.activeTab === 'manage' ? '#3b82f6' : '#6b7280'}; background: none; border-top: none; border-left: none; border-right: none; font-weight: 500; font-size: 14px; cursor: pointer;">
                            <svg style="width: 16px; height: 16px; display: inline; margin-right: 8px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            Manage Promo Bars
                        </button>
                        <button onclick="window.simpleTopBarManager.switchTab('templates')" style="padding: 8px 4px; border-bottom: 2px solid ${state.activeTab === 'templates' ? '#3b82f6' : 'transparent'}; color: ${state.activeTab === 'templates' ? '#3b82f6' : '#6b7280'}; background: none; border-top: none; border-left: none; border-right: none; font-weight: 500; font-size: 14px; cursor: pointer;">
                            <svg style="width: 16px; height: 16px; display: inline; margin-right: 8px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                            Quick Templates
                        </button>
                    </nav>
                </div>

                <!-- Tab Content -->
                ${state.activeTab === 'manage' ? renderManageTab() : renderTemplatesTab()}
            </div>
        `;
    }
    
    // Render manage tab
    function renderManageTab() {
        if (state.promoBars.length === 0) {
            return `
                <div style="background-color: white; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); border-radius: 8px;">
                    <div style="padding: 24px; border-bottom: 1px solid #e5e7eb;">
                        <h3 style="font-size: 18px; font-weight: 500; color: #111827; margin: 0;">All Promo Bars x</h3>
                    </div>
                    <div style="text-align: center; padding: 48px 24px;">
                        <div style="color: #9ca3af; margin-bottom: 16px;">
                            <svg style="width: 48px; height: 48px; margin: 0 auto;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                        </div>
                        <h3 style="font-size: 18px; font-weight: 500; color: #111827; margin: 0 0 8px 0;">No promo bars yet</h3>
                        <p style="color: #6b7280; margin: 0 0 16px 0;">Create your first promotional top bar to get started</p>
                        <button onclick="window.simpleTopBarManager.createNew()" style="display: inline-flex; align-items: center; padding: 8px 16px; background-color: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
                            <svg style="width: 16px; height: 16px; margin-right: 8px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            Create First Promo Bar
                        </button>
                    </div>
                </div>
            `;
        }
        
        const tableRows = state.promoBars.map(promoBar => `
            <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 16px 24px; white-space: nowrap;">
                    <div>
                        <div style="font-size: 14px; font-weight: 500; color: #111827;">${promoBar.name}</div>
                        <div style="font-size: 14px; color: #6b7280;">${promoBar.title}</div>
                    </div>
                </td>
                <td style="padding: 16px 24px; white-space: nowrap;">${getStatusBadge(promoBar.status)}</td>
                <td style="padding: 16px 24px; white-space: nowrap; font-size: 14px; color: #111827;">${promoBar.priority}</td>
                <td style="padding: 16px 24px; white-space: nowrap; font-size: 14px; color: #6b7280;">${formatDate(promoBar.created_at)}</td>
                <td style="padding: 16px 24px; white-space: nowrap; text-align: right;">
                    <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
                        <button onclick="window.simpleTopBarManager.toggleStatus(${JSON.stringify(promoBar).replace(/"/g, '&quot;')})" style="color: #9ca3af; background: none; border: none; cursor: pointer; padding: 4px;" title="${promoBar.status === 'active' ? 'Pause' : 'Activate'}">
                            <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${promoBar.status === 'active' ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21' : 'M15 12a3 3 0 11-6 0 3 3 0 016 0z'}"></path>
                            </svg>
                        </button>
                        <button onclick="window.simpleTopBarManager.editPromoBar(${JSON.stringify(promoBar).replace(/"/g, '&quot;')})" style="color: #3b82f6; background: none; border: none; cursor: pointer; padding: 4px;" title="Edit">
                            <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </button>
                        <button onclick="window.simpleTopBarManager.deletePromoBar(${promoBar.id})" style="color: #dc2626; background: none; border: none; cursor: pointer; padding: 4px;" title="Delete">
                            <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        return `
            <div style="background-color: white; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); border-radius: 8px;">
                <div style="padding: 24px; border-bottom: 1px solid #e5e7eb;">
                    <h3 style="font-size: 18px; font-weight: 500; color: #111827; margin: 0;">All Promo Bars x</h3>
                </div>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead style="background-color: #f9fafb;">
                        <tr>
                            <th style="padding: 12px 24px; text-align: left; font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Name</th>
                            <th style="padding: 12px 24px; text-align: left; font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Status</th>
                            <th style="padding: 12px 24px; text-align: left; font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Priority</th>
                            <th style="padding: 12px 24px; text-align: left; font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Created</th>
                            <th style="padding: 12px 24px; text-align: right; font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    // Render templates tab
    function renderTemplatesTab() {
        return `
            <div style="background-color: white; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); border-radius: 8px; padding: 24px;">
                <h3 style="font-size: 18px; font-weight: 500; color: #111827; margin: 0 0 16px 0;">Quick Templates</h3>
                <p style="color: #6b7280; margin: 0 0 24px 0;">Choose from pre-designed templates to get started quickly.</p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
                    <div onclick="window.simpleTopBarManager.createNew()" style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; cursor: pointer; transition: box-shadow 0.2s;">
                        <div style="width: 100%; height: 80px; background-color: white; border: 2px solid #e5e7eb; border-radius: 8px; margin-bottom: 12px; display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 14px; color: #6b7280;">Minimal Design</span>
                        </div>
                        <h4 style="font-weight: 500; color: #111827; margin: 0 0 4px 0;">Minimal</h4>
                        <p style="font-size: 14px; color: #6b7280; margin: 0;">Clean and simple design</p>
                    </div>
                    
                    <div onclick="window.simpleTopBarManager.createNew()" style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; cursor: pointer; transition: box-shadow 0.2s;">
                        <div style="width: 100%; height: 80px; background-color: #dc2626; border-radius: 8px; margin-bottom: 12px; display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 14px; color: white; font-weight: bold;">Bold Design</span>
                        </div>
                        <h4 style="font-weight: 500; color: #111827; margin: 0 0 4px 0;">Bold</h4>
                        <p style="font-size: 14px; color: #6b7280; margin: 0;">Eye-catching and attention-grabbing</p>
                    </div>
                    
                    <div onclick="window.simpleTopBarManager.createNew()" style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; cursor: pointer; transition: box-shadow 0.2s;">
                        <div style="width: 100%; height: 80px; background-color: #059669; border-radius: 8px; margin-bottom: 12px; display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 14px; color: white;">E-commerce Design</span>
                        </div>
                        <h4 style="font-weight: 500; color: #111827; margin: 0 0 4px 0;">E-commerce</h4>
                        <p style="font-size: 14px; color: #6b7280; margin: 0;">Perfect for online stores</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Expose functions globally
    window.simpleTopBarManager = {
        init: init,
        loadPromoBars: loadPromoBars,
        deletePromoBar: deletePromoBar,
        toggleStatus: toggleStatus,
        createNew: createNew,
        editPromoBar: editPromoBar,
        switchTab: switchTab
    };
    
})();
