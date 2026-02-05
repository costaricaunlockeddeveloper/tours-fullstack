"use client"
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface TourPackageCardProps {
    images: string[];
    title: string;
    location: string;
    rating: string;
    reviews: string;
    price_adult: number;
}

const TourPackageCard: React.FC<TourPackageCardProps> = ({ 
    images, 
    title, 
    location,
    rating,
    reviews,
    price_adult 
}) => {



    return (
        // Removing the 'col' wrapper to let parent handle grid layout, as per learned pattern
        <div className="destination-card-items mt-0">
             <style jsx>{`
                /* Reuse styles from TourCard and DestinationCard for consistency */
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
                    border-radius: 16px 16px 0 0;
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
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .destination-card-items:hover h5 {
                    color: #1f4d85;
                }

                .info {
                    list-style: none;
                    padding: 0;
                    margin-top: 12px;
                    margin-bottom: 12px !important;
                    display: flex;
                    flex-wrap: wrap; /* Allow wrapping for inclusions */
                    gap: 15px;
                }

                .info li {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    color: #888;
                    font-size: 13px;
                    font-weight: 500;
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

            {/* A. Zona Visual */}
            <div className="destination-image">
                <Image 
                    src={images[0]} 
                    alt={title} 
                    width={400} 
                    height={300} 
                />
                
                {/* Overlay Top-Left: Flexible Duration Badge */}
                <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: '#fff',
                    color: '#000',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    fontSize: '8px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}>
                    Flexible Duration
                </div>

                {/* Overlay Top-Right: Simplified Rating */}
                <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: '#fff',
                    padding: '2px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backdropFilter: 'blur(2px)'
                }}>
                    <i className="bi bi-star-fill text-warning me-1"></i> {rating} ({reviews})
                </div>
            </div>
            
            <div className="destination-content">
                {/* B. Cuerpo Superior (El Gancho) */}
                <h5>
                    <Link href="/tour-packages/tour-packages-details">
                        {title}
                    </Link>
                </h5>
                {/* Ubicación: Icono de pin de mapa */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                    <i className="bi bi-geo-alt-fill text-(--brand-blue)" style={{ fontSize: '12px' }}></i>
                    <span style={{ fontSize: '12px', color: '#777', fontWeight: '500' }}>{location}</span>
                </div>
                
                {/* 3. Cuerpo Central ("The Power Bar") */}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', /* Better distribution */
                    gap: '4px',
                    marginBottom: '8px',
                    fontSize: '12px',
                    color: 'var(--brand-blue)',
                    fontWeight: '600',
                    backgroundColor: '#f8f9fa',
                    padding: '5px 8px',
                    borderRadius: '6px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="bi bi-house-door" style={{ color: '#1f4d85' }}></i>
                        <span>Hotel</span>
                    </div>
                    <span style={{ color: '#eee', fontWeight: '300' }}>|</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="bi bi-airplane-engines" style={{ color: '#1f4d85' }}></i>
                        <span>Transfer</span>
                    </div>
                    <span style={{ color: '#eee', fontWeight: '300' }}>|</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="bi bi-egg-fried" style={{ color: '#1f4d85' }}></i>
                        <span>Meals</span>
                    </div>
                </div>

                {/* 4. Pie de Página (Pricing UI with improved dashed border) */}
                <div className="price" style={{ borderTop: '1px dashed #ddd', paddingTop: '12px', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                        <span style={{ fontSize: '11px', color: '#666', fontWeight: '400', lineHeight:'1' }}>From</span>
                        <h6 style={{ margin: 0, lineHeight: '1.2' }}>US${price_adult.toLocaleString()}</h6>
                        <span style={{ fontSize: '10px', color: '#999', fontWeight: '400', lineHeight:'1' }}>per person</span>
                    </div>
                    <Link href="/tour-packages/tour-packages-details" className="theme-btn style-2">
                        View More <i className="bi bi-arrow-right"></i>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TourPackageCard;
