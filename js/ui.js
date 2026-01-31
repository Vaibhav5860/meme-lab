/**
 * UI Module
 * Handles UI updates, toasts, confetti, and visual feedback
 */

/**
 * DOM Elements cache
 */
const elements = {
    memeImage: null,
    memeTitle: null,
    memeSubreddit: null,
    memeUpvotes: null,
    memeAuthor: null,
    memeTime: null,
    generateBtn: null,
    loader: null,
    favoriteBtn: null,
    toastContainer: null
};

/**
 * Initialize DOM element references
 */
function initElements() {
    elements.memeImage = document.getElementById('meme-image');
    elements.memeTitle = document.getElementById('meme-title');
    elements.memeSubreddit = document.getElementById('meme-subreddit');
    elements.memeUpvotes = document.getElementById('meme-upvotes');
    elements.memeAuthor = document.getElementById('meme-author');
    elements.memeTime = document.getElementById('meme-time');
    elements.generateBtn = document.getElementById('generate-btn');
    elements.loader = document.getElementById('loader');
    elements.favoriteBtn = document.getElementById('favorite-btn');
    elements.toastContainer = document.getElementById('toast-container');
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of toast (success, error, warning, info)
 */
function showToast(message, type = 'info') {
    const container = elements.toastContainer || document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconMap = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    toast.innerHTML = `<i class="fas fa-${iconMap[type] || 'info-circle'}"></i> ${message}`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Create confetti animation
 */
function createConfetti() {
    const colors = ['#667eea', '#f093fb', '#4fd1c5', '#f6ad55', '#fc8181', '#48bb78'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 4000);
    }
}

/**
 * Update stats display
 */
function updateStatsDisplay() {
    const { state } = window.MemeState;
    
    document.getElementById('memes-viewed').textContent = state.stats.viewed;
    document.getElementById('favorites-count').textContent = state.favorites.length;
    document.getElementById('downloads-count').textContent = state.stats.downloaded;
    document.getElementById('shared-count').textContent = state.stats.shared;
}

/**
 * Update streak display
 */
function updateStreakDisplay() {
    const { state } = window.MemeState;
    document.getElementById('streak-count').textContent = state.streak.count;
}

/**
 * Set loading state for meme display
 * @param {boolean} isLoading - Whether loading is in progress
 */
function setLoadingState(isLoading) {
    if (isLoading) {
        elements.generateBtn.disabled = true;
        elements.generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        elements.loader.style.display = 'block';
        elements.memeImage.classList.add('loading');
    } else {
        elements.generateBtn.disabled = false;
        elements.generateBtn.innerHTML = '<i class="fas fa-random"></i> New Meme';
        elements.loader.style.display = 'none';
        elements.memeImage.classList.remove('loading');
    }
}

/**
 * Update meme display with new meme data
 * @param {Object} meme - Meme data object
 */
function updateMemeDisplay(meme) {
    const { formatNumber } = window.MemeUtils;
    
    elements.memeImage.src = meme.url;
    elements.memeImage.style.display = 'block';
    elements.memeTitle.textContent = meme.title;
    elements.memeSubreddit.textContent = `r/${meme.subreddit}`;
    elements.memeUpvotes.textContent = formatNumber(meme.ups);
    elements.memeAuthor.textContent = meme.author;
    elements.memeTime.textContent = 'Just now';
}

/**
 * Update favorite button state
 */
function updateFavoriteButton() {
    const { state } = window.MemeState;
    
    if (!state.currentMeme) return;
    
    const isFavorite = state.favorites.some(f => f.url === state.currentMeme.url);
    elements.favoriteBtn.innerHTML = isFavorite ? 
        '<i class="fas fa-heart"></i>' : 
        '<i class="far fa-heart"></i>';
    elements.favoriteBtn.classList.toggle('active', isFavorite);
}

/**
 * Update theme icon
 */
function updateThemeIcon() {
    const { state } = window.MemeState;
    const icon = document.querySelector('#theme-toggle i');
    icon.className = state.theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

/**
 * Update sound icon
 */
function updateSoundIcon() {
    const { state } = window.MemeState;
    const icon = document.querySelector('#sound-toggle i');
    icon.className = state.soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
}

/**
 * Apply theme to document
 */
function applyTheme() {
    const { state } = window.MemeState;
    document.documentElement.setAttribute('data-theme', state.theme);
    updateThemeIcon();
}

// Export for use in other modules
window.MemeUI = {
    elements,
    initElements,
    showToast,
    createConfetti,
    updateStatsDisplay,
    updateStreakDisplay,
    setLoadingState,
    updateMemeDisplay,
    updateFavoriteButton,
    updateThemeIcon,
    updateSoundIcon,
    applyTheme
};
