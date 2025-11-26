// ======================================
// DISCOVER PAGE FUNCTIONALITY
// ======================================

window.currentDiscoverPosts = [];

// Check if user is admin or creator
window.checkDiscoverAccess = async function() {
    if (!window.currentUser || !window.supabaseClient) {
        console.log('❌ No current user or supabase client');
        return false;
    }
    
    console.log('🔍 Checking discover access for user:', window.currentUser.id);
    
    try {
        // Check if admin
        const { data: adminData, error: adminError } = await window.supabaseClient
            .from('admin_users')
            .select('*')
            .eq('user_id', window.currentUser.id)
            .single();
        
        console.log('Admin check result:', { adminData, adminError });
        
        if (adminData && !adminError) {
            console.log('✅ User is admin!');
            return true;
        }
        
        // Check if creator
        const { data: creatorData, error: creatorError } = await window.supabaseClient
            .from('discover_creators')
            .select('*')
            .eq('user_id', window.currentUser.id)
            .eq('is_approved', true)
            .single();
        
        console.log('Creator check result:', { creatorData, creatorError });
        
        if (creatorData && !creatorError) {
            console.log('✅ User is approved creator!');
            return true;
        }
        
        console.log('❌ User has no discover access');
        return false;
    } catch (error) {
        console.error('Error checking discover access:', error);
        return false;
    }
}

// Show admin controls if user has access
window.initDiscoverPage = async function() {
    console.log('✨ Initializing Discover Page...');
    console.log('Current user:', window.currentUser);
    
    const hasAccess = await window.checkDiscoverAccess();
    console.log('Has discover access:', hasAccess);
    
    const adminControls = document.getElementById('discover-admin-controls');
    console.log('Admin controls element:', adminControls);
    
    if (adminControls && hasAccess) {
        console.log('✅ Showing admin controls');
        adminControls.style.display = 'block';
    } else {
        console.log('❌ Not showing admin controls. Has access:', hasAccess, 'Element exists:', !!adminControls);
    }

      const vpnAdContainer = document.getElementById('discover-vpn-ad');
    if (vpnAdContainer) {
        vpnAdContainer.innerHTML = createVPNOfferAd();
    }
    
    loadDiscoverPosts();
}

// Load discover posts from database
async function loadDiscoverPosts() {
    if (!window.supabaseClient) {
        console.error('Supabase client not initialized');
        return;
    }
    
    try {
        const { data, error } = await window.supabaseClient
            .from('discover_posts')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        window.currentDiscoverPosts = data || [];
        displayDiscoverPosts();
    } catch (error) {
        console.error('Error loading discover posts:', error);
        const container = document.getElementById('discover-posts');
        if (container) {
            container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #888; padding: 40px;"><p>Error loading discoveries. Please try again.</p></div>';
        }
    }
}

// Display discover posts
function displayDiscoverPosts() {
    const container = document.getElementById('discover-posts');
    if (!container) return;
    
    if (window.currentDiscoverPosts.length === 0) {
        container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #888; padding: 40px;"><div class="icon" style="font-size: 4rem; opacity: 0.3; margin-bottom: 20px;">✨</div><h3 style="color: #888; margin-bottom: 10px;">No discoveries yet</h3><p style="color: #666;">Check back later for exclusive discoveries!</p></div>';
        return;
    }
    
    container.innerHTML = window.currentDiscoverPosts.map(post => createDiscoverCard(post)).join('');
}

// Add to discover.js
function createVPNOfferAd() {
    return `
        <div class="vpn-organic-ad">
            <div class="vpn-ad-header">
                <h3 class="vpn-ad-title">
                    <span>🔒</span> ParudVPN for iOS
                </h3>
                <div class="vpn-ad-badge">Sponsored</div>
            </div>
            
            <div class="vpn-ad-content">
                <div class="vpn-ad-features">
                    <div class="vpn-ad-feature">
                        <div class="vpn-ad-feature-icon">🛡️</div>
                        <div class="vpn-ad-feature-text">
                            <h4>Ultimate Privacy Protection</h4>
                            <p>Bank-grade encryption keeps your data secure</p>
                        </div>
                    </div>
                    
                    <div class="vpn-ad-feature">
                        <div class="vpn-ad-feature-icon">⚡</div>
                        <div class="vpn-ad-feature-text">
                            <h4>Lightning Fast Speeds</h4>
                            <p>Stream and browse without buffering</p>
                        </div>
                    </div>
                    
                    <div class="vpn-ad-feature">
                        <div class="vpn-ad-feature-icon">🌍</div>
                        <div class="vpn-ad-feature-text">
                            <h4>Global Access</h4>
                            <p>Connect to servers in 50+ countries worldwide</p>
                        </div>
                    </div>
                </div>
                
                <div class="vpn-ad-cta">
                    <button class="vpn-ad-button" onclick="trackOrganicVPNOffer()">
                        <span>📱</span> Download for iOS
                    </button>
                    
                    <div class="vpn-ad-device">
                        <span>✅</span> Optimized for iPhone & iPad
                    </div>
                    
                    <p class="vpn-ad-note">
                        Free trial available • No credit card required
                    </p>
                </div>
            </div>
        </div>
    `;
}

