import mongoose from 'mongoose';

const TourSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    description: { type: String, required: true },
    duration: { type: Number }, // Horas
    isVisible: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    placeIds: [{ type: String }],
    // Structured images (same as Places)
    images: {
        heroImage: {
            path: { type: String },
            size: { type: Number },
            typefile: { type: String },
        },
        secondaryAssets: [{
            path: { type: String },
            size: { type: Number },
            typefile: { type: String },
        }],
    },
    // Default values template — copied to each date
    defaults: {
        price: { type: Number, default: 0 },
        priceChild: { type: Number, default: 0 },
        maxQuota: { type: Number, default: 0 },
        schedules: [{ type: String }],
    },
    // Unified meeting point
    meetingPoint: {
        name: { type: String },
        description: { type: String },
        coordinates: {
            lat: { type: Number },
            lng: { type: Number },
        },
        link: { type: String },
    },
    // Each date has its own copy of price/quota/schedules + enrolled count
    availableDates: [{
        date: { type: String },
        price: { type: Number },
        priceChild: { type: Number },
        maxQuota: { type: Number },
        schedules: [{ type: String }],
        enrolled: { type: Number, default: 0 },
    }],
    guideName: { type: String },
    includes: [{ type: String }],
    excludes: [{ type: String }],
    itinerary: [{
        title: { type: String },
        description: { type: String },
        duration: { type: String }
    }],
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

export default mongoose.models.Tour || mongoose.model('Tour', TourSchema);
