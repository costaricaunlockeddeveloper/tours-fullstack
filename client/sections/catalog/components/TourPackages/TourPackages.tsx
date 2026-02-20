"use client"
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import TourPackageCard from './TourPackageCard';
import { ApiService, PackageCatalogItem } from '@/services/api-service';
import Loading from '@/client/sections/shared/common/Loading';
import EmptyState from '@/client/sections/shared/common/EmptyState';

const TourPackages = () => {
    const [packages, setPackages] = useState<PackageCatalogItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const data = await ApiService.getPackagesCatalog();
                setPackages(data);
            } catch (error) {
                console.error("Failed to fetch packages", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);

    return (
        <section className="tour-section section-padding pt-6">
            <style jsx>{`
                .section-title-area {
                    margin-bottom: 20px;
                }

                /* Car shape positioning - copied from Destination1 */
                .car-shape {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                }

                @media (max-width: 768px) {
                    .car-shape {
                        display: none;
                    }
                }
            `}</style>
            <div className="container">
                {/* Header Section from Destination/Tour Layout */}
                <div className="section-title-area justify-content-between">
                    <div className="section-title">
                        <span className="sub-title wow fadeInUp">
                            Top Vacation Packages
                        </span>
                        <h2 className="wow fadeInUp" data-wow-delay=".3s">
                            Costa Rica All-Inclusive Packages
                        </h2>
                    </div>
                    <div className="car-shape float-bob-x d-none d-lg-flex">
                        <Image src="/assets/img/destination/car.png" alt="img" width={134} height={124} />
                    </div>
                </div>

                {/* Tour Packages Grid */}
                <div className="row g-4">
                    {loading ? (
                        <div className="col-12 py-5">
                            <Loading />
                        </div>
                    ) : packages.length === 0 ? (
                        <EmptyState 
                            title="No packages found" 
                            message="There are currently no all-inclusive packages available. Please check back later."
                            icon="bi-box-seam"
                        />
                    ) : (
                        packages.map((item, i) => (
                            <div key={item.id} className="col-xl-3 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay={`.${(i % 4) + 2}s`}>
                                <TourPackageCard 
                                    imageUrl={item.imageUrl || '/assets/img/destination/01.jpg'}
                                    name={item.name}
                                    region={item.region || ''}
                                    rating={item.rating || 0}
                                    reviews={item.reviews || 0}
                                    price={item.price}
                                    slug={item.slug || ''}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default TourPackages;
