import mongoose from 'mongoose';

const PlaceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String },
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
        }],
    },
    coordinates: {
        lat: { type: Number },
        lng: { type: Number },
    },
    ecosystem: { type: String },
    googleMapsLink: { type: String },
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

export default mongoose.models.Place || mongoose.model('Place', PlaceSchema);
