import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema({
    userId: { type: String },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    tourId: { type: String },
    tourName: { type: String },
    packageId: { type: String },
    packageName: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    selectedTime: { type: String },
    date: { type: String }, // Keep for backward compatibility or remove if not needed, but safe to keep for now.
    pax: { type: Number }, // Total pax, could be calculated
    adults: { type: Number, required: true },
    children: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending',
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'partial', 'paid'],
        default: 'unpaid',
    },
    paymentId: { type: String }, // Stripe Payment Intent ID
    paymentMethod: { type: String }, // e.g., 'card'
    paymentAmount: { type: Number },
    paymentCurrency: { type: String },
    paymentDate: { type: Date },
    stripeSessionId: { type: String },
    notes: { type: String },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: function (doc, ret: any) {
            ret.id = ret._id;
            delete ret._id;
        }
    },
    toObject: { virtuals: true }
});

export default mongoose.models.Reservation || mongoose.model('Reservation', ReservationSchema);
