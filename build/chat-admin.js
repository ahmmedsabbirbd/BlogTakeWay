(function(){"use strict";const ut="modulepreload",mt=function(t){return"/"+t},gt={},Ce=function(n,d,o){let c=Promise.resolve();function p(m){const g=new Event("vite:preloadError",{cancelable:!0});if(g.payload=m,window.dispatchEvent(g),!g.defaultPrevented)throw m}return c.then(m=>{for(const g of m||[])g.status==="rejected"&&p(g.reason);return n().catch(p)})};(function(){let t={promoBars:[],loading:!0,activeTab:"manage"},n=null;function d(x){if(n=document.getElementById(x),!n){console.error("Container not found:",x);return}o(),window.promobarxAdmin&&window.promobarxAdmin.ajaxurl&&window.promobarxAdmin.nonce?c():(console.log("Admin data not available"),t.loading=!1,_())}function o(){n.innerHTML=`
            <div style="display: flex; align-items: center; justify-content: center; height: 256px;">
                <div style="width: 32px; height: 32px; border: 2px solid #e5e7eb; border-top: 2px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `}async function c(){try{const k=await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"action=promobarx_get_promo_bars&nonce="+window.promobarxAdmin.nonce})).json();k.success&&(t.promoBars=k.data)}catch(x){console.error("Error loading promo bars:",x)}finally{t.loading=!1,_()}}async function p(x){if(confirm("Are you sure you want to delete this promo bar?"))try{(await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`action=promobarx_delete&id=${x}&nonce=${window.promobarxAdmin.nonce}`})).json()).success&&await c()}catch(k){console.error("Error deleting promo bar:",k)}}async function m(x){const k=x.status==="active"?"paused":"active";try{(await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`action=promobarx_save&id=${x.id}&status=${k}&nonce=${window.promobarxAdmin.nonce}`})).json()).success&&await c()}catch(B){console.error("Error updating status:",B)}}function g(){window.location.href="admin.php?page=promo-bar-x-editor"}function f(x){window.location.href=`admin.php?page=promo-bar-x-editor&id=${x.id}`}function y(x){t.activeTab=x,_()}function h(x){const k={draft:{color:"background-color: #f3f4f6; color: #374151;",label:"Draft"},active:{color:"background-color: #d1fae5; color: #065f46;",label:"Active"},paused:{color:"background-color: #fef3c7; color: #92400e;",label:"Paused"},archived:{color:"background-color: #fee2e2; color: #991b1b;",label:"Archived"}},B=k[x]||k.draft;return`<span style="padding: 4px 8px; border-radius: 9999px; font-size: 12px; font-weight: 500; ${B.color}">${B.label}</span>`}function j(x){return new Date(x).toLocaleDateString()}function _(){if(t.loading){o();return}n.innerHTML=`
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
                ${t.activeTab==="manage"?$():A()}
            </div>
        `}function $(){return t.promoBars.length===0?`
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
                        ${t.promoBars.map(k=>`
            <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 16px 24px; white-space: nowrap;">
                    <div>
                        <div style="font-size: 14px; font-weight: 500; color: #111827;">${k.name}</div>
                        <div style="font-size: 14px; color: #6b7280;">${k.title}</div>
                    </div>
                </td>
                <td style="padding: 16px 24px; white-space: nowrap;">${h(k.status)}</td>
                <td style="padding: 16px 24px; white-space: nowrap; font-size: 14px; color: #111827;">${k.priority}</td>
                <td style="padding: 16px 24px; white-space: nowrap; font-size: 14px; color: #6b7280;">${j(k.created_at)}</td>
                <td style="padding: 16px 24px; white-space: nowrap; text-align: right;">
                    <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
                        <button onclick="window.simpleTopBarManager.toggleStatus(${JSON.stringify(k).replace(/"/g,"&quot;")})" style="color: #9ca3af; background: none; border: none; cursor: pointer; padding: 4px;" title="${k.status==="active"?"Pause":"Activate"}">
                            <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${k.status==="active"?"M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21":"M15 12a3 3 0 11-6 0 3 3 0 016 0z"}"></path>
                            </svg>
                        </button>
                        <button onclick="window.simpleTopBarManager.editPromoBar(${JSON.stringify(k).replace(/"/g,"&quot;")})" style="color: #3b82f6; background: none; border: none; cursor: pointer; padding: 4px;" title="Edit">
                            <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </button>
                        <button onclick="window.simpleTopBarManager.deletePromoBar(${k.id})" style="color: #dc2626; background: none; border: none; cursor: pointer; padding: 4px;" title="Delete">
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
        `}function A(){return`
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
        `}window.simpleTopBarManager={init:d,loadPromoBars:c,deletePromoBar:p,toggleStatus:m,createNew:g,editPromoBar:f,switchTab:y}})(),document.addEventListener("DOMContentLoaded",()=>{try{let t=function(s){const l=new URLSearchParams(window.location.search).get("id");console.log("Simple Editor: URL params:",window.location.search),console.log("Simple Editor: Promo bar ID from URL:",l),s.innerHTML=`
                <div style="padding: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                        <h1 style="font-size: 24px; font-weight: 600; color: #111827;">
                            ${l?"Edit Promo Bar":"Create New Promo Bar"}
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
            `,n(),l&&(console.log("Simple Editor: Loading promo bar data for ID:",l),loadPromoBarData())},n=function(){const s=document.getElementById("promo-countdown-enabled"),i=document.getElementById("promo-countdown-date");s&&s.addEventListener("change",function(){i.style.display=this.checked?"block":"none",x()}),["promo-name","promo-title","promo-cta-text","promo-cta-url"].forEach(v=>{const S=document.getElementById(v);S&&S.addEventListener("input",x)}),["promo-bg-color","promo-text-color","promo-cta-color","promo-font-size","promo-position"].forEach(v=>{const S=document.getElementById(v);S&&S.addEventListener("change",x)});const u=document.getElementById("promo-assignment-type");u&&u.addEventListener("change",d),$(),x()},d=function(){const s=document.getElementById("promo-assignment-type").value,i=document.getElementById("assignment-options"),l=document.getElementById("specific-pages-option"),r=document.getElementById("category-option"),u=document.getElementById("custom-url-option");l.style.display="none",r.style.display="none",u.style.display="none",i.style.display="none",s==="global"?o("global",{value:"All Pages"}):s==="specific"?(i.style.display="block",l.style.display="block",g()):s==="post_type"?o("post_type",{value:"post"}):s==="category"?(i.style.display="block",r.style.display="block",h()):s==="custom"&&(i.style.display="block",u.style.display="block")},o=function(s,i){const l={id:Date.now(),assignment_type:s,target_id:i.id||0,target_value:i.value||i.name||"",priority:E.length+1};E.push(l),p()},c=function(s){E=E.filter(i=>i.id!==s),p()},p=function(){const s=document.getElementById("assignments-list");if(s){if(E.length===0){s.innerHTML='<div style="text-align: center; color: #6b7280; font-size: 14px;">No assignments yet</div>';return}s.innerHTML=E.map(i=>`
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: white; border: 1px solid #e5e7eb; border-radius: 4px; margin-bottom: 8px;">
                        <span style="font-size: 14px; color: #374151;">${m(i)}</span>
                        <button onclick="removeAssignment(${i.id})" style="background: none; border: none; color: #dc2626; cursor: pointer; font-size: 16px;">×</button>
                    </div>
                `).join("")}},m=function(s){switch(s.assignment_type){case"global":return"🌐 All Pages";case"page":return`📄 Page: ${s.target_value}`;case"post_type":return`📝 All ${s.target_value}s`;case"category":return`🏷️ Category: ${s.target_value}`;case"tag":return`🏷️ Tag: ${s.target_value}`;case"custom":return`🔗 Custom: ${s.target_value}`;default:return"Unknown Assignment"}},g=function(){if(!window.promobarxAdmin||!window.promobarxAdmin.ajaxurl)return;const s=document.getElementById("pages-dropdown");if(!s)return;s.innerHTML='<option value="" disabled>Loading pages...</option>';const i=new FormData;i.append("action","promobarx_get_pages"),i.append("nonce",window.promobarxAdmin.nonce),fetch(window.promobarxAdmin.ajaxurl,{method:"POST",body:i}).then(l=>l.json()).then(l=>{l.success?f(l.data):s.innerHTML='<option value="" disabled>Error loading pages</option>'}).catch(l=>{console.error("Error loading pages:",l),s.innerHTML='<option value="" disabled>Error loading pages</option>'})},f=function(s){const i=document.getElementById("pages-dropdown");i&&(i.innerHTML=s.map(l=>`<option value="${l.id}" data-title="${l.title}">${l.title} (${l.type})</option>`).join(""),i.addEventListener("change",y))},y=function(){const s=document.getElementById("pages-dropdown"),i=Array.from(s.selectedOptions);E=E.filter(l=>l.assignment_type!=="page"),i.forEach(l=>{o("page",{id:parseInt(l.value),value:l.getAttribute("data-title")||l.text})})},h=function(){if(!window.promobarxAdmin||!window.promobarxAdmin.ajaxurl)return;const s=document.getElementById("categories-dropdown");if(!s)return;s.innerHTML='<option value="" disabled>Loading categories...</option>';const i=new FormData;i.append("action","promobarx_get_taxonomies"),i.append("taxonomy","category"),i.append("nonce",window.promobarxAdmin.nonce),fetch(window.promobarxAdmin.ajaxurl,{method:"POST",body:i}).then(l=>l.json()).then(l=>{l.success?j(l.data):s.innerHTML='<option value="" disabled>Error loading categories</option>'}).catch(l=>{console.error("Error loading categories:",l),s.innerHTML='<option value="" disabled>Error loading categories</option>'})},j=function(s){const i=document.getElementById("categories-dropdown");i&&(i.innerHTML=s.map(l=>`<option value="${l.id}" data-name="${l.name}">${l.name}</option>`).join(""),i.addEventListener("change",_))},_=function(){const s=document.getElementById("categories-dropdown"),i=Array.from(s.selectedOptions);E=E.filter(l=>l.assignment_type!=="category"),i.forEach(l=>{o("category",{id:parseInt(l.value),value:l.getAttribute("data-name")||l.text})})},$=function(){h()},A=function(s){j(s)},x=function(){var D,U,H,F,q,J,V,G,W;const s=document.getElementById("promo-preview");if(!s)return;const i=((D=document.getElementById("promo-title"))==null?void 0:D.value)||"Sample Title",l=((U=document.getElementById("promo-cta-text"))==null?void 0:U.value)||"Shop Now",r=((H=document.getElementById("promo-countdown-enabled"))==null?void 0:H.checked)||!1,u=((F=document.getElementById("promo-close-enabled"))==null?void 0:F.checked)||!1,v=((q=document.getElementById("promo-bg-color"))==null?void 0:q.value)||"#3b82f6",S=((J=document.getElementById("promo-text-color"))==null?void 0:J.value)||"#ffffff",L=((V=document.getElementById("promo-cta-color"))==null?void 0:V.value)||"#ffffff",z=((G=document.getElementById("promo-font-size"))==null?void 0:G.value)||"14px",ee=((W=document.getElementById("promo-position"))==null?void 0:W.value)||"top";s.innerHTML=`
                <div style="background: ${v}; color: ${S}; padding: 12px 20px; border-radius: 6px; display: flex; align-items: center; justify-content: space-between; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: ${z};">
                    <div style="display: flex; align-items: center; gap: 20px; flex: 1;">
                        <div>
                            <div style="font-weight: 600;">${i}</div>
                        </div>
                        ${r?'<div style="font-weight: 600; font-family: monospace; font-size: 0.85em;">23:59:59</div>':""}
                        <a href="#" style="background: ${L}; color: ${v}; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-weight: 500; font-size: 0.85em;">${l}</a>
                    </div>
                    ${u?'<button style="background: none; border: none; color: '+S+'; font-size: 18px; cursor: pointer; opacity: 0.7;">×</button>':""}
                </div>
                <div style="margin-top: 10px; font-size: 12px; color: #6b7280; text-align: center;">
                    Position: ${ee==="top"?"Top of Page":"Bottom of Page"}
                </div>
            `};document.getElementById("promo-bar-x-topbar-manager")&&window.simpleTopBarManager.init("promo-bar-x-topbar-manager");const B=document.getElementById("promo-bar-x-editor");B&&(window.React&&window.ReactDOM?Ce(()=>Promise.resolve().then(()=>pt),void 0).then(s=>{const i=s.default;window.ReactDOM.render(window.React.createElement(i),B)}).catch(s=>{console.error("Error loading editor:",s),t(B)}):t(B));let E=[];window.addAssignment=o,window.removeAssignment=c,window.addCustomUrlPattern=function(){const s=document.getElementById("custom-url-pattern").value.trim();s?(o("custom",{value:s}),document.getElementById("custom-url-pattern").value=""):alert("Please enter a URL pattern")},window.selectAllPages=function(){const s=document.getElementById("pages-dropdown");s&&(Array.from(s.options).forEach(i=>{i.selected=!0}),y())},window.clearPageSelection=function(){const s=document.getElementById("pages-dropdown");s&&(Array.from(s.options).forEach(i=>{i.selected=!1}),E=E.filter(i=>i.assignment_type!=="page"),p())},window.selectAllCategories=function(){const s=document.getElementById("categories-dropdown");s&&(Array.from(s.options).forEach(i=>{i.selected=!0}),_())},window.clearCategorySelection=function(){const s=document.getElementById("categories-dropdown");s&&(Array.from(s.options).forEach(i=>{i.selected=!1}),E=E.filter(i=>i.assignment_type!=="category"),p())},window.savePromoBar=function(){var v,S,L,z,ee,D,U,H,F,q,J,V,G,W;console.log("Save button clicked");const i=new URLSearchParams(window.location.search).get("id"),l=((v=document.getElementById("promo-title"))==null?void 0:v.value)||"",r=((S=document.getElementById("promo-name"))==null?void 0:S.value)||"";if(!l.trim()){alert("Please enter a title for the promo bar.");return}if(!r.trim()){alert("Please enter a name for the promo bar.");return}const u={name:r,title:l,cta_text:((L=document.getElementById("promo-cta-text"))==null?void 0:L.value)||"",cta_url:((z=document.getElementById("promo-cta-url"))==null?void 0:z.value)||"",countdown_enabled:((ee=document.getElementById("promo-countdown-enabled"))==null?void 0:ee.checked)||!1,countdown_date:((D=document.getElementById("promo-countdown-date"))==null?void 0:D.value)||"",close_button_enabled:((U=document.getElementById("promo-close-enabled"))==null?void 0:U.checked)||!1,status:((H=document.getElementById("promo-status"))==null?void 0:H.value)||"draft",styling:JSON.stringify({background:((F=document.getElementById("promo-bg-color"))==null?void 0:F.value)||"#3b82f6",color:((q=document.getElementById("promo-text-color"))==null?void 0:q.value)||"#ffffff",font_size:((J=document.getElementById("promo-font-size"))==null?void 0:J.value)||"14px",position:((V=document.getElementById("promo-position"))==null?void 0:V.value)||"top"}),cta_style:JSON.stringify({background:((G=document.getElementById("promo-cta-color"))==null?void 0:G.value)||"#ffffff",color:((W=document.getElementById("promo-bg-color"))==null?void 0:W.value)||"#3b82f6"}),assignments:JSON.stringify(E)};if(i&&(u.id=i),console.log("Data to save:",u),console.log("Admin data:",window.promobarxAdmin),window.promobarxAdmin&&window.promobarxAdmin.ajaxurl){const X=new URLSearchParams;X.append("action","promobarx_save"),X.append("nonce",window.promobarxAdmin.nonce),Object.keys(u).forEach(I=>{X.append(I,u[I])}),console.log("Form data:",X.toString()),fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:X.toString()}).then(I=>(console.log("Response status:",I.status),I.json())).then(I=>{console.log("Save result:",I),I.success?(alert("Promo bar saved successfully!"),window.location.href="admin.php?page=promo-bar-x-topbar-manager"):alert("Error saving promo bar: "+(I.data||"Unknown error"))}).catch(I=>{console.error("Error:",I),alert("Error saving promo bar. Please try again.")})}else console.error("Admin data not available"),alert("Admin data not available. Please refresh the page.")},window.testSave=function(){if(console.log("Test save clicked"),!window.promobarxAdmin||!window.promobarxAdmin.ajaxurl){alert("Admin data not available");return}const s={name:"Test Promo Bar",title:"Test Title",cta_text:"Test Button",cta_url:"https://example.com",status:"draft"},i=new URLSearchParams;i.append("action","promobarx_save"),i.append("nonce",window.promobarxAdmin.nonce),Object.keys(s).forEach(l=>{i.append(l,s[l])}),console.log("Test form data:",i.toString()),fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:i.toString()}).then(l=>(console.log("Test response status:",l.status),l.text())).then(l=>{console.log("Test response text:",l);try{const r=JSON.parse(l);console.log("Test parsed result:",r),r.success?alert("Test save successful! ID: "+r.data.id):alert("Test save failed: "+(r.data||"Unknown error"))}catch(r){console.error("Test JSON parse error:",r),alert("Test response not valid JSON: "+l)}}).catch(l=>{console.error("Test error:",l),alert("Test save error: "+l.message)})},window.loadPromoBarData=function(){const i=new URLSearchParams(window.location.search).get("id");if(!i){alert("No promo bar ID found in the URL.");return}if(console.log("Loading promo bar data for ID:",i),window.promobarxAdmin&&window.promobarxAdmin.ajaxurl){const l=new URLSearchParams;l.append("action","promobarx_get_promo_bar"),l.append("nonce",window.promobarxAdmin.nonce),l.append("id",i),console.log("Form data for loading:",l.toString()),fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:l.toString()}).then(r=>(console.log("Load response status:",r.status),r.json())).then(r=>{if(console.log("Load result:",r),r.success&&r.data){const u=r.data;let v={};if(u.styling)try{v=typeof u.styling=="string"?JSON.parse(u.styling):u.styling}catch(z){console.error("Error parsing styling:",z),v={}}let S={};if(u.cta_style)try{S=typeof u.cta_style=="string"?JSON.parse(u.cta_style):u.cta_style}catch(z){console.error("Error parsing CTA style:",z),S={}}document.getElementById("promo-name").value=u.name||"",document.getElementById("promo-title").value=u.title||"",document.getElementById("promo-cta-text").value=u.cta_text||"",document.getElementById("promo-cta-url").value=u.cta_url||"",document.getElementById("promo-countdown-enabled").checked=!!u.countdown_enabled,document.getElementById("promo-countdown-date").value=u.countdown_date||"",document.getElementById("promo-close-enabled").checked=!!u.close_button_enabled,document.getElementById("promo-status").value=u.status||"draft",document.getElementById("promo-bg-color").value=v.background||"#3b82f6",document.getElementById("promo-text-color").value=v.color||"#ffffff",document.getElementById("promo-font-size").value=v.font_size||"14px",document.getElementById("promo-position").value=v.position||"top",document.getElementById("promo-cta-color").value=S.background||"#ffffff";const L=document.getElementById("promo-countdown-date");if(L&&(L.style.display=u.countdown_enabled?"block":"none"),x(),u.assignments)try{E=typeof u.assignments=="string"?JSON.parse(u.assignments):u.assignments,p()}catch(z){console.error("Error parsing assignments:",z)}console.log("Successfully loaded promo bar data:",u)}else alert("Error loading promo bar data: "+(r.data||"Unknown error"))}).catch(r=>{console.error("Error loading promo bar data:",r),alert("Error loading promo bar data. Please try again.")})}else console.error("Admin data not available for loading"),alert("Admin data not available for loading. Please refresh the page.")},window.testLoadPromoBar=function(){var l,r;const i=new URLSearchParams(window.location.search).get("id");console.log("Test: Current URL params:",window.location.search),console.log("Test: Promo bar ID from URL:",i),console.log("Test: Admin data available:",{promobarxAdmin:window.promobarxAdmin,ajaxurl:(l=window.promobarxAdmin)==null?void 0:l.ajaxurl,nonce:(r=window.promobarxAdmin)==null?void 0:r.nonce}),i?(console.log("Test: Attempting to load promo bar with ID:",i),loadPromoBarData()):(console.log("Test: No promo bar ID found in URL"),alert("No promo bar ID found in URL. Current URL: "+window.location.href))};const a=document.getElementById("promo-bar-x-dashboard");a&&(a.innerHTML=`
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
            `);const C=document.getElementById("promo-bar-x-settings-app");C&&(C.innerHTML=`
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
            `);const w=document.getElementById("promo-bar-x-inquiries");w&&(w.innerHTML=`
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
                `)})}});var ie={exports:{}},Z={},le={exports:{}},b={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var R=Symbol.for("react.element"),Ee=Symbol.for("react.portal"),Se=Symbol.for("react.fragment"),Pe=Symbol.for("react.strict_mode"),Ae=Symbol.for("react.profiler"),Te=Symbol.for("react.provider"),Be=Symbol.for("react.context"),Le=Symbol.for("react.forward_ref"),$e=Symbol.for("react.suspense"),ze=Symbol.for("react.memo"),Ie=Symbol.for("react.lazy"),de=Symbol.iterator;function Me(t){return t===null||typeof t!="object"?null:(t=de&&t[de]||t["@@iterator"],typeof t=="function"?t:null)}var ce={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},pe=Object.assign,ue={};function M(t,n,d){this.props=t,this.context=n,this.refs=ue,this.updater=d||ce}M.prototype.isReactComponent={},M.prototype.setState=function(t,n){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,n,"setState")},M.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function me(){}me.prototype=M.prototype;function te(t,n,d){this.props=t,this.context=n,this.refs=ue,this.updater=d||ce}var oe=te.prototype=new me;oe.constructor=te,pe(oe,M.prototype),oe.isPureReactComponent=!0;var ge=Array.isArray,xe=Object.prototype.hasOwnProperty,ne={current:null},fe={key:!0,ref:!0,__self:!0,__source:!0};function be(t,n,d){var o,c={},p=null,m=null;if(n!=null)for(o in n.ref!==void 0&&(m=n.ref),n.key!==void 0&&(p=""+n.key),n)xe.call(n,o)&&!fe.hasOwnProperty(o)&&(c[o]=n[o]);var g=arguments.length-2;if(g===1)c.children=d;else if(1<g){for(var f=Array(g),y=0;y<g;y++)f[y]=arguments[y+2];c.children=f}if(t&&t.defaultProps)for(o in g=t.defaultProps,g)c[o]===void 0&&(c[o]=g[o]);return{$$typeof:R,type:t,key:p,ref:m,props:c,_owner:ne.current}}function Re(t,n){return{$$typeof:R,type:t.type,key:n,ref:t.ref,props:t.props,_owner:t._owner}}function re(t){return typeof t=="object"&&t!==null&&t.$$typeof===R}function Oe(t){var n={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(d){return n[d]})}var ye=/\/+/g;function ae(t,n){return typeof t=="object"&&t!==null&&t.key!=null?Oe(""+t.key):n.toString(36)}function Q(t,n,d,o,c){var p=typeof t;(p==="undefined"||p==="boolean")&&(t=null);var m=!1;if(t===null)m=!0;else switch(p){case"string":case"number":m=!0;break;case"object":switch(t.$$typeof){case R:case Ee:m=!0}}if(m)return m=t,c=c(m),t=o===""?"."+ae(m,0):o,ge(c)?(d="",t!=null&&(d=t.replace(ye,"$&/")+"/"),Q(c,n,d,"",function(y){return y})):c!=null&&(re(c)&&(c=Re(c,d+(!c.key||m&&m.key===c.key?"":(""+c.key).replace(ye,"$&/")+"/")+t)),n.push(c)),1;if(m=0,o=o===""?".":o+":",ge(t))for(var g=0;g<t.length;g++){p=t[g];var f=o+ae(p,g);m+=Q(p,n,d,f,c)}else if(f=Me(t),typeof f=="function")for(t=f.call(t),g=0;!(p=t.next()).done;)p=p.value,f=o+ae(p,g++),m+=Q(p,n,d,f,c);else if(p==="object")throw n=String(t),Error("Objects are not valid as a React child (found: "+(n==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":n)+"). If you meant to render a collection of children, use an array instead.");return m}function Y(t,n,d){if(t==null)return t;var o=[],c=0;return Q(t,o,"","",function(p){return n.call(d,p,c++)}),o}function De(t){if(t._status===-1){var n=t._result;n=n(),n.then(function(d){(t._status===0||t._status===-1)&&(t._status=1,t._result=d)},function(d){(t._status===0||t._status===-1)&&(t._status=2,t._result=d)}),t._status===-1&&(t._status=0,t._result=n)}if(t._status===1)return t._result.default;throw t._result}var T={current:null},K={transition:null},Ue={ReactCurrentDispatcher:T,ReactCurrentBatchConfig:K,ReactCurrentOwner:ne};function he(){throw Error("act(...) is not supported in production builds of React.")}b.Children={map:Y,forEach:function(t,n,d){Y(t,function(){n.apply(this,arguments)},d)},count:function(t){var n=0;return Y(t,function(){n++}),n},toArray:function(t){return Y(t,function(n){return n})||[]},only:function(t){if(!re(t))throw Error("React.Children.only expected to receive a single React element child.");return t}},b.Component=M,b.Fragment=Se,b.Profiler=Ae,b.PureComponent=te,b.StrictMode=Pe,b.Suspense=$e,b.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Ue,b.act=he,b.cloneElement=function(t,n,d){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var o=pe({},t.props),c=t.key,p=t.ref,m=t._owner;if(n!=null){if(n.ref!==void 0&&(p=n.ref,m=ne.current),n.key!==void 0&&(c=""+n.key),t.type&&t.type.defaultProps)var g=t.type.defaultProps;for(f in n)xe.call(n,f)&&!fe.hasOwnProperty(f)&&(o[f]=n[f]===void 0&&g!==void 0?g[f]:n[f])}var f=arguments.length-2;if(f===1)o.children=d;else if(1<f){g=Array(f);for(var y=0;y<f;y++)g[y]=arguments[y+2];o.children=g}return{$$typeof:R,type:t.type,key:c,ref:p,props:o,_owner:m}},b.createContext=function(t){return t={$$typeof:Be,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:Te,_context:t},t.Consumer=t},b.createElement=be,b.createFactory=function(t){var n=be.bind(null,t);return n.type=t,n},b.createRef=function(){return{current:null}},b.forwardRef=function(t){return{$$typeof:Le,render:t}},b.isValidElement=re,b.lazy=function(t){return{$$typeof:Ie,_payload:{_status:-1,_result:t},_init:De}},b.memo=function(t,n){return{$$typeof:ze,type:t,compare:n===void 0?null:n}},b.startTransition=function(t){var n=K.transition;K.transition={};try{t()}finally{K.transition=n}},b.unstable_act=he,b.useCallback=function(t,n){return T.current.useCallback(t,n)},b.useContext=function(t){return T.current.useContext(t)},b.useDebugValue=function(){},b.useDeferredValue=function(t){return T.current.useDeferredValue(t)},b.useEffect=function(t,n){return T.current.useEffect(t,n)},b.useId=function(){return T.current.useId()},b.useImperativeHandle=function(t,n,d){return T.current.useImperativeHandle(t,n,d)},b.useInsertionEffect=function(t,n){return T.current.useInsertionEffect(t,n)},b.useLayoutEffect=function(t,n){return T.current.useLayoutEffect(t,n)},b.useMemo=function(t,n){return T.current.useMemo(t,n)},b.useReducer=function(t,n,d){return T.current.useReducer(t,n,d)},b.useRef=function(t){return T.current.useRef(t)},b.useState=function(t){return T.current.useState(t)},b.useSyncExternalStore=function(t,n,d){return T.current.useSyncExternalStore(t,n,d)},b.useTransition=function(){return T.current.useTransition()},b.version="18.3.1",le.exports=b;var N=le.exports;/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var He=N,Fe=Symbol.for("react.element"),qe=Symbol.for("react.fragment"),Je=Object.prototype.hasOwnProperty,Ve=He.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Ge={key:!0,ref:!0,__self:!0,__source:!0};function we(t,n,d){var o,c={},p=null,m=null;d!==void 0&&(p=""+d),n.key!==void 0&&(p=""+n.key),n.ref!==void 0&&(m=n.ref);for(o in n)Je.call(n,o)&&!Ge.hasOwnProperty(o)&&(c[o]=n[o]);if(t&&t.defaultProps)for(o in n=t.defaultProps,n)c[o]===void 0&&(c[o]=n[o]);return{$$typeof:Fe,type:t,key:p,ref:m,props:c,_owner:Ve.current}}Z.Fragment=qe,Z.jsx=we,Z.jsxs=we,ie.exports=Z;var e=ie.exports;/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const We=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),ve=(...t)=>t.filter((n,d,o)=>!!n&&n.trim()!==""&&o.indexOf(n)===d).join(" ").trim();/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var Xe={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ze=N.forwardRef(({color:t="currentColor",size:n=24,strokeWidth:d=2,absoluteStrokeWidth:o,className:c="",children:p,iconNode:m,...g},f)=>N.createElement("svg",{ref:f,...Xe,width:n,height:n,stroke:t,strokeWidth:o?Number(d)*24/Number(n):d,className:ve("lucide",c),...g},[...m.map(([y,h])=>N.createElement(y,h)),...Array.isArray(p)?p:[p]]));/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P=(t,n)=>{const d=N.forwardRef(({className:o,...c},p)=>N.createElement(Ze,{ref:p,iconNode:n,className:ve(`lucide-${We(t)}`,o),...c}));return d.displayName=`${t}`,d};/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qe=P("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ye=P("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const je=P("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ke=P("Globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const et=P("Hash",[["line",{x1:"4",x2:"20",y1:"9",y2:"9",key:"4lhtct"}],["line",{x1:"4",x2:"20",y1:"15",y2:"15",key:"vyu0kd"}],["line",{x1:"10",x2:"8",y1:"3",y2:"21",key:"1ggp8o"}],["line",{x1:"16",x2:"14",y1:"3",y2:"21",key:"weycgp"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tt=P("Link",[["path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",key:"1cjeqo"}],["path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",key:"19qd67"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ke=P("MapPin",[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ot=P("MousePointer",[["path",{d:"M12.586 12.586 19 19",key:"ea5xo7"}],["path",{d:"M3.688 3.037a.497.497 0 0 0-.651.651l6.5 15.999a.501.501 0 0 0 .947-.062l1.569-6.083a2 2 0 0 1 1.448-1.479l6.124-1.579a.5.5 0 0 0 .063-.947z",key:"277e5u"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nt=P("Palette",[["circle",{cx:"13.5",cy:"6.5",r:".5",fill:"currentColor",key:"1okk4w"}],["circle",{cx:"17.5",cy:"10.5",r:".5",fill:"currentColor",key:"f64h9f"}],["circle",{cx:"8.5",cy:"7.5",r:".5",fill:"currentColor",key:"fotxhn"}],["circle",{cx:"6.5",cy:"12.5",r:".5",fill:"currentColor",key:"qy21gx"}],["path",{d:"M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z",key:"12rzf8"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rt=P("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _e=P("Save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const se=P("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const at=P("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const st=P("Tag",[["path",{d:"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",key:"vktsd0"}],["circle",{cx:"7.5",cy:"7.5",r:".5",fill:"currentColor",key:"kqv944"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const it=P("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lt=P("Type",[["polyline",{points:"4 7 4 4 20 4 20 7",key:"1nosan"}],["line",{x1:"9",x2:"15",y1:"20",y2:"20",key:"swin9y"}],["line",{x1:"12",x2:"12",y1:"4",y2:"20",key:"1tx1rr"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ne=P("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]),O=({color:t,onChange:n})=>{const[d,o]=N.useState(!1),[c,p]=N.useState(t),m=N.useRef(null),g=["#000000","#ffffff","#dc2626","#ea580c","#d97706","#65a30d","#16a34a","#0d9488","#0891b2","#2563eb","#4F46E5","#7c3aed","#9333ea","#c026d3","#e11d48","#f59e0b","#10b981","#06b6d4","#3b82f6","#8b5cf6","#ec4899","#f97316","#84cc16","#14b8a6"];N.useEffect(()=>{p(t)},[t]),N.useEffect(()=>{const h=j=>{m.current&&!m.current.contains(j.target)&&o(!1)};return document.addEventListener("mousedown",h),()=>{document.removeEventListener("mousedown",h)}},[]);const f=h=>{p(h),n(h),o(!1)},y=h=>{const j=h.target.value;p(j),n(j)};return e.jsxs("div",{className:"relative",ref:m,children:[e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("button",{type:"button",onClick:()=>o(!d),className:"w-10 h-10 rounded border border-gray-300 shadow-sm",style:{backgroundColor:c},title:"Choose color"}),e.jsx("input",{type:"text",value:c,onChange:y,className:"flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"#000000"})]}),d&&e.jsxs("div",{className:"absolute z-10 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg",children:[e.jsx("div",{className:"grid grid-cols-6 gap-2 mb-3",children:g.map(h=>e.jsx("button",{type:"button",onClick:()=>f(h),className:"w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform",style:{backgroundColor:h},title:h},h))}),e.jsx("div",{className:"text-xs text-gray-500 text-center",children:"Click a color to select"})]})]})},dt=({promoBar:t,onClose:n,onSave:d})=>{const[o,c]=N.useState([]),[p,m]=N.useState(!0),[g,f]=N.useState(!1),[y,h]=N.useState(""),[j,_]=N.useState([]),[$,A]=N.useState(!1),[x,k]=N.useState("global");N.useEffect(()=>{t&&t.id?B():m(!1)},[t]);const B=async()=>{console.log("Loading assignments for promo bar:",t.id);try{const r=`action=promobarx_get_assignments&promo_bar_id=${t.id}&nonce=${window.promobarxAdmin.nonce}`;console.log("Request body:",r);const v=await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:r})).json();console.log("Assignments response:",v),v.success?c(v.data||[]):console.error("Failed to load assignments:",v)}catch(r){console.error("Error loading assignments:",r)}finally{m(!1)}},E=async(r,u="page")=>{if(console.log("Searching pages with term:",r,"type:",u),!r.trim()){_([]);return}A(!0);try{const v=`action=promobarx_get_pages&search=${encodeURIComponent(r)}&post_type=${u}&nonce=${window.promobarxAdmin.nonce}`;console.log("Request body:",v);const L=await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:v})).json();console.log("Search response:",L),L.success?_(L.data||[]):console.error("Search failed:",L)}catch(v){console.error("Error searching pages:",v)}finally{A(!1)}},a=async(r,u="category")=>{if(!r.trim()){_([]);return}A(!0);try{const S=await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`action=promobarx_get_taxonomies&search=${encodeURIComponent(r)}&taxonomy=${u}&nonce=${window.promobarxAdmin.nonce}`})).json();S.success&&_(S.data||[])}catch(v){console.error("Error searching taxonomies:",v)}finally{A(!1)}},C=(r,u={})=>{const v={id:Date.now(),assignment_type:r,target_id:u.id||0,target_value:u.value||u.name||"",priority:o.length+1,...u};c([...o,v])},w=r=>{const u=o.filter((v,S)=>S!==r);c(u)},s=async()=>{if(!t||!t.id){alert("No promo bar selected");return}f(!0);try{const u=await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({action:"promobarx_save_assignments",promo_bar_id:t.id,assignments:JSON.stringify(o),nonce:window.promobarxAdmin.nonce})})).json();u.success?(d(),n()):alert("Error saving assignments: "+u.data)}catch(r){console.error("Error saving assignments:",r),alert("Error saving assignments")}finally{f(!1)}},i=r=>{h(r),x==="pages"?E(r):x==="categories"?a(r,"category"):x==="tags"&&a(r,"post_tag")},l=r=>{switch(r.assignment_type){case"global":return"All Pages";case"page":return`Page: ${r.target_value||"Unknown Page"}`;case"post_type":return`All ${r.target_value||"Posts"}`;case"category":return`Category: ${r.target_value||"Unknown Category"}`;case"tag":return`Tag: ${r.target_value||"Unknown Tag"}`;case"custom":return`Custom: ${r.target_value||"Unknown Pattern"}`;default:return"Unknown Assignment"}};return p?e.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",children:e.jsxs("div",{className:"bg-white rounded-lg p-8 text-center",children:[e.jsx("div",{className:"animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"}),e.jsx("p",{className:"text-gray-600",children:"Loading assignments..."})]})}):e.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",children:e.jsxs("div",{className:"bg-white rounded-lg shadow-xl w-full max-w-4xl h-5/6 flex flex-col",children:[e.jsxs("div",{className:"flex items-center justify-between p-6 border-b border-gray-200",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-xl font-semibold text-gray-900",children:"Page Assignment"}),e.jsx("p",{className:"text-sm text-gray-600",children:"Choose where this promo bar should appear"})]}),e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsxs("button",{onClick:s,disabled:g,className:"px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center",children:[e.jsx(_e,{className:"w-4 h-4 mr-2"}),g?"Saving...":"Save"]}),e.jsx("button",{onClick:n,className:"p-2 text-gray-400 hover:text-gray-600",children:e.jsx(Ne,{className:"w-5 h-5"})})]})]}),e.jsxs("div",{className:"flex flex-1 overflow-hidden",children:[e.jsxs("div",{className:"w-1/3 border-r border-gray-200 flex flex-col",children:[e.jsxs("div",{className:"p-4 border-b border-gray-200",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-4",children:"Assignment Types"}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("button",{onClick:()=>k("global"),className:`w-full flex items-center p-3 rounded-lg text-left transition-colors ${x==="global"?"bg-blue-50 text-blue-700 border border-blue-200":"hover:bg-gray-50"}`,children:[e.jsx(Ke,{className:"w-5 h-5 mr-3"}),e.jsxs("div",{children:[e.jsx("div",{className:"font-medium",children:"Global"}),e.jsx("div",{className:"text-sm text-gray-500",children:"Show on all pages"})]})]}),e.jsxs("button",{onClick:()=>k("pages"),className:`w-full flex items-center p-3 rounded-lg text-left transition-colors ${x==="pages"?"bg-blue-50 text-blue-700 border border-blue-200":"hover:bg-gray-50"}`,children:[e.jsx(je,{className:"w-5 h-5 mr-3"}),e.jsxs("div",{children:[e.jsx("div",{className:"font-medium",children:"Specific Pages"}),e.jsx("div",{className:"text-sm text-gray-500",children:"Select individual pages"})]})]}),e.jsxs("button",{onClick:()=>k("post_types"),className:`w-full flex items-center p-3 rounded-lg text-left transition-colors ${x==="post_types"?"bg-blue-50 text-blue-700 border border-blue-200":"hover:bg-gray-50"}`,children:[e.jsx(je,{className:"w-5 h-5 mr-3"}),e.jsxs("div",{children:[e.jsx("div",{className:"font-medium",children:"Post Types"}),e.jsx("div",{className:"text-sm text-gray-500",children:"All pages of a type"})]})]}),e.jsxs("button",{onClick:()=>k("categories"),className:`w-full flex items-center p-3 rounded-lg text-left transition-colors ${x==="categories"?"bg-blue-50 text-blue-700 border border-blue-200":"hover:bg-gray-50"}`,children:[e.jsx(st,{className:"w-5 h-5 mr-3"}),e.jsxs("div",{children:[e.jsx("div",{className:"font-medium",children:"Categories"}),e.jsx("div",{className:"text-sm text-gray-500",children:"Pages in categories"})]})]}),e.jsxs("button",{onClick:()=>k("tags"),className:`w-full flex items-center p-3 rounded-lg text-left transition-colors ${x==="tags"?"bg-blue-50 text-blue-700 border border-blue-200":"hover:bg-gray-50"}`,children:[e.jsx(et,{className:"w-5 h-5 mr-3"}),e.jsxs("div",{children:[e.jsx("div",{className:"font-medium",children:"Tags"}),e.jsx("div",{className:"text-sm text-gray-500",children:"Pages with tags"})]})]}),e.jsxs("button",{onClick:()=>k("custom"),className:`w-full flex items-center p-3 rounded-lg text-left transition-colors ${x==="custom"?"bg-blue-50 text-blue-700 border border-blue-200":"hover:bg-gray-50"}`,children:[e.jsx(tt,{className:"w-5 h-5 mr-3"}),e.jsxs("div",{children:[e.jsx("div",{className:"font-medium",children:"Custom URLs"}),e.jsx("div",{className:"text-sm text-gray-500",children:"URL patterns"})]})]})]})]}),e.jsxs("div",{className:"flex-1 p-4 overflow-y-auto",children:[e.jsx("h4",{className:"font-medium text-gray-900 mb-3",children:"Current Assignments"}),o.length===0?e.jsx("p",{className:"text-gray-500 text-sm",children:"No assignments yet"}):e.jsx("div",{className:"space-y-2",children:o.map((r,u)=>e.jsxs("div",{className:"flex items-center justify-between p-2 bg-gray-50 rounded",children:[e.jsx("span",{className:"text-sm text-gray-700",children:l(r)}),e.jsx("button",{onClick:()=>w(u),className:"text-red-500 hover:text-red-700",children:e.jsx(it,{className:"w-4 h-4"})})]},r.id||u))})]})]}),e.jsxs("div",{className:"flex-1 p-6 overflow-y-auto",children:[x==="global"&&e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900",children:"Global Assignment"}),e.jsx("p",{className:"text-gray-600",children:"This promo bar will appear on all pages of your website."}),e.jsxs("button",{onClick:()=>C("global"),className:"px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center",children:[e.jsx(rt,{className:"w-4 h-4 mr-2"}),"Add Global Assignment"]})]}),x==="pages"&&e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900",children:"Specific Pages"}),e.jsxs("div",{className:"relative",children:[e.jsx("input",{type:"text",placeholder:"Search pages...",value:y,onChange:r=>i(r.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"}),e.jsx(se,{className:"absolute right-3 top-2.5 w-5 h-5 text-gray-400"})]}),$&&e.jsx("div",{className:"text-center py-4",children:e.jsx("div",{className:"animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"})}),j.length>0&&e.jsx("div",{className:"space-y-2 max-h-64 overflow-y-auto",children:j.map(r=>e.jsxs("button",{onClick:()=>C("page",{id:r.id,value:r.title}),className:"w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50",children:[e.jsx("div",{className:"font-medium",children:r.title}),e.jsxs("div",{className:"text-sm text-gray-500",children:[r.type," • ",r.url]})]},r.id))})]}),x==="post_types"&&e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900",children:"Post Types"}),e.jsx("p",{className:"text-gray-600",children:"Select a post type to show this promo bar on all pages of that type."}),e.jsx("div",{className:"grid grid-cols-2 gap-3",children:["page","post","product"].map(r=>e.jsxs("button",{onClick:()=>C("post_type",{value:r}),className:"p-3 border border-gray-200 rounded-md hover:bg-gray-50 text-left",children:[e.jsxs("div",{className:"font-medium capitalize",children:[r,"s"]}),e.jsxs("div",{className:"text-sm text-gray-500",children:["All ",r," pages"]})]},r))})]}),x==="categories"&&e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900",children:"Categories"}),e.jsxs("div",{className:"relative",children:[e.jsx("input",{type:"text",placeholder:"Search categories...",value:y,onChange:r=>i(r.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"}),e.jsx(se,{className:"absolute right-3 top-2.5 w-5 h-5 text-gray-400"})]}),j.length>0&&e.jsx("div",{className:"space-y-2 max-h-64 overflow-y-auto",children:j.map(r=>e.jsxs("button",{onClick:()=>C("category",{id:r.id,value:r.name}),className:"w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50",children:[e.jsx("div",{className:"font-medium",children:r.name}),e.jsx("div",{className:"text-sm text-gray-500",children:"Category"})]},r.id))})]}),x==="tags"&&e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900",children:"Tags"}),e.jsxs("div",{className:"relative",children:[e.jsx("input",{type:"text",placeholder:"Search tags...",value:y,onChange:r=>i(r.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"}),e.jsx(se,{className:"absolute right-3 top-2.5 w-5 h-5 text-gray-400"})]}),j.length>0&&e.jsx("div",{className:"space-y-2 max-h-64 overflow-y-auto",children:j.map(r=>e.jsxs("button",{onClick:()=>C("tag",{id:r.id,value:r.name}),className:"w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50",children:[e.jsx("div",{className:"font-medium",children:r.name}),e.jsx("div",{className:"text-sm text-gray-500",children:"Tag"})]},r.id))})]}),x==="custom"&&e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900",children:"Custom URL Patterns"}),e.jsx("p",{className:"text-gray-600",children:"Enter URL patterns to match specific pages."}),e.jsxs("div",{className:"space-y-3",children:[e.jsx("input",{type:"text",placeholder:"e.g., /shop/*, /blog/2024/*",value:y,onChange:r=>h(r.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"}),e.jsx("button",{onClick:()=>{y.trim()&&(C("custom",{value:y.trim()}),h(""))},className:"px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",children:"Add Custom Pattern"})]})]})]})]})]})})},ct=({promoBar:t,onClose:n,onSave:d})=>{const[o,c]=N.useState({name:"",title:"",cta_text:"",cta_url:"",countdown_enabled:!1,countdown_date:"",close_button_enabled:!0,status:"draft",priority:0,template_id:0,styling:{background:"#ffffff",color:"#333333",font_family:"Inter, sans-serif",font_size:"14px",padding:"12px 20px",border_bottom:"1px solid #e5e7eb"},cta_style:{background:"#4F46E5",color:"#ffffff",padding:"8px 16px",border_radius:"4px",font_weight:"500"},countdown_style:{color:"#dc2626",font_weight:"600",font_family:"monospace"},close_button_style:{color:"#6b7280",font_size:"20px",padding:"4px 8px"}}),[p,m]=N.useState("content"),[g,f]=N.useState(!0),[y,h]=N.useState(!1);N.useEffect(()=>{if(t&&typeof t=="object"){console.log("PromoBar data received in editor:",t);let a={};if(t.styling)if(typeof t.styling=="string")try{a=JSON.parse(t.styling)}catch(r){console.error("Error parsing styling JSON:",r),a={}}else a=t.styling;const C={background:a.background||a.backgroundColor||"#ffffff",color:a.color||a.text_color||"#333333",font_family:a.font_family||a.fontFamily||"Inter, sans-serif",font_size:a.font_size||a.fontSize||"14px",padding:a.padding||"12px 20px",border_bottom:a.border_bottom||a.borderBottom||"1px solid #e5e7eb"};let w={};if(t.cta_style)if(typeof t.cta_style=="string")try{w=JSON.parse(t.cta_style)}catch(r){console.error("Error parsing CTA style JSON:",r),w={}}else w=t.cta_style;let s={};if(t.countdown_style)if(typeof t.countdown_style=="string")try{s=JSON.parse(t.countdown_style)}catch(r){console.error("Error parsing countdown style JSON:",r),s={}}else s=t.countdown_style;let i={};if(t.close_button_style)if(typeof t.close_button_style=="string")try{i=JSON.parse(t.close_button_style)}catch(r){console.error("Error parsing close button style JSON:",r),i={}}else i=t.close_button_style;const l={...o,name:t.name||"",title:t.title||"",cta_text:t.cta_text||"",cta_url:t.cta_url||"",countdown_enabled:!!t.countdown_enabled,countdown_date:t.countdown_date||"",close_button_enabled:!!t.close_button_enabled,status:t.status||"draft",priority:parseInt(t.priority)||0,template_id:parseInt(t.template_id)||0,styling:{...o.styling,...C},cta_style:{...o.cta_style,...w},countdown_style:{...o.countdown_style,...s},close_button_style:{...o.close_button_style,...i}};console.log("Updated form data:",l),c(l)}else console.log("No promo bar data provided or invalid data:",t)},[t]);const j=(a,C)=>{c(w=>({...w,[a]:C}))},_=(a,C,w)=>{c(s=>({...s,[a]:{...s[a],[C]:w}}))},$=async()=>{try{if(!window.promobarxAdmin||!window.promobarxAdmin.ajaxurl||!window.promobarxAdmin.nonce){console.error("PromoBarX admin data not available");return}const a={...o,styling:JSON.stringify(o.styling),cta_style:JSON.stringify(o.cta_style),countdown_style:JSON.stringify(o.countdown_style),close_button_style:JSON.stringify(o.close_button_style)},w=await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({action:"promobarx_save",nonce:window.promobarxAdmin.nonce,...a})})).json();w.success?d():alert("Error saving promo bar: "+w.data)}catch(a){console.error("Error saving promo bar:",a),alert("Error saving promo bar")}},A=()=>{const a={background:o.styling.background,color:o.styling.color,fontFamily:o.styling.font_family,fontSize:o.styling.font_size,padding:o.styling.padding,borderBottom:o.styling.border_bottom};return Object.entries(a).filter(([C,w])=>w).map(([C,w])=>`${C.replace(/([A-Z])/g,"-$1").toLowerCase()}: ${w}`).join("; ")},x=()=>{const a={background:o.cta_style.background,color:o.cta_style.color,padding:o.cta_style.padding,borderRadius:o.cta_style.border_radius,fontWeight:o.cta_style.font_weight};return Object.entries(a).filter(([C,w])=>w).map(([C,w])=>`${C.replace(/([A-Z])/g,"-$1").toLowerCase()}: ${w}`).join("; ")},k=()=>{const a={color:o.countdown_style.color,fontWeight:o.countdown_style.font_weight,fontFamily:o.countdown_style.font_family};return Object.entries(a).filter(([C,w])=>w).map(([C,w])=>`${C.replace(/([A-Z])/g,"-$1").toLowerCase()}: ${w}`).join("; ")},B=()=>{const a={color:o.close_button_style.color,fontSize:o.close_button_style.font_size,padding:o.close_button_style.padding};return Object.entries(a).filter(([C,w])=>w).map(([C,w])=>`${C.replace(/([A-Z])/g,"-$1").toLowerCase()}: ${w}`).join("; ")},E=[{id:"content",label:"Content",icon:lt},{id:"styling",label:"Styling",icon:nt},{id:"cta",label:"CTA Button",icon:ot},{id:"countdown",label:"Countdown",icon:Qe},{id:"pages",label:"Page Assignment",icon:ke},{id:"settings",label:"Settings",icon:at}];return!window.promobarxAdmin||!window.promobarxAdmin.ajaxurl||!window.promobarxAdmin.nonce?e.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",children:e.jsxs("div",{className:"bg-white rounded-lg p-8 text-center",children:[e.jsx("div",{className:"animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"}),e.jsx("p",{className:"text-gray-600",children:"Loading PromoBarX admin..."})]})}):e.jsxs("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",children:[e.jsxs("div",{className:"bg-white rounded-lg shadow-xl w-full max-w-7xl h-5/6 flex flex-col",children:[e.jsxs("div",{className:"flex items-center justify-between p-6 border-b border-gray-200",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-xl font-semibold text-gray-900",children:t?"Edit Promo Bar":"Create New Promo Bar"}),e.jsx("p",{className:"text-sm text-gray-600",children:"Design your promotional top bar"})]}),e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsxs("button",{onClick:()=>f(!g),className:`px-3 py-2 rounded-md text-sm font-medium ${g?"bg-blue-100 text-blue-700":"bg-gray-100 text-gray-700"}`,children:[e.jsx(Ye,{className:"w-4 h-4 inline mr-1"}),"Preview"]}),e.jsxs("button",{onClick:$,className:"px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors",children:[e.jsx(_e,{className:"w-4 h-4 inline mr-2"}),"Save"]}),e.jsx("button",{onClick:n,className:"p-2 text-gray-400 hover:text-gray-600",children:e.jsx(Ne,{className:"w-5 h-5"})})]})]}),e.jsxs("div",{className:"flex flex-1 overflow-hidden",children:[e.jsxs("div",{className:"w-1/2 border-r border-gray-200 flex flex-col",children:[e.jsx("div",{className:"border-b border-gray-200",children:e.jsx("nav",{className:"flex space-x-8 px-6",children:E.map(a=>e.jsxs("button",{onClick:()=>m(a.id),className:`py-3 px-1 border-b-2 font-medium text-sm ${p===a.id?"border-blue-500 text-blue-600":"border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`,children:[e.jsx(a.icon,{className:"w-4 h-4 inline mr-2"}),a.label]},a.id))})}),e.jsxs("div",{className:"flex-1 overflow-y-auto p-6",children:[p==="content"&&e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Promo Bar Name"}),e.jsx("input",{type:"text",value:o.name,onChange:a=>j("name",a.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"Enter promo bar name"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Title"}),e.jsx("input",{type:"text",value:o.title,onChange:a=>j("title",a.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"Enter main title"})]}),e.jsxs("div",{className:"flex space-x-4",children:[e.jsxs("div",{className:"flex-1",children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"CTA Text"}),e.jsx("input",{type:"text",value:o.cta_text,onChange:a=>j("cta_text",a.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"Shop Now"})]}),e.jsxs("div",{className:"flex-1",children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"CTA URL"}),e.jsx("input",{type:"url",value:o.cta_url,onChange:a=>j("cta_url",a.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"https://example.com"})]})]}),e.jsx("div",{className:"flex items-center space-x-4",children:e.jsxs("label",{className:"flex items-center",children:[e.jsx("input",{type:"checkbox",checked:o.countdown_enabled,onChange:a=>j("countdown_enabled",a.target.checked),className:"rounded border-gray-300 text-blue-600 focus:ring-blue-500"}),e.jsx("span",{className:"ml-2 text-sm text-gray-700",children:"Enable Countdown Timer"})]})}),o.countdown_enabled&&e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Countdown End Date"}),e.jsx("input",{type:"datetime-local",value:o.countdown_date,onChange:a=>j("countdown_date",a.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"})]}),e.jsx("div",{className:"flex items-center space-x-4",children:e.jsxs("label",{className:"flex items-center",children:[e.jsx("input",{type:"checkbox",checked:o.close_button_enabled,onChange:a=>j("close_button_enabled",a.target.checked),className:"rounded border-gray-300 text-blue-600 focus:ring-blue-500"}),e.jsx("span",{className:"ml-2 text-sm text-gray-700",children:"Show Close Button"})]})})]}),p==="styling"&&e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Background Color"}),e.jsx(O,{color:o.styling.background,onChange:a=>_("styling","background",a)})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Text Color"}),e.jsx(O,{color:o.styling.color,onChange:a=>_("styling","color",a)})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Font Family"}),e.jsxs("select",{value:o.styling.font_family,onChange:a=>_("styling","font_family",a.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",children:[e.jsx("option",{value:"Inter, sans-serif",children:"Inter"}),e.jsx("option",{value:"Arial, sans-serif",children:"Arial"}),e.jsx("option",{value:"Helvetica, sans-serif",children:"Helvetica"}),e.jsx("option",{value:"Georgia, serif",children:"Georgia"}),e.jsx("option",{value:"Times New Roman, serif",children:"Times New Roman"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Font Size"}),e.jsx("input",{type:"text",value:o.styling.font_size,onChange:a=>_("styling","font_size",a.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"14px"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Padding"}),e.jsx("input",{type:"text",value:o.styling.padding,onChange:a=>_("styling","padding",a.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"12px 20px"})]})]}),p==="cta"&&e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Button Background Color"}),e.jsx(O,{color:o.cta_style.background,onChange:a=>_("cta_style","background",a)})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Button Text Color"}),e.jsx(O,{color:o.cta_style.color,onChange:a=>_("cta_style","color",a)})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Button Padding"}),e.jsx("input",{type:"text",value:o.cta_style.padding,onChange:a=>_("cta_style","padding",a.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"8px 16px"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Border Radius"}),e.jsx("input",{type:"text",value:o.cta_style.border_radius,onChange:a=>_("cta_style","border_radius",a.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"4px"})]})]}),p==="countdown"&&e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Countdown Color"}),e.jsx(O,{color:o.countdown_style.color,onChange:a=>_("countdown_style","color",a)})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Font Weight"}),e.jsxs("select",{value:o.countdown_style.font_weight,onChange:a=>_("countdown_style","font_weight",a.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",children:[e.jsx("option",{value:"400",children:"Normal"}),e.jsx("option",{value:"500",children:"Medium"}),e.jsx("option",{value:"600",children:"Semi Bold"}),e.jsx("option",{value:"700",children:"Bold"})]})]})]}),p==="pages"&&e.jsx("div",{className:"space-y-6",children:e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-4",children:"Page Assignment"}),e.jsx("p",{className:"text-gray-600 mb-4",children:"Choose which pages this promo bar should appear on. You can assign it globally, to specific pages, post types, categories, or custom URL patterns."}),e.jsxs("button",{onClick:()=>h(!0),className:"px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center",children:[e.jsx(ke,{className:"w-4 h-4 mr-2"}),"Manage Page Assignments"]})]})}),p==="settings"&&e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Status"}),e.jsxs("select",{value:o.status,onChange:a=>j("status",a.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",children:[e.jsx("option",{value:"draft",children:"Draft"}),e.jsx("option",{value:"active",children:"Active"}),e.jsx("option",{value:"paused",children:"Paused"}),e.jsx("option",{value:"archived",children:"Archived"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Priority"}),e.jsx("input",{type:"number",value:o.priority,onChange:a=>j("priority",parseInt(a.target.value)),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",min:"0",max:"100"}),e.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"Higher priority promo bars will be shown first"})]})]})]})]}),g&&e.jsxs("div",{className:"w-1/2 bg-gray-50 p-6",children:[e.jsxs("div",{className:"mb-4",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-2",children:"Live Preview"}),e.jsx("p",{className:"text-sm text-gray-600",children:"See how your promo bar will look on the frontend"})]}),e.jsx("div",{className:"bg-white rounded-lg shadow-lg overflow-hidden",children:e.jsxs("div",{className:"promobarx-preview",style:A(),children:[e.jsxs("div",{className:"flex items-center justify-center gap-4 p-4",children:[o.title&&e.jsx("div",{className:"font-semibold",children:o.title}),o.countdown_enabled&&o.countdown_date&&e.jsx("div",{className:"font-mono font-semibold",style:k(),children:"00d 00h 00m 00s"}),o.cta_text&&e.jsx("a",{href:"#",className:"inline-block px-4 py-2 rounded text-decoration-none font-medium transition-transform hover:transform hover:-translate-y-0.5",style:x(),children:o.cta_text})]}),o.close_button_enabled&&e.jsx("button",{className:"absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors",style:B(),children:"×"})]})})]})]})]}),y&&e.jsx(dt,{promoBar:t,onClose:()=>h(!1),onSave:()=>{h(!1)}})]})},pt=Object.freeze(Object.defineProperty({__proto__:null,default:()=>{const[t,n]=N.useState(null),[d,o]=N.useState(!0),[c,p]=N.useState(null);N.useEffect(()=>{console.log("EditorPage: Component mounted"),m()},[]);const m=async()=>{var y,h;try{console.log("EditorPage: Loading promo bar data...");const _=new URLSearchParams(window.location.search).get("id");if(console.log("EditorPage: URL params:",window.location.search),console.log("EditorPage: Promo bar ID from URL:",_),console.log("EditorPage: Admin data available:",{promobarxAdmin:window.promobarxAdmin,ajaxurl:(y=window.promobarxAdmin)==null?void 0:y.ajaxurl,nonce:(h=window.promobarxAdmin)==null?void 0:h.nonce}),_&&window.promobarxAdmin&&window.promobarxAdmin.ajaxurl){console.log("EditorPage: Fetching promo bar with ID:",_);const $=await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`action=promobarx_get_promo_bar&id=${_}&nonce=${window.promobarxAdmin.nonce}`});console.log("EditorPage: Response status:",$.status);const A=await $.json();console.log("EditorPage: Response data:",A),A.success?(console.log("EditorPage: Successfully loaded promo bar:",A.data),n(A.data)):(console.error("EditorPage: Failed to load promo bar data:",A.data),p("Failed to load promo bar data: "+(A.data||"Unknown error")))}else console.log("EditorPage: No promo bar ID provided or admin data not available, creating new promo bar"),n(null)}catch(j){console.error("EditorPage: Error loading promo bar:",j),p("Error loading promo bar data: "+j.message)}finally{o(!1)}},g=async y=>{try{console.log("EditorPage: Save completed, redirecting to manager"),window.location.href="admin.php?page=promo-bar-x-topbar-manager"}catch(h){console.error("EditorPage: Error after save:",h)}},f=()=>{console.log("EditorPage: Close clicked, redirecting to manager"),window.location.href="admin.php?page=promo-bar-x-topbar-manager"};return d?e.jsx("div",{className:"flex items-center justify-center min-h-screen",children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"}),e.jsx("p",{className:"text-gray-600",children:"Loading editor..."})]})}):c?e.jsx("div",{className:"flex items-center justify-center min-h-screen",children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"text-red-600 mb-4",children:e.jsx("svg",{className:"w-12 h-12 mx-auto",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"})})}),e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-2",children:"Error"}),e.jsx("p",{className:"text-gray-600 mb-4",children:c}),e.jsx("button",{onClick:f,className:"px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors",children:"Back to Manager"})]})}):(console.log("EditorPage: Rendering TopBarEditor with promo bar:",t),e.jsx("div",{className:"min-h-screen bg-gray-50",children:e.jsx(ct,{promoBar:t,onSave:g,onClose:f})}))}},Symbol.toStringTag,{value:"Module"}))})();
//# sourceMappingURL=chat-admin.js.map
