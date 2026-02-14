
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';

export async function GET() {
    try {
        await dbConnect();

        const email = 'admin@admin';
        const password = 'admin';
        const hashedPassword = await hashPassword(password);

        // Initial admin user
        const adminUser = await User.findOneAndUpdate(
            { email },
            {
                email,
                password: hashedPassword,
                role: 'admin',
                displayName: 'Admin User',
                uid: 'admin-seed-uid'
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json({ success: true, message: 'Admin user seeded', user: adminUser });
    } catch (error) {
        console.error("Seeding error:", error);
        return NextResponse.json({ error: 'Seeding failed' }, { status: 500 });
    }
}
