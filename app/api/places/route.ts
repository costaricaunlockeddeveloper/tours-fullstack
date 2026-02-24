import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Place from '@/models/Place';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const isCatalog = searchParams.get('select') === 'catalog';
    const statusQuery = searchParams.get('status');

    try {
        const queryPipeline: any[] = [];
        if (isCatalog) {
            queryPipeline.push({ $match: { status: 'PUBLISHED' } });
        } else if (statusQuery) {
            queryPipeline.push({ $match: { status: statusQuery } });
        } else {
            queryPipeline.push({ $match: { status: { $ne: 'ARCHIVED' } } });
        }

        queryPipeline.push(
            {
                $lookup: {
                    from: "tours",
                    let: { placeId: { $toString: "$_id" } },
                    pipeline: [
                        { $match: { $expr: { $in: ["$$placeId", { $ifNull: ["$placeIds", []] }] } } },
                        { $count: "count" }
                    ],
                    as: "toursCount"
                }
            },
            {
                $lookup: {
                    from: "packages",
                    let: { placeId: { $toString: "$_id" } },
                    pipeline: [
                        { $match: { $expr: { $in: ["$$placeId", { $ifNull: ["$placeIds", []] }] } } },
                        { $count: "count" }
                    ],
                    as: "packagesCount"
                }
            },
            {
                $addFields: {
                    tours: { $ifNull: [{ $arrayElemAt: ["$toursCount.count", 0] }, 0] },
                    packages: { $ifNull: [{ $arrayElemAt: ["$packagesCount.count", 0] }, 0] },
                    id: { $toString: "$_id" }
                }
            },
            {
                $project: {
                    toursCount: 0,
                    packagesCount: 0,
                    _id: 0
                }
            }
        );

        const places = await Place.aggregate(queryPipeline);
        
        return NextResponse.json(places);
    } catch (error) {
        console.error("Error fetching places:", error);
        return NextResponse.json({ error: 'Failed to fetch places' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const body = await request.json();

        // Check for slug uniqueness
        if (body.slug) {
            const existingPlace = await Place.findOne({ slug: body.slug });
            if (existingPlace) {
                return NextResponse.json({ error: 'Slug ya existe. Por favor cambie el nombre del destino.' }, { status: 400 });
            }
        }

        console.log("API POST received body images:", JSON.stringify(body.images?.secondaryAssets, null, 2));
        const place = await Place.create(body);
        return NextResponse.json(place, { status: 201 });
    } catch (error) {
        console.error("Error creating place:", error);
        return NextResponse.json(
            { error: 'Failed to create place', details: error instanceof Error ? error.message : String(error) },
            { status: 400 }
        );
    }
}
