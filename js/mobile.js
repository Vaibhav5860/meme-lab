/**
 * Mobile Module
 * Handles mobile-specific functionality and navigation
 */

/**
 * Current active mobile section
 */
let activeMobileSection = 'home';

/**
 * Toggle mobile menu section
 * @param {string} section - Section to toggle ('home', 'categories', 'favorites', 'history')
 */
function toggleMobileMenu(section) {
    const leftSidebar = document.getElementById('sidebar-left');
    const rightSidebar = document.getElementById('sidebar-right');
    
    // Close all sidebars first
    leftSidebar.classList.remove('mobile-open');
    rightSidebar.classList.remove('mobile-open');
    
    // Update active button
    document.querySelectorAll('.mobile-menu-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Find and activate the clicked button
    const buttons = document.querySelectorAll('.mobile-menu-btn');
    buttons.forEach(btn => {
        if (btn.textContent.toLowerCase().includes(section)) {
            btn.classList.add('active');
        }
    });
    
    // Open appropriate sidebar
    if (section === 'categories') {
        leftSidebar.classList.add('mobile-open');
        addMobileCloseButton(leftSidebar);
    } else if (section === 'favorites' || section === 'history') {
        rightSidebar.classList.add('mobile-open');
        addMobileCloseButton(rightSidebar);
    } else {
        // Home - just close sidebars
        activeMobileSection = 'home';
        const homeBtn = document.querySelector('.mobile-menu-btn');
        if (homeBtn) homeBtn.classList.add('active');
    }
    
    activeMobileSection = section;
}

/**
 * Add close button to mobile sidebar
 * @param {HTMLElement} sidebar - Sidebar element
 */
function addMobileCloseButton(sidebar) {
    // Remove existing close button if any
    const existing = sidebar.querySelector('.mobile-close-btn');
    if (existing) existing.remove();
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn btn-secondary mobile-close-btn';
    closeBtn.innerHTML = '<i class="fas fa-times"></i> Close';
    closeBtn.style.cssText = 'margin-bottom: 1rem; width: 100%;';
    closeBtn.onclick = () => closeMobileSidebars();
    
    sidebar.insertBefore(closeBtn, sidebar.firstChild);
}

/**
 * Close all mobile sidebars
 */
function closeMobileSidebars() {
    document.getElementById('sidebar-left')?.classList.remove('mobile-open');
    document.getElementById('sidebar-right')?.classList.remove('mobile-open');
    
    // Reset to home
    document.querySelectorAll('.mobile-menu-btn').forEach((btn, index) => {
        btn.classList.toggle('active', index === 0);
    });
    
    activeMobileSection = 'home';
}

/**
 * Check if device is mobile
 * @returns {boolean} Whether device is mobile
 */
function isMobile() {
    return window.innerWidth <= 1200;
}

/**
 * Setup mobile-specific event listeners
 */
function setupMobileListeners() {
    // Close sidebars when clicking outside on mobile
    document.addEventListener('click', (event) => {
        if (!isMobile()) return;
        
        const leftSidebar = document.getElementById('sidebar-left');
        const rightSidebar = document.getElementById('sidebar-right');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        const isClickInside = 
            leftSidebar?.contains(event.target) ||
            rightSidebar?.contains(event.target) ||
            mobileMenu?.contains(event.target);
        
        if (!isClickInside && (leftSidebar?.classList.contains('mobile-open') || rightSidebar?.classList.contains('mobile-open'))) {
            // Don't close immediately, let the click event propagate first
            // closeMobileSidebars();
        }
    });
    
    // Handle orientation change
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            if (!isMobile()) {
                closeMobileSidebars();
            }
        }, 100);
    });
    
    // Handle resize
    window.addEventListener('resize', () => {
        if (!isMobile()) {
            closeMobileSidebars();
        }
    });
}

/**
 * Get active mobile section
 * @returns {string} Active section name
 */
function getActiveMobileSection() {
    return activeMobileSection;
}

// Export for use in other modules
window.MemeMobile = {
    toggleMobileMenu,
    closeMobileSidebars,
    isMobile,
    setupMobileListeners,
    getActiveMobileSection
};
