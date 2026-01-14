const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------
// 1. DATA SOURCES
// ---------------------------------------------------------

const categories = ['fashion', 'sportswear', 'beauty', 'food', 'tech', 'home', 'accessories', 'jewelry', 'wellness', 'pets', 'footwear'];

// Existing real brands (Keep these to ensure quality searches works)
const realBrands = [
    // --- TOP INDIAN D2C BRANDS ---
    // Fashion & Apparel
    { name: 'Bewakoof', category: 'fashion' }, { name: 'The Souled Store', category: 'fashion' },
    { name: 'Snitch', category: 'fashion' }, { name: 'Rare Rabbit', category: 'fashion' },
    { name: 'Zivame', category: 'fashion' }, { name: 'Clovia', category: 'fashion' },
    { name: 'Urbanic', category: 'fashion' }, { name: 'BlissClub', category: 'fashion' },
    { name: 'FableStreet', category: 'fashion' }, { name: 'Bombay Shirt Company', category: 'fashion' },
    { name: 'Nykd by Nykaa', category: 'fashion' }, { name: 'DaMENSCH', category: 'fashion' },

    // Beauty & Personal Care
    { name: 'Mamaearth', category: 'beauty' }, { name: 'Sugar Cosmetics', category: 'beauty' },
    { name: 'Wow Skin Science', category: 'beauty' }, { name: 'Minimalist', category: 'beauty' },
    { name: 'Plum', category: 'beauty' }, { name: 'mCaffeine', category: 'beauty' },
    { name: 'Dot & Key', category: 'beauty' }, { name: 'The Man Company', category: 'beauty' },
    { name: 'Beardo', category: 'beauty' }, { name: 'Bombay Shaving Company', category: 'beauty' },
    { name: 'Renee Cosmetics', category: 'beauty' }, { name: 'Pilgrim', category: 'beauty' },
    { name: 'Foxtale', category: 'beauty' }, { name: 'Aqualogica', category: 'beauty' },
    { name: 'Dr. Sheth\'s', category: 'beauty' }, { name: 'LoveChild by Masaba', category: 'beauty' },

    // Electronics & Tech
    { name: 'boAt', category: 'tech' }, { name: 'Noise', category: 'tech' },
    { name: 'Fire-Boltt', category: 'tech' }, { name: 'Mivi', category: 'tech' },
    { name: 'Boult Audio', category: 'tech' }, { name: 'Hammer', category: 'tech' },

    // Food & Beverage
    { name: 'Licious', category: 'food' }, { name: 'Country Delight', category: 'food' },
    { name: 'Blue Tokai', category: 'food' }, { name: 'Sleepy Owl', category: 'food' },
    { name: 'The Whole Truth', category: 'food' }, { name: 'Yoga Bar', category: 'food' },
    { name: 'Open Secret', category: 'food' }, { name: 'Happilo', category: 'food' },
    { name: 'iD Fresh Food', category: 'food' }, { name: 'Vahdam Teas', category: 'food' },
    { name: 'Slurrp Farm', category: 'food' }, { name: 'Kapiva', category: 'food' },

    // Home & Lifestyle
    { name: 'Wakefit', category: 'home' }, { name: 'Sleepyhead', category: 'home' },
    { name: 'The Sleep Company', category: 'home' }, { name: 'Pepperfry', category: 'home' },
    { name: 'WoodenStreet', category: 'home' }, { name: 'Vaaree', category: 'home' },
    { name: 'Chumbak', category: 'home' }, { name: 'Nestasia', category: 'home' },

    // Eyewear
    { name: 'Lenskart', category: 'eyewear' }, { name: 'John Jacobs', category: 'eyewear' },
    { name: 'Coolwinks', category: 'eyewear' },

    // Footwear
    { name: 'Neeman\'s', category: 'footwear' }, { name: 'Campus', category: 'footwear' },
    { name: 'Asian Footwears', category: 'footwear' }, { name: 'Yoho', category: 'footwear' },

    // Luggage & Bags
    { name: 'Mokobara', category: 'accessories' }, { name: 'Safari', category: 'accessories' },
    { name: 'Skybags', category: 'accessories' }, { name: 'DailyObjects', category: 'accessories' },
    { name: 'Zouk', category: 'accessories' },

    // Jewelry
    { name: 'Giva', category: 'jewelry' }, { name: 'Melorra', category: 'jewelry' },
    { name: 'Kushal\'s', category: 'jewelry' }, { name: 'CaratLane', category: 'jewelry' },
    { name: 'BlueStone', category: 'jewelry' },

    // Global Giants
    { name: 'Zara', category: 'fashion' }, { name: 'H&M', category: 'fashion' },
    { name: 'Uniqlo', category: 'fashion' }, { name: 'Nike', category: 'sportswear' },
    { name: 'Adidas', category: 'sportswear' }, { name: 'Apple', category: 'tech' },
    { name: 'Samsung', category: 'tech' }, { name: 'IKEA', category: 'home' }
];

