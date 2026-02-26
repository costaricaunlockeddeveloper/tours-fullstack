import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import Reservation from '@/models/Reservation';
import dbConnect from '@/lib/mongodb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-01-28.clover' });
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    console.log("📥 Webhook request received at /api/webhooks/stripe");
    if (!process.env.STRIPE_SECRET_KEY) {
        return NextResponse.json({ error: 'Stripe Secret Key is missing' }, { status: 500 });
    }

    const body = await req.text();
    const sig = (await headers()).get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        if (endpointSecret) {
            console.log("🔐 Attempting to verify Stripe signature...");
            event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
            console.log("✅ Signature verified successfully.");
        } else {
            const jsonBody = JSON.parse(body);
            event = jsonBody;
            console.warn("⚠️ Webhook secret not configured. Skipping signature verification (DEV ONLY).");
        }
    } catch (err: any) {
        console.error(`❌ Webhook Signature Error: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const reservationId = session.metadata?.reservationId;
        console.log(`🔔 Webhook received: checkout.session.completed. ReservationId: ${reservationId}`);

        if (reservationId) {
            await dbConnect();

            // Extract payment details
            const paymentIntentId = session.payment_intent as string;
            const amountTotal = (session.amount_total || 0) / 100; // back to dollars
            const currency = session.currency || 'usd';

            // In a real scenario, you might want to fetch the payment intent to get more details
            // But session has enough for many cases

            console.log(`Updating reservation ${reservationId} to confirmed/paid...`);

            const updatedReservation = await Reservation.findByIdAndUpdate(reservationId, {
                status: 'confirmed',
                paymentStatus: 'paid',
                paymentId: paymentIntentId,
                paymentAmount: amountTotal,
                paymentCurrency: currency,
                paymentDate: new Date(),
                stripeSessionId: session.id,
                paymentMethod: session.payment_method_types?.[0] || 'card'
            }, { new: true });

            if (updatedReservation) {
                console.log(`✅ Reservation ${reservationId} successfully updated to confirmed/paid.`);
            } else {
                console.error(`❌ Reservation ${reservationId} NOT FOUND in database during update!`);
                // Check if maybe the ID is different or there's a connection issue
            }
        } else {
            console.warn("⚠️ No reservationId found in session metadata. Session ID:", session.id);
            console.log("Full Session Metadata:", JSON.stringify(session.metadata, null, 2));
        }
    } else {
        console.log(`ℹ️ Webhook received unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
