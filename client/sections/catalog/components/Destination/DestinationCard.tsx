"use client"
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Place } from '@/services/api-service';

// Extend Place with counts
interface DestinationCardProps extends Place {
    tours?: number;
    packages?: number;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ 
    id,
    name, 
    region, 
    ecosystem, 
    tours = 0, 
    packages = 0,
    images,
    slug
}) => {
    // Fallback image logic
    const imgStr = images?.heroImage?.path || '/images/placeholder.jpg';
    
    return (
        <>
            <style jsx>{`
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
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    flex-direction: column;
                    cursor: pointer;
                    border: 1px solid #f0f0f0;
                    transform: translateZ(0);
                }

                .destination-card-items:hover {
                    border-color: #e0e0e0;
                }

                .destination-image {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 4 / 3;
                    overflow: hidden;
                    border-radius: 0px 0px 16px 16px;
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

                /* Location badge on image */
                .location-badge {
                    position: absolute;
                    top: 12px;
                    left: 12px;
                    padding: 6px 12px;
                    background: rgba(220, 53, 69, 0.95); /* High contrast Red */
                    border-radius: 16px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #fff;
                    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
                    z-index: 2;
                    letter-spacing: 0.3px;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .location-badge i {
                    color: #fff;
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
                    color: #1f4d85;
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
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .destination-card-items:hover h5 {
                    color: #1f4d85;
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
                    background: #1f4d85;
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
            
            <Link href={`/destination/${slug || id}`} className="destination-card-link">
                <div className="destination-card-items">
                    <div className="destination-image">
                        <Image 
                            src={imgStr} 
                            alt={name} 
                            width={400} 
                            height={300}
                        />
                        {/* Location Badge on Image */}
                        {region && (
                            <div className="location-badge">
                                <i className="bi bi-geo-alt-fill"></i>
                                {region}
                            </div>
                        )}
                    </div>
                    <div className="destination-content">
                        {/* Climate tag with fixed icon */}
                        {ecosystem && (
                            <ul className="meta">
                                <li>
                                    <i className="bi bi-sun"></i>
                                    {ecosystem}
                                </li>
                            </ul>
                        )}
                        
                        {/* Title - tighter to climate */}
                        <h5>{name}</h5>

                        {/* Stats: Tours & Packages - grouped tightly */}
                        <div className="stats-container">
                            <div className="destination-stats">
                                <div className="stat-item">
                                    <i className="bi bi-map"></i>
                                    <span className="stat-number">{tours}</span>
                                    Tours
                                </div>
                                <div className="stat-item">
                                    <i className="bi bi-box-seam"></i>
                                    <span className="stat-number">{packages}</span>
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
        </>
    );
};

export default DestinationCard;
