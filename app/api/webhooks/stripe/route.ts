import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import Reservation from '@/models/Reservation';
import dbConnect from '@/lib/mongodb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-01-28.clover' });
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    if (!process.env.STRIPE_SECRET_KEY) {
        return NextResponse.json({ error: 'Stripe Secret Key is missing' }, { status: 500 });
    }

    const body = await req.text();
    const sig = (await headers()).get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        if (endpointSecret) {
            event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
        } else {
            // If no webhook secret is configured (dev mode), trust the event body
            // WARNING: This is insecure for production. Use constructEvent in prod.
            const jsonBody = JSON.parse(body);
            event = jsonBody;
            console.warn("⚠️ Webhook secret not configured. Skipping signature verification (DEV ONLY).");
        }
    } catch (err: any) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const reservationId = session.metadata?.reservationId;

        if (reservationId) {
            await dbConnect();
            await Reservation.findByIdAndUpdate(reservationId, {
                status: 'confirmed',
                paymentStatus: 'paid'
            });
            console.log(`Reservation ${reservationId} confirmed via webhook.`);
        }
    }

    return NextResponse.json({ received: true });
}
