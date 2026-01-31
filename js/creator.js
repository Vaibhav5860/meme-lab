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
 * Uses canvas to render image with text overlay
 */
async function downloadCreatedMeme() {
    const { showToast } = window.MemeUI;
    
    showToast('Creating your meme... 🎨', 'success');
    
    const imgElement = document.getElementById('creator-image');
    const topText = document.getElementById('top-text-input').value || 'TOP TEXT';
    const bottomText = document.getElementById('bottom-text-input').value || 'BOTTOM TEXT';
    const imgSrc = imgElement.src;
    
    // Check if it's a data URL (uploaded image) - can use directly
    if (imgSrc.startsWith('data:')) {
        renderAndDownload(imgElement, topText, bottomText);
        return;
    }
    
    // For external URLs, fetch and convert to blob first to avoid CORS
    try {
        const response = await fetch(imgSrc);
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        
        const img = new Image();
        img.onload = () => {
            renderAndDownload(img, topText, bottomText);
            URL.revokeObjectURL(objectUrl);
        };
        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            // Fallback: try with crossOrigin
            tryWithCrossOrigin(imgSrc, topText, bottomText);
        };
        img.src = objectUrl;
        
    } catch (error) {
        console.warn('Fetch failed, trying crossOrigin approach:', error);
        tryWithCrossOrigin(imgSrc, topText, bottomText);
    }
}

/**
 * Try loading image with crossOrigin attribute
 */
function tryWithCrossOrigin(imgSrc, topText, bottomText) {
    const { showToast } = window.MemeUI;
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
        renderAndDownload(img, topText, bottomText);
    };
    img.onerror = () => {
        showToast('Cannot download this template. Try uploading your own image!', 'warning');
    };
    img.src = imgSrc;
}

/**
 * Render image with text and download
 */
function renderAndDownload(img, topText, bottomText) {
    const { showToast } = window.MemeUI;
    
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to image size
        canvas.width = img.naturalWidth || img.width || 500;
        canvas.height = img.naturalHeight || img.height || 500;
        
        // Draw image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Configure text style
        const fontSize = Math.floor(canvas.width / 12);
        ctx.font = `bold ${fontSize}px Impact, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = fontSize / 15;
        
        // Draw top text
        const topY = fontSize + 10;
        ctx.strokeText(topText.toUpperCase(), canvas.width / 2, topY);
        ctx.fillText(topText.toUpperCase(), canvas.width / 2, topY);
        
        // Draw bottom text
        const bottomY = canvas.height - 15;
        ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, bottomY);
        ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, bottomY);
        
        // Convert to blob and download
        canvas.toBlob((blob) => {
            if (blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `meme-${Date.now()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                showToast('Meme downloaded! 🎉', 'success');
            } else {
                showToast('Failed to create image. Try uploading your own!', 'warning');
            }
        }, 'image/png');
        
    } catch (error) {
        console.error('Render failed:', error);
        showToast('Failed to create meme. Try uploading your own image!', 'warning');
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
