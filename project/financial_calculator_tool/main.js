// Import all calculator modules
import * as Compound from './modules/compound.js';
import * as Amortization from './modules/amortization.js';
import * as ROI from './modules/roi.js';
import * as Inflation from './modules/inflation.js';

// Map routes to modules
const routes = {
    'compound': Compound,
    'amortization': Amortization,
    'roi': ROI,
    'inflation': Inflation
};

const appDiv = document.getElementById('app');
const navLinks = document.querySelectorAll('.nav-link');

// Function to load a specific module
function loadRoute(routeName) {
    const module = routes[routeName];
    
    // Reset Active Class on Sidebar
    navLinks.forEach(link => {
        link.classList.remove('active');
        if(link.dataset.target === routeName) link.classList.add('active');
    });

    if (module) {
        // 1. Inject the HTML template
        appDiv.innerHTML = module.getTemplate();
        // 2. Initialize the Event Listeners for that specific calculator
        module.init();
    } else {
        appDiv.innerHTML = `<div class="welcome-screen"><h3>Select a tool from the menu.</h3></div>`;
    }
}

// Handle Hash Changes (Navigation)
window.addEventListener('hashchange', () => {
    // Remove the '#' from the hash
    const route = window.location.hash.slice(1);
    loadRoute(route);
});

// Load initial route on page load
window.addEventListener('DOMContentLoaded', () => {
    const route = window.location.hash.slice(1) || 'compound'; // Default to compound
    loadRoute(route);
});