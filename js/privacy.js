/**
 * Privacy Module
 * Handles user data privacy, consent, and data management
 */

const CONSENT_KEY = 'meme-privacy-consent';
const STORAGE_KEYS = [
    'meme-favorites',
    'meme-history', 
    'meme-seen',
    'meme-stats',
    'meme-streak',
    'meme-sound',
    'meme-theme',
    'meme-achievements',
    'meme-privacy-consent'
];

/**
 * Check if user has given consent for data storage
 * @returns {boolean} Whether user has consented
 */
function hasConsent() {
    return localStorage.getItem(CONSENT_KEY) === 'true';
}

/**
 * Set user consent
 * @param {boolean} consent - Whether user consents
 */
function setConsent(consent) {
    if (consent) {
        localStorage.setItem(CONSENT_KEY, 'true');
    } else {
        // If user doesn't consent, clear all data
        clearAllData();
    }
}

/**
 * Show privacy consent banner if not already consented
 */
function showConsentBanner() {
    if (hasConsent()) return;
    
    const banner = document.createElement('div');
    banner.id = 'privacy-banner';
    banner.innerHTML = `
        <div class="privacy-banner">
            <div class="privacy-content">
                <i class="fas fa-cookie-bite"></i>
                <div class="privacy-text">
                    <strong>We value your privacy!</strong>
                    <p>Meme Lab stores your preferences, favorites, and history locally on your device to enhance your experience. No data is sent to any server.</p>
                </div>
            </div>
            <div class="privacy-actions">
                <button class="btn btn-secondary" onclick="window.MemePrivacy.declineConsent()">
                    <i class="fas fa-times"></i> Decline
                </button>
                <button class="btn" onclick="window.MemePrivacy.acceptConsent()">
                    <i class="fas fa-check"></i> Accept & Continue
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(banner);
}

/**
 * Accept consent and hide banner
 */
function acceptConsent() {
    setConsent(true);
    const banner = document.getElementById('privacy-banner');
    if (banner) {
        banner.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => banner.remove(), 300);
    }
}

/**
 * Decline consent
 */
function declineConsent() {
    clearAllData();
    const banner = document.getElementById('privacy-banner');
    if (banner) banner.remove();
    
    // Show notice that some features won't work
    if (window.MemeUI) {
        window.MemeUI.showToast('Data storage disabled. Some features may not persist.', 'warning');
    }
}

/**
 * Clear all stored data
 */
function clearAllData() {
    STORAGE_KEYS.forEach(key => {
        localStorage.removeItem(key);
    });
    
    // Reset state if available
    if (window.MemeState) {
        const { state } = window.MemeState;
        state.favorites = [];
        state.history = [];
        state.seenMemes = new Set();
        state.stats = { viewed: 0, downloaded: 0, shared: 0 };
        state.streak = { count: 0, lastDate: '' };
    }
}

/**
 * Get storage usage info
 * @returns {Object} Storage usage details
 */
function getStorageInfo() {
    let totalSize = 0;
    const details = {};
    
    STORAGE_KEYS.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
            const size = new Blob([data]).size;
            totalSize += size;
            details[key] = formatBytes(size);
        }
    });
    
    return {
        total: formatBytes(totalSize),
        totalBytes: totalSize,
        details,
        limit: '5-10 MB',
        percentUsed: ((totalSize / (5 * 1024 * 1024)) * 100).toFixed(2) + '%'
    };
}

/**
 * Format bytes to human readable
 * @param {number} bytes - Bytes to format
 * @returns {string} Formatted string
 */
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Show data management modal
 */
function showDataManagement() {
    const info = getStorageInfo();
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'data-modal';
    modal.style.cssText = 'overflow-y: auto; padding: 2rem 1rem;';
    modal.innerHTML = `
        <span class="modal-close" onclick="this.parentElement.remove()">&times;</span>
        <div class="quiz-content" style="max-width: 450px; max-height: 85vh; overflow-y: auto; margin: auto;">
            <h2 style="margin-bottom: 1.5rem;"><i class="fas fa-database"></i> Your Data</h2>
            
            <div style="text-align: left; margin-bottom: 1.5rem;">
                <p style="margin-bottom: 1rem; color: var(--text-muted);">
                    All data is stored locally on your device. Nothing is sent to any server.
                </p>
                
                <div style="background: var(--bg-darker); padding: 1rem; border-radius: 12px; margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>Total Storage Used:</span>
                        <strong style="color: var(--primary);">${info.total}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Browser Limit:</span>
                        <span>${info.limit}</span>
                    </div>
                </div>
                
                <h4 style="margin-bottom: 0.5rem;">Storage Breakdown:</h4>
                <ul style="font-size: 0.85rem; color: var(--text-muted);">
                    ${Object.entries(info.details).map(([key, size]) => 
                        `<li style="margin-bottom: 0.25rem;">${key.replace('meme-', '')}: ${size}</li>`
                    ).join('')}
                </ul>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                <button class="btn btn-secondary" onclick="window.MemePrivacy.exportData()">
                    <i class="fas fa-download"></i> Export My Data
                </button>
                <button class="btn btn-danger" onclick="window.MemePrivacy.confirmClearData()">
                    <i class="fas fa-trash"></i> Clear All Data
                </button>
                <button class="btn" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-check"></i> Back To Meme
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

/**
 * Confirm before clearing data
 */
function confirmClearData() {
    if (confirm('Are you sure you want to delete all your data? This includes favorites, history, achievements, and preferences. This cannot be undone!')) {
        clearAllData();
        document.getElementById('data-modal')?.remove();
        
        // Refresh UI
        if (window.MemeFavorites) window.MemeFavorites.renderFavorites();
        if (window.MemeHistory) window.MemeHistory.renderHistory();
        if (window.MemeSettings) {
            window.MemeSettings.updateStats();
            window.MemeSettings.checkAchievements();
        }
        if (window.MemeUI) {
            window.MemeUI.showToast('All data cleared successfully!', 'success');
        }
    }
}

/**
 * Export user data as JSON file
 */
function exportData() {
    const data = {};
    
    STORAGE_KEYS.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
            try {
                data[key] = JSON.parse(value);
            } catch {
                data[key] = value;
            }
        }
    });
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `meme-lab-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    if (window.MemeUI) {
        window.MemeUI.showToast('Data exported successfully!', 'success');
    }
}

/**
 * Safe localStorage wrapper that checks consent
 */
const safeStorage = {
    setItem: (key, value) => {
        if (hasConsent() || key === CONSENT_KEY) {
            localStorage.setItem(key, value);
        }
    },
    getItem: (key) => {
        return localStorage.getItem(key);
    },
    removeItem: (key) => {
        localStorage.removeItem(key);
    }
};

// Export for use in other modules
window.MemePrivacy = {
    hasConsent,
    setConsent,
    showConsentBanner,
    acceptConsent,
    declineConsent,
    clearAllData,
    getStorageInfo,
    showDataManagement,
    confirmClearData,
    exportData,
    safeStorage,
    STORAGE_KEYS
};
