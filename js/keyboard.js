/**
 * Keyboard Shortcuts Module
 * Handles keyboard shortcuts for main functions
 */

/**
 * Keyboard shortcuts map
 */
const shortcuts = {
    ' ': { action: 'newMeme', description: 'Get new meme' },
    'f': { action: 'favorite', description: 'Toggle favorite' },
    'ctrl+s': { action: 'download', description: 'Download meme' }
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
    
    // Handle Ctrl+S for download
    if (event.ctrlKey && key === 's') {
        event.preventDefault();
        window.MemeMeme.downloadMeme();
        return;
    }
    
    switch (key) {
        case ' ':
            event.preventDefault();
            window.MemeMeme.getMeme();
            break;
            
        case 'f':
            window.MemeFavorites.toggleFavorite();
            break;
    }
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
