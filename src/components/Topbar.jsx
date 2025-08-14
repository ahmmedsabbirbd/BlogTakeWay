import React, { useState, useEffect } from 'react';
import '../styles/Topbar.scss';

const Topbar = React.forwardRef((props, ref) => {
    const [promoBar, setPromoBar] = useState(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Check if promo bar data is available from PHP
        if (window.promobarxData && window.promobarxData.promoBar) {
            setPromoBar(window.promobarxData.promoBar);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        
        // Set cookie to remember user closed this promo bar
        if (promoBar) {
            const date = new Date();
            date.setTime(date.getTime() + (24 * 60 * 60 * 1000)); // 24 hours
            document.cookie = `promobarx_closed_${promoBar.id}=1; expires=${date.toUTCString()}; path=/`;
            
            // Track close event
            trackEvent('close');
        }
    };

    const handleCTAClick = () => {
        trackEvent('click');
    };

    const trackEvent = (eventType) => {
        if (!promoBar) return;

        // Send tracking data to WordPress
        const formData = new FormData();
        formData.append('action', 'promobarx_track_event');
        formData.append('promo_id', promoBar.id);
        formData.append('event_type', eventType);
        formData.append('nonce', window.promobarxData?.nonce || '');

        fetch(window.ajaxurl || '/wp-admin/admin-ajax.php', {
            method: 'POST',
            body: formData
        }).catch(error => {
            console.error('Error tracking event:', error);
        });
    };

    // Track impression on mount
    useEffect(() => {
        if (promoBar) {
            trackEvent('impression');
        }
    }, [promoBar]);

    if (!promoBar || !isVisible) {
        return null;
    }

    const styling = promoBar.styling ? JSON.parse(promoBar.styling) : {};
    const ctaStyle = promoBar.cta_style ? JSON.parse(promoBar.cta_style) : {};
    const countdownStyle = promoBar.countdown_style ? JSON.parse(promoBar.countdown_style) : {};
    const closeStyle = promoBar.close_button_style ? JSON.parse(promoBar.close_button_style) : {};

    const generateStyles = (styleObj) => {
        return Object.entries(styleObj)
            .filter(([_, value]) => value)
            .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
            .join('; ');
    };

    return (
        <div 
            id={`promobarx-topbar-${promoBar.id}`}
            className="promobarx-topbar"
            style={generateStyles(styling)}
            ref={ref}
        >
            <div className="promobarx-content">
                {promoBar.title && (
                    <div className="promobarx-title">{promoBar.title}</div>
                )}
                
                {promoBar.countdown_enabled && promoBar.countdown_date && (
                    <div 
                        className="promobarx-countdown"
                        data-end={promoBar.countdown_date}
                        style={generateStyles(countdownStyle)}
                    >
                        <span className="countdown-days">00</span>d 
                        <span className="countdown-hours">00</span>h 
                        <span className="countdown-minutes">00</span>m 
                        <span className="countdown-seconds">00</span>s
                    </div>
                )}
                
                {promoBar.cta_text && promoBar.cta_url && (
                    <a 
                        href={promoBar.cta_url}
                        className="promobarx-cta"
                        style={generateStyles(ctaStyle)}
                        onClick={handleCTAClick}
                    >
                        {promoBar.cta_text}
                    </a>
                )}
            </div>
            
            {promoBar.close_button_enabled && (
                <button 
                    className="promobarx-close"
                    onClick={handleClose}
                    style={generateStyles(closeStyle)}
                >
                    ×
                </button>
            )}
        </div>
    );
});

export default Topbar;