const fs = require('fs');

// D2C Brand Categories and Names
const d2cBrands = {
    fashion: ['Zara', 'H&M', 'Calvin Klein', 'Uniqlo', 'Shein', 'Everlane', 'Warby Parker', 'Allbirds', 'Patagonia', 'Reformation', 'Outdoor Voices', 'Bonobos', 'Stitch Fix', 'ThredUp', 'Rent the Runway', 'Fashion Nova', 'Asos', 'Boohoo', 'Missguided', 'PrettyLittleThing'],
    sportswear: ['Nike', 'Adidas', 'Puma', 'Under Armour', 'Reebok', 'New Balance', 'Lululemon', 'Gymshark', 'Fabletics', 'Rhone', 'Vuori', 'Athleta', 'Sweaty Betty', 'Alo Yoga', 'Beyond Yoga'],
    beauty: ['Glossier', 'Fenty Beauty', 'Kylie Cosmetics', 'Drunk Elephant', 'The Ordinary', 'Tatcha', 'Glow Recipe', 'Milk Makeup', 'Herbivore', 'Youth To The People', 'Beautycounter', 'Function of Beauty', 'Curology', 'Hims', 'Hers'],
    food: ['HelloFresh', 'Blue Apron', 'Daily Harvest', 'Thrive Market', 'Perfect Bar', 'Kind Snacks', 'RXBAR', 'Magic Spoon', 'Liquid Death', 'Athletic Greens', 'Four Sigmatic', 'Omsom'],
    tech: ['Apple', 'Samsung', 'OnePlus', 'Nothing', 'Anker', 'Nomad', 'Peak Design', 'Twelve South', 'Moft', 'Bellroy'],
    home: ['Casper', 'Purple', 'Brooklinen', 'Parachute', 'Tuft & Needle', 'Burrow', 'Floyd', 'Article', 'Wayfair', 'Ruggable', 'Our Place', 'Great Jones', 'Caraway'],
    accessories: ['Away', 'Raden', 'Nomatic', 'Bellroy', 'Ridge Wallet', 'Secrid', 'Herschel', 'Fjallraven', 'Tumi'],
    jewelry: ['Mejuri', 'Catbird', 'AUrate', 'Brilliant Earth', 'Vrai', 'Missoma', 'Monica Vinader'],
    wellness: ['Peloton', 'Mirror', 'Tonal', 'Hydrow', 'Theragun', 'Hyperice', 'Oura', 'Whoop', 'Eight Sleep', 'Hatch'],
    pets: ['Chewy', 'BarkBox', 'The Farmer\'s Dog', 'Ollie', 'Nom Nom', 'Wild Earth'],
};

