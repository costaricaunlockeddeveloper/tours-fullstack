import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Place from '@/models/Place';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await dbConnect();
    try {
        let place;
        if (mongoose.Types.ObjectId.isValid(id)) {
            place = await Place.findById(id);
        }
        
        if (!place) {
             place = await Place.findOne({ slug: id });
        }

        if (!place) {
            return NextResponse.json({ error: 'Place not found' }, { status: 404 });
        }
        return NextResponse.json(place);
    } catch (error) {
        console.error("Error fetching place:", error);
        return NextResponse.json({ error: 'Failed to fetch place' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await dbConnect();
    try {
        const body = await request.json();
        console.log("API PUT received body images:", JSON.stringify(body.images?.secondaryAssets, null, 2));
        const place = await Place.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });
        if (!place) {
            return NextResponse.json({ error: 'Place not found' }, { status: 404 });
        }
        return NextResponse.json(place);
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: 'Slug ya existe. Por favor cambie el nombre del destino.' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to update place' }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await dbConnect();
    try {
        const place = await Place.findByIdAndDelete(id);
        if (!place) {
            return NextResponse.json({ error: 'Place not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Place deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete place' }, { status: 500 });
    }
}
