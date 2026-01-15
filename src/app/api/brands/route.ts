import { NextRequest, NextResponse } from 'next/server';
import brandsDataRaw from '../../../data/brands.json';

// Use direct import for reliable Vercel bundling
const brandsData = brandsDataRaw as any;

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const brandName = searchParams.get('name');

    if (!brandName) {
        return NextResponse.json({ error: 'Brand name is required' }, { status: 400 });
    }

    const normalizedName = brandName.toLowerCase().trim();
    const brands = brandsData.brands || {};
    const brandData = brands[normalizedName];

    if (brandData) {
        return NextResponse.json(brandData);
    } else {
        return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }
}
