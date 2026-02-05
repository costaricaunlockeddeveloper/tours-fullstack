"use client"
import Image from 'next/image';
import React from 'react';
import TourPackageCard from './TourPackageCard';

const TourPackages = () => {

    // Sample tour package data structure based on your requirements
    // First 3 inclusions are standardized (Hotel, Transfer, Meals) for easy comparison
    // 4th inclusion is the differentiator
    const packageContent = [
        {
            images: ['/assets/img/destination/01.jpg'],
            title: 'Arenal Adventure Experience',
            location: 'La Fortuna, Alajuela',
            rating: '4.8',
            reviews: '120',
            price_adult: 1200
        },
        {
            images: ['/assets/img/destination/02.jpg'],
            title: 'Manuel Antonio Experience',
            location: 'Quepos, Puntarenas',
            rating: '4.9',
            reviews: '85',
            price_adult: 950
        },
        {
            images: ['/assets/img/destination/03.jpg'],
            title: 'Monteverde Discovery',
            location: 'Santa Elena, Puntarenas',
            rating: '4.7',
            reviews: '150',
            price_adult: 1500
        },
        {
            images: ['/assets/img/destination/04.jpg'],
            title: 'Tortuguero Wildlife Expedition',
            location: 'Pococí, Limón',
            rating: '4.8',
            reviews: '95',
            price_adult: 1350
        },
        {
            images: ['/assets/img/destination/01.jpg'],
            title: 'Guanacaste Sun & Surf Journey',
            location: 'Tamarindo, Guanacaste',
            rating: '4.6',
            reviews: '110',
            price_adult: 1100
        },
        {
            images: ['/assets/img/destination/02.jpg'],
            title: 'Corcovado Deep Jungle Adventure',
            location: 'Puerto Jiménez, Puntarenas',
            rating: '5.0',
            reviews: '200',
            price_adult: 2200
        },
        {
            images: ['/assets/img/destination/03.jpg'],
            title: 'Puerto Viejo Vibes',
            location: 'Puerto Viejo, Limón',
            rating: '4.7',
            reviews: '75',
            price_adult: 1400
        },
        {
            images: ['/assets/img/destination/04.jpg'],
            title: 'Rincón de la Vieja Volcanic Trek',
            location: 'Liberia, Guanacaste',
            rating: '4.8',
            reviews: '130',
            price_adult: 1650
        },
        {
            images: ['/assets/img/destination/01.jpg'],
            title: 'San José Cultural Highlights',
            location: 'San José, San José',
            rating: '4.5',
            reviews: '60',
            price_adult: 850
        },
    ];

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
                    <div className="car-shape float-bob-x">
                        <Image src="/assets/img/destination/car.png" alt="img" width={134} height={124} />
                    </div>
                </div>

                {/* Tour Packages Grid */}
                <div className="row g-4">
                    {packageContent.map((item, i) => (
                        <div key={i} className="col-xl-3 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay={`.${i + 2}s`}>
                            <TourPackageCard 
                                images={item.images}
                                title={item.title}
                                location={item.location}
                                rating={item.rating}
                                reviews={item.reviews}
                                price_adult={item.price_adult}
                            />
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="page-nav-wrap text-center mt-5">
                    <ul>
                        <li><a className="page-numbers" href="#"><i className="bi bi-arrow-left"></i></a></li>
                        <li><a className="page-numbers" href="#">01</a></li>
                        <li><a className="page-numbers" href="#">02</a></li>
                        <li><a className="page-numbers" href="#">03</a></li>
                        <li><a className="page-numbers" href="#"><i className="bi bi-arrow-right"></i></a></li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default TourPackages;
