/**
 * History Module
 * Handles meme viewing history
 */

/**
 * Add meme to history
 * @param {Object} meme - Meme object to add
 */
function addToHistory(meme) {
    const { state, saveHistory } = window.MemeState;
    
    // Remove if already exists to avoid duplicates
    state.history = state.history.filter(h => h.url !== meme.url);
    
    // Add to front of history
    state.history.unshift(meme);
    
    // Limit history size
    if (state.history.length > 30) {
        state.history.pop();
    }
    
    saveHistory();
    renderHistory();
}

/**
 * Render history list in sidebar
 */
function renderHistory() {
    const { state } = window.MemeState;
    const container = document.getElementById('history-list');
    
    if (state.history.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clock"></i>
                <p>Your meme history will appear here.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = state.history.map((meme, i) => `
        <div class="history-item" onclick="window.MemeMeme.loadMeme(${i}, 'history')" title="${escapeHtml(meme.title)}">
            <img src="${meme.url}" alt="History" loading="lazy">
        </div>
    `).join('');
}

/**
 * Clear viewing history
 */
function clearHistory() {
    const { state, saveHistory } = window.MemeState;
    const { showToast } = window.MemeUI;
    
    if (confirm('Are you sure you want to clear your history?')) {
        state.history = [];
        saveHistory();
        renderHistory();
        showToast('History cleared', 'warning');
    }
}

/**
 * Get history count
 * @returns {number} Number of items in history
 */
function getHistoryCount() {
    const { state } = window.MemeState;
    return state.history.length;
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Export for use in other modules
window.MemeHistory = {
    addToHistory,
    renderHistory,
    clearHistory,
    getHistoryCount
};
