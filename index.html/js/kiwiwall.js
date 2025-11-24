// kiwiwall.js - FIXED VERSION
window.kiwiwallConfig = {
    apiKey: 'pfwn69kipu7aka63m6ay3vn1ktsqol0f'
};

// Simple function to load KiwiWall iframe - BUT DON'T AUTO-RUN IT
window.loadKiwiwallOffers = function() {
    console.log('🔄 Loading KiwiWall iframe...');
    
    const container = document.getElementById('kiwiwall-offers-list');
    if (!container) {
        console.error('❌ KiwiWall container not found!');
        return;
    }

    // Check if user is logged in
    if (!window.currentUser) {
        container.innerHTML = `
            <div style="text-align: center; color: #ffd700; padding: 40px;">
                <div style="font-size: 4rem; margin-bottom: 20px;">🔐</div>
                <h3 style="color: #ffd700; margin-bottom: 15px;">Login Required</h3>
                <p style="color: #888; margin-bottom: 20px;">Please login to access KiwiWall offers</p>
                <button onclick="openAuthModal('login')" class="btn" style="background: rgba(255,215,0,0.1); color: #ffd700; border: 1px solid #ffd700;">
                    Login Now
                </button>
            </div>
        `;
        return;
    }

    // User is logged in - show the iframe
    const userId = window.currentUser.id;
    const iframeUrl = `https://www.kiwiwall.com/wall/${window.kiwiwallConfig.apiKey}/${userId}`;
    
    console.log('✅ Loading KiwiWall iframe for user:', userId);

    container.innerHTML = `
        <div style="background: rgba(255,215,0,0.05); border: 2px solid rgba(255,215,0,0.3); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
                <div style="font-size: 2rem;">🏆</div>
                <div>
                    <h3 style="color: #ffd700; margin: 0; font-size: 1.3rem;">KiwiWall Offer Wall</h3>
                    <p style="color: #888; margin: 5px 0 0 0; font-size: 0.9rem;">Complete offers to earn rewards</p>
                </div>
            </div>
        </div>
        
        <!-- THE MAGIC IFRAME -->
        <iframe 
            src="${iframeUrl}"
            width="100%" 
            height="1400" 
            frameborder="0"
            style="display: block; border: none; border-radius: 8px;"
            title="KiwiWall Offer Wall"
            allowfullscreen>
        </iframe>
        
        <div style="margin-top: 20px; padding: 15px; background: rgba(255,215,0,0.05); border-radius: 8px;">
            <p style="color: #888; margin: 0; text-align: center; font-size: 0.9rem;">
                💡 Complete offers fully to receive rewards. Some offers may be region-specific.
            </p>
        </div>
    `;
};

console.log('✅ KiwiWall integration loaded (waiting for Wall page to open)');