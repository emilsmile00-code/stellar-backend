// ======================================
// VIRAL PAGE FUNCTIONALITY
// ======================================

window.currentViralPosts = [];
window.currentViralCategory = 'all';

// Check if user is admin ONLY (removed creator access)
window.checkViralAccess = async function() {
    if (!window.currentUser || !window.supabaseClient) {
        console.log('❌ No current user or supabase client');
        return false;
    }
    
    console.log('🔍 Checking viral access for user:', window.currentUser.id);
    
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
        
        // REMOVED: Creator check - only admins can create viral posts
        
        console.log('❌ User is not an admin');
        return false;
    } catch (error) {
        console.error('Error checking viral access:', error);
        return false;
    }
}

// Show admin controls if user has access
window.initViralPage = async function() {
    console.log('🎬 Initializing Viral Page...');
    console.log('Current user:', window.currentUser);
    
    const hasAccess = await window.checkViralAccess();
    console.log('Has viral access:', hasAccess);
    
    const adminControls = document.getElementById('viral-admin-controls');
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
    
    loadViralPosts();
}

// Load viral posts from database
async function loadViralPosts() {
    if (!window.supabaseClient) {
        console.error('Supabase client not initialized');
        return;
    }
    
    try {
        const { data, error } = await window.supabaseClient
            .from('viral_posts')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        window.currentViralPosts = data || [];
        displayViralPosts();
    } catch (error) {
        console.error('Error loading viral posts:', error);
        const container = document.getElementById('viral-posts');
        if (container) {
            container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #888; padding: 40px;"><p>Error loading viral posts. Please try again.</p></div>';
        }
    }
}

// Filter posts by category
function filterViralCategory(category) {
    window.currentViralCategory = category;
    
    // Update active button
    document.querySelectorAll('.category-filter').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`)?.classList.add('active');
    
    displayViralPosts();
}

// Display viral posts
function displayViralPosts() {
    const container = document.getElementById('viral-posts');
    if (!container) return;
    
    let postsToDisplay = window.currentViralPosts;
    
    // Filter by category if not "all"
    if (window.currentViralCategory !== 'all') {
        postsToDisplay = postsToDisplay.filter(post => post.category === window.currentViralCategory);
    }
    
    if (postsToDisplay.length === 0) {
        container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #888; padding: 40px;"><div class="icon" style="font-size: 4rem; opacity: 0.3; margin-bottom: 20px;">🎬</div><h3 style="color: #888; margin-bottom: 10px;">No viral posts yet</h3><p style="color: #666;">Check back later for trending clips!</p></div>';
        return;
    }
    
    container.innerHTML = postsToDisplay.map(post => createViralCard(post)).join('');
}

// Create viral post card
function createViralCard(post) {
    const date = new Date(post.created_at).toLocaleDateString();
    const categoryEmoji = {
        movies: '🎬',
        comedy: '😂',
        music: '🎵',
        sports: '⚽',
        gaming: '🎮'
    };
    
    const shareUrl = `${window.location.origin}${window.location.pathname}?page=viral&viral=${post.id}`;
    
    return `
        <div class="viral-card" onclick="openViralPost('${post.id}')">
            <div class="viral-card-thumbnail">
                ${post.thumbnail_url ? 
                    `<img src="${post.thumbnail_url}" alt="${post.title}" onerror="this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;background:#0f0f14;font-size:3rem;\\'>${categoryEmoji[post.category] || '🎬'}</div>'">` :
                    `<div style="display:flex;align-items:center;justify-content:center;height:100%;background:#0f0f14;font-size:3rem;">${categoryEmoji[post.category] || '🎬'}</div>`
                }
            </div>
            <div class="viral-card-content">
                <span class="viral-card-category">${categoryEmoji[post.category] || '🎬'} ${post.category.toUpperCase()}</span>
                <h3>${post.title}</h3>
                <p>${post.description}</p>
            </div>
            <div class="viral-card-footer">
                <span>${date}</span>
                <div class="viral-card-share">
                    <button class="share-btn" onclick="event.stopPropagation(); copyViralLink('${shareUrl}')">📋 Copy Link</button>
                    <button class="share-btn" onclick="event.stopPropagation(); shareViralPost('${shareUrl}', '${post.title}')">↗️ Share</button>
                </div>
            </div>
        </div>
    `;
}

// Open viral post in modal or new window
function openViralPost(postId) {
    const post = window.currentViralPosts.find(p => p.id === postId);
    if (!post) return;
    
    // Open video URL in new tab
    window.open(post.video_url, '_blank');
}

// Copy viral post link
function copyViralLink(url) {
    navigator.clipboard.writeText(url).then(() => {
        if (typeof showNotification === 'function') {
            showNotification('Link copied to clipboard!', 'success');
        } else {
            alert('Link copied!');
        }
    });
}

// Share viral post
function shareViralPost(url, title) {
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).catch(() => {});
    } else {
        copyViralLink(url);
    }
}

// Modal functions
function openViralPostModal() {
    document.getElementById('viral-post-modal').style.display = 'block';
}

function closeViralPostModal() {
    document.getElementById('viral-post-modal').style.display = 'none';
    document.getElementById('viral-post-form').reset();
}

// Submit viral post
async function submitViralPost(event) {
    event.preventDefault();
    
    if (!window.currentUser || !window.supabaseClient) {
        if (typeof showNotification === 'function') {
            showNotification('Please login to create posts', 'error');
        }
        return;
    }
    
    const hasAccess = await checkViralAccess();
    if (!hasAccess) {
        if (typeof showNotification === 'function') {
            showNotification('You do not have permission to create viral posts', 'error');
        }
        return;
    }
    
    const title = document.getElementById('viral-title').value;
    const videoUrl = document.getElementById('viral-video-url').value;
    const category = document.getElementById('viral-category').value;
    const description = document.getElementById('viral-description').value;
    const thumbnailUrl = document.getElementById('viral-thumbnail').value;
    
    try {
        const { data, error } = await window.supabaseClient
            .from('viral_posts')
            .insert([{
                title: title,
                video_url: videoUrl,
                category: category,
                description: description,
                thumbnail_url: thumbnailUrl || null,
                author_id: window.currentUser.id,
                author_email: window.currentUser.email,
                is_published: true,
                created_at: new Date().toISOString()
            }])
            .select();
        
        if (error) throw error;
        
        if (typeof showNotification === 'function') {
            showNotification('Viral post published successfully!', 'success');
        }
        
        closeViralPostModal();
        loadViralPosts();
    } catch (error) {
        console.error('Error creating viral post:', error);
        if (typeof showNotification === 'function') {
            showNotification('Error publishing post: ' + error.message, 'error');
        }
    }
}

// Check for direct viral post link on page load
function checkViralPostLink() {
    const urlParams = new URLSearchParams(window.location.search);
    const viralId = urlParams.get('viral');
    
    if (viralId) {
        // Navigate to viral page and open post
        setTimeout(() => {
            if (typeof showPage === 'function') {
                showPage('viral');
            }
            setTimeout(() => {
                openViralPost(viralId);
            }, 500);
        }, 100);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    checkViralPostLink();
    
    // Re-check when navigating to viral page
    const observer = new MutationObserver(() => {
        const viralPage = document.getElementById('viral-page');
        if (viralPage && viralPage.classList.contains('active')) {
            initViralPage();
        }
    });
    
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        observer.observe(page, { attributes: true, attributeFilter: ['class'] });
    });
});

console.log('✅ Viral.js loaded');