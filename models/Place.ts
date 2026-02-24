import mongoose from 'mongoose';

const PlaceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    region: { type: String },
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
    coordinates: {
        lat: { type: Number },
        lng: { type: Number },
    },
    ecosystem: { type: String },
    status: { 
        type: String, 
        enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], 
        default: 'DRAFT' 
    },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
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

PlaceSchema.virtual('generatedMapsLink').get(function(this: any) {
    if (this.coordinates && this.coordinates.lat && this.coordinates.lng) {
        return `https://www.google.com/maps/search/?api=1&query=${this.coordinates.lat},${this.coordinates.lng}`;
    }
    return null;
});

PlaceSchema.pre('save', async function() {
    if (this.status === 'PUBLISHED' && !this.isNew) {
        if (this.isModified('slug')) {
            throw new Error("Integrity Error: Cannot modify slug of a published entity due to SEO constraints.");
        }
        if (this.isModified('rating') || this.isModified('reviews')) {
            throw new Error("Integrity Error: Ratings and reviews are system-calculated and cannot be manually modified.");
        }
    }

    if (this.isModified('status') && this.status === 'ARCHIVED') {
        const Tour = mongoose.models.Tour || mongoose.model('Tour');
        const Package = mongoose.models.Package || mongoose.model('Package');

        const hasActiveTour = await Tour.exists({ placeIds: this._id, status: 'PUBLISHED' });
        const hasActivePackage = await Package.exists({ placeIds: this._id, status: 'PUBLISHED' });

        if (hasActiveTour || hasActivePackage) {
            throw new Error("Referential Integrity Error: Cannot archive this Place because it is currently being used by active (PUBLISHED) Tours or Packages. Please update or archive the dependent entities first.");
        }
    }
});

delete mongoose.models.Place;
export default mongoose.model('Place', PlaceSchema);