// Name Generators
const prefixes = [
    'Urban', 'Mystic', 'Royal', 'Blue', 'Red', 'Green', 'Golden', 'Silver', 'Iron', 'Velvet',
    'Silk', 'Cotton', 'Pure', 'Eco', 'Terra', 'Luna', 'Solar', 'Stellar', 'Nova', 'Rapid',
    'Swift', 'Bold', 'Wild', 'Free', 'Happy', 'Joy', 'Zen', 'Vita', 'Bio', 'Organic',
    'Future', 'Modern', 'Classic', 'Vintage', 'Retro', 'Neon', 'Cyber', 'Tech', 'Smart', 'Pro',
    'Max', 'Ultra', 'Prime', 'Elite', 'Grand', 'Noble', 'King', 'Queen', 'Star', 'Moon',
    'Sun', 'Sky', 'Ocean', 'River', 'Mountain', 'Forest', 'Bloom', 'Leaf', 'Root', 'Seed',
    'Fresh', 'Clean', 'Bright', 'Dark', 'Night', 'Day', 'Light', 'Shadow', 'Spark', 'Glow',
    'Flow', 'Wave', 'Vibe', 'Soul', 'Spirit', 'Mind', 'Body', 'Heart', 'Life', 'Love',
    'Dream', 'Wish', 'Hope', 'Faith', 'Trust', 'Truth', 'Wise', 'Cool', 'Hot', 'Warm',
    'Soft', 'Hard', 'Smooth', 'Rough', 'Sharp', 'Sweet', 'Sour', 'Spicy', 'Bitter', 'Salty'
];

const suffixes = [
    'ify', 'ly', 'hub', 'lab', 'co', 'inc', 'works', 'box', 'kart', 'mart',
    'store', 'shop', 'zone', 'space', 'place', 'world', 'land', 'planet', 'verse', 'sphere',
    'tech', 'sys', 'net', 'web', 'app', 'soft', 'ware', 'bot', 'ai', 'gen',
    'flow', 'wave', 'sync', 'link', 'connect', 'bridge', 'gate', 'way', 'path', 'road',
    'street', 'ave', 'lane', 'drive', 'ride', 'run', 'walk', 'step', 'jump', 'fly',
    'wear', 'gear', 'fit', 'style', 'look', 'mode', 'trend', 'chic', 'vogue', 'glam',
    'beauty', 'skin', 'care', 'health', 'well', 'good', 'fine', 'best', 'top', 'peak',
    'craft', 'art', 'design', 'studio', 'maker', 'smith', 'forge', 'build', 'create', 'make',
    'chef', 'cook', 'food', 'eat', 'drink', 'sip', 'bite', 'taste', 'flavor', 'spice',
    'home', 'house', 'room', 'living', 'decor', 'furnish', 'bed', 'bath', 'kitchen', 'garden'
];

const midfixes = ['', ' ', '-', ' & '];

// ---------------------------------------------------------
// 2. HELPER FUNCTIONS
// ---------------------------------------------------------

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateName() {
    const prefix = getRandomItem(prefixes);
    const suffix = getRandomItem(suffixes);
    const mid = Math.random() > 0.7 ? getRandomItem(midfixes) : ''; // 30% chance of separator

    // Capitalize suffix if separated
    let finalSuffix = suffix;
    if (mid !== '') {
        finalSuffix = suffix.charAt(0).toUpperCase() + suffix.slice(1);
    }

    return `${prefix}${mid}${finalSuffix}`;
}

