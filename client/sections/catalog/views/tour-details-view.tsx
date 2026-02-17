"use client"
import React, { useEffect, useState } from 'react';
import TourHero from '../components/Tour/TourDetails/TourHero';
import TourDetails from '../components/Tour/TourDetails/TourDetails';
import { ApiService, Tour } from '@/services/api-service';
import Loading from '@/client/sections/shared/common/Loading';
import { notFound } from 'next/navigation';

interface TourDetailsViewProps {
    slug: string;
}

const TourDetailsView = ({ slug }: TourDetailsViewProps) => {
    const [tour, setTour] = useState<Tour | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchTour = async () => {
            try {
                const data = await ApiService.getTour(slug);
                setTour(data);
            } catch (error) {
                console.error("Failed to fetch tour", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchTour();
    }, [slug]);

    if (loading) return <Loading />;
    
    if (error || !tour) {
        notFound();
    }

    return (
        <div>
            <TourHero
                title={tour.name}
                description={tour.description}
                rating={tour.rating || 0}
                reviews={tour.reviews || 0}
                images={tour.images}
            />
            <TourDetails 
                tour={tour}
            />
        </div>
    );
};

export default TourDetailsView;
