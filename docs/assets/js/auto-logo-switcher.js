/**
 * Dynamic Logo Switcher for Auto Color Scheme
 * 
 * This script dynamically switches between light and dark mode logos
 * based on the user's system color scheme preference.
 * 
 * It also listens for changes in the color scheme preference and
 * updates the logo accordingly.
 */

(function() {
  'use strict';
  
  // Configuration
  const LOGO_LIGHT = '/assets/logo/smarkform.svg';
  const LOGO_DARK = '/assets/logo/smarkform_dark.svg';
  
  // Function to update logo based on color scheme
  function updateLogo() {
    const logoElement = document.querySelector('.site-logo');
    
    if (!logoElement) {
      return; // Exit if logo element doesn't exist
    }
    
    // Check if user prefers dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set the appropriate logo
    const logoUrl = prefersDark ? LOGO_DARK : LOGO_LIGHT;
    logoElement.style.backgroundImage = `url('${logoUrl}')`;
    
    // Log for debugging (can be removed in production)
    console.log(`Logo switched to ${prefersDark ? 'dark' : 'light'} mode: ${logoUrl}`);
  }
  
  // Initialize logo on page load
  function init() {
    // Update logo immediately
    updateLogo();
    
    // Listen for changes in color scheme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Modern browsers support addEventListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', function(e) {
        updateLogo();
      });
    } 
    // Fallback for older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(function(e) {
        updateLogo();
      });
    }
  }
  
  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM is already loaded
    init();
  }
})();
