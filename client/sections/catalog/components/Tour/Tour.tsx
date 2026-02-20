"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import TourCard from './TourCard';
import { ApiService, TourCatalogItem } from '@/services/api-service';
import Loading from '@/client/sections/shared/common/Loading';
import EmptyState from '@/client/sections/shared/common/EmptyState';

const Tour = () => {
    const [tours, setTours] = useState<TourCatalogItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const data = await ApiService.getToursCatalog();
                setTours(data);
            } catch (error) {
                console.error("Failed to fetch tours", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTours();
    }, []);

    return (
        <section className="tour-section section-padding pt-6">
            <style jsx>{`
                .section-title-area{
                    margin-bottom: 20px
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
                {/* Header Section from Destination Layout */}
                <div className="section-title-area justify-content-between">
                    <div className="section-title">
                        <span className="sub-title wow fadeInUp">
                            Best Recommended Tours
                        </span>
                        <h2 className="wow fadeInUp" data-wow-delay=".3s">
                            Popular Tours in Costa Rica
                        </h2>
                    </div>
                    <div className="car-shape float-bob-x d-none d-lg-flex">
                        <Image src="/assets/img/destination/car.png" alt="img" width={134} height={124} />
                    </div>
                </div>

                {/* Tour Grid */}
                <div className="row g-4">
                    {loading ? (
                        <div className="col-12 py-5">
                            <Loading />
                        </div>
                    ) : tours.length === 0 ? (
                        <EmptyState 
                            title="No tours available" 
                            message="There are currently no tours matching your search. Please check again later."
                            icon="bi-signpost-split"
                        />
                    ) : (
                        tours.map((item, i) => (
                            <div key={item.id} className="col-xl-3 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay={`.${(i % 4) + 2}s`}>
                            <TourCard 
                                    img={item.imageUrl || '/assets/img/destination/01.jpg'}
                                    title={item.title}
                                    slug={item.slug || ''}
                                    destinations={item.destinationsCount}
                                    duration={item.duration || 0}
                                    rating={item.rating || 0}
                                    reviews={item.reviews || 0}
                                    price={item.price || 0}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default Tour;
