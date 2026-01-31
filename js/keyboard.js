/**
 * Keyboard Shortcuts Module
 * Handles all keyboard interactions
 */

/**
 * Keyboard shortcuts map
 */
const shortcuts = {
    ' ': { action: 'newMeme', description: 'Get new meme' },
    'f': { action: 'favorite', description: 'Toggle favorite' },
    'd': { action: 'download', description: 'Download meme' },
    's': { action: 'slideshow', description: 'Start slideshow' },
    'Escape': { action: 'closeModals', description: 'Close modals' },
    'ArrowLeft': { action: 'slideshowPrev', description: 'Previous slide' },
    'ArrowRight': { action: 'slideshowNext', description: 'Next slide' }
};

/**
 * Setup keyboard event listeners
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', handleKeyDown);
}

/**
 * Handle keydown events
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleKeyDown(event) {
    // Ignore if typing in an input
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
    }
    
    const key = event.key.toLowerCase();
    
    switch (key) {
        case ' ':
            event.preventDefault();
            window.MemeMeme.getMeme();
            break;
            
        case 'f':
            window.MemeFavorites.toggleFavorite();
            break;
            
        case 'd':
            window.MemeMeme.downloadMeme();
            break;
            
        case 's':
            window.MemeSlideshow.startSlideshow();
            break;
            
        case 'escape':
            closeAllModals();
            break;
            
        case 'arrowleft':
            if (isSlideshowOpen()) {
                window.MemeSlideshow.slideshowPrev();
            }
            break;
            
        case 'arrowright':
            if (isSlideshowOpen()) {
                window.MemeSlideshow.slideshowNext();
            }
            break;
            
        case 'q':
            window.MemeQuiz.playQuiz();
            break;
            
        case 'c':
            window.MemeCreator.openCreator();
            break;
            
        case 't':
            window.MemeSettings.toggleTheme();
            break;
            
        case 'm':
            window.MemeSettings.toggleSound();
            break;
    }
}

/**
 * Check if slideshow modal is open
 * @returns {boolean} Whether slideshow is open
 */
function isSlideshowOpen() {
    return document.getElementById('slideshow-modal').classList.contains('active');
}

/**
 * Close all modals
 */
function closeAllModals() {
    window.MemeSlideshow.stopSlideshow();
    window.MemeQuiz.closeQuiz();
    window.MemeCreator.closeCreator();
    
    // Close mobile sidebars
    document.getElementById('sidebar-left')?.classList.remove('mobile-open');
    document.getElementById('sidebar-right')?.classList.remove('mobile-open');
}

/**
 * Get all shortcuts
 * @returns {Object} Shortcuts map
 */
function getShortcuts() {
    return shortcuts;
}

// Export for use in other modules
window.MemeKeyboard = {
    setupKeyboardShortcuts,
    handleKeyDown,
    closeAllModals,
    getShortcuts
};
