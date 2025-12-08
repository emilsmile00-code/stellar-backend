// ======================================
// DISCOVER PAGE FUNCTIONALITY
// ======================================
// NOTE: Sweeps offers data is loaded from sweeps-data.js
// Edit sweeps-data.js to change your offers (persists on deploy)
// ======================================

window.currentDiscoverPosts = [];

// Check if user is admin ONLY (removed creator access)
window.checkDiscoverAccess = async function() {
    if (!window.currentUser || !window.supabaseClient) {
        console.log('❌ No current user or supabase client');
        return false;
    }
    
    console.log('🔍 Checking discover access for user:', window.currentUser.id);
    
    try {
        // Check if admin ONLY
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
        
        // REMOVED: Creator check - only admins can create discover posts
        
        console.log('❌ User is not an admin');
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
    
    // Store admin status globally for rendering
    window.isDiscoverAdmin = hasAccess;
    
    const adminControls = document.getElementById('discover-admin-controls');
    console.log('Admin controls element:', adminControls);
    
    if (adminControls && hasAccess) {
        console.log('✅ Showing admin controls');
        adminControls.style.display = 'block';
    } else {
        console.log('❌ Not showing admin controls. Has access:', hasAccess, 'Element exists:', !!adminControls);
        if (adminControls) {
            adminControls.style.display = 'none';
        }
    }

    // Render all sweeps offers FIRST, then VPN ad LAST
    const vpnAdContainer = document.getElementById('discover-vpn-ad');
    if (vpnAdContainer) {
        // Build all sweeps offers HTML
        let allOffersHtml = '';
        
        // Render sweeps offers first (pass admin status for edit button)
        window.sweepsOffers.forEach((offer, index) => {
            allOffersHtml += createSweepsOfferAd(offer, index, hasAccess);
        });
        
        // Render VPN ad last
        allOffersHtml += createVPNOfferAd();
        
        vpnAdContainer.innerHTML = allOffersHtml;
    }
    
    // Inject edit button styles if not already present
    if (!document.getElementById('sweeps-edit-styles')) {
        const style = document.createElement('style');
        style.id = 'sweeps-edit-styles';
        style.textContent = `
            .sweeps-edit-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                background: linear-gradient(135deg, #00d4ff, #0099cc);
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                z-index: 10;
                transition: all 0.3s ease;
            }
            .sweeps-edit-btn:hover {
                background: linear-gradient(135deg, #00e5ff, #00b3e6);
                transform: scale(1.05);
            }
            #edit-sweeps-modal .modal-content {
                max-height: 80vh;
                overflow-y: auto;
            }
            #edit-sweeps-modal .form-group {
                margin-bottom: 15px;
            }
            #edit-sweeps-modal label {
                display: block;
                margin-bottom: 5px;
                color: #00d4ff;
                font-weight: bold;
            }
            #edit-sweeps-modal input {
                width: 100%;
                padding: 10px;
                border: 1px solid #333;
                border-radius: 8px;
                background: #1a1a2e;
                color: white;
            }
            #edit-sweeps-modal .submit-btn {
                width: 100%;
                padding: 15px;
                background: linear-gradient(135deg, #00d4ff, #0099cc);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                margin-top: 20px;
            }
            #edit-sweeps-modal .submit-btn:hover {
                background: linear-gradient(135deg, #00e5ff, #00b3e6);
            }
        `;
        document.head.appendChild(style);
    }
    
    loadDiscoverPosts();
}

// Create sweeps offer ad (same structure as VPN offer)
function createSweepsOfferAd(offer, index, isAdmin = false) {
    console.log('Creating sweeps ad for offer index:', index, 'isAdmin:', isAdmin);
    return `
        <div class="vpn-organic-ad" data-offer-index="${index}" style="margin-bottom: 20px; position: relative;">
            ${isAdmin ? `
                <button class="sweeps-edit-btn" onclick="window.openEditSweepsModal(${index}); return false;" title="Edit Offer">
                    ✏️ Edit
                </button>
            ` : ''}
            <div class="vpn-ad-header">
                <h3 class="vpn-ad-title">
                    <span>${offer.icon}</span> ${offer.title}
                </h3>
                <div class="vpn-ad-badge">${offer.badge}</div>
            </div>
            
            <div class="vpn-ad-content">
                <div class="vpn-ad-features">
                    ${offer.features.map(feature => `
                        <div class="vpn-ad-feature">
                            <div class="vpn-ad-feature-icon">${feature.icon}</div>
                            <div class="vpn-ad-feature-text">
                                <h4>${feature.title}</h4>
                                <p>${feature.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="vpn-ad-cta">
                    <button class="vpn-ad-button" onclick="trackSweepsOffer('sweeps_${index}', '${offer.offerUrl}')">
                        <span>${offer.buttonIcon}</span> ${offer.buttonText}
                    </button>
                    
                    <div class="vpn-ad-device">
                        <span>✅</span> ${offer.deviceText}
                    </div>
                    
                    <p class="vpn-ad-note">
                        ${offer.noteText}
                    </p>
                </div>
            </div>
        </div>
    `;
}

// Open edit modal for sweeps offer
window.openEditSweepsModal = function(offerIndex) {
    console.log('🔧 openEditSweepsModal called with index:', offerIndex);
    const offer = window.sweepsOffers[offerIndex];
    console.log('Found offer:', offer);
    if (!offer) {
        console.error('Offer not found for index:', offerIndex);
        return;
    }
    
    // Create modal if it doesn't exist
    let modal = document.getElementById('edit-sweeps-modal');
    if (!modal) {
        console.log('Creating new modal...');
        modal = document.createElement('div');
        modal.id = 'edit-sweeps-modal';
        modal.className = 'modal';
        modal.style.cssText = 'display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; overflow-y: auto; padding: 20px;';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px; margin: 20px auto; background: #16213e; border-radius: 16px; padding: 20px; position: relative;">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="color: #00d4ff; margin: 0;">✏️ Edit Sweeps Offer</h2>
                    <button class="close-btn" onclick="window.closeEditSweepsModal()" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">&times;</button>
                </div>
                <form id="edit-sweeps-form" onsubmit="window.saveSweepsOffer(event)">
                    <input type="hidden" id="edit-sweeps-id">
                    
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" id="edit-sweeps-title" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Icon (emoji)</label>
                        <input type="text" id="edit-sweeps-icon" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Badge Text</label>
                        <input type="text" id="edit-sweeps-badge" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Offer URL</label>
                        <input type="url" id="edit-sweeps-url" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Button Text</label>
                        <input type="text" id="edit-sweeps-button-text" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Button Icon (emoji)</label>
                        <input type="text" id="edit-sweeps-button-icon" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Device Text</label>
                        <input type="text" id="edit-sweeps-device" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Note Text</label>
                        <input type="text" id="edit-sweeps-note" required>
                    </div>
                    
                    <h4 style="margin: 20px 0 10px; color: #00d4ff;">Features (3)</h4>
                    
                    <div class="form-group">
                        <label>Feature 1 Icon</label>
                        <input type="text" id="edit-sweeps-f1-icon" required>
                    </div>
                    <div class="form-group">
                        <label>Feature 1 Title</label>
                        <input type="text" id="edit-sweeps-f1-title" required>
                    </div>
                    <div class="form-group">
                        <label>Feature 1 Description</label>
                        <input type="text" id="edit-sweeps-f1-desc" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Feature 2 Icon</label>
                        <input type="text" id="edit-sweeps-f2-icon" required>
                    </div>
                    <div class="form-group">
                        <label>Feature 2 Title</label>
                        <input type="text" id="edit-sweeps-f2-title" required>
                    </div>
                    <div class="form-group">
                        <label>Feature 2 Description</label>
                        <input type="text" id="edit-sweeps-f2-desc" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Feature 3 Icon</label>
                        <input type="text" id="edit-sweeps-f3-icon" required>
                    </div>
                    <div class="form-group">
                        <label>Feature 3 Title</label>
                        <input type="text" id="edit-sweeps-f3-title" required>
                    </div>
                    <div class="form-group">
                        <label>Feature 3 Description</label>
                        <input type="text" id="edit-sweeps-f3-desc" required>
                    </div>
                    
                    <button type="submit" class="submit-btn">💾 Save Changes</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // Fill form with current values
    document.getElementById('edit-sweeps-id').value = offerIndex;
    document.getElementById('edit-sweeps-title').value = offer.title;
    document.getElementById('edit-sweeps-icon').value = offer.icon;
    document.getElementById('edit-sweeps-badge').value = offer.badge;
    document.getElementById('edit-sweeps-url').value = offer.offerUrl;
    document.getElementById('edit-sweeps-button-text').value = offer.buttonText;
    document.getElementById('edit-sweeps-button-icon').value = offer.buttonIcon;
    document.getElementById('edit-sweeps-device').value = offer.deviceText;
    document.getElementById('edit-sweeps-note').value = offer.noteText;
    
    // Features
    document.getElementById('edit-sweeps-f1-icon').value = offer.features[0]?.icon || '';
    document.getElementById('edit-sweeps-f1-title').value = offer.features[0]?.title || '';
    document.getElementById('edit-sweeps-f1-desc').value = offer.features[0]?.description || '';
    document.getElementById('edit-sweeps-f2-icon').value = offer.features[1]?.icon || '';
    document.getElementById('edit-sweeps-f2-title').value = offer.features[1]?.title || '';
    document.getElementById('edit-sweeps-f2-desc').value = offer.features[1]?.description || '';
    document.getElementById('edit-sweeps-f3-icon').value = offer.features[2]?.icon || '';
    document.getElementById('edit-sweeps-f3-title').value = offer.features[2]?.title || '';
    document.getElementById('edit-sweeps-f3-desc').value = offer.features[2]?.description || '';
    
    modal.style.display = 'block';
}

// Close edit modal
window.closeEditSweepsModal = function() {
    const modal = document.getElementById('edit-sweeps-modal');
    if (modal) modal.style.display = 'none';
}

// Save sweeps offer changes
window.saveSweepsOffer = function(event) {
    event.preventDefault();
    
    const offerIndex = parseInt(document.getElementById('edit-sweeps-id').value);
    
    if (offerIndex < 0 || offerIndex >= window.sweepsOffers.length) return;
    
    // Update offer data
    window.sweepsOffers[offerIndex] = {
        ...window.sweepsOffers[offerIndex],
        title: document.getElementById('edit-sweeps-title').value,
        icon: document.getElementById('edit-sweeps-icon').value,
        badge: document.getElementById('edit-sweeps-badge').value,
        offerUrl: document.getElementById('edit-sweeps-url').value,
        buttonText: document.getElementById('edit-sweeps-button-text').value,
        buttonIcon: document.getElementById('edit-sweeps-button-icon').value,
        deviceText: document.getElementById('edit-sweeps-device').value,
        noteText: document.getElementById('edit-sweeps-note').value,
        features: [
            {
                icon: document.getElementById('edit-sweeps-f1-icon').value,
                title: document.getElementById('edit-sweeps-f1-title').value,
                description: document.getElementById('edit-sweeps-f1-desc').value
            },
            {
                icon: document.getElementById('edit-sweeps-f2-icon').value,
                title: document.getElementById('edit-sweeps-f2-title').value,
                description: document.getElementById('edit-sweeps-f2-desc').value
            },
            {
                icon: document.getElementById('edit-sweeps-f3-icon').value,
                title: document.getElementById('edit-sweeps-f3-title').value,
                description: document.getElementById('edit-sweeps-f3-desc').value
            }
        ]
    };
    
    // Save to localStorage for persistence
    try {
        localStorage.setItem('sweepsOffers', JSON.stringify(window.sweepsOffers));
        console.log('💾 Sweeps offers saved to localStorage');
    } catch (e) {
        console.error('Failed to save to localStorage:', e);
    }
    
    // Re-render offers
    window.initDiscoverPage();
    window.closeEditSweepsModal();
    
    if (typeof showNotification === 'function') {
        showNotification('Offer updated successfully!', 'success');
    }
    
    console.log('✅ Sweeps offer updated:', window.sweepsOffers[offerIndex]);
}

// Track sweeps offer clicks
function trackSweepsOffer(offerType, offerUrl) {
    console.log('Sweeps offer clicked:', offerType);
    
    // Track the click
    if (window.supabaseClient && window.currentUser) {
        window.supabaseClient
            .from('offer_clicks')
            .insert({
                user_id: window.currentUser.id,
                offer_type: offerType,
                platform: 'web',
                created_at: new Date().toISOString()
            })
            .then(() => {
                console.log('Sweeps offer click tracked');
            });
    }
    
    // Redirect to offer
    window.open(offerUrl, '_blank');
    
    // Show notification
    if (typeof showNotification === 'function') {
        showNotification('Opening offer...', 'info');
    }
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

// VPN Offer Ad - NOW APPEARS LAST
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

console.log('✅ Discover.js loaded with 20 sweeps offers');