function generateBrandData(brandName, category) {
    const totalMentions = getRandomInt(1000, 100000);

    // Simulate realistic distributions
    const platforms = ['Reddit', 'Google Search', 'YouTube'];
    const topPlatform = getRandomItem(platforms);
    const topMentions = Math.floor(totalMentions * (0.4 + Math.random() * 0.4)); // 40-80% on top platform

    const remaining = totalMentions - topMentions;
    const secondMentions = Math.floor(remaining * 0.7);
    const thirdMentions = remaining - secondMentions;

    const dist = {
        [topPlatform]: topMentions,
        [platforms.find(p => p !== topPlatform)]: secondMentions,
        [platforms.find(p => p !== topPlatform && p !== platforms.find(x => x !== topPlatform))]: thirdMentions
    };

    // Fix keys to match schema
    const platformDistribution = {
        reddit: dist['Reddit'] || 0,
        googleSearch: dist['Google Search'] || 0,
        youtube: dist['YouTube'] || 0
    };

    const sovScore = getRandomInt(1, 40); // Synthetic data usually lower SOV

    // Generate simple market scores
    const marketScore = getRandomInt(40, 95);

    return {
        name: brandName,
        category: category,
        totalMentions: totalMentions,
        mentionGrowth: getRandomInt(-10, 30),
        topPlatform: {
            name: topPlatform,
            mentions: topMentions
        },
        platformDistribution: platformDistribution,
        shareOfVoice: {
            score: sovScore,
            mentions: Math.floor(totalMentions * (sovScore / 100)),
            growth: getRandomInt(-5, 10),
            competitors: [
                { name: "Competitor A", score: 20, mentions: 1000 },
                { name: "Competitor B", score: 15, mentions: 800 },
                { name: "Competitor C", score: 10, mentions: 500 }
            ]
        },
        marketIndexScore: {
            score: marketScore,
            categoryAverage: getRandomInt(50, 70),
            trend: getRandomInt(-5, 5) > 0 ? `+${getRandomInt(1, 10)}` : `${getRandomInt(-5, -1)}`,
            visibility: parseFloat((0.4 + Math.random() * 0.5).toFixed(2)),
            engagement: parseFloat((0.4 + Math.random() * 0.5).toFixed(2)),
            breadth: parseFloat((0.4 + Math.random() * 0.5).toFixed(2))
        },
        platformVisibility: {
            normalizedScores: {
                brand: getRandomInt(40, 90),
                competitor1: getRandomInt(40, 90),
                competitor2: getRandomInt(40, 90),
                competitor3: getRandomInt(40, 90)
            },
            strongestPlatform: {
                name: topPlatform,
                score: getRandomInt(60, 95)
            },
            competitorLeadPlatform: {
                name: getRandomItem(platforms),
                competitor: "Competitor A",
                score: getRandomInt(60, 95)
            }
        }
    };
}

// ---------------------------------------------------------
// 3. EXECUTION
// ---------------------------------------------------------

const allBrands = {};
const targetCount = 10000;
let count = 0;

// 1. Add Real Brands first
console.log("Adding real brands...");
realBrands.forEach(b => {
    const key = b.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!allBrands[key]) {
        allBrands[key] = generateBrandData(b.name, b.category);
        count++;
    }
});

// 2. Fill the rest with Synthetic Brands
console.log(`Generating ${targetCount - count} synthetic brands...`);

const generatedNames = new Set();

while (count < targetCount) {
    let name = generateName();

    // Ensure uniqueness
    let attempts = 0;
    while (generatedNames.has(name) || allBrands[name.toLowerCase().replace(/[^a-z0-9]/g, '')]) {
        name = generateName() + " " + getRandomInt(1, 999); // Add suffix if collision
        attempts++;
        if (attempts > 10) break;
    }

    generatedNames.add(name);

    const category = getRandomItem(categories);
    const key = name.toLowerCase().replace(/[^a-z0-9]/g, '');

    allBrands[key] = generateBrandData(name, category);
    count++;

    if (count % 1000 === 0) console.log(`Generated ${count} brands...`);
}

const output = {
    brands: allBrands
};

const outputPath = path.join(__dirname, 'src', 'data', 'brands.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log(`\nSUCCESS! generated ${count} brands.`);
console.log(`File written to: ${outputPath}`);
