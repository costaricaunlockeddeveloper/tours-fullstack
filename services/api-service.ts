
// Types matching models
export interface User {
    id: string;
    uid?: string; // Optional for backward compat
    email: string;
    displayName: string;
    role: "admin" | "client";
    createdAt?: string;
}

export interface AssetMeta {
    path: string;
    size?: number;
    typefile?: string;
    mediaType?: 'standard' | '360' | 'video';
    thumbnailPath?: string;
}

export interface PlaceImages {
    heroImage?: AssetMeta;
    secondaryAssets?: AssetMeta[];
}

export interface Place {
    id: string; // Mongoose _id
    name: string;
    description: string;
    slug?: string;
    region?: string;
    images?: PlaceImages;
    coordinates?: { lat: number; lng: number };
    ecosystem?: string;
    googleMapsLink?: string;
    tours?: number;
    packages?: number;
}



export interface TourDefaults {
    price: number;
    priceChild: number;
    maxQuota: number;
    schedules: string[];
}

export interface TourDateEntry {
    date: string;
    price: number;
    priceChild: number;
    maxQuota: number;
    schedules: string[];
    enrolled: number;
}

export interface TourMeetingPoint {
    name?: string;
    description?: string;
    coordinates?: { lat: number; lng: number };
    link?: string;
}

export interface Tour {
    id: string;
    name: string;
    slug?: string;
    description: string;
    duration?: number; // Horas
    isVisible?: boolean;
    rating?: number;
    reviews?: number;
    placeIds: string[];
    places?: Place[];
    images?: PlaceImages;
    defaults?: TourDefaults;
    meetingPoint?: TourMeetingPoint;
    availableDates?: TourDateEntry[];
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
    accommodation?: string;
    activities?: string[]; // Added
    meals?: string[]; // Added
}

export interface PackageActivity {
    title: string;
    description: string;
}

export interface TourCatalogItem {
    id: string;
    title: string;
    slug?: string;
    duration?: number;
    rating?: number;
    reviews?: number;
    price: number;
    destinationsCount: number;
    imageUrl?: string;
}

export interface Package {
    id: string;
    name: string;
    slug?: string;
    description?: string;
    region?: string;
    price: number;
    priceChild?: number;
    isVisible?: boolean;
    rating?: number;
    reviews?: number;
    images?: PlaceImages;
    included: string[];
    placeIds?: string[];
    places?: Place[];
    activities?: PackageActivity[];
    excludes?: string[];
}

export interface PackageCatalogItem {
    id: string;
    name: string;
    slug?: string;
    region?: string;
    rating?: number;
    reviews?: number;
    price: number;
    imageUrl?: string;
}

export interface MapPin {
    id: string;
    label: string;
    position: [number, number, number];
}

const PLACES_API = "/api/places";
const TOURS_API = "/api/tours";
const PACKAGES_API = "/api/packages";
const USERS_API = "/api/users";
const MAP_PINS_API = "/api/map-pins";

