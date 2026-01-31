/**
 * Categories Module
 * Handles meme category selection and filtering
 */

/**
 * Available categories with their icons
 */
const categories = [
    { id: 'memes', name: 'All Memes', icon: 'fa-laugh-squint' },
    { id: 'dankmemes', name: 'Dank Memes', icon: 'fa-fire-alt' },
    { id: 'wholesomememes', name: 'Wholesome', icon: 'fa-heart' },
    { id: 'me_irl', name: 'Me IRL', icon: 'fa-user' },
    { id: 'ProgrammerHumor', name: 'Programmer', icon: 'fa-code' },
    { id: 'AdviceAnimals', name: 'Animals', icon: 'fa-paw' },
    { id: 'MemeEconomy', name: 'Meme Economy', icon: 'fa-chart-line' },
    { id: 'historymemes', name: 'History', icon: 'fa-landmark' },
    { id: 'sciencememes', name: 'Science', icon: 'fa-atom' },
    { id: 'gaming', name: 'Gaming', icon: 'fa-gamepad' }
];

/**
 * Setup category button listeners
 */
function setupCategoryListeners() {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectCategory(btn.dataset.category);
        });
    });
}

/**
 * Select a category
 * @param {string} categoryId - Category ID to select
 */
function selectCategory(categoryId) {
    const { state } = window.MemeState;
    const { getMeme } = window.MemeMeme;
    
    // Update UI
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === categoryId);
    });
    
    // Update state and fetch
    state.currentCategory = categoryId;
    getMeme();
}

/**
 * Get current category
 * @returns {string} Current category ID
 */
function getCurrentCategory() {
    const { state } = window.MemeState;
    return state.currentCategory;
}

/**
 * Get category info by ID
 * @param {string} categoryId - Category ID
 * @returns {Object|null} Category info or null
 */
function getCategoryInfo(categoryId) {
    return categories.find(c => c.id === categoryId) || null;
}

/**
 * Get all categories
 * @returns {Array} Array of all categories
 */
function getAllCategories() {
    return categories;
}

// Export for use in other modules
window.MemeCategories = {
    categories,
    setupCategoryListeners,
    selectCategory,
    getCurrentCategory,
    getCategoryInfo,
    getAllCategories
};
