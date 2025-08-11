import React from 'react';
import ReactDOM from 'react-dom';
import Topbar from './components/Topbar';

window.addEventListener('load', () => {
    const container = document.getElementById('promo-bar-x-topbar');
    if (container) {
        ReactDOM.render(<Topbar />, container);
    }
});