/**
 * Meme Fetching Module
 * Handles fetching memes from the API and managing meme display
 */

const API_BASE_URL = 'https://meme-api.com/gimme';

/**
 * Fetch a new meme from the API
 * @param {string} category - Subreddit category to fetch from
 */
async function getMeme(category = null) {
    const { state, saveSeenMemes, saveStats } = window.MemeState;
    const { setLoadingState, updateMemeDisplay, updateFavoriteButton, showToast } = window.MemeUI;
    const { sounds } = window.MemeSounds;
    const { addToHistory } = window.MemeHistory;
    const { checkAchievements, updateStats } = window.MemeSettings;

    const currentCategory = category || state.currentCategory;

    try {
        setLoadingState(true);

        // Fetch multiple memes to avoid repeats
        const response = await fetch(`${API_BASE_URL}/${currentCategory}/10`);
        if (!response.ok) throw new Error('Network error');

        const data = await response.json();

        // Find a meme we haven't seen
        let meme = data.memes.find(m => !state.seenMemes.has(m.url));

        // If all seen, clear some history and pick random
        if (!meme) {
            state.seenMemes.clear();
            meme = data.memes[Math.floor(Math.random() * data.memes.length)];
        }

        // Mark as seen
        state.seenMemes.add(meme.url);

        // Limit seen memes cache size
        if (state.seenMemes.size > 500) {
            const arr = Array.from(state.seenMemes);
            state.seenMemes = new Set(arr.slice(-250));
        }
        saveSeenMemes();

        // Update current meme
        state.currentMeme = meme;

        // Load image
        const { elements } = window.MemeUI;
        elements.memeImage.onload = () => {
            setLoadingState(false);
            sounds.pop();

            // Add to history
            addToHistory(meme);

            // Update stats
            state.stats.viewed++;
            saveStats();
            updateStats();
            checkAchievements();
        };

        elements.memeImage.onerror = () => {
            throw new Error('Image failed to load');
        };

        updateMemeDisplay(meme);
        updateFavoriteButton();

    } catch (error) {
        console.error('Error:', error);
        showToast('Failed to load meme. Trying again...', 'error');
        setLoadingState(false);

        // Retry with default category
        setTimeout(() => getMeme('memes'), 1000);
    }
}

/**
 * Load a specific meme from favorites or history
 * @param {number} index - Index in the source array
 * @param {string} source - Source array ('favorites' or 'history')
 */
function loadMeme(index, source) {
    const { state } = window.MemeState;
    const { updateMemeDisplay, updateFavoriteButton } = window.MemeUI;
    const { sounds } = window.MemeSounds;

    const meme = source === 'favorites' ? state.favorites[index] : state.history[index];
    if (!meme) return;

    state.currentMeme = meme;
    updateMemeDisplay(meme);
    updateFavoriteButton();
    sounds.pop();
}

/**
 * Download current meme
 */
async function downloadMeme() {
    const { state, saveStats } = window.MemeState;
    const { showToast } = window.MemeUI;
    const { sounds } = window.MemeSounds;
    const { updateStats } = window.MemeSettings;

    if (!state.currentMeme) return;

    showToast('Downloading meme... 📥', 'success');

    const imgUrl = state.currentMeme.url;
    const filename = `meme-${Date.now()}.jpg`;

    // Try direct fetch first (works for some sources like imgflip)
    try {
        const response = await fetch(imgUrl);
        if (response.ok) {
            const blob = await response.blob();
            downloadBlob(blob, filename);
            onDownloadSuccess();
            return;
        }
    } catch (e) {
        console.log('Direct fetch failed, trying proxies...');
    }

    // Use CORS proxies for Reddit images
    const corsProxies = [
        `https://corsproxy.io/?${encodeURIComponent(imgUrl)}`,
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(imgUrl)}`,
        `https://proxy.cors.sh/${imgUrl}`,
    ];

    // Try CORS proxies
    for (const proxyUrl of corsProxies) {
        try {
            const response = await fetch(proxyUrl);
            if (response.ok) {
                const blob = await response.blob();
                if (blob.size > 0) {
                    downloadBlob(blob, filename);
                    onDownloadSuccess();
                    return;
                }
            }
        } catch (e) {
            console.log('Proxy failed:', proxyUrl);
        }
    }

    // Last resort: Create a temporary anchor with the image URL
    // This works in some browsers for same-origin or CORS-enabled images
    try {
        const link = document.createElement('a');
        link.href = imgUrl;
        link.download = filename;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Assume success since we can't know for sure
        onDownloadSuccess();
        return;
    } catch (e) {
        console.log('Direct link download failed');
    }

    // Final fallback: open image in new tab for manual save
    showToast('Opening image - right-click and "Save image as..."', 'warning');
    window.open(imgUrl, '_blank');

    function downloadBlob(blob, filename) {
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl);
    }

    function onDownloadSuccess() {
        state.stats.downloaded++;
        saveStats();
        updateStats();
        sounds.download();
        showToast('Meme downloaded! 🎉', 'success');
    }
}

/**
 * Share current meme
 */
async function shareMeme() {
    const { state, saveStats } = window.MemeState;
    const { showToast } = window.MemeUI;
    const { updateStats } = window.MemeSettings;

    if (!state.currentMeme) return;

    if (navigator.share) {
        try {
            await navigator.share({
                title: state.currentMeme.title,
                text: 'Check out this meme!',
                url: state.currentMeme.postLink
            });

            state.stats.shared++;
            saveStats();
            updateStats();
            showToast('Shared successfully! 🎉', 'success');
        } catch (error) {
            // User cancelled or share failed
        }
    } else {
        copyMemeLink();
    }
}

/**
 * Copy meme link to clipboard
 */
async function copyMemeLink() {
    const { state } = window.MemeState;
    const { showToast } = window.MemeUI;
    const { sounds } = window.MemeSounds;
    const { copyToClipboard } = window.MemeUtils;

    if (!state.currentMeme) return;

    const success = await copyToClipboard(
        state.currentMeme.postLink || state.currentMeme.url
    );

    if (success) {
        showToast('Link copied to clipboard! 📋', 'success');
        sounds.success();
    } else {
        showToast('Failed to copy link', 'error');
    }
}

/**
 * Open current meme on Reddit
 */
function openInReddit() {
    const { state } = window.MemeState;

    if (!state.currentMeme || !state.currentMeme.postLink) return;
    window.open(state.currentMeme.postLink, '_blank');
}

/**
 * Surprise me - fetch from random category
 */
function surpriseMe() {
    const { state } = window.MemeState;
    const { showToast, createConfetti } = window.MemeUI;

    const surprises = ['wholesomememes', 'dankmemes', 'MemeEconomy', 'me_irl', 'AdviceAnimals'];
    const randomCategory = surprises[Math.floor(Math.random() * surprises.length)];

    // Update category button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === randomCategory);
    });

    state.currentCategory = randomCategory;
    getMeme(randomCategory);
    createConfetti();
    showToast(`Surprise! Showing ${randomCategory} 🎉`, 'success');
}

// Export for use in other modules
window.MemeMeme = {
    getMeme,
    loadMeme,
    downloadMeme,
    shareMeme,
    copyMemeLink,
    openInReddit,
    surpriseMe
};