export const ApiService = {
    // Places
    getPlaces: async (): Promise<Place[]> => {
        const res = await fetch(PLACES_API);
        if (!res.ok) throw new Error("Failed to fetch places");
        return res.json();
    },
    getPlace: async (id: string): Promise<Place> => {
        const res = await fetch(`${PLACES_API}/${id}`);
        if (!res.ok) throw new Error("Failed to fetch place");
        return res.json();
    },
    addPlace: async (place: Omit<Place, "id">) => {
        const res = await fetch(PLACES_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(place),
        });
        if (!res.ok) throw new Error("Failed to add place");
        return res.json();
    },
    updatePlace: async (id: string, updates: Partial<Place>) => {
        const res = await fetch(`${PLACES_API}/${id}`, {
            method: "PUT", // Mongoose/Next defaults often use PUT for update, check implemented APIs? Wait, we didn't implement PUT yet in routes.
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
        });
        if (!res.ok) throw new Error("Failed to update place");
        return res.json();
    },
    deletePlace: async (id: string) => {
        const res = await fetch(`${PLACES_API}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete place");
    },

    // Tours
    getTours: async (): Promise<Tour[]> => {
        const [toursRes, placesRes] = await Promise.all([
            fetch(TOURS_API),
            fetch(PLACES_API)
        ]);
        if (!toursRes.ok) throw new Error("Failed to fetch tours");
        if (!placesRes.ok) throw new Error("Failed to fetch places");

        const tours: Tour[] = await toursRes.json();
        const places: Place[] = await placesRes.json();

        // Join logic
        return tours.map((tour) => ({
            ...tour,
            id: (tour as any)._id || tour.id, // Ensure ID mapping
            places: places.filter((p) => tour.placeIds?.includes((p as any)._id || p.id))
        }));
    },
    getTour: async (id: string): Promise<Tour> => {
        const [tourRes, placesRes] = await Promise.all([
            fetch(`${TOURS_API}/${id}`),
            fetch(PLACES_API) // Fetch all places for joining, suboptimal but consistent with current approach
        ]);
        if (!tourRes.ok) throw new Error("Failed to fetch tour");
        if (!placesRes.ok) throw new Error("Failed to fetch places");

        const tour = await tourRes.json();
        const places = await placesRes.json();

        return {
            ...tour,
            id: tour._id || tour.id,
            places: places.filter((p: any) => tour.placeIds?.includes(p._id || p.id))
        };
    },
    addTour: async (tour: Omit<Tour, "id">) => {
        const res = await fetch(TOURS_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tour),
        });
        if (!res.ok) throw new Error("Failed to add tour");
        return res.json();
    },
    updateTour: async (id: string, updates: Partial<Tour>) => {
        const res = await fetch(`${TOURS_API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
        });
        if (!res.ok) throw new Error("Failed to update tour");
        return res.json();
    },
    deleteTour: async (id: string) => {
        const res = await fetch(`${TOURS_API}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete tour");
    },
    getToursByPlace: async (placeId: string): Promise<Tour[]> => {
        const [toursRes, placesRes] = await Promise.all([
            fetch(`${TOURS_API}?placeId=${placeId}`),
            fetch(PLACES_API)
        ]);
        if (!toursRes.ok) throw new Error("Failed to fetch tours");
        if (!placesRes.ok) throw new Error("Failed to fetch places");

        const tours: Tour[] = await toursRes.json();
        const places: Place[] = await placesRes.json();

        return tours.map((tour) => ({
            ...tour,
            id: (tour as any)._id || tour.id,
            places: places.filter((p) => tour.placeIds?.includes((p as any)._id || p.id))
        }));
    },
    getToursCatalog: async (): Promise<TourCatalogItem[]> => {
        const res = await fetch(`${TOURS_API}?select=catalog`);
        if (!res.ok) throw new Error("Failed to fetch catalog tours");
        return res.json();
    },
    getPackagesCatalog: async (): Promise<PackageCatalogItem[]> => {
        const res = await fetch(`${PACKAGES_API}?select=catalog`);
        if (!res.ok) throw new Error("Failed to fetch catalog packages");
        return res.json();
    },

    // Packages
    getPackages: async (): Promise<Package[]> => {
        const [packagesRes, placesRes] = await Promise.all([
            fetch(PACKAGES_API),
            fetch(PLACES_API)
        ]);

        if (!packagesRes.ok) throw new Error("Failed to fetch packages");
        const packages: Package[] = await packagesRes.json();
        const placesData: Place[] = await placesRes.json();

        return packages.map((pkg) => ({
            ...pkg,
            id: (pkg as any)._id || pkg.id,
            places: placesData.filter((p) => pkg.placeIds?.includes((p as any)._id || p.id))
        }));
    },
    getPackage: async (id: string): Promise<Package> => {
        const [pkgRes, placesRes] = await Promise.all([
            fetch(`${PACKAGES_API}/${id}`),
            fetch(PLACES_API)
        ]);

        if (!pkgRes.ok) throw new Error("Failed to fetch package");
        const pkg = await pkgRes.json();
        const placesData = await placesRes.json();

        return {
            ...pkg,
            id: pkg._id || pkg.id,
            places: placesData.filter((p: any) => pkg.placeIds?.includes(p._id || p.id))
        };
    },
    addPackage: async (pkg: Omit<Package, "id">) => {
        const res = await fetch(PACKAGES_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pkg),
        });
        if (!res.ok) throw new Error("Failed to add package");
        return res.json();
    },
    updatePackage: async (id: string, updates: Partial<Package>) => {
        const res = await fetch(`${PACKAGES_API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
        });
        if (!res.ok) throw new Error("Failed to update package");
        return res.json();
    },
    deletePackage: async (id: string) => {
        const res = await fetch(`${PACKAGES_API}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete package");
    },

    // Storage 
    uploadImage: async (file: File, folder: string = "uploads", customSlug?: string): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);
        // Use custom slug if provided, else filename
        const slug = customSlug || file.name.split('.')[0].replace(/[^a-zA-Z0-9]/g, '');
        formData.append("slug", slug);
        formData.append("folder", folder);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) throw new Error("Failed to upload image");
        const data = await res.json();
        return data.url;
    },

    // Map Pins
    getMapPins: async (): Promise<MapPin[]> => {
        const res = await fetch(MAP_PINS_API);
        if (!res.ok) throw new Error("Failed to fetch map pins");
        return res.json();
    },
    addMapPin: async (pin: Omit<MapPin, "id">) => {
        const res = await fetch(MAP_PINS_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pin),
        });
        if (!res.ok) throw new Error("Failed to add map pin");
        return res.json();
    },
    deleteMapPin: async (id: string) => {
        const res = await fetch(`${MAP_PINS_API}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete map pin");
    },

    // Users
    getUsers: async (): Promise<User[]> => {
        const res = await fetch(USERS_API);
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
    },

    updateUserRole: async (id: string, role: "admin" | "client") => {
        const res = await fetch(`${USERS_API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role }),
        });
        if (!res.ok) throw new Error("Failed to update user role");
    },
    getUserRole: async (id: string): Promise<"admin" | "client" | null> => {
        // Since users are fetched via AuthContext usually, we might not need this.
        // But if admin checks another user:
        try {
            const res = await fetch(`${USERS_API}/${id}`);
            if (!res.ok) return null;
            const user = await res.json();
            return user.role;
        } catch (e) {
            return null;
        }
    }
};
