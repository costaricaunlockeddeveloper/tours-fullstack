import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import Reservation from '@/models/Reservation';
import dbConnect from '@/lib/mongodb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-01-28.clover' });

export async function POST(req: Request) {
    if (!process.env.STRIPE_SECRET_KEY) {
        return NextResponse.json({ error: 'Stripe Secret Key is missing' }, { status: 500 });
    }

    try {
        const body = await req.json();
        const { packageId, packageName, userId, userEmail, userName, startDate, endDate, adults, children, subtotal, total } = body;

        await dbConnect();

        // Create a pending reservation
        const newReservation = new Reservation({
            userId,
            userName: userName || userEmail,
            userEmail,
            packageId,
            packageName,
            startDate,
            endDate,
            adults,
            children,
            subtotal,
            totalPrice: total,
            pax: adults + children,
            status: 'pending',
            paymentStatus: 'unpaid',
            date: new Date().toISOString()
        });
        await newReservation.save();

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: userEmail,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Booking: ${packageName}`,
                            description: `Dates: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}. Adults: ${adults}, Children: ${children}`,
                        },
                        unit_amount: Math.round(total * 100), // in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/historical-purchases?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/tour-packages/${packageId}?canceled=true`,
            metadata: {
                reservationId: newReservation._id.toString(),
                userId: userId,
            },
        });

        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (err: any) {
        console.error("Stripe Checkout Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
