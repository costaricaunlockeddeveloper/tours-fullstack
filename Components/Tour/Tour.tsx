"use client"
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import TourCard from './TourCard';

const Tour = () => {

    const tourContent = [
        {
            img: '/assets/img/destination/01.jpg',
            title: 'Arenal Volcano Adventure',
            destinations: 2,
            duration: 5,
            rating: '4.9',
            reviews: '120',
            price: '850.00'
        },
        {
            img: '/assets/img/destination/02.jpg',
            title: 'Manuel Antonio Beach & Wildlife',
            destinations: 1,
            duration: 3,
            rating: '4.8',
            reviews: '95',
            price: '450.00'
        },
        {
            img: '/assets/img/destination/03.jpg',
            title: 'Monteverde Cloud Forest Expedition',
            destinations: 1,
            duration: 4,
            rating: '4.7',
            reviews: '82',
            price: '520.00'
        },
        {
            img: '/assets/img/destination/04.jpg',
            title: 'Tortuguero Channels & Turtle Watch',
            destinations: 1,
            duration: 3,
            rating: '4.9',
            reviews: '110',
            price: '380.00'
        },
        {
            img: '/assets/img/destination/01.jpg',
            title: 'Guanacaste Gold Coast Relaxation',
            destinations: 3,
            duration: 7,
            rating: '4.8',
            reviews: '150',
            price: '1,200.00'
        },
        {
            img: '/assets/img/destination/02.jpg',
            title: 'Corcovado Wilderness Experience',
            destinations: 1,
            duration: 6,
            rating: '5.0',
            reviews: '45',
            price: '950.00'
        },
        {
            img: '/assets/img/destination/03.jpg',
            title: 'Costa Rica Highlights Tour',
            destinations: 5,
            duration: 12,
            rating: '4.9',
            reviews: '200',
            price: '2,100.00'
        },
        {
            img: '/assets/img/destination/04.jpg',
            title: 'Pacuare River Rafting & Jungle',
            destinations: 1,
            duration: 2,
            rating: '4.8',
            reviews: '75',
            price: '290.00'
        },
        {
            img: '/assets/img/destination/01.jpg',
            title: 'Secret Beaches of Nicoya',
            destinations: 4,
            duration: 8,
            rating: '4.7',
            reviews: '60',
            price: '1,400.00'
        }
    ];

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
                    <div className="car-shape float-bob-x">
                        <Image src="/assets/img/destination/car.png" alt="img" width={134} height={124} />
                    </div>
                </div>

                {/* Tour Grid */}
                <div className="row g-4">
                    {tourContent.map((item, i) => (
                        <div key={i} className="col-xl-3 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay={`.${i + 2}s`}>
                           <TourCard 
                                img={item.img}
                                title={item.title}
                                destinations={item.destinations}
                                duration={item.duration}
                                rating={item.rating}
                                reviews={item.reviews}
                                price={item.price}
                            />
                        </div>
                    ))}
                </div>

                {/* Pagination (Optional, keeping it simple or matching current flow) */}
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

export default Tour;