// Top 100 Indian D2C Brands
const indianD2CBrands = {
    fashion: ['Bewakoof', 'The Souled Store', 'Snitch', 'Rare Rabbit', 'Clovia', 'Zivame', 'Urbanic', 'Virgio', 'Chumbak', 'FabAlley', 'Janasya', 'Sassafras', 'Cottonworld', 'W for Woman', 'Libas', 'Biba', 'House of Pataudi', 'Taavi', 'The Loom', 'Bombay Shirt Company'],
    beauty: ['Mamaearth', 'Wow Skin Science', 'mCaffeine', 'Plum', 'Dot & Key', 'Minimalist', 'Pilgrim', 'Juicy Chemistry', 'The Man Company', 'Beardo', 'Sugar Cosmetics', 'MyGlamm', 'Nykaa', 'Purplle', 'Carmesi', 'Pee Safe', 'Bombay Shaving Company', 'The Moms Co', 'Ayuga', 'Dr Sheth'],
    food: ['Licious', 'Country Delight', 'Epigamia', 'Sleepy Owl', 'Blue Tokai', 'Vahdam Teas', 'Yoga Bar', 'Slurrp Farm', 'Oziva', 'HealthKart', 'Wellversed', 'Kapiva', 'True Elements', 'Nutribowl', 'Pintola', 'Farmley', 'Pro Nature', 'Raw Pressery', 'Paper Boat'],
    footwear: ['Campus', 'FREAKINS', 'Neeman\'s', 'Solethreads', 'Monrow', 'Trase', 'The Pant Project', 'Shoe Tonic'],
    wellness: ['HealthifyMe', 'Cure.fit', 'Mosaic Wellness', 'Man Matters', 'Be Bodywise', 'Traya Health', 'The Whole Truth Foods', 'Wellbeing Nutrition'],
    jewelry: ['Giva', 'Melorra', 'Ornaz', 'Quirksmith', 'Amama', 'Pipa Bella', 'Tarinika', 'Outhouse'],
    home: ['Wakefit', 'The Sleep Company', 'Sleepyhead', 'Pepperfry', 'HomeLane', 'Livspace', 'UrbanLadder', 'FabFurnish', 'Furrn', 'Furlenco'],
    eyewear: ['Lenskart', 'Coolwinks', 'Specsmakers', 'John Jacobs', 'Titan Eye+'],
    personal_care: ['The Body Cupboard', 'Bare Anatomy', 'Chemist at Play', 'Fix My Curls', 'Earth Rhythm', 'Ustraa', 'Bella Vita Organic'],
    kids: ['FirstCry', 'Hopscotch', 'Cub McPaws', 'SuperBottoms', 'Buddsbuddy', 'Catamaran Kids'],
    bags: ['Caprese', 'Baggit', 'Lavie', 'Ьeige', 'Da Milano', 'Hidesign']
};

// Competitor pools by category
const competitorPools = {
    fashion: ['Zara', 'H&M', 'Uniqlo', 'Bewakoof', 'The Souled Store', 'Snitch'],
    sportswear: ['Nike', 'Adidas', 'Puma', 'Under Armour', 'Reebok', 'New Balance'],
    beauty: ['Glossier', 'Fenty Beauty', 'Mamaearth', 'Nykaa', 'Sugar Cosmetics', 'MyGlamm'],
    food: ['HelloFresh', 'Blue Apron', 'Licious', 'Country Delight', 'Epigamia'],
    tech: ['Apple', 'Samsung', 'OnePlus', 'Nothing', 'Google', 'Microsoft'],
    home: ['Casper', 'Purple', 'Wakefit', 'The Sleep Company', 'UrbanLadder'],
    accessories: ['Away', 'Samsonite', 'Travelpro', 'Rimowa'],
    jewelry: ['Mejuri', 'Catbird', 'Giva', 'Melorra', 'Pandora'],
    wellness: ['Peloton', 'NordicTrack', 'Cure.fit', 'HealthifyMe'],
    pets: ['Chewy', 'BarkBox', 'Petco', 'PetSmart'],
    footwear: ['Nike', 'Adidas', 'Campus', 'Neeman\'s', 'FREAKINS'],
    eyewear: ['Lenskart', 'Warby Parker', 'Coolwinks', 'John Jacobs'],
    personal_care: ['Mamaearth', 'The Body Shop', 'Plum', 'Beardo'],
    kids: ['FirstCry', 'Hopscotch', 'Carter\'s', 'Mothercare'],
    bags: ['Caprese', 'Baggit', 'Lavie', 'Da Milano']
};

