import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Package from '@/models/Package';

export async function GET(request: Request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const select = searchParams.get('select');

    try {
        if (select === 'catalog') {
            const packages = await Package.find({ status: 'PUBLISHED' })
                .select('name region rating reviews price slug images.heroImage')
                .lean();

            const catalogPackages = packages.map((pkg: any) => ({
                id: pkg._id,
                name: pkg.name,
                slug: pkg.slug,
                region: pkg.region,
                rating: pkg.rating,
                reviews: pkg.reviews,
                price: pkg.price,
                imageUrl: pkg.images?.heroImage?.path || '/assets/img/destination/destination-1.jpg'
            }));

            return NextResponse.json(catalogPackages);
        }

        const packages = await Package.find({ status: { $ne: 'ARCHIVED' } });
        return NextResponse.json(packages);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const body = await request.json();

        // Check for slug uniqueness
        if (body.slug) {
            const existingPackage = await Package.findOne({ slug: body.slug });
            if (existingPackage) {
                return NextResponse.json({ error: 'Slug ya existe. Por favor cambie el nombre del paquete.' }, { status: 400 });
            }
        }

        const pkg = await Package.create(body);
        return NextResponse.json(pkg, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create package' }, { status: 400 });
    }
}
