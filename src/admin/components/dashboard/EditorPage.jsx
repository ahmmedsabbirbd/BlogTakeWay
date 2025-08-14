import React, { useState, useEffect } from 'react';
import TopBarEditor from './TopBarEditor';

const EditorPage = () => {
    const [promoBar, setPromoBar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('EditorPage: Component mounted');
        loadPromoBar();
    }, []);

    const loadPromoBar = async () => {
        try {
            console.log('EditorPage: Loading promo bar data...');
            
            // Check if we have a promo bar ID from the URL
            const urlParams = new URLSearchParams(window.location.search);
            const promoBarId = urlParams.get('id');
            
            console.log('EditorPage: URL params:', window.location.search);
            console.log('EditorPage: Promo bar ID from URL:', promoBarId);
            console.log('EditorPage: Admin data available:', {
                promobarxAdmin: window.promobarxAdmin,
                ajaxurl: window.promobarxAdmin?.ajaxurl,
                nonce: window.promobarxAdmin?.nonce
            });

            if (promoBarId && window.promobarxAdmin && window.promobarxAdmin.ajaxurl) {
                console.log('EditorPage: Fetching promo bar with ID:', promoBarId);
                
                const response = await fetch(window.promobarxAdmin.ajaxurl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `action=promobarx_get_promo_bar&id=${promoBarId}&nonce=${window.promobarxAdmin.nonce}`
                });
                
                console.log('EditorPage: Response status:', response.status);
                
                const data = await response.json();
                console.log('EditorPage: Response data:', data);
                
                if (data.success) {
                    console.log('EditorPage: Successfully loaded promo bar:', data.data);
                    setPromoBar(data.data);
                } else {
                    console.error('EditorPage: Failed to load promo bar data:', data.data);
                    setError('Failed to load promo bar data: ' + (data.data || 'Unknown error'));
                }
            } else {
                console.log('EditorPage: No promo bar ID provided or admin data not available, creating new promo bar');
                // Creating a new promo bar
                setPromoBar(null);
            }
        } catch (error) {
            console.error('EditorPage: Error loading promo bar:', error);
            setError('Error loading promo bar data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (savedPromoBar) => {
        try {
            console.log('EditorPage: Save completed, redirecting to manager');
            // Redirect back to the manager page after successful save
            window.location.href = 'admin.php?page=promo-bar-x-topbar-manager';
        } catch (error) {
            console.error('EditorPage: Error after save:', error);
        }
    };

    const handleClose = () => {
        console.log('EditorPage: Close clicked, redirecting to manager');
        // Redirect back to the manager page
        window.location.href = 'admin.php?page=promo-bar-x-topbar-manager';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading editor...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-red-600 mb-4">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Back to Manager
                    </button>
                </div>
            </div>
        );
    }

    console.log('EditorPage: Rendering TopBarEditor with promo bar:', promoBar);

    return (
        <div className="min-h-screen bg-gray-50">
            <TopBarEditor
                promoBar={promoBar}
                onSave={handleSave}
                onClose={handleClose}
            />
        </div>
    );
};

export default EditorPage;
