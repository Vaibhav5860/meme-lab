/**
 * Sound Effects Module
 * Handles all audio feedback in the application
 */

/**
 * Play a tone using Web Audio API
 * @param {number} frequency - Frequency in Hz
 * @param {number} duration - Duration in seconds
 */
function playTone(frequency, duration) {
    const { state } = window.MemeState;
    if (!state.soundEnabled) return;
    
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
    } catch (error) {
        // Audio not supported or blocked
        console.log('Audio playback failed:', error);
    }
}

/**
 * Sound effect presets
 */
const sounds = {
    /**
     * Play pop sound for general actions
     */
    pop: () => playTone(600, 0.1),
    
    /**
     * Play success sound for positive feedback
     */
    success: () => playTone(800, 0.15),
    
    /**
     * Play favorite sound (two-tone)
     */
    favorite: () => {
        playTone(523, 0.1);
        setTimeout(() => playTone(659, 0.1), 100);
    },
    
    /**
     * Play download sound
     */
    download: () => playTone(400, 0.2),
    
    /**
     * Play error sound
     */
    error: () => playTone(200, 0.3),
    
    /**
     * Play notification sound
     */
    notification: () => {
        playTone(440, 0.1);
        setTimeout(() => playTone(550, 0.1), 100);
        setTimeout(() => playTone(660, 0.15), 200);
    }
};

// Export for use in other modules
window.MemeSounds = {
    playTone,
    sounds
};
