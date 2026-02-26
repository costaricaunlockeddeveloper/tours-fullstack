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
        const {
            packageId, packageName,
            tourId, tourName,
            userId, userEmail, userName,
            startDate, endDate,
            adults, children, subtotal, total,
            date, // For tours, might be just one date
            time // Capture time for tours
        } = body;

        await dbConnect();

        // Create a pending reservation
        const newReservation = new Reservation({
            userId,
            userName: userName || userEmail,
            userEmail,
            packageId,
            packageName,
            tourId,
            tourName,
            startDate: startDate || date,
            endDate: endDate || date,
            selectedTime: time, // Save the time
            adults,
            children,
            unitPriceAdult: adults > 0 ? (subtotal / (adults + (children > 0 ? (children * (subtotal / total)) : 0))) : 0, // Simplified or better pass from client
            unitPriceChild: children > 0 ? (subtotal / ((adults * (total / subtotal)) + children)) : 0, // This logic is tricky without knowing the exact split, better to pass them from frontend or calculate based on business rules.
            subtotal,
            totalPrice: total,
            pax: (adults || 0) + (children || 0),
            status: 'pending',
            paymentStatus: 'unpaid',
            date: date || new Date().toISOString()
        });
        await newReservation.save();

        const name = packageName || tourName || 'Booking';
        const description = tourId
            ? `Date: ${new Date(date).toLocaleDateString()}. Adults: ${adults}, Children: ${children}`
            : `Dates: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}. Adults: ${adults}, Children: ${children}`;

        const cancelUrl = tourId
            ? `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/tour/${packageId}?canceled=true` // Note: packageId in the body seems to be used for the slug in the frontend
            : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/tour-packages/${packageId}?canceled=true`;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: userEmail,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Booking: ${name}`,
                            description: description,
                        },
                        unit_amount: Math.round(total * 100), // in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/historical-purchases?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl,
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
