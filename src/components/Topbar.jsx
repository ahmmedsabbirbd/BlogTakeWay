import React, { useState, useEffect } from 'react';
import '../styles/Topbar.scss';

// Countdown Timer Component
const CountdownTimer = ({ endDate, style }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const end = new Date(endDate).getTime();
            const distance = end - now;

            if (distance < 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [endDate]);

    return (
        <div className="promobarx-countdown" style={style}>
            <span className="countdown-days">{timeLeft.days.toString().padStart(2, '0')}</span>d 
            <span className="countdown-hours">{timeLeft.hours.toString().padStart(2, '0')}</span>h 
            <span className="countdown-minutes">{timeLeft.minutes.toString().padStart(2, '0')}</span>m 
            <span className="countdown-seconds">{timeLeft.seconds.toString().padStart(2, '0')}</span>s
        </div>
    );
};

const Topbar = React.forwardRef((props, ref) => {
    const [promoBar, setPromoBar] = useState(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Check if promo bar data is available from PHP
        if (window.promobarxData && window.promobarxData.promoBar) {
            setPromoBar(window.promobarxData.promoBar);
        }
    }, []);

    // Add body padding when promo bar is visible
    useEffect(() => {
        if (promoBar && isVisible) {
            // Wait for the DOM to be updated with the promo bar
            setTimeout(() => {
                const promoBarElement = document.querySelector('.promobarx-topbar');
                if (promoBarElement) {
                    // Calculate the actual height of the promo bar
                    const promoBarHeight = promoBarElement.offsetHeight;
                    
                    // Set the CSS custom property with the actual height
                    document.documentElement.style.setProperty('--promobarx-height', promoBarHeight + 'px');
                    
                    // Add the active class to body
                    document.body.classList.add('promobarx-active');
                }
            }, 0);
        }
        
        // Cleanup function to remove body padding when component unmounts
        return () => {
            document.body.classList.remove('promobarx-active');
            document.documentElement.style.removeProperty('--promobarx-height');
        };
    }, [promoBar, isVisible]);

    const handleClose = () => {
        setIsVisible(false);
        
        // Remove body padding when promo bar is hidden
        document.body.classList.remove('promobarx-active');
        // Remove the CSS custom property
        document.documentElement.style.removeProperty('--promobarx-height');
        
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
    
    // Extract individual element styling
    const titleColor = styling.title_color || styling.color || '#ffffff';
    const titleFontSize = styling.title_font_size || 'inherit';
    const countdownColor = styling.countdown_color || styling.color || '#ffffff';
    const countdownFontSize = styling.countdown_font_size || 'inherit';
    const ctaTextColor = styling.cta_text_color || styling.background || '#3b82f6';
    const ctaFontSize = styling.cta_font_size || 'inherit';
    
    // Check if CTA is enabled
    const ctaEnabled = styling.cta_enabled !== undefined ? 
        (styling.cta_enabled === true || styling.cta_enabled === 1 || styling.cta_enabled === '1') : 
        true; // Default to true for backward compatibility

    const generateStyles = (styleObj) => {
        const styles = {};
        Object.entries(styleObj).forEach(([key, value]) => {
            if (value) {
                const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                styles[cssKey] = value;
            }
        });
        return styles;
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
                    <div 
                        className="promobarx-title"
                        style={{
                            color: titleColor,
                            fontSize: titleFontSize !== 'inherit' ? titleFontSize : undefined
                        }}
                        dangerouslySetInnerHTML={{ __html: promoBar.title }}
                    />
                )}
                
                {promoBar.countdown_enabled && promoBar.countdown_date && (
                    <CountdownTimer 
                        endDate={promoBar.countdown_date}
                        style={{
                            ...generateStyles(countdownStyle),
                            color: countdownColor,
                            fontSize: countdownFontSize !== 'inherit' ? countdownFontSize : undefined
                        }}
                    />
                )}
                
                {ctaEnabled && promoBar.cta_text && promoBar.cta_url && (
                    <a 
                        href={promoBar.cta_url}
                        className="promobarx-cta"
                        style={{
                            ...generateStyles(ctaStyle),
                            color: ctaTextColor,
                            fontSize: ctaFontSize !== 'inherit' ? ctaFontSize : undefined
                        }}
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