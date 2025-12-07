// ======================================
// GLOBAL VARIABLES AND INITIALIZATION
// ======================================
window.currentNews = { tech: [], finance: [], gambling: [], fashion: [], lifestyle: [] };
window.isAdminMode = false;
window.wallItems = [];

// ======================================
// MOBILE MENU FUNCTIONS
// ======================================

window.toggleMobileMenu = function() {
    console.log('📱 Toggling mobile menu...');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
    }
};

window.closeMobileMenu = function() {
    console.log('📱 Closing mobile menu...');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) hamburger.classList.remove('active');
    if (navLinks) navLinks.classList.remove('active');
    document.body.style.overflow = 'auto';
};

// ======================================
// WALL WELCOME MODAL FUNCTIONS
// ======================================
window.showWallWelcomeModal = function() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('wall-welcome-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'wall-welcome-modal';
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-modal-content" style="max-width: 550px; text-align: center;">
                <span class="auth-modal-close" onclick="closeWallWelcomeModal()">&times;</span>
                
                <div style="margin-bottom: 30px;">
                    <div style="font-size: 5rem; margin-bottom: 20px; animation: float 3s ease-in-out infinite;">🎁</div>
                    <h2 style="color: #00d4ff; margin: 0 0 15px 0; font-size: 1.8rem;">Welcome to The Wall</h2>
                    <p style="color: #888; font-size: 1.1rem; margin: 0;">Your Gateway to Rewards & Gift Cards</p>
                </div>

                <div style="background: linear-gradient(135deg, rgba(0,212,255,0.08), rgba(157,0,255,0.08)); border-radius: 16px; padding: 25px; margin-bottom: 25px; text-align: left;">
                    <div style="display: grid; gap: 18px;">
                        <div style="display: flex; align-items: flex-start; gap: 15px;">
                            <div style="background: linear-gradient(135deg, #00d4ff, #0099cc); width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <span style="font-size: 1.3rem;">💰</span>
                            </div>
                            <div>
                                <h4 style="color: #fff; margin: 0 0 5px 0; font-size: 1rem;">Earn During Your Free Time</h4>
                                <p style="color: #aaa; margin: 0; font-size: 0.9rem; line-height: 1.5;">Complete simple surveys, tasks, and offers to earn rewards at your own pace.</p>
                            </div>
                        </div>
                        
                        <div style="display: flex; align-items: flex-start; gap: 15px;">
                            <div style="background: linear-gradient(135deg, #00ff88, #00cc6a); width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <span style="font-size: 1.3rem;">🎴</span>
                            </div>
                            <div>
                                <h4 style="color: #fff; margin: 0 0 5px 0; font-size: 1rem;">Redeem for Gift Cards</h4>
                                <p style="color: #aaa; margin: 0; font-size: 0.9rem; line-height: 1.5;">Exchange your earnings for popular gift cards from Amazon, Steam, PayPal, and more.</p>
                            </div>
                        </div>
                        
                        <div style="display: flex; align-items: flex-start; gap: 15px;">
                            <div style="background: linear-gradient(135deg, #9d00ff, #7700cc); width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <span style="font-size: 1.3rem;">⚡</span>
                            </div>
                            <div>
                                <h4 style="color: #fff; margin: 0 0 5px 0; font-size: 1rem;">Quick & Easy Process</h4>
                                <p style="color: #aaa; margin: 0; font-size: 0.9rem; line-height: 1.5;">Weekly payouts every Friday. Track your progress in real-time on your dashboard.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <p style="color: #666; font-size: 0.9rem; margin-bottom: 25px;">Sign in or create an account to start earning today!</p>

                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button onclick="closeWallWelcomeModal(); openAuthModal('login');" class="auth-submit-btn" style="background: linear-gradient(135deg, #00d4ff, #0099cc); display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; font-size: 1rem;">
                        🔐 Login / Sign Up
                    </button>
                    <button onclick="closeWallWelcomeModal();" style="background: rgba(255,255,255,0.1); color: #fff; border: 2px solid rgba(255,255,255,0.2); padding: 14px 28px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 1rem; transition: all 0.3s ease;">
                        Maybe Later
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add floating animation style if not exists
        if (!document.getElementById('wall-welcome-styles')) {
            const style = document.createElement('style');
            style.id = 'wall-welcome-styles';
            style.textContent = `
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                #wall-welcome-modal .auth-modal-content {
                    animation: slideDown 0.3s ease-out;
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    modal.style.display = 'block';
};

window.closeWallWelcomeModal = function() {
    const modal = document.getElementById('wall-welcome-modal');
    if (modal) {
        modal.style.display = 'none';
    }
};

// ======================================
// NAVIGATION FUNCTIONS WITH AUTH CHECK
// ======================================
window.showPage = function(pageName) {
    console.log('📄 Navigating to:', pageName);
    
    // ⭐ CHECK AUTHENTICATION FOR WALL PAGE - Show welcome modal instead of just login
    if (pageName === 'wall') {
        if (!window.currentUser) {
            console.log('🔒 Wall page requires authentication');
            // Show wall welcome modal with info about the wall
            showWallWelcomeModal();
            return; // Stop navigation
        }
    }
    
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show target page
    const targetPage = document.getElementById(pageName + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update navigation
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => link.classList.remove('active'));
    
    const activeNav = document.getElementById('nav-' + pageName);
    if (activeNav) {
        activeNav.classList.add('active');
    }
    
    // Load wall page content
    // In app.js - Update the wall page section
if (pageName === 'wall') {
    console.log('🎯 Loading Wall page with card layout...');
    
    // ⭐ CHECK IF USER HAS SEEN GUIDELINES (First-time check)
    checkFirstWallVisit();
    
    if (window.isAdminMode) {
        // Admin sees templates
        const wallContent = document.getElementById('wall-content');
        if (wallContent) {
            wallContent.innerHTML = '<div class="empty-state"><div class="icon">📝</div><h3>Select a Template</h3><p>Choose a template from the sidebar to start creating your content.</p></div>';
        }
    } else {
        // Regular users see offers in card layout
        console.log('💰 User mode - loading offers in card layout');
        
        // Clear any existing content first
        const wallContent = document.getElementById('wall-content');
        if (wallContent) {
            wallContent.innerHTML = `
                <div id="public-wall">
                    <div style="text-align: center; color: #888; padding: 60px 20px;">
                        <div class="loading-spinner"></div>
                        <p style="margin-top: 20px; font-size: 1.1rem;">Preparing offer networks...</p>
                    </div>
                </div>
            `;
        }
        
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
            if (typeof loadPublicWall === 'function') {
                loadPublicWall();
            }
        }, 100);
    }
}

     // ⭐ INITIALIZE VIRAL PAGE
    if (pageName === 'viral') {
        console.log('🔥 Loading Viral page...');
        if (typeof initViralPage === 'function') {
            initViralPage();
        }
    }
    
    // ⭐ INITIALIZE DISCOVER PAGE
    if (pageName === 'discover') {
        console.log('✨ Loading Discover page...');
        if (typeof initDiscoverPage === 'function') {
            initDiscoverPage();
        }
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
};

// ======================================
// POST CARD CREATION
// ======================================
function createPostCard(post, section) {
    const date = new Date(post.published_at).toLocaleDateString();
    const excerpt = post.excerpt || (post.content ? post.content.substring(0, 120) + '...' : '');
    const imageUrl = post.image_url;
    
    // Get section-specific icon for placeholder
    const getPlaceholderIcon = (category) => {
        switch(category) {
            case 'tech': return '💻';
            case 'finance': return '💰';
            case 'gambling': return '🎰';
            case 'fashion': return '👗';
            case 'lifestyle': return '🌟';
            default: return '📰';
        }
    };
    
    const placeholderIcon = getPlaceholderIcon(section);
    
    return `
        <div class="post-card ${section}">
            <div class="image-preview">
                ${imageUrl ? 
                    `<img src="${imageUrl}" alt="${post.title}" onerror="this.parentElement.innerHTML='<div class=\\'image-placeholder\\'><span>${placeholderIcon}</span><p>Featured Image</p></div>'">` :
                    `<div class="image-placeholder"><span>${placeholderIcon}</span><p>Featured Image</p></div>`
                }
            </div>
            <h3>${post.title}</h3>
            <div class="meta">${date} • ${section}</div>
            <p>${excerpt}</p>
            <a class="read-more" href="${post.external_url || '#'}" target="_blank" rel="noopener noreferrer">Read More →</a>
        </div>
    `;
}

function loadPostsForPage(pageName) {
    console.log('📄 Loading posts for page:', pageName);
    
    if (window.currentNews[pageName] && window.currentNews[pageName].length > 0) {
        const postsContainer = document.getElementById(`${pageName}-posts`);
        if (postsContainer) {
            postsContainer.innerHTML = window.currentNews[pageName]
                .map(post => createPostCard(post, pageName))
                .join('');
        }
    }
}

// ======================================
// INITIALIZATION
// ======================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Stellar...');
    
    // Display placeholder content immediately
    displayPlaceholderContent();
    
    // Fetch fresh news in background
    setTimeout(() => {
        fetchLatestNews();
    }, 500);
    
    console.log('✅ Stellar initialized successfully!');
});