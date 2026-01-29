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
            tags: ['Best Seller'],
            duration_days: 7,
            duration_nights: 6,
            title: 'Costa Rica Adventure Package',
            included: ['Hotel', 'Transfer', 'Meals', 'Tours'],
            price_adult: 1200
        },
        {
            images: ['/assets/img/destination/02.jpg'],
            tags: ['Honeymoon'],
            duration_days: 5,
            duration_nights: 4,
            title: 'Romantic Beach Getaway',
            included: ['Hotel', 'Transfer', 'Meals', 'Spa'],
            price_adult: 950
        },
        {
            images: ['/assets/img/destination/03.jpg'],
            tags: ['Family'],
            duration_days: 10,
            duration_nights: 9,
            title: 'Family Fun Costa Rica',
            included: ['Hotel', 'Transfer', 'Meals', 'Activities'],
            price_adult: 1500
        },
        {
            images: ['/assets/img/destination/04.jpg'],
            tags: ['Best Seller'],
            duration_days: 8,
            duration_nights: 7,
            title: 'Eco-Tourism Experience',
            included: ['Hotel', 'Transfer', 'Meals', 'Guides'],
            price_adult: 1350
        },
        {
            images: ['/assets/img/destination/01.jpg'],
            tags: ['Adventure'],
            duration_days: 6,
            duration_nights: 5,
            title: 'Volcano & Rainforest Package',
            included: ['Hotel', 'Transfer', 'Meals', 'Tours'],
            price_adult: 1100
        },
        {
            images: ['/assets/img/destination/02.jpg'],
            tags: ['Best Seller'],
            duration_days: 12,
            duration_nights: 11,
            title: 'Complete Costa Rica Tour',
            included: ['Hotel', 'Transfer', 'Meals', 'Tours'],
            price_adult: 2200
        },
        {
            images: ['/assets/img/destination/03.jpg'],
            tags: ['Honeymoon'],
            duration_days: 7,
            duration_nights: 6,
            title: 'Caribbean Paradise Package',
            included: ['Hotel', 'Transfer', 'Meals', 'Activities'],
            price_adult: 1400
        },
        {
            images: ['/assets/img/destination/04.jpg'],
            tags: ['Family'],
            duration_days: 9,
            duration_nights: 8,
            title: 'Wildlife & Beach Adventure',
            included: ['Hotel', 'Transfer', 'Meals', 'Tours'],
            price_adult: 1650
        },
        {
            images: ['/assets/img/destination/01.jpg'],
            tags: ['Best Seller'],
            duration_days: 5,
            duration_nights: 4,
            title: 'Quick Escape Package',
            included: ['Hotel', 'Transfer', 'Meals', 'Tours'],
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
                                duration_days={item.duration_days}
                                duration_nights={item.duration_nights}
                                tags={item.tags}
                                included={item.included}
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
