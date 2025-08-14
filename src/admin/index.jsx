// Simple TopBar Manager - No React Dependencies
import './components/dashboard/SimpleTopBarManager.js';

document.addEventListener('DOMContentLoaded', () => {
    try {
        // Mount top bar manager using simple vanilla JavaScript
        const topBarManagerContainer = document.getElementById('promo-bar-x-topbar-manager');
        if (topBarManagerContainer) {
            // Initialize the simple manager
            window.simpleTopBarManager.init('promo-bar-x-topbar-manager');
        }
        
        // Mount editor page if container exists
        const editorContainer = document.getElementById('promo-bar-x-editor');
        if (editorContainer) {
            // Initialize the full React-based editor
            if (window.React && window.ReactDOM) {
                // Import and render the EditorPage component
                import('./components/dashboard/EditorPage.jsx').then(module => {
                    const EditorPage = module.default;
                    window.ReactDOM.render(window.React.createElement(EditorPage), editorContainer);
                }).catch(error => {
                    console.error('Error loading editor:', error);
                    // Fallback to simple editor
                    renderSimpleEditor(editorContainer);
                });
            } else {
                // Fallback to simple editor if React is not available
                renderSimpleEditor(editorContainer);
            }
        }
        
        function renderSimpleEditor(container) {
            // Check if we have a promo bar ID from the URL
            const urlParams = new URLSearchParams(window.location.search);
            const promoBarId = urlParams.get('id');
            
            console.log('Simple Editor: URL params:', window.location.search);
            console.log('Simple Editor: Promo bar ID from URL:', promoBarId);
            
            container.innerHTML = `
                <div style="padding: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                        <h1 style="font-size: 24px; font-weight: 600; color: #111827;">
                            ${promoBarId ? 'Edit Promo Bar' : 'Create New Promo Bar'}
                        </h1>
                        <div style="display: flex; gap: 12px;">
                            <button onclick="savePromoBar()" style="display: inline-flex; align-items: center; padding: 10px 20px; background-color: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
                                <svg style="width: 16px; height: 16px; margin-right: 8px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Save Promo Bar
                            </button>
                            <button onclick="loadPromoBarData()" style="display: inline-flex; align-items: center; padding: 10px 20px; background-color: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
                                <svg style="width: 16px; height: 16px; margin-right: 8px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                </svg>
                                Load Data
                            </button>
                            <button onclick="testLoadPromoBar()" style="display: inline-flex; align-items: center; padding: 10px 20px; background-color: #f59e0b; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
                                <svg style="width: 16px; height: 16px; margin-right: 8px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                Test Load
                            </button>
                            <button onclick="window.location.href='admin.php?page=promo-bar-x-topbar-manager'" style="display: inline-flex; align-items: center; padding: 10px 20px; background-color: #6b7280; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
                                <svg style="width: 16px; height: 16px; margin-right: 8px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                                </svg>
                                Back to Manager
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <!-- Preview -->
                        <div style="background: white; border-radius: 8px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                            <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 20px; color: #111827;">Live Preview</h2>
                            <div id="promo-preview" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; min-height: 200px;">
                                <div style="text-align: center; color: #64748b;">Preview will appear here</div>
                            </div>
                        </div>

                        <!-- Editor Form -->
                        <div style="background: white; border-radius: 8px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                            <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 20px; color: #111827;">Promo Bar Settings</h2>
                            
                            <div style="margin-bottom: 20px;">
                                <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">Name</label>
                                <input type="text" id="promo-name" placeholder="Enter promo bar name" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">Title</label>
                                <input type="text" id="promo-title" placeholder="Enter main title" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                            </div>
                                                      
                            <div style="margin-bottom: 20px;">
                                <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">CTA Button Text</label>
                                <input type="text" id="promo-cta-text" placeholder="e.g., Shop Now" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">CTA Button URL</label>
                                <input type="url" id="promo-cta-url" placeholder="https://example.com" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <label style="display: flex; align-items: center; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                    <input type="checkbox" id="promo-countdown-enabled" style="margin-right: 8px;">
                                    Enable Countdown Timer
                                </label>
                                <input type="datetime-local" id="promo-countdown-date" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; display: none;">
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <label style="display: flex; align-items: center; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                    <input type="checkbox" id="promo-close-enabled" checked style="margin-right: 8px;">
                                    Show Close Button
                                </label>
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">Status</label>
                                <select id="promo-status" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                                    <option value="draft">Draft</option>
                                    <option value="active">Active</option>
                                    <option value="paused">Paused</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                            
                            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
                            
                            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 20px; color: #111827;">Styling Options</h3>
                            
                            <div style="margin-bottom: 20px;">
                                <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">Background Color</label>
                                <input type="color" id="promo-bg-color" value="#3b82f6" style="width: 100%; height: 40px; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer;">
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">Text Color</label>
                                <input type="color" id="promo-text-color" value="#ffffff" style="width: 100%; height: 40px; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer;">
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">CTA Button Color</label>
                                <input type="color" id="promo-cta-color" value="#ffffff" style="width: 100%; height: 40px; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer;">
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">Font Size</label>
                                <select id="promo-font-size" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                                    <option value="12px">Small (12px)</option>
                                    <option value="14px" selected>Medium (14px)</option>
                                    <option value="16px">Large (16px)</option>
                                    <option value="18px">Extra Large (18px)</option>
                                </select>
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">Position</label>
                                <select id="promo-position" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                                    <option value="top">Top of Page</option>
                                    <option value="bottom">Bottom of Page</option>
                                </select>
                            </div>
                            
                            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
                            
                            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 20px; color: #111827;">Page Assignment</h3>
                            
                            <div style="margin-bottom: 20px;">
                                <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">Show on Pages</label>
                                <select id="promo-assignment-type" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                                    <option value="global">All Pages (Global)</option>
                                    <option value="specific">Specific Pages</option>
                                    <option value="post_type">All Posts/Pages</option>
                                    <option value="category">Specific Categories</option>
                                    <option value="custom">Custom URL Pattern</option>
                                </select>
                            </div>
                            
                            <div id="assignment-options" style="display: none;">
                                <div id="specific-pages-option" style="display: none; margin-bottom: 20px;">
                                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">Search Pages</label>
                                    <div style="display: flex; gap: 10px;">
                                        <input type="text" id="page-search" placeholder="Search pages..." style="flex: 1; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                                        <button onclick="searchPages()" style="padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;">Search</button>
                                    </div>
                                    <div id="page-results" style="margin-top: 10px; max-height: 200px; overflow-y: auto;"></div>
                                </div>
                                
                                <div id="category-option" style="display: none; margin-bottom: 20px;">
                                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">Select Categories</label>
                                    <div id="category-list" style="max-height: 200px; overflow-y: auto; border: 1px solid #d1d5db; border-radius: 6px; padding: 10px;"></div>
                                </div>
                                
                                <div id="custom-url-option" style="display: none; margin-bottom: 20px;">
                                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">URL Pattern</label>
                                    <div style="display: flex; gap: 10px;">
                                        <input type="text" id="custom-url-pattern" placeholder="e.g., /shop/*, /blog/2024/*" style="flex: 1; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                                        <button onclick="addCustomUrlPattern()" style="padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;">Add Pattern</button>
                                    </div>
                                    <p style="font-size: 12px; color: #6b7280; margin-top: 5px;">Use * for wildcards. Example: /shop/* will match all shop pages</p>
                                </div>
                            </div>
                            
                            <div id="current-assignments" style="margin-top: 20px;">
                                <h4 style="font-size: 14px; font-weight: 600; margin-bottom: 10px; color: #111827;">Current Assignments</h4>
                                <div id="assignments-list" style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px; min-height: 50px;">
                                    <div style="text-align: center; color: #6b7280; font-size: 14px;">No assignments yet</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Add event listeners
            setupEditorEvents();
            
            // Load promo bar data if ID is provided
            if (promoBarId) {
                console.log('Simple Editor: Loading promo bar data for ID:', promoBarId);
                loadPromoBarData();
            }
        }
        
        function setupEditorEvents() {
            // Countdown toggle
            const countdownCheckbox = document.getElementById('promo-countdown-enabled');
            const countdownDate = document.getElementById('promo-countdown-date');
            
            if (countdownCheckbox) {
                countdownCheckbox.addEventListener('change', function() {
                    countdownDate.style.display = this.checked ? 'block' : 'none';
                    updatePreview();
                });
            }
            
            // Real-time preview updates
            const inputs = ['promo-name', 'promo-title', 'promo-cta-text', 'promo-cta-url'];
            inputs.forEach(id => {
                const input = document.getElementById(id);
                if (input) {
                    input.addEventListener('input', updatePreview);
                }
            });
            
            // Styling options
            const stylingInputs = ['promo-bg-color', 'promo-text-color', 'promo-cta-color', 'promo-font-size', 'promo-position'];
            stylingInputs.forEach(id => {
                const input = document.getElementById(id);
                if (input) {
                    input.addEventListener('change', updatePreview);
                }
            });
            
            // Page assignment events
            const assignmentType = document.getElementById('promo-assignment-type');
            if (assignmentType) {
                assignmentType.addEventListener('change', handleAssignmentTypeChange);
            }
            
            // Load categories on page load
            loadCategories();
            
            // Initial preview
            updatePreview();
        }
        
        // Page assignment functions
        let currentAssignments = [];
        
        function handleAssignmentTypeChange() {
            const assignmentType = document.getElementById('promo-assignment-type').value;
            const assignmentOptions = document.getElementById('assignment-options');
            const specificPagesOption = document.getElementById('specific-pages-option');
            const categoryOption = document.getElementById('category-option');
            const customUrlOption = document.getElementById('custom-url-option');
            
            // Hide all options first
            specificPagesOption.style.display = 'none';
            categoryOption.style.display = 'none';
            customUrlOption.style.display = 'none';
            assignmentOptions.style.display = 'none';
            
            if (assignmentType === 'global') {
                // Add global assignment
                addAssignment('global', { value: 'All Pages' });
            } else if (assignmentType === 'specific') {
                assignmentOptions.style.display = 'block';
                specificPagesOption.style.display = 'block';
            } else if (assignmentType === 'post_type') {
                addAssignment('post_type', { value: 'post' });
            } else if (assignmentType === 'category') {
                assignmentOptions.style.display = 'block';
                categoryOption.style.display = 'block';
            } else if (assignmentType === 'custom') {
                assignmentOptions.style.display = 'block';
                customUrlOption.style.display = 'block';
            }
        }
        
        function addAssignment(type, data) {
            const assignment = {
                id: Date.now(),
                assignment_type: type,
                target_id: data.id || 0,
                target_value: data.value || data.name || '',
                priority: currentAssignments.length + 1
            };
            
            currentAssignments.push(assignment);
            updateAssignmentsList();
        }
        
        function removeAssignment(id) {
            currentAssignments = currentAssignments.filter(a => a.id !== id);
            updateAssignmentsList();
        }
        
        function updateAssignmentsList() {
            const assignmentsList = document.getElementById('assignments-list');
            if (!assignmentsList) return;
            
            if (currentAssignments.length === 0) {
                assignmentsList.innerHTML = '<div style="text-align: center; color: #6b7280; font-size: 14px;">No assignments yet</div>';
                return;
            }
            
            assignmentsList.innerHTML = currentAssignments.map(assignment => {
                const label = getAssignmentLabel(assignment);
                return `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: white; border: 1px solid #e5e7eb; border-radius: 4px; margin-bottom: 8px;">
                        <span style="font-size: 14px; color: #374151;">${label}</span>
                        <button onclick="removeAssignment(${assignment.id})" style="background: none; border: none; color: #dc2626; cursor: pointer; font-size: 16px;">×</button>
                    </div>
                `;
            }).join('');
        }
        
        function getAssignmentLabel(assignment) {
            switch (assignment.assignment_type) {
                case 'global':
                    return '🌐 All Pages';
                case 'page':
                    return `📄 Page: ${assignment.target_value}`;
                case 'post_type':
                    return `📝 All ${assignment.target_value}s`;
                case 'category':
                    return `🏷️ Category: ${assignment.target_value}`;
                case 'tag':
                    return `🏷️ Tag: ${assignment.target_value}`;
                case 'custom':
                    return `🔗 Custom: ${assignment.target_value}`;
                default:
                    return 'Unknown Assignment';
            }
        }
        
        function searchPages() {
            const searchTerm = document.getElementById('page-search').value;
            if (!searchTerm.trim()) return;
            
            if (!window.promobarxAdmin || !window.promobarxAdmin.ajaxurl) {
                alert('Admin data not available');
                return;
            }
            
            const formData = new FormData();
            formData.append('action', 'promobarx_get_pages');
            formData.append('search', searchTerm);
            formData.append('nonce', window.promobarxAdmin.nonce);
            
            fetch(window.promobarxAdmin.ajaxurl, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    displayPageResults(data.data);
                } else {
                    alert('Error searching pages: ' + (data.data || 'Unknown error'));
                }
            })
            .catch(error => {
                console.error('Error searching pages:', error);
                alert('Error searching pages');
            });
        }
        
        function displayPageResults(pages) {
            const resultsContainer = document.getElementById('page-results');
            if (!resultsContainer) return;
            
            if (pages.length === 0) {
                resultsContainer.innerHTML = '<div style="text-align: center; color: #6b7280; padding: 20px;">No pages found</div>';
                return;
            }
            
            resultsContainer.innerHTML = pages.map(page => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border: 1px solid #e5e7eb; border-radius: 4px; margin-bottom: 8px; background: white;">
                    <div>
                        <div style="font-weight: 500; color: #111827;">${page.title}</div>
                        <div style="font-size: 12px; color: #6b7280;">${page.type} • ${page.url}</div>
                    </div>
                    <button onclick="addAssignment('page', { id: ${page.id}, value: '${page.title}' })" style="padding: 6px 12px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Add</button>
                </div>
            `).join('');
        }
        
        function loadCategories() {
            if (!window.promobarxAdmin || !window.promobarxAdmin.ajaxurl) return;
            
            const formData = new FormData();
            formData.append('action', 'promobarx_get_taxonomies');
            formData.append('taxonomy', 'category');
            formData.append('nonce', window.promobarxAdmin.nonce);
            
            fetch(window.promobarxAdmin.ajaxurl, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    displayCategories(data.data);
                }
            })
            .catch(error => {
                console.error('Error loading categories:', error);
            });
        }
        
        function displayCategories(categories) {
            const categoryList = document.getElementById('category-list');
            if (!categoryList) return;
            
            categoryList.innerHTML = categories.map(category => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border-bottom: 1px solid #e5e7eb;">
                    <span style="font-size: 14px; color: #374151;">${category.name}</span>
                    <button onclick="addAssignment('category', { id: ${category.id}, value: '${category.name}' })" style="padding: 4px 8px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Add</button>
                </div>
            `).join('');
        }
        
        // Make functions globally accessible
        window.searchPages = searchPages;
        window.addAssignment = addAssignment;
        window.removeAssignment = removeAssignment;
        
        // Add custom URL pattern handler
        window.addCustomUrlPattern = function() {
            const pattern = document.getElementById('custom-url-pattern').value.trim();
            if (pattern) {
                addAssignment('custom', { value: pattern });
                document.getElementById('custom-url-pattern').value = '';
            } else {
                alert('Please enter a URL pattern');
            }
        };
        
        function updatePreview() {
            const preview = document.getElementById('promo-preview');
            if (!preview) return;
            
            const title = document.getElementById('promo-title')?.value || 'Sample Title';
            const ctaText = document.getElementById('promo-cta-text')?.value || 'Shop Now';
            const countdownEnabled = document.getElementById('promo-countdown-enabled')?.checked || false;
            const closeEnabled = document.getElementById('promo-close-enabled')?.checked || false;
            
            // Get styling values
            const bgColor = document.getElementById('promo-bg-color')?.value || '#3b82f6';
            const textColor = document.getElementById('promo-text-color')?.value || '#ffffff';
            const ctaColor = document.getElementById('promo-cta-color')?.value || '#ffffff';
            const fontSize = document.getElementById('promo-font-size')?.value || '14px';
            const position = document.getElementById('promo-position')?.value || 'top';
            
            preview.innerHTML = `
                <div style="background: ${bgColor}; color: ${textColor}; padding: 12px 20px; border-radius: 6px; display: flex; align-items: center; justify-content: space-between; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: ${fontSize};">
                    <div style="display: flex; align-items: center; gap: 20px; flex: 1;">
                        <div>
                            <div style="font-weight: 600;">${title}</div>
                        </div>
                        ${countdownEnabled ? '<div style="font-weight: 600; font-family: monospace; font-size: 0.85em;">23:59:59</div>' : ''}
                        <a href="#" style="background: ${ctaColor}; color: ${bgColor}; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-weight: 500; font-size: 0.85em;">${ctaText}</a>
                    </div>
                    ${closeEnabled ? '<button style="background: none; border: none; color: ' + textColor + '; font-size: 18px; cursor: pointer; opacity: 0.7;">×</button>' : ''}
                </div>
                <div style="margin-top: 10px; font-size: 12px; color: #6b7280; text-align: center;">
                    Position: ${position === 'top' ? 'Top of Page' : 'Bottom of Page'}
                </div>
            `;
        }
        
        // Make functions globally accessible
        window.savePromoBar = function() {
            console.log('Save button clicked');
            
            // Get promo bar ID from URL if editing
            const urlParams = new URLSearchParams(window.location.search);
            const promoBarId = urlParams.get('id');
            
            // Validate required fields
            const title = document.getElementById('promo-title')?.value || '';
            const name = document.getElementById('promo-name')?.value || '';
            
            if (!title.trim()) {
                alert('Please enter a title for the promo bar.');
                return;
            }
            
            if (!name.trim()) {
                alert('Please enter a name for the promo bar.');
                return;
            }
            
            const data = {
                name: name,
                title: title,
                cta_text: document.getElementById('promo-cta-text')?.value || '',
                cta_url: document.getElementById('promo-cta-url')?.value || '',
                countdown_enabled: document.getElementById('promo-countdown-enabled')?.checked || false,
                countdown_date: document.getElementById('promo-countdown-date')?.value || '',
                close_button_enabled: document.getElementById('promo-close-enabled')?.checked || false,
                status: document.getElementById('promo-status')?.value || 'draft',
                styling: JSON.stringify({
                    background: document.getElementById('promo-bg-color')?.value || '#3b82f6',
                    color: document.getElementById('promo-text-color')?.value || '#ffffff',
                    font_size: document.getElementById('promo-font-size')?.value || '14px',
                    position: document.getElementById('promo-position')?.value || 'top'
                }),
                cta_style: JSON.stringify({
                    background: document.getElementById('promo-cta-color')?.value || '#ffffff',
                    color: document.getElementById('promo-bg-color')?.value || '#3b82f6'
                }),
                assignments: JSON.stringify(currentAssignments)
            };
            
            // Add ID if editing existing promo bar
            if (promoBarId) {
                data.id = promoBarId;
            }
            
            console.log('Data to save:', data);
            console.log('Admin data:', window.promobarxAdmin);
            
            if (window.promobarxAdmin && window.promobarxAdmin.ajaxurl) {
                const formData = new URLSearchParams();
                formData.append('action', 'promobarx_save');
                formData.append('nonce', window.promobarxAdmin.nonce);
                
                // Add all data fields
                Object.keys(data).forEach(key => {
                    formData.append(key, data[key]);
                });
                
                console.log('Form data:', formData.toString());
                
                fetch(window.promobarxAdmin.ajaxurl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData.toString()
                })
                .then(response => {
                    console.log('Response status:', response.status);
                    return response.json();
                })
                .then(result => {
                    console.log('Save result:', result);
                    if (result.success) {
                        alert('Promo bar saved successfully!');
                        window.location.href = 'admin.php?page=promo-bar-x-topbar-manager';
                    } else {
                        alert('Error saving promo bar: ' + (result.data || 'Unknown error'));
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error saving promo bar. Please try again.');
                });
            } else {
                console.error('Admin data not available');
                alert('Admin data not available. Please refresh the page.');
            }
        }
        
        window.testSave = function() {
            console.log('Test save clicked');
            
            if (!window.promobarxAdmin || !window.promobarxAdmin.ajaxurl) {
                alert('Admin data not available');
                return;
            }
            
            const testData = {
                name: 'Test Promo Bar',
                title: 'Test Title',
                cta_text: 'Test Button',
                cta_url: 'https://example.com',
                status: 'draft'
            };
            
            const formData = new URLSearchParams();
            formData.append('action', 'promobarx_save');
            formData.append('nonce', window.promobarxAdmin.nonce);
            
            Object.keys(testData).forEach(key => {
                formData.append(key, testData[key]);
            });
            
            console.log('Test form data:', formData.toString());
            
            fetch(window.promobarxAdmin.ajaxurl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString()
            })
            .then(response => {
                console.log('Test response status:', response.status);
                return response.text();
            })
            .then(text => {
                console.log('Test response text:', text);
                try {
                    const result = JSON.parse(text);
                    console.log('Test parsed result:', result);
                    if (result.success) {
                        alert('Test save successful! ID: ' + result.data.id);
                    } else {
                        alert('Test save failed: ' + (result.data || 'Unknown error'));
                    }
                } catch (e) {
                    console.error('Test JSON parse error:', e);
                    alert('Test response not valid JSON: ' + text);
                }
            })
            .catch(error => {
                console.error('Test error:', error);
                alert('Test save error: ' + error.message);
            });
        }

        window.loadPromoBarData = function() {
            const urlParams = new URLSearchParams(window.location.search);
            const promoBarId = urlParams.get('id');
            
            if (!promoBarId) {
                alert('No promo bar ID found in the URL.');
                return;
            }

            console.log('Loading promo bar data for ID:', promoBarId);

            if (window.promobarxAdmin && window.promobarxAdmin.ajaxurl) {
                const formData = new URLSearchParams();
                formData.append('action', 'promobarx_get_promo_bar');
                formData.append('nonce', window.promobarxAdmin.nonce);
                formData.append('id', promoBarId);

                console.log('Form data for loading:', formData.toString());

                fetch(window.promobarxAdmin.ajaxurl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData.toString()
                })
                .then(response => {
                    console.log('Load response status:', response.status);
                    return response.json();
                })
                .then(result => {
                    console.log('Load result:', result);
                    if (result.success && result.data) {
                        const promoBar = result.data;
                        
                        // Parse styling data
                        let styling = {};
                        if (promoBar.styling) {
                            try {
                                styling = typeof promoBar.styling === 'string' ? JSON.parse(promoBar.styling) : promoBar.styling;
                            } catch (e) {
                                console.error('Error parsing styling:', e);
                                styling = {};
                            }
                        }
                        
                        // Parse CTA style data
                        let ctaStyle = {};
                        if (promoBar.cta_style) {
                            try {
                                ctaStyle = typeof promoBar.cta_style === 'string' ? JSON.parse(promoBar.cta_style) : promoBar.cta_style;
                            } catch (e) {
                                console.error('Error parsing CTA style:', e);
                                ctaStyle = {};
                            }
                        }
                        
                        // Fill form fields
                        document.getElementById('promo-name').value = promoBar.name || '';
                        document.getElementById('promo-title').value = promoBar.title || '';
                        document.getElementById('promo-cta-text').value = promoBar.cta_text || '';
                        document.getElementById('promo-cta-url').value = promoBar.cta_url || '';
                        document.getElementById('promo-countdown-enabled').checked = Boolean(promoBar.countdown_enabled);
                        document.getElementById('promo-countdown-date').value = promoBar.countdown_date || '';
                        document.getElementById('promo-close-enabled').checked = Boolean(promoBar.close_button_enabled);
                        document.getElementById('promo-status').value = promoBar.status || 'draft';
                        
                        // Fill styling fields
                        document.getElementById('promo-bg-color').value = styling.background || '#3b82f6';
                        document.getElementById('promo-text-color').value = styling.color || '#ffffff';
                        document.getElementById('promo-font-size').value = styling.font_size || '14px';
                        document.getElementById('promo-position').value = styling.position || 'top';
                        document.getElementById('promo-cta-color').value = ctaStyle.background || '#ffffff';

                        // Show/hide countdown date field
                        const countdownDate = document.getElementById('promo-countdown-date');
                        if (countdownDate) {
                            countdownDate.style.display = promoBar.countdown_enabled ? 'block' : 'none';
                        }

                        updatePreview(); // Update preview with loaded data
                        
                        // Load assignments if they exist
                        if (promoBar.assignments) {
                            try {
                                const assignments = typeof promoBar.assignments === 'string' ? JSON.parse(promoBar.assignments) : promoBar.assignments;
                                currentAssignments = assignments;
                                updateAssignmentsList();
                            } catch (e) {
                                console.error('Error parsing assignments:', e);
                            }
                        }
                        
                        console.log('Successfully loaded promo bar data:', promoBar);
                    } else {
                        alert('Error loading promo bar data: ' + (result.data || 'Unknown error'));
                    }
                })
                .catch(error => {
                    console.error('Error loading promo bar data:', error);
                    alert('Error loading promo bar data. Please try again.');
                });
            } else {
                console.error('Admin data not available for loading');
                alert('Admin data not available for loading. Please refresh the page.');
            }
        }
        
        window.testLoadPromoBar = function() {
            const urlParams = new URLSearchParams(window.location.search);
            const promoBarId = urlParams.get('id');
            
            console.log('Test: Current URL params:', window.location.search);
            console.log('Test: Promo bar ID from URL:', promoBarId);
            console.log('Test: Admin data available:', {
                promobarxAdmin: window.promobarxAdmin,
                ajaxurl: window.promobarxAdmin?.ajaxurl,
                nonce: window.promobarxAdmin?.nonce
            });
            
            if (promoBarId) {
                console.log('Test: Attempting to load promo bar with ID:', promoBarId);
                loadPromoBarData();
            } else {
                console.log('Test: No promo bar ID found in URL');
                alert('No promo bar ID found in URL. Current URL: ' + window.location.href);
            }
        }
        
        // For other components, we'll use simple HTML if needed
    const dashboardContainer = document.getElementById('promo-bar-x-dashboard');
    if (dashboardContainer) {
            dashboardContainer.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 256px;">
                    <div style="text-align: center;">
                        <div style="color: #3b82f6; margin-bottom: 16px;">
                            <svg style="width: 48px; height: 48px; margin: 0 auto;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                            </svg>
                        </div>
                        <h3 style="font-size: 18px; font-weight: 500; color: #111827; margin: 0 0 8px 0;">Chat Dashboard</h3>
                        <p style="color: #6b7280; margin: 0;">Chat functionality is available.</p>
                    </div>
                </div>
            `;
        }

    const settingsContainer = document.getElementById('promo-bar-x-settings-app');
    if (settingsContainer) {
            settingsContainer.innerHTML = `
                <div style="display: flex; align-items: center; justify-center; height: 256px;">
                    <div style="text-align: center;">
                        <div style="color: #3b82f6; margin-bottom: 16px;">
                            <svg style="width: 48px; height: 48px; margin: 0 auto;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                        </div>
                        <h3 style="font-size: 18px; font-weight: 500; color: #111827; margin: 0 0 8px 0;">Settings</h3>
                        <p style="color: #6b7280; margin: 0;">Settings functionality is available.</p>
                    </div>
                </div>
            `;
        }

    const inquiriesContainer = document.getElementById('promo-bar-x-inquiries');
    if (inquiriesContainer) {
            inquiriesContainer.innerHTML = `
                <div style="display: flex; align-items: center; justify-center; height: 256px;">
                    <div style="text-align: center;">
                        <div style="color: #3b82f6; margin-bottom: 16px;">
                            <svg style="width: 48px; height: 48px; margin: 0 auto;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                        </div>
                        <h3 style="font-size: 18px; font-weight: 500; color: #111827; margin: 0 0 8px 0;">Inquiries</h3>
                        <p style="color: #6b7280; margin: 0;">Inquiries functionality is available.</p>
                    </div>
                </div>
            `;
        }
        
    } catch (error) {
        console.error('Error initializing PromoBarX components:', error);
        
        // Fallback for all containers
        const containers = document.querySelectorAll('[id*="promo-bar-x"]');
        containers.forEach(container => {
            if (container.innerHTML === '') {
                container.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; height: 256px;">
                        <div style="text-align: center;">
                            <div style="color: #dc2626; margin-bottom: 16px;">
                                <svg style="width: 48px; height: 48px; margin: 0 auto;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                </svg>
                            </div>
                            <h3 style="font-size: 18px; font-weight: 500; color: #111827; margin: 0 0 8px 0;">Component Error</h3>
                            <p style="color: #6b7280; margin: 0 0 16px 0;">Failed to load component.</p>
                            <button onclick="window.location.reload()" style="display: inline-flex; align-items: center; padding: 8px 16px; background-color: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
                                Reload Page
                            </button>
                        </div>
                    </div>
                `;
            }
        });
    }
});