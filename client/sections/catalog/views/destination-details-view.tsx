"use client"
import React, { useEffect, useState } from 'react';
import DestinationHero from '../components/Destination/DestinationDetails/DestinationHero';
import DestinationDetails from '../components/Destination/DestinationDetails/DestinationDetails';
import { ApiService, Place } from '@/services/api-service';
import { notFound } from 'next/navigation';
import Loading from '../../shared/common/Loading';


interface DestinationDetailsViewProps {
    slug: string;
}

const DestinationDetailsView = ({ slug }: DestinationDetailsViewProps) => {
    const [place, setPlace] = useState<Place | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchPlace = async () => {
            try {
                // ApiService.getPlace accepts ID or Slug if backend supports it
                const data = await ApiService.getPlace(slug);
                setPlace(data);
            } catch (error) {
                console.error("Failed to fetch place", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        if (slug) fetchPlace();
    }, [slug]);

    if (loading) return <Loading />;
    
    if (error || !place) {
        notFound();
    }

    return (
        <div>
            <DestinationHero
                title={place.name}
                climate={place.ecosystem || ''}
                region={place.region || ''}
                description={place.description}
            />    
            <DestinationDetails 
                 place={place}
            />       
        </div>
    );
};

export default DestinationDetailsView;
