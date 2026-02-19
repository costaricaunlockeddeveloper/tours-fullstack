import mongoose from 'mongoose';

const PackageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    description: { type: String },
    region: { type: String },
    price: { type: Number, required: true },
    priceChild: { type: Number },
    isVisible: { type: Boolean, default: false },
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
        }],
    },
    included: [{ type: String }],
    placeIds: [{ type: String }],
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

export default mongoose.models.Package || mongoose.model('Package', PackageSchema);
