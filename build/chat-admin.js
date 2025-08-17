(function(){"use strict";const ut="modulepreload",mt=function(t){return"/"+t},gt={},Ce=function(r,d,n){let c=Promise.resolve();function p(m){const g=new Event("vite:preloadError",{cancelable:!0});if(g.payload=m,window.dispatchEvent(g),!g.defaultPrevented)throw m}return c.then(m=>{for(const g of m||[])g.status==="rejected"&&p(g.reason);return r().catch(p)})};(function(){let t={promoBars:[],loading:!0,activeTab:"manage"},r=null;function d(u){if(r=document.getElementById(u),!r){console.error("Container not found:",u);return}n(),window.promobarxAdmin&&window.promobarxAdmin.ajaxurl&&window.promobarxAdmin.nonce?c():(console.log("Admin data not available"),t.loading=!1,C())}function n(){r.innerHTML=`
            <div style="display: flex; align-items: center; justify-content: center; height: 256px;">
                <div style="width: 32px; height: 32px; border: 2px solid #e5e7eb; border-top: 2px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `}async function c(){try{const w=await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"action=promobarx_get_promo_bars&nonce="+window.promobarxAdmin.nonce})).json();w.success&&(t.promoBars=w.data)}catch(u){console.error("Error loading promo bars:",u)}finally{t.loading=!1,C()}}async function p(u){if(confirm("Are you sure you want to delete this promo bar?"))try{(await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`action=promobarx_delete&id=${u}&nonce=${window.promobarxAdmin.nonce}`})).json()).success&&await c()}catch(w){console.error("Error deleting promo bar:",w)}}async function m(u){const w=u.status==="active"?"paused":"active";try{(await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`action=promobarx_save&id=${u.id}&status=${w}&nonce=${window.promobarxAdmin.nonce}`})).json()).success&&await c()}catch(P){console.error("Error updating status:",P)}}function g(){window.location.href="admin.php?page=promo-bar-x-editor"}function x(u){window.location.href=`admin.php?page=promo-bar-x-editor&id=${u.id}`}function y(u){t.activeTab=u,C()}function h(u){const w={draft:{color:"background-color: #f3f4f6; color: #374151;",label:"Draft"},active:{color:"background-color: #d1fae5; color: #065f46;",label:"Active"},paused:{color:"background-color: #fef3c7; color: #92400e;",label:"Paused"},archived:{color:"background-color: #fee2e2; color: #991b1b;",label:"Archived"}},P=w[u]||w.draft;return`<span style="padding: 4px 8px; border-radius: 9999px; font-size: 12px; font-weight: 500; ${P.color}">${P.label}</span>`}function k(u){return new Date(u).toLocaleDateString()}function C(){if(t.loading){n();return}r.innerHTML=`
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
                        <button onclick="window.simpleTopBarManager.switchTab('manage')" style="padding: 8px 4px; border-bottom: 2px solid ${t.activeTab==="manage"?"#3b82f6":"transparent"}; color: ${t.activeTab==="manage"?"#3b82f6":"#6b7280"}; background: none; border-top: none; border-left: none; border-right: none; font-weight: 500; font-size: 14px; cursor: pointer;">
                            <svg style="width: 16px; height: 16px; display: inline; margin-right: 8px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            Manage Promo Bars
                        </button>
                        <button onclick="window.simpleTopBarManager.switchTab('templates')" style="padding: 8px 4px; border-bottom: 2px solid ${t.activeTab==="templates"?"#3b82f6":"transparent"}; color: ${t.activeTab==="templates"?"#3b82f6":"#6b7280"}; background: none; border-top: none; border-left: none; border-right: none; font-weight: 500; font-size: 14px; cursor: pointer;">
                            <svg style="width: 16px; height: 16px; display: inline; margin-right: 8px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                            Quick Templates
                        </button>
                    </nav>
                </div>

                <!-- Tab Content -->
                ${t.activeTab==="manage"?T():_()}
            </div>
        `}function T(){return t.promoBars.length===0?`
                <div style="background-color: white; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); border-radius: 8px;">
                    <div style="padding: 24px; border-bottom: 1px solid #e5e7eb;">
                        <h3 style="font-size: 18px; font-weight: 500; color: #111827; margin: 0;">All Promo Bars</h3>
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
            `:`
            <div style="background-color: white; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); border-radius: 8px;">
                <div style="padding: 24px; border-bottom: 1px solid #e5e7eb;">
                    <h3 style="font-size: 18px; font-weight: 500; color: #111827; margin: 0;">All Promo Bars</h3>
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
                        ${t.promoBars.map(w=>`
            <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 16px 24px; white-space: nowrap;">
                    <div>
                        <div style="font-size: 14px; font-weight: 500; color: #111827;">${w.name}</div>
                        <div style="font-size: 14px; color: #6b7280;">${w.title}</div>
                    </div>
                </td>
                <td style="padding: 16px 24px; white-space: nowrap;">${h(w.status)}</td>
                <td style="padding: 16px 24px; white-space: nowrap; font-size: 14px; color: #111827;">${w.priority}</td>
                <td style="padding: 16px 24px; white-space: nowrap; font-size: 14px; color: #6b7280;">${k(w.created_at)}</td>
                <td style="padding: 16px 24px; white-space: nowrap; text-align: right;">
                    <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
                        <button onclick="window.simpleTopBarManager.toggleStatus(${JSON.stringify(w).replace(/"/g,"&quot;")})" style="color: #9ca3af; background: none; border: none; cursor: pointer; padding: 4px;" title="${w.status==="active"?"Pause":"Activate"}">
                            <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${w.status==="active"?"M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21":"M15 12a3 3 0 11-6 0 3 3 0 016 0z"}"></path>
                            </svg>
                        </button>
                        <button onclick="window.simpleTopBarManager.editPromoBar(${JSON.stringify(w).replace(/"/g,"&quot;")})" style="color: #3b82f6; background: none; border: none; cursor: pointer; padding: 4px;" title="Edit">
                            <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </button>
                        <button onclick="window.simpleTopBarManager.deletePromoBar(${w.id})" style="color: #dc2626; background: none; border: none; cursor: pointer; padding: 4px;" title="Delete">
                            <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join("")}
                    </tbody>
                </table>
            </div>
        `}function _(){return`
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
        `}window.simpleTopBarManager={init:d,loadPromoBars:c,deletePromoBar:p,toggleStatus:m,createNew:g,editPromoBar:x,switchTab:y}})(),document.addEventListener("DOMContentLoaded",()=>{try{let t=function(o){const a=new URLSearchParams(window.location.search).get("id");console.log("Simple Editor: URL params:",window.location.search),console.log("Simple Editor: Promo bar ID from URL:",a),o.innerHTML=`
                <div style="padding: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                        <h1 style="font-size: 24px; font-weight: 600; color: #111827;">
                            ${a?"Edit Promo Bar":"Create New Promo Bar"}
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
                                <h4 style="font-size: 14px; font-weight: 600; margin-bottom: 10px; color: #111827;">Current Assignments</h4>
                                <div id="assignments-list" style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px; min-height: 50px;">
                                    <div style="text-align: center; color: #6b7280; font-size: 14px;">No assignments yet</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `,r(),a&&(console.log("Simple Editor: Loading promo bar data for ID:",a),loadPromoBarData())},r=function(){const o=document.getElementById("promo-countdown-enabled"),i=document.getElementById("promo-countdown-date");o&&o.addEventListener("change",function(){i.style.display=this.checked?"block":"none",u()}),["promo-name","promo-title","promo-cta-text","promo-cta-url"].forEach(b=>{const j=document.getElementById(b);j&&j.addEventListener("input",u)}),["promo-bg-color","promo-text-color","promo-cta-color","promo-font-size","promo-position"].forEach(b=>{const j=document.getElementById(b);j&&j.addEventListener("change",u)});const l=document.getElementById("promo-assignment-type");l&&l.addEventListener("change",d),T(),u()},d=function(){const o=document.getElementById("promo-assignment-type").value,i=document.getElementById("assignment-options"),a=document.getElementById("specific-pages-option"),s=document.getElementById("category-option"),l=document.getElementById("custom-url-option");a.style.display="none",s.style.display="none",l.style.display="none",i.style.display="none",!(!o||o==="")&&(o==="global"?n("global",{value:"All Pages"}):o==="specific"?(i.style.display="block",a.style.display="block",g()):o==="post_type"?n("post_type",{value:"post"}):o==="category"?(i.style.display="block",s.style.display="block",h()):o==="custom"&&(i.style.display="block",l.style.display="block"))},n=function(o,i){const a={id:Date.now(),assignment_type:o,target_id:i.id||0,target_value:i.value||i.name||"",priority:N.length+1};N.push(a),p()},c=function(o){N=N.filter(i=>i.id!==o),p()},p=function(){const o=document.getElementById("assignments-list");if(o){if(N.length===0){o.innerHTML='<div style="text-align: center; color: #6b7280; font-size: 14px;">No assignments yet</div>';return}o.innerHTML=N.map(i=>`
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: white; border: 1px solid #e5e7eb; border-radius: 4px; margin-bottom: 8px;">
                        <span style="font-size: 14px; color: #374151;">${m(i)}</span>
                        <button onclick="removeAssignment(${i.id})" style="background: none; border: none; color: #dc2626; cursor: pointer; font-size: 16px;">×</button>
                    </div>
                `).join("")}},m=function(o){switch(o.assignment_type){case"global":return"🌐 All Pages";case"page":return`📄 Page: ${o.target_value}`;case"post_type":return`📝 All ${o.target_value}s`;case"category":return`🏷️ Category: ${o.target_value}`;case"tag":return`🏷️ Tag: ${o.target_value}`;case"custom":return`🔗 Custom: ${o.target_value}`;default:return"Unknown Assignment"}},g=function(){if(!window.promobarxAdmin||!window.promobarxAdmin.ajaxurl)return;const o=document.getElementById("pages-dropdown");if(!o)return;o.innerHTML='<option value="" disabled>Loading pages...</option>';const i=new FormData;i.append("action","promobarx_get_pages"),i.append("nonce",window.promobarxAdmin.nonce),fetch(window.promobarxAdmin.ajaxurl,{method:"POST",body:i}).then(a=>a.json()).then(a=>{a.success?x(a.data):o.innerHTML='<option value="" disabled>Error loading pages</option>'}).catch(a=>{console.error("Error loading pages:",a),o.innerHTML='<option value="" disabled>Error loading pages</option>'})},x=function(o){const i=document.getElementById("pages-dropdown");i&&(i.innerHTML=o.map(a=>`<option value="${a.id}" data-title="${a.title}">${a.title} (${a.type})</option>`).join(""),i.addEventListener("change",y))},y=function(){const o=document.getElementById("pages-dropdown"),i=Array.from(o.selectedOptions);N=N.filter(a=>a.assignment_type!=="page"),i.forEach(a=>{n("page",{id:parseInt(a.value),value:a.getAttribute("data-title")||a.text})})},h=function(){if(!window.promobarxAdmin||!window.promobarxAdmin.ajaxurl)return;const o=document.getElementById("categories-dropdown");if(!o)return;o.innerHTML='<option value="" disabled>Loading categories...</option>';const i=new FormData;i.append("action","promobarx_get_taxonomies"),i.append("taxonomy","category"),i.append("nonce",window.promobarxAdmin.nonce),fetch(window.promobarxAdmin.ajaxurl,{method:"POST",body:i}).then(a=>a.json()).then(a=>{a.success?k(a.data):o.innerHTML='<option value="" disabled>Error loading categories</option>'}).catch(a=>{console.error("Error loading categories:",a),o.innerHTML='<option value="" disabled>Error loading categories</option>'})},k=function(o){const i=document.getElementById("categories-dropdown");i&&(i.innerHTML=o.map(a=>`<option value="${a.id}" data-name="${a.name}">${a.name}</option>`).join(""),i.addEventListener("change",C))},C=function(){const o=document.getElementById("categories-dropdown"),i=Array.from(o.selectedOptions);N=N.filter(a=>a.assignment_type!=="category"),i.forEach(a=>{n("category",{id:parseInt(a.value),value:a.getAttribute("data-name")||a.text})})},T=function(){h()},_=function(o){k(o)},u=function(){var D,U,H,F,q,J,V,G,W;const o=document.getElementById("promo-preview");if(!o)return;const i=((D=document.getElementById("promo-title"))==null?void 0:D.value)||"Sample Title",a=((U=document.getElementById("promo-cta-text"))==null?void 0:U.value)||"Shop Now",s=((H=document.getElementById("promo-countdown-enabled"))==null?void 0:H.checked)||!1,l=((F=document.getElementById("promo-close-enabled"))==null?void 0:F.checked)||!1,b=((q=document.getElementById("promo-bg-color"))==null?void 0:q.value)||"#3b82f6",j=((J=document.getElementById("promo-text-color"))==null?void 0:J.value)||"#ffffff",A=((V=document.getElementById("promo-cta-color"))==null?void 0:V.value)||"#ffffff",L=((G=document.getElementById("promo-font-size"))==null?void 0:G.value)||"14px",ee=((W=document.getElementById("promo-position"))==null?void 0:W.value)||"top";o.innerHTML=`
                <div style="background: ${b}; color: ${j}; padding: 12px 20px; border-radius: 6px; display: flex; align-items: center; justify-content: space-between; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: ${L};">
                    <div style="display: flex; align-items: center; gap: 20px; flex: 1;">
                        <div>
                            <div style="font-weight: 600;">${i}</div>
                        </div>
                        ${s?'<div style="font-weight: 600; font-family: monospace; font-size: 0.85em;">23:59:59</div>':""}
                        <a href="#" style="background: ${A}; color: ${b}; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-weight: 500; font-size: 0.85em;">${a}</a>
                    </div>
                    ${l?'<button style="background: none; border: none; color: '+j+'; font-size: 18px; cursor: pointer; opacity: 0.7;">×</button>':""}
                </div>
                <div style="margin-top: 10px; font-size: 12px; color: #6b7280; text-align: center;">
                    Position: ${ee==="top"?"Top of Page":"Bottom of Page"}
                </div>
            `};document.getElementById("promo-bar-x-topbar-manager")&&window.simpleTopBarManager.init("promo-bar-x-topbar-manager");const P=document.getElementById("promo-bar-x-editor");P&&(window.React&&window.ReactDOM?Ce(()=>Promise.resolve().then(()=>pt),void 0).then(o=>{const i=o.default;window.ReactDOM.render(window.React.createElement(i),P)}).catch(o=>{console.error("Error loading editor:",o),t(P)}):t(P));let N=[];window.addAssignment=n,window.removeAssignment=c,window.addCustomUrlPattern=function(){const o=document.getElementById("custom-url-pattern").value.trim();o?(n("custom",{value:o}),document.getElementById("custom-url-pattern").value=""):alert("Please enter a URL pattern")},window.selectAllPages=function(){const o=document.getElementById("pages-dropdown");o&&(Array.from(o.options).forEach(i=>{i.selected=!0}),y())},window.clearPageSelection=function(){const o=document.getElementById("pages-dropdown");o&&(Array.from(o.options).forEach(i=>{i.selected=!1}),N=N.filter(i=>i.assignment_type!=="page"),p())},window.selectAllCategories=function(){const o=document.getElementById("categories-dropdown");o&&(Array.from(o.options).forEach(i=>{i.selected=!0}),C())},window.clearCategorySelection=function(){const o=document.getElementById("categories-dropdown");o&&(Array.from(o.options).forEach(i=>{i.selected=!1}),N=N.filter(i=>i.assignment_type!=="category"),p())},window.savePromoBar=function(){var b,j,A,L,ee,D,U,H,F,q,J,V,G,W;console.log("Save button clicked");const i=new URLSearchParams(window.location.search).get("id"),a=((b=document.getElementById("promo-title"))==null?void 0:b.value)||"",s=((j=document.getElementById("promo-name"))==null?void 0:j.value)||"";if(!a.trim()){alert("Please enter a title for the promo bar.");return}if(!s.trim()){alert("Please enter a name for the promo bar.");return}const l={name:s,title:a,cta_text:((A=document.getElementById("promo-cta-text"))==null?void 0:A.value)||"",cta_url:((L=document.getElementById("promo-cta-url"))==null?void 0:L.value)||"",countdown_enabled:((ee=document.getElementById("promo-countdown-enabled"))==null?void 0:ee.checked)||!1,countdown_date:((D=document.getElementById("promo-countdown-date"))==null?void 0:D.value)||"",close_button_enabled:((U=document.getElementById("promo-close-enabled"))==null?void 0:U.checked)||!1,status:((H=document.getElementById("promo-status"))==null?void 0:H.value)||"draft",styling:JSON.stringify({background:((F=document.getElementById("promo-bg-color"))==null?void 0:F.value)||"#3b82f6",color:((q=document.getElementById("promo-text-color"))==null?void 0:q.value)||"#ffffff",font_size:((J=document.getElementById("promo-font-size"))==null?void 0:J.value)||"14px",position:((V=document.getElementById("promo-position"))==null?void 0:V.value)||"top"}),cta_style:JSON.stringify({background:((G=document.getElementById("promo-cta-color"))==null?void 0:G.value)||"#ffffff",color:((W=document.getElementById("promo-bg-color"))==null?void 0:W.value)||"#3b82f6"}),assignments:JSON.stringify(N)};if(i&&(l.id=i),console.log("Data to save:",l),console.log("Admin data:",window.promobarxAdmin),window.promobarxAdmin&&window.promobarxAdmin.ajaxurl){const X=new URLSearchParams;X.append("action","promobarx_save"),X.append("nonce",window.promobarxAdmin.nonce),Object.keys(l).forEach($=>{X.append($,l[$])}),console.log("Form data:",X.toString()),fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:X.toString()}).then($=>(console.log("Response status:",$.status),$.json())).then($=>{console.log("Save result:",$),$.success?(alert("Promo bar saved successfully!"),window.location.href="admin.php?page=promo-bar-x-topbar-manager"):alert("Error saving promo bar: "+($.data||"Unknown error"))}).catch($=>{console.error("Error:",$),alert("Error saving promo bar. Please try again.")})}else console.error("Admin data not available"),alert("Admin data not available. Please refresh the page.")},window.testSave=function(){if(console.log("Test save clicked"),!window.promobarxAdmin||!window.promobarxAdmin.ajaxurl){alert("Admin data not available");return}const o={name:"Test Promo Bar",title:"Test Title",cta_text:"Test Button",cta_url:"https://example.com",status:"draft"},i=new URLSearchParams;i.append("action","promobarx_save"),i.append("nonce",window.promobarxAdmin.nonce),Object.keys(o).forEach(a=>{i.append(a,o[a])}),console.log("Test form data:",i.toString()),fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:i.toString()}).then(a=>(console.log("Test response status:",a.status),a.text())).then(a=>{console.log("Test response text:",a);try{const s=JSON.parse(a);console.log("Test parsed result:",s),s.success?alert("Test save successful! ID: "+s.data.id):alert("Test save failed: "+(s.data||"Unknown error"))}catch(s){console.error("Test JSON parse error:",s),alert("Test response not valid JSON: "+a)}}).catch(a=>{console.error("Test error:",a),alert("Test save error: "+a.message)})},window.loadPromoBarData=function(){const i=new URLSearchParams(window.location.search).get("id");if(!i){alert("No promo bar ID found in the URL.");return}if(console.log("Loading promo bar data for ID:",i),window.promobarxAdmin&&window.promobarxAdmin.ajaxurl){const a=new URLSearchParams;a.append("action","promobarx_get_promo_bar"),a.append("nonce",window.promobarxAdmin.nonce),a.append("id",i),console.log("Form data for loading:",a.toString()),fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:a.toString()}).then(s=>(console.log("Load response status:",s.status),s.json())).then(s=>{if(console.log("Load result:",s),s.success&&s.data){const l=s.data;let b={};if(l.styling)try{b=typeof l.styling=="string"?JSON.parse(l.styling):l.styling}catch(L){console.error("Error parsing styling:",L),b={}}let j={};if(l.cta_style)try{j=typeof l.cta_style=="string"?JSON.parse(l.cta_style):l.cta_style}catch(L){console.error("Error parsing CTA style:",L),j={}}document.getElementById("promo-name").value=l.name||"",document.getElementById("promo-title").value=l.title||"",document.getElementById("promo-cta-text").value=l.cta_text||"",document.getElementById("promo-cta-url").value=l.cta_url||"",document.getElementById("promo-countdown-enabled").checked=!!l.countdown_enabled,document.getElementById("promo-countdown-date").value=l.countdown_date||"",document.getElementById("promo-close-enabled").checked=!!l.close_button_enabled,document.getElementById("promo-status").value=l.status||"draft",document.getElementById("promo-bg-color").value=b.background||"#3b82f6",document.getElementById("promo-text-color").value=b.color||"#ffffff",document.getElementById("promo-font-size").value=b.font_size||"14px",document.getElementById("promo-position").value=b.position||"top",document.getElementById("promo-cta-color").value=j.background||"#ffffff";const A=document.getElementById("promo-countdown-date");if(A&&(A.style.display=l.countdown_enabled?"block":"none"),u(),l.assignments)try{N=typeof l.assignments=="string"?JSON.parse(l.assignments):l.assignments,p()}catch(L){console.error("Error parsing assignments:",L)}console.log("Successfully loaded promo bar data:",l)}else alert("Error loading promo bar data: "+(s.data||"Unknown error"))}).catch(s=>{console.error("Error loading promo bar data:",s),alert("Error loading promo bar data. Please try again.")})}else console.error("Admin data not available for loading"),alert("Admin data not available for loading. Please refresh the page.")},window.testLoadPromoBar=function(){var a,s;const i=new URLSearchParams(window.location.search).get("id");console.log("Test: Current URL params:",window.location.search),console.log("Test: Promo bar ID from URL:",i),console.log("Test: Admin data available:",{promobarxAdmin:window.promobarxAdmin,ajaxurl:(a=window.promobarxAdmin)==null?void 0:a.ajaxurl,nonce:(s=window.promobarxAdmin)==null?void 0:s.nonce}),i?(console.log("Test: Attempting to load promo bar with ID:",i),loadPromoBarData()):(console.log("Test: No promo bar ID found in URL"),alert("No promo bar ID found in URL. Current URL: "+window.location.href))};const z=document.getElementById("promo-bar-x-dashboard");z&&(z.innerHTML=`
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
            `);const B=document.getElementById("promo-bar-x-settings-app");B&&(B.innerHTML=`
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
            `);const M=document.getElementById("promo-bar-x-inquiries");M&&(M.innerHTML=`
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
            `)}catch(t){console.error("Error initializing PromoBarX components:",t),document.querySelectorAll('[id*="promo-bar-x"]').forEach(d=>{d.innerHTML===""&&(d.innerHTML=`
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
                `)})}});var ie={exports:{}},Z={},le={exports:{}},f={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var R=Symbol.for("react.element"),Ee=Symbol.for("react.portal"),Se=Symbol.for("react.fragment"),Pe=Symbol.for("react.strict_mode"),Ae=Symbol.for("react.profiler"),Te=Symbol.for("react.provider"),Be=Symbol.for("react.context"),Le=Symbol.for("react.forward_ref"),$e=Symbol.for("react.suspense"),ze=Symbol.for("react.memo"),Ie=Symbol.for("react.lazy"),de=Symbol.iterator;function Me(t){return t===null||typeof t!="object"?null:(t=de&&t[de]||t["@@iterator"],typeof t=="function"?t:null)}var ce={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},pe=Object.assign,ue={};function I(t,r,d){this.props=t,this.context=r,this.refs=ue,this.updater=d||ce}I.prototype.isReactComponent={},I.prototype.setState=function(t,r){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,r,"setState")},I.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function me(){}me.prototype=I.prototype;function te(t,r,d){this.props=t,this.context=r,this.refs=ue,this.updater=d||ce}var oe=te.prototype=new me;oe.constructor=te,pe(oe,I.prototype),oe.isPureReactComponent=!0;var ge=Array.isArray,xe=Object.prototype.hasOwnProperty,ne={current:null},fe={key:!0,ref:!0,__self:!0,__source:!0};function be(t,r,d){var n,c={},p=null,m=null;if(r!=null)for(n in r.ref!==void 0&&(m=r.ref),r.key!==void 0&&(p=""+r.key),r)xe.call(r,n)&&!fe.hasOwnProperty(n)&&(c[n]=r[n]);var g=arguments.length-2;if(g===1)c.children=d;else if(1<g){for(var x=Array(g),y=0;y<g;y++)x[y]=arguments[y+2];c.children=x}if(t&&t.defaultProps)for(n in g=t.defaultProps,g)c[n]===void 0&&(c[n]=g[n]);return{$$typeof:R,type:t,key:p,ref:m,props:c,_owner:ne.current}}function Re(t,r){return{$$typeof:R,type:t.type,key:r,ref:t.ref,props:t.props,_owner:t._owner}}function re(t){return typeof t=="object"&&t!==null&&t.$$typeof===R}function Oe(t){var r={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(d){return r[d]})}var ye=/\/+/g;function ae(t,r){return typeof t=="object"&&t!==null&&t.key!=null?Oe(""+t.key):r.toString(36)}function Q(t,r,d,n,c){var p=typeof t;(p==="undefined"||p==="boolean")&&(t=null);var m=!1;if(t===null)m=!0;else switch(p){case"string":case"number":m=!0;break;case"object":switch(t.$$typeof){case R:case Ee:m=!0}}if(m)return m=t,c=c(m),t=n===""?"."+ae(m,0):n,ge(c)?(d="",t!=null&&(d=t.replace(ye,"$&/")+"/"),Q(c,r,d,"",function(y){return y})):c!=null&&(re(c)&&(c=Re(c,d+(!c.key||m&&m.key===c.key?"":(""+c.key).replace(ye,"$&/")+"/")+t)),r.push(c)),1;if(m=0,n=n===""?".":n+":",ge(t))for(var g=0;g<t.length;g++){p=t[g];var x=n+ae(p,g);m+=Q(p,r,d,x,c)}else if(x=Me(t),typeof x=="function")for(t=x.call(t),g=0;!(p=t.next()).done;)p=p.value,x=n+ae(p,g++),m+=Q(p,r,d,x,c);else if(p==="object")throw r=String(t),Error("Objects are not valid as a React child (found: "+(r==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":r)+"). If you meant to render a collection of children, use an array instead.");return m}function Y(t,r,d){if(t==null)return t;var n=[],c=0;return Q(t,n,"","",function(p){return r.call(d,p,c++)}),n}function De(t){if(t._status===-1){var r=t._result;r=r(),r.then(function(d){(t._status===0||t._status===-1)&&(t._status=1,t._result=d)},function(d){(t._status===0||t._status===-1)&&(t._status=2,t._result=d)}),t._status===-1&&(t._status=0,t._result=r)}if(t._status===1)return t._result.default;throw t._result}var S={current:null},K={transition:null},Ue={ReactCurrentDispatcher:S,ReactCurrentBatchConfig:K,ReactCurrentOwner:ne};function he(){throw Error("act(...) is not supported in production builds of React.")}f.Children={map:Y,forEach:function(t,r,d){Y(t,function(){r.apply(this,arguments)},d)},count:function(t){var r=0;return Y(t,function(){r++}),r},toArray:function(t){return Y(t,function(r){return r})||[]},only:function(t){if(!re(t))throw Error("React.Children.only expected to receive a single React element child.");return t}},f.Component=I,f.Fragment=Se,f.Profiler=Ae,f.PureComponent=te,f.StrictMode=Pe,f.Suspense=$e,f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Ue,f.act=he,f.cloneElement=function(t,r,d){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var n=pe({},t.props),c=t.key,p=t.ref,m=t._owner;if(r!=null){if(r.ref!==void 0&&(p=r.ref,m=ne.current),r.key!==void 0&&(c=""+r.key),t.type&&t.type.defaultProps)var g=t.type.defaultProps;for(x in r)xe.call(r,x)&&!fe.hasOwnProperty(x)&&(n[x]=r[x]===void 0&&g!==void 0?g[x]:r[x])}var x=arguments.length-2;if(x===1)n.children=d;else if(1<x){g=Array(x);for(var y=0;y<x;y++)g[y]=arguments[y+2];n.children=g}return{$$typeof:R,type:t.type,key:c,ref:p,props:n,_owner:m}},f.createContext=function(t){return t={$$typeof:Be,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:Te,_context:t},t.Consumer=t},f.createElement=be,f.createFactory=function(t){var r=be.bind(null,t);return r.type=t,r},f.createRef=function(){return{current:null}},f.forwardRef=function(t){return{$$typeof:Le,render:t}},f.isValidElement=re,f.lazy=function(t){return{$$typeof:Ie,_payload:{_status:-1,_result:t},_init:De}},f.memo=function(t,r){return{$$typeof:ze,type:t,compare:r===void 0?null:r}},f.startTransition=function(t){var r=K.transition;K.transition={};try{t()}finally{K.transition=r}},f.unstable_act=he,f.useCallback=function(t,r){return S.current.useCallback(t,r)},f.useContext=function(t){return S.current.useContext(t)},f.useDebugValue=function(){},f.useDeferredValue=function(t){return S.current.useDeferredValue(t)},f.useEffect=function(t,r){return S.current.useEffect(t,r)},f.useId=function(){return S.current.useId()},f.useImperativeHandle=function(t,r,d){return S.current.useImperativeHandle(t,r,d)},f.useInsertionEffect=function(t,r){return S.current.useInsertionEffect(t,r)},f.useLayoutEffect=function(t,r){return S.current.useLayoutEffect(t,r)},f.useMemo=function(t,r){return S.current.useMemo(t,r)},f.useReducer=function(t,r,d){return S.current.useReducer(t,r,d)},f.useRef=function(t){return S.current.useRef(t)},f.useState=function(t){return S.current.useState(t)},f.useSyncExternalStore=function(t,r,d){return S.current.useSyncExternalStore(t,r,d)},f.useTransition=function(){return S.current.useTransition()},f.version="18.3.1",le.exports=f;var v=le.exports;/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var He=v,Fe=Symbol.for("react.element"),qe=Symbol.for("react.fragment"),Je=Object.prototype.hasOwnProperty,Ve=He.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Ge={key:!0,ref:!0,__self:!0,__source:!0};function we(t,r,d){var n,c={},p=null,m=null;d!==void 0&&(p=""+d),r.key!==void 0&&(p=""+r.key),r.ref!==void 0&&(m=r.ref);for(n in r)Je.call(r,n)&&!Ge.hasOwnProperty(n)&&(c[n]=r[n]);if(t&&t.defaultProps)for(n in r=t.defaultProps,r)c[n]===void 0&&(c[n]=r[n]);return{$$typeof:Fe,type:t,key:p,ref:m,props:c,_owner:Ve.current}}Z.Fragment=qe,Z.jsx=we,Z.jsxs=we,ie.exports=Z;var e=ie.exports;/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const We=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),ve=(...t)=>t.filter((r,d,n)=>!!r&&r.trim()!==""&&n.indexOf(r)===d).join(" ").trim();/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var Xe={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ze=v.forwardRef(({color:t="currentColor",size:r=24,strokeWidth:d=2,absoluteStrokeWidth:n,className:c="",children:p,iconNode:m,...g},x)=>v.createElement("svg",{ref:x,...Xe,width:r,height:r,stroke:t,strokeWidth:n?Number(d)*24/Number(r):d,className:ve("lucide",c),...g},[...m.map(([y,h])=>v.createElement(y,h)),...Array.isArray(p)?p:[p]]));/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=(t,r)=>{const d=v.forwardRef(({className:n,...c},p)=>v.createElement(Ze,{ref:p,iconNode:r,className:ve(`lucide-${We(t)}`,n),...c}));return d.displayName=`${t}`,d};/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qe=E("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ye=E("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const je=E("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ke=E("Globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const et=E("Hash",[["line",{x1:"4",x2:"20",y1:"9",y2:"9",key:"4lhtct"}],["line",{x1:"4",x2:"20",y1:"15",y2:"15",key:"vyu0kd"}],["line",{x1:"10",x2:"8",y1:"3",y2:"21",key:"1ggp8o"}],["line",{x1:"16",x2:"14",y1:"3",y2:"21",key:"weycgp"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tt=E("Link",[["path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",key:"1cjeqo"}],["path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",key:"19qd67"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ke=E("MapPin",[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ot=E("MousePointer",[["path",{d:"M12.586 12.586 19 19",key:"ea5xo7"}],["path",{d:"M3.688 3.037a.497.497 0 0 0-.651.651l6.5 15.999a.501.501 0 0 0 .947-.062l1.569-6.083a2 2 0 0 1 1.448-1.479l6.124-1.579a.5.5 0 0 0 .063-.947z",key:"277e5u"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nt=E("Palette",[["circle",{cx:"13.5",cy:"6.5",r:".5",fill:"currentColor",key:"1okk4w"}],["circle",{cx:"17.5",cy:"10.5",r:".5",fill:"currentColor",key:"f64h9f"}],["circle",{cx:"8.5",cy:"7.5",r:".5",fill:"currentColor",key:"fotxhn"}],["circle",{cx:"6.5",cy:"12.5",r:".5",fill:"currentColor",key:"qy21gx"}],["path",{d:"M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z",key:"12rzf8"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rt=E("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _e=E("Save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const se=E("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const at=E("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const st=E("Tag",[["path",{d:"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",key:"vktsd0"}],["circle",{cx:"7.5",cy:"7.5",r:".5",fill:"currentColor",key:"kqv944"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const it=E("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lt=E("Type",[["polyline",{points:"4 7 4 4 20 4 20 7",key:"1nosan"}],["line",{x1:"9",x2:"15",y1:"20",y2:"20",key:"swin9y"}],["line",{x1:"12",x2:"12",y1:"4",y2:"20",key:"1tx1rr"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ne=E("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]),O=({color:t,onChange:r})=>{const[d,n]=v.useState(!1),[c,p]=v.useState(t),m=v.useRef(null),g=["#000000","#ffffff","#dc2626","#ea580c","#d97706","#65a30d","#16a34a","#0d9488","#0891b2","#2563eb","#4F46E5","#7c3aed","#9333ea","#c026d3","#e11d48","#f59e0b","#10b981","#06b6d4","#3b82f6","#8b5cf6","#ec4899","#f97316","#84cc16","#14b8a6"];v.useEffect(()=>{p(t)},[t]),v.useEffect(()=>{const h=k=>{m.current&&!m.current.contains(k.target)&&n(!1)};return document.addEventListener("mousedown",h),()=>{document.removeEventListener("mousedown",h)}},[]);const x=h=>{p(h),r(h),n(!1)},y=h=>{const k=h.target.value;p(k),r(k)};return e.jsxs("div",{className:"relative",ref:m,children:[e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("button",{type:"button",onClick:()=>n(!d),className:"w-10 h-10 rounded border border-gray-300 shadow-sm",style:{backgroundColor:c},title:"Choose color"}),e.jsx("input",{type:"text",value:c,onChange:y,className:"flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"#000000"})]}),d&&e.jsxs("div",{className:"absolute z-10 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg",children:[e.jsx("div",{className:"grid grid-cols-6 gap-2 mb-3",children:g.map(h=>e.jsx("button",{type:"button",onClick:()=>x(h),className:"w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform",style:{backgroundColor:h},title:h},h))}),e.jsx("div",{className:"text-xs text-gray-500 text-center",children:"Click a color to select"})]})]})},dt=({promoBar:t,onClose:r,onSave:d})=>{const[n,c]=v.useState([]),[p,m]=v.useState(!0),[g,x]=v.useState(!1),[y,h]=v.useState(""),[k,C]=v.useState([]),[T,_]=v.useState(!1),[u,w]=v.useState("global");v.useEffect(()=>{t&&t.id?P():m(!1)},[t]);const P=async()=>{console.log("Loading assignments for promo bar:",t.id);try{const s=`action=promobarx_get_assignments&promo_bar_id=${t.id}&nonce=${window.promobarxAdmin.nonce}`;console.log("Request body:",s);const b=await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:s})).json();console.log("Assignments response:",b),b.success?c(b.data||[]):console.error("Failed to load assignments:",b)}catch(s){console.error("Error loading assignments:",s)}finally{m(!1)}},N=async(s,l="page")=>{if(console.log("Searching pages with term:",s,"type:",l),!s.trim()){C([]);return}_(!0);try{const b=`action=promobarx_get_pages&search=${encodeURIComponent(s)}&post_type=${l}&nonce=${window.promobarxAdmin.nonce}`;console.log("Request body:",b);const A=await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:b})).json();console.log("Search response:",A),A.success?C(A.data||[]):console.error("Search failed:",A)}catch(b){console.error("Error searching pages:",b)}finally{_(!1)}},z=async(s,l="category")=>{if(!s.trim()){C([]);return}_(!0);try{const j=await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`action=promobarx_get_taxonomies&search=${encodeURIComponent(s)}&taxonomy=${l}&nonce=${window.promobarxAdmin.nonce}`})).json();j.success&&C(j.data||[])}catch(b){console.error("Error searching taxonomies:",b)}finally{_(!1)}},B=(s,l={})=>{const b={id:Date.now(),assignment_type:s,target_id:l.id||0,target_value:l.value||l.name||"",priority:n.length+1,...l};c([...n,b])},M=s=>{const l=n.filter((b,j)=>j!==s);c(l)},o=async()=>{if(!t||!t.id){alert("No promo bar selected");return}x(!0);try{const l=await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({action:"promobarx_save_assignments",promo_bar_id:t.id,assignments:JSON.stringify(n),nonce:window.promobarxAdmin.nonce})})).json();l.success?(d(n),r()):alert("Error saving assignments: "+l.data)}catch(s){console.error("Error saving assignments:",s),alert("Error saving assignments")}finally{x(!1)}},i=s=>{h(s),u==="pages"?N(s):u==="categories"?z(s,"category"):u==="tags"&&z(s,"post_tag")},a=s=>{switch(s.assignment_type){case"global":return"All Pages";case"page":return`Page: ${s.target_value||"Unknown Page"}`;case"post_type":return`All ${s.target_value||"Posts"}`;case"category":return`Category: ${s.target_value||"Unknown Category"}`;case"tag":return`Tag: ${s.target_value||"Unknown Tag"}`;case"custom":return`Custom: ${s.target_value||"Unknown Pattern"}`;default:return"Unknown Assignment"}};return p?e.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",children:e.jsxs("div",{className:"bg-white rounded-lg p-8 text-center",children:[e.jsx("div",{className:"animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"}),e.jsx("p",{className:"text-gray-600",children:"Loading assignments..."})]})}):e.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",children:e.jsxs("div",{className:"bg-white rounded-lg shadow-xl w-full max-w-4xl h-5/6 flex flex-col",children:[e.jsxs("div",{className:"flex items-center justify-between p-6 border-b border-gray-200",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-xl font-semibold text-gray-900",children:"Page Assignment"}),e.jsx("p",{className:"text-sm text-gray-600",children:"Choose where this promo bar should appear"})]}),e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsxs("button",{onClick:o,disabled:g,className:"px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center",children:[e.jsx(_e,{className:"w-4 h-4 mr-2"}),g?"Saving...":"Save"]}),e.jsx("button",{onClick:r,className:"p-2 text-gray-400 hover:text-gray-600",children:e.jsx(Ne,{className:"w-5 h-5"})})]})]}),e.jsxs("div",{className:"flex flex-1 overflow-hidden",children:[e.jsxs("div",{className:"w-1/3 border-r border-gray-200 flex flex-col",children:[e.jsxs("div",{className:"p-4 border-b border-gray-200",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-4",children:"Assignment Types"}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("button",{onClick:()=>w("global"),className:`w-full flex items-center p-3 rounded-lg text-left transition-colors ${u==="global"?"bg-blue-50 text-blue-700 border border-blue-200":"hover:bg-gray-50"}`,children:[e.jsx(Ke,{className:"w-5 h-5 mr-3"}),e.jsxs("div",{children:[e.jsx("div",{className:"font-medium",children:"Global"}),e.jsx("div",{className:"text-sm text-gray-500",children:"Show on all pages"})]})]}),e.jsxs("button",{onClick:()=>w("pages"),className:`w-full flex items-center p-3 rounded-lg text-left transition-colors ${u==="pages"?"bg-blue-50 text-blue-700 border border-blue-200":"hover:bg-gray-50"}`,children:[e.jsx(je,{className:"w-5 h-5 mr-3"}),e.jsxs("div",{children:[e.jsx("div",{className:"font-medium",children:"Specific Pages"}),e.jsx("div",{className:"text-sm text-gray-500",children:"Select individual pages"})]})]}),e.jsxs("button",{onClick:()=>w("post_types"),className:`w-full flex items-center p-3 rounded-lg text-left transition-colors ${u==="post_types"?"bg-blue-50 text-blue-700 border border-blue-200":"hover:bg-gray-50"}`,children:[e.jsx(je,{className:"w-5 h-5 mr-3"}),e.jsxs("div",{children:[e.jsx("div",{className:"font-medium",children:"Post Types"}),e.jsx("div",{className:"text-sm text-gray-500",children:"All pages of a type"})]})]}),e.jsxs("button",{onClick:()=>w("categories"),className:`w-full flex items-center p-3 rounded-lg text-left transition-colors ${u==="categories"?"bg-blue-50 text-blue-700 border border-blue-200":"hover:bg-gray-50"}`,children:[e.jsx(st,{className:"w-5 h-5 mr-3"}),e.jsxs("div",{children:[e.jsx("div",{className:"font-medium",children:"Categories"}),e.jsx("div",{className:"text-sm text-gray-500",children:"Pages in categories"})]})]}),e.jsxs("button",{onClick:()=>w("tags"),className:`w-full flex items-center p-3 rounded-lg text-left transition-colors ${u==="tags"?"bg-blue-50 text-blue-700 border border-blue-200":"hover:bg-gray-50"}`,children:[e.jsx(et,{className:"w-5 h-5 mr-3"}),e.jsxs("div",{children:[e.jsx("div",{className:"font-medium",children:"Tags"}),e.jsx("div",{className:"text-sm text-gray-500",children:"Pages with tags"})]})]}),e.jsxs("button",{onClick:()=>w("custom"),className:`w-full flex items-center p-3 rounded-lg text-left transition-colors ${u==="custom"?"bg-blue-50 text-blue-700 border border-blue-200":"hover:bg-gray-50"}`,children:[e.jsx(tt,{className:"w-5 h-5 mr-3"}),e.jsxs("div",{children:[e.jsx("div",{className:"font-medium",children:"Custom URLs"}),e.jsx("div",{className:"text-sm text-gray-500",children:"URL patterns"})]})]})]})]}),e.jsxs("div",{className:"flex-1 p-4 overflow-y-auto",children:[e.jsx("h4",{className:"font-medium text-gray-900 mb-3",children:"Current Assignments"}),n.length===0?e.jsx("p",{className:"text-gray-500 text-sm",children:"No assignments yet"}):e.jsx("div",{className:"space-y-2",children:n.map((s,l)=>e.jsxs("div",{className:"flex items-center justify-between p-2 bg-gray-50 rounded",children:[e.jsx("span",{className:"text-sm text-gray-700",children:a(s)}),e.jsx("button",{onClick:()=>M(l),className:"text-red-500 hover:text-red-700",children:e.jsx(it,{className:"w-4 h-4"})})]},s.id||l))})]})]}),e.jsxs("div",{className:"flex-1 p-6 overflow-y-auto",children:[u==="global"&&e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900",children:"Global Assignment"}),e.jsx("p",{className:"text-gray-600",children:"This promo bar will appear on all pages of your website."}),e.jsxs("button",{onClick:()=>B("global"),className:"px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center",children:[e.jsx(rt,{className:"w-4 h-4 mr-2"}),"Add Global Assignment"]})]}),u==="pages"&&e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900",children:"Specific Pages"}),e.jsxs("div",{className:"relative",children:[e.jsx("input",{type:"text",placeholder:"Search pages...",value:y,onChange:s=>i(s.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"}),e.jsx(se,{className:"absolute right-3 top-2.5 w-5 h-5 text-gray-400"})]}),T&&e.jsx("div",{className:"text-center py-4",children:e.jsx("div",{className:"animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"})}),k.length>0&&e.jsx("div",{className:"space-y-2 max-h-64 overflow-y-auto",children:k.map(s=>e.jsxs("button",{onClick:()=>B("page",{id:s.id,value:s.title}),className:"w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50",children:[e.jsx("div",{className:"font-medium",children:s.title}),e.jsxs("div",{className:"text-sm text-gray-500",children:[s.type," • ",s.url]})]},s.id))})]}),u==="post_types"&&e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900",children:"Post Types"}),e.jsx("p",{className:"text-gray-600",children:"Select a post type to show this promo bar on all pages of that type."}),e.jsx("div",{className:"grid grid-cols-2 gap-3",children:["page","post","product"].map(s=>e.jsxs("button",{onClick:()=>B("post_type",{value:s}),className:"p-3 border border-gray-200 rounded-md hover:bg-gray-50 text-left",children:[e.jsxs("div",{className:"font-medium capitalize",children:[s,"s"]}),e.jsxs("div",{className:"text-sm text-gray-500",children:["All ",s," pages"]})]},s))})]}),u==="categories"&&e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900",children:"Categories"}),e.jsxs("div",{className:"relative",children:[e.jsx("input",{type:"text",placeholder:"Search categories...",value:y,onChange:s=>i(s.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"}),e.jsx(se,{className:"absolute right-3 top-2.5 w-5 h-5 text-gray-400"})]}),k.length>0&&e.jsx("div",{className:"space-y-2 max-h-64 overflow-y-auto",children:k.map(s=>e.jsxs("button",{onClick:()=>B("category",{id:s.id,value:s.name}),className:"w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50",children:[e.jsx("div",{className:"font-medium",children:s.name}),e.jsx("div",{className:"text-sm text-gray-500",children:"Category"})]},s.id))})]}),u==="tags"&&e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900",children:"Tags"}),e.jsxs("div",{className:"relative",children:[e.jsx("input",{type:"text",placeholder:"Search tags...",value:y,onChange:s=>i(s.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"}),e.jsx(se,{className:"absolute right-3 top-2.5 w-5 h-5 text-gray-400"})]}),k.length>0&&e.jsx("div",{className:"space-y-2 max-h-64 overflow-y-auto",children:k.map(s=>e.jsxs("button",{onClick:()=>B("tag",{id:s.id,value:s.name}),className:"w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50",children:[e.jsx("div",{className:"font-medium",children:s.name}),e.jsx("div",{className:"text-sm text-gray-500",children:"Tag"})]},s.id))})]}),u==="custom"&&e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900",children:"Custom URL Patterns"}),e.jsx("p",{className:"text-gray-600",children:"Enter URL patterns to match specific pages."}),e.jsxs("div",{className:"space-y-3",children:[e.jsx("input",{type:"text",placeholder:"e.g., /shop/*, /blog/2024/*",value:y,onChange:s=>h(s.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"}),e.jsx("button",{onClick:()=>{y.trim()&&(B("custom",{value:y.trim()}),h(""))},className:"px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",children:"Add Custom Pattern"})]})]})]})]})]})})},ct=({promoBar:t,onClose:r,onSave:d})=>{const[n,c]=v.useState({name:"",title:"",cta_text:"",cta_url:"",countdown_enabled:!1,countdown_date:"",close_button_enabled:!0,status:"draft",priority:0,template_id:0,styling:{background:"#ffffff",color:"#333333",font_family:"Inter, sans-serif",font_size:"14px",padding:"12px 20px",border_bottom:"1px solid #e5e7eb"},cta_style:{background:"#4F46E5",color:"#ffffff",padding:"8px 16px",border_radius:"4px",font_weight:"500"},countdown_style:{color:"#dc2626",font_weight:"600",font_family:"monospace"},close_button_style:{color:"#6b7280",font_size:"20px",padding:"4px 8px"}}),[p,m]=v.useState("content"),[g,x]=v.useState(!0),[y,h]=v.useState(!1),[k,C]=v.useState([]);v.useEffect(()=>{if(t&&typeof t=="object"){console.log("PromoBar data received in editor:",t);let o={};if(t.styling)if(typeof t.styling=="string")try{o=JSON.parse(t.styling)}catch(j){console.error("Error parsing styling JSON:",j),o={}}else o=t.styling;const i={background:o.background||o.backgroundColor||"#ffffff",color:o.color||o.text_color||"#333333",font_family:o.font_family||o.fontFamily||"Inter, sans-serif",font_size:o.font_size||o.fontSize||"14px",padding:o.padding||"12px 20px",border_bottom:o.border_bottom||o.borderBottom||"1px solid #e5e7eb"};let a={};if(t.cta_style)if(typeof t.cta_style=="string")try{a=JSON.parse(t.cta_style)}catch(j){console.error("Error parsing CTA style JSON:",j),a={}}else a=t.cta_style;let s={};if(t.countdown_style)if(typeof t.countdown_style=="string")try{s=JSON.parse(t.countdown_style)}catch(j){console.error("Error parsing countdown style JSON:",j),s={}}else s=t.countdown_style;let l={};if(t.close_button_style)if(typeof t.close_button_style=="string")try{l=JSON.parse(t.close_button_style)}catch(j){console.error("Error parsing close button style JSON:",j),l={}}else l=t.close_button_style;const b={...n,name:t.name||"",title:t.title||"",cta_text:t.cta_text||"",cta_url:t.cta_url||"",countdown_enabled:!!t.countdown_enabled,countdown_date:t.countdown_date||"",close_button_enabled:!!t.close_button_enabled,status:t.status||"draft",priority:parseInt(t.priority)||0,template_id:parseInt(t.template_id)||0,styling:{...n.styling,...i},cta_style:{...n.cta_style,...a},countdown_style:{...n.countdown_style,...s},close_button_style:{...n.close_button_style,...l}};console.log("Updated form data:",b),c(b),t.id&&T(t.id)}else console.log("No promo bar data provided or invalid data:",t)},[t]);const T=async o=>{try{const a=await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({action:"promobarx_get_assignments",promo_bar_id:o,nonce:window.promobarxAdmin.nonce})})).json();a.success?(C(a.data||[]),console.log("Loaded assignments:",a.data)):console.error("Failed to load assignments:",a)}catch(i){console.error("Error loading assignments:",i)}},_=(o,i)=>{c(a=>({...a,[o]:i}))},u=(o,i,a)=>{c(s=>({...s,[o]:{...s[o],[i]:a}}))},w=async()=>{try{if(!window.promobarxAdmin||!window.promobarxAdmin.ajaxurl||!window.promobarxAdmin.nonce){console.error("PromoBarX admin data not available");return}const o={...n,styling:JSON.stringify(n.styling),cta_style:JSON.stringify(n.cta_style),countdown_style:JSON.stringify(n.countdown_style),close_button_style:JSON.stringify(n.close_button_style),assignments:k};t&&t.id&&(o.id=t.id),console.log("Saving promo bar with assignments:",k),console.log("Save data:",o);const a=await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({action:"promobarx_save",nonce:window.promobarxAdmin.nonce,...o})})).json();a.success?d():alert("Error saving promo bar: "+a.data)}catch(o){console.error("Error saving promo bar:",o),alert("Error saving promo bar")}},P=()=>{const o={background:n.styling.background,color:n.styling.color,fontFamily:n.styling.font_family,fontSize:n.styling.font_size,padding:n.styling.padding,borderBottom:n.styling.border_bottom};return Object.entries(o).filter(([i,a])=>a).map(([i,a])=>`${i.replace(/([A-Z])/g,"-$1").toLowerCase()}: ${a}`).join("; ")},N=()=>{const o={background:n.cta_style.background,color:n.cta_style.color,padding:n.cta_style.padding,borderRadius:n.cta_style.border_radius,fontWeight:n.cta_style.font_weight};return Object.entries(o).filter(([i,a])=>a).map(([i,a])=>`${i.replace(/([A-Z])/g,"-$1").toLowerCase()}: ${a}`).join("; ")},z=()=>{const o={color:n.countdown_style.color,fontWeight:n.countdown_style.font_weight,fontFamily:n.countdown_style.font_family};return Object.entries(o).filter(([i,a])=>a).map(([i,a])=>`${i.replace(/([A-Z])/g,"-$1").toLowerCase()}: ${a}`).join("; ")},B=()=>{const o={color:n.close_button_style.color,fontSize:n.close_button_style.font_size,padding:n.close_button_style.padding};return Object.entries(o).filter(([i,a])=>a).map(([i,a])=>`${i.replace(/([A-Z])/g,"-$1").toLowerCase()}: ${a}`).join("; ")},M=[{id:"content",label:"Content",icon:lt},{id:"styling",label:"Styling",icon:nt},{id:"cta",label:"CTA Button",icon:ot},{id:"countdown",label:"Countdown",icon:Qe},{id:"pages",label:"Page Assignment",icon:ke},{id:"settings",label:"Settings",icon:at}];return!window.promobarxAdmin||!window.promobarxAdmin.ajaxurl||!window.promobarxAdmin.nonce?e.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",children:e.jsxs("div",{className:"bg-white rounded-lg p-8 text-center",children:[e.jsx("div",{className:"animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"}),e.jsx("p",{className:"text-gray-600",children:"Loading PromoBarX admin..."})]})}):e.jsxs("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",children:[e.jsxs("div",{className:"bg-white rounded-lg shadow-xl w-full max-w-7xl h-5/6 flex flex-col",children:[e.jsxs("div",{className:"flex items-center justify-between p-6 border-b border-gray-200",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-xl font-semibold text-gray-900",children:t?"Edit Promo Bar":"Create New Promo Bar"}),e.jsx("p",{className:"text-sm text-gray-600",children:"Design your promotional top bar"})]}),e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsxs("button",{onClick:()=>x(!g),className:`px-3 py-2 rounded-md text-sm font-medium ${g?"bg-blue-100 text-blue-700":"bg-gray-100 text-gray-700"}`,children:[e.jsx(Ye,{className:"w-4 h-4 inline mr-1"}),"Preview"]}),e.jsxs("button",{onClick:w,className:"px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors",children:[e.jsx(_e,{className:"w-4 h-4 inline mr-2"}),"Save"]}),e.jsx("button",{onClick:r,className:"p-2 text-gray-400 hover:text-gray-600",children:e.jsx(Ne,{className:"w-5 h-5"})})]})]}),e.jsxs("div",{className:"flex flex-1 overflow-hidden",children:[e.jsxs("div",{className:"w-1/2 border-r border-gray-200 flex flex-col",children:[e.jsx("div",{className:"border-b border-gray-200",children:e.jsx("nav",{className:"flex space-x-8 px-6",children:M.map(o=>e.jsxs("button",{onClick:()=>m(o.id),className:`py-3 px-1 border-b-2 font-medium text-sm ${p===o.id?"border-blue-500 text-blue-600":"border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`,children:[e.jsx(o.icon,{className:"w-4 h-4 inline mr-2"}),o.label]},o.id))})}),e.jsxs("div",{className:"flex-1 overflow-y-auto p-6",children:[p==="content"&&e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Promo Bar Name"}),e.jsx("input",{type:"text",value:n.name,onChange:o=>_("name",o.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"Enter promo bar name"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Title"}),e.jsx("input",{type:"text",value:n.title,onChange:o=>_("title",o.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"Enter main title"})]}),e.jsxs("div",{className:"flex space-x-4",children:[e.jsxs("div",{className:"flex-1",children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"CTA Text"}),e.jsx("input",{type:"text",value:n.cta_text,onChange:o=>_("cta_text",o.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"Shop Now"})]}),e.jsxs("div",{className:"flex-1",children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"CTA URL"}),e.jsx("input",{type:"url",value:n.cta_url,onChange:o=>_("cta_url",o.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"https://example.com"})]})]}),e.jsx("div",{className:"flex items-center space-x-4",children:e.jsxs("label",{className:"flex items-center",children:[e.jsx("input",{type:"checkbox",checked:n.countdown_enabled,onChange:o=>_("countdown_enabled",o.target.checked),className:"rounded border-gray-300 text-blue-600 focus:ring-blue-500"}),e.jsx("span",{className:"ml-2 text-sm text-gray-700",children:"Enable Countdown Timer"})]})}),n.countdown_enabled&&e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Countdown End Date"}),e.jsx("input",{type:"datetime-local",value:n.countdown_date,onChange:o=>_("countdown_date",o.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"})]}),e.jsx("div",{className:"flex items-center space-x-4",children:e.jsxs("label",{className:"flex items-center",children:[e.jsx("input",{type:"checkbox",checked:n.close_button_enabled,onChange:o=>_("close_button_enabled",o.target.checked),className:"rounded border-gray-300 text-blue-600 focus:ring-blue-500"}),e.jsx("span",{className:"ml-2 text-sm text-gray-700",children:"Show Close Button"})]})})]}),p==="styling"&&e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Background Color"}),e.jsx(O,{color:n.styling.background,onChange:o=>u("styling","background",o)})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Text Color"}),e.jsx(O,{color:n.styling.color,onChange:o=>u("styling","color",o)})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Font Family"}),e.jsxs("select",{value:n.styling.font_family,onChange:o=>u("styling","font_family",o.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",children:[e.jsx("option",{value:"Inter, sans-serif",children:"Inter"}),e.jsx("option",{value:"Arial, sans-serif",children:"Arial"}),e.jsx("option",{value:"Helvetica, sans-serif",children:"Helvetica"}),e.jsx("option",{value:"Georgia, serif",children:"Georgia"}),e.jsx("option",{value:"Times New Roman, serif",children:"Times New Roman"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Font Size"}),e.jsx("input",{type:"text",value:n.styling.font_size,onChange:o=>u("styling","font_size",o.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"14px"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Padding"}),e.jsx("input",{type:"text",value:n.styling.padding,onChange:o=>u("styling","padding",o.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"12px 20px"})]})]}),p==="cta"&&e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Button Background Color"}),e.jsx(O,{color:n.cta_style.background,onChange:o=>u("cta_style","background",o)})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Button Text Color"}),e.jsx(O,{color:n.cta_style.color,onChange:o=>u("cta_style","color",o)})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Button Padding"}),e.jsx("input",{type:"text",value:n.cta_style.padding,onChange:o=>u("cta_style","padding",o.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"8px 16px"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Border Radius"}),e.jsx("input",{type:"text",value:n.cta_style.border_radius,onChange:o=>u("cta_style","border_radius",o.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"4px"})]})]}),p==="countdown"&&e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Countdown Color"}),e.jsx(O,{color:n.countdown_style.color,onChange:o=>u("countdown_style","color",o)})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Font Weight"}),e.jsxs("select",{value:n.countdown_style.font_weight,onChange:o=>u("countdown_style","font_weight",o.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",children:[e.jsx("option",{value:"400",children:"Normal"}),e.jsx("option",{value:"500",children:"Medium"}),e.jsx("option",{value:"600",children:"Semi Bold"}),e.jsx("option",{value:"700",children:"Bold"})]})]})]}),p==="pages"&&e.jsx("div",{className:"space-y-6",children:e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-4",children:"Page Assignment"}),e.jsx("p",{className:"text-gray-600 mb-4",children:"Choose which pages this promo bar should appear on. You can assign it globally, to specific pages, post types, categories, or custom URL patterns."}),e.jsxs("button",{onClick:()=>h(!0),className:"px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center",children:[e.jsx(ke,{className:"w-4 h-4 mr-2"}),"Manage Page Assignments"]})]})}),p==="settings"&&e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Status"}),e.jsxs("select",{value:n.status,onChange:o=>_("status",o.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",children:[e.jsx("option",{value:"draft",children:"Draft"}),e.jsx("option",{value:"active",children:"Active"}),e.jsx("option",{value:"paused",children:"Paused"}),e.jsx("option",{value:"archived",children:"Archived"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Priority"}),e.jsx("input",{type:"number",value:n.priority,onChange:o=>_("priority",parseInt(o.target.value)),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",min:"0",max:"100"}),e.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"Higher priority promo bars will be shown first"})]})]})]})]}),g&&e.jsxs("div",{className:"w-1/2 bg-gray-50 p-6",children:[e.jsxs("div",{className:"mb-4",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-2",children:"Live Preview"}),e.jsx("p",{className:"text-sm text-gray-600",children:"See how your promo bar will look on the frontend"})]}),e.jsx("div",{className:"bg-white rounded-lg shadow-lg overflow-hidden",children:e.jsxs("div",{className:"promobarx-preview",style:P(),children:[e.jsxs("div",{className:"flex items-center justify-center gap-4 p-4",children:[n.title&&e.jsx("div",{className:"font-semibold",children:n.title}),n.countdown_enabled&&n.countdown_date&&e.jsx("div",{className:"font-mono font-semibold",style:z(),children:"00d 00h 00m 00s"}),n.cta_text&&e.jsx("a",{href:"#",className:"inline-block px-4 py-2 rounded text-decoration-none font-medium transition-transform hover:transform hover:-translate-y-0.5",style:N(),children:n.cta_text})]}),n.close_button_enabled&&e.jsx("button",{className:"absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors",style:B(),children:"×"})]})})]})]})]}),y&&e.jsx(dt,{promoBar:t,onClose:()=>h(!1),onSave:o=>{o&&C(o),h(!1)}})]})},pt=Object.freeze(Object.defineProperty({__proto__:null,default:()=>{const[t,r]=v.useState(null),[d,n]=v.useState(!0),[c,p]=v.useState(null);v.useEffect(()=>{console.log("EditorPage: Component mounted"),m()},[]);const m=async()=>{var y,h;try{console.log("EditorPage: Loading promo bar data...");const C=new URLSearchParams(window.location.search).get("id");if(console.log("EditorPage: URL params:",window.location.search),console.log("EditorPage: Promo bar ID from URL:",C),console.log("EditorPage: Admin data available:",{promobarxAdmin:window.promobarxAdmin,ajaxurl:(y=window.promobarxAdmin)==null?void 0:y.ajaxurl,nonce:(h=window.promobarxAdmin)==null?void 0:h.nonce}),C&&window.promobarxAdmin&&window.promobarxAdmin.ajaxurl){console.log("EditorPage: Fetching promo bar with ID:",C);const T=await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`action=promobarx_get_promo_bar&id=${C}&nonce=${window.promobarxAdmin.nonce}`});console.log("EditorPage: Response status:",T.status);const _=await T.json();console.log("EditorPage: Response data:",_),_.success?(console.log("EditorPage: Successfully loaded promo bar:",_.data),r(_.data)):(console.error("EditorPage: Failed to load promo bar data:",_.data),p("Failed to load promo bar data: "+(_.data||"Unknown error")))}else console.log("EditorPage: No promo bar ID provided or admin data not available, creating new promo bar"),r(null)}catch(k){console.error("EditorPage: Error loading promo bar:",k),p("Error loading promo bar data: "+k.message)}finally{n(!1)}},g=async y=>{try{console.log("EditorPage: Save completed, redirecting to manager"),window.location.href="admin.php?page=promo-bar-x-topbar-manager"}catch(h){console.error("EditorPage: Error after save:",h)}},x=()=>{console.log("EditorPage: Close clicked, redirecting to manager"),window.location.href="admin.php?page=promo-bar-x-topbar-manager"};return d?e.jsx("div",{className:"flex items-center justify-center min-h-screen",children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"}),e.jsx("p",{className:"text-gray-600",children:"Loading editor..."})]})}):c?e.jsx("div",{className:"flex items-center justify-center min-h-screen",children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"text-red-600 mb-4",children:e.jsx("svg",{className:"w-12 h-12 mx-auto",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"})})}),e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-2",children:"Error"}),e.jsx("p",{className:"text-gray-600 mb-4",children:c}),e.jsx("button",{onClick:x,className:"px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors",children:"Back to Manager"})]})}):(console.log("EditorPage: Rendering TopBarEditor with promo bar:",t),e.jsx("div",{className:"min-h-screen bg-gray-50",children:e.jsx(ct,{promoBar:t,onSave:g,onClose:x})}))}},Symbol.toStringTag,{value:"Module"}))})();
//# sourceMappingURL=chat-admin.js.map
