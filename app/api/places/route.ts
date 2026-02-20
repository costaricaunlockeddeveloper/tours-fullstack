import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Place from '@/models/Place';

export async function GET() {
    await dbConnect();
    try {
        const places = await Place.aggregate([
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
        ]);
        
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
        console.log("API POST received body images:", JSON.stringify(body.images?.secondaryAssets, null, 2));
        const place = await Place.create(body);
        return NextResponse.json(place, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create place' }, { status: 400 });
    }
}
