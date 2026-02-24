import mongoose from 'mongoose';

const PackageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    description: { type: String },
    region: { type: String },
    price: { type: Number, required: true },
    priceChild: { type: Number },
    status: { 
        type: String, 
        enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], 
        default: 'DRAFT' 
    },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    // Structured images (same as Tours/Places)
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
            mediaType: { type: String, enum: ['standard', '360', 'video'], default: 'standard' },
            thumbnailPath: { type: String },
        }],
    },
    included: [{ type: String }],
    placeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Place' }],
    activities: [{
        title: { type: String },
        description: { type: String },
    }],
    excludes: [{ type: String }],
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

PackageSchema.pre('save', async function() {
    if (this.status === 'PUBLISHED' && !this.isNew) {
        if (this.isModified('slug')) {
            throw new Error("Integrity Error: Cannot modify slug of a published entity due to SEO constraints.");
        }
        if (this.isModified('rating') || this.isModified('reviews')) {
            throw new Error("Integrity Error: Ratings and reviews are system-calculated and cannot be manually modified.");
        }
        if (this.isModified('placeIds')) {
            throw new Error("Integrity Error: Cannot alter core product details (places) of a published package.");
        }
    }
});

delete mongoose.models.Package;
export default mongoose.model('Package', PackageSchema);
