import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import Reservation from '@/models/Reservation';
import dbConnect from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Find reservations by email or userId. 
        // Using email is safer if userId might change or be different across providers, 
        // but typically userId is best if consistent.
        // Reservation model has userEmail.
        const reservations = await Reservation.find({
            userEmail: session.user.email
        }).sort({ createdAt: -1 });

        return NextResponse.json(reservations);
    } catch (err: any) {
        console.error("Error fetching reservations:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
