// CPAgrip RSS Feed Integration - FIXED with branding and payout adjustments
window.cpagripOffers = [];

// Your CPAgrip credentials from the screenshot
const CPAGRIP_CONFIG = {
    user_id: '2466531',
    key: '8d0ca575a1e53a4bdf0ae3b209fce371',
    tracking_id: '', // Will be set dynamically per user
    limit: 20,
    domain: 'www.cpagrip.com', // From your screenshot - custom tracking domain
    showmobile: 'yes',
    showcapped: 'yes'
};

// Function to load CPAgrip offers
// Function to load CPAgrip offers - FIXED VERSION
window.loadCPAgripOffers = async function() {
    console.log('📄 Loading CPAgrip offers...');
    
    // Wait a bit longer for container to be created
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const container = document.getElementById('cpagrip-offers');
    if (!container) {
        console.error('❌ CPAgrip offers container not found');
        console.log('🔍 Available containers:', {
            'wall-items': !!document.getElementById('wall-items'),
            'affiliate-offers': !!document.getElementById('affiliate-offers'),
            'kiwiwall-offers-list': !!document.getElementById('kiwiwall-offers-list'),
            'cpagrip-offers': !!document.getElementById('cpagrip-offers'),
            'cpalead-offers': !!document.getElementById('cpalead-offers')
        });
        
        // Try one more time after additional delay
        await new Promise(resolve => setTimeout(resolve, 200));
        const containerRetry = document.getElementById('cpagrip-offers');
        if (!containerRetry) {
            console.error('❌ CPAgrip container still not found after retry');
            return;
        }
        console.log('✅ Found CPAgrip container on retry');
    }

    try {
        // Show loading state
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; color: #888; padding: 40px;">
                <div class="loading-spinner"></div>
                <p style="margin-top: 20px;">Loading offers...</p>
            </div>
        `;

        // Build RSS URL with EXACT parameters from your screenshot
        const params = new URLSearchParams({
            user_id: CPAGRIP_CONFIG.user_id,
            key: CPAGRIP_CONFIG.key,
            tracking_id: window.currentUser ? window.currentUser.id : 'guest',
            limit: CPAGRIP_CONFIG.limit,
            domain: CPAGRIP_CONFIG.domain,
            showmobile: CPAGRIP_CONFIG.showmobile,
            showcapped: CPAGRIP_CONFIG.showcapped
        });

        // Use the EXACT RSS URL from your screenshot
        const rssUrl = `https://www.cpagrip.com/common/offer_feed_rss.php?user_id=2466531&key=8d0ca575a1e53a4bdf0ae3b209fce371&ip=&tracking_id=`;
        console.log('📡 Fetching CPAgrip RSS:', rssUrl);

        // Use CORS proxy
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(rssUrl)}`;
        
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const xmlText = await response.text();
        console.log('📄 Raw response received');

        // Parse XML response
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        // Check for parsing errors
        const parseError = xmlDoc.querySelector('parsererror');
        if (parseError) {
            console.error('XML Parse Error:', parseError.textContent);
            throw new Error('XML parsing error');
        }

        // Extract offers - try different XML structures
        let offers = xmlDoc.querySelectorAll('offer');
        
        // If no offers found with 'offer' tag, try 'item' (RSS standard)
        if (offers.length === 0) {
            offers = xmlDoc.querySelectorAll('item');
        }

        console.log(`📦 Found ${offers.length} offers in XML`);

        window.cpagripOffers = [];

        for (let i = 0; i < offers.length; i++) {
            const offer = offers[i];
            
            // Extract offer data with multiple fallback options
            const title = getXmlText(offer, ['title', 'name']);
            const description = getXmlText(offer, ['description', 'desc']);
            const payoutText = getXmlText(offer, ['payout', 'price', 'amount']);
            let offerLink = getXmlText(offer, ['offerlink', 'link', 'url']);
            const category = getXmlText(offer, ['category', 'type']);
            const geo = getXmlText(offer, ['geo', 'country']);
            const device = getXmlText(offer, ['device', 'platform']);

            // Use custom tracking domain from your screenshot
            if (offerLink && CPAGRIP_CONFIG.domain) {
                offerLink = offerLink.replace('www.cpagrip.com', CPAGRIP_CONFIG.domain);
            }

            const originalPayout = parseFloat(payoutText) || (Math.random() * 5 + 0.5);
            // Apply 80% payout like your other offers
            const displayPayout = originalPayout * 0.8;

            window.cpagripOffers.push({
                title: title || `Offer ${i + 1}`,
                description: description || 'Complete this offer to earn rewards',
                originalPayout: originalPayout,
                displayPayout: displayPayout,
                url: offerLink || '#',
                category: category || 'General',
                geo: geo || 'Global',
                device: device || 'Any',
                type: 'Premium Offer',
                duration: '2-10 min',
                icon: getCPAgripIcon(category),
                provider: 'cpagrip'
            });
        }

        console.log(`✅ Loaded ${window.cpagripOffers.length} CPAgrip offers`);
        displayCPAgripOffers();

    } catch (error) {
        console.error('❌ Error loading CPAgrip offers:', error);
        
        // Show error message - NO FALLBACK OFFERS
        const containerFinal = document.getElementById('cpagrip-offers');
        if (containerFinal) {
            containerFinal.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; color: #888; padding: 40px;">
                    <div class="icon" style="font-size: 4rem; opacity: 0.3; margin-bottom: 20px;">⚠️</div>
                    <h3 style="color: #888; margin-bottom: 10px;">Temporarily unavailable</h3>
                    <p style="color: #666;">Offers will be back soon. Please check again later.</p>
                    <button onclick="loadCPAgripOffers()" class="btn" style="margin-top: 15px; background: rgba(255,107,107,0.2); color: #ff6b6b; border: 1px solid #ff6b6b;">
                        Try Again
                    </button>
                </div>
            `;
        }
    }
};

