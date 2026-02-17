import mongoose from 'mongoose';

const PackageSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    priceChild: { type: Number },
    images: [{ type: String }],
    tags: [{ type: String }],
    included: [{ type: String }],
    description: { type: String },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    location: { type: String },
    tourIds: [{ type: String }],
    placeIds: [{ type: String }], // Direct association with Places (Destinations)
    itinerary: [{
        day: { type: Number },
        title: { type: String },
        description: { type: String },
        accommodation: { type: String },
    }],
    priceType: {
        type: String,
        enum: ['per_person', 'per_group'],
    },
    includesTransport: { type: Boolean },
    name: { type: String },
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