// Add tracking function
function trackOrganicVPNOffer() {
    console.log('Organic VPN offer clicked');
    
    // Track the click (non-incent)
    if (window.supabaseClient && window.currentUser) {
        window.supabaseClient
            .from('offer_clicks')
            .insert({
                user_id: window.currentUser.id,
                offer_type: 'organic_vpn',
                platform: 'ios',
                created_at: new Date().toISOString()
            })
            .then(() => {
                console.log('VPN offer click tracked');
            });
    }
    
    // Redirect to offer (replace with your actual offer URL)
    window.open('https://apps.apple.com/app/parudvpn', '_blank');
    
    // Show notification
    if (typeof showNotification === 'function') {
        showNotification('Opening ParudVPN in App Store...', 'info');
    }
}

// Create discover post card
function createDiscoverCard(post) {
    const date = new Date(post.created_at).toLocaleDateString();
    const shareUrl = `${window.location.origin}${window.location.pathname}?page=discover&discover=${post.id}`;
    
    return `
        <div class="discover-card">
            <div class="discover-card-header">
                <div class="discover-icon">✨</div>
                <h3>${post.title}</h3>
            </div>
            
            ${post.image_url ? `
                <div class="discover-card-image">
                    <img src="${post.image_url}" alt="${post.title}" onerror="this.parentElement.style.display='none'">
                </div>
            ` : ''}
            
            <div class="discover-card-content">
                ${post.content}
            </div>
            
            <div class="discover-card-footer">
                <div class="discover-card-meta">
                    <span>📅 ${date}</span>
                </div>
                <div class="discover-card-actions">
                    ${post.external_link ? `
                        <a href="${post.external_link}" target="_blank" class="share-btn">🔗 Visit Link</a>
                    ` : ''}
                    <button class="share-btn" onclick="copyDiscoverLink('${shareUrl}')">📋 Copy Link</button>
                    <button class="share-btn" onclick="shareDiscoverPost('${shareUrl}', '${post.title.replace(/'/g, "\\'")}')">↗️ Share</button>
                </div>
            </div>
        </div>
    `;
}

// Copy discover post link
function copyDiscoverLink(url) {
    navigator.clipboard.writeText(url).then(() => {
        if (typeof showNotification === 'function') {
            showNotification('Link copied to clipboard!', 'success');
        } else {
            alert('Link copied!');
        }
    });
}

// Share discover post
function shareDiscoverPost(url, title) {
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).catch(() => {});
    } else {
        copyDiscoverLink(url);
    }
}

// Modal functions
function openDiscoverPostModal() {
    document.getElementById('discover-post-modal').style.display = 'block';
}

function closeDiscoverPostModal() {
    document.getElementById('discover-post-modal').style.display = 'none';
    document.getElementById('discover-post-form').reset();
}

// Submit discover post
async function submitDiscoverPost(event) {
    event.preventDefault();
    
    if (!window.currentUser || !window.supabaseClient) {
        if (typeof showNotification === 'function') {
            showNotification('Please login to create posts', 'error');
        }
        return;
    }
    
    const hasAccess = await checkDiscoverAccess();
    if (!hasAccess) {
        if (typeof showNotification === 'function') {
            showNotification('You do not have permission to create discover posts', 'error');
        }
        return;
    }
    
    const title = document.getElementById('discover-title').value;
    const content = document.getElementById('discover-content').value;
    const imageUrl = document.getElementById('discover-image').value;
    const externalLink = document.getElementById('discover-link').value;
    
    try {
        const { data, error } = await window.supabaseClient
            .from('discover_posts')
            .insert([{
                title: title,
                content: content,
                image_url: imageUrl || null,
                external_link: externalLink || null,
                author_id: window.currentUser.id,
                author_email: window.currentUser.email,
                is_published: true,
                created_at: new Date().toISOString()
            }])
            .select();
        
        if (error) throw error;
        
        if (typeof showNotification === 'function') {
            showNotification('Discovery published successfully!', 'success');
        }
        
        closeDiscoverPostModal();
        loadDiscoverPosts();
    } catch (error) {
        console.error('Error creating discover post:', error);
        if (typeof showNotification === 'function') {
            showNotification('Error publishing post: ' + error.message, 'error');
        }
    }
}

