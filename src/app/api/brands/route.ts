import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Simple in-memory cache to avoid parsing 14MB JSON on every request
let cachedBrands: any = null;

function getBrands() {
    if (cachedBrands) return cachedBrands;

    try {
        // Use public folder for runtime file reliability in Vercel
        const filePath = path.join(process.cwd(), 'public', 'brands.json');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        cachedBrands = JSON.parse(fileContents);
        return cachedBrands;
    } catch (error) {
        console.error('Error reading brands.json:', error);
        return { brands: {} };
    }
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const brandName = searchParams.get('name');

    if (!brandName) {
        return NextResponse.json({ error: 'Brand name is required' }, { status: 400 });
    }

    // Normalize the brand name for searching
    const normalizedName = brandName.toLowerCase().trim();

    // Get data from cache
    const brandsData = getBrands();
    const brands = brandsData.brands || {};
    const brandData = brands[normalizedName];

    if (!brandData) {
        return NextResponse.json({
            error: 'Brand not found',
            // Return only a few suggestions
            available: Object.keys(brands).slice(0, 10)
        }, { status: 404 });
    }

    return NextResponse.json(brandData);
}
