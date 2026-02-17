export interface User {
    uid: string;
    email: string;
    displayName: string;
    role: "admin" | "client";
    createdAt?: string;
}

export interface AssetMeta {
    path: string;
    size: number;
    typefile: string;
}

export interface PlaceImages {
    heroImage?: AssetMeta;
    secondaryAssets?: AssetMeta[];
}

export interface Place {
    id: string;
    name: string;
    description: string;
    slug?: string;
    officialName?: string;
    shortDescription?: string;
    region?: string;
    images?: PlaceImages;
    coordinates?: { lat: number; lng: number };
    ecosystem?: string;
    googleMapsLink?: string;
    howToGetThere?: string;
}



export interface Tour {
    id: string;
    name: string;
    slug?: string;
    description: string;
    duration?: number;
    isVisible?: boolean;
    rating?: number;
    reviews?: number;
    placeIds: string[];
    places?: Place[];
    images?: {
        heroImage?: { path: string; size: number; typefile: string };
        secondaryAssets?: { path: string; size: number; typefile: string }[];
    };
    defaults?: {
        price: number;
        priceChild: number;
        maxQuota: number;
        schedules: string[];
    };
    meetingPoint?: {
        name?: string;
        description?: string;
        coordinates?: { lat: number; lng: number };
        link?: string;
    };
    availableDates?: {
        date: string;
        price: number;
        priceChild: number;
        maxQuota: number;
        schedules: string[];
        enrolled: number;
    }[];
    guideName?: string;
    includes?: string[];
    excludes?: string[];
    itinerary?: {
        title: string;
        description: string;
        duration: string;
    }[];
}

export interface DailyItinerary {
    day: number;
    title: string;
    description: string;
}

export interface Package {
    id: string;
    title: string;
    price: number;
    images: string[];
    tags: string[];
    included: string[];
    description?: string;
    placeIds?: string[];
    places?: Place[];
    tourIds?: string[];
    tours?: Tour[];
    itinerary?: DailyItinerary[];
    priceType?: "per_person" | "per_group";
    includesTransport?: boolean;
    name?: string;
    excludes?: string[];
}

export interface MapPin {
    id: string;
    label: string;
    position: [number, number, number];
}

export interface Reservation {
    id: string;
    userId?: string;
    userName: string;
    userEmail: string;
    tourId?: string;
    tourName?: string;
    packageId?: string;
    packageName?: string;
    date: string; // ISO Date of the tour/trip
    pax: number;
    totalPrice: number;
    status: "pending" | "confirmed" | "cancelled" | "completed";
    createdAt: string;
    paymentStatus: "unpaid" | "partial" | "paid";
    notes?: string;
}
