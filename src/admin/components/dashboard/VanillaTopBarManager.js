// Vanilla JavaScript TopBarManager - No React dependencies
class VanillaTopBarManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.promoBars = [];
        this.loading = true;
        this.activeTab = 'manage';
        
        if (!this.container) {
            console.error('Container not found:', containerId);
            return;
        }
        
        this.init();
    }
    
    async init() {
        try {
            if (window.promobarxAdmin && window.promobarxAdmin.ajaxurl && window.promobarxAdmin.nonce) {
                await this.loadPromoBars();
            } else {
                console.log('PromoBarX Admin Data:', {
                    promobarxAdmin: window.promobarxAdmin,
                    ajaxurl: window.promobarxAdmin?.ajaxurl,
                    nonce: window.promobarxAdmin?.nonce
                });
                this.loading = false;
            }
        } catch (error) {
            console.error('Error initializing manager:', error);
            this.loading = false;
        }
        
        this.render();
    }
    
    async loadPromoBars() {
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
                this.promoBars = data.data;
            }
        } catch (error) {
            console.error('Error loading promo bars:', error);
        } finally {
            this.loading = false;
        }
    }
    
    async handleDelete(id) {
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
                await this.loadPromoBars();
                this.render();
            }
        } catch (error) {
            console.error('Error deleting promo bar:', error);
        }
    }
    
    async handleToggleStatus(promoBar) {
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
                await this.loadPromoBars();
                this.render();
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }
    
    handleCreateNew() {
        // Open the editor in a new window or modal
        window.open('admin.php?page=promo-bar-x-editor', '_blank');
    }
    
    handleEdit(promoBar) {
        // Open the editor with the promo bar data
        window.open(`admin.php?page=promo-bar-x-editor&id=${promoBar.id}`, '_blank');
    }
    
    setActiveTab(tab) {
        this.activeTab = tab;
        this.render();
    }
    
    getStatusBadge(status) {
        const statusConfig = {
            draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
            active: { color: 'bg-green-100 text-green-800', label: 'Active' },
            paused: { color: 'bg-yellow-100 text-yellow-800', label: 'Paused' },
            archived: { color: 'bg-red-100 text-red-800', label: 'Archived' }
        };

        const config = statusConfig[status] || statusConfig.draft;
        return `<span class="px-2 py-1 text-xs font-medium rounded-full ${config.color}">${config.label}</span>`;
    }
    
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString();
    }
    
    render() {
        if (this.loading) {
            this.container.innerHTML = `
                <div class="flex items-center justify-center h-64">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            `;
            return;
        }
        
        this.container.innerHTML = `
            <div class="space-y-6">
                <!-- Header -->
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900">Promo Bar Manager</h1>
                        <p class="text-gray-600">Create and manage your promotional top bars</p>
                    </div>
                    <button onclick="window.topBarManager.handleCreateNew()" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Create New Promo Bar
                    </button>
                </div>

                <!-- Tabs -->
                <div class="border-b border-gray-200">
                    <nav class="-mb-px flex space-x-8">
                        <button onclick="window.topBarManager.setActiveTab('manage')" class="py-2 px-1 border-b-2 font-medium text-sm ${this.activeTab === 'manage' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}">
                            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            Manage Promo Bars
                        </button>
                        <button onclick="window.topBarManager.setActiveTab('quick-templates')" class="py-2 px-1 border-b-2 font-medium text-sm ${this.activeTab === 'quick-templates' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}">
                            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                            Quick Templates
                        </button>
                    </nav>
                </div>

                <!-- Tab Content -->
                ${this.activeTab === 'manage' ? this.renderManageTab() : this.renderQuickTemplatesTab()}
            </div>
        `;
    }
    
    renderManageTab() {
        if (this.promoBars.length === 0) {
            return `
                <div class="space-y-4">
                    <div class="bg-white shadow rounded-lg">
                        <div class="px-6 py-4 border-b border-gray-200">
                            <h3 class="text-lg font-medium text-gray-900">All Promo Bars</h3>
                        </div>
                        <div class="text-center py-12">
                            <div class="text-gray-400 mb-4">
                                <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                            </div>
                            <h3 class="text-lg font-medium text-gray-900 mb-2">No promo bars yet</h3>
                            <p class="text-gray-600 mb-4">Create your first promotional top bar to get started</p>
                            <button onclick="window.topBarManager.handleCreateNew()" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                                </svg>
                                Create First Promo Bar
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
        
        const tableRows = this.promoBars.map(promoBar => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                        <div class="text-sm font-medium text-gray-900">${promoBar.name}</div>
                        <div class="text-sm text-gray-500">${promoBar.title}</div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">${this.getStatusBadge(promoBar.status)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${promoBar.priority}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${this.formatDate(promoBar.created_at)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex items-center justify-end space-x-2">
                        <button onclick="window.topBarManager.handleToggleStatus(${JSON.stringify(promoBar).replace(/"/g, '&quot;')})" class="text-gray-400 hover:text-gray-600" title="${promoBar.status === 'active' ? 'Pause' : 'Activate'}">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${promoBar.status === 'active' ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21' : 'M15 12a3 3 0 11-6 0 3 3 0 016 0z'}"></path>
                            </svg>
                        </button>
                        <button onclick="window.topBarManager.handleEdit(${JSON.stringify(promoBar).replace(/"/g, '&quot;')})" class="text-blue-600 hover:text-blue-900" title="Edit">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </button>
                        <button onclick="window.topBarManager.handleDelete(${promoBar.id})" class="text-red-600 hover:text-red-900" title="Delete">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        return `
            <div class="space-y-4">
                <div class="bg-white shadow rounded-lg">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h3 class="text-lg font-medium text-gray-900">All Promo Bars</h3>
                    </div>
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${tableRows}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
    
    renderQuickTemplatesTab() {
        return `
            <div class="space-y-4">
                <div class="bg-white shadow rounded-lg p-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Quick Templates</h3>
                    <p class="text-gray-600 mb-6">Choose from pre-designed templates to get started quickly.</p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onclick="window.topBarManager.handleCreateNew()">
                            <div class="w-full h-20 bg-white border-2 border-gray-200 rounded mb-3 flex items-center justify-center">
                                <span class="text-sm text-gray-600">Minimal Design</span>
                            </div>
                            <h4 class="font-medium text-gray-900">Minimal</h4>
                            <p class="text-sm text-gray-600">Clean and simple design</p>
                        </div>
                        
                        <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onclick="window.topBarManager.handleCreateNew()">
                            <div class="w-full h-20 bg-red-600 rounded mb-3 flex items-center justify-center">
                                <span class="text-sm text-white font-bold">Bold Design</span>
                            </div>
                            <h4 class="font-medium text-gray-900">Bold</h4>
                            <p class="text-sm text-gray-600">Eye-catching and attention-grabbing</p>
                        </div>
                        
                        <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onclick="window.topBarManager.handleCreateNew()">
                            <div class="w-full h-20 bg-green-600 rounded mb-3 flex items-center justify-center">
                                <span class="text-sm text-white">E-commerce Design</span>
                            </div>
                            <h4 class="font-medium text-gray-900">E-commerce</h4>
                            <p class="text-sm text-gray-600">Perfect for online stores</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VanillaTopBarManager;
} else {
    window.VanillaTopBarManager = VanillaTopBarManager;
}
