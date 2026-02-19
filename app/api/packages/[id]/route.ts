import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Package from '@/models/Package';
import mongoose from 'mongoose';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await dbConnect();
    try {
        // Try by ObjectId first, then by slug
        let pkg = null;
        if (mongoose.Types.ObjectId.isValid(id)) {
            pkg = await Package.findById(id);
        }
        if (!pkg) {
            pkg = await Package.findOne({ slug: id });
        }
        if (!pkg) {
            return NextResponse.json({ error: 'Package not found' }, { status: 404 });
        }
        return NextResponse.json(pkg);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch package' }, { status: 500 });
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
        
        let pkg;
        if (mongoose.Types.ObjectId.isValid(id)) {
            pkg = await Package.findByIdAndUpdate(id, body, {
                new: true,
                runValidators: true,
            });
        } else {
             pkg = await Package.findOneAndUpdate({ slug: id }, body, {
                new: true,
                runValidators: true,
            });
        }

        if (!pkg) {
            return NextResponse.json({ error: 'Package not found' }, { status: 404 });
        }
        return NextResponse.json(pkg);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update package' }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await dbConnect();
    try {
        let pkg;
        if (mongoose.Types.ObjectId.isValid(id)) {
            pkg = await Package.findByIdAndDelete(id);
        } else {
            pkg = await Package.findOneAndDelete({ slug: id });
        }

        if (!pkg) {
            return NextResponse.json({ error: 'Package not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Package deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 });
    }
}
