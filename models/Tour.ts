import mongoose from 'mongoose';

const TourSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, maxlength: 100 },
    slug: { type: String, unique: true, sparse: true },
    description: { type: String, required: true, trim: true, maxlength: 1500 },
    duration: { type: Number }, // Horas
    status: { 
        type: String, 
        enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], 
        default: 'DRAFT' 
    },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    placeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Place' }],
    // Structured images (same as Places)
    images: {
        heroImage: {
            path: { type: String },
            size: { type: Number },
            typefile: { type: String },
        },
        secondaryAssets: {
            type: [{
                path: { type: String },
                size: { type: Number },
                typefile: { type: String },
                mediaType: { type: String, enum: ['standard', '360', 'video'], default: 'standard' },
                thumbnailPath: { type: String },
            }],
            validate: [(v: any[]) => v.length <= 10, '{PATH} exceeds the limit of 10 items']
        },
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
        name: { type: String, trim: true, maxlength: 100 },
        description: { type: String, trim: true, maxlength: 500 },
        coordinates: {
            lat: { type: Number },
            lng: { type: Number },
        },
        address: { type: String, trim: true, maxlength: 200 },
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
    guideName: { type: String, trim: true, maxlength: 60 },
    includes: {
        type: [{ type: String, trim: true, maxlength: 100 }],
        validate: [(v: any[]) => v.length <= 15, '{PATH} exceeds the limit of 15 items']
    },
    excludes: {
        type: [{ type: String, trim: true, maxlength: 100 }],
        validate: [(v: any[]) => v.length <= 15, '{PATH} exceeds the limit of 15 items']
    },
    itinerary: {
        type: [{
            title: { type: String, trim: true, maxlength: 100 },
            description: { type: String, trim: true, maxlength: 500 },
            duration: { type: String, trim: true, maxlength: 50 }
        }],
        validate: [(v: any[]) => v.length <= 20, '{PATH} exceeds the limit of 20 items']
    },
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

// Index for faster queries by destination
TourSchema.index({ placeIds: 1 });

TourSchema.virtual('generatedMapsLink').get(function(this: any) {
    if (this.meetingPoint && this.meetingPoint.coordinates && this.meetingPoint.coordinates.lat && this.meetingPoint.coordinates.lng) {
        return `https://www.google.com/maps/search/?api=1&query=${this.meetingPoint.coordinates.lat},${this.meetingPoint.coordinates.lng}`;
    }
    return null;
});

TourSchema.pre('save', async function() {
    if (this.status === 'PUBLISHED' && !this.isNew) {
        if (this.isModified('slug')) {
            throw new Error("Integrity Error: Cannot modify slug of a published entity due to SEO constraints.");
        }
        if (this.isModified('rating') || this.isModified('reviews')) {
            throw new Error("Integrity Error: Ratings and reviews are system-calculated and cannot be manually modified.");
        }
        if (this.isModified('placeIds') || this.isModified('duration')) {
            throw new Error("Integrity Error: Cannot alter core product details (places, duration) of a published tour. Create a new draft instead.");
        }

        // Subdocument logic
        if (this.availableDates && this.availableDates.length > 0) {
            for (const dateObj of this.availableDates) {
                // If enrolled > 0, check if specific fields were modified
                if ((dateObj as any).enrolled && (dateObj as any).enrolled > 0) {
                    // Check if the specific subdocument's fields were modified
                    if ((dateObj as any).isModified('price') || 
                        (dateObj as any).isModified('priceChild') || 
                        (dateObj as any).isModified('maxQuota') || 
                        (dateObj as any).isModified('date')) {
                        throw new Error("Financial Integrity Error: Cannot modify pricing or capacity for dates that already have enrolled customers.");
                    }
                }
            }
        }
    }
});

delete mongoose.models.Tour;
export default mongoose.model('Tour', TourSchema);