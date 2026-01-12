"use client"
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Destination1 = () => {

    const destinationContent = [
        {
            img: '/assets/img/destination/01.jpg', 
            location: 'Puntarenas', 
            title: 'Manuel Antonio National Park',
            climate: '🏖️ Beach & Wildlife',
            tours: 12,
            packages: 8
        },      
        {
            img: '/assets/img/destination/02.jpg', 
            location: 'Guanacaste', 
            title: 'Tamarindo Beach',
            climate: '🌊 Coastal Paradise',
            tours: 15,
            packages: 10
        },      
        {
            img: '/assets/img/destination/03.jpg', 
            location: 'Alajuela', 
            title: 'Arenal Volcano',
            climate: '🌋 Volcano & Hot Springs',
            tours: 20,
            packages: 12
        },      
        {
            img: '/assets/img/destination/04.jpg', 
            location: 'Limón', 
            title: 'Puerto Viejo',
            climate: '🌴 Caribbean Coast',
            tours: 10,
            packages: 6
        },      
        {
            img: '/assets/img/destination/01.jpg', 
            location: 'Puntarenas', 
            title: 'Monteverde Cloud Forest',
            climate: '🌿 Rainforest',
            tours: 18,
            packages: 14
        },      
        {
            img: '/assets/img/destination/02.jpg', 
            location: 'Guanacaste', 
            title: 'Playa Conchal',
            climate: '🏝️ Tropical Beach',
            tours: 8,
            packages: 5
        },      
        {
            img: '/assets/img/destination/03.jpg', 
            location: 'Puntarenas', 
            title: 'Corcovado National Park',
            climate: '🦜 Wildlife & Jungle',
            tours: 14,
            packages: 9
        },      
        {
            img: '/assets/img/destination/04.jpg', 
            location: 'Cartago', 
            title: 'Irazú Volcano',
            climate: '⛰️ Mountain',
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

                /* Entire card is clickable */
                .destination-card-link {
                    text-decoration: none;
                    color: inherit;
                    display: block;
                    height: 100%;
                }

                .destination-card-items {
                    position: relative;
                    border-radius: 16px;
                    overflow: hidden;
                    background: white;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    flex-direction: column;
                    cursor: pointer;
                }

                .destination-card-items:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
                }

                .destination-image {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 4 / 3;
                    overflow: hidden;
                }

                .destination-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .destination-card-items:hover .destination-image img {
                    transform: scale(1.1);
                }

                /* Location badge on image */
                .location-badge {
                    position: absolute;
                    top: 12px;
                    left: 12px;
                    padding: 6px 12px;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border-radius: 16px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #333;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
                    z-index: 2;
                    letter-spacing: 0.3px;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .location-badge i {
                    color: #d4494c;
                    font-size: 13px;
                }

                /* Compressed vertical spacing */
                .destination-content {
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .destination-content .meta {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .destination-content .meta li {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    color: #888;
                    font-size: 13px;
                    font-weight: 500;
                }

                .destination-content .meta i {
                    color: #d4494c;
                    font-size: 14px;
                }

                /* Title with tighter spacing */
                .destination-content h5 {
                    margin: 0;
                    margin-top: 2px;
                    font-size: 18px;
                    font-weight: 700;
                    line-height: 1.3;
                    color: #1a1a1a;
                    transition: color 0.3s ease;
                }

                .destination-card-items:hover h5 {
                    color: #d4494c;
                }

                /* Stats container for horizontal alignment */
                .stats-container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: 8px;
                    padding-top: 10px;
                    border-top: 1px solid #f0f0f0;
                }

                /* Stats grouped tightly below title */
                .destination-stats {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                /* Improved hierarchy - bold numbers */
                .stat-item {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 13px;
                    color: #888;
                    font-weight: 400;
                }

                .stat-item i {
                    color: #aaa;
                    font-size: 14px;
                }

                .stat-number {
                    font-weight: 700;
                    font-size: 15px;
                    color: #1a1a1a;
                    margin-right: 2px;
                }

                /* Visual indicator on hover */
                .card-arrow {
                    width: 32px;
                    height: 32px;
                    background: #d4494c;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    opacity: 0;
                    transform: scale(0.8);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .destination-card-items:hover .card-arrow {
                    opacity: 1;
                    transform: scale(1);
                }

                .card-arrow i {
                    color: white;
                    font-size: 14px;
                }

                @media (max-width: 768px) {
                    .destination-content {
                        padding: 14px;
                    }

                    .destination-content h5 {
                        font-size: 16px;
                    }

                    .destination-stats {
                        gap: 12px;
                        margin-top: 6px;
                    }

                    .stat-item {
                        font-size: 12px;
                    }

                    .stat-number {
                        font-size: 14px;
                    }

                    .location-badge {
                        font-size: 11px;
                        padding: 5px 10px;
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
                                <Link href="/destination/destination-details" className="destination-card-link">
                                    <div className="destination-card-items">
                                        <div className="destination-image">
                                            <Image 
                                                src={item.img} 
                                                alt={item.title} 
                                                width={400} 
                                                height={300}
                                            />
                                            {/* Location Badge on Image */}
                                            <div className="location-badge">
                                                <i className="bi bi-geo-alt-fill"></i>
                                                {item.location}
                                            </div>
                                        </div>
                                        <div className="destination-content">
                                            {/* Climate tag with emoji */}
                                            <ul className="meta">
                                                <li>
                                                    {item.climate}
                                                </li>
                                            </ul>
                                            
                                            {/* Title - tighter to climate */}
                                            <h5>{item.title}</h5>

                                            {/* Stats: Tours & Packages - grouped tightly */}
                                            <div className="stats-container">
                                                <div className="destination-stats">
                                                    <div className="stat-item">
                                                        <i className="bi bi-map"></i>
                                                        <span className="stat-number">{item.tours}</span>
                                                        Tours
                                                    </div>
                                                    <div className="stat-item">
                                                        <i className="bi bi-box-seam"></i>
                                                        <span className="stat-number">{item.packages}</span>
                                                        Packages
                                                    </div>
                                                </div>
                                                {/* Arrow indicator on hover */}
                                                <div className="card-arrow">
                                                    <i className="bi bi-arrow-right"></i>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Destination1;