// Helper functions
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomCompetitors(category, brandName, count = 3) {
    const pool = competitorPools[category] || competitorPools.fashion;
    const filtered = pool.filter(name => name !== brandName);
    const shuffled = filtered.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function generateBrandData(brandName, category) {
    const totalMentions = getRandomInt(5000, 50000);
    const mentionGrowth = getRandomInt(-5, 25);

    const platforms = ['Reddit', 'Google Search', 'YouTube'];
    const topPlatform = platforms[getRandomInt(0, platforms.length - 1)];
    const topPlatformMentions = Math.floor(totalMentions * (0.3 + Math.random() * 0.3));

    const redditMentions = topPlatform === 'Reddit' ? topPlatformMentions : getRandomInt(1000, totalMentions * 0.4);
    const googleMentions = topPlatform === 'Google Search' ? topPlatformMentions : getRandomInt(1000, totalMentions * 0.4);
    const youtubeMentions = topPlatform === 'YouTube' ? topPlatformMentions : getRandomInt(1000, totalMentions * 0.4);

    const sovScore = getRandomInt(5, 60);
    const sovMentions = Math.floor(totalMentions * (sovScore / 100));
    const sovGrowth = getRandomInt(-5, 20);

    const competitors = getRandomCompetitors(category, brandName, 3);
    const remainingSOV = 100 - sovScore;
    let competitorSOVs = [
        Math.floor(remainingSOV * 0.5),
        Math.floor(remainingSOV * 0.3),
        Math.floor(remainingSOV * 0.2)
    ];

    const marketScore = getRandomInt(40, 95);
    const categoryAverage = getRandomInt(50, 80);
    const trend = marketScore - categoryAverage;

    const visibility = (0.5 + Math.random() * 0.4).toFixed(2);
    const engagement = (0.5 + Math.random() * 0.4).toFixed(2);
    const breadth = (0.5 + Math.random() * 0.4).toFixed(2);

    const platformScores = {
        brand: getRandomInt(45, 90),
        competitor1: getRandomInt(40, 85),
        competitor2: getRandomInt(35, 75),
        competitor3: getRandomInt(30, 70)
    };

    return {
        name: brandName,
        category: category,
        totalMentions: totalMentions,
        mentionGrowth: mentionGrowth,
        topPlatform: {
            name: topPlatform,
            mentions: topPlatformMentions
        },
        platformDistribution: {
            reddit: redditMentions,
            googleSearch: googleMentions,
            youtube: youtubeMentions
        },
        shareOfVoice: {
            score: sovScore,
            mentions: sovMentions,
            growth: sovGrowth,
            competitors: [
                { name: competitors[0], score: competitorSOVs[0], mentions: Math.floor(sovMentions * competitorSOVs[0] / sovScore) },
                { name: competitors[1], score: competitorSOVs[1], mentions: Math.floor(sovMentions * competitorSOVs[1] / sovScore) },
                { name: competitors[2], score: competitorSOVs[2], mentions: Math.floor(sovMentions * competitorSOVs[2] / sovScore) }
            ]
        },
        marketIndexScore: {
            score: marketScore,
            categoryAverage: categoryAverage,
            trend: trend > 0 ? `+${trend}` : `${trend}`,
            visibility: parseFloat(visibility),
            engagement: parseFloat(engagement),
            breadth: parseFloat(breadth)
        },
        platformVisibility: {
            normalizedScores: platformScores,
            strongestPlatform: {
                name: platforms[getRandomInt(0, 2)],
                score: platformScores.brand
            },
            competitorLeadPlatform: {
                name: platforms[getRandomInt(0, 2)],
                competitor: competitors[0],
                score: platformScores.competitor1
            }
        }
    };
}

// Generate all brands
const allBrands = {};
let brandCount = 0;

// Add global brands
for (const [category, brands] of Object.entries(d2cBrands)) {
    for (const brand of brands) {
        const key = brand.toLowerCase().replace(/[^a-z0-9]/g, '');
        allBrands[key] = generateBrandData(brand, category);
        brandCount++;
    }
}

// Add Indian D2C brands
for (const [category, brands] of Object.entries(indianD2CBrands)) {
    for (const brand of brands) {
        const key = brand.toLowerCase().replace(/[^a-z0-9]/g, '');
        allBrands[key] = generateBrandData(brand, category);
        brandCount++;
    }
}

const output = {
    brands: allBrands
};

// Write to file
fs.writeFileSync('brands-generated.json', JSON.stringify(output, null, 2));
console.log(`Generated data for ${Object.keys(allBrands).length} brands!`);
console.log(`- Global brands: ${Object.values(d2cBrands).flat().length}`);
console.log(`- Indian D2C brands: ${Object.values(indianD2CBrands).flat().length}`);
