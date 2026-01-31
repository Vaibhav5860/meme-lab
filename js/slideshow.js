/**
 * Slideshow Module
 * Handles slideshow functionality for viewing meme history
 */

const SLIDESHOW_INTERVAL = 4000; // 4 seconds per slide

/**
 * Start slideshow
 */
function startSlideshow() {
    const { state } = window.MemeState;
    const { showToast } = window.MemeUI;
    
    if (state.history.length < 2) {
        showToast('View more memes first to start slideshow!', 'warning');
        return;
    }

    document.getElementById('slideshow-modal').classList.add('active');
    state.slideshowIndex = 0;
    state.slideshowPlaying = true;
    
    updateSlideshowImage();
    state.slideshowInterval = setInterval(slideshowNext, SLIDESHOW_INTERVAL);
    updateSlideshowButton();
}

/**
 * Stop slideshow
 */
function stopSlideshow() {
    const { state } = window.MemeState;
    
    document.getElementById('slideshow-modal').classList.remove('active');
    clearInterval(state.slideshowInterval);
    state.slideshowPlaying = false;
}

/**
 * Toggle slideshow play/pause
 */
function toggleSlideshowPlay() {
    const { state } = window.MemeState;
    
    state.slideshowPlaying = !state.slideshowPlaying;
    
    if (state.slideshowPlaying) {
        state.slideshowInterval = setInterval(slideshowNext, SLIDESHOW_INTERVAL);
    } else {
        clearInterval(state.slideshowInterval);
    }
    
    updateSlideshowButton();
}

/**
 * Update slideshow play/pause button
 */
function updateSlideshowButton() {
    const { state } = window.MemeState;
    const btn = document.getElementById('slideshow-play-btn');
    
    btn.innerHTML = state.slideshowPlaying ? 
        '<i class="fas fa-pause"></i> Pause' : 
        '<i class="fas fa-play"></i> Play';
}

/**
 * Go to next slide
 */
function slideshowNext() {
    const { state } = window.MemeState;
    
    state.slideshowIndex = (state.slideshowIndex + 1) % state.history.length;
    updateSlideshowImage();
}

/**
 * Go to previous slide
 */
function slideshowPrev() {
    const { state } = window.MemeState;
    
    state.slideshowIndex = (state.slideshowIndex - 1 + state.history.length) % state.history.length;
    updateSlideshowImage();
}

/**
 * Update slideshow image
 */
function updateSlideshowImage() {
    const { state } = window.MemeState;
    const meme = state.history[state.slideshowIndex];
    
    if (meme) {
        document.getElementById('slideshow-image').src = meme.url;
    }
}

/**
 * Handle keyboard navigation in slideshow
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleSlideshowKeyboard(event) {
    const { state } = window.MemeState;
    
    if (!document.getElementById('slideshow-modal').classList.contains('active')) {
        return;
    }
    
    switch (event.key) {
        case 'ArrowLeft':
            slideshowPrev();
            break;
        case 'ArrowRight':
            slideshowNext();
            break;
        case ' ':
            event.preventDefault();
            toggleSlideshowPlay();
            break;
        case 'Escape':
            stopSlideshow();
            break;
    }
}

// Export for use in other modules
window.MemeSlideshow = {
    startSlideshow,
    stopSlideshow,
    toggleSlideshowPlay,
    slideshowNext,
    slideshowPrev,
    handleSlideshowKeyboard
};
