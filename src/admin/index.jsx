import React from 'react';
import { StyledEngineProvider } from '@mui/material';
import { createRoot } from 'react-dom/client';
import ChatAdminDashboard from './components/dashboard/ChatAdminDashboard';
import SettingsApp from './components/settings/SettingsApp';
import InquiriesPage from './components/dashboard/InquiriesPage';
import InquiryDetails from './components/dashboard/InquiryDetails';
import './styles/main.scss';
document.addEventListener('DOMContentLoaded', () => {
    console.log('x');
    // Mount admin dashboard
    const dashboardContainer = document.getElementById('promo-bar-x-dashboard');
    if (dashboardContainer) {
        const dashboardRoot = createRoot(dashboardContainer);
        dashboardRoot.render(<ChatAdminDashboard />);
    }


    // Mount settings page
    const settingsContainer = document.getElementById('promo-bar-x-settings-app');
    if (settingsContainer) {
        const settingsRoot = createRoot(settingsContainer);
        settingsRoot.render(<SettingsApp />);
    }

    // Mount inquiries page
    const inquiriesContainer = document.getElementById('promo-bar-x-inquiries');
    if (inquiriesContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const view = urlParams.get('view');
        const inquiryId = urlParams.get('id');

        const inquiriesRoot = createRoot(inquiriesContainer);
        inquiriesRoot.render(
            <StyledEngineProvider injectFirst>
                {view === 'details' ? (
                    <InquiryDetails inquiryId={inquiryId} />
                ) : (
                    <InquiriesPage />
                )}
            </StyledEngineProvider>
        );
    }
});