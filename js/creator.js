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

// State for text styles
const textStyles = {
    color: '#ffffff',
    top: { size: 40 },
    bottom: { size: 40 }
};

/**
 * Open meme creator modal
 */
function openCreator() {
    document.getElementById('creator-modal').classList.add('active');
    randomTemplate();
    resetCreator();
}

/**
 * Reset creator inputs and styles
 */
function resetCreator() {
    // Clear text inputs
    document.getElementById('top-text-input').value = '';
    document.getElementById('bottom-text-input').value = '';

    // Reset styles state
    textStyles.color = '#ffffff';
    textStyles.top.size = 40;
    textStyles.bottom.size = 40;

    // Reset inputs
    document.getElementById('text-color-input').value = '#ffffff';
    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach(s => s.value = 40);

    // Update UI
    updateCreatorText();
    updateTextStyle('color', '#ffffff');
    updateTextStyle('top', 'size', 40);
    updateTextStyle('bottom', 'size', 40);
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
 * Update text styles (color, size)
 * @param {string} target - 'top' | 'bottom' | 'color'
 * @param {string|number} property - 'size' or value if target is color
 * @param {number} value - Value if target is not color
 */
function updateTextStyle(target, property, value) {
    if (target === 'color') {
        textStyles.color = property; // property is value here
        const color = property;
        document.getElementById('top-text').style.color = color;
        document.getElementById('bottom-text').style.color = color;
    } else {
        textStyles[target][property] = value;
        const element = document.getElementById(`${target}-text`);
        // Map range 20-80 to reasonable rem/px values for preview
        // Using px for easier calculation: range value = px
        // Scale relative to container width? Just direct px is fine for preview
        element.style.fontSize = `${value / 16}rem`;
    }
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

        // Use natural size for high quality
        canvas.width = img.naturalWidth || img.width || 500;
        canvas.height = img.naturalHeight || img.height || 500;

        // Draw image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Calculate style ratios based on Preview
        // We need to know how big the text is relative to the *displayed* image
        const previewImg = document.getElementById('creator-image');
        const displayedWidth = previewImg.clientWidth || 1; // avoid divide by zero
        // Ratio = NewCanvasWidth / DisplayedWidth
        const scaleRatio = canvas.width / displayedWidth;

        // Configure common text style
        ctx.textAlign = 'center';
        ctx.fillStyle = textStyles.color;
        ctx.strokeStyle = 'black';
        ctx.lineJoin = 'round';

        // Helper to draw text
        const drawText = (text, position) => {
            // Calculate font size
            // Default size in CSS is rem, state has raw value (roughly equivalent to px in standard view)
            // But we modified the DOM element style directly in updateTextStyle
            const textEl = document.getElementById(`${position}-text`);
            const computedStyle = window.getComputedStyle(textEl);
            const displayedFontSize = parseFloat(computedStyle.fontSize);

            const fontSize = displayedFontSize * scaleRatio;

            ctx.font = `bold ${fontSize}px Impact, sans-serif`;
            ctx.lineWidth = fontSize / 15;

            const x = canvas.width / 2;
            // Calculate Y position
            // Top is simple (padding from top)
            // Bottom is padding from bottom
            // We use a relative padding like 5% of height
            let y;
            if (position === 'top') {
                y = fontSize * 1.2; // Approximate top padding + line height
            } else {
                y = canvas.height - (fontSize * 0.5); // Bottom padding
            }

            ctx.strokeText(text.toUpperCase(), x, y);
            ctx.fillText(text.toUpperCase(), x, y);
        };

        drawText(topText, 'top');
        drawText(bottomText, 'bottom');

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

// Export for use in other modules
window.MemeCreator = {
    openCreator,
    closeCreator,
    randomTemplate,
    updateCreatorText,
    updateTextStyle,
    downloadCreatedMeme,
    uploadCustomImage,
    memeTemplates
};
