// ======================================
// RSS FEEDS CONFIGURATION - EXPANDED & OPTIMIZED
// ======================================
const RSS_FEEDS = {
    tech: [
        'https://techcrunch.com/feed/',
        'https://www.theverge.com/rss/index.xml',
        'https://arstechnica.com/feed/',
        'https://feeds.feedburner.com/TechCrunch/',
        'https://www.wired.com/feed/rss',
        'https://www.zdnet.com/news/rss.xml',
        'https://www.cnet.com/rss/news/',
        'https://feeds.feedburner.com/Mashable'
    ],
    finance: [
        'https://www.cnbc.com/id/100727362/device/rss/rss.html',
        'https://www.marketwatch.com/rss/topstories',
        'https://seekingalpha.com/market_currents.xml',
        'https://feeds.bloomberg.com/markets/news.rss',
        'https://www.ft.com/?format=rss',
        'https://feeds.reuters.com/reuters/businessNews',
        'https://www.investing.com/rss/news.rss',
        'https://finance.yahoo.com/rss/topfinstories'
    ],
    gambling: [
        'https://www.casino.org/news/feed/',
        'https://www.pokernews.com/news/feed',
        'https://www.cardplayer.com/poker-news/rss-feed',
        'https://www.gambling.com/news/feed',
        'https://www.vegasinsider.com/rss/',
        'https://www.legalsportsreport.com/feed/',
        'https://www.actionnetwork.com/rss',
        'https://www.yogonet.com/international/rss'
    ],
    fashion: [
        'https://www.vogue.com/feed/rss',
        'https://wwd.com/feed/',
        'https://fashionista.com/feed',
        'https://www.harpersbazaar.com/rss/all.xml/',
        'https://www.elle.com/rss/all.xml/',
        'https://www.refinery29.com/rss.xml',
        'https://www.glamour.com/feed/rss',
        'https://www.instyle.com/feeds/all/instyle.rss'
    ],
    lifestyle: [
        'https://www.bonappetit.com/feed/rss',
        'https://www.gq.com/feed/rss',
        'https://www.architecturaldigest.com/feed/rss',
        'https://www.menshealth.com/rss/all.xml/',
        'https://www.self.com/feed/rss',
        'https://www.travelandleisure.com/feeds/all',
        'https://www.thecut.com/feed/rss/',
        'https://www.esquire.com/rss/all.xml/'
    ]
};

// Cache settings - reduced TTL for fresher content
const CACHE_KEY = 'stellar_news_cache';
const CACHE_TTL = 3 * 60 * 1000; // 3 minutes

// Fetch timeout - reduced for faster response
const FETCH_TIMEOUT = 2000; // 2 seconds max per feed