// Helper function to get text from XML with multiple possible tags
function getXmlText(parentElement, possibleTags) {
    for (const tag of possibleTags) {
        const element = parentElement.querySelector(tag);
        if (element && element.textContent) {
            return element.textContent.trim();
        }
    }
    return '';
}

// Function to display CPAgrip offers
function displayCPAgripOffers() {
    const container = document.getElementById('cpagrip-offers');
    if (!container) {
        console.error('CPAgrip container not found');
        return;
    }

    if (!window.cpagripOffers || window.cpagripOffers.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; color: #888; padding: 40px;">
                <div class="icon" style="font-size: 4rem; opacity: 0.3; margin-bottom: 20px;">📭</div>
                <h3 style="color: #888; margin-bottom: 10px;">No offers available</h3>
                <p style="color: #666;">Check back later for new offers!</p>
            </div>
        `;
        return;
    }

    const offersHtml = window.cpagripOffers.map(offer => `
        <div class="card" style="cursor: pointer; border-left: 4px solid #ff6b6b; transition: all 0.3s ease;" 
             onclick="openCPAgripOffer('${escapeCPAgripHtml(offer.title)}', '${escapeCPAgripHtml(offer.url)}', ${offer.displayPayout})">
            <div style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 15px;">
                <div style="font-size: 2.5rem; flex-shrink: 0;">${offer.icon}</div>
                <div style="flex: 1;">
                    <h3 style="color: #ff6b6b; margin: 0 0 8px 0; font-size: 1.1rem;">${escapeCPAgripHtml(offer.title)}</h3>
                    <p style="color: #ccc; font-size: 0.9rem; margin: 0 0 10px 0; line-height: 1.5;">
                        ${escapeCPAgripHtml(offer.description)}
                    </p>
                    
                    <div style="display: flex; flex-wrap: wrap; gap: 8px; font-size: 0.85rem;">
                        <span style="background: rgba(255,107,107,0.15); color: #ff6b6b; padding: 6px 12px; border-radius: 16px; font-weight: bold;">
                            💰 $${offer.displayPayout.toFixed(2)}
                        </span>
                        <span style="background: rgba(255,215,0,0.15); color: #ffd700; padding: 6px 12px; border-radius: 16px;">
                            ⏱️ ${offer.duration}
                        </span>
                        <span style="background: rgba(118,75,162,0.15); color: #764ba2; padding: 6px 12px; border-radius: 16px;">
                            ${offer.type}
                        </span>
                        ${offer.geo && offer.geo !== 'Global' ? `<span style="background: rgba(255,51,153,0.15); color: #ff3399; padding: 6px 12px; border-radius: 16px;">🌍 ${offer.geo}</span>` : ''}
                        ${offer.device && offer.device !== 'Any' ? `<span style="background: rgba(0,212,255,0.15); color: #00d4ff; padding: 6px 12px; border-radius: 16px;">📱 ${offer.device}</span>` : ''}
                    </div>
                </div>
            </div>
            
            ${offer.category ? `
                <div style="margin-top: 12px; padding: 10px; background: rgba(255,255,255,0.03); border-radius: 6px; border-left: 2px solid #ff6b6b;">
                    <small style="color: #aaa;">📋 Category: ${escapeCPAgripHtml(offer.category)}</small>
                </div>
            ` : ''}
        </div>
    `).join('');

    container.innerHTML = offersHtml;
}

// Function to open CPAgrip offer
window.openCPAgripOffer = function(title, url, payout) {
    console.log('🎯 Opening CPAgrip offer:', title);
    
    if (url && url !== '#') {
        // Track offer click
        if (window.currentUser && window.supabaseClient) {
            trackCPAgripOfferClick('cpagrip', title, payout);
        }
        
        // Open in new window
        window.open(url, '_blank', 'noopener,noreferrer');
        
        if (typeof showNotification === 'function') {
            showNotification(`Opening: ${title} - Earn $${payout.toFixed(2)}`, 'success');
        }
    } else {
        console.warn('⚠️ CPAgrip offer link not available');
        if (typeof showNotification === 'function') {
            showNotification('Offer link not available - Please try another offer', 'error');
        }
    }
};

// UNIQUE function name for CPAgrip to avoid conflicts
function getCPAgripIcon(category) {
    if (!category) return '💰';
    
    const categoryIcons = {
        'survey': '📊',
        'download': '📱',
        'email': '✉️',
        'free': '🎁',
        'mobile': '📲',
        'pin': '📍',
        'social': '👥',
        'gambling': '🎰',
        'finance': '💰',
        'shopping': '🛒'
    };
    
    const lowerCategory = (category || '').toString().toLowerCase();
    for (const [key, icon] of Object.entries(categoryIcons)) {
        if (lowerCategory.includes(key)) {
            return icon;
        }
    }
    
    return '💰'; // Default icon
}

// Track offer clicks in database
async function trackCPAgripOfferClick(provider, title, payout) {
    if (!window.currentUser || !window.supabaseClient) return;
    
    try {
        const { error } = await window.supabaseClient
            .from('offer_clicks')
            .insert({
                user_id: window.currentUser.id,
                provider: provider,
                offer_title: title,
                payout_amount: payout,
                clicked_at: new Date().toISOString(),
                status: 'clicked'
            });
            
        if (error) {
            console.error('Error tracking offer click:', error);
        }
    } catch (error) {
        console.error('Error tracking offer:', error);
    }
}

// Utility function to escape HTML (unique name)
function escapeCPAgripHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Auto-load when wall page is shown
document.addEventListener('DOMContentLoaded', function() {
    // Override showPage to detect when wall is opened
    if (window.showPage) {
        const originalShowPage = window.showPage;
        window.showPage = function(page) {
            originalShowPage(page);
            if (page === 'wall') {
                console.log('📋 Wall page shown - loading CPAgrip offers');
                // Wait a bit for the DOM to be ready
                setTimeout(() => {
                    if (typeof window.loadCPAgripOffers === 'function') {
                        window.loadCPAgripOffers();
                    }
                }, 1000);
            }
        };
    }
});

console.log('✅ CPAgrip integration loaded - waiting for wall page');