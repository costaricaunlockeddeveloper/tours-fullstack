import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Tour from '@/models/Tour';
import Place from '@/models/Place';

export async function GET(request: Request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get('placeId');
    const query = placeId ? { placeIds: placeId } : {};

    try {
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
        const tour = await Tour.create(body);
        return NextResponse.json(tour, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create tour' }, { status: 400 });
    }
}
