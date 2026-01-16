import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface ModernDestinationCardProps {
    img: string;
    location: string;
    title: string;
    climate: string;
    tours: number;
    packages: number;
    href?: string;
}

const ModernDestinationCard = ({ 
    img, 
    location, 
    title, 
    climate, 
    tours,
    packages,
    href = "/destination/destination-details"
}: ModernDestinationCardProps) => {
    return (
        <>
            <style jsx>{`
                /* Modern destination cards styling */
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
                    height: 100%;
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

                .destination-content {
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    flex: 1;
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

                .stats-container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: auto;
                    padding-top: 10px;
                    border-top: 1px solid #f0f0f0;
                }

                .destination-stats {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

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

            <Link href={href} className="destination-card-link">
                <div className="destination-card-items">
                    <div className="destination-image">
                        <Image 
                            src={img} 
                            alt={title} 
                            width={400} 
                            height={300}
                        />
                        {/* Location Badge on Image */}
                        <div className="location-badge">
                            <i className="bi bi-geo-alt-fill"></i>
                            {location}
                        </div>
                    </div>
                    <div className="destination-content">
                        {/* Climate tag with emoji */}
                        <ul className="meta">
                            <li>
                                {climate}
                            </li>
                        </ul>
                        
                        {/* Title */}
                        <h5>{title}</h5>

                        {/* Stats: Tours & Packages */}
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

export default ModernDestinationCard;
