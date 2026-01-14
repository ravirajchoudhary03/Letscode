import { NextRequest, NextResponse } from 'next/server';
import brandsData from '@/data/brands.json';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const brandName = searchParams.get('name');

    if (!brandName) {
        return NextResponse.json({ error: 'Brand name is required' }, { status: 400 });
    }

    // Normalize the brand name for searching
    const normalizedName = brandName.toLowerCase().trim();

    // Search for the brand in our data
    const brandData = brandsData.brands[normalizedName as keyof typeof brandsData.brands];

    if (!brandData) {
        return NextResponse.json({
            error: 'Brand not found',
            available: Object.keys(brandsData.brands)
        }, { status: 404 });
    }

    return NextResponse.json(brandData);
}
