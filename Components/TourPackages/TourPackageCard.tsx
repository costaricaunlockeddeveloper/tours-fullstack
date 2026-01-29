"use client"
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface TourPackageCardProps {
    images: string[];
    title: string;
    duration_days: number;
    duration_nights: number;
    tags: string[];
    included: string[];
    price_adult: number;
}

const TourPackageCard: React.FC<TourPackageCardProps> = ({ 
    images, 
    title, 
    duration_days, 
    duration_nights, 
    tags, 
    included, 
    price_adult 
}) => {

    const getInclusionIcon = (item: string) => {
        const iconMap: { [key: string]: string } = {
            'Hotel': 'bi-house-door',
            'Transfer': 'bi-airplane',
            'Meals': 'bi-egg-fried',
            'All Meals': 'bi-egg-fried',
            'Breakfast': 'bi-cup-hot',
            'Tours': 'bi-ticket-perforated',
            'Activities': 'bi-activity',
            'Guides': 'bi-person-badge',
            'Spa': 'bi-flower1'
        };
        return iconMap[item] || 'bi-check-circle';
    };

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
                    margin-top: auto;
                    padding-top: 10px;
                    border-top: 1px solid #f0f0f0;
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
                
                {/* Etiqueta (Badge) */}
                {tags[0] && (
                    <span 
                        style={{
                            position: 'absolute',
                            top: '12px',
                            left: '12px',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            color: '#333',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                    >
                        {tags[0]}
                    </span>
                )}
                
                {/* Duración */}
                <span 
                    style={{
                        position: 'absolute',
                        bottom: '12px',
                        right: '12px',
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        color: '#fff',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '600',
                        backdropFilter: 'blur(4px)'
                    }}
                >
                    {duration_days} Days / {duration_nights} Nights
                </span>
            </div>
            
            <div className="destination-content">
                {/* B. Zona de Contenido */}
                <h5>
                    <Link href="/tour-packages/tour-packages-details">
                        {title}
                    </Link>
                </h5>
                
                {/* C. Zona de Valor (Iconos) */}
                <ul className="info">
                    {included.slice(0, 4).map((inclusion, idx) => (
                        <li key={idx}>
                            <i className={getInclusionIcon(inclusion)}></i>
                            {inclusion}
                        </li>
                    ))}
                </ul>
                
                {/* D. Zona de Precio y Acción */}
                <div className="price">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                        <span style={{ fontSize: '11px', color: '#666', fontWeight: '400', lineHeight:'1' }}>From</span>
                        <h6 style={{ margin: 0, lineHeight: '1.2' }}>${price_adult.toLocaleString()}</h6>
                        <span style={{ fontSize: '10px', color: '#999', fontWeight: '400', lineHeight:'1' }}>per person</span>
                    </div>
                    <Link href="/tour-packages/tour-packages-details" className="theme-btn style-2">
                        View Itinerary <i className="bi bi-arrow-right"></i>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TourPackageCard;
