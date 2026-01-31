/**
 * Favorites Module
 * Handles favorite memes functionality
 */

/**
 * Toggle favorite status of current meme
 */
function toggleFavorite() {
    const { state, saveFavorites } = window.MemeState;
    const { showToast, createConfetti, updateFavoriteButton, updateStatsDisplay } = window.MemeUI;
    const { sounds } = window.MemeSounds;
    
    if (!state.currentMeme) return;

    const index = state.favorites.findIndex(f => f.url === state.currentMeme.url);
    
    if (index > -1) {
        // Remove from favorites
        state.favorites.splice(index, 1);
        showToast('Removed from favorites', 'warning');
    } else {
        // Add to favorites
        state.favorites.unshift(state.currentMeme);
        
        // Limit favorites size
        if (state.favorites.length > 50) {
            state.favorites.pop();
        }
        
        showToast('Added to favorites! ❤️', 'success');
        sounds.favorite();
        createConfetti();
    }

    saveFavorites();
    updateFavoriteButton();
    renderFavorites();
    updateStatsDisplay();
}

/**
 * Render favorites list in sidebar
 */
function renderFavorites() {
    const { state } = window.MemeState;
    const container = document.getElementById('favorites-list');
    
    if (state.favorites.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="far fa-heart"></i>
                <p>No favorites yet!<br>Click the heart to save memes.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = state.favorites.map((meme, i) => `
        <div class="favorite-item" onclick="window.MemeMeme.loadMeme(${i}, 'favorites')">
            <img src="${meme.url}" alt="Favorite" loading="lazy">
            <span class="favorite-item-title">${escapeHtml(meme.title)}</span>
            <i class="fas fa-times favorite-item-remove" onclick="event.stopPropagation(); window.MemeFavorites.removeFavorite(${i})"></i>
        </div>
    `).join('');
}

/**
 * Remove a favorite by index
 * @param {number} index - Index of favorite to remove
 */
function removeFavorite(index) {
    const { state, saveFavorites } = window.MemeState;
    const { showToast, updateFavoriteButton, updateStatsDisplay } = window.MemeUI;
    
    state.favorites.splice(index, 1);
    saveFavorites();
    renderFavorites();
    updateFavoriteButton();
    updateStatsDisplay();
    showToast('Removed from favorites', 'warning');
}

/**
 * Clear all favorites
 */
function clearFavorites() {
    const { state, saveFavorites } = window.MemeState;
    const { showToast, updateFavoriteButton, updateStatsDisplay } = window.MemeUI;
    
    if (confirm('Are you sure you want to clear all favorites?')) {
        state.favorites = [];
        saveFavorites();
        renderFavorites();
        updateFavoriteButton();
        updateStatsDisplay();
        showToast('All favorites cleared', 'warning');
    }
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
window.MemeFavorites = {
    toggleFavorite,
    renderFavorites,
    removeFavorite,
    clearFavorites
};
