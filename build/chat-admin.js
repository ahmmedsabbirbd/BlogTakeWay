(function(){"use strict";const He="modulepreload",Ue=function(e){return"/"+e},qe={},le=function(o,i,r){let a=Promise.resolve();function s(p){const u=new Event("vite:preloadError",{cancelable:!0});if(u.payload=p,window.dispatchEvent(u),!u.defaultPrevented)throw p}return a.then(p=>{for(const u of p||[])u.status==="rejected"&&s(u.reason);return o().catch(s)})};(function(){let e={promoBars:[],loading:!0,activeTab:"manage"},o=null;function i(g){if(o=document.getElementById(g),!o){console.error("Container not found:",g);return}r(),window.promobarxAdmin&&window.promobarxAdmin.ajaxurl&&window.promobarxAdmin.nonce?a():(console.log("Admin data not available"),e.loading=!1,v())}function r(){o.innerHTML=`
            <div style="display: flex; align-items: center; justify-content: center; height: 256px;">
                <div style="width: 32px; height: 32px; border: 2px solid #e5e7eb; border-top: 2px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `}async function a(){try{const f=await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"action=promobarx_get_promo_bars&nonce="+window.promobarxAdmin.nonce})).json();f.success&&(e.promoBars=f.data)}catch(g){console.error("Error loading promo bars:",g)}finally{e.loading=!1,v()}}async function s(g){if(confirm("Are you sure you want to delete this promo bar?"))try{(await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`action=promobarx_delete&id=${g}&nonce=${window.promobarxAdmin.nonce}`})).json()).success&&await a()}catch(f){console.error("Error deleting promo bar:",f)}}async function p(g){const f=g.status==="active"?"paused":"active";try{(await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`action=promobarx_save&id=${g.id}&status=${f}&nonce=${window.promobarxAdmin.nonce}`})).json()).success&&await a()}catch(n){console.error("Error updating status:",n)}}function u(){window.location.href="admin.php?page=promo-bar-x-editor"}function d(g){window.location.href=`admin.php?page=promo-bar-x-editor&id=${g.id}`}function c(g){e.activeTab=g,v()}function l(g){const f={draft:{color:"background-color: #f3f4f6; color: #374151;",label:"Draft"},active:{color:"background-color: #d1fae5; color: #065f46;",label:"Active"},paused:{color:"background-color: #fef3c7; color: #92400e;",label:"Paused"},archived:{color:"background-color: #fee2e2; color: #991b1b;",label:"Archived"}},n=f[g]||f.draft;return`<span style="padding: 4px 8px; border-radius: 9999px; font-size: 12px; font-weight: 500; ${n.color}">${n.label}</span>`}function y(g){return new Date(g).toLocaleDateString()}function v(){if(e.loading){r();return}o.innerHTML=`
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
                ${e.activeTab==="manage"?k():_()}
            </div>
        `}function k(){return e.promoBars.length===0?`
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
                        ${e.promoBars.map(f=>`
            <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 16px 24px; white-space: nowrap;">
                    <div>
                        <div style="font-size: 14px; font-weight: 500; color: #111827;">${f.name}</div>
                        <div style="font-size: 14px; color: #6b7280;">${f.title}</div>
                    </div>
                </td>
                <td style="padding: 16px 24px; white-space: nowrap;">${l(f.status)}</td>
                <td style="padding: 16px 24px; white-space: nowrap; font-size: 14px; color: #111827;">${f.priority}</td>
                <td style="padding: 16px 24px; white-space: nowrap; font-size: 14px; color: #6b7280;">${y(f.created_at)}</td>
                <td style="padding: 16px 24px; white-space: nowrap; text-align: right;">
                    <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
                        <button onclick="window.simpleTopBarManager.toggleStatus(${JSON.stringify(f).replace(/"/g,"&quot;")})" style="color: #9ca3af; background: none; border: none; cursor: pointer; padding: 4px;" title="${f.status==="active"?"Pause":"Activate"}">
                            <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${f.status==="active"?"M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21":"M15 12a3 3 0 11-6 0 3 3 0 016 0z"}"></path>
                            </svg>
                        </button>
                        <button onclick="window.simpleTopBarManager.editPromoBar(${JSON.stringify(f).replace(/"/g,"&quot;")})" style="color: #3b82f6; background: none; border: none; cursor: pointer; padding: 4px;" title="Edit">
                            <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </button>
                        <button onclick="window.simpleTopBarManager.deletePromoBar(${f.id})" style="color: #dc2626; background: none; border: none; cursor: pointer; padding: 4px;" title="Delete">
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
        `}window.simpleTopBarManager={init:i,loadPromoBars:a,deletePromoBar:s,toggleStatus:p,createNew:u,editPromoBar:d,switchTab:c}})(),document.addEventListener("DOMContentLoaded",()=>{try{let e=function(d){d.innerHTML=`
                <div style="max-width: 1200px; margin: 0 auto; padding: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                        <h1 style="font-size: 24px; font-weight: 600; color: #111827;">Top Bar Editor</h1>
                        <div style="display: flex; gap: 12px;">
                            <button onclick="savePromoBar()" style="display: inline-flex; align-items: center; padding: 10px 20px; background-color: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
                                <svg style="width: 16px; height: 16px; margin-right: 8px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Save Promo Bar
                            </button>
                            <button onclick="testSave()" style="display: inline-flex; align-items: center; padding: 10px 20px; background-color: #f59e0b; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; margin-left: 8px;">
                                Test Save
                            </button>
                            <button onclick="window.location.href='admin.php?page=promo-bar-x-topbar-manager'" style="display: inline-flex; align-items: center; padding: 10px 20px; background-color: #6b7280; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
                                <svg style="width: 16px; height: 16px; margin-right: 8px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                                </svg>
                                Back to Manager
                            </button>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
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
                                <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">Subtitle</label>
                                <input type="text" id="promo-subtitle" placeholder="Enter subtitle (optional)" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
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
                        
                        <!-- Preview -->
                        <div style="background: white; border-radius: 8px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                            <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 20px; color: #111827;">Live Preview</h2>
                            <div id="promo-preview" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; min-height: 200px;">
                                <div style="text-align: center; color: #64748b;">Preview will appear here</div>
                            </div>
                        </div>
                    </div>
                </div>
            `,o()},o=function(){const d=document.getElementById("promo-countdown-enabled"),c=document.getElementById("promo-countdown-date");d&&d.addEventListener("change",function(){c.style.display=this.checked?"block":"none",i()}),["promo-name","promo-title","promo-subtitle","promo-cta-text","promo-cta-url"].forEach(v=>{const k=document.getElementById(v);k&&k.addEventListener("input",i)}),["promo-bg-color","promo-text-color","promo-cta-color","promo-font-size","promo-position"].forEach(v=>{const k=document.getElementById(v);k&&k.addEventListener("change",i)}),i()},i=function(){var x,N,B,z,$,M,A,E,j,ae;const d=document.getElementById("promo-preview");if(!d)return;const c=((x=document.getElementById("promo-title"))==null?void 0:x.value)||"Sample Title",l=((N=document.getElementById("promo-subtitle"))==null?void 0:N.value)||"",y=((B=document.getElementById("promo-cta-text"))==null?void 0:B.value)||"Shop Now",v=((z=document.getElementById("promo-countdown-enabled"))==null?void 0:z.checked)||!1,k=(($=document.getElementById("promo-close-enabled"))==null?void 0:$.checked)||!1,_=((M=document.getElementById("promo-bg-color"))==null?void 0:M.value)||"#3b82f6",g=((A=document.getElementById("promo-text-color"))==null?void 0:A.value)||"#ffffff",f=((E=document.getElementById("promo-cta-color"))==null?void 0:E.value)||"#ffffff",n=((j=document.getElementById("promo-font-size"))==null?void 0:j.value)||"14px",b=((ae=document.getElementById("promo-position"))==null?void 0:ae.value)||"top";d.innerHTML=`
                <div style="background: ${_}; color: ${g}; padding: 12px 20px; border-radius: 6px; display: flex; align-items: center; justify-content: space-between; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: ${n};">
                    <div style="display: flex; align-items: center; gap: 20px; flex: 1;">
                        <div>
                            <div style="font-weight: 600;">${c}</div>
                            ${l?`<div style="font-size: 0.85em; opacity: 0.9; margin-top: 2px;">${l}</div>`:""}
                        </div>
                        ${v?'<div style="font-weight: 600; font-family: monospace; font-size: 0.85em;">23:59:59</div>':""}
                        <a href="#" style="background: ${f}; color: ${_}; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-weight: 500; font-size: 0.85em;">${y}</a>
                    </div>
                    ${k?'<button style="background: none; border: none; color: '+g+'; font-size: 18px; cursor: pointer; opacity: 0.7;">×</button>':""}
                </div>
                <div style="margin-top: 10px; font-size: 12px; color: #6b7280; text-align: center;">
                    Position: ${b==="top"?"Top of Page":"Bottom of Page"}
                </div>
            `};document.getElementById("promo-bar-x-topbar-manager")&&window.simpleTopBarManager.init("promo-bar-x-topbar-manager");const a=document.getElementById("promo-bar-x-editor");a&&(window.React&&window.ReactDOM?le(()=>Promise.resolve().then(()=>Fe),void 0).then(d=>{const c=d.default;window.ReactDOM.render(window.React.createElement(c),a)}).catch(d=>{console.error("Error loading editor:",d),e(a)}):e(a)),window.savePromoBar=function(){var y,v,k,_,g,f,n,b,x,N,B,z,$,M,A;console.log("Save button clicked");const d=((y=document.getElementById("promo-title"))==null?void 0:y.value)||"",c=((v=document.getElementById("promo-name"))==null?void 0:v.value)||"";if(!d.trim()){alert("Please enter a title for the promo bar.");return}if(!c.trim()){alert("Please enter a name for the promo bar.");return}const l={name:c,title:d,subtitle:((k=document.getElementById("promo-subtitle"))==null?void 0:k.value)||"",cta_text:((_=document.getElementById("promo-cta-text"))==null?void 0:_.value)||"",cta_url:((g=document.getElementById("promo-cta-url"))==null?void 0:g.value)||"",countdown_enabled:((f=document.getElementById("promo-countdown-enabled"))==null?void 0:f.checked)||!1,countdown_date:((n=document.getElementById("promo-countdown-date"))==null?void 0:n.value)||"",close_button_enabled:((b=document.getElementById("promo-close-enabled"))==null?void 0:b.checked)||!1,status:((x=document.getElementById("promo-status"))==null?void 0:x.value)||"draft",styling:JSON.stringify({background:((N=document.getElementById("promo-bg-color"))==null?void 0:N.value)||"#3b82f6",color:((B=document.getElementById("promo-text-color"))==null?void 0:B.value)||"#ffffff",font_size:((z=document.getElementById("promo-font-size"))==null?void 0:z.value)||"14px",position:(($=document.getElementById("promo-position"))==null?void 0:$.value)||"top"}),cta_style:JSON.stringify({background:((M=document.getElementById("promo-cta-color"))==null?void 0:M.value)||"#ffffff",color:((A=document.getElementById("promo-bg-color"))==null?void 0:A.value)||"#3b82f6"})};if(console.log("Data to save:",l),console.log("Admin data:",window.promobarxAdmin),window.promobarxAdmin&&window.promobarxAdmin.ajaxurl){const E=new URLSearchParams;E.append("action","promobarx_save"),E.append("nonce",window.promobarxAdmin.nonce),Object.keys(l).forEach(j=>{E.append(j,l[j])}),console.log("Form data:",E.toString()),fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:E.toString()}).then(j=>(console.log("Response status:",j.status),j.json())).then(j=>{console.log("Save result:",j),j.success?(alert("Promo bar saved successfully!"),window.location.href="admin.php?page=promo-bar-x-topbar-manager"):alert("Error saving promo bar: "+(j.data||"Unknown error"))}).catch(j=>{console.error("Error:",j),alert("Error saving promo bar. Please try again.")})}else console.error("Admin data not available"),alert("Admin data not available. Please refresh the page.")},window.testSave=function(){if(console.log("Test save clicked"),!window.promobarxAdmin||!window.promobarxAdmin.ajaxurl){alert("Admin data not available");return}const d={name:"Test Promo Bar",title:"Test Title",subtitle:"Test Subtitle",cta_text:"Test Button",cta_url:"https://example.com",status:"draft"},c=new URLSearchParams;c.append("action","promobarx_save"),c.append("nonce",window.promobarxAdmin.nonce),Object.keys(d).forEach(l=>{c.append(l,d[l])}),console.log("Test form data:",c.toString()),fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:c.toString()}).then(l=>(console.log("Test response status:",l.status),l.text())).then(l=>{console.log("Test response text:",l);try{const y=JSON.parse(l);console.log("Test parsed result:",y),y.success?alert("Test save successful! ID: "+y.data.id):alert("Test save failed: "+(y.data||"Unknown error"))}catch(y){console.error("Test JSON parse error:",y),alert("Test response not valid JSON: "+l)}}).catch(l=>{console.error("Test error:",l),alert("Test save error: "+l.message)})};const s=document.getElementById("promo-bar-x-dashboard");s&&(s.innerHTML=`
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
                `)})}});var J={exports:{}},I={},V={exports:{}},m={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var T=Symbol.for("react.element"),se=Symbol.for("react.portal"),de=Symbol.for("react.fragment"),ce=Symbol.for("react.strict_mode"),pe=Symbol.for("react.profiler"),ue=Symbol.for("react.provider"),me=Symbol.for("react.context"),fe=Symbol.for("react.forward_ref"),xe=Symbol.for("react.suspense"),ge=Symbol.for("react.memo"),be=Symbol.for("react.lazy"),W=Symbol.iterator;function ye(e){return e===null||typeof e!="object"?null:(e=W&&e[W]||e["@@iterator"],typeof e=="function"?e:null)}var X={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Z=Object.assign,G={};function S(e,o,i){this.props=e,this.context=o,this.refs=G,this.updater=i||X}S.prototype.isReactComponent={},S.prototype.setState=function(e,o){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,o,"setState")},S.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function Q(){}Q.prototype=S.prototype;function D(e,o,i){this.props=e,this.context=o,this.refs=G,this.updater=i||X}var F=D.prototype=new Q;F.constructor=D,Z(F,S.prototype),F.isPureReactComponent=!0;var K=Array.isArray,Y=Object.prototype.hasOwnProperty,H={current:null},ee={key:!0,ref:!0,__self:!0,__source:!0};function te(e,o,i){var r,a={},s=null,p=null;if(o!=null)for(r in o.ref!==void 0&&(p=o.ref),o.key!==void 0&&(s=""+o.key),o)Y.call(o,r)&&!ee.hasOwnProperty(r)&&(a[r]=o[r]);var u=arguments.length-2;if(u===1)a.children=i;else if(1<u){for(var d=Array(u),c=0;c<u;c++)d[c]=arguments[c+2];a.children=d}if(e&&e.defaultProps)for(r in u=e.defaultProps,u)a[r]===void 0&&(a[r]=u[r]);return{$$typeof:T,type:e,key:s,ref:p,props:a,_owner:H.current}}function he(e,o){return{$$typeof:T,type:e.type,key:o,ref:e.ref,props:e.props,_owner:e._owner}}function U(e){return typeof e=="object"&&e!==null&&e.$$typeof===T}function ve(e){var o={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(i){return o[i]})}var oe=/\/+/g;function q(e,o){return typeof e=="object"&&e!==null&&e.key!=null?ve(""+e.key):o.toString(36)}function L(e,o,i,r,a){var s=typeof e;(s==="undefined"||s==="boolean")&&(e=null);var p=!1;if(e===null)p=!0;else switch(s){case"string":case"number":p=!0;break;case"object":switch(e.$$typeof){case T:case se:p=!0}}if(p)return p=e,a=a(p),e=r===""?"."+q(p,0):r,K(a)?(i="",e!=null&&(i=e.replace(oe,"$&/")+"/"),L(a,o,i,"",function(c){return c})):a!=null&&(U(a)&&(a=he(a,i+(!a.key||p&&p.key===a.key?"":(""+a.key).replace(oe,"$&/")+"/")+e)),o.push(a)),1;if(p=0,r=r===""?".":r+":",K(e))for(var u=0;u<e.length;u++){s=e[u];var d=r+q(s,u);p+=L(s,o,i,d,a)}else if(d=ye(e),typeof d=="function")for(e=d.call(e),u=0;!(s=e.next()).done;)s=s.value,d=r+q(s,u++),p+=L(s,o,i,d,a);else if(s==="object")throw o=String(e),Error("Objects are not valid as a React child (found: "+(o==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":o)+"). If you meant to render a collection of children, use an array instead.");return p}function O(e,o,i){if(e==null)return e;var r=[],a=0;return L(e,r,"","",function(s){return o.call(i,s,a++)}),r}function we(e){if(e._status===-1){var o=e._result;o=o(),o.then(function(i){(e._status===0||e._status===-1)&&(e._status=1,e._result=i)},function(i){(e._status===0||e._status===-1)&&(e._status=2,e._result=i)}),e._status===-1&&(e._status=0,e._result=o)}if(e._status===1)return e._result.default;throw e._result}var w={current:null},R={transition:null},ke={ReactCurrentDispatcher:w,ReactCurrentBatchConfig:R,ReactCurrentOwner:H};function re(){throw Error("act(...) is not supported in production builds of React.")}m.Children={map:O,forEach:function(e,o,i){O(e,function(){o.apply(this,arguments)},i)},count:function(e){var o=0;return O(e,function(){o++}),o},toArray:function(e){return O(e,function(o){return o})||[]},only:function(e){if(!U(e))throw Error("React.Children.only expected to receive a single React element child.");return e}},m.Component=S,m.Fragment=de,m.Profiler=pe,m.PureComponent=D,m.StrictMode=ce,m.Suspense=xe,m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=ke,m.act=re,m.cloneElement=function(e,o,i){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var r=Z({},e.props),a=e.key,s=e.ref,p=e._owner;if(o!=null){if(o.ref!==void 0&&(s=o.ref,p=H.current),o.key!==void 0&&(a=""+o.key),e.type&&e.type.defaultProps)var u=e.type.defaultProps;for(d in o)Y.call(o,d)&&!ee.hasOwnProperty(d)&&(r[d]=o[d]===void 0&&u!==void 0?u[d]:o[d])}var d=arguments.length-2;if(d===1)r.children=i;else if(1<d){u=Array(d);for(var c=0;c<d;c++)u[c]=arguments[c+2];r.children=u}return{$$typeof:T,type:e.type,key:a,ref:s,props:r,_owner:p}},m.createContext=function(e){return e={$$typeof:me,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:ue,_context:e},e.Consumer=e},m.createElement=te,m.createFactory=function(e){var o=te.bind(null,e);return o.type=e,o},m.createRef=function(){return{current:null}},m.forwardRef=function(e){return{$$typeof:fe,render:e}},m.isValidElement=U,m.lazy=function(e){return{$$typeof:be,_payload:{_status:-1,_result:e},_init:we}},m.memo=function(e,o){return{$$typeof:ge,type:e,compare:o===void 0?null:o}},m.startTransition=function(e){var o=R.transition;R.transition={};try{e()}finally{R.transition=o}},m.unstable_act=re,m.useCallback=function(e,o){return w.current.useCallback(e,o)},m.useContext=function(e){return w.current.useContext(e)},m.useDebugValue=function(){},m.useDeferredValue=function(e){return w.current.useDeferredValue(e)},m.useEffect=function(e,o){return w.current.useEffect(e,o)},m.useId=function(){return w.current.useId()},m.useImperativeHandle=function(e,o,i){return w.current.useImperativeHandle(e,o,i)},m.useInsertionEffect=function(e,o){return w.current.useInsertionEffect(e,o)},m.useLayoutEffect=function(e,o){return w.current.useLayoutEffect(e,o)},m.useMemo=function(e,o){return w.current.useMemo(e,o)},m.useReducer=function(e,o,i){return w.current.useReducer(e,o,i)},m.useRef=function(e){return w.current.useRef(e)},m.useState=function(e){return w.current.useState(e)},m.useSyncExternalStore=function(e,o,i){return w.current.useSyncExternalStore(e,o,i)},m.useTransition=function(){return w.current.useTransition()},m.version="18.3.1",V.exports=m;var h=V.exports;/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var je=h,_e=Symbol.for("react.element"),Ce=Symbol.for("react.fragment"),Ne=Object.prototype.hasOwnProperty,Ee=je.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Se={key:!0,ref:!0,__self:!0,__source:!0};function ne(e,o,i){var r,a={},s=null,p=null;i!==void 0&&(s=""+i),o.key!==void 0&&(s=""+o.key),o.ref!==void 0&&(p=o.ref);for(r in o)Ne.call(o,r)&&!Se.hasOwnProperty(r)&&(a[r]=o[r]);if(e&&e.defaultProps)for(r in o=e.defaultProps,o)a[r]===void 0&&(a[r]=o[r]);return{$$typeof:_e,type:e,key:s,ref:p,props:a,_owner:Ee.current}}I.Fragment=Ce,I.jsx=ne,I.jsxs=ne,J.exports=I;var t=J.exports;/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Te=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),ie=(...e)=>e.filter((o,i,r)=>!!o&&o.trim()!==""&&r.indexOf(o)===i).join(" ").trim();/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var Pe={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Be=h.forwardRef(({color:e="currentColor",size:o=24,strokeWidth:i=2,absoluteStrokeWidth:r,className:a="",children:s,iconNode:p,...u},d)=>h.createElement("svg",{ref:d,...Pe,width:o,height:o,stroke:e,strokeWidth:r?Number(i)*24/Number(o):i,className:ie("lucide",a),...u},[...p.map(([c,l])=>h.createElement(c,l)),...Array.isArray(s)?s:[s]]));/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=(e,o)=>{const i=h.forwardRef(({className:r,...a},s)=>h.createElement(Be,{ref:s,iconNode:o,className:ie(`lucide-${Te(e)}`,r),...a}));return i.displayName=`${e}`,i};/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ze=C("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $e=C("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Me=C("MousePointer",[["path",{d:"M12.586 12.586 19 19",key:"ea5xo7"}],["path",{d:"M3.688 3.037a.497.497 0 0 0-.651.651l6.5 15.999a.501.501 0 0 0 .947-.062l1.569-6.083a2 2 0 0 1 1.448-1.479l6.124-1.579a.5.5 0 0 0 .063-.947z",key:"277e5u"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ae=C("Palette",[["circle",{cx:"13.5",cy:"6.5",r:".5",fill:"currentColor",key:"1okk4w"}],["circle",{cx:"17.5",cy:"10.5",r:".5",fill:"currentColor",key:"f64h9f"}],["circle",{cx:"8.5",cy:"7.5",r:".5",fill:"currentColor",key:"fotxhn"}],["circle",{cx:"6.5",cy:"12.5",r:".5",fill:"currentColor",key:"qy21gx"}],["path",{d:"M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z",key:"12rzf8"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ie=C("Save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Le=C("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Oe=C("Type",[["polyline",{points:"4 7 4 4 20 4 20 7",key:"1nosan"}],["line",{x1:"9",x2:"15",y1:"20",y2:"20",key:"swin9y"}],["line",{x1:"12",x2:"12",y1:"4",y2:"20",key:"1tx1rr"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Re=C("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]),P=({color:e,onChange:o})=>{const[i,r]=h.useState(!1),[a,s]=h.useState(e),p=h.useRef(null),u=["#000000","#ffffff","#dc2626","#ea580c","#d97706","#65a30d","#16a34a","#0d9488","#0891b2","#2563eb","#4F46E5","#7c3aed","#9333ea","#c026d3","#e11d48","#f59e0b","#10b981","#06b6d4","#3b82f6","#8b5cf6","#ec4899","#f97316","#84cc16","#14b8a6"];h.useEffect(()=>{s(e)},[e]),h.useEffect(()=>{const l=y=>{p.current&&!p.current.contains(y.target)&&r(!1)};return document.addEventListener("mousedown",l),()=>{document.removeEventListener("mousedown",l)}},[]);const d=l=>{s(l),o(l),r(!1)},c=l=>{const y=l.target.value;s(y),o(y)};return t.jsxs("div",{className:"relative",ref:p,children:[t.jsxs("div",{className:"flex items-center space-x-2",children:[t.jsx("button",{type:"button",onClick:()=>r(!i),className:"w-10 h-10 rounded border border-gray-300 shadow-sm",style:{backgroundColor:a},title:"Choose color"}),t.jsx("input",{type:"text",value:a,onChange:c,className:"flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"#000000"})]}),i&&t.jsxs("div",{className:"absolute z-10 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg",children:[t.jsx("div",{className:"grid grid-cols-6 gap-2 mb-3",children:u.map(l=>t.jsx("button",{type:"button",onClick:()=>d(l),className:"w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform",style:{backgroundColor:l},title:l},l))}),t.jsx("div",{className:"text-xs text-gray-500 text-center",children:"Click a color to select"})]})]})},De=({promoBar:e,onClose:o,onSave:i})=>{const[r,a]=h.useState({name:"",title:"",subtitle:"",cta_text:"",cta_url:"",countdown_enabled:!1,countdown_date:"",close_button_enabled:!0,status:"draft",priority:0,template_id:0,styling:{background:"#ffffff",color:"#333333",font_family:"Inter, sans-serif",font_size:"14px",padding:"12px 20px",border_bottom:"1px solid #e5e7eb"},cta_style:{background:"#4F46E5",color:"#ffffff",padding:"8px 16px",border_radius:"4px",font_weight:"500"},countdown_style:{color:"#dc2626",font_weight:"600",font_family:"monospace"},close_button_style:{color:"#6b7280",font_size:"20px",padding:"4px 8px"}}),[s,p]=h.useState("content"),[u,d]=h.useState(!0);h.useEffect(()=>{if(e){console.log("PromoBar data received:",e);let n={};e.styling&&(typeof e.styling=="string"?n=JSON.parse(e.styling):n=e.styling);const b={background:n.background||n.backgroundColor,color:n.color||n.text_color,font_family:n.font_family||n.fontFamily,font_size:n.font_size||n.fontSize,padding:n.padding,border_bottom:n.border_bottom||n.borderBottom};a({...r,...e,styling:{...r.styling,...b},cta_style:{...r.cta_style,...e.cta_style?typeof e.cta_style=="string"?JSON.parse(e.cta_style):e.cta_style:{}},countdown_style:{...r.countdown_style,...e.countdown_style?typeof e.countdown_style=="string"?JSON.parse(e.countdown_style):e.countdown_style:{}},close_button_style:{...r.close_button_style,...e.close_button_style?typeof e.close_button_style=="string"?JSON.parse(e.close_button_style):e.close_button_style:{}}})}},[e]);const c=(n,b)=>{a(x=>({...x,[n]:b}))},l=(n,b,x)=>{a(N=>({...N,[n]:{...N[n],[b]:x}}))},y=async()=>{try{if(!window.promobarxAdmin||!window.promobarxAdmin.ajaxurl||!window.promobarxAdmin.nonce){console.error("PromoBarX admin data not available");return}const n={...r,styling:JSON.stringify(r.styling),cta_style:JSON.stringify(r.cta_style),countdown_style:JSON.stringify(r.countdown_style),close_button_style:JSON.stringify(r.close_button_style)},x=await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({action:"promobarx_save",nonce:window.promobarxAdmin.nonce,...n})})).json();x.success?i():alert("Error saving promo bar: "+x.data)}catch(n){console.error("Error saving promo bar:",n),alert("Error saving promo bar")}},v=()=>{const n={background:r.styling.background,color:r.styling.color,fontFamily:r.styling.font_family,fontSize:r.styling.font_size,padding:r.styling.padding,borderBottom:r.styling.border_bottom};return Object.entries(n).filter(([b,x])=>x).map(([b,x])=>`${b.replace(/([A-Z])/g,"-$1").toLowerCase()}: ${x}`).join("; ")},k=()=>{const n={background:r.cta_style.background,color:r.cta_style.color,padding:r.cta_style.padding,borderRadius:r.cta_style.border_radius,fontWeight:r.cta_style.font_weight};return Object.entries(n).filter(([b,x])=>x).map(([b,x])=>`${b.replace(/([A-Z])/g,"-$1").toLowerCase()}: ${x}`).join("; ")},_=()=>{const n={color:r.countdown_style.color,fontWeight:r.countdown_style.font_weight,fontFamily:r.countdown_style.font_family};return Object.entries(n).filter(([b,x])=>x).map(([b,x])=>`${b.replace(/([A-Z])/g,"-$1").toLowerCase()}: ${x}`).join("; ")},g=()=>{const n={color:r.close_button_style.color,fontSize:r.close_button_style.font_size,padding:r.close_button_style.padding};return Object.entries(n).filter(([b,x])=>x).map(([b,x])=>`${b.replace(/([A-Z])/g,"-$1").toLowerCase()}: ${x}`).join("; ")},f=[{id:"content",label:"Content",icon:Oe},{id:"styling",label:"Styling",icon:Ae},{id:"cta",label:"CTA Button",icon:Me},{id:"countdown",label:"Countdown",icon:ze},{id:"settings",label:"Settings",icon:Le}];return!window.promobarxAdmin||!window.promobarxAdmin.ajaxurl||!window.promobarxAdmin.nonce?t.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",children:t.jsxs("div",{className:"bg-white rounded-lg p-8 text-center",children:[t.jsx("div",{className:"animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"}),t.jsx("p",{className:"text-gray-600",children:"Loading PromoBarX admin..."})]})}):t.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",children:t.jsxs("div",{className:"bg-white rounded-lg shadow-xl w-full max-w-7xl h-5/6 flex flex-col",children:[t.jsxs("div",{className:"flex items-center justify-between p-6 border-b border-gray-200",children:[t.jsxs("div",{children:[t.jsx("h2",{className:"text-xl font-semibold text-gray-900",children:e?"Edit Promo Bar":"Create New Promo Bar"}),t.jsx("p",{className:"text-sm text-gray-600",children:"Design your promotional top bar"})]}),t.jsxs("div",{className:"flex items-center space-x-3",children:[t.jsxs("button",{onClick:()=>d(!u),className:`px-3 py-2 rounded-md text-sm font-medium ${u?"bg-blue-100 text-blue-700":"bg-gray-100 text-gray-700"}`,children:[t.jsx($e,{className:"w-4 h-4 inline mr-1"}),"Preview"]}),t.jsxs("button",{onClick:y,className:"px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors",children:[t.jsx(Ie,{className:"w-4 h-4 inline mr-2"}),"Save"]}),t.jsx("button",{onClick:o,className:"p-2 text-gray-400 hover:text-gray-600",children:t.jsx(Re,{className:"w-5 h-5"})})]})]}),t.jsxs("div",{className:"flex flex-1 overflow-hidden",children:[t.jsxs("div",{className:"w-1/2 border-r border-gray-200 flex flex-col",children:[t.jsx("div",{className:"border-b border-gray-200",children:t.jsx("nav",{className:"flex space-x-8 px-6",children:f.map(n=>t.jsxs("button",{onClick:()=>p(n.id),className:`py-3 px-1 border-b-2 font-medium text-sm ${s===n.id?"border-blue-500 text-blue-600":"border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`,children:[t.jsx(n.icon,{className:"w-4 h-4 inline mr-2"}),n.label]},n.id))})}),t.jsxs("div",{className:"flex-1 overflow-y-auto p-6",children:[s==="content"&&t.jsxs("div",{className:"space-y-6",children:[t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Promo Bar Name"}),t.jsx("input",{type:"text",value:r.name,onChange:n=>c("name",n.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"Enter promo bar name"})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Title"}),t.jsx("input",{type:"text",value:r.title,onChange:n=>c("title",n.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"Enter main title"})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Subtitle"}),t.jsx("input",{type:"text",value:r.subtitle,onChange:n=>c("subtitle",n.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"Enter subtitle (optional)"})]}),t.jsxs("div",{className:"flex space-x-4",children:[t.jsxs("div",{className:"flex-1",children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"CTA Text"}),t.jsx("input",{type:"text",value:r.cta_text,onChange:n=>c("cta_text",n.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"Shop Now"})]}),t.jsxs("div",{className:"flex-1",children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"CTA URL"}),t.jsx("input",{type:"url",value:r.cta_url,onChange:n=>c("cta_url",n.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"https://example.com"})]})]}),t.jsx("div",{className:"flex items-center space-x-4",children:t.jsxs("label",{className:"flex items-center",children:[t.jsx("input",{type:"checkbox",checked:r.countdown_enabled,onChange:n=>c("countdown_enabled",n.target.checked),className:"rounded border-gray-300 text-blue-600 focus:ring-blue-500"}),t.jsx("span",{className:"ml-2 text-sm text-gray-700",children:"Enable Countdown Timer"})]})}),r.countdown_enabled&&t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Countdown End Date"}),t.jsx("input",{type:"datetime-local",value:r.countdown_date,onChange:n=>c("countdown_date",n.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"})]}),t.jsx("div",{className:"flex items-center space-x-4",children:t.jsxs("label",{className:"flex items-center",children:[t.jsx("input",{type:"checkbox",checked:r.close_button_enabled,onChange:n=>c("close_button_enabled",n.target.checked),className:"rounded border-gray-300 text-blue-600 focus:ring-blue-500"}),t.jsx("span",{className:"ml-2 text-sm text-gray-700",children:"Show Close Button"})]})})]}),s==="styling"&&t.jsxs("div",{className:"space-y-6",children:[t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Background Color"}),t.jsx(P,{color:r.styling.background,onChange:n=>l("styling","background",n)})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Text Color"}),t.jsx(P,{color:r.styling.color,onChange:n=>l("styling","color",n)})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Font Family"}),t.jsxs("select",{value:r.styling.font_family,onChange:n=>l("styling","font_family",n.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",children:[t.jsx("option",{value:"Inter, sans-serif",children:"Inter"}),t.jsx("option",{value:"Arial, sans-serif",children:"Arial"}),t.jsx("option",{value:"Helvetica, sans-serif",children:"Helvetica"}),t.jsx("option",{value:"Georgia, serif",children:"Georgia"}),t.jsx("option",{value:"Times New Roman, serif",children:"Times New Roman"})]})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Font Size"}),t.jsx("input",{type:"text",value:r.styling.font_size,onChange:n=>l("styling","font_size",n.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"14px"})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Padding"}),t.jsx("input",{type:"text",value:r.styling.padding,onChange:n=>l("styling","padding",n.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"12px 20px"})]})]}),s==="cta"&&t.jsxs("div",{className:"space-y-6",children:[t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Button Background Color"}),t.jsx(P,{color:r.cta_style.background,onChange:n=>l("cta_style","background",n)})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Button Text Color"}),t.jsx(P,{color:r.cta_style.color,onChange:n=>l("cta_style","color",n)})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Button Padding"}),t.jsx("input",{type:"text",value:r.cta_style.padding,onChange:n=>l("cta_style","padding",n.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"8px 16px"})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Border Radius"}),t.jsx("input",{type:"text",value:r.cta_style.border_radius,onChange:n=>l("cta_style","border_radius",n.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"4px"})]})]}),s==="countdown"&&t.jsxs("div",{className:"space-y-6",children:[t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Countdown Color"}),t.jsx(P,{color:r.countdown_style.color,onChange:n=>l("countdown_style","color",n)})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Font Weight"}),t.jsxs("select",{value:r.countdown_style.font_weight,onChange:n=>l("countdown_style","font_weight",n.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",children:[t.jsx("option",{value:"400",children:"Normal"}),t.jsx("option",{value:"500",children:"Medium"}),t.jsx("option",{value:"600",children:"Semi Bold"}),t.jsx("option",{value:"700",children:"Bold"})]})]})]}),s==="settings"&&t.jsxs("div",{className:"space-y-6",children:[t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Status"}),t.jsxs("select",{value:r.status,onChange:n=>c("status",n.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",children:[t.jsx("option",{value:"draft",children:"Draft"}),t.jsx("option",{value:"active",children:"Active"}),t.jsx("option",{value:"paused",children:"Paused"}),t.jsx("option",{value:"archived",children:"Archived"})]})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Priority"}),t.jsx("input",{type:"number",value:r.priority,onChange:n=>c("priority",parseInt(n.target.value)),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",min:"0",max:"100"}),t.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"Higher priority promo bars will be shown first"})]})]})]})]}),u&&t.jsxs("div",{className:"w-1/2 bg-gray-50 p-6",children:[t.jsxs("div",{className:"mb-4",children:[t.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-2",children:"Live Preview"}),t.jsx("p",{className:"text-sm text-gray-600",children:"See how your promo bar will look on the frontend"})]}),t.jsx("div",{className:"bg-white rounded-lg shadow-lg overflow-hidden",children:t.jsxs("div",{className:"promobarx-preview",style:v(),children:[t.jsxs("div",{className:"flex items-center justify-center gap-4 p-4",children:[r.title&&t.jsx("div",{className:"font-semibold",children:r.title}),r.subtitle&&t.jsx("div",{className:"opacity-90",children:r.subtitle}),r.countdown_enabled&&r.countdown_date&&t.jsx("div",{className:"font-mono font-semibold",style:_(),children:"00d 00h 00m 00s"}),r.cta_text&&t.jsx("a",{href:"#",className:"inline-block px-4 py-2 rounded text-decoration-none font-medium transition-transform hover:transform hover:-translate-y-0.5",style:k(),children:r.cta_text})]}),r.close_button_enabled&&t.jsx("button",{className:"absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors",style:g(),children:"×"})]})})]})]})]})})},Fe=Object.freeze(Object.defineProperty({__proto__:null,default:()=>{const[e,o]=h.useState(null),[i,r]=h.useState(!0),[a,s]=h.useState(null);h.useEffect(()=>{p()},[]);const p=async()=>{try{const l=new URLSearchParams(window.location.search).get("id");if(l&&window.promobarxAdmin&&window.promobarxAdmin.ajaxurl){const v=await(await fetch(window.promobarxAdmin.ajaxurl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`action=promobarx_get_promo_bar&id=${l}&nonce=${window.promobarxAdmin.nonce}`})).json();v.success?o(v.data):s("Failed to load promo bar data")}else o(null)}catch(c){console.error("Error loading promo bar:",c),s("Error loading promo bar data")}finally{r(!1)}},u=async c=>{try{window.location.href="admin.php?page=promo-bar-x-topbar-manager"}catch(l){console.error("Error after save:",l)}},d=()=>{window.location.href="admin.php?page=promo-bar-x-topbar-manager"};return i?t.jsx("div",{className:"flex items-center justify-center min-h-screen",children:t.jsxs("div",{className:"text-center",children:[t.jsx("div",{className:"animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"}),t.jsx("p",{className:"text-gray-600",children:"Loading editor..."})]})}):a?t.jsx("div",{className:"flex items-center justify-center min-h-screen",children:t.jsxs("div",{className:"text-center",children:[t.jsx("div",{className:"text-red-600 mb-4",children:t.jsx("svg",{className:"w-12 h-12 mx-auto",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"})})}),t.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-2",children:"Error"}),t.jsx("p",{className:"text-gray-600 mb-4",children:a}),t.jsx("button",{onClick:d,className:"px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors",children:"Back to Manager"})]})}):t.jsx("div",{className:"min-h-screen bg-gray-50",children:t.jsx(De,{promoBar:e,onSave:u,onClose:d})})}},Symbol.toStringTag,{value:"Module"}))})();
//# sourceMappingURL=chat-admin.js.map
