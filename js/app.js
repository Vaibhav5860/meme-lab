/**
 * Main Application Module
 * Initializes and coordinates all other modules
 */

/**
 * Initialize the application
 */
function initApp() {
    console.log('🎭 Meme Lab initializing...');
    
    // Show privacy consent banner if needed
    window.MemePrivacy.showConsentBanner();
    
    // Load state from localStorage
    window.MemeState.loadState();
    
    // Initialize UI elements
    window.MemeUI.initElements();
    
    // Apply saved theme
    window.MemeUI.applyTheme();
    
    // Update sound icon
    window.MemeUI.updateSoundIcon();
    
    // Update stats display
    window.MemeSettings.updateStats();
    
    // Update streak
    window.MemeSettings.updateStreak();
    
    // Render favorites and history
    window.MemeFavorites.renderFavorites();
    window.MemeHistory.renderHistory();
    
    // Setup category listeners
    window.MemeCategories.setupCategoryListeners();
    
    // Setup keyboard shortcuts
    window.MemeKeyboard.setupKeyboardShortcuts();
    
    // Setup settings listeners
    window.MemeSettings.setupSettingsListeners();
    
    // Setup mobile listeners
    window.MemeMobile.setupMobileListeners();
    
    // Check achievements
    window.MemeSettings.checkAchievements();
    
    // Show random fact
    window.MemeSettings.showRandomFact();
    
    // Load initial meme
    window.MemeMeme.getMeme();
    
    console.log('🎭 Meme Lab ready!');
}

// Global functions for HTML onclick handlers
window.getMeme = () => window.MemeMeme.getMeme();
window.toggleFavorite = () => window.MemeFavorites.toggleFavorite();
window.downloadMeme = () => window.MemeMeme.downloadMeme();
window.shareMeme = () => window.MemeMeme.shareMeme();
window.copyMemeLink = () => window.MemeMeme.copyMemeLink();
window.openInReddit = () => window.MemeMeme.openInReddit();
window.surpriseMe = () => window.MemeMeme.surpriseMe();

window.startSlideshow = () => window.MemeSlideshow.startSlideshow();
window.stopSlideshow = () => window.MemeSlideshow.stopSlideshow();
window.toggleSlideshowPlay = () => window.MemeSlideshow.toggleSlideshowPlay();
window.slideshowPrev = () => window.MemeSlideshow.slideshowPrev();
window.slideshowNext = () => window.MemeSlideshow.slideshowNext();

window.openCreator = () => window.MemeCreator.openCreator();
window.closeCreator = () => window.MemeCreator.closeCreator();
window.randomTemplate = () => window.MemeCreator.randomTemplate();
window.updateCreatorText = () => window.MemeCreator.updateCreatorText();
window.downloadCreatedMeme = () => window.MemeCreator.downloadCreatedMeme();

window.playQuiz = () => window.MemeQuiz.playQuiz();
window.closeQuiz = () => window.MemeQuiz.closeQuiz();

window.playJokes = () => window.MemeJokes.openJokes();
window.closeJokes = () => window.MemeJokes.closeJokes();

window.playJokesApi = () => window.MemeJokesApi.openJokes();
window.closeJokesApi = () => window.MemeJokesApi.closeJokes();

window.toggleMobileMenu = (section) => window.MemeMobile.toggleMobileMenu(section);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);

// Export for potential external use
window.MemeApp = {
    init: initApp
};
