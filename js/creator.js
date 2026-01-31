/**
 * Meme Creator Module
 * Handles custom meme creation functionality
 */

/**
 * Popular meme templates
 */
const memeTemplates = [
    'https://i.imgflip.com/30b1gx.jpg',  // Drake
    'https://i.imgflip.com/1g8my4.jpg',  // Two Buttons
    'https://i.imgflip.com/4/1bij.jpg',  // One Does Not Simply
    'https://i.imgflip.com/1ur9b0.jpg',  // Distracted Boyfriend
    'https://i.imgflip.com/9ehk.jpg',    // Afraid To Ask Andy
    'https://i.imgflip.com/26am.jpg',    // Futurama Fry
    'https://i.imgflip.com/1otk96.jpg',  // Roll Safe
    'https://i.imgflip.com/1bhw.jpg',    // Y U No
    'https://i.imgflip.com/4t0m5.jpg',   // Change My Mind
    'https://i.imgflip.com/2/7syro.jpg'  // Batman Slapping Robin
];

/**
 * Open meme creator modal
 */
function openCreator() {
    document.getElementById('creator-modal').classList.add('active');
    randomTemplate();
    
    // Clear inputs
    document.getElementById('top-text-input').value = '';
    document.getElementById('bottom-text-input').value = '';
    updateCreatorText();
}

/**
 * Close meme creator modal
 */
function closeCreator() {
    document.getElementById('creator-modal').classList.remove('active');
}

/**
 * Load random template
 */
function randomTemplate() {
    const { getRandomItem } = window.MemeUtils;
    const template = getRandomItem(memeTemplates);
    document.getElementById('creator-image').src = template;
}

/**
 * Update creator preview text
 */
function updateCreatorText() {
    const topText = document.getElementById('top-text-input').value || 'TOP TEXT';
    const bottomText = document.getElementById('bottom-text-input').value || 'BOTTOM TEXT';
    
    document.getElementById('top-text').textContent = topText;
    document.getElementById('bottom-text').textContent = bottomText;
}

/**
 * Download created meme
 * Note: For a full implementation, you would use html2canvas or similar
 */
async function downloadCreatedMeme() {
    const { showToast } = window.MemeUI;
    
    showToast('Creating your meme... 🎨', 'success');
    
    try {
        // Simple approach: download the template
        // For full text overlay, you would need html2canvas
        const link = document.createElement('a');
        link.download = 'my-meme.jpg';
        link.href = document.getElementById('creator-image').src;
        link.click();
        
        showToast('Template downloaded! Add text using an image editor.', 'success');
    } catch (error) {
        showToast('Download the template and add text manually!', 'warning');
    }
}

/**
 * Upload custom image for meme
 */
function uploadCustomImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                document.getElementById('creator-image').src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

/**
 * Adjust text size
 * @param {string} position - 'top' or 'bottom'
 * @param {number} change - Size change in rem
 */
function adjustTextSize(position, change) {
    const element = document.getElementById(`${position}-text`);
    const currentSize = parseFloat(getComputedStyle(element).fontSize);
    const newSize = Math.max(12, Math.min(48, currentSize + change));
    element.style.fontSize = newSize + 'px';
}

// Export for use in other modules
window.MemeCreator = {
    openCreator,
    closeCreator,
    randomTemplate,
    updateCreatorText,
    downloadCreatedMeme,
    uploadCustomImage,
    adjustTextSize,
    memeTemplates
};
