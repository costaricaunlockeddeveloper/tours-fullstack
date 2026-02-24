import mongoose from 'mongoose';

const PackageSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, maxlength: 100 },
    slug: { type: String, unique: true, sparse: true },
    description: { type: String, trim: true, maxlength: 1500 },
    region: { type: String, trim: true, maxlength: 50 },
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
    included: {
        type: [{ type: String, trim: true, maxlength: 100 }],
        validate: [(v: any[]) => v.length <= 15, '{PATH} exceeds the limit of 15 items']
    },
    placeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Place' }],
    activities: {
        type: [{
            title: { type: String, trim: true, maxlength: 100 },
            description: { type: String, trim: true, maxlength: 500 },
        }],
        validate: [(v: any[]) => v.length <= 20, '{PATH} exceeds the limit of 20 items']
    },
    excludes: {
        type: [{ type: String, trim: true, maxlength: 100 }],
        validate: [(v: any[]) => v.length <= 15, '{PATH} exceeds the limit of 15 items']
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
