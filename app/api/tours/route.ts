import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Tour from '@/models/Tour';
import Place from '@/models/Place';

export async function GET(request: Request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get('placeId');
    const select = searchParams.get('select');

    const query: any = placeId ? { placeIds: placeId } : {};
    
    // Default to hide ARCHIVED items everywhere
    query.status = { $ne: 'ARCHIVED' };

    try {
        if (select === 'catalog') {
            query.status = 'PUBLISHED';
            const tours = await Tour.find(query)
                .select('name placeIds duration rating reviews defaults.price slug images.heroImage')
                .lean();

            const catalogTours = tours.map((tour: any) => ({
                id: tour._id,
                title: tour.name,
                slug: tour.slug,
                duration: tour.duration,
                rating: tour.rating,
                reviews: tour.reviews,
                price: tour.defaults?.price || 0,
                destinationsCount: tour.placeIds?.length || 0,
                imageUrl: tour.images?.heroImage?.path || '/assets/img/destination/destination-1.jpg' // Default or fallback
            }));
            
            return NextResponse.json(catalogTours);
        }

        const tours = await Tour.find(query);
        return NextResponse.json(tours);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch tours' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const body = await request.json();

        // Check for slug uniqueness
        if (body.slug) {
            const existingTour = await Tour.findOne({ slug: body.slug });
            if (existingTour) {
                return NextResponse.json({ error: 'Slug ya existe. Por favor cambie el nombre del tour.' }, { status: 400 });
            }
        }

        const tour = await Tour.create(body);
        return NextResponse.json(tour, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create tour' }, { status: 400 });
    }
}
