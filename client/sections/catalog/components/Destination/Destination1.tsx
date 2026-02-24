"use client"
import Image from 'next/image';
import React from 'react';
import DestinationCard from './DestinationCard';
import { ApiService, Place } from '@/services/api-service';
import Loading from '@/client/sections/shared/common/Loading';
import EmptyState from '@/client/sections/shared/common/EmptyState';


const Destination1 = () => {
    const [destinations, setDestinations] = React.useState<Place[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const data = await ApiService.getPlacesCatalog();
                setDestinations(data);
            } catch (error) {
                console.error("Failed to fetch destinations", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDestinations();
    }, []);

    return (
        <>
            <style jsx>{`
                /* Car shape positioning */
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

            <section className="popular-destination-section section-padding pt-6">
                <div className="container">
                    <div className="section-title-area justify-content-between">
                        <div className="section-title">
                            <span className="sub-title wow fadeInUp">
                                Best Recommended Places
                            </span>
                            <h2 className="wow fadeInUp" data-wow-delay=".3s">
                                Popular Destinations in Costa Rica
                            </h2>
                        </div>
                        <div className="car-shape float-bob-x d-none d-lg-flex">
                            <Image src="/assets/img/destination/car.png" alt="img" width={134} height={124} />
                        </div>
                    </div> 
                    <div className="row g-4 ">
                        {loading ? (
                            <div className="col-12 py-5">
                                <Loading />
                            </div>
                        ) : destinations.length === 0 ? (
                            <EmptyState 
                                title="No destinations found" 
                                message="We couldn't find any destinations right now. Please check back later."
                                icon="bi-map" 
                            />
                        ) : (
                            destinations.map((place, i) => (
                                <div key={place.id} className="col-xl-3 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay={`.${(i % 4) + 2}s`}>
                                    <DestinationCard 
                                        {...place}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Destination1;