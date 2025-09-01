// React-based TopBar Manager
import React from 'react';
import ReactDOM from 'react-dom';
import SimpleTopBarManager from './components/dashboard/SimpleTopBarManager.jsx';
// Styles: Tailwind utilities and admin overrides
import './styles/main.scss';
import './styles/admin.scss';

document.addEventListener('DOMContentLoaded', () => {
    try {
        // Mount top bar manager using React
        const topBarManagerContainer = document.getElementById('promo-bar-x-topbar-manager');
        if (topBarManagerContainer) {
            // Initialize the React-based manager
            ReactDOM.render(React.createElement(SimpleTopBarManager, { containerId: 'promo-bar-x-topbar-manager' }), topBarManagerContainer);
        }
        
        // Mount editor page if container exists
        const editorContainer = document.getElementById('promo-bar-x-editor');
        if (editorContainer) {
            // Initialize the full React-based editor
            import('./components/dashboard/TopBarEditor.jsx').then(module => {
                const TopBarEditor = module.default;
                ReactDOM.render(React.createElement(TopBarEditor), editorContainer);
            }).catch(error => {
                console.error('Error loading editor:', error);
                // Fallback to simple editor
                renderSimpleEditor(editorContainer);
            });
        }
        
        function renderSimpleEditor(container) {
            // Check if we have a promo bar ID from the URL
            const urlParams = new URLSearchParams(window.location.search);
            const promoBarId = urlParams.get('id');
            

            
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
                            <button onclick="testAnchorHover()" style="display: inline-flex; align-items: center; padding: 10px 20px; background-color: #f59e0b; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
                                <svg style="width: 16px; height: 16px; margin-right: 8px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                Test Hover
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
                            
                            <!-- Name Section -->
                            <div style="margin-bottom: 20px; padding: 12px; background: #f8fafc; border-radius: 6px; border: 1px solid #e5e7eb;">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <label style="font-weight: 500; color: #374151; white-space: nowrap; min-width: 40px;">Name:</label>
                                    <input type="text" id="promo-name" placeholder="Enter promo bar name" style="flex: 1; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;">
                            </div>
                            </div>
                                                      
                            <!-- Title Section -->
                            <div style="margin-bottom: 20px; padding: 12px; background: #f8fafc; border-radius: 6px; border: 1px solid #e5e7eb;">
                                <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
                                    <div style="display: flex; align-items: center; gap: 8px; min-width: 300px; flex: 1;">
                                        <label style="font-weight: 500; color: #374151; white-space: nowrap; min-width: 40px;">Title:</label>
                                        <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                                            <!-- Rich Text Editor Toolbar -->
                                            <div style="display: flex; align-items: center; gap: 4px; padding: 6px; background: #f9fafb; border: 1px solid #d1d5db; border-bottom: none; border-radius: 4px 4px 0 0;">
                                                <button type="button" onclick="execRichCommand('bold')" id="bold-btn" style="padding: 4px 8px; border: none; background: none; cursor: pointer; border-radius: 3px; font-weight: bold; color: #374151; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#e5e7eb'" onmouseout="this.style.backgroundColor='transparent'" title="Bold">B</button>
                                                <button type="button" onclick="execRichCommand('underline')" id="underline-btn" style="padding: 4px 8px; border: none; background: none; cursor: pointer; border-radius: 3px; text-decoration: underline; color: #374151; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#e5e7eb'" onmouseout="this.style.backgroundColor='transparent'" title="Underline">U</button>
                                                <div style="width: 1px; height: 16px; background: #d1d5db; margin: 0 4px;"></div>
                                                <button type="button" onclick="openLinkModal()" style="padding: 4px 8px; border: none; background: none; cursor: pointer; border-radius: 3px; color: #3b82f6; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#dbeafe'" onmouseout="this.style.backgroundColor='transparent'" title="Insert Link">🔗</button>
                                                <button type="button" onclick="execRichCommand('unlink')" style="padding: 4px 8px; border: none; background: none; cursor: pointer; border-radius: 3px; color: #6b7280; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#e5e7eb'" onmouseout="this.style.backgroundColor='transparent'" title="Remove Link">🔗❌</button>
                                            </div>
                                            <!-- Rich Text Editor -->
                                            <div id="promo-title-editor" contenteditable="true" placeholder="Enter main title with rich formatting..." style="flex: 1; padding: 8px 12px; border: 1px solid #d1d5db; border-top: none; border-radius: 0 0 4px 4px; font-size: 14px; min-height: 60px; outline: none; word-wrap: break-word; overflow-wrap: break-word;"></div>
                                            <input type="hidden" id="promo-title" value="">
                                        </div>
                            </div>
                                    <div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
                                        <span style="font-weight: 600; color: #111827; font-size: 13px;">Title Styling:</span>
                                        <div style="display: flex; align-items: center; gap: 6px;">
                                            <label style="font-size: 13px; color: #374151;">Color:</label>
                                            <input type="color" id="title-color" value="#ffffff" style="width: 40px; height: 28px; border: 1px solid #d1d5db; border-radius: 3px; cursor: pointer;">
                            </div>
                                        <div style="display: flex; align-items: center; gap: 6px;">
                                            <label style="font-size: 13px; color: #374151;">Size:</label>
                                            <select id="title-font-size" style="padding: 4px 6px; border: 1px solid #d1d5db; border-radius: 3px; font-size: 13px; min-width: 120px;">
                                                <option value="inherit">Default</option>
                                            <option value="12px">Small (12px)</option>
                                            <option value="14px">Medium (14px)</option>
                                            <option value="16px">Large (16px)</option>
                                                <option value="18px">XL (18px)</option>
                                            <option value="20px">XXL (20px)</option>
                                            <option value="custom">Custom</option>
                                        </select>
                                        </div>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
                                        <span style="font-weight: 600; color: #111827; font-size: 13px;">Anchor Tag Styling:</span>
                                        <div style="display: flex; align-items: center; gap: 6px;">
                                            <label style="font-size: 13px; color: #374151;">Color:</label>
                                            <input type="color" id="anchor-color" value="#3b82f6" style="width: 40px; height: 28px; border: 1px solid #d1d5db; border-radius: 3px; cursor: pointer;">
                                        </div>
                                        <div style="display: flex; align-items: center; gap: 6px;">
                                            <label style="font-size: 13px; color: #374151;">Hover Color:</label>
                                            <input type="color" id="anchor-hover-color" value="#1d4ed8" style="width: 40px; height: 28px; border: 1px solid #d1d5db; border-radius: 3px; cursor: pointer;">
                                        </div>
                                    </div>
                                </div>
                                <div id="custom-title-font-size-container" style="display: none; margin-top: 10px; padding-left: 60px;">
                                    <div style="display: flex; gap: 6px; align-items: center; max-width: 150px;">
                                        <input type="number" id="custom-title-font-size-value" placeholder="Size" min="8" max="72" style="width: 60px; padding: 4px 6px; border: 1px solid #d1d5db; border-radius: 3px; font-size: 13px;">
                                        <select id="custom-title-font-size-unit" style="padding: 4px 6px; border: 1px solid #d1d5db; border-radius: 3px; font-size: 13px;">
                                                    <option value="px">px</option>
                                                    <option value="em">em</option>
                                                    <option value="rem">rem</option>
                                                    <option value="%">%</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                            
                            <!-- CTA Button Section -->
                            <div style="margin-bottom: 20px; padding: 12px; background: #f8fafc; border-radius: 6px; border: 1px solid #e5e7eb;">
                                <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap; margin-bottom: 12px;">
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                                                                <label style="display: flex; align-items: center; font-weight: 500; color: #374151;">
                                            <input type="checkbox" id="promo-cta-enabled" style="margin-right: 8px;">
                                            Enable CTA Button
                                        </label>
                                </div>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <label style="display: flex; align-items: center; font-weight: 500; color: #374151;">
                                            <input type="checkbox" id="promo-close-enabled" style="margin-right: 8px;">
                                            Enable close button
                                        </label>
                            </div>
                                    </div>
                                <div id="cta-fields-container" style="display: block;">
                                    <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap; margin-bottom: 12px;">
                                        <div style="display: flex; align-items: center; gap: 8px; min-width: 200px; flex: 1;">
                                            <label style="font-weight: 500; color: #374151; white-space: nowrap;">CTA Text:</label>
                                            <input type="text" id="promo-cta-text" placeholder="e.g., Shop Now" style="flex: 1; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;">
                                        </div>
                                        <div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
                                            <span style="font-weight: 600; color: #111827; font-size: 13px;">CTA Button Styling:</span>
                                            <div style="display: flex; align-items: center; gap: 6px;">
                                                <label style="font-size: 13px; color: #374151;">Background:</label>
                                                <input type="color" id="promo-cta-color" value="#ffffff" style="width: 40px; height: 28px; border: 1px solid #d1d5db; border-radius: 3px; cursor: pointer;">
                                            </div>
                                            <div style="display: flex; align-items: center; gap: 6px;">
                                                <label style="font-size: 13px; color: #374151;">Text Color:</label>
                                                <input type="color" id="cta-text-color" value="#3b82f6" style="width: 40px; height: 28px; border: 1px solid #d1d5db; border-radius: 3px; cursor: pointer;">
                                            </div>
                                            <div style="display: flex; align-items: center; gap: 6px;">
                                                <label style="font-size: 13px; color: #374151;">Size:</label>
                                                <select id="cta-font-size" style="padding: 4px 6px; border: 1px solid #d1d5db; border-radius: 3px; font-size: 13px; min-width: 120px;">
                                                    <option value="inherit">Default</option>
                                            <option value="12px">Small (12px)</option>
                                            <option value="14px">Medium (14px)</option>
                                            <option value="16px">Large (16px)</option>
                                                    <option value="18px">XL (18px)</option>
                                            <option value="20px">XXL (20px)</option>
                                            <option value="custom">Custom</option>
                                        </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 8px; min-width: 300px;">
                                        <label style="font-weight: 500; color: #374151; white-space: nowrap;">CTA URL:</label>
                                        <input type="url" id="promo-cta-url" placeholder="https://example.com" style="flex: 1; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;">
                                    </div>
                                </div>
                                <div id="custom-cta-font-size-container" style="display: none; margin-top: 10px; padding-left: 60px;">
                                    <div style="display: flex; gap: 6px; align-items: center; max-width: 150px;">
                                        <input type="number" id="custom-cta-font-size-value" placeholder="Size" min="8" max="72" style="width: 60px; padding: 4px 6px; border: 1px solid #d1d5db; border-radius: 3px; font-size: 13px;">
                                        <select id="custom-cta-font-size-unit" style="padding: 4px 6px; border: 1px solid #d1d5db; border-radius: 3px; font-size: 13px;">
                                                    <option value="px">px</option>
                                                    <option value="em">em</option>
                                                    <option value="rem">rem</option>
                                                    <option value="%">%</option>
                                                </select>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Countdown Section -->
                            <div style="margin-bottom: 20px; padding: 12px; background: #f8fafc; border-radius: 6px; border: 1px solid #e5e7eb;">
                                <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap; margin-bottom: 12px;">
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <label style="display: flex; align-items: center; font-weight: 500; color: #374151;">
                                            <input type="checkbox" id="promo-countdown-enabled" style="margin-right: 8px;">
                                            Enable Countdown Timer
                                        </label>
                                    </div>
                                </div>
                                <div id="countdown-fields-container" style="display: none;">
                                    <div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap; margin-bottom: 12px;">
                                        <span style="font-weight: 600; color: #111827; font-size: 13px;">Countdown Styling:</span>
                                        <div style="display: flex; align-items: center; gap: 6px;">
                                            <label style="font-size: 13px; color: #374151;">Color:</label>
                                            <input type="color" id="countdown-color" value="#ffffff" style="width: 40px; height: 28px; border: 1px solid #d1d5db; border-radius: 3px; cursor: pointer;">
                                        </div>
                                        <div style="display: flex; align-items: center; gap: 6px;">
                                            <label style="font-size: 13px; color: #374151;">Size:</label>
                                            <select id="countdown-font-size" style="padding: 4px 6px; border: 1px solid #d1d5db; border-radius: 3px; font-size: 13px; min-width: 120px;">
                                                <option value="inherit">Default</option>
                                            <option value="12px">Small (12px)</option>
                                            <option value="14px">Medium (14px)</option>
                                            <option value="16px">Large (16px)</option>
                                                <option value="18px">XL (18px)</option>
                                            <option value="20px">XXL (20px)</option>
                                            <option value="custom">Custom</option>
                                        </select>
                                        </div>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <label style="font-weight: 500; color: #374151; white-space: nowrap;">Target Date:</label>
                                        <input type="datetime-local" id="promo-countdown-date" style="padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;">
                                    </div>
                                </div>
                                <div id="custom-countdown-font-size-container" style="display: none; margin-top: 10px; padding-left: 60px;">
                                    <div style="display: flex; gap: 6px; align-items: center; max-width: 150px;">
                                        <input type="number" id="custom-countdown-font-size-value" placeholder="Size" min="8" max="72" style="width: 60px; padding: 4px 6px; border: 1px solid #d1d5db; border-radius: 3px; font-size: 13px;">
                                        <select id="custom-countdown-font-size-unit" style="padding: 4px 6px; border: 1px solid #d1d5db; border-radius: 3px; font-size: 13px;">
                                                    <option value="px">px</option>
                                                    <option value="em">em</option>
                                                    <option value="rem">rem</option>
                                                    <option value="%">%</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                            
                            <!-- Additional Options Section -->
                            <div style="margin-bottom: 20px; padding: 12px; background: #f8fafc; border-radius: 6px; border: 1px solid #e5e7eb;">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <label style="display: flex; align-items: center; font-weight: 500; color: #374151;">
                                        <input type="checkbox" id="promo-enabled" style="margin-right: 8px;">
                                        Enable Promo Bar
                                    </label>
                                </div>
                            </div>
                            
                            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
                            
                            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 20px; color: #111827;">Basic Styling</h3>
                            
                            <!-- Basic Styling Options -->
                            <div style="margin-bottom: 20px; padding: 12px; background: #f9fafb; border-radius: 6px; border: 1px solid #e5e7eb;">
                                <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <label style="font-weight: 500; color: #374151; white-space: nowrap;">Background:</label>
                                        <input type="color" id="promo-bg-color" value="#3b82f6" style="width: 50px; height: 32px; border: 1px solid #d1d5db; border-radius: 4px; cursor: pointer;">
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 8px; min-width: 150px;">
                                        <label style="font-weight: 500; color: #374151; white-space: nowrap;">Position:</label>
                                        <select id="promo-position" style="flex: 1; padding: 6px 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;">
                                            <option value="top">Top of Page</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Hidden Text Color Field (still needed for functionality) -->
                            <div style="display: none;">
                                <input type="color" id="promo-text-color" value="#ffffff">
                            </div>
                            

                            
                            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
                            
                            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 20px; color: #111827;">Page Assignment</h3>
                            
                            <div style="margin-bottom: 20px;">
                                <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">Show on Pages</label>
                                <select id="promo-assignment-type" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                                    <option value="">Choose assignment type...</option>
                                    <option value="global">All Pages (Global)</option>
                                    <option value="specific">Specific Pages</option>
                                    <option value="post_type">All Posts/Pages</option>
                                    <option value="category">Specific Categories</option>
                                    <option value="custom">Custom URL Pattern</option>
                                </select>
                            </div>
                            
                            <div id="assignment-options" style="display: none;">
                                <div id="specific-pages-option" style="display: none; margin-bottom: 20px;">
                                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">Select Pages</label>
                                    <div style="margin-bottom: 10px;">
                                        <button onclick="selectAllPages()" style="padding: 8px 16px; background: #059669; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; margin-right: 10px;">Select All Pages</button>
                                        <button onclick="clearPageSelection()" style="padding: 8px 16px; background: #dc2626; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Clear Selection</button>
                                    </div>
                                    <select id="pages-dropdown" multiple style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; min-height: 200px;">
                                        <option value="" disabled>Loading pages...</option>
                                    </select>
                                    <p style="font-size: 12px; color: #6b7280; margin-top: 5px;">Hold Ctrl (or Cmd on Mac) to select multiple pages</p>
                                </div>
                                
                                <div id="category-option" style="display: none; margin-bottom: 20px;">
                                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">Select Categories</label>
                                    <div style="margin-bottom: 10px;">
                                        <button onclick="selectAllCategories()" style="padding: 8px 16px; background: #059669; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; margin-right: 10px;">Select All Categories</button>
                                        <button onclick="clearCategorySelection()" style="padding: 8px 16px; background: #dc2626; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Clear Selection</button>
                                    </div>
                                    <select id="categories-dropdown" multiple style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; min-height: 200px;">
                                        <option value="" disabled>Loading categories...</option>
                                    </select>
                                    <p style="font-size: 12px; color: #6b7280; margin-top: 5px;">Hold Ctrl (or Cmd on Mac) to select multiple categories</p>
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
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                    <h4 style="font-size: 14px; font-weight: 600; color: #111827; margin: 0;">Current Assignments</h4>
                                    <div style="display: flex; gap: 8px;">
                                        <button onclick="normalizePriorities()" style="background: #6b7280; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;" title="Normalize priorities (make them sequential)">Normalize</button>
                                        <button onclick="clearAllAssignments()" style="background: #dc2626; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">Clear All</button>
                                    </div>
                                </div>
                                <div id="assignments-list" style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px; min-height: 50px;">
                                    <div style="text-align: center; color: #6b7280; font-size: 14px;">No assignments yet</div>
                                </div>
                                <div style="margin-top: 8px; font-size: 11px; color: #6b7280; text-align: center;">
                                    💡 Lower priority numbers = higher priority (displayed first)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Add event listeners
            setupEditorEvents();
            
            // Ensure anchor colors are properly initialized after setup
            setTimeout(() => {
                updateEditorAnchorColors();
                console.log('🔧 Admin: Anchor colors initialized after setup');
            }, 200);
            
            // Load promo bar data if ID is provided, otherwise set defaults
            if (promoBarId) {
    
                loadPromoBarData();
            } else {
                // Set default values for new promo bar
                setDefaultValues();
            }
        }
        
        function setDefaultValues() {
            // Set default checkbox states for new promo bars
            document.getElementById('promo-cta-enabled').checked = true; // CTA enabled by default
            document.getElementById('promo-close-enabled').checked = true; // Close button enabled by default
            document.getElementById('promo-countdown-enabled').checked = false; // Countdown disabled by default
            document.getElementById('promo-enabled').checked = true; // Promo bar enabled by default
            
            // Set default content for rich text editor
            const titleEditor = document.getElementById('promo-title-editor');
            const titleHiddenInput = document.getElementById('promo-title');
            if (titleEditor && titleHiddenInput) {
                titleEditor.innerHTML = 'Sample Title';
                titleHiddenInput.value = 'Sample Title';
            }
            
            // Show/hide fields based on default states
            const ctaFieldsContainer = document.getElementById('cta-fields-container');
            if (ctaFieldsContainer) {
                ctaFieldsContainer.style.display = 'block'; // Show CTA fields by default
            }
            
            const countdownFieldsContainer = document.getElementById('countdown-fields-container');
            if (countdownFieldsContainer) {
                countdownFieldsContainer.style.display = 'none'; // Hide countdown fields by default
            }
            
            // Update preview with default values
            updatePreview();
        }
        
        // Rich Text Editor Functions
        window.execRichCommand = function(command) {
            const editor = document.getElementById('promo-title-editor');
            if (editor) {
                editor.focus();
                document.execCommand(command, false, null);
                updateRichEditorValue();
                updatePreview();
                updateButtonStates();
            }
        };

        function updateButtonStates() {
            const boldBtn = document.getElementById('bold-btn');
            const underlineBtn = document.getElementById('underline-btn');
            
            if (boldBtn) {
                if (document.queryCommandState('bold')) {
                    boldBtn.style.backgroundColor = '#dbeafe';
                    boldBtn.style.color = '#2563eb';
                } else {
                    boldBtn.style.backgroundColor = 'transparent';
                    boldBtn.style.color = '#374151';
                }
            }
            
            if (underlineBtn) {
                if (document.queryCommandState('underline')) {
                    underlineBtn.style.backgroundColor = '#dbeafe';
                    underlineBtn.style.color = '#2563eb';
                } else {
                    underlineBtn.style.backgroundColor = 'transparent';
                    underlineBtn.style.color = '#374151';
                }
            }
        }

        window.openLinkModal = function() {
            // Get selected text and store the range
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();
            
            // Store the range for later use
            let savedRange = null;
            if (selection.rangeCount > 0) {
                savedRange = selection.getRangeAt(0).cloneRange();
            }
            
            // Check if we have a valid selection within the editor
            const editor = document.getElementById('promo-title-editor');
            if (!editor) return;
            
            // Ensure the selection is within our editor
            if (selection.rangeCount === 0 || !editor.contains(selection.anchorNode)) {
                alert('Please select some text in the editor first');
                return;
            }
            
            if (!selectedText) {
                alert('Please select some text to create a link');
                return;
            }
            
            // Create a simple modal for better UX
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            `;
            
            const modalContent = document.createElement('div');
            modalContent.style.cssText = `
                background: white;
                padding: 20px;
                border-radius: 8px;
                width: 400px;
                max-width: 90vw;
            `;
            
            modalContent.innerHTML = `
                <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Insert Link</h3>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 500;">URL *</label>
                    <input type="url" id="link-url" placeholder="https://example.com" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 500;">Link Text (pre-filled with selected text: "${selectedText}")</label>
                    <input type="text" id="link-text" placeholder="${selectedText}" value="${selectedText}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                </div>
                <div style="text-align: right;">
                    <button id="link-cancel" style="margin-right: 10px; padding: 8px 16px; border: 1px solid #ddd; background: #f5f5f5; border-radius: 4px; cursor: pointer;">Cancel</button>
                    <button id="link-insert" style="padding: 8px 16px; border: none; background: #3b82f6; color: white; border-radius: 4px; cursor: pointer;">Insert Link</button>
                </div>
            `;
            
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
            
            const urlInput = modal.querySelector('#link-url');
            const textInput = modal.querySelector('#link-text');
            const cancelBtn = modal.querySelector('#link-cancel');
            const insertBtn = modal.querySelector('#link-insert');
            
            urlInput.focus();
            
            const insertLink = () => {
                const url = urlInput.value.trim();
                const text = textInput.value.trim();
                
                if (!url) {
                    alert('Please enter a valid URL');
                    return;
                }
                
                // Validate URL format
                let validUrl = url;
                if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
                    validUrl = 'https://' + validUrl;
                }
                
                try {
                    new URL(validUrl);
                } catch (e) {
                    alert('Please enter a valid URL');
                    return;
                }
                
                const linkTextToUse = text || selectedText || validUrl;
                
                const editor = document.getElementById('promo-title-editor');
                if (editor) {
                    editor.focus();
                    
                    // Use the saved range if available, otherwise try to get current selection
                    if (savedRange) {
                        // Clear any existing selection
                        selection.removeAllRanges();
                        
                        // Set the saved range
                        selection.addRange(savedRange);
                        
                        // Replace the selected text with the link
                        savedRange.deleteContents();
                        
                        const linkElement = document.createElement('a');
                        linkElement.href = validUrl;
                        linkElement.target = '_blank';
                        linkElement.rel = 'noopener noreferrer';
                        linkElement.textContent = linkTextToUse;
                        
                        savedRange.insertNode(linkElement);
                        
                        // Clear selection
                        selection.removeAllRanges();
                    } else {
                        // Fallback: try to get current selection
                        const currentSelection = window.getSelection();
                        if (currentSelection.rangeCount > 0) {
                            const range = currentSelection.getRangeAt(0);
                            range.deleteContents();
                            
                            const linkElement = document.createElement('a');
                            linkElement.href = validUrl;
                            linkElement.target = '_blank';
                            linkElement.rel = 'noopener noreferrer';
                            linkElement.textContent = linkTextToUse;
                            
                            range.insertNode(linkElement);
                            currentSelection.removeAllRanges();
                        } else {
                            // Last resort: insert at cursor position
                            const linkHTML = `<a href="${validUrl}" target="_blank" rel="noopener noreferrer">${linkTextToUse}</a>`;
                            document.execCommand('insertHTML', false, linkHTML);
                        }
                    }
                    
                    updateRichEditorValue();
                    updatePreview();
                    
                    // Apply anchor colors to the newly inserted link
                    setTimeout(() => {
                        updateEditorAnchorColors();
                    }, 10);
                }
                
                document.body.removeChild(modal);
            };
            
            const closeModal = () => {
                document.body.removeChild(modal);
            };
            
            cancelBtn.addEventListener('click', closeModal);
            insertBtn.addEventListener('click', insertLink);
            
            // Handle Enter key
            urlInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    insertLink();
                }
            });
            
            textInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    insertLink();
                }
            });
            
            // Handle Escape key
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    closeModal();
                }
            });
            
            // Close on outside click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
        };

        function updateRichEditorValue() {
            const editor = document.getElementById('promo-title-editor');
            const hiddenInput = document.getElementById('promo-title');
            if (editor && hiddenInput) {
                hiddenInput.value = editor.innerHTML;
                
                // Apply anchor colors to any new links that might have been added
                setTimeout(() => {
                    updateEditorAnchorColors();
                }, 50);
            }
        }

        function updateEditorAnchorColors() {
            const editor = document.getElementById('promo-title-editor');
            const anchorColor = document.getElementById('anchor-color')?.value || '#3b82f6';
            const anchorHoverColor = document.getElementById('anchor-hover-color')?.value || '#1d4ed8';
            
            if (editor) {
                // Get all links in the editor
                const links = editor.querySelectorAll('a');
                
                links.forEach(link => {
                    // Update the color style with higher specificity
                    link.style.setProperty('color', anchorColor, 'important');
                    link.style.textDecoration = 'underline';
                    link.style.transition = 'color 0.2s ease';
                    link.className = 'promobarx-title-link';
                    link.setAttribute('data-hover-color', anchorHoverColor);
                    link.setAttribute('data-original-color', anchorColor);
                    
                    // Remove old event listeners
                    link.onmouseover = null;
                    link.onmouseout = null;
                    link.removeEventListener('mouseenter', link._mouseenterHandler);
                    link.removeEventListener('mouseleave', link._mouseleaveHandler);
                    
                    // Create new event handlers with better color management
                    link._mouseenterHandler = function() {
                        console.log('🎨 Admin: Mouse enter - changing to hover color:', anchorHoverColor);
                        this.style.setProperty('color', anchorHoverColor, 'important');
                    };
                    
                    link._mouseleaveHandler = function() {
                        console.log('🎨 Admin: Mouse leave - changing back to original color:', anchorColor);
                        this.style.setProperty('color', anchorColor, 'important');
                    };
                    
                    // Add new event listeners
                    link.addEventListener('mouseenter', link._mouseenterHandler);
                    link.addEventListener('mouseleave', link._mouseleaveHandler);
                    
                    console.log('✅ Admin: Event listeners added for link with colors:', { anchorColor, anchorHoverColor });
                });
            }
        }

        function setupRichEditor() {
            const editor = document.getElementById('promo-title-editor');
            const hiddenInput = document.getElementById('promo-title');
            
            if (editor && hiddenInput) {
                // Sync content on input
                editor.addEventListener('input', updateRichEditorValue);
                editor.addEventListener('blur', updateRichEditorValue);
                
                // Handle paste to strip formatting
                editor.addEventListener('paste', function(e) {
                    e.preventDefault();
                    const text = e.clipboardData.getData('text/plain');
                    document.execCommand('insertText', false, text);
                });
                
                // Handle enter key
                editor.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        document.execCommand('insertHTML', false, '<br>');
                    }
                });
                
                                 // Update button states on selection change
                 editor.addEventListener('keyup', updateButtonStates);
                 editor.addEventListener('mouseup', updateButtonStates);
                 editor.addEventListener('input', updateButtonStates);
                 
                 // Apply anchor colors to existing links
                 updateEditorAnchorColors();
            }
        }
        
        function setupEditorEvents() {
            // Setup rich text editor
            setupRichEditor();
            
            // Initialize anchor colors after a short delay to ensure DOM is ready
            setTimeout(() => {
                updateEditorAnchorColors();
            }, 100);
            
            // CTA Button toggle
            const ctaCheckbox = document.getElementById('promo-cta-enabled');
            const ctaFieldsContainer = document.getElementById('cta-fields-container');
            
            if (ctaCheckbox) {
                ctaCheckbox.addEventListener('change', function() {
                    // Show/hide CTA fields based on checkbox state
                    ctaFieldsContainer.style.display = this.checked ? 'block' : 'none';
                    updatePreview();
                }); 
            }
            
            // Countdown toggle
            const countdownCheckbox = document.getElementById('promo-countdown-enabled');
            const countdownFieldsContainer = document.getElementById('countdown-fields-container');
            
            if (countdownCheckbox) {
                countdownCheckbox.addEventListener('change', function() {
                    // Show/hide countdown fields based on checkbox state
                    countdownFieldsContainer.style.display = this.checked ? 'block' : 'none';
                    
                    // Set default date if empty and checkbox is checked
                    const countdownDate = document.getElementById('promo-countdown-date');
                    if (this.checked && countdownDate && !countdownDate.value) {
                        const now = new Date();
                        const futureDate = new Date(now.getTime() + (24 * 60 * 60 * 1000)); // 24 hours from now
                        countdownDate.value = futureDate.toISOString().slice(0, 16);
                    }
                    
                    updatePreview();
                }); 
            }
            
            // Countdown date change handler
            const countdownDate = document.getElementById('promo-countdown-date');
            if (countdownDate) {
                countdownDate.addEventListener('change', updatePreview);
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
            const stylingInputs = ['promo-bg-color', 'promo-text-color', 'promo-cta-color', 'promo-position'];
            stylingInputs.forEach(id => {
                const input = document.getElementById(id);
                if (input) {
                    input.addEventListener('change', updatePreview);
                }
            });
            
            // Add close button checkbox to preview updates
            const closeCheckbox = document.getElementById('promo-close-enabled');
            if (closeCheckbox) {
                closeCheckbox.addEventListener('change', updatePreview);
            }
            
            // Add enabled checkbox to preview updates
            const enabledCheckbox = document.getElementById('promo-enabled');
            if (enabledCheckbox) {
                enabledCheckbox.addEventListener('change', updatePreview);
            }
            

            
            // Individual element styling event listeners
            const individualStylingInputs = [
                'title-color', 'title-font-size', 'custom-title-font-size-value', 'custom-title-font-size-unit',
                'countdown-color', 'countdown-font-size', 'custom-countdown-font-size-value', 'custom-countdown-font-size-unit',
                'cta-text-color', 'cta-font-size', 'custom-cta-font-size-value', 'custom-cta-font-size-unit',
                'anchor-color', 'anchor-hover-color'
            ];
            
            individualStylingInputs.forEach(id => {
                const input = document.getElementById(id);
                if (input) {
                    input.addEventListener('change', updatePreview);
                    if (input.type === 'number') {
                        input.addEventListener('input', updatePreview);
                    }
                    // Add debugging for anchor color controls
                    if (id === 'anchor-color' || id === 'anchor-hover-color') {
                        console.log(`Anchor color control ${id} found and event listener added`);
                        input.addEventListener('change', () => {
                            console.log(`${id} changed to:`, input.value);
                            updateEditorAnchorColors();
                        });
                    }
                } else {
                    // Log missing elements for debugging
                    if (id === 'anchor-color' || id === 'anchor-hover-color') {
                        console.warn(`Anchor color control ${id} not found in DOM`);
                    }
                }
            });
            
            // Custom font size handling for individual elements
            const titleFontSizeSelect = document.getElementById('title-font-size');
            const customTitleFontSizeContainer = document.getElementById('custom-title-font-size-container');
            
            if (titleFontSizeSelect) {
                titleFontSizeSelect.addEventListener('change', function() {
                    if (this.value === 'custom') {
                        customTitleFontSizeContainer.style.display = 'block';
                    } else {
                        customTitleFontSizeContainer.style.display = 'none';
                    }
                    updatePreview();
                });
            }
            
            const countdownFontSizeSelect = document.getElementById('countdown-font-size');
            const customCountdownFontSizeContainer = document.getElementById('custom-countdown-font-size-container');
            
            if (countdownFontSizeSelect) {
                countdownFontSizeSelect.addEventListener('change', function() {
                    if (this.value === 'custom') {
                        customCountdownFontSizeContainer.style.display = 'block';
                    } else {
                        customCountdownFontSizeContainer.style.display = 'none';
                    }
                    updatePreview();
                });
            }
            
            const ctaFontSizeSelect = document.getElementById('cta-font-size');
            const customCtaFontSizeContainer = document.getElementById('custom-cta-font-size-container');
            
            if (ctaFontSizeSelect) {
                ctaFontSizeSelect.addEventListener('change', function() {
                    if (this.value === 'custom') {
                        customCtaFontSizeContainer.style.display = 'block';
                    } else {
                        customCtaFontSizeContainer.style.display = 'none';
                    }
                    updatePreview();
                });
            }
            
            // Page assignment events
            const assignmentType = document.getElementById('promo-assignment-type');
            if (assignmentType) {
                assignmentType.addEventListener('change', handleAssignmentTypeChange);
            }
            
            // Load categories on page load
            loadCategories();
            
            // Initial preview
            updatePreview();
            
            // Start live countdown update if countdown is enabled
            startLiveCountdown();
        }
        
        // Live countdown update function
        function startLiveCountdown() {
            const countdownCheckbox = document.getElementById('promo-countdown-enabled');
            const countdownDate = document.getElementById('promo-countdown-date');
            
            if (countdownCheckbox && countdownDate) {
                // Update countdown every second if enabled and date is set
                setInterval(() => {
                    if (countdownCheckbox.checked && countdownDate.value) {
                        updatePreview();
                    }
                }, 1000);
            }
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
            
            // Handle empty value (default option)
            if (!assignmentType || assignmentType === '') {
                return; // Do nothing, just hide all options
            }
            
            if (assignmentType === 'global') {
                // Add global assignment
                addAssignment('global', { value: 'All Pages' });
            } else if (assignmentType === 'specific') {
                assignmentOptions.style.display = 'block';
                specificPagesOption.style.display = 'block';
                loadAllPages();
            } else if (assignmentType === 'post_type') {
                addAssignment('post_type', { value: 'post' });
            } else if (assignmentType === 'category') {
                assignmentOptions.style.display = 'block';
                categoryOption.style.display = 'block';
                loadAllCategories();
            } else if (assignmentType === 'custom') {
                assignmentOptions.style.display = 'block';
                customUrlOption.style.display = 'block';
            }
        }
        
        function addAssignment(type, data) {
            // Check if this assignment type already exists
            const existingAssignment = currentAssignments.find(a => 
                a.assignment_type === type && 
                a.target_id === (data.id || 0) && 
                a.target_value === (data.value || data.name || '')
            );
            
            if (existingAssignment) {
    
                return; // Don't add duplicate
            }
            
            const assignment = {
                id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Unique temporary ID for frontend
                assignment_type: type,
                target_id: data.id || 0,
                target_value: data.value || data.name || '',
                priority: currentAssignments.length + 1
            };
            
            currentAssignments.push(assignment);
            updateAssignmentsList();

        }
        
        function removeDuplicateAssignments() {
            const seen = new Set();
            const uniqueAssignments = [];
            
            currentAssignments.forEach(assignment => {
                const key = `${assignment.assignment_type}_${assignment.target_id}_${assignment.target_value}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    uniqueAssignments.push(assignment);
                } else {
        
                }
            });
            
            if (uniqueAssignments.length !== currentAssignments.length) {
    
                currentAssignments = uniqueAssignments;
                updateAssignmentsList();
            }
        }
        
        function removeAssignment(id) {

            
            const beforeCount = currentAssignments.length;
            currentAssignments = currentAssignments.filter(a => {
                const matches = a.id !== id;

                return matches;
            });
            const afterCount = currentAssignments.length;
            

            
            // Update the display after removal (don't normalize priorities automatically)
            updateAssignmentsList();
        }
        
        function updateAssignmentsList() {
            // Remove any duplicates before updating the display
            removeDuplicateAssignments();
            
            const assignmentsList = document.getElementById('assignments-list');
            if (!assignmentsList) return;
            

            
            if (currentAssignments.length === 0) {
                assignmentsList.innerHTML = '<div style="text-align: center; color: #6b7280; font-size: 14px;">No assignments yet</div>';
                return;
            }
            
            // Sort assignments by priority
            const sortedAssignments = [...currentAssignments].sort((a, b) => (a.priority || 0) - (b.priority || 0));
            
            assignmentsList.innerHTML = sortedAssignments.map((assignment, index) => {
                const label = getAssignmentLabel(assignment);

                return `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: white; border: 1px solid #e5e7eb; border-radius: 4px; margin-bottom: 8px;">
                        <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
                            <span style="font-size: 12px; color: #6b7280; min-width: 20px;">${assignment.priority || index + 1}</span>
                            <span style="font-size: 14px; color: #374151; flex: 1;">${label}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 4px;">
                            <input 
                                type="number" 
                                value="${assignment.priority || index + 1}" 
                                min="1" 
                                max="999"
                                style="width: 60px; padding: 4px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 12px;"
                                onchange="updateAssignmentPriority('${assignment.id}', this.value)"
                                title="Priority (lower number = higher priority)"
                            />
                            <button 
                                onclick="moveAssignmentUp('${assignment.id}')" 
                                style="background: none; border: none; color: #6b7280; cursor: pointer; font-size: 14px; padding: 2px;"
                                title="Move up"
                                ${index === 0 ? 'disabled' : ''}
                            >↑</button>
                            <button 
                                onclick="moveAssignmentDown('${assignment.id}')" 
                                style="background: none; border: none; color: #6b7280; cursor: pointer; font-size: 14px; padding: 2px;"
                                title="Move down"
                                ${index === sortedAssignments.length - 1 ? 'disabled' : ''}
                            >↓</button>
                            <button 
                                onclick="removeAssignment('${assignment.id}')" 
                                style="background: none; border: none; color: #dc2626; cursor: pointer; font-size: 16px;"
                                title="Remove assignment"
                            >×</button>
                        </div>
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
        
        // Priority management functions
        window.updateAssignmentPriority = function(assignmentId, newPriority) {

            
            const assignment = currentAssignments.find(a => a.id === assignmentId);
            if (!assignment) {
                console.error('Assignment not found:', assignmentId);
                return;
            }
            
            const priority = parseInt(newPriority) || 1;
            assignment.priority = Math.max(1, Math.min(999, priority));
            

            updateAssignmentsList();
        };
        
        window.moveAssignmentUp = function(assignmentId) {

            
            const assignment = currentAssignments.find(a => a.id === assignmentId);
            if (!assignment) {
                console.error('Assignment not found:', assignmentId);
                return;
            }
            
            // Sort assignments by priority
            const sortedAssignments = [...currentAssignments].sort((a, b) => (a.priority || 0) - (b.priority || 0));
            const currentIndex = sortedAssignments.findIndex(a => a.id === assignmentId);
            
            if (currentIndex <= 0) {
    
                return;
            }
            
            const previousAssignment = sortedAssignments[currentIndex - 1];
            
            // Swap priorities
            const tempPriority = assignment.priority;
            assignment.priority = previousAssignment.priority;
            previousAssignment.priority = tempPriority;
            

            updateAssignmentsList();
        };
        
        window.moveAssignmentDown = function(assignmentId) {

            
            const assignment = currentAssignments.find(a => a.id === assignmentId);
            if (!assignment) {
                console.error('Assignment not found:', assignmentId);
                return;
            }
            
            // Sort assignments by priority
            const sortedAssignments = [...currentAssignments].sort((a, b) => (a.priority || 0) - (b.priority || 0));
            const currentIndex = sortedAssignments.findIndex(a => a.id === assignmentId);
            
            if (currentIndex >= sortedAssignments.length - 1) {
    
                return;
            }
            
            const nextAssignment = sortedAssignments[currentIndex + 1];
            
            // Swap priorities
            const tempPriority = assignment.priority;
            assignment.priority = nextAssignment.priority;
            nextAssignment.priority = tempPriority;
            

            updateAssignmentsList();
        };
        
        // Function to normalize priorities (ensure they are sequential)
        window.normalizePriorities = function() {
            // Sort assignments by current priority
            const sortedAssignments = [...currentAssignments].sort((a, b) => (a.priority || 0) - (b.priority || 0));
            
            // Reassign sequential priorities
            sortedAssignments.forEach((assignment, index) => {
                assignment.priority = index + 1;
            });
            
            updateAssignmentsList();
        };
        

        
        function loadAllPages() {
            if (!window.promobarxAdmin || !window.promobarxAdmin.ajaxurl) return;
            
            const pagesDropdown = document.getElementById('pages-dropdown');
            if (!pagesDropdown) return;
            
            pagesDropdown.innerHTML = '<option value="" disabled>Loading pages...</option>';
            
            const formData = new FormData();
            formData.append('action', 'promobarx_get_pages');
            formData.append('nonce', window.promobarxAdmin.nonce);
            
            fetch(window.promobarxAdmin.ajaxurl, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    displayPagesDropdown(data.data);
                } else {
                    pagesDropdown.innerHTML = '<option value="" disabled>Error loading pages</option>';
                }
            })
            .catch(error => {
                pagesDropdown.innerHTML = '<option value="" disabled>Error loading pages</option>';
            });
        }
        
        function displayPagesDropdown(pages) {
            const pagesDropdown = document.getElementById('pages-dropdown');
            if (!pagesDropdown) return;
            
            pagesDropdown.innerHTML = pages.map(page => 
                `<option value="${page.id}" data-title="${page.title}">${page.title} (${page.type})</option>`
            ).join('');
            
            // Add change event listener to handle selections
            pagesDropdown.addEventListener('change', handlePageSelection);
        }
        
        function handlePageSelection() {
            const pagesDropdown = document.getElementById('pages-dropdown');
            const selectedOptions = Array.from(pagesDropdown.selectedOptions);
            
            // Remove existing page assignments
            currentAssignments = currentAssignments.filter(a => a.assignment_type !== 'page');
            
            // Add new page assignments
            selectedOptions.forEach(option => {
                addAssignment('page', { 
                    id: parseInt(option.value), 
                    value: option.getAttribute('data-title') || option.text 
                });
            });
        }
        
        function loadAllCategories() {
            if (!window.promobarxAdmin || !window.promobarxAdmin.ajaxurl) return;
            
            const categoriesDropdown = document.getElementById('categories-dropdown');
            if (!categoriesDropdown) return;
            
            categoriesDropdown.innerHTML = '<option value="" disabled>Loading categories...</option>';
            
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
                    displayCategoriesDropdown(data.data);
                } else {
                    categoriesDropdown.innerHTML = '<option value="" disabled>Error loading categories</option>';
                }
            })
            .catch(error => {
                categoriesDropdown.innerHTML = '<option value="" disabled>Error loading categories</option>';
            });
        }
        
        function displayCategoriesDropdown(categories) {
            const categoriesDropdown = document.getElementById('categories-dropdown');
            if (!categoriesDropdown) return;
            
            categoriesDropdown.innerHTML = categories.map(category => 
                `<option value="${category.id}" data-name="${category.name}">${category.name}</option>`
            ).join('');
            
            // Add change event listener to handle selections
            categoriesDropdown.addEventListener('change', handleCategorySelection);
        }
        
        function handleCategorySelection() {
            const categoriesDropdown = document.getElementById('categories-dropdown');
            const selectedOptions = Array.from(categoriesDropdown.selectedOptions);
            
            // Remove existing category assignments
            currentAssignments = currentAssignments.filter(a => a.assignment_type !== 'category');
            
            // Add new category assignments
            selectedOptions.forEach(option => {
                addAssignment('category', { 
                    id: parseInt(option.value), 
                    value: option.getAttribute('data-name') || option.text 
                });
            });
        }
        
        function loadCategories() {
            // This function is kept for backward compatibility
            loadAllCategories();
        }
        
        function displayCategories(categories) {
            // This function is kept for backward compatibility
            displayCategoriesDropdown(categories);
        }
        
        // Make functions globally accessible
        window.addAssignment = addAssignment;
        window.removeAssignment = removeAssignment;
        
        // Function to clear all assignments
        window.clearAllAssignments = function() {
            currentAssignments = [];
            updateAssignmentsList();
        };
        
        // Function to remove duplicates
        window.removeDuplicateAssignments = removeDuplicateAssignments;
        
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
        
        // Select All functions
        window.selectAllPages = function() {
            const pagesDropdown = document.getElementById('pages-dropdown');
            if (!pagesDropdown) return;
            
            // Select all options
            Array.from(pagesDropdown.options).forEach(option => {
                option.selected = true;
            });
            
            // Trigger the change event
            handlePageSelection();
        };
        
        window.clearPageSelection = function() {
            const pagesDropdown = document.getElementById('pages-dropdown');
            if (!pagesDropdown) return;
            
            // Clear all selections
            Array.from(pagesDropdown.options).forEach(option => {
                option.selected = false;
            });
            
            // Remove all page assignments
            currentAssignments = currentAssignments.filter(a => a.assignment_type !== 'page');
            updateAssignmentsList();
        };
        
        window.selectAllCategories = function() {
            const categoriesDropdown = document.getElementById('categories-dropdown');
            if (!categoriesDropdown) return;
            
            // Select all options
            Array.from(categoriesDropdown.options).forEach(option => {
                option.selected = true;
            });
            
            // Trigger the change event
            handleCategorySelection();
        };
        
        window.clearCategorySelection = function() {
            const categoriesDropdown = document.getElementById('categories-dropdown');
            if (!categoriesDropdown) return;
            
            // Clear all selections
            Array.from(categoriesDropdown.options).forEach(option => {
                option.selected = false;
            });
            
            // Remove all category assignments
            currentAssignments = currentAssignments.filter(a => a.assignment_type !== 'category');
            updateAssignmentsList();
        };
        
        function updatePreview() {
            const preview = document.getElementById('promo-preview');
            if (!preview) return;
            
            const titleElement = document.getElementById('promo-title');
            const title = titleElement?.value || 'Sample Title';
            const ctaText = document.getElementById('promo-cta-text')?.value || 'Shop Now';
            const ctaEnabled = document.getElementById('promo-cta-enabled')?.checked || false;
            const countdownEnabled = document.getElementById('promo-countdown-enabled')?.checked || false;
            const countdownDate = document.getElementById('promo-countdown-date')?.value || '';
            const closeEnabled = document.getElementById('promo-close-enabled')?.checked || false;
            const promoEnabled = document.getElementById('promo-enabled')?.checked || false;
            
            // Get base styling values
            const bgColor = document.getElementById('promo-bg-color')?.value || '#3b82f6';
            const textColor = document.getElementById('promo-text-color')?.value || '#ffffff';
            const ctaColor = document.getElementById('promo-cta-color')?.value || '#ffffff';
            
            // Use default font size since individual elements have their own font sizes
            const fontSize = '14px';
            
            const position = document.getElementById('promo-position')?.value || 'top';
            
            // Get individual element styling
            const titleColor = document.getElementById('title-color')?.value || textColor;
            const countdownColor = document.getElementById('countdown-color')?.value || textColor;
            const ctaTextColor = document.getElementById('cta-text-color')?.value || bgColor;
            const anchorColor = document.getElementById('anchor-color')?.value || '#3b82f6';
            const anchorHoverColor = document.getElementById('anchor-hover-color')?.value || '#1d4ed8';
            
            // Handle title font size
            let titleFontSize = document.getElementById('title-font-size')?.value || 'inherit';
            if (titleFontSize === 'custom') {
                const customValue = document.getElementById('custom-title-font-size-value')?.value || '14';
                const customUnit = document.getElementById('custom-title-font-size-unit')?.value || 'px';
                titleFontSize = customValue + customUnit;
            }
            
            // Handle countdown font size
            let countdownFontSize = document.getElementById('countdown-font-size')?.value || 'inherit';
            if (countdownFontSize === 'custom') {
                const customValue = document.getElementById('custom-countdown-font-size-value')?.value || '14';
                const customUnit = document.getElementById('custom-countdown-font-size-unit')?.value || 'px';
                countdownFontSize = customValue + customUnit;
            }
            
            // Handle CTA font size
            let ctaFontSize = document.getElementById('cta-font-size')?.value || 'inherit';
            if (ctaFontSize === 'custom') {
                const customValue = document.getElementById('custom-cta-font-size-value')?.value || '14';
                const customUnit = document.getElementById('custom-cta-font-size-unit')?.value || 'px';
                ctaFontSize = customValue + customUnit;
            }
            
            // Calculate countdown if enabled and date is set
            let countdownDisplay = '';
            if (countdownEnabled && countdownDate) {
                const targetDate = new Date(countdownDate);
                const now = new Date();
                const timeDiff = targetDate.getTime() - now.getTime();
                
                if (timeDiff > 0) {
                    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
                    
                    // Simple format: 108d 19h 43m 08s
                    const timeString = `${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
                    
                    const countdownFontSizeStyle = countdownFontSize !== 'inherit' ? `font-size: ${countdownFontSize};` : '';
                    countdownDisplay = `<div style="font-weight: 600; font-family: monospace; ${countdownFontSizeStyle} color: ${countdownColor};">
                        ${timeString}
                    </div>`;
                } else {
                    const countdownFontSizeStyle = countdownFontSize !== 'inherit' ? `font-size: ${countdownFontSize};` : '';
                    countdownDisplay = `<div style="font-weight: 600; font-family: monospace; ${countdownFontSizeStyle} color: #ff4444;">EXPIRED</div>`;
                }
            }
            
            // Apply individual styling
            const titleFontSizeStyle = titleFontSize !== 'inherit' ? `font-size: ${titleFontSize};` : '';
            const ctaFontSizeStyle = ctaFontSize !== 'inherit' ? `font-size: ${ctaFontSize};` : '';
            
            const disabledStyle = promoEnabled ? '' : 'opacity: 0.5; filter: grayscale(50%);';
            const statusText = promoEnabled ? 'Enabled' : 'Disabled';
            const statusColor = promoEnabled ? '#10b981' : '#ef4444';
            
            // Process title content to apply anchor colors to links
            let processedTitle = title;
            if (title.includes('<a ')) {
                // Replace existing link styles with our anchor colors
                processedTitle = title.replace(
                    /<a\s+([^>]*?)>/gi,
                    `<a $1 style="color: ${anchorColor} !important; text-decoration: underline; transition: color 0.2s ease;" class="promobarx-title-link" data-hover-color="${anchorHoverColor}" data-original-color="${anchorColor}">`
                );
            }
            
            preview.innerHTML = `
                <div style="background: ${bgColor}; color: ${textColor}; padding: 12px 20px; border-radius: 6px; display: flex; align-items: center; justify-content: space-between; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: ${fontSize}; ${disabledStyle}">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 20px; flex: 1;">
                        <div>
                            <div style="font-weight: 600; color: ${titleColor}; ${titleFontSizeStyle}">${processedTitle}</div>
                        </div>
                        ${countdownDisplay}
                        ${ctaEnabled ? `<a href="#" style="background: ${ctaColor}; color: ${ctaTextColor}; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-weight: 500; ${ctaFontSizeStyle}; transition: all 0.2s ease;">${ctaText}</a>` : ''}
                    </div>
                    ${closeEnabled ? '<button style="background: none; border: none; color: ' + textColor + '; font-size: 18px; cursor: pointer; opacity: 0.7;">×</button>' : ''}
                </div>
                <div style="margin-top: 10px; font-size: 12px; color: #6b7280; text-align: center;">
                    <span style="color: ${statusColor}; font-weight: 600;">Status: ${statusText}</span> | Position: Top of Page
                    ${countdownEnabled && countdownDate ? `<br>Countdown Target: ${new Date(countdownDate).toLocaleDateString()} ${new Date(countdownDate).toLocaleTimeString()}` : ''}
                </div>
            `;
            
            // Add hover handling for anchor links in preview
            setTimeout(() => {
                const titleLinks = preview.querySelectorAll('.promobarx-title-link');
                titleLinks.forEach(link => {
                    const hoverColor = link.getAttribute('data-hover-color');
                    const originalColor = link.getAttribute('data-original-color') || link.style.color || getComputedStyle(link).color;
                    
                    if (hoverColor) {
                        // Remove any existing event listeners
                        link.removeEventListener('mouseenter', link._mouseenterHandler);
                        link.removeEventListener('mouseleave', link._mouseleaveHandler);
                        
                        // Create new event handlers with better color management
                        link._mouseenterHandler = function() {
                            console.log('🎨 Preview: Mouse enter - changing to hover color:', hoverColor);
                            this.style.setProperty('color', hoverColor, 'important');
                        };
                        
                        link._mouseleaveHandler = function() {
                            console.log('🎨 Preview: Mouse leave - changing back to original color:', originalColor);
                            this.style.setProperty('color', originalColor, 'important');
                        };
                        
                        // Add event listeners
                        link.addEventListener('mouseenter', link._mouseenterHandler);
                        link.addEventListener('mouseleave', link._mouseleaveHandler);
                        
                        console.log('✅ Preview: Event listeners added for link with colors:', { originalColor, hoverColor });
                    }
                });
            }, 0);
        }
        
        // Debug function to test anchor hover functionality
        window.testAnchorHover = function() {
            console.log('🧪 Testing anchor hover functionality...');
            const links = document.querySelectorAll('.promobarx-title-link');
            console.log('Found links:', links.length);
            
            links.forEach((link, index) => {
                const hoverColor = link.getAttribute('data-hover-color');
                const originalColor = link.getAttribute('data-original-color');
                console.log(`Link ${index + 1}:`, {
                    hoverColor,
                    originalColor,
                    currentColor: link.style.color,
                    hasEventListeners: !!link._mouseenterHandler
                });
            });
        };
        
        // Make functions globally accessible
        window.savePromoBar = function() {
            
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
            
            // Handle countdown date format conversion for saving
            let countdownDate = '';
            const countdownDateInput = document.getElementById('promo-countdown-date')?.value || '';
            if (countdownDateInput) {
                try {
                    const localDate = new Date(countdownDateInput);
                    if (!isNaN(localDate.getTime())) {
                        // Convert to ISO string format for database storage
                        countdownDate = localDate.toISOString().slice(0, 19).replace('T', ' ');
                    }
                } catch (e) {
                    // Handle date conversion error silently
                }
            }
            
            const data = {
                name: name,
                title: title,
                cta_text: document.getElementById('promo-cta-text')?.value || '',
                cta_url: document.getElementById('promo-cta-url')?.value || '',
                countdown_enabled: document.getElementById('promo-countdown-enabled')?.checked || false,
                countdown_date: countdownDate,
                close_button_enabled: document.getElementById('promo-close-enabled')?.checked || false,
                status: document.getElementById('promo-enabled')?.checked ? 'active' : 'draft',
                styling: JSON.stringify({
                    background: document.getElementById('promo-bg-color')?.value || '#3b82f6',
                    color: document.getElementById('promo-text-color')?.value || '#ffffff',
                    position: document.getElementById('promo-position')?.value || 'top',
                    // CTA enabled state
                    cta_enabled: document.getElementById('promo-cta-enabled')?.checked || false,
                    // Individual element styling
                    title_color: document.getElementById('title-color')?.value || document.getElementById('promo-text-color')?.value || '#ffffff',
                    title_font_size: (() => {
                        const fontSize = document.getElementById('title-font-size')?.value || 'inherit';
                        if (fontSize === 'custom') {
                            const customValue = document.getElementById('custom-title-font-size-value')?.value || '14';
                            const customUnit = document.getElementById('custom-title-font-size-unit')?.value || 'px';
                            return customValue + customUnit;
                        }
                        return fontSize;
                    })(),
                    countdown_color: document.getElementById('countdown-color')?.value || document.getElementById('promo-text-color')?.value || '#ffffff',
                    countdown_font_size: (() => {
                        const fontSize = document.getElementById('countdown-font-size')?.value || 'inherit';
                        if (fontSize === 'custom') {
                            const customValue = document.getElementById('custom-countdown-font-size-value')?.value || '14';
                            const customUnit = document.getElementById('custom-countdown-font-size-unit')?.value || 'px';
                            return customValue + customUnit;
                        }
                        return fontSize;
                    })(),
                    cta_text_color: document.getElementById('cta-text-color')?.value || document.getElementById('promo-bg-color')?.value || '#3b82f6',
                    cta_font_size: (() => {
                        const fontSize = document.getElementById('cta-font-size')?.value || 'inherit';
                        if (fontSize === 'custom') {
                            const customValue = document.getElementById('custom-cta-font-size-value')?.value || '14';
                            const customUnit = document.getElementById('custom-cta-font-size-unit')?.value || 'px';
                            return customValue + customUnit;
                        }
                        return fontSize;
                    })(),
                    anchor_color: document.getElementById('anchor-color')?.value || '#3b82f6',
                    anchor_hover_color: document.getElementById('anchor-hover-color')?.value || '#1d4ed8'
                }),
                cta_style: JSON.stringify({
                    background: document.getElementById('promo-cta-color')?.value || '#ffffff',
                    color: document.getElementById('promo-bg-color')?.value || '#3b82f6'
                }),
                assignments: JSON.stringify(currentAssignments)
            };
            
            // Save assignments with their current priority values (don't normalize automatically)
            if (currentAssignments.length > 0) {
                data.assignments = JSON.stringify(currentAssignments);
            }
            
            // Add ID if editing existing promo bar
            if (promoBarId) {
                data.id = promoBarId;
            }
            

            
            if (window.promobarxAdmin && window.promobarxAdmin.ajaxurl) {
                const formData = new URLSearchParams();
                formData.append('action', 'promobarx_save');
                formData.append('nonce', window.promobarxAdmin.nonce);
                
                // Add all data fields
                Object.keys(data).forEach(key => {
                    formData.append(key, data[key]);
                });
                

                
                fetch(window.promobarxAdmin.ajaxurl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData.toString()
                })
                .then(response => {
                    return response.json();
                })
                .then(result => {
                    if (result.success) {
                        alert('Promo bar saved successfully!');
                        window.location.href = 'admin.php?page=promo-bar-x-topbar-manager';
                    } else {
                        alert('Error saving promo bar: ' + (result.data || 'Unknown error'));
                    }
                })
                .catch(error => {
                    alert('Error saving promo bar. Please try again.');
                });
            } else {
                alert('Admin data not available. Please refresh the page.');
            }
        }
        


        window.loadPromoBarData = function() {
            const urlParams = new URLSearchParams(window.location.search);
            const promoBarId = urlParams.get('id');
            
            if (!promoBarId) {
                alert('No promo bar ID found in the URL.');
                return;
            }



            if (window.promobarxAdmin && window.promobarxAdmin.ajaxurl) {
                const formData = new URLSearchParams();
                formData.append('action', 'promobarx_get_promo_bar');
                formData.append('nonce', window.promobarxAdmin.nonce);
                formData.append('id', promoBarId);



                fetch(window.promobarxAdmin.ajaxurl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData.toString()
                })
                .then(response => {
                    return response.json();
                })
                .then(result => {
                    if (result.success && result.data) {
                        const promoBar = result.data;
                        
                        // Parse styling data
                        let styling = {};
                        if (promoBar.styling) {
                            try {
                                styling = typeof promoBar.styling === 'string' ? JSON.parse(promoBar.styling) : promoBar.styling;
                            } catch (e) {
                                styling = {};
                            }
                        }
                        
                        // Parse CTA style data
                        let ctaStyle = {};
                        if (promoBar.cta_style) {
                            try {
                                ctaStyle = typeof promoBar.cta_style === 'string' ? JSON.parse(promoBar.cta_style) : promoBar.cta_style;
                            } catch (e) {
                                ctaStyle = {};
                            }
                        }
                        
                        // Fill form fields
                        document.getElementById('promo-name').value = promoBar.name || '';
                        
                        // Handle rich text editor for title
                        const titleEditor = document.getElementById('promo-title-editor');
                        const titleHiddenInput = document.getElementById('promo-title');
                        if (titleEditor && titleHiddenInput) {
                            titleEditor.innerHTML = promoBar.title || '';
                            titleHiddenInput.value = promoBar.title || '';
                        } else {
                            // Fallback for regular input
                            const titleInput = document.getElementById('promo-title');
                            if (titleInput) {
                                titleInput.value = promoBar.title || '';
                            }
                        }
                        document.getElementById('promo-cta-text').value = promoBar.cta_text || '';
                        document.getElementById('promo-cta-url').value = promoBar.cta_url || '';
                        // Convert string '0'/'1' or boolean to proper boolean
                        const countdownEnabled = promoBar.countdown_enabled === true || promoBar.countdown_enabled === 1 || promoBar.countdown_enabled === '1';
                        document.getElementById('promo-countdown-enabled').checked = countdownEnabled;
                        
                        // Handle countdown date format conversion
                        if (promoBar.countdown_date) {
                            try {
                                const date = new Date(promoBar.countdown_date);
                                if (!isNaN(date.getTime())) {
                                    // Convert to datetime-local format (YYYY-MM-DDTHH:MM)
                                    const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
                                    document.getElementById('promo-countdown-date').value = localDate.toISOString().slice(0, 16);
                                } else {
                                    document.getElementById('promo-countdown-date').value = '';
                                }
                            } catch (e) {
                                document.getElementById('promo-countdown-date').value = '';
                            }
                        } else {
                            document.getElementById('promo-countdown-date').value = '';
                        }
                        
                        document.getElementById('promo-close-enabled').checked = Boolean(promoBar.close_button_enabled);
                        document.getElementById('promo-enabled').checked = promoBar.status === 'active';
                        
                        // Fill styling fields
                        document.getElementById('promo-bg-color').value = styling.background || '#3b82f6';
                        document.getElementById('promo-text-color').value = styling.color || '#ffffff';
                        

                        
                        document.getElementById('promo-position').value = styling.position || 'top';
                        document.getElementById('promo-cta-color').value = ctaStyle.background || '#ffffff';
                        
                        // Load CTA enabled state - convert string '0'/'1' or boolean to proper boolean
                        const ctaEnabled = styling.cta_enabled !== undefined ? 
                            (styling.cta_enabled === true || styling.cta_enabled === 1 || styling.cta_enabled === '1') : 
                            true; // Default to true for backward compatibility
                        document.getElementById('promo-cta-enabled').checked = ctaEnabled;
                        
                        // Show/hide CTA fields based on loaded state
                        const ctaFieldsContainer = document.getElementById('cta-fields-container');
                        if (ctaFieldsContainer) {
                            ctaFieldsContainer.style.display = ctaEnabled ? 'block' : 'none';
                        }
                        
                        // Load individual element styling
                        // Title styling
                        document.getElementById('title-color').value = styling.title_color || styling.color || '#ffffff';
                        
                        const savedTitleFontSize = styling.title_font_size || 'inherit';
                        const titleFontSizeSelect = document.getElementById('title-font-size');
                        const customTitleFontSizeContainer = document.getElementById('custom-title-font-size-container');
                        const customTitleFontSizeValue = document.getElementById('custom-title-font-size-value');
                        const customTitleFontSizeUnit = document.getElementById('custom-title-font-size-unit');
                        
                        const predefinedTitleSizes = ['inherit', '12px', '14px', '16px', '18px', '20px'];
                        if (predefinedTitleSizes.includes(savedTitleFontSize)) {
                            titleFontSizeSelect.value = savedTitleFontSize;
                            customTitleFontSizeContainer.style.display = 'none';
                        } else {
                            titleFontSizeSelect.value = 'custom';
                            customTitleFontSizeContainer.style.display = 'block';
                            
                            const match = savedTitleFontSize.match(/^(\d+(?:\.\d+)?)(px|em|rem|%)$/);
                            if (match) {
                                customTitleFontSizeValue.value = match[1];
                                customTitleFontSizeUnit.value = match[2];
                            } else {
                                customTitleFontSizeValue.value = '14';
                                customTitleFontSizeUnit.value = 'px';
                            }
                        }
                        
                        // Countdown styling
                        document.getElementById('countdown-color').value = styling.countdown_color || styling.color || '#ffffff';
                        
                        const savedCountdownFontSize = styling.countdown_font_size || 'inherit';
                        const countdownFontSizeSelect = document.getElementById('countdown-font-size');
                        const customCountdownFontSizeContainer = document.getElementById('custom-countdown-font-size-container');
                        const customCountdownFontSizeValue = document.getElementById('custom-countdown-font-size-value');
                        const customCountdownFontSizeUnit = document.getElementById('custom-countdown-font-size-unit');
                        
                        if (predefinedTitleSizes.includes(savedCountdownFontSize)) {
                            countdownFontSizeSelect.value = savedCountdownFontSize;
                            customCountdownFontSizeContainer.style.display = 'none';
                        } else {
                            countdownFontSizeSelect.value = 'custom';
                            customCountdownFontSizeContainer.style.display = 'block';
                            
                            const match = savedCountdownFontSize.match(/^(\d+(?:\.\d+)?)(px|em|rem|%)$/);
                            if (match) {
                                customCountdownFontSizeValue.value = match[1];
                                customCountdownFontSizeUnit.value = match[2];
                            } else {
                                customCountdownFontSizeValue.value = '14';
                                customCountdownFontSizeUnit.value = 'px';
                            }
                        }
                        
                        // CTA styling
                        document.getElementById('cta-text-color').value = styling.cta_text_color || styling.background || '#3b82f6';
                        
                        const savedCtaFontSize = styling.cta_font_size || 'inherit';
                        const ctaFontSizeSelect = document.getElementById('cta-font-size');
                        const customCtaFontSizeContainer = document.getElementById('custom-cta-font-size-container');
                        const customCtaFontSizeValue = document.getElementById('custom-cta-font-size-value');
                        const customCtaFontSizeUnit = document.getElementById('custom-cta-font-size-unit');
                        
                        if (predefinedTitleSizes.includes(savedCtaFontSize)) {
                            ctaFontSizeSelect.value = savedCtaFontSize;
                            customCtaFontSizeContainer.style.display = 'none';
                        } else {
                            ctaFontSizeSelect.value = 'custom';
                            customCtaFontSizeContainer.style.display = 'block';
                            
                            const match = savedCtaFontSize.match(/^(\d+(?:\.\d+)?)(px|em|rem|%)$/);
                            if (match) {
                                customCtaFontSizeValue.value = match[1];
                                customCtaFontSizeUnit.value = match[2];
                            } else {
                                customCtaFontSizeValue.value = '14';
                                customCtaFontSizeUnit.value = 'px';
                            }
                        }
                        
                                                 // Anchor styling
                         document.getElementById('anchor-color').value = styling.anchor_color || '#3b82f6';
                         document.getElementById('anchor-hover-color').value = styling.anchor_hover_color || '#1d4ed8';
                         
                         // Apply anchor colors to editor links
                         setTimeout(() => {
                             updateEditorAnchorColors();
                         }, 100);

                        // Show/hide countdown fields container
                        const countdownFieldsContainer = document.getElementById('countdown-fields-container');
                        if (countdownFieldsContainer) {
                            countdownFieldsContainer.style.display = countdownEnabled ? 'block' : 'none';
                        }

                        updatePreview(); // Update preview with loaded data
                        
                        // Load assignments if they exist
                        if (promoBar.assignments) {
                            try {
                                const assignments = typeof promoBar.assignments === 'string' ? JSON.parse(promoBar.assignments) : promoBar.assignments;
                                // Ensure all assignments have proper IDs and priority values
                                currentAssignments = assignments.map((assignment, index) => ({
                                    ...assignment,
                                    id: assignment.id || `db_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                                    priority: assignment.priority || (index + 1) // Ensure priority exists
                                }));
                                updateAssignmentsList();
                            } catch (e) {
                                // Handle assignment parsing error silently
                            }
                        }
                        

                    } else {
                        alert('Error loading promo bar data: ' + (result.data || 'Unknown error'));
                    }
                })
                .catch(error => {
                    alert('Error loading promo bar data. Please try again.');
                });
            } else {
                alert('Admin data not available for loading. Please refresh the page.');
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
        // Handle initialization error silently
        
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