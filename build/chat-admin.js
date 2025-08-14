(function(){"use strict";const Fe="modulepreload",He=function(e){return"/"+e},Je={},le=function(o,i,r){let l=Promise.resolve();function d(p){const u=new Event("vite:preloadError",{cancelable:!0});if(u.payload=p,window.dispatchEvent(u),!u.defaultPrevented)throw p}return l.then(p=>{for(const u of p||[])u.status==="rejected"&&d(u.reason);return o().catch(d)})};(function(){let e={promoBars:[],loading:!0,activeTab:"manage"},o=null;function i(y){if(o=document.getElementById(y),!o){console.error("Container not found:",y);return}r(),window.promobarxAdmin&&window.promobarxAdmin.ajaxurl&&window.promobarxAdmin.nonce?l():(console.log("Admin data not available"),e.loading=!1,m())}function r(){o.innerHTML=`
            <div style="display: flex; align-items: center; justify-content: center; height: 256px;">
                <div style="width: 32px; height: 32px; border: 2px solid #e5e7eb; border-top: 2px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `}async function l(){try{const b=await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"action=promobarx_get_promo_bars&nonce="+window.promobarxAdmin.nonce})).json();b.success&&(e.promoBars=b.data)}catch(y){console.error("Error loading promo bars:",y)}finally{e.loading=!1,m()}}async function d(y){if(confirm("Are you sure you want to delete this promo bar?"))try{(await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`action=promobarx_delete&id=${y}&nonce=${window.promobarxAdmin.nonce}`})).json()).success&&await l()}catch(b){console.error("Error deleting promo bar:",b)}}async function p(y){const b=y.status==="active"?"paused":"active";try{(await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`action=promobarx_save&id=${y.id}&status=${b}&nonce=${window.promobarxAdmin.nonce}`})).json()).success&&await l()}catch(n){console.error("Error updating status:",n)}}function u(){window.location.href="admin.php?page=promo-bar-x-editor"}function c(y){window.location.href=`admin.php?page=promo-bar-x-editor&id=${y.id}`}function s(y){e.activeTab=y,m()}function a(y){const b={draft:{color:"background-color: #f3f4f6; color: #374151;",label:"Draft"},active:{color:"background-color: #d1fae5; color: #065f46;",label:"Active"},paused:{color:"background-color: #fef3c7; color: #92400e;",label:"Paused"},archived:{color:"background-color: #fee2e2; color: #991b1b;",label:"Archived"}},n=b[y]||b.draft;return`<span style="padding: 4px 8px; border-radius: 9999px; font-size: 12px; font-weight: 500; ${n.color}">${n.label}</span>`}function g(y){return new Date(y).toLocaleDateString()}function m(){if(e.loading){r();return}o.innerHTML=`
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
                        <button onclick="window.simpleTopBarManager.switchTab('manage')" style="padding: 8px 4px; border-bottom: 2px solid ${e.activeTab==="manage"?"#3b82f6":"transparent"}; color: ${e.activeTab==="manage"?"#3b82f6":"#6b7280"}; background: none; border-top: none; border-left: none; border-right: none; font-weight: 500; font-size: 14px; cursor: pointer;">
                            <svg style="width: 16px; height: 16px; display: inline; margin-right: 8px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            Manage Promo Bars
                        </button>
                        <button onclick="window.simpleTopBarManager.switchTab('templates')" style="padding: 8px 4px; border-bottom: 2px solid ${e.activeTab==="templates"?"#3b82f6":"transparent"}; color: ${e.activeTab==="templates"?"#3b82f6":"#6b7280"}; background: none; border-top: none; border-left: none; border-right: none; font-weight: 500; font-size: 14px; cursor: pointer;">
                            <svg style="width: 16px; height: 16px; display: inline; margin-right: 8px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                            Quick Templates
                        </button>
                    </nav>
                </div>

                <!-- Tab Content -->
                ${e.activeTab==="manage"?h():v()}
            </div>
        `}function h(){return e.promoBars.length===0?`
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
                        ${e.promoBars.map(b=>`
            <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 16px 24px; white-space: nowrap;">
                    <div>
                        <div style="font-size: 14px; font-weight: 500; color: #111827;">${b.name}</div>
                        <div style="font-size: 14px; color: #6b7280;">${b.title}</div>
                    </div>
                </td>
                <td style="padding: 16px 24px; white-space: nowrap;">${a(b.status)}</td>
                <td style="padding: 16px 24px; white-space: nowrap; font-size: 14px; color: #111827;">${b.priority}</td>
                <td style="padding: 16px 24px; white-space: nowrap; font-size: 14px; color: #6b7280;">${g(b.created_at)}</td>
                <td style="padding: 16px 24px; white-space: nowrap; text-align: right;">
                    <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
                        <button onclick="window.simpleTopBarManager.toggleStatus(${JSON.stringify(b).replace(/"/g,"&quot;")})" style="color: #9ca3af; background: none; border: none; cursor: pointer; padding: 4px;" title="${b.status==="active"?"Pause":"Activate"}">
                            <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${b.status==="active"?"M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21":"M15 12a3 3 0 11-6 0 3 3 0 016 0z"}"></path>
                            </svg>
                        </button>
                        <button onclick="window.simpleTopBarManager.editPromoBar(${JSON.stringify(b).replace(/"/g,"&quot;")})" style="color: #3b82f6; background: none; border: none; cursor: pointer; padding: 4px;" title="Edit">
                            <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </button>
                        <button onclick="window.simpleTopBarManager.deletePromoBar(${b.id})" style="color: #dc2626; background: none; border: none; cursor: pointer; padding: 4px;" title="Delete">
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
        `}function v(){return`
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
        `}window.simpleTopBarManager={init:i,loadPromoBars:l,deletePromoBar:d,toggleStatus:p,createNew:u,editPromoBar:c,switchTab:s}})(),document.addEventListener("DOMContentLoaded",()=>{try{let e=function(c){const a=new URLSearchParams(window.location.search).get("id");console.log("Simple Editor: URL params:",window.location.search),console.log("Simple Editor: Promo bar ID from URL:",a),c.innerHTML=`
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
                        </div>
                    </div>
                </div>
            `,o(),a&&(console.log("Simple Editor: Loading promo bar data for ID:",a),loadPromoBarData())},o=function(){const c=document.getElementById("promo-countdown-enabled"),s=document.getElementById("promo-countdown-date");c&&c.addEventListener("change",function(){s.style.display=this.checked?"block":"none",i()}),["promo-name","promo-title","promo-cta-text","promo-cta-url"].forEach(m=>{const h=document.getElementById(m);h&&h.addEventListener("input",i)}),["promo-bg-color","promo-text-color","promo-cta-color","promo-font-size","promo-position"].forEach(m=>{const h=document.getElementById(m);h&&h.addEventListener("change",i)}),i()},i=function(){var w,x,j,N,P,E,I,z,L;const c=document.getElementById("promo-preview");if(!c)return;const s=((w=document.getElementById("promo-title"))==null?void 0:w.value)||"Sample Title",a=((x=document.getElementById("promo-cta-text"))==null?void 0:x.value)||"Shop Now",g=((j=document.getElementById("promo-countdown-enabled"))==null?void 0:j.checked)||!1,m=((N=document.getElementById("promo-close-enabled"))==null?void 0:N.checked)||!1,h=((P=document.getElementById("promo-bg-color"))==null?void 0:P.value)||"#3b82f6",v=((E=document.getElementById("promo-text-color"))==null?void 0:E.value)||"#ffffff",y=((I=document.getElementById("promo-cta-color"))==null?void 0:I.value)||"#ffffff",b=((z=document.getElementById("promo-font-size"))==null?void 0:z.value)||"14px",n=((L=document.getElementById("promo-position"))==null?void 0:L.value)||"top";c.innerHTML=`
                <div style="background: ${h}; color: ${v}; padding: 12px 20px; border-radius: 6px; display: flex; align-items: center; justify-content: space-between; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: ${b};">
                    <div style="display: flex; align-items: center; gap: 20px; flex: 1;">
                        <div>
                            <div style="font-weight: 600;">${s}</div>
                        </div>
                        ${g?'<div style="font-weight: 600; font-family: monospace; font-size: 0.85em;">23:59:59</div>':""}
                        <a href="#" style="background: ${y}; color: ${h}; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-weight: 500; font-size: 0.85em;">${a}</a>
                    </div>
                    ${m?'<button style="background: none; border: none; color: '+v+'; font-size: 18px; cursor: pointer; opacity: 0.7;">×</button>':""}
                </div>
                <div style="margin-top: 10px; font-size: 12px; color: #6b7280; text-align: center;">
                    Position: ${n==="top"?"Top of Page":"Bottom of Page"}
                </div>
            `};document.getElementById("promo-bar-x-topbar-manager")&&window.simpleTopBarManager.init("promo-bar-x-topbar-manager");const l=document.getElementById("promo-bar-x-editor");l&&(window.React&&window.ReactDOM?le(()=>Promise.resolve().then(()=>Ue),void 0).then(c=>{const s=c.default;window.ReactDOM.render(window.React.createElement(s),l)}).catch(c=>{console.error("Error loading editor:",c),e(l)}):e(l)),window.savePromoBar=function(){var h,v,y,b,n,w,x,j,N,P,E,I,z,L;console.log("Save button clicked");const s=new URLSearchParams(window.location.search).get("id"),a=((h=document.getElementById("promo-title"))==null?void 0:h.value)||"",g=((v=document.getElementById("promo-name"))==null?void 0:v.value)||"";if(!a.trim()){alert("Please enter a title for the promo bar.");return}if(!g.trim()){alert("Please enter a name for the promo bar.");return}const m={name:g,title:a,cta_text:((y=document.getElementById("promo-cta-text"))==null?void 0:y.value)||"",cta_url:((b=document.getElementById("promo-cta-url"))==null?void 0:b.value)||"",countdown_enabled:((n=document.getElementById("promo-countdown-enabled"))==null?void 0:n.checked)||!1,countdown_date:((w=document.getElementById("promo-countdown-date"))==null?void 0:w.value)||"",close_button_enabled:((x=document.getElementById("promo-close-enabled"))==null?void 0:x.checked)||!1,status:((j=document.getElementById("promo-status"))==null?void 0:j.value)||"draft",styling:JSON.stringify({background:((N=document.getElementById("promo-bg-color"))==null?void 0:N.value)||"#3b82f6",color:((P=document.getElementById("promo-text-color"))==null?void 0:P.value)||"#ffffff",font_size:((E=document.getElementById("promo-font-size"))==null?void 0:E.value)||"14px",position:((I=document.getElementById("promo-position"))==null?void 0:I.value)||"top"}),cta_style:JSON.stringify({background:((z=document.getElementById("promo-cta-color"))==null?void 0:z.value)||"#ffffff",color:((L=document.getElementById("promo-bg-color"))==null?void 0:L.value)||"#3b82f6"})};if(s&&(m.id=s),console.log("Data to save:",m),console.log("Admin data:",window.promobarxAdmin),window.promobarxAdmin&&window.promobarxAdmin.ajaxurl){const $=new URLSearchParams;$.append("action","promobarx_save"),$.append("nonce",window.promobarxAdmin.nonce),Object.keys(m).forEach(C=>{$.append(C,m[C])}),console.log("Form data:",$.toString()),fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:$.toString()}).then(C=>(console.log("Response status:",C.status),C.json())).then(C=>{console.log("Save result:",C),C.success?(alert("Promo bar saved successfully!"),window.location.href="admin.php?page=promo-bar-x-topbar-manager"):alert("Error saving promo bar: "+(C.data||"Unknown error"))}).catch(C=>{console.error("Error:",C),alert("Error saving promo bar. Please try again.")})}else console.error("Admin data not available"),alert("Admin data not available. Please refresh the page.")},window.testSave=function(){if(console.log("Test save clicked"),!window.promobarxAdmin||!window.promobarxAdmin.ajaxurl){alert("Admin data not available");return}const c={name:"Test Promo Bar",title:"Test Title",cta_text:"Test Button",cta_url:"https://example.com",status:"draft"},s=new URLSearchParams;s.append("action","promobarx_save"),s.append("nonce",window.promobarxAdmin.nonce),Object.keys(c).forEach(a=>{s.append(a,c[a])}),console.log("Test form data:",s.toString()),fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:s.toString()}).then(a=>(console.log("Test response status:",a.status),a.text())).then(a=>{console.log("Test response text:",a);try{const g=JSON.parse(a);console.log("Test parsed result:",g),g.success?alert("Test save successful! ID: "+g.data.id):alert("Test save failed: "+(g.data||"Unknown error"))}catch(g){console.error("Test JSON parse error:",g),alert("Test response not valid JSON: "+a)}}).catch(a=>{console.error("Test error:",a),alert("Test save error: "+a.message)})},window.loadPromoBarData=function(){const s=new URLSearchParams(window.location.search).get("id");if(!s){alert("No promo bar ID found in the URL.");return}if(console.log("Loading promo bar data for ID:",s),window.promobarxAdmin&&window.promobarxAdmin.ajaxurl){const a=new URLSearchParams;a.append("action","promobarx_get_promo_bar"),a.append("nonce",window.promobarxAdmin.nonce),a.append("id",s),console.log("Form data for loading:",a.toString()),fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:a.toString()}).then(g=>(console.log("Load response status:",g.status),g.json())).then(g=>{if(console.log("Load result:",g),g.success&&g.data){const m=g.data;let h={};if(m.styling)try{h=typeof m.styling=="string"?JSON.parse(m.styling):m.styling}catch(b){console.error("Error parsing styling:",b),h={}}let v={};if(m.cta_style)try{v=typeof m.cta_style=="string"?JSON.parse(m.cta_style):m.cta_style}catch(b){console.error("Error parsing CTA style:",b),v={}}document.getElementById("promo-name").value=m.name||"",document.getElementById("promo-title").value=m.title||"",document.getElementById("promo-cta-text").value=m.cta_text||"",document.getElementById("promo-cta-url").value=m.cta_url||"",document.getElementById("promo-countdown-enabled").checked=!!m.countdown_enabled,document.getElementById("promo-countdown-date").value=m.countdown_date||"",document.getElementById("promo-close-enabled").checked=!!m.close_button_enabled,document.getElementById("promo-status").value=m.status||"draft",document.getElementById("promo-bg-color").value=h.background||"#3b82f6",document.getElementById("promo-text-color").value=h.color||"#ffffff",document.getElementById("promo-font-size").value=h.font_size||"14px",document.getElementById("promo-position").value=h.position||"top",document.getElementById("promo-cta-color").value=v.background||"#ffffff";const y=document.getElementById("promo-countdown-date");y&&(y.style.display=m.countdown_enabled?"block":"none"),i(),console.log("Successfully loaded promo bar data:",m)}else alert("Error loading promo bar data: "+(g.data||"Unknown error"))}).catch(g=>{console.error("Error loading promo bar data:",g),alert("Error loading promo bar data. Please try again.")})}else console.error("Admin data not available for loading"),alert("Admin data not available for loading. Please refresh the page.")},window.testLoadPromoBar=function(){var a,g;const s=new URLSearchParams(window.location.search).get("id");console.log("Test: Current URL params:",window.location.search),console.log("Test: Promo bar ID from URL:",s),console.log("Test: Admin data available:",{promobarxAdmin:window.promobarxAdmin,ajaxurl:(a=window.promobarxAdmin)==null?void 0:a.ajaxurl,nonce:(g=window.promobarxAdmin)==null?void 0:g.nonce}),s?(console.log("Test: Attempting to load promo bar with ID:",s),loadPromoBarData()):(console.log("Test: No promo bar ID found in URL"),alert("No promo bar ID found in URL. Current URL: "+window.location.href))};const d=document.getElementById("promo-bar-x-dashboard");d&&(d.innerHTML=`
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
            `);const p=document.getElementById("promo-bar-x-settings-app");p&&(p.innerHTML=`
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
            `);const u=document.getElementById("promo-bar-x-inquiries");u&&(u.innerHTML=`
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
            `)}catch(e){console.error("Error initializing PromoBarX components:",e),document.querySelectorAll('[id*="promo-bar-x"]').forEach(i=>{i.innerHTML===""&&(i.innerHTML=`
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
                `)})}});var V={exports:{}},M={},W={exports:{}},f={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var T=Symbol.for("react.element"),se=Symbol.for("react.portal"),de=Symbol.for("react.fragment"),ce=Symbol.for("react.strict_mode"),pe=Symbol.for("react.profiler"),ue=Symbol.for("react.provider"),me=Symbol.for("react.context"),ge=Symbol.for("react.forward_ref"),fe=Symbol.for("react.suspense"),xe=Symbol.for("react.memo"),be=Symbol.for("react.lazy"),X=Symbol.iterator;function ye(e){return e===null||typeof e!="object"?null:(e=X&&e[X]||e["@@iterator"],typeof e=="function"?e:null)}var Z={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},G=Object.assign,Q={};function B(e,o,i){this.props=e,this.context=o,this.refs=Q,this.updater=i||Z}B.prototype.isReactComponent={},B.prototype.setState=function(e,o){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,o,"setState")},B.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function K(){}K.prototype=B.prototype;function U(e,o,i){this.props=e,this.context=o,this.refs=Q,this.updater=i||Z}var F=U.prototype=new K;F.constructor=U,G(F,B.prototype),F.isPureReactComponent=!0;var Y=Array.isArray,ee=Object.prototype.hasOwnProperty,H={current:null},te={key:!0,ref:!0,__self:!0,__source:!0};function oe(e,o,i){var r,l={},d=null,p=null;if(o!=null)for(r in o.ref!==void 0&&(p=o.ref),o.key!==void 0&&(d=""+o.key),o)ee.call(o,r)&&!te.hasOwnProperty(r)&&(l[r]=o[r]);var u=arguments.length-2;if(u===1)l.children=i;else if(1<u){for(var c=Array(u),s=0;s<u;s++)c[s]=arguments[s+2];l.children=c}if(e&&e.defaultProps)for(r in u=e.defaultProps,u)l[r]===void 0&&(l[r]=u[r]);return{$$typeof:T,type:e,key:d,ref:p,props:l,_owner:H.current}}function he(e,o){return{$$typeof:T,type:e.type,key:o,ref:e.ref,props:e.props,_owner:e._owner}}function J(e){return typeof e=="object"&&e!==null&&e.$$typeof===T}function we(e){var o={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(i){return o[i]})}var re=/\/+/g;function q(e,o){return typeof e=="object"&&e!==null&&e.key!=null?we(""+e.key):o.toString(36)}function R(e,o,i,r,l){var d=typeof e;(d==="undefined"||d==="boolean")&&(e=null);var p=!1;if(e===null)p=!0;else switch(d){case"string":case"number":p=!0;break;case"object":switch(e.$$typeof){case T:case se:p=!0}}if(p)return p=e,l=l(p),e=r===""?"."+q(p,0):r,Y(l)?(i="",e!=null&&(i=e.replace(re,"$&/")+"/"),R(l,o,i,"",function(s){return s})):l!=null&&(J(l)&&(l=he(l,i+(!l.key||p&&p.key===l.key?"":(""+l.key).replace(re,"$&/")+"/")+e)),o.push(l)),1;if(p=0,r=r===""?".":r+":",Y(e))for(var u=0;u<e.length;u++){d=e[u];var c=r+q(d,u);p+=R(d,o,i,c,l)}else if(c=ye(e),typeof c=="function")for(e=c.call(e),u=0;!(d=e.next()).done;)d=d.value,c=r+q(d,u++),p+=R(d,o,i,c,l);else if(d==="object")throw o=String(e),Error("Objects are not valid as a React child (found: "+(o==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":o)+"). If you meant to render a collection of children, use an array instead.");return p}function O(e,o,i){if(e==null)return e;var r=[],l=0;return R(e,r,"","",function(d){return o.call(i,d,l++)}),r}function ve(e){if(e._status===-1){var o=e._result;o=o(),o.then(function(i){(e._status===0||e._status===-1)&&(e._status=1,e._result=i)},function(i){(e._status===0||e._status===-1)&&(e._status=2,e._result=i)}),e._status===-1&&(e._status=0,e._result=o)}if(e._status===1)return e._result.default;throw e._result}var _={current:null},D={transition:null},ke={ReactCurrentDispatcher:_,ReactCurrentBatchConfig:D,ReactCurrentOwner:H};function ne(){throw Error("act(...) is not supported in production builds of React.")}f.Children={map:O,forEach:function(e,o,i){O(e,function(){o.apply(this,arguments)},i)},count:function(e){var o=0;return O(e,function(){o++}),o},toArray:function(e){return O(e,function(o){return o})||[]},only:function(e){if(!J(e))throw Error("React.Children.only expected to receive a single React element child.");return e}},f.Component=B,f.Fragment=de,f.Profiler=pe,f.PureComponent=U,f.StrictMode=ce,f.Suspense=fe,f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=ke,f.act=ne,f.cloneElement=function(e,o,i){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var r=G({},e.props),l=e.key,d=e.ref,p=e._owner;if(o!=null){if(o.ref!==void 0&&(d=o.ref,p=H.current),o.key!==void 0&&(l=""+o.key),e.type&&e.type.defaultProps)var u=e.type.defaultProps;for(c in o)ee.call(o,c)&&!te.hasOwnProperty(c)&&(r[c]=o[c]===void 0&&u!==void 0?u[c]:o[c])}var c=arguments.length-2;if(c===1)r.children=i;else if(1<c){u=Array(c);for(var s=0;s<c;s++)u[s]=arguments[s+2];r.children=u}return{$$typeof:T,type:e.type,key:l,ref:d,props:r,_owner:p}},f.createContext=function(e){return e={$$typeof:me,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:ue,_context:e},e.Consumer=e},f.createElement=oe,f.createFactory=function(e){var o=oe.bind(null,e);return o.type=e,o},f.createRef=function(){return{current:null}},f.forwardRef=function(e){return{$$typeof:ge,render:e}},f.isValidElement=J,f.lazy=function(e){return{$$typeof:be,_payload:{_status:-1,_result:e},_init:ve}},f.memo=function(e,o){return{$$typeof:xe,type:e,compare:o===void 0?null:o}},f.startTransition=function(e){var o=D.transition;D.transition={};try{e()}finally{D.transition=o}},f.unstable_act=ne,f.useCallback=function(e,o){return _.current.useCallback(e,o)},f.useContext=function(e){return _.current.useContext(e)},f.useDebugValue=function(){},f.useDeferredValue=function(e){return _.current.useDeferredValue(e)},f.useEffect=function(e,o){return _.current.useEffect(e,o)},f.useId=function(){return _.current.useId()},f.useImperativeHandle=function(e,o,i){return _.current.useImperativeHandle(e,o,i)},f.useInsertionEffect=function(e,o){return _.current.useInsertionEffect(e,o)},f.useLayoutEffect=function(e,o){return _.current.useLayoutEffect(e,o)},f.useMemo=function(e,o){return _.current.useMemo(e,o)},f.useReducer=function(e,o,i){return _.current.useReducer(e,o,i)},f.useRef=function(e){return _.current.useRef(e)},f.useState=function(e){return _.current.useState(e)},f.useSyncExternalStore=function(e,o,i){return _.current.useSyncExternalStore(e,o,i)},f.useTransition=function(){return _.current.useTransition()},f.version="18.3.1",W.exports=f;var k=W.exports;/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var _e=k,je=Symbol.for("react.element"),Ee=Symbol.for("react.fragment"),Ce=Object.prototype.hasOwnProperty,Ne=_e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Se={key:!0,ref:!0,__self:!0,__source:!0};function ae(e,o,i){var r,l={},d=null,p=null;i!==void 0&&(d=""+i),o.key!==void 0&&(d=""+o.key),o.ref!==void 0&&(p=o.ref);for(r in o)Ce.call(o,r)&&!Se.hasOwnProperty(r)&&(l[r]=o[r]);if(e&&e.defaultProps)for(r in o=e.defaultProps,o)l[r]===void 0&&(l[r]=o[r]);return{$$typeof:je,type:e,key:d,ref:p,props:l,_owner:Ne.current}}M.Fragment=Ee,M.jsx=ae,M.jsxs=ae,V.exports=M;var t=V.exports;/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pe=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),ie=(...e)=>e.filter((o,i,r)=>!!o&&o.trim()!==""&&r.indexOf(o)===i).join(" ").trim();/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var Be={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Te=k.forwardRef(({color:e="currentColor",size:o=24,strokeWidth:i=2,absoluteStrokeWidth:r,className:l="",children:d,iconNode:p,...u},c)=>k.createElement("svg",{ref:c,...Be,width:o,height:o,stroke:e,strokeWidth:r?Number(i)*24/Number(o):i,className:ie("lucide",l),...u},[...p.map(([s,a])=>k.createElement(s,a)),...Array.isArray(d)?d:[d]]));/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=(e,o)=>{const i=k.forwardRef(({className:r,...l},d)=>k.createElement(Te,{ref:d,iconNode:o,className:ie(`lucide-${Pe(e)}`,r),...l}));return i.displayName=`${e}`,i};/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ae=S("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ie=S("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ze=S("MousePointer",[["path",{d:"M12.586 12.586 19 19",key:"ea5xo7"}],["path",{d:"M3.688 3.037a.497.497 0 0 0-.651.651l6.5 15.999a.501.501 0 0 0 .947-.062l1.569-6.083a2 2 0 0 1 1.448-1.479l6.124-1.579a.5.5 0 0 0 .063-.947z",key:"277e5u"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Le=S("Palette",[["circle",{cx:"13.5",cy:"6.5",r:".5",fill:"currentColor",key:"1okk4w"}],["circle",{cx:"17.5",cy:"10.5",r:".5",fill:"currentColor",key:"f64h9f"}],["circle",{cx:"8.5",cy:"7.5",r:".5",fill:"currentColor",key:"fotxhn"}],["circle",{cx:"6.5",cy:"12.5",r:".5",fill:"currentColor",key:"qy21gx"}],["path",{d:"M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z",key:"12rzf8"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $e=S("Save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Me=S("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Re=S("Type",[["polyline",{points:"4 7 4 4 20 4 20 7",key:"1nosan"}],["line",{x1:"9",x2:"15",y1:"20",y2:"20",key:"swin9y"}],["line",{x1:"12",x2:"12",y1:"4",y2:"20",key:"1tx1rr"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Oe=S("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]),A=({color:e,onChange:o})=>{const[i,r]=k.useState(!1),[l,d]=k.useState(e),p=k.useRef(null),u=["#000000","#ffffff","#dc2626","#ea580c","#d97706","#65a30d","#16a34a","#0d9488","#0891b2","#2563eb","#4F46E5","#7c3aed","#9333ea","#c026d3","#e11d48","#f59e0b","#10b981","#06b6d4","#3b82f6","#8b5cf6","#ec4899","#f97316","#84cc16","#14b8a6"];k.useEffect(()=>{d(e)},[e]),k.useEffect(()=>{const a=g=>{p.current&&!p.current.contains(g.target)&&r(!1)};return document.addEventListener("mousedown",a),()=>{document.removeEventListener("mousedown",a)}},[]);const c=a=>{d(a),o(a),r(!1)},s=a=>{const g=a.target.value;d(g),o(g)};return t.jsxs("div",{className:"relative",ref:p,children:[t.jsxs("div",{className:"flex items-center space-x-2",children:[t.jsx("button",{type:"button",onClick:()=>r(!i),className:"w-10 h-10 rounded border border-gray-300 shadow-sm",style:{backgroundColor:l},title:"Choose color"}),t.jsx("input",{type:"text",value:l,onChange:s,className:"flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"#000000"})]}),i&&t.jsxs("div",{className:"absolute z-10 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg",children:[t.jsx("div",{className:"grid grid-cols-6 gap-2 mb-3",children:u.map(a=>t.jsx("button",{type:"button",onClick:()=>c(a),className:"w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform",style:{backgroundColor:a},title:a},a))}),t.jsx("div",{className:"text-xs text-gray-500 text-center",children:"Click a color to select"})]})]})},De=({promoBar:e,onClose:o,onSave:i})=>{const[r,l]=k.useState({name:"",title:"",cta_text:"",cta_url:"",countdown_enabled:!1,countdown_date:"",close_button_enabled:!0,status:"draft",priority:0,template_id:0,styling:{background:"#ffffff",color:"#333333",font_family:"Inter, sans-serif",font_size:"14px",padding:"12px 20px",border_bottom:"1px solid #e5e7eb"},cta_style:{background:"#4F46E5",color:"#ffffff",padding:"8px 16px",border_radius:"4px",font_weight:"500"},countdown_style:{color:"#dc2626",font_weight:"600",font_family:"monospace"},close_button_style:{color:"#6b7280",font_size:"20px",padding:"4px 8px"}}),[d,p]=k.useState("content"),[u,c]=k.useState(!0);k.useEffect(()=>{if(e&&typeof e=="object"){console.log("PromoBar data received in editor:",e);let n={};if(e.styling)if(typeof e.styling=="string")try{n=JSON.parse(e.styling)}catch(E){console.error("Error parsing styling JSON:",E),n={}}else n=e.styling;const w={background:n.background||n.backgroundColor||"#ffffff",color:n.color||n.text_color||"#333333",font_family:n.font_family||n.fontFamily||"Inter, sans-serif",font_size:n.font_size||n.fontSize||"14px",padding:n.padding||"12px 20px",border_bottom:n.border_bottom||n.borderBottom||"1px solid #e5e7eb"};let x={};if(e.cta_style)if(typeof e.cta_style=="string")try{x=JSON.parse(e.cta_style)}catch(E){console.error("Error parsing CTA style JSON:",E),x={}}else x=e.cta_style;let j={};if(e.countdown_style)if(typeof e.countdown_style=="string")try{j=JSON.parse(e.countdown_style)}catch(E){console.error("Error parsing countdown style JSON:",E),j={}}else j=e.countdown_style;let N={};if(e.close_button_style)if(typeof e.close_button_style=="string")try{N=JSON.parse(e.close_button_style)}catch(E){console.error("Error parsing close button style JSON:",E),N={}}else N=e.close_button_style;const P={...r,name:e.name||"",title:e.title||"",cta_text:e.cta_text||"",cta_url:e.cta_url||"",countdown_enabled:!!e.countdown_enabled,countdown_date:e.countdown_date||"",close_button_enabled:!!e.close_button_enabled,status:e.status||"draft",priority:parseInt(e.priority)||0,template_id:parseInt(e.template_id)||0,styling:{...r.styling,...w},cta_style:{...r.cta_style,...x},countdown_style:{...r.countdown_style,...j},close_button_style:{...r.close_button_style,...N}};console.log("Updated form data:",P),l(P)}else console.log("No promo bar data provided or invalid data:",e)},[e]);const s=(n,w)=>{l(x=>({...x,[n]:w}))},a=(n,w,x)=>{l(j=>({...j,[n]:{...j[n],[w]:x}}))},g=async()=>{try{if(!window.promobarxAdmin||!window.promobarxAdmin.ajaxurl||!window.promobarxAdmin.nonce){console.error("PromoBarX admin data not available");return}const n={...r,styling:JSON.stringify(r.styling),cta_style:JSON.stringify(r.cta_style),countdown_style:JSON.stringify(r.countdown_style),close_button_style:JSON.stringify(r.close_button_style)},x=await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({action:"promobarx_save",nonce:window.promobarxAdmin.nonce,...n})})).json();x.success?i():alert("Error saving promo bar: "+x.data)}catch(n){console.error("Error saving promo bar:",n),alert("Error saving promo bar")}},m=()=>{const n={background:r.styling.background,color:r.styling.color,fontFamily:r.styling.font_family,fontSize:r.styling.font_size,padding:r.styling.padding,borderBottom:r.styling.border_bottom};return Object.entries(n).filter(([w,x])=>x).map(([w,x])=>`${w.replace(/([A-Z])/g,"-$1").toLowerCase()}: ${x}`).join("; ")},h=()=>{const n={background:r.cta_style.background,color:r.cta_style.color,padding:r.cta_style.padding,borderRadius:r.cta_style.border_radius,fontWeight:r.cta_style.font_weight};return Object.entries(n).filter(([w,x])=>x).map(([w,x])=>`${w.replace(/([A-Z])/g,"-$1").toLowerCase()}: ${x}`).join("; ")},v=()=>{const n={color:r.countdown_style.color,fontWeight:r.countdown_style.font_weight,fontFamily:r.countdown_style.font_family};return Object.entries(n).filter(([w,x])=>x).map(([w,x])=>`${w.replace(/([A-Z])/g,"-$1").toLowerCase()}: ${x}`).join("; ")},y=()=>{const n={color:r.close_button_style.color,fontSize:r.close_button_style.font_size,padding:r.close_button_style.padding};return Object.entries(n).filter(([w,x])=>x).map(([w,x])=>`${w.replace(/([A-Z])/g,"-$1").toLowerCase()}: ${x}`).join("; ")},b=[{id:"content",label:"Content",icon:Re},{id:"styling",label:"Styling",icon:Le},{id:"cta",label:"CTA Button",icon:ze},{id:"countdown",label:"Countdown",icon:Ae},{id:"settings",label:"Settings",icon:Me}];return!window.promobarxAdmin||!window.promobarxAdmin.ajaxurl||!window.promobarxAdmin.nonce?t.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",children:t.jsxs("div",{className:"bg-white rounded-lg p-8 text-center",children:[t.jsx("div",{className:"animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"}),t.jsx("p",{className:"text-gray-600",children:"Loading PromoBarX admin..."})]})}):t.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",children:t.jsxs("div",{className:"bg-white rounded-lg shadow-xl w-full max-w-7xl h-5/6 flex flex-col",children:[t.jsxs("div",{className:"flex items-center justify-between p-6 border-b border-gray-200",children:[t.jsxs("div",{children:[t.jsx("h2",{className:"text-xl font-semibold text-gray-900",children:e?"Edit Promo Bar":"Create New Promo Bar"}),t.jsx("p",{className:"text-sm text-gray-600",children:"Design your promotional top bar"})]}),t.jsxs("div",{className:"flex items-center space-x-3",children:[t.jsxs("button",{onClick:()=>c(!u),className:`px-3 py-2 rounded-md text-sm font-medium ${u?"bg-blue-100 text-blue-700":"bg-gray-100 text-gray-700"}`,children:[t.jsx(Ie,{className:"w-4 h-4 inline mr-1"}),"Preview"]}),t.jsxs("button",{onClick:g,className:"px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors",children:[t.jsx($e,{className:"w-4 h-4 inline mr-2"}),"Save"]}),t.jsx("button",{onClick:o,className:"p-2 text-gray-400 hover:text-gray-600",children:t.jsx(Oe,{className:"w-5 h-5"})})]})]}),t.jsxs("div",{className:"flex flex-1 overflow-hidden",children:[t.jsxs("div",{className:"w-1/2 border-r border-gray-200 flex flex-col",children:[t.jsx("div",{className:"border-b border-gray-200",children:t.jsx("nav",{className:"flex space-x-8 px-6",children:b.map(n=>t.jsxs("button",{onClick:()=>p(n.id),className:`py-3 px-1 border-b-2 font-medium text-sm ${d===n.id?"border-blue-500 text-blue-600":"border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`,children:[t.jsx(n.icon,{className:"w-4 h-4 inline mr-2"}),n.label]},n.id))})}),t.jsxs("div",{className:"flex-1 overflow-y-auto p-6",children:[d==="content"&&t.jsxs("div",{className:"space-y-6",children:[t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Promo Bar Name"}),t.jsx("input",{type:"text",value:r.name,onChange:n=>s("name",n.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"Enter promo bar name"})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Title"}),t.jsx("input",{type:"text",value:r.title,onChange:n=>s("title",n.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"Enter main title"})]}),t.jsxs("div",{className:"flex space-x-4",children:[t.jsxs("div",{className:"flex-1",children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"CTA Text"}),t.jsx("input",{type:"text",value:r.cta_text,onChange:n=>s("cta_text",n.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"Shop Now"})]}),t.jsxs("div",{className:"flex-1",children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"CTA URL"}),t.jsx("input",{type:"url",value:r.cta_url,onChange:n=>s("cta_url",n.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"https://example.com"})]})]}),t.jsx("div",{className:"flex items-center space-x-4",children:t.jsxs("label",{className:"flex items-center",children:[t.jsx("input",{type:"checkbox",checked:r.countdown_enabled,onChange:n=>s("countdown_enabled",n.target.checked),className:"rounded border-gray-300 text-blue-600 focus:ring-blue-500"}),t.jsx("span",{className:"ml-2 text-sm text-gray-700",children:"Enable Countdown Timer"})]})}),r.countdown_enabled&&t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Countdown End Date"}),t.jsx("input",{type:"datetime-local",value:r.countdown_date,onChange:n=>s("countdown_date",n.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"})]}),t.jsx("div",{className:"flex items-center space-x-4",children:t.jsxs("label",{className:"flex items-center",children:[t.jsx("input",{type:"checkbox",checked:r.close_button_enabled,onChange:n=>s("close_button_enabled",n.target.checked),className:"rounded border-gray-300 text-blue-600 focus:ring-blue-500"}),t.jsx("span",{className:"ml-2 text-sm text-gray-700",children:"Show Close Button"})]})})]}),d==="styling"&&t.jsxs("div",{className:"space-y-6",children:[t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Background Color"}),t.jsx(A,{color:r.styling.background,onChange:n=>a("styling","background",n)})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Text Color"}),t.jsx(A,{color:r.styling.color,onChange:n=>a("styling","color",n)})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Font Family"}),t.jsxs("select",{value:r.styling.font_family,onChange:n=>a("styling","font_family",n.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",children:[t.jsx("option",{value:"Inter, sans-serif",children:"Inter"}),t.jsx("option",{value:"Arial, sans-serif",children:"Arial"}),t.jsx("option",{value:"Helvetica, sans-serif",children:"Helvetica"}),t.jsx("option",{value:"Georgia, serif",children:"Georgia"}),t.jsx("option",{value:"Times New Roman, serif",children:"Times New Roman"})]})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Font Size"}),t.jsx("input",{type:"text",value:r.styling.font_size,onChange:n=>a("styling","font_size",n.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"14px"})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Padding"}),t.jsx("input",{type:"text",value:r.styling.padding,onChange:n=>a("styling","padding",n.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"12px 20px"})]})]}),d==="cta"&&t.jsxs("div",{className:"space-y-6",children:[t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Button Background Color"}),t.jsx(A,{color:r.cta_style.background,onChange:n=>a("cta_style","background",n)})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Button Text Color"}),t.jsx(A,{color:r.cta_style.color,onChange:n=>a("cta_style","color",n)})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Button Padding"}),t.jsx("input",{type:"text",value:r.cta_style.padding,onChange:n=>a("cta_style","padding",n.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"8px 16px"})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Border Radius"}),t.jsx("input",{type:"text",value:r.cta_style.border_radius,onChange:n=>a("cta_style","border_radius",n.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"4px"})]})]}),d==="countdown"&&t.jsxs("div",{className:"space-y-6",children:[t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Countdown Color"}),t.jsx(A,{color:r.countdown_style.color,onChange:n=>a("countdown_style","color",n)})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Font Weight"}),t.jsxs("select",{value:r.countdown_style.font_weight,onChange:n=>a("countdown_style","font_weight",n.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",children:[t.jsx("option",{value:"400",children:"Normal"}),t.jsx("option",{value:"500",children:"Medium"}),t.jsx("option",{value:"600",children:"Semi Bold"}),t.jsx("option",{value:"700",children:"Bold"})]})]})]}),d==="settings"&&t.jsxs("div",{className:"space-y-6",children:[t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Status"}),t.jsxs("select",{value:r.status,onChange:n=>s("status",n.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",children:[t.jsx("option",{value:"draft",children:"Draft"}),t.jsx("option",{value:"active",children:"Active"}),t.jsx("option",{value:"paused",children:"Paused"}),t.jsx("option",{value:"archived",children:"Archived"})]})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Priority"}),t.jsx("input",{type:"number",value:r.priority,onChange:n=>s("priority",parseInt(n.target.value)),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",min:"0",max:"100"}),t.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"Higher priority promo bars will be shown first"})]})]})]})]}),u&&t.jsxs("div",{className:"w-1/2 bg-gray-50 p-6",children:[t.jsxs("div",{className:"mb-4",children:[t.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-2",children:"Live Preview"}),t.jsx("p",{className:"text-sm text-gray-600",children:"See how your promo bar will look on the frontend"})]}),t.jsx("div",{className:"bg-white rounded-lg shadow-lg overflow-hidden",children:t.jsxs("div",{className:"promobarx-preview",style:m(),children:[t.jsxs("div",{className:"flex items-center justify-center gap-4 p-4",children:[r.title&&t.jsx("div",{className:"font-semibold",children:r.title}),r.countdown_enabled&&r.countdown_date&&t.jsx("div",{className:"font-mono font-semibold",style:v(),children:"00d 00h 00m 00s"}),r.cta_text&&t.jsx("a",{href:"#",className:"inline-block px-4 py-2 rounded text-decoration-none font-medium transition-transform hover:transform hover:-translate-y-0.5",style:h(),children:r.cta_text})]}),r.close_button_enabled&&t.jsx("button",{className:"absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors",style:y(),children:"×"})]})})]})]})]})})},Ue=Object.freeze(Object.defineProperty({__proto__:null,default:()=>{const[e,o]=k.useState(null),[i,r]=k.useState(!0),[l,d]=k.useState(null);k.useEffect(()=>{console.log("EditorPage: Component mounted"),p()},[]);const p=async()=>{var s,a;try{console.log("EditorPage: Loading promo bar data...");const m=new URLSearchParams(window.location.search).get("id");if(console.log("EditorPage: URL params:",window.location.search),console.log("EditorPage: Promo bar ID from URL:",m),console.log("EditorPage: Admin data available:",{promobarxAdmin:window.promobarxAdmin,ajaxurl:(s=window.promobarxAdmin)==null?void 0:s.ajaxurl,nonce:(a=window.promobarxAdmin)==null?void 0:a.nonce}),m&&window.promobarxAdmin&&window.promobarxAdmin.ajaxurl){console.log("EditorPage: Fetching promo bar with ID:",m);const h=await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`action=promobarx_get_promo_bar&id=${m}&nonce=${window.promobarxAdmin.nonce}`});console.log("EditorPage: Response status:",h.status);const v=await h.json();console.log("EditorPage: Response data:",v),v.success?(console.log("EditorPage: Successfully loaded promo bar:",v.data),o(v.data)):(console.error("EditorPage: Failed to load promo bar data:",v.data),d("Failed to load promo bar data: "+(v.data||"Unknown error")))}else console.log("EditorPage: No promo bar ID provided or admin data not available, creating new promo bar"),o(null)}catch(g){console.error("EditorPage: Error loading promo bar:",g),d("Error loading promo bar data: "+g.message)}finally{r(!1)}},u=async s=>{try{console.log("EditorPage: Save completed, redirecting to manager"),window.location.href="admin.php?page=promo-bar-x-topbar-manager"}catch(a){console.error("EditorPage: Error after save:",a)}},c=()=>{console.log("EditorPage: Close clicked, redirecting to manager"),window.location.href="admin.php?page=promo-bar-x-topbar-manager"};return i?t.jsx("div",{className:"flex items-center justify-center min-h-screen",children:t.jsxs("div",{className:"text-center",children:[t.jsx("div",{className:"animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"}),t.jsx("p",{className:"text-gray-600",children:"Loading editor..."})]})}):l?t.jsx("div",{className:"flex items-center justify-center min-h-screen",children:t.jsxs("div",{className:"text-center",children:[t.jsx("div",{className:"text-red-600 mb-4",children:t.jsx("svg",{className:"w-12 h-12 mx-auto",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"})})}),t.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-2",children:"Error"}),t.jsx("p",{className:"text-gray-600 mb-4",children:l}),t.jsx("button",{onClick:c,className:"px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors",children:"Back to Manager"})]})}):(console.log("EditorPage: Rendering TopBarEditor with promo bar:",e),t.jsx("div",{className:"min-h-screen bg-gray-50",children:t.jsx(De,{promoBar:e,onSave:u,onClose:c})}))}},Symbol.toStringTag,{value:"Module"}))})();
//# sourceMappingURL=chat-admin.js.map