// Check for direct discover post link on page load
function checkDiscoverPostLink() {
    const urlParams = new URLSearchParams(window.location.search);
    const discoverId = urlParams.get('discover');
    
    if (discoverId) {
        // Navigate to discover page and scroll to post
        setTimeout(() => {
            if (typeof showPage === 'function') {
                showPage('discover');
            }
            setTimeout(() => {
                // Find and highlight the post
                const post = window.currentDiscoverPosts.find(p => p.id === discoverId);
                if (post) {
                    const cards = document.querySelectorAll('.discover-card');
                    cards.forEach(card => {
                        if (card.querySelector('h3')?.textContent === post.title) {
                            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            card.style.border = '2px solid #00d4ff';
                            setTimeout(() => {
                                card.style.border = '';
                            }, 3000);
                        }
                    });
                }
            }, 500);
        }, 100);
    }
}

// Add to discover.js
function createVPNOfferAd() {
    return `
        <div class="vpn-organic-ad">
            <div class="vpn-ad-header">
                <h3 class="vpn-ad-title">
                    <span>🔒</span> ParudVPN for iOS
                </h3>
                <div class="vpn-ad-badge">Sponsored</div>
            </div>
            
            <div class="vpn-ad-content">
                <div class="vpn-ad-features">
                    <div class="vpn-ad-feature">
                        <div class="vpn-ad-feature-icon">🛡️</div>
                        <div class="vpn-ad-feature-text">
                            <h4>Ultimate Privacy Protection</h4>
                            <p>Bank-grade encryption keeps your data secure</p>
                        </div>
                    </div>
                    
                    <div class="vpn-ad-feature">
                        <div class="vpn-ad-feature-icon">⚡</div>
                        <div class="vpn-ad-feature-text">
                            <h4>Lightning Fast Speeds</h4>
                            <p>Stream and browse without buffering</p>
                        </div>
                    </div>
                    
                    <div class="vpn-ad-feature">
                        <div class="vpn-ad-feature-icon">🌍</div>
                        <div class="vpn-ad-feature-text">
                            <h4>Global Access</h4>
                            <p>Connect to servers in 50+ countries worldwide</p>
                        </div>
                    </div>
                </div>
                
                <div class="vpn-ad-cta">
                    <button class="vpn-ad-button" onclick="trackOrganicVPNOffer()">
                        <span>📱</span> Download for iOS
                    </button>
                    
                    <div class="vpn-ad-device">
                        <span>✅</span> Optimized for iPhone & iPad
                    </div>
                    
                    <p class="vpn-ad-note">
                        Free trial available • No credit card required
                    </p>
                </div>
            </div>
        </div>
    `;
}

// Add tracking function
function trackOrganicVPNOffer() {
    console.log('Organic VPN offer clicked');
    
    // Track the click (non-incent)
    if (window.supabaseClient && window.currentUser) {
        window.supabaseClient
            .from('offer_clicks')
            .insert({
                user_id: window.currentUser.id,
                offer_type: 'organic_vpn',
                platform: 'ios',
                created_at: new Date().toISOString()
            })
            .then(() => {
                console.log('VPN offer click tracked');
            });
    }
    
    // Redirect to offer (replace with your actual offer URL)
    window.open('https://apps.apple.com/app/parudvpn', '_blank');
    
    // Show notification
    if (typeof showNotification === 'function') {
        showNotification('Opening ParudVPN in App Store...', 'info');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    checkDiscoverPostLink();
    
    // Re-check when navigating to discover page
    const observer = new MutationObserver(() => {
        const discoverPage = document.getElementById('discover-page');
        if (discoverPage && discoverPage.classList.contains('active')) {
            initDiscoverPage();
        }
    });
    
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        observer.observe(page, { attributes: true, attributeFilter: ['class'] });
    });
});

console.log('✅ Discover.js loaded');