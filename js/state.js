/**
 * State Management Module
 * Handles all application state and localStorage persistence
 */

const state = {
    currentMeme: null,
    currentCategory: 'memes',
    favorites: [],
    history: [],
    seenMemes: new Set(),
    stats: { viewed: 0, downloaded: 0, shared: 0 },
    streak: { count: 0, lastDate: '' },
    soundEnabled: true,
    theme: 'dark',
    slideshowInterval: null,
    slideshowPlaying: false,
    slideshowIndex: 0,
    quizScore: 0
};

/**
 * Load state from localStorage
 */
function loadState() {
    try {
        state.favorites = JSON.parse(localStorage.getItem('meme-favorites') || '[]');
        state.history = JSON.parse(localStorage.getItem('meme-history') || '[]');
        state.seenMemes = new Set(JSON.parse(localStorage.getItem('meme-seen') || '[]'));
        state.stats = JSON.parse(localStorage.getItem('meme-stats') || '{"viewed":0,"downloaded":0,"shared":0}');
        state.streak = JSON.parse(localStorage.getItem('meme-streak') || '{"count":0,"lastDate":""}');
        state.soundEnabled = localStorage.getItem('meme-sound') !== 'false';
        state.theme = localStorage.getItem('meme-theme') || 'dark';
    } catch (error) {
        console.error('Error loading state:', error);
    }
}

/**
 * Save favorites to localStorage
 */
function saveFavorites() {
    localStorage.setItem('meme-favorites', JSON.stringify(state.favorites));
}

/**
 * Save history to localStorage
 */
function saveHistory() {
    localStorage.setItem('meme-history', JSON.stringify(state.history));
}

/**
 * Save seen memes to localStorage
 */
function saveSeenMemes() {
    localStorage.setItem('meme-seen', JSON.stringify([...state.seenMemes]));
}

/**
 * Save stats to localStorage
 */
function saveStats() {
    localStorage.setItem('meme-stats', JSON.stringify(state.stats));
}

/**
 * Save streak to localStorage
 */
function saveStreak() {
    localStorage.setItem('meme-streak', JSON.stringify(state.streak));
}

/**
 * Save theme preference
 */
function saveTheme() {
    localStorage.setItem('meme-theme', state.theme);
}

/**
 * Save sound preference
 */
function saveSound() {
    localStorage.setItem('meme-sound', state.soundEnabled);
}

/**
 * Save achievements to localStorage
 * @param {Array} unlocked - Array of unlocked achievement IDs
 */
function saveAchievements(unlocked) {
    localStorage.setItem('meme-achievements', JSON.stringify(unlocked));
}

/**
 * Load achievements from localStorage
 * @returns {Array} Array of unlocked achievement IDs
 */
function loadAchievements() {
    return JSON.parse(localStorage.getItem('meme-achievements') || '[]');
}

// Export for use in other modules
window.MemeState = {
    state,
    loadState,
    saveFavorites,
    saveHistory,
    saveSeenMemes,
    saveStats,
    saveStreak,
    saveTheme,
    saveSound,
    saveAchievements,
    loadAchievements
};
