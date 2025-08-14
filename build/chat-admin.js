(function(){"use strict";const lt="modulepreload",dt=function(t){return"/"+t},ct={},je=function(r,d,n){let c=Promise.resolve();function p(u){const m=new Event("vite:preloadError",{cancelable:!0});if(m.payload=u,window.dispatchEvent(m),!m.defaultPrevented)throw u}return c.then(u=>{for(const m of u||[])m.status==="rejected"&&p(m.reason);return r().catch(p)})};(function(){let t={promoBars:[],loading:!0,activeTab:"manage"},r=null;function d(x){if(r=document.getElementById(x),!r){console.error("Container not found:",x);return}n(),window.promobarxAdmin&&window.promobarxAdmin.ajaxurl&&window.promobarxAdmin.nonce?c():(console.log("Admin data not available"),t.loading=!1,_())}function n(){r.innerHTML=`
            <div style="display: flex; align-items: center; justify-content: center; height: 256px;">
                <div style="width: 32px; height: 32px; border: 2px solid #e5e7eb; border-top: 2px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `}async function c(){try{const v=await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"action=promobarx_get_promo_bars&nonce="+window.promobarxAdmin.nonce})).json();v.success&&(t.promoBars=v.data)}catch(x){console.error("Error loading promo bars:",x)}finally{t.loading=!1,_()}}async function p(x){if(confirm("Are you sure you want to delete this promo bar?"))try{(await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`action=promobarx_delete&id=${x}&nonce=${window.promobarxAdmin.nonce}`})).json()).success&&await c()}catch(v){console.error("Error deleting promo bar:",v)}}async function u(x){const v=x.status==="active"?"paused":"active";try{(await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`action=promobarx_save&id=${x.id}&status=${v}&nonce=${window.promobarxAdmin.nonce}`})).json()).success&&await c()}catch(B){console.error("Error updating status:",B)}}function m(){window.location.href="admin.php?page=promo-bar-x-editor"}function f(x){window.location.href=`admin.php?page=promo-bar-x-editor&id=${x.id}`}function y(x){t.activeTab=x,_()}function w(x){const v={draft:{color:"background-color: #f3f4f6; color: #374151;",label:"Draft"},active:{color:"background-color: #d1fae5; color: #065f46;",label:"Active"},paused:{color:"background-color: #fef3c7; color: #92400e;",label:"Paused"},archived:{color:"background-color: #fee2e2; color: #991b1b;",label:"Archived"}},B=v[x]||v.draft;return`<span style="padding: 4px 8px; border-radius: 9999px; font-size: 12px; font-weight: 500; ${B.color}">${B.label}</span>`}function h(x){return new Date(x).toLocaleDateString()}function _(){if(t.loading){n();return}r.innerHTML=`
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
                ${t.activeTab==="manage"?T():C()}
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
                        ${t.promoBars.map(v=>`
            <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 16px 24px; white-space: nowrap;">
                    <div>
                        <div style="font-size: 14px; font-weight: 500; color: #111827;">${v.name}</div>
                        <div style="font-size: 14px; color: #6b7280;">${v.title}</div>
                    </div>
                </td>
                <td style="padding: 16px 24px; white-space: nowrap;">${w(v.status)}</td>
                <td style="padding: 16px 24px; white-space: nowrap; font-size: 14px; color: #111827;">${v.priority}</td>
                <td style="padding: 16px 24px; white-space: nowrap; font-size: 14px; color: #6b7280;">${h(v.created_at)}</td>
                <td style="padding: 16px 24px; white-space: nowrap; text-align: right;">
                    <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
                        <button onclick="window.simpleTopBarManager.toggleStatus(${JSON.stringify(v).replace(/"/g,"&quot;")})" style="color: #9ca3af; background: none; border: none; cursor: pointer; padding: 4px;" title="${v.status==="active"?"Pause":"Activate"}">
                            <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${v.status==="active"?"M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21":"M15 12a3 3 0 11-6 0 3 3 0 016 0z"}"></path>
                            </svg>
                        </button>
                        <button onclick="window.simpleTopBarManager.editPromoBar(${JSON.stringify(v).replace(/"/g,"&quot;")})" style="color: #3b82f6; background: none; border: none; cursor: pointer; padding: 4px;" title="Edit">
                            <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </button>
                        <button onclick="window.simpleTopBarManager.deletePromoBar(${v.id})" style="color: #dc2626; background: none; border: none; cursor: pointer; padding: 4px;" title="Delete">
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
        `}function C(){return`
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
        `}window.simpleTopBarManager={init:d,loadPromoBars:c,deletePromoBar:p,toggleStatus:u,createNew:m,editPromoBar:f,switchTab:y}})(),document.addEventListener("DOMContentLoaded",()=>{try{let t=function(i){const a=new URLSearchParams(window.location.search).get("id");console.log("Simple Editor: URL params:",window.location.search),console.log("Simple Editor: Promo bar ID from URL:",a),i.innerHTML=`
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
            `,r(),a&&(console.log("Simple Editor: Loading promo bar data for ID:",a),loadPromoBarData())},r=function(){const i=document.getElementById("promo-countdown-enabled"),o=document.getElementById("promo-countdown-date");i&&i.addEventListener("change",function(){o.style.display=this.checked?"block":"none",h()}),["promo-name","promo-title","promo-cta-text","promo-cta-url"].forEach(N=>{const E=document.getElementById(N);E&&E.addEventListener("input",h)}),["promo-bg-color","promo-text-color","promo-cta-color","promo-font-size","promo-position"].forEach(N=>{const E=document.getElementById(N);E&&E.addEventListener("change",h)});const g=document.getElementById("promo-assignment-type");g&&g.addEventListener("change",d),y(),h()},d=function(){const i=document.getElementById("promo-assignment-type").value,o=document.getElementById("assignment-options"),a=document.getElementById("specific-pages-option"),l=document.getElementById("category-option"),g=document.getElementById("custom-url-option");a.style.display="none",l.style.display="none",g.style.display="none",o.style.display="none",i==="global"?n("global",{value:"All Pages"}):i==="specific"?(o.style.display="block",a.style.display="block"):i==="post_type"?n("post_type",{value:"post"}):i==="category"?(o.style.display="block",l.style.display="block"):i==="custom"&&(o.style.display="block",g.style.display="block")},n=function(i,o){const a={id:Date.now(),assignment_type:i,target_id:o.id||0,target_value:o.value||o.name||"",priority:C.length+1};C.push(a),p()},c=function(i){C=C.filter(o=>o.id!==i),p()},p=function(){const i=document.getElementById("assignments-list");if(i){if(C.length===0){i.innerHTML='<div style="text-align: center; color: #6b7280; font-size: 14px;">No assignments yet</div>';return}i.innerHTML=C.map(o=>`
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: white; border: 1px solid #e5e7eb; border-radius: 4px; margin-bottom: 8px;">
                        <span style="font-size: 14px; color: #374151;">${u(o)}</span>
                        <button onclick="removeAssignment(${o.id})" style="background: none; border: none; color: #dc2626; cursor: pointer; font-size: 16px;">×</button>
                    </div>
                `).join("")}},u=function(i){switch(i.assignment_type){case"global":return"🌐 All Pages";case"page":return`📄 Page: ${i.target_value}`;case"post_type":return`📝 All ${i.target_value}s`;case"category":return`🏷️ Category: ${i.target_value}`;case"tag":return`🏷️ Tag: ${i.target_value}`;case"custom":return`🔗 Custom: ${i.target_value}`;default:return"Unknown Assignment"}},m=function(){const i=document.getElementById("page-search").value;if(!i.trim())return;if(!window.promobarxAdmin||!window.promobarxAdmin.ajaxurl){alert("Admin data not available");return}const o=new FormData;o.append("action","promobarx_get_pages"),o.append("search",i),o.append("nonce",window.promobarxAdmin.nonce),fetch(window.promobarxAdmin.ajaxurl,{method:"POST",body:o}).then(a=>a.json()).then(a=>{a.success?f(a.data):alert("Error searching pages: "+(a.data||"Unknown error"))}).catch(a=>{console.error("Error searching pages:",a),alert("Error searching pages")})},f=function(i){const o=document.getElementById("page-results");if(o){if(i.length===0){o.innerHTML='<div style="text-align: center; color: #6b7280; padding: 20px;">No pages found</div>';return}o.innerHTML=i.map(a=>`
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border: 1px solid #e5e7eb; border-radius: 4px; margin-bottom: 8px; background: white;">
                    <div>
                        <div style="font-weight: 500; color: #111827;">${a.title}</div>
                        <div style="font-size: 12px; color: #6b7280;">${a.type} • ${a.url}</div>
                    </div>
                    <button onclick="addAssignment('page', { id: ${a.id}, value: '${a.title}' })" style="padding: 6px 12px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Add</button>
                </div>
            `).join("")}},y=function(){if(!window.promobarxAdmin||!window.promobarxAdmin.ajaxurl)return;const i=new FormData;i.append("action","promobarx_get_taxonomies"),i.append("taxonomy","category"),i.append("nonce",window.promobarxAdmin.nonce),fetch(window.promobarxAdmin.ajaxurl,{method:"POST",body:i}).then(o=>o.json()).then(o=>{o.success&&w(o.data)}).catch(o=>{console.error("Error loading categories:",o)})},w=function(i){const o=document.getElementById("category-list");o&&(o.innerHTML=i.map(a=>`
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border-bottom: 1px solid #e5e7eb;">
                    <span style="font-size: 14px; color: #374151;">${a.name}</span>
                    <button onclick="addAssignment('category', { id: ${a.id}, value: '${a.name}' })" style="padding: 4px 8px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Add</button>
                </div>
            `).join(""))},h=function(){var $,L,O,U,D,H,F,q,J;const i=document.getElementById("promo-preview");if(!i)return;const o=(($=document.getElementById("promo-title"))==null?void 0:$.value)||"Sample Title",a=((L=document.getElementById("promo-cta-text"))==null?void 0:L.value)||"Shop Now",l=((O=document.getElementById("promo-countdown-enabled"))==null?void 0:O.checked)||!1,g=((U=document.getElementById("promo-close-enabled"))==null?void 0:U.checked)||!1,N=((D=document.getElementById("promo-bg-color"))==null?void 0:D.value)||"#3b82f6",E=((H=document.getElementById("promo-text-color"))==null?void 0:H.value)||"#ffffff",s=((F=document.getElementById("promo-cta-color"))==null?void 0:F.value)||"#ffffff",j=((q=document.getElementById("promo-font-size"))==null?void 0:q.value)||"14px",S=((J=document.getElementById("promo-position"))==null?void 0:J.value)||"top";i.innerHTML=`
                <div style="background: ${N}; color: ${E}; padding: 12px 20px; border-radius: 6px; display: flex; align-items: center; justify-content: space-between; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: ${j};">
                    <div style="display: flex; align-items: center; gap: 20px; flex: 1;">
                        <div>
                            <div style="font-weight: 600;">${o}</div>
                        </div>
                        ${l?'<div style="font-weight: 600; font-family: monospace; font-size: 0.85em;">23:59:59</div>':""}
                        <a href="#" style="background: ${s}; color: ${N}; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-weight: 500; font-size: 0.85em;">${a}</a>
                    </div>
                    ${g?'<button style="background: none; border: none; color: '+E+'; font-size: 18px; cursor: pointer; opacity: 0.7;">×</button>':""}
                </div>
                <div style="margin-top: 10px; font-size: 12px; color: #6b7280; text-align: center;">
                    Position: ${S==="top"?"Top of Page":"Bottom of Page"}
                </div>
            `};document.getElementById("promo-bar-x-topbar-manager")&&window.simpleTopBarManager.init("promo-bar-x-topbar-manager");const T=document.getElementById("promo-bar-x-editor");T&&(window.React&&window.ReactDOM?je(()=>Promise.resolve().then(()=>it),void 0).then(i=>{const o=i.default;window.ReactDOM.render(window.React.createElement(o),T)}).catch(i=>{console.error("Error loading editor:",i),t(T)}):t(T));let C=[];window.searchPages=m,window.addAssignment=n,window.removeAssignment=c,window.addCustomUrlPattern=function(){const i=document.getElementById("custom-url-pattern").value.trim();i?(n("custom",{value:i}),document.getElementById("custom-url-pattern").value=""):alert("Please enter a URL pattern")},window.savePromoBar=function(){var N,E,s,j,S,$,L,O,U,D,H,F,q,J;console.log("Save button clicked");const o=new URLSearchParams(window.location.search).get("id"),a=((N=document.getElementById("promo-title"))==null?void 0:N.value)||"",l=((E=document.getElementById("promo-name"))==null?void 0:E.value)||"";if(!a.trim()){alert("Please enter a title for the promo bar.");return}if(!l.trim()){alert("Please enter a name for the promo bar.");return}const g={name:l,title:a,cta_text:((s=document.getElementById("promo-cta-text"))==null?void 0:s.value)||"",cta_url:((j=document.getElementById("promo-cta-url"))==null?void 0:j.value)||"",countdown_enabled:((S=document.getElementById("promo-countdown-enabled"))==null?void 0:S.checked)||!1,countdown_date:(($=document.getElementById("promo-countdown-date"))==null?void 0:$.value)||"",close_button_enabled:((L=document.getElementById("promo-close-enabled"))==null?void 0:L.checked)||!1,status:((O=document.getElementById("promo-status"))==null?void 0:O.value)||"draft",styling:JSON.stringify({background:((U=document.getElementById("promo-bg-color"))==null?void 0:U.value)||"#3b82f6",color:((D=document.getElementById("promo-text-color"))==null?void 0:D.value)||"#ffffff",font_size:((H=document.getElementById("promo-font-size"))==null?void 0:H.value)||"14px",position:((F=document.getElementById("promo-position"))==null?void 0:F.value)||"top"}),cta_style:JSON.stringify({background:((q=document.getElementById("promo-cta-color"))==null?void 0:q.value)||"#ffffff",color:((J=document.getElementById("promo-bg-color"))==null?void 0:J.value)||"#3b82f6"}),assignments:JSON.stringify(C)};if(o&&(g.id=o),console.log("Data to save:",g),console.log("Admin data:",window.promobarxAdmin),window.promobarxAdmin&&window.promobarxAdmin.ajaxurl){const V=new URLSearchParams;V.append("action","promobarx_save"),V.append("nonce",window.promobarxAdmin.nonce),Object.keys(g).forEach(z=>{V.append(z,g[z])}),console.log("Form data:",V.toString()),fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:V.toString()}).then(z=>(console.log("Response status:",z.status),z.json())).then(z=>{console.log("Save result:",z),z.success?(alert("Promo bar saved successfully!"),window.location.href="admin.php?page=promo-bar-x-topbar-manager"):alert("Error saving promo bar: "+(z.data||"Unknown error"))}).catch(z=>{console.error("Error:",z),alert("Error saving promo bar. Please try again.")})}else console.error("Admin data not available"),alert("Admin data not available. Please refresh the page.")},window.testSave=function(){if(console.log("Test save clicked"),!window.promobarxAdmin||!window.promobarxAdmin.ajaxurl){alert("Admin data not available");return}const i={name:"Test Promo Bar",title:"Test Title",cta_text:"Test Button",cta_url:"https://example.com",status:"draft"},o=new URLSearchParams;o.append("action","promobarx_save"),o.append("nonce",window.promobarxAdmin.nonce),Object.keys(i).forEach(a=>{o.append(a,i[a])}),console.log("Test form data:",o.toString()),fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:o.toString()}).then(a=>(console.log("Test response status:",a.status),a.text())).then(a=>{console.log("Test response text:",a);try{const l=JSON.parse(a);console.log("Test parsed result:",l),l.success?alert("Test save successful! ID: "+l.data.id):alert("Test save failed: "+(l.data||"Unknown error"))}catch(l){console.error("Test JSON parse error:",l),alert("Test response not valid JSON: "+a)}}).catch(a=>{console.error("Test error:",a),alert("Test save error: "+a.message)})},window.loadPromoBarData=function(){const o=new URLSearchParams(window.location.search).get("id");if(!o){alert("No promo bar ID found in the URL.");return}if(console.log("Loading promo bar data for ID:",o),window.promobarxAdmin&&window.promobarxAdmin.ajaxurl){const a=new URLSearchParams;a.append("action","promobarx_get_promo_bar"),a.append("nonce",window.promobarxAdmin.nonce),a.append("id",o),console.log("Form data for loading:",a.toString()),fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:a.toString()}).then(l=>(console.log("Load response status:",l.status),l.json())).then(l=>{if(console.log("Load result:",l),l.success&&l.data){const g=l.data;let N={};if(g.styling)try{N=typeof g.styling=="string"?JSON.parse(g.styling):g.styling}catch(j){console.error("Error parsing styling:",j),N={}}let E={};if(g.cta_style)try{E=typeof g.cta_style=="string"?JSON.parse(g.cta_style):g.cta_style}catch(j){console.error("Error parsing CTA style:",j),E={}}document.getElementById("promo-name").value=g.name||"",document.getElementById("promo-title").value=g.title||"",document.getElementById("promo-cta-text").value=g.cta_text||"",document.getElementById("promo-cta-url").value=g.cta_url||"",document.getElementById("promo-countdown-enabled").checked=!!g.countdown_enabled,document.getElementById("promo-countdown-date").value=g.countdown_date||"",document.getElementById("promo-close-enabled").checked=!!g.close_button_enabled,document.getElementById("promo-status").value=g.status||"draft",document.getElementById("promo-bg-color").value=N.background||"#3b82f6",document.getElementById("promo-text-color").value=N.color||"#ffffff",document.getElementById("promo-font-size").value=N.font_size||"14px",document.getElementById("promo-position").value=N.position||"top",document.getElementById("promo-cta-color").value=E.background||"#ffffff";const s=document.getElementById("promo-countdown-date");if(s&&(s.style.display=g.countdown_enabled?"block":"none"),h(),g.assignments)try{C=typeof g.assignments=="string"?JSON.parse(g.assignments):g.assignments,p()}catch(j){console.error("Error parsing assignments:",j)}console.log("Successfully loaded promo bar data:",g)}else alert("Error loading promo bar data: "+(l.data||"Unknown error"))}).catch(l=>{console.error("Error loading promo bar data:",l),alert("Error loading promo bar data. Please try again.")})}else console.error("Admin data not available for loading"),alert("Admin data not available for loading. Please refresh the page.")},window.testLoadPromoBar=function(){var a,l;const o=new URLSearchParams(window.location.search).get("id");console.log("Test: Current URL params:",window.location.search),console.log("Test: Promo bar ID from URL:",o),console.log("Test: Admin data available:",{promobarxAdmin:window.promobarxAdmin,ajaxurl:(a=window.promobarxAdmin)==null?void 0:a.ajaxurl,nonce:(l=window.promobarxAdmin)==null?void 0:l.nonce}),o?(console.log("Test: Attempting to load promo bar with ID:",o),loadPromoBarData()):(console.log("Test: No promo bar ID found in URL"),alert("No promo bar ID found in URL. Current URL: "+window.location.href))};const x=document.getElementById("promo-bar-x-dashboard");x&&(x.innerHTML=`
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
            `);const v=document.getElementById("promo-bar-x-settings-app");v&&(v.innerHTML=`
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
            `);const B=document.getElementById("promo-bar-x-inquiries");B&&(B.innerHTML=`
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
                `)})}});var ne={exports:{}},G={},re={exports:{}},b={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var M=Symbol.for("react.element"),ke=Symbol.for("react.portal"),_e=Symbol.for("react.fragment"),Ne=Symbol.for("react.strict_mode"),Ce=Symbol.for("react.profiler"),Ee=Symbol.for("react.provider"),Se=Symbol.for("react.context"),Pe=Symbol.for("react.forward_ref"),Ae=Symbol.for("react.suspense"),Te=Symbol.for("react.memo"),Be=Symbol.for("react.lazy"),ae=Symbol.iterator;function $e(t){return t===null||typeof t!="object"?null:(t=ae&&t[ae]||t["@@iterator"],typeof t=="function"?t:null)}var se={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},ie=Object.assign,le={};function I(t,r,d){this.props=t,this.context=r,this.refs=le,this.updater=d||se}I.prototype.isReactComponent={},I.prototype.setState=function(t,r){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,r,"setState")},I.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function de(){}de.prototype=I.prototype;function Q(t,r,d){this.props=t,this.context=r,this.refs=le,this.updater=d||se}var Y=Q.prototype=new de;Y.constructor=Q,ie(Y,I.prototype),Y.isPureReactComponent=!0;var ce=Array.isArray,pe=Object.prototype.hasOwnProperty,K={current:null},ue={key:!0,ref:!0,__self:!0,__source:!0};function me(t,r,d){var n,c={},p=null,u=null;if(r!=null)for(n in r.ref!==void 0&&(u=r.ref),r.key!==void 0&&(p=""+r.key),r)pe.call(r,n)&&!ue.hasOwnProperty(n)&&(c[n]=r[n]);var m=arguments.length-2;if(m===1)c.children=d;else if(1<m){for(var f=Array(m),y=0;y<m;y++)f[y]=arguments[y+2];c.children=f}if(t&&t.defaultProps)for(n in m=t.defaultProps,m)c[n]===void 0&&(c[n]=m[n]);return{$$typeof:M,type:t,key:p,ref:u,props:c,_owner:K.current}}function ze(t,r){return{$$typeof:M,type:t.type,key:r,ref:t.ref,props:t.props,_owner:t._owner}}function ee(t){return typeof t=="object"&&t!==null&&t.$$typeof===M}function Le(t){var r={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(d){return r[d]})}var ge=/\/+/g;function te(t,r){return typeof t=="object"&&t!==null&&t.key!=null?Le(""+t.key):r.toString(36)}function W(t,r,d,n,c){var p=typeof t;(p==="undefined"||p==="boolean")&&(t=null);var u=!1;if(t===null)u=!0;else switch(p){case"string":case"number":u=!0;break;case"object":switch(t.$$typeof){case M:case ke:u=!0}}if(u)return u=t,c=c(u),t=n===""?"."+te(u,0):n,ce(c)?(d="",t!=null&&(d=t.replace(ge,"$&/")+"/"),W(c,r,d,"",function(y){return y})):c!=null&&(ee(c)&&(c=ze(c,d+(!c.key||u&&u.key===c.key?"":(""+c.key).replace(ge,"$&/")+"/")+t)),r.push(c)),1;if(u=0,n=n===""?".":n+":",ce(t))for(var m=0;m<t.length;m++){p=t[m];var f=n+te(p,m);u+=W(p,r,d,f,c)}else if(f=$e(t),typeof f=="function")for(t=f.call(t),m=0;!(p=t.next()).done;)p=p.value,f=n+te(p,m++),u+=W(p,r,d,f,c);else if(p==="object")throw r=String(t),Error("Objects are not valid as a React child (found: "+(r==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":r)+"). If you meant to render a collection of children, use an array instead.");return u}function X(t,r,d){if(t==null)return t;var n=[],c=0;return W(t,n,"","",function(p){return r.call(d,p,c++)}),n}function Ie(t){if(t._status===-1){var r=t._result;r=r(),r.then(function(d){(t._status===0||t._status===-1)&&(t._status=1,t._result=d)},function(d){(t._status===0||t._status===-1)&&(t._status=2,t._result=d)}),t._status===-1&&(t._status=0,t._result=r)}if(t._status===1)return t._result.default;throw t._result}var A={current:null},Z={transition:null},Me={ReactCurrentDispatcher:A,ReactCurrentBatchConfig:Z,ReactCurrentOwner:K};function xe(){throw Error("act(...) is not supported in production builds of React.")}b.Children={map:X,forEach:function(t,r,d){X(t,function(){r.apply(this,arguments)},d)},count:function(t){var r=0;return X(t,function(){r++}),r},toArray:function(t){return X(t,function(r){return r})||[]},only:function(t){if(!ee(t))throw Error("React.Children.only expected to receive a single React element child.");return t}},b.Component=I,b.Fragment=_e,b.Profiler=Ce,b.PureComponent=Q,b.StrictMode=Ne,b.Suspense=Ae,b.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Me,b.act=xe,b.cloneElement=function(t,r,d){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var n=ie({},t.props),c=t.key,p=t.ref,u=t._owner;if(r!=null){if(r.ref!==void 0&&(p=r.ref,u=K.current),r.key!==void 0&&(c=""+r.key),t.type&&t.type.defaultProps)var m=t.type.defaultProps;for(f in r)pe.call(r,f)&&!ue.hasOwnProperty(f)&&(n[f]=r[f]===void 0&&m!==void 0?m[f]:r[f])}var f=arguments.length-2;if(f===1)n.children=d;else if(1<f){m=Array(f);for(var y=0;y<f;y++)m[y]=arguments[y+2];n.children=m}return{$$typeof:M,type:t.type,key:c,ref:p,props:n,_owner:u}},b.createContext=function(t){return t={$$typeof:Se,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:Ee,_context:t},t.Consumer=t},b.createElement=me,b.createFactory=function(t){var r=me.bind(null,t);return r.type=t,r},b.createRef=function(){return{current:null}},b.forwardRef=function(t){return{$$typeof:Pe,render:t}},b.isValidElement=ee,b.lazy=function(t){return{$$typeof:Be,_payload:{_status:-1,_result:t},_init:Ie}},b.memo=function(t,r){return{$$typeof:Te,type:t,compare:r===void 0?null:r}},b.startTransition=function(t){var r=Z.transition;Z.transition={};try{t()}finally{Z.transition=r}},b.unstable_act=xe,b.useCallback=function(t,r){return A.current.useCallback(t,r)},b.useContext=function(t){return A.current.useContext(t)},b.useDebugValue=function(){},b.useDeferredValue=function(t){return A.current.useDeferredValue(t)},b.useEffect=function(t,r){return A.current.useEffect(t,r)},b.useId=function(){return A.current.useId()},b.useImperativeHandle=function(t,r,d){return A.current.useImperativeHandle(t,r,d)},b.useInsertionEffect=function(t,r){return A.current.useInsertionEffect(t,r)},b.useLayoutEffect=function(t,r){return A.current.useLayoutEffect(t,r)},b.useMemo=function(t,r){return A.current.useMemo(t,r)},b.useReducer=function(t,r,d){return A.current.useReducer(t,r,d)},b.useRef=function(t){return A.current.useRef(t)},b.useState=function(t){return A.current.useState(t)},b.useSyncExternalStore=function(t,r,d){return A.current.useSyncExternalStore(t,r,d)},b.useTransition=function(){return A.current.useTransition()},b.version="18.3.1",re.exports=b;var k=re.exports;/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Re=k,Oe=Symbol.for("react.element"),Ue=Symbol.for("react.fragment"),De=Object.prototype.hasOwnProperty,He=Re.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Fe={key:!0,ref:!0,__self:!0,__source:!0};function fe(t,r,d){var n,c={},p=null,u=null;d!==void 0&&(p=""+d),r.key!==void 0&&(p=""+r.key),r.ref!==void 0&&(u=r.ref);for(n in r)De.call(r,n)&&!Fe.hasOwnProperty(n)&&(c[n]=r[n]);if(t&&t.defaultProps)for(n in r=t.defaultProps,r)c[n]===void 0&&(c[n]=r[n]);return{$$typeof:Oe,type:t,key:p,ref:u,props:c,_owner:He.current}}G.Fragment=Ue,G.jsx=fe,G.jsxs=fe,ne.exports=G;var e=ne.exports;/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qe=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),be=(...t)=>t.filter((r,d,n)=>!!r&&r.trim()!==""&&n.indexOf(r)===d).join(" ").trim();/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var Je={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ve=k.forwardRef(({color:t="currentColor",size:r=24,strokeWidth:d=2,absoluteStrokeWidth:n,className:c="",children:p,iconNode:u,...m},f)=>k.createElement("svg",{ref:f,...Je,width:r,height:r,stroke:t,strokeWidth:n?Number(d)*24/Number(r):d,className:be("lucide",c),...m},[...u.map(([y,w])=>k.createElement(y,w)),...Array.isArray(p)?p:[p]]));/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P=(t,r)=>{const d=k.forwardRef(({className:n,...c},p)=>k.createElement(Ve,{ref:p,iconNode:r,className:be(`lucide-${qe(t)}`,n),...c}));return d.displayName=`${t}`,d};/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ge=P("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const We=P("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const he=P("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xe=P("Globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ze=P("Hash",[["line",{x1:"4",x2:"20",y1:"9",y2:"9",key:"4lhtct"}],["line",{x1:"4",x2:"20",y1:"15",y2:"15",key:"vyu0kd"}],["line",{x1:"10",x2:"8",y1:"3",y2:"21",key:"1ggp8o"}],["line",{x1:"16",x2:"14",y1:"3",y2:"21",key:"weycgp"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qe=P("Link",[["path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",key:"1cjeqo"}],["path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",key:"19qd67"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ye=P("MapPin",[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ye=P("MousePointer",[["path",{d:"M12.586 12.586 19 19",key:"ea5xo7"}],["path",{d:"M3.688 3.037a.497.497 0 0 0-.651.651l6.5 15.999a.501.501 0 0 0 .947-.062l1.569-6.083a2 2 0 0 1 1.448-1.479l6.124-1.579a.5.5 0 0 0 .063-.947z",key:"277e5u"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ke=P("Palette",[["circle",{cx:"13.5",cy:"6.5",r:".5",fill:"currentColor",key:"1okk4w"}],["circle",{cx:"17.5",cy:"10.5",r:".5",fill:"currentColor",key:"f64h9f"}],["circle",{cx:"8.5",cy:"7.5",r:".5",fill:"currentColor",key:"fotxhn"}],["circle",{cx:"6.5",cy:"12.5",r:".5",fill:"currentColor",key:"qy21gx"}],["path",{d:"M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z",key:"12rzf8"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const et=P("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ve=P("Save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oe=P("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tt=P("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ot=P("Tag",[["path",{d:"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",key:"vktsd0"}],["circle",{cx:"7.5",cy:"7.5",r:".5",fill:"currentColor",key:"kqv944"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nt=P("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rt=P("Type",[["polyline",{points:"4 7 4 4 20 4 20 7",key:"1nosan"}],["line",{x1:"9",x2:"15",y1:"20",y2:"20",key:"swin9y"}],["line",{x1:"12",x2:"12",y1:"4",y2:"20",key:"1tx1rr"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const we=P("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]),R=({color:t,onChange:r})=>{const[d,n]=k.useState(!1),[c,p]=k.useState(t),u=k.useRef(null),m=["#000000","#ffffff","#dc2626","#ea580c","#d97706","#65a30d","#16a34a","#0d9488","#0891b2","#2563eb","#4F46E5","#7c3aed","#9333ea","#c026d3","#e11d48","#f59e0b","#10b981","#06b6d4","#3b82f6","#8b5cf6","#ec4899","#f97316","#84cc16","#14b8a6"];k.useEffect(()=>{p(t)},[t]),k.useEffect(()=>{const w=h=>{u.current&&!u.current.contains(h.target)&&n(!1)};return document.addEventListener("mousedown",w),()=>{document.removeEventListener("mousedown",w)}},[]);const f=w=>{p(w),r(w),n(!1)},y=w=>{const h=w.target.value;p(h),r(h)};return e.jsxs("div",{className:"relative",ref:u,children:[e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("button",{type:"button",onClick:()=>n(!d),className:"w-10 h-10 rounded border border-gray-300 shadow-sm",style:{backgroundColor:c},title:"Choose color"}),e.jsx("input",{type:"text",value:c,onChange:y,className:"flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"#000000"})]}),d&&e.jsxs("div",{className:"absolute z-10 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg",children:[e.jsx("div",{className:"grid grid-cols-6 gap-2 mb-3",children:m.map(w=>e.jsx("button",{type:"button",onClick:()=>f(w),className:"w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform",style:{backgroundColor:w},title:w},w))}),e.jsx("div",{className:"text-xs text-gray-500 text-center",children:"Click a color to select"})]})]})},at=({promoBar:t,onClose:r,onSave:d})=>{const[n,c]=k.useState([]),[p,u]=k.useState(!0),[m,f]=k.useState(!1),[y,w]=k.useState(""),[h,_]=k.useState([]),[T,C]=k.useState(!1),[x,v]=k.useState("global");k.useEffect(()=>{t&&t.id?B():u(!1)},[t]);const B=async()=>{console.log("Loading assignments for promo bar:",t.id);try{const s=`action=promobarx_get_assignments&promo_bar_id=${t.id}&nonce=${window.promobarxAdmin.nonce}`;console.log("Request body:",s);const S=await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:s})).json();console.log("Assignments response:",S),S.success?c(S.data||[]):console.error("Failed to load assignments:",S)}catch(s){console.error("Error loading assignments:",s)}finally{u(!1)}},i=async(s,j="page")=>{if(console.log("Searching pages with term:",s,"type:",j),!s.trim()){_([]);return}C(!0);try{const S=`action=promobarx_get_pages&search=${encodeURIComponent(s)}&post_type=${j}&nonce=${window.promobarxAdmin.nonce}`;console.log("Request body:",S);const L=await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:S})).json();console.log("Search response:",L),L.success?_(L.data||[]):console.error("Search failed:",L)}catch(S){console.error("Error searching pages:",S)}finally{C(!1)}},o=async(s,j="category")=>{if(!s.trim()){_([]);return}C(!0);try{const $=await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`action=promobarx_get_taxonomies&search=${encodeURIComponent(s)}&taxonomy=${j}&nonce=${window.promobarxAdmin.nonce}`})).json();$.success&&_($.data||[])}catch(S){console.error("Error searching taxonomies:",S)}finally{C(!1)}},a=(s,j={})=>{const S={id:Date.now(),assignment_type:s,target_id:j.id||0,target_value:j.value||j.name||"",priority:n.length+1,...j};c([...n,S])},l=s=>{const j=n.filter((S,$)=>$!==s);c(j)},g=async()=>{if(!t||!t.id){alert("No promo bar selected");return}f(!0);try{const j=await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({action:"promobarx_save_assignments",promo_bar_id:t.id,assignments:JSON.stringify(n),nonce:window.promobarxAdmin.nonce})})).json();j.success?(d(),r()):alert("Error saving assignments: "+j.data)}catch(s){console.error("Error saving assignments:",s),alert("Error saving assignments")}finally{f(!1)}},N=s=>{w(s),x==="pages"?i(s):x==="categories"?o(s,"category"):x==="tags"&&o(s,"post_tag")},E=s=>{switch(s.assignment_type){case"global":return"All Pages";case"page":return`Page: ${s.target_value||"Unknown Page"}`;case"post_type":return`All ${s.target_value||"Posts"}`;case"category":return`Category: ${s.target_value||"Unknown Category"}`;case"tag":return`Tag: ${s.target_value||"Unknown Tag"}`;case"custom":return`Custom: ${s.target_value||"Unknown Pattern"}`;default:return"Unknown Assignment"}};return p?e.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",children:e.jsxs("div",{className:"bg-white rounded-lg p-8 text-center",children:[e.jsx("div",{className:"animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"}),e.jsx("p",{className:"text-gray-600",children:"Loading assignments..."})]})}):e.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",children:e.jsxs("div",{className:"bg-white rounded-lg shadow-xl w-full max-w-4xl h-5/6 flex flex-col",children:[e.jsxs("div",{className:"flex items-center justify-between p-6 border-b border-gray-200",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-xl font-semibold text-gray-900",children:"Page Assignment"}),e.jsx("p",{className:"text-sm text-gray-600",children:"Choose where this promo bar should appear"})]}),e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsxs("button",{onClick:g,disabled:m,className:"px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center",children:[e.jsx(ve,{className:"w-4 h-4 mr-2"}),m?"Saving...":"Save"]}),e.jsx("button",{onClick:r,className:"p-2 text-gray-400 hover:text-gray-600",children:e.jsx(we,{className:"w-5 h-5"})})]})]}),e.jsxs("div",{className:"flex flex-1 overflow-hidden",children:[e.jsxs("div",{className:"w-1/3 border-r border-gray-200 flex flex-col",children:[e.jsxs("div",{className:"p-4 border-b border-gray-200",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-4",children:"Assignment Types"}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("button",{onClick:()=>v("global"),className:`w-full flex items-center p-3 rounded-lg text-left transition-colors ${x==="global"?"bg-blue-50 text-blue-700 border border-blue-200":"hover:bg-gray-50"}`,children:[e.jsx(Xe,{className:"w-5 h-5 mr-3"}),e.jsxs("div",{children:[e.jsx("div",{className:"font-medium",children:"Global"}),e.jsx("div",{className:"text-sm text-gray-500",children:"Show on all pages"})]})]}),e.jsxs("button",{onClick:()=>v("pages"),className:`w-full flex items-center p-3 rounded-lg text-left transition-colors ${x==="pages"?"bg-blue-50 text-blue-700 border border-blue-200":"hover:bg-gray-50"}`,children:[e.jsx(he,{className:"w-5 h-5 mr-3"}),e.jsxs("div",{children:[e.jsx("div",{className:"font-medium",children:"Specific Pages"}),e.jsx("div",{className:"text-sm text-gray-500",children:"Select individual pages"})]})]}),e.jsxs("button",{onClick:()=>v("post_types"),className:`w-full flex items-center p-3 rounded-lg text-left transition-colors ${x==="post_types"?"bg-blue-50 text-blue-700 border border-blue-200":"hover:bg-gray-50"}`,children:[e.jsx(he,{className:"w-5 h-5 mr-3"}),e.jsxs("div",{children:[e.jsx("div",{className:"font-medium",children:"Post Types"}),e.jsx("div",{className:"text-sm text-gray-500",children:"All pages of a type"})]})]}),e.jsxs("button",{onClick:()=>v("categories"),className:`w-full flex items-center p-3 rounded-lg text-left transition-colors ${x==="categories"?"bg-blue-50 text-blue-700 border border-blue-200":"hover:bg-gray-50"}`,children:[e.jsx(ot,{className:"w-5 h-5 mr-3"}),e.jsxs("div",{children:[e.jsx("div",{className:"font-medium",children:"Categories"}),e.jsx("div",{className:"text-sm text-gray-500",children:"Pages in categories"})]})]}),e.jsxs("button",{onClick:()=>v("tags"),className:`w-full flex items-center p-3 rounded-lg text-left transition-colors ${x==="tags"?"bg-blue-50 text-blue-700 border border-blue-200":"hover:bg-gray-50"}`,children:[e.jsx(Ze,{className:"w-5 h-5 mr-3"}),e.jsxs("div",{children:[e.jsx("div",{className:"font-medium",children:"Tags"}),e.jsx("div",{className:"text-sm text-gray-500",children:"Pages with tags"})]})]}),e.jsxs("button",{onClick:()=>v("custom"),className:`w-full flex items-center p-3 rounded-lg text-left transition-colors ${x==="custom"?"bg-blue-50 text-blue-700 border border-blue-200":"hover:bg-gray-50"}`,children:[e.jsx(Qe,{className:"w-5 h-5 mr-3"}),e.jsxs("div",{children:[e.jsx("div",{className:"font-medium",children:"Custom URLs"}),e.jsx("div",{className:"text-sm text-gray-500",children:"URL patterns"})]})]})]})]}),e.jsxs("div",{className:"flex-1 p-4 overflow-y-auto",children:[e.jsx("h4",{className:"font-medium text-gray-900 mb-3",children:"Current Assignments"}),n.length===0?e.jsx("p",{className:"text-gray-500 text-sm",children:"No assignments yet"}):e.jsx("div",{className:"space-y-2",children:n.map((s,j)=>e.jsxs("div",{className:"flex items-center justify-between p-2 bg-gray-50 rounded",children:[e.jsx("span",{className:"text-sm text-gray-700",children:E(s)}),e.jsx("button",{onClick:()=>l(j),className:"text-red-500 hover:text-red-700",children:e.jsx(nt,{className:"w-4 h-4"})})]},s.id||j))})]})]}),e.jsxs("div",{className:"flex-1 p-6 overflow-y-auto",children:[x==="global"&&e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900",children:"Global Assignment"}),e.jsx("p",{className:"text-gray-600",children:"This promo bar will appear on all pages of your website."}),e.jsxs("button",{onClick:()=>a("global"),className:"px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center",children:[e.jsx(et,{className:"w-4 h-4 mr-2"}),"Add Global Assignment"]})]}),x==="pages"&&e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900",children:"Specific Pages"}),e.jsxs("div",{className:"relative",children:[e.jsx("input",{type:"text",placeholder:"Search pages...",value:y,onChange:s=>N(s.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"}),e.jsx(oe,{className:"absolute right-3 top-2.5 w-5 h-5 text-gray-400"})]}),T&&e.jsx("div",{className:"text-center py-4",children:e.jsx("div",{className:"animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"})}),h.length>0&&e.jsx("div",{className:"space-y-2 max-h-64 overflow-y-auto",children:h.map(s=>e.jsxs("button",{onClick:()=>a("page",{id:s.id,value:s.title}),className:"w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50",children:[e.jsx("div",{className:"font-medium",children:s.title}),e.jsxs("div",{className:"text-sm text-gray-500",children:[s.type," • ",s.url]})]},s.id))})]}),x==="post_types"&&e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900",children:"Post Types"}),e.jsx("p",{className:"text-gray-600",children:"Select a post type to show this promo bar on all pages of that type."}),e.jsx("div",{className:"grid grid-cols-2 gap-3",children:["page","post","product"].map(s=>e.jsxs("button",{onClick:()=>a("post_type",{value:s}),className:"p-3 border border-gray-200 rounded-md hover:bg-gray-50 text-left",children:[e.jsxs("div",{className:"font-medium capitalize",children:[s,"s"]}),e.jsxs("div",{className:"text-sm text-gray-500",children:["All ",s," pages"]})]},s))})]}),x==="categories"&&e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900",children:"Categories"}),e.jsxs("div",{className:"relative",children:[e.jsx("input",{type:"text",placeholder:"Search categories...",value:y,onChange:s=>N(s.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"}),e.jsx(oe,{className:"absolute right-3 top-2.5 w-5 h-5 text-gray-400"})]}),h.length>0&&e.jsx("div",{className:"space-y-2 max-h-64 overflow-y-auto",children:h.map(s=>e.jsxs("button",{onClick:()=>a("category",{id:s.id,value:s.name}),className:"w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50",children:[e.jsx("div",{className:"font-medium",children:s.name}),e.jsx("div",{className:"text-sm text-gray-500",children:"Category"})]},s.id))})]}),x==="tags"&&e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900",children:"Tags"}),e.jsxs("div",{className:"relative",children:[e.jsx("input",{type:"text",placeholder:"Search tags...",value:y,onChange:s=>N(s.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"}),e.jsx(oe,{className:"absolute right-3 top-2.5 w-5 h-5 text-gray-400"})]}),h.length>0&&e.jsx("div",{className:"space-y-2 max-h-64 overflow-y-auto",children:h.map(s=>e.jsxs("button",{onClick:()=>a("tag",{id:s.id,value:s.name}),className:"w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50",children:[e.jsx("div",{className:"font-medium",children:s.name}),e.jsx("div",{className:"text-sm text-gray-500",children:"Tag"})]},s.id))})]}),x==="custom"&&e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900",children:"Custom URL Patterns"}),e.jsx("p",{className:"text-gray-600",children:"Enter URL patterns to match specific pages."}),e.jsxs("div",{className:"space-y-3",children:[e.jsx("input",{type:"text",placeholder:"e.g., /shop/*, /blog/2024/*",value:y,onChange:s=>w(s.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"}),e.jsx("button",{onClick:()=>{y.trim()&&(a("custom",{value:y.trim()}),w(""))},className:"px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",children:"Add Custom Pattern"})]})]})]})]})]})})},st=({promoBar:t,onClose:r,onSave:d})=>{const[n,c]=k.useState({name:"",title:"",cta_text:"",cta_url:"",countdown_enabled:!1,countdown_date:"",close_button_enabled:!0,status:"draft",priority:0,template_id:0,styling:{background:"#ffffff",color:"#333333",font_family:"Inter, sans-serif",font_size:"14px",padding:"12px 20px",border_bottom:"1px solid #e5e7eb"},cta_style:{background:"#4F46E5",color:"#ffffff",padding:"8px 16px",border_radius:"4px",font_weight:"500"},countdown_style:{color:"#dc2626",font_weight:"600",font_family:"monospace"},close_button_style:{color:"#6b7280",font_size:"20px",padding:"4px 8px"}}),[p,u]=k.useState("content"),[m,f]=k.useState(!0),[y,w]=k.useState(!1);k.useEffect(()=>{if(t&&typeof t=="object"){console.log("PromoBar data received in editor:",t);let o={};if(t.styling)if(typeof t.styling=="string")try{o=JSON.parse(t.styling)}catch(s){console.error("Error parsing styling JSON:",s),o={}}else o=t.styling;const a={background:o.background||o.backgroundColor||"#ffffff",color:o.color||o.text_color||"#333333",font_family:o.font_family||o.fontFamily||"Inter, sans-serif",font_size:o.font_size||o.fontSize||"14px",padding:o.padding||"12px 20px",border_bottom:o.border_bottom||o.borderBottom||"1px solid #e5e7eb"};let l={};if(t.cta_style)if(typeof t.cta_style=="string")try{l=JSON.parse(t.cta_style)}catch(s){console.error("Error parsing CTA style JSON:",s),l={}}else l=t.cta_style;let g={};if(t.countdown_style)if(typeof t.countdown_style=="string")try{g=JSON.parse(t.countdown_style)}catch(s){console.error("Error parsing countdown style JSON:",s),g={}}else g=t.countdown_style;let N={};if(t.close_button_style)if(typeof t.close_button_style=="string")try{N=JSON.parse(t.close_button_style)}catch(s){console.error("Error parsing close button style JSON:",s),N={}}else N=t.close_button_style;const E={...n,name:t.name||"",title:t.title||"",cta_text:t.cta_text||"",cta_url:t.cta_url||"",countdown_enabled:!!t.countdown_enabled,countdown_date:t.countdown_date||"",close_button_enabled:!!t.close_button_enabled,status:t.status||"draft",priority:parseInt(t.priority)||0,template_id:parseInt(t.template_id)||0,styling:{...n.styling,...a},cta_style:{...n.cta_style,...l},countdown_style:{...n.countdown_style,...g},close_button_style:{...n.close_button_style,...N}};console.log("Updated form data:",E),c(E)}else console.log("No promo bar data provided or invalid data:",t)},[t]);const h=(o,a)=>{c(l=>({...l,[o]:a}))},_=(o,a,l)=>{c(g=>({...g,[o]:{...g[o],[a]:l}}))},T=async()=>{try{if(!window.promobarxAdmin||!window.promobarxAdmin.ajaxurl||!window.promobarxAdmin.nonce){console.error("PromoBarX admin data not available");return}const o={...n,styling:JSON.stringify(n.styling),cta_style:JSON.stringify(n.cta_style),countdown_style:JSON.stringify(n.countdown_style),close_button_style:JSON.stringify(n.close_button_style)},l=await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({action:"promobarx_save",nonce:window.promobarxAdmin.nonce,...o})})).json();l.success?d():alert("Error saving promo bar: "+l.data)}catch(o){console.error("Error saving promo bar:",o),alert("Error saving promo bar")}},C=()=>{const o={background:n.styling.background,color:n.styling.color,fontFamily:n.styling.font_family,fontSize:n.styling.font_size,padding:n.styling.padding,borderBottom:n.styling.border_bottom};return Object.entries(o).filter(([a,l])=>l).map(([a,l])=>`${a.replace(/([A-Z])/g,"-$1").toLowerCase()}: ${l}`).join("; ")},x=()=>{const o={background:n.cta_style.background,color:n.cta_style.color,padding:n.cta_style.padding,borderRadius:n.cta_style.border_radius,fontWeight:n.cta_style.font_weight};return Object.entries(o).filter(([a,l])=>l).map(([a,l])=>`${a.replace(/([A-Z])/g,"-$1").toLowerCase()}: ${l}`).join("; ")},v=()=>{const o={color:n.countdown_style.color,fontWeight:n.countdown_style.font_weight,fontFamily:n.countdown_style.font_family};return Object.entries(o).filter(([a,l])=>l).map(([a,l])=>`${a.replace(/([A-Z])/g,"-$1").toLowerCase()}: ${l}`).join("; ")},B=()=>{const o={color:n.close_button_style.color,fontSize:n.close_button_style.font_size,padding:n.close_button_style.padding};return Object.entries(o).filter(([a,l])=>l).map(([a,l])=>`${a.replace(/([A-Z])/g,"-$1").toLowerCase()}: ${l}`).join("; ")},i=[{id:"content",label:"Content",icon:rt},{id:"styling",label:"Styling",icon:Ke},{id:"cta",label:"CTA Button",icon:Ye},{id:"countdown",label:"Countdown",icon:Ge},{id:"pages",label:"Page Assignment",icon:ye},{id:"settings",label:"Settings",icon:tt}];return!window.promobarxAdmin||!window.promobarxAdmin.ajaxurl||!window.promobarxAdmin.nonce?e.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",children:e.jsxs("div",{className:"bg-white rounded-lg p-8 text-center",children:[e.jsx("div",{className:"animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"}),e.jsx("p",{className:"text-gray-600",children:"Loading PromoBarX admin..."})]})}):e.jsxs("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",children:[e.jsxs("div",{className:"bg-white rounded-lg shadow-xl w-full max-w-7xl h-5/6 flex flex-col",children:[e.jsxs("div",{className:"flex items-center justify-between p-6 border-b border-gray-200",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-xl font-semibold text-gray-900",children:t?"Edit Promo Bar":"Create New Promo Bar"}),e.jsx("p",{className:"text-sm text-gray-600",children:"Design your promotional top bar"})]}),e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsxs("button",{onClick:()=>f(!m),className:`px-3 py-2 rounded-md text-sm font-medium ${m?"bg-blue-100 text-blue-700":"bg-gray-100 text-gray-700"}`,children:[e.jsx(We,{className:"w-4 h-4 inline mr-1"}),"Preview"]}),e.jsxs("button",{onClick:T,className:"px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors",children:[e.jsx(ve,{className:"w-4 h-4 inline mr-2"}),"Save"]}),e.jsx("button",{onClick:r,className:"p-2 text-gray-400 hover:text-gray-600",children:e.jsx(we,{className:"w-5 h-5"})})]})]}),e.jsxs("div",{className:"flex flex-1 overflow-hidden",children:[e.jsxs("div",{className:"w-1/2 border-r border-gray-200 flex flex-col",children:[e.jsx("div",{className:"border-b border-gray-200",children:e.jsx("nav",{className:"flex space-x-8 px-6",children:i.map(o=>e.jsxs("button",{onClick:()=>u(o.id),className:`py-3 px-1 border-b-2 font-medium text-sm ${p===o.id?"border-blue-500 text-blue-600":"border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`,children:[e.jsx(o.icon,{className:"w-4 h-4 inline mr-2"}),o.label]},o.id))})}),e.jsxs("div",{className:"flex-1 overflow-y-auto p-6",children:[p==="content"&&e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Promo Bar Name"}),e.jsx("input",{type:"text",value:n.name,onChange:o=>h("name",o.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"Enter promo bar name"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Title"}),e.jsx("input",{type:"text",value:n.title,onChange:o=>h("title",o.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"Enter main title"})]}),e.jsxs("div",{className:"flex space-x-4",children:[e.jsxs("div",{className:"flex-1",children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"CTA Text"}),e.jsx("input",{type:"text",value:n.cta_text,onChange:o=>h("cta_text",o.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"Shop Now"})]}),e.jsxs("div",{className:"flex-1",children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"CTA URL"}),e.jsx("input",{type:"url",value:n.cta_url,onChange:o=>h("cta_url",o.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"https://example.com"})]})]}),e.jsx("div",{className:"flex items-center space-x-4",children:e.jsxs("label",{className:"flex items-center",children:[e.jsx("input",{type:"checkbox",checked:n.countdown_enabled,onChange:o=>h("countdown_enabled",o.target.checked),className:"rounded border-gray-300 text-blue-600 focus:ring-blue-500"}),e.jsx("span",{className:"ml-2 text-sm text-gray-700",children:"Enable Countdown Timer"})]})}),n.countdown_enabled&&e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Countdown End Date"}),e.jsx("input",{type:"datetime-local",value:n.countdown_date,onChange:o=>h("countdown_date",o.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"})]}),e.jsx("div",{className:"flex items-center space-x-4",children:e.jsxs("label",{className:"flex items-center",children:[e.jsx("input",{type:"checkbox",checked:n.close_button_enabled,onChange:o=>h("close_button_enabled",o.target.checked),className:"rounded border-gray-300 text-blue-600 focus:ring-blue-500"}),e.jsx("span",{className:"ml-2 text-sm text-gray-700",children:"Show Close Button"})]})})]}),p==="styling"&&e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Background Color"}),e.jsx(R,{color:n.styling.background,onChange:o=>_("styling","background",o)})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Text Color"}),e.jsx(R,{color:n.styling.color,onChange:o=>_("styling","color",o)})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Font Family"}),e.jsxs("select",{value:n.styling.font_family,onChange:o=>_("styling","font_family",o.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",children:[e.jsx("option",{value:"Inter, sans-serif",children:"Inter"}),e.jsx("option",{value:"Arial, sans-serif",children:"Arial"}),e.jsx("option",{value:"Helvetica, sans-serif",children:"Helvetica"}),e.jsx("option",{value:"Georgia, serif",children:"Georgia"}),e.jsx("option",{value:"Times New Roman, serif",children:"Times New Roman"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Font Size"}),e.jsx("input",{type:"text",value:n.styling.font_size,onChange:o=>_("styling","font_size",o.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"14px"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Padding"}),e.jsx("input",{type:"text",value:n.styling.padding,onChange:o=>_("styling","padding",o.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"12px 20px"})]})]}),p==="cta"&&e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Button Background Color"}),e.jsx(R,{color:n.cta_style.background,onChange:o=>_("cta_style","background",o)})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Button Text Color"}),e.jsx(R,{color:n.cta_style.color,onChange:o=>_("cta_style","color",o)})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Button Padding"}),e.jsx("input",{type:"text",value:n.cta_style.padding,onChange:o=>_("cta_style","padding",o.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"8px 16px"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Border Radius"}),e.jsx("input",{type:"text",value:n.cta_style.border_radius,onChange:o=>_("cta_style","border_radius",o.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"4px"})]})]}),p==="countdown"&&e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Countdown Color"}),e.jsx(R,{color:n.countdown_style.color,onChange:o=>_("countdown_style","color",o)})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Font Weight"}),e.jsxs("select",{value:n.countdown_style.font_weight,onChange:o=>_("countdown_style","font_weight",o.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",children:[e.jsx("option",{value:"400",children:"Normal"}),e.jsx("option",{value:"500",children:"Medium"}),e.jsx("option",{value:"600",children:"Semi Bold"}),e.jsx("option",{value:"700",children:"Bold"})]})]})]}),p==="pages"&&e.jsx("div",{className:"space-y-6",children:e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-4",children:"Page Assignment"}),e.jsx("p",{className:"text-gray-600 mb-4",children:"Choose which pages this promo bar should appear on. You can assign it globally, to specific pages, post types, categories, or custom URL patterns."}),e.jsxs("button",{onClick:()=>w(!0),className:"px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center",children:[e.jsx(ye,{className:"w-4 h-4 mr-2"}),"Manage Page Assignments"]})]})}),p==="settings"&&e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Status"}),e.jsxs("select",{value:n.status,onChange:o=>h("status",o.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",children:[e.jsx("option",{value:"draft",children:"Draft"}),e.jsx("option",{value:"active",children:"Active"}),e.jsx("option",{value:"paused",children:"Paused"}),e.jsx("option",{value:"archived",children:"Archived"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Priority"}),e.jsx("input",{type:"number",value:n.priority,onChange:o=>h("priority",parseInt(o.target.value)),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",min:"0",max:"100"}),e.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"Higher priority promo bars will be shown first"})]})]})]})]}),m&&e.jsxs("div",{className:"w-1/2 bg-gray-50 p-6",children:[e.jsxs("div",{className:"mb-4",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-2",children:"Live Preview"}),e.jsx("p",{className:"text-sm text-gray-600",children:"See how your promo bar will look on the frontend"})]}),e.jsx("div",{className:"bg-white rounded-lg shadow-lg overflow-hidden",children:e.jsxs("div",{className:"promobarx-preview",style:C(),children:[e.jsxs("div",{className:"flex items-center justify-center gap-4 p-4",children:[n.title&&e.jsx("div",{className:"font-semibold",children:n.title}),n.countdown_enabled&&n.countdown_date&&e.jsx("div",{className:"font-mono font-semibold",style:v(),children:"00d 00h 00m 00s"}),n.cta_text&&e.jsx("a",{href:"#",className:"inline-block px-4 py-2 rounded text-decoration-none font-medium transition-transform hover:transform hover:-translate-y-0.5",style:x(),children:n.cta_text})]}),n.close_button_enabled&&e.jsx("button",{className:"absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors",style:B(),children:"×"})]})})]})]})]}),y&&e.jsx(at,{promoBar:t,onClose:()=>w(!1),onSave:()=>{w(!1)}})]})};git;const it=Object.freeze(Object.defineProperty({__proto__:null,default:()=>{const[t,r]=k.useState(null),[d,n]=k.useState(!0),[c,p]=k.useState(null);k.useEffect(()=>{console.log("EditorPage: Component mounted"),u()},[]);const u=async()=>{var y,w;try{console.log("EditorPage: Loading promo bar data...");const _=new URLSearchParams(window.location.search).get("id");if(console.log("EditorPage: URL params:",window.location.search),console.log("EditorPage: Promo bar ID from URL:",_),console.log("EditorPage: Admin data available:",{promobarxAdmin:window.promobarxAdmin,ajaxurl:(y=window.promobarxAdmin)==null?void 0:y.ajaxurl,nonce:(w=window.promobarxAdmin)==null?void 0:w.nonce}),_&&window.promobarxAdmin&&window.promobarxAdmin.ajaxurl){console.log("EditorPage: Fetching promo bar with ID:",_);const T=await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`action=promobarx_get_promo_bar&id=${_}&nonce=${window.promobarxAdmin.nonce}`});console.log("EditorPage: Response status:",T.status);const C=await T.json();console.log("EditorPage: Response data:",C),C.success?(console.log("EditorPage: Successfully loaded promo bar:",C.data),r(C.data)):(console.error("EditorPage: Failed to load promo bar data:",C.data),p("Failed to load promo bar data: "+(C.data||"Unknown error")))}else console.log("EditorPage: No promo bar ID provided or admin data not available, creating new promo bar"),r(null)}catch(h){console.error("EditorPage: Error loading promo bar:",h),p("Error loading promo bar data: "+h.message)}finally{n(!1)}},m=async y=>{try{console.log("EditorPage: Save completed, redirecting to manager"),window.location.href="admin.php?page=promo-bar-x-topbar-manager"}catch(w){console.error("EditorPage: Error after save:",w)}},f=()=>{console.log("EditorPage: Close clicked, redirecting to manager"),window.location.href="admin.php?page=promo-bar-x-topbar-manager"};return d?e.jsx("div",{className:"flex items-center justify-center min-h-screen",children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"}),e.jsx("p",{className:"text-gray-600",children:"Loading editor..."})]})}):c?e.jsx("div",{className:"flex items-center justify-center min-h-screen",children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"text-red-600 mb-4",children:e.jsx("svg",{className:"w-12 h-12 mx-auto",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"})})}),e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-2",children:"Error"}),e.jsx("p",{className:"text-gray-600 mb-4",children:c}),e.jsx("button",{onClick:f,className:"px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors",children:"Back to Manager"})]})}):(console.log("EditorPage: Rendering TopBarEditor with promo bar:",t),e.jsx("div",{className:"min-h-screen bg-gray-50",children:e.jsx(st,{promoBar:t,onSave:m,onClose:f})}))}},Symbol.toStringTag,{value:"Module"}))})();
//# sourceMappingURL=chat-admin.js.map
