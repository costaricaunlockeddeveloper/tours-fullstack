"use client"
import Image from 'next/image';
import React from 'react';
import DestinationCard from './DestinationCard';

const Destination1 = () => {

    const destinationContent = [
        {
            img: '/assets/img/destination/01.jpg', 
            location: 'Puntarenas', 
            title: 'Manuel Antonio National Park',
            climate: 'Beach & Wildlife',
            tours: 12,
            packages: 8
        },      
        {
            img: '/assets/img/destination/02.jpg', 
            location: 'Guanacaste', 
            title: 'Tamarindo Beach',
            climate: 'Coastal Paradise',
            tours: 15,
            packages: 10
        },      
        {
            img: '/assets/img/destination/03.jpg', 
            location: 'Alajuela', 
            title: 'Arenal Volcano',
            climate: 'Volcano & Hot Springs',
            tours: 20,
            packages: 12
        },      
        {
            img: '/assets/img/destination/04.jpg', 
            location: 'Limón', 
            title: 'Puerto Viejo',
            climate: 'Caribbean Coast',
            tours: 10,
            packages: 6
        },      
        {
            img: '/assets/img/destination/01.jpg', 
            location: 'Puntarenas', 
            title: 'Monteverde Cloud Forest',
            climate: 'Rainforest',
            tours: 18,
            packages: 14
        },      
        {
            img: '/assets/img/destination/02.jpg', 
            location: 'Guanacaste', 
            title: 'Playa Conchal',
            climate: 'Tropical Beach',
            tours: 8,
            packages: 5
        },      
        {
            img: '/assets/img/destination/03.jpg', 
            location: 'Puntarenas', 
            title: 'Corcovado National Park',
            climate: 'Wildlife & Jungle',
            tours: 14,
            packages: 9
        },      
        {
            img: '/assets/img/destination/04.jpg', 
            location: 'Cartago', 
            title: 'Irazú Volcano',
            climate: 'Mountain',
            tours: 11,
            packages: 7
        },       
    ]; 

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
                        <div className="car-shape float-bob-x">
                            <Image src="/assets/img/destination/car.png" alt="img" width={134} height={124} />
                        </div>
                    </div> 
                    <div className="row g-4 ">
                        {destinationContent.map((item, i) => (
                            <div key={i} className="col-xl-3 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay={`.${i + 2}s`}>
                                <DestinationCard 
                                    img={item.img}
                                    location={item.location}
                                    title={item.title}
                                    climate={item.climate}
                                    tours={item.tours}
                                    packages={item.packages}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Destination1;