"use client"
import React, { useEffect, useState } from 'react';
import TourPackageHero from '../components/TourPackages/TourPackageDetails/TourPackageHero';
import TourPackageDetails from '../components/TourPackages/TourPackageDetails/TourPackageDetails';
import { ApiService, Package } from '@/services/api-service';
import Loading from '@/client/sections/shared/common/Loading';
import { notFound } from 'next/navigation';

interface TourPackagesDetailsViewProps {
    slug: string;
}

const TourPackagesDetailsView = ({ slug }: TourPackagesDetailsViewProps) => {
    const [pkg, setPkg] = useState<Package | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                const data = await ApiService.getPackage(slug);
                setPkg(data);
            } catch (error) {
                console.error("Failed to fetch package", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchPackage();
    }, [slug]);

    if (loading) return <Loading />;

    if (error || !pkg) {
        notFound();
    }

    // Build gallery images array from structured images
    const galleryImages: string[] = [];
    if (pkg.images?.heroImage?.path) {
        galleryImages.push(pkg.images.heroImage.path);
    }
    if (pkg.images?.secondaryAssets) {
        pkg.images.secondaryAssets.forEach(asset => {
            if (asset.path) galleryImages.push(asset.path);
        });
    }

    return (
        <div>
            <TourPackageHero
                title={pkg.name}
                location={pkg.region || 'Costa Rica'}
                description={pkg.description || ''}
                rating={pkg.rating || 0}
                reviews={pkg.reviews || 0}
                images={galleryImages}
            />
            <TourPackageDetails pkg={pkg} />       
        </div>
    );
};

export default TourPackagesDetailsView;
