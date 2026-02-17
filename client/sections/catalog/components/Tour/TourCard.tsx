"use client"
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface TourCardProps {
    img: string;
    title: string;
    slug: string;
    destinations: number;
    duration: number;
    rating: number;
    reviews: number;
    price: number;
}

const TourCard: React.FC<TourCardProps> = ({ img, title, slug, destinations, duration, rating, reviews, price }) => {
    return (
        <>
            <style jsx>{`
                .destination-card-items {
                    position: relative;
                    border-radius: 16px;
                    overflow: hidden;
                    background: white;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    flex-direction: column;
                    cursor: pointer;
                    border: 1px solid #f0f0f0;
                    transform: translateZ(0);
                    height: 100%;
                }

                .destination-card-items:hover {
                    border-color: #e0e0e0;
                }

                .destination-image {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 4 / 3;
                    overflow: hidden;
                    border-radius: 0 0 16px 16px;
                }

                .destination-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    display: block;
                }

                .destination-card-items:hover .destination-image img {
                    transform: scale(1.1);
                }

                .destination-content {
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                    gap: 6px;
                }

                .destination-content h5 {
                    margin: 0;
                    margin-top: 2px;
                    font-size: 18px;
                    font-weight: 700;
                    line-height: 1.3;
                    color: #1a1a1a;
                    transition: color 0.3s ease;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .destination-card-items:hover h5 {
                    color: #1f4d85;
                }

                .info {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-top: 5px;
                    margin-bottom: 10px !important;
                }

                .info li {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    color: #888;
                    font-size: 12px;
                    font-weight: 500;
                    white-space: nowrap;
                }

                .info i {
                    color: #1f4d85;
                    font-size: 14px;
                }

                .price {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: auto; /* Push to bottom if flex column */
                }

                .price h6 {
                    font-size: 16px;
                    font-weight: 700;
                    color: #1f4d85;
                    margin: 0;
                }
                
                .theme-btn.style-2 {
                   font-size: 13px;
                   padding: 8px 16px;
                   height: auto;
                   line-height: normal;
                }
            `}</style>
            
            <div className="destination-card-items mt-0">
                <div className="destination-image">
                        <Image 
                            src={img} 
                            alt={title} 
                            width={400} 
                            height={300}
                        />
                </div>
                <div className="destination-content">
                    <h5>
                        <Link href={`/tour/${slug || '#'}`}>
                            {title}
                        </Link>
                    </h5>
                    <ul className="info">
                        <li>
                            <i className="bi bi-map"></i>
                            {destinations} Dest.
                        </li>
                        <li>
                            <i className="bi bi-clock"></i>
                            {duration} Hours
                        </li>
                        <li>
                            <i className="bi bi-star-fill text-warning"></i>
                            {typeof rating === 'number' ? rating.toFixed(1) : rating} ({reviews})
                        </li>
                    </ul>
                    <div className="price">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                        <span style={{ fontSize: '11px', color: '#666', fontWeight: '400', lineHeight:'1' }}>From</span>
                        <h6 style={{ margin: 0, lineHeight: '1.2' }}>US${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h6>
                        <span style={{ fontSize: '10px', color: '#999', fontWeight: '400', lineHeight:'1' }}>per person</span>
                    </div>
                        <Link href={`/tour/${slug || '#'}`} className="theme-btn style-2">
                            View tour <i className="bi bi-arrow-right"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TourCard;