// ======================================
// PLACEHOLDER CONTENT
// ======================================
const PLACEHOLDER_CONTENT = {
    tech: [
        {
            title: 'Latest Tech Innovations Transform Digital Landscape',
            content: 'Technology companies unveil groundbreaking innovations across AI, cloud computing, and consumer electronics.',
            excerpt: 'Technology companies unveil groundbreaking innovations across AI, cloud computing...',
            external_url: 'https://techcrunch.com',
            image_url: 'https://placehold.co/600x400/16162a/00d4ff?text=Tech+News',
            published_at: new Date().toISOString(),
            section: 'tech'
        },
        {
            title: 'AI and Machine Learning Advances Continue',
            content: 'Artificial intelligence research reaches new milestones with improved capabilities.',
            excerpt: 'Artificial intelligence research reaches new milestones...',
            external_url: 'https://theverge.com',
            image_url: 'https://placehold.co/600x400/16162a/00d4ff?text=AI+News',
            published_at: new Date().toISOString(),
            section: 'tech'
        }
    ],
    finance: [
        {
            title: 'Global Markets React to Economic Indicators',
            content: 'Financial markets worldwide show movements as investors analyze economic data.',
            excerpt: 'Financial markets worldwide show movements as investors analyze data...',
            external_url: 'https://cnbc.com',
            image_url: 'https://placehold.co/600x400/16162a/00ff88?text=Finance+News',
            published_at: new Date().toISOString(),
            section: 'finance'
        },
        {
            title: 'Investment Strategies for Changing Markets',
            content: 'Financial advisors share strategies for portfolio diversification.',
            excerpt: 'Financial advisors share strategies for portfolio diversification...',
            external_url: 'https://marketwatch.com',
            image_url: 'https://placehold.co/600x400/16162a/00ff88?text=Investment+News',
            published_at: new Date().toISOString(),
            section: 'finance'
        }
    ],
    gambling: [
        {
            title: 'Casino Industry Embraces Digital Transformation',
            content: 'Gaming operators integrate advanced technology platforms.',
            excerpt: 'Gaming operators integrate advanced technology platforms...',
            external_url: 'https://casino.org',
            image_url: 'https://placehold.co/600x400/16162a/ffd700?text=Casino+News',
            published_at: new Date().toISOString(),
            section: 'gambling'
        },
        {
            title: 'Sports Betting Markets Show Growth',
            content: 'Sports betting continues expansion across new markets.',
            excerpt: 'Sports betting continues expansion across new markets...',
            external_url: 'https://casino.org',
            image_url: 'https://placehold.co/600x400/16162a/ffd700?text=Betting+News',
            published_at: new Date().toISOString(),
            section: 'gambling'
        }
    ],
    fashion: [
        {
            title: 'Fashion Week Highlights Latest Trends',
            content: 'Major fashion events showcase designer collections.',
            excerpt: 'Major fashion events showcase designer collections...',
            external_url: 'https://vogue.com',
            image_url: 'https://placehold.co/600x400/16162a/ff3399?text=Fashion+News',
            published_at: new Date().toISOString(),
            section: 'fashion'
        },
        {
            title: 'Sustainable Fashion Gains Momentum',
            content: 'Fashion brands commit to eco-friendly practices.',
            excerpt: 'Fashion brands commit to eco-friendly practices...',
            external_url: 'https://harpersbazaar.com',
            image_url: 'https://placehold.co/600x400/16162a/ff3399?text=Sustainable+Fashion',
            published_at: new Date().toISOString(),
            section: 'fashion'
        }
    ],
    lifestyle: [
        {
            title: 'Wellness Trends Shape Modern Living',
            content: 'Health and wellness experts share insights on balanced lifestyles.',
            excerpt: 'Health and wellness experts share insights on balanced lifestyles...',
            external_url: 'https://gq.com',
            image_url: 'https://placehold.co/600x400/16162a/ff8800?text=Wellness+News',
            published_at: new Date().toISOString(),
            section: 'lifestyle'
        },
        {
            title: 'Travel Destinations for 2025',
            content: 'Travel experts recommend exciting destinations.',
            excerpt: 'Travel experts recommend exciting destinations...',
            external_url: 'https://bonappetit.com',
            image_url: 'https://placehold.co/600x400/16162a/ff8800?text=Travel+News',
            published_at: new Date().toISOString(),
            section: 'lifestyle'
        }
    ]
};

// ======================================
// CACHE FUNCTIONS
// ======================================
function getCachedNews() {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_TTL) {
                console.log('⚡ Using cached news (age: ' + Math.round((Date.now() - timestamp) / 1000) + 's)');
                return data;
            }
        }
    } catch (e) {
        console.warn('Cache read error:', e);
    }
    return null;
}

function setCachedNews(data) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            data,
            timestamp: Date.now()
        }));
        console.log('💾 News cached');
    } catch (e) {
        console.warn('Cache write error:', e);
    }
}

// ======================================
// ULTRA-FAST RSS FETCHING
// ======================================
async function fetchWithTimeout(url, timeout = FETCH_TIMEOUT) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, { 
            signal: controller.signal,
            cache: 'no-store' // Ensure fresh data
        });
        clearTimeout(timeoutId);
        return response;
    } catch (e) {
        clearTimeout(timeoutId);
        throw e;
    }
}

async function fetchRSSFeed(feedUrl, section) {
    // Multiple fast proxies - race for fastest response
    const proxies = [
        `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`,
        `https://corsproxy.io/?${encodeURIComponent(feedUrl)}`,
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(feedUrl)}`
    ];
    
    // Race all proxies - first successful wins
    const racePromises = proxies.map(async (proxyUrl) => {
        try {
            const response = await fetchWithTimeout(proxyUrl, FETCH_TIMEOUT);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            let text = await response.text();
            
            // Handle AllOrigins JSON wrapper
            if (proxyUrl.includes('allorigins.win')) {
                try {
                    const data = JSON.parse(text);
                    text = data.contents;
                } catch (e) {}
            }
            
            if (!text || text.length < 100) throw new Error('Empty response');
            
            const articles = parseRSSFeed(text, section);
            if (articles.length === 0) throw new Error('No articles parsed');
            
            return articles;
        } catch (e) {
            throw e;
        }
    });
    
    // Return first successful result
    return Promise.any(racePromises);
}

function parseRSSFeed(xmlText, section) {
    const articles = [];
    
    try {
        // Try RSS 2.0 items first
        let itemMatches = xmlText.match(/<item>[\s\S]*?<\/item>/gi) || [];
        
        // Also try Atom entries
        if (itemMatches.length === 0) {
            itemMatches = xmlText.match(/<entry>[\s\S]*?<\/entry>/gi) || [];
        }
        
        for (const item of itemMatches.slice(0, 6)) {
            const title = extractFromXML(item, 'title');
            const description = extractFromXML(item, 'description') || extractFromXML(item, 'summary') || extractFromXML(item, 'content');
            const link = extractFromXML(item, 'link') || extractLinkHref(item);
            const pubDate = extractFromXML(item, 'pubDate') || extractFromXML(item, 'published') || extractFromXML(item, 'updated');
            
            const mediaContent = item.match(/<media:content[^>]+url="([^"]+)"/i);
            const mediaThumbnail = item.match(/<media:thumbnail[^>]+url="([^"]+)"/i);
            const enclosure = item.match(/<enclosure[^>]+url="([^"]+)"/i);
            const imgTag = item.match(/<img[^>]+src="([^"]+)"/i);
            
            if (title && link) {
                const cleanDescription = cleanHTML(description || '');
                const cleanTitle = cleanHTML(title);
                
                if (cleanTitle.length > 10) {
                    articles.push({
                        title: cleanTitle,
                        content: cleanDescription || cleanTitle,
                        excerpt: (cleanDescription || cleanTitle).substring(0, 150) + '...',
                        external_url: link,
                        image_url: mediaContent?.[1] || mediaThumbnail?.[1] || enclosure?.[1] || imgTag?.[1],
                        published_at: new Date(pubDate || Date.now()).toISOString(),
                        section: section
                    });
                }
            }
        }
    } catch (error) {
        console.error('RSS parse error:', error);
    }
    
    return articles;
}

function extractLinkHref(xml) {
    const match = xml.match(/<link[^>]+href="([^"]+)"/i);
    return match ? match[1] : null;
}

function cleanHTML(text) {
    if (!text) return '';
    return text
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
}

function extractFromXML(xml, tagName) {
    if (!xml) return null;
    
    const patterns = [
        new RegExp(`<${tagName}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*<\\/${tagName}>`, 'i'),
        new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i')
    ];
    
    for (const pattern of patterns) {
        const match = xml.match(pattern);
        if (match && match[1]) return cleanHTML(match[1]);
    }
    
    return null;
}

// Optimized: Fetch from multiple feeds in parallel with early return
async function fetchRSSFeeds(feedUrls, section) {
    // Start all fetches simultaneously
    const results = await Promise.allSettled(
        feedUrls.map(url => fetchRSSFeed(url, section))
    );
    
    const allArticles = results
        .filter(r => r.status === 'fulfilled')
        .flatMap(r => r.value);
    
    // Remove duplicates by title
    const seen = new Set();
    return allArticles.filter(article => {
        const key = article.title.toLowerCase().trim().substring(0, 60);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    }).slice(0, 15);
}

// ======================================
// DISPLAY FUNCTIONS
// ======================================
function displayPlaceholderContent() {
    console.log('📋 Displaying placeholder content...');
    
    ['tech', 'finance', 'gambling', 'fashion', 'lifestyle'].forEach(section => {
        const homeContainer = document.getElementById(`home-${section}-posts`);
        if (homeContainer && PLACEHOLDER_CONTENT[section]) {
            homeContainer.innerHTML = PLACEHOLDER_CONTENT[section]
                .slice(0, 2)
                .map(post => createPostCard(post, section))
                .join('');
        }
    });
}

function displayPosts(news) {
    console.log('📄 Displaying posts...');
    
    ['tech', 'finance', 'gambling', 'fashion', 'lifestyle'].forEach(section => {
        const postsContainer = document.getElementById(`${section}-posts`);
        
        if (postsContainer && news[section] && news[section].length > 0) {
            postsContainer.innerHTML = news[section]
                .map(post => createPostCard(post, section))
                .join('');
        }
    });
    
    displayFeaturedPosts(news);
}

function displayFeaturedPosts(news) {
    ['tech', 'finance', 'gambling', 'fashion', 'lifestyle'].forEach(section => {
        const homeContainer = document.getElementById(`home-${section}-posts`);
        
        if (homeContainer && news[section] && news[section].length > 0) {
            homeContainer.innerHTML = news[section].slice(0, 2)
                .map(post => createPostCard(post, section))
                .join('');
        }
    });
}

// ======================================
// ULTRA-FAST FETCH - INSTANT CACHE + PARALLEL BACKGROUND UPDATE
// ======================================
async function fetchLatestNews() {
    const startTime = Date.now();
    console.log('📡 Fetching latest news (target: <2s)...');
    
    // 1. Show cached news IMMEDIATELY if available
    const cached = getCachedNews();
    if (cached) {
        window.currentNews = cached;
        displayPosts(cached);
        console.log(`⚡ Displayed cached news in ${Date.now() - startTime}ms`);
    } else {
        // Show placeholders while loading
        displayPlaceholderContent();
    }
    
    // 2. Fetch ALL feeds in parallel with aggressive timeout
    try {
        const fetchStartTime = Date.now();
        
        // Fire all requests simultaneously
        const [techNews, financeNews, gamblingNews, fashionNews, lifestyleNews] = await Promise.all([
            fetchRSSFeeds(RSS_FEEDS.tech, 'tech'),
            fetchRSSFeeds(RSS_FEEDS.finance, 'finance'),
            fetchRSSFeeds(RSS_FEEDS.gambling, 'gambling'),
            fetchRSSFeeds(RSS_FEEDS.fashion, 'fashion'),
            fetchRSSFeeds(RSS_FEEDS.lifestyle, 'lifestyle')
        ]);
        
        const freshNews = {
            tech: techNews.length > 0 ? techNews : PLACEHOLDER_CONTENT.tech,
            finance: financeNews.length > 0 ? financeNews : PLACEHOLDER_CONTENT.finance,
            gambling: gamblingNews.length > 0 ? gamblingNews : PLACEHOLDER_CONTENT.gambling,
            fashion: fashionNews.length > 0 ? fashionNews : PLACEHOLDER_CONTENT.fashion,
            lifestyle: lifestyleNews.length > 0 ? lifestyleNews : PLACEHOLDER_CONTENT.lifestyle
        };
        
        window.currentNews = freshNews;
        setCachedNews(freshNews);
        displayPosts(freshNews);
        
        const totalTime = Date.now() - startTime;
        const fetchTime = Date.now() - fetchStartTime;
        
        console.log(`✅ Fresh news loaded in ${fetchTime}ms (total: ${totalTime}ms):`, {
            tech: freshNews.tech.length,
            finance: freshNews.finance.length,
            gambling: freshNews.gambling.length,
            fashion: freshNews.fashion.length,
            lifestyle: freshNews.lifestyle.length
        });
        
    } catch (error) {
        console.error('❌ Error fetching news:', error);
        if (!cached) {
            window.currentNews = PLACEHOLDER_CONTENT;
            displayPosts(PLACEHOLDER_CONTENT);
        }
    }
}
