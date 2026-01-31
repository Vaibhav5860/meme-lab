/**
 * Settings Module
 * Handles theme, sound, stats, streak, and achievements
 */

/**
 * Achievements definitions
 */
const achievements = [
    { id: 'first', name: 'First Meme', desc: 'View your first meme', check: () => window.MemeState.state.stats.viewed >= 1, icon: '🎯' },
    { id: 'ten', name: 'Meme Explorer', desc: 'View 10 memes', check: () => window.MemeState.state.stats.viewed >= 10, icon: '🔍' },
    { id: 'fifty', name: 'Meme Enthusiast', desc: 'View 50 memes', check: () => window.MemeState.state.stats.viewed >= 50, icon: '⭐' },
    { id: 'hundred', name: 'Meme Master', desc: 'View 100 memes', check: () => window.MemeState.state.stats.viewed >= 100, icon: '👑' },
    { id: 'fav5', name: 'Collector', desc: 'Save 5 favorites', check: () => window.MemeState.state.favorites.length >= 5, icon: '❤️' },
    { id: 'download5', name: 'Hoarder', desc: 'Download 5 memes', check: () => window.MemeState.state.stats.downloaded >= 5, icon: '📥' },
    { id: 'streak7', name: 'Weekly Warrior', desc: '7 day streak', check: () => window.MemeState.state.streak.count >= 7, icon: '🔥' }
];

/**
 * Fun facts about memes
 */
const funFacts = [
    "The word 'meme' was coined by Richard Dawkins in 1976!",
    "The first internet meme is believed to be the dancing baby from 1996.",
    "Grumpy Cat earned more than some Hollywood actors!",
    "'Rickrolling' has been viewed billions of times.",
    "The 'Doge' meme inspired a cryptocurrency worth billions!",
    "Bad Luck Brian's real name is Kyle Craven.",
    "The 'Success Kid' photo was taken in 2007.",
    "Memes spread faster than news on social media!",
    "'Pepe the Frog' first appeared in 2005.",
    "The 'Distracted Boyfriend' is a stock photo from 2015."
];

/**
 * Toggle theme
 */
function toggleTheme() {
    const { state, saveTheme } = window.MemeState;
    const { applyTheme } = window.MemeUI;
    const { sounds } = window.MemeSounds;
    
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    saveTheme();
    applyTheme();
    sounds.pop();
}

/**
 * Toggle sound
 */
function toggleSound() {
    const { state, saveSound } = window.MemeState;
    const { updateSoundIcon } = window.MemeUI;
    const { sounds } = window.MemeSounds;
    
    state.soundEnabled = !state.soundEnabled;
    saveSound();
    updateSoundIcon();
    
    if (state.soundEnabled) {
        sounds.pop();
    }
}

/**
 * Toggle fullscreen
 */
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

/**
 * Update stats display
 */
function updateStats() {
    const { updateStatsDisplay } = window.MemeUI;
    updateStatsDisplay();
}

/**
 * Update streak
 */
function updateStreak() {
    const { state, saveStreak } = window.MemeState;
    const { updateStreakDisplay } = window.MemeUI;
    
    const today = new Date().toDateString();
    
    if (state.streak.lastDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        if (state.streak.lastDate === yesterday) {
            state.streak.count++;
        } else if (state.streak.lastDate !== today) {
            state.streak.count = 1;
        }
        
        state.streak.lastDate = today;
        saveStreak();
    }
    
    updateStreakDisplay();
}

/**
 * Check and unlock achievements
 */
function checkAchievements() {
    const { loadAchievements, saveAchievements } = window.MemeState;
    const { showToast, createConfetti } = window.MemeUI;
    
    const unlocked = loadAchievements();
    
    achievements.forEach(ach => {
        if (!unlocked.includes(ach.id) && ach.check()) {
            unlocked.push(ach.id);
            saveAchievements(unlocked);
            showToast(`Achievement Unlocked: ${ach.name} ${ach.icon}`, 'success');
            createConfetti();
        }
    });

    renderAchievements(unlocked);
}

/**
 * Render achievements in sidebar
 * @param {Array} unlocked - Array of unlocked achievement IDs
 */
function renderAchievements(unlocked) {
    const container = document.getElementById('achievements');
    
    container.innerHTML = achievements.slice(0, 4).map(ach => {
        const isUnlocked = unlocked.includes(ach.id);
        return `
            <div class="achievement" style="opacity: ${isUnlocked ? 1 : 0.5}">
                <div class="achievement-icon ${isUnlocked ? 'gold' : ''}">${ach.icon}</div>
                <div class="achievement-info">
                    <h4>${ach.name}</h4>
                    <p>${ach.desc}</p>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Show random fun fact
 */
function showRandomFact() {
    const { getRandomItem } = window.MemeUtils;
    const fact = getRandomItem(funFacts);
    document.getElementById('fun-fact').textContent = fact;
}

/**
 * Setup settings event listeners
 */
function setupSettingsListeners() {
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('sound-toggle').addEventListener('click', toggleSound);
    document.getElementById('fullscreen-toggle').addEventListener('click', toggleFullscreen);
}

// Export for use in other modules
window.MemeSettings = {
    achievements,
    funFacts,
    toggleTheme,
    toggleSound,
    toggleFullscreen,
    updateStats,
    updateStreak,
    checkAchievements,
    renderAchievements,
    showRandomFact,
    setupSettingsListeners
};
