"use client"
import React from "react";
import GalleryImages from "../../../../shared/common/GalleryImages";
import ExpandableTitleDescription from "../../../../shared/common/ExpandableTitleDescription";

interface TourPackageHeroProps {
    title: string;
    description: string;
    location?: string;
    rating?: number;
    reviews?: number;
    images: string[];
}

const TourPackageHero = ({ 
    title, 
    description, 
    location = "Costa Rica",
    rating = 4.8, 
    reviews = 124, 
    images 
}: TourPackageHeroProps) => {



    return (
        <section className="tour-hero-section pb-4 bg-white">
            <section className="top-blue-rect"></section>
            <style jsx>{`
                .header-section {
                    margin-bottom: 25px;
                }

                .duration-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #1a1a1a;
                    background: #f8f9fa;
                    padding: 6px 14px;
                    border-radius: 50px;
                    border: 1px solid #e9ecef;
                }
                .meta-row {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 12px;
                    margin-bottom: 12px;
                }
                .rating-presentation {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-top: 10px;
                }
                .rating-score {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 16px;
                    font-weight: 700;
                    color: #1a1a1a;
                    background: #f5f5f5;
                    padding: 4px 10px;
                    border-radius: 6px;
                }
                .rating-text {
                    font-size: 15px;
                    color: #4a4a4a;
                    text-decoration: underline;
                    cursor: pointer;
                }
                .rating-text:hover {
                    color: #000;
                }


                .mobile-separator {
                    display: inline;
                }
                
                @media (max-width: 575px) {
                    .rating-presentation {
                        flex-direction: column;
                        align-items: flex-start !important;
                        gap: 8px !important;
                    }
                    .mobile-separator {
                        display: none;
                    }
                    .meta-row {
                        gap: 8px;
                    }
                }
            `}</style>
            
            <div className="container">
                {/* Header */}
                <div className="header-section">
                    <ExpandableTitleDescription title={title} description={description} />
                    
                    {/* Rating Section */}
                    <div className="rating-presentation">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <i className="bi bi-geo-alt-fill text-primary" style={{ fontSize: '14px' }}></i>
                            <span style={{ fontSize: '15px', color: '#4a4a4a', fontWeight: '500' }}>{location}</span>
                        </div>
                        <span className="text-secondary opacity-50 mobile-separator">•</span>
                        <div className="d-flex align-items-center gap-2">
                            <div className="rating-score">
                                <i className="bi bi-star-fill text-warning"></i>
                                {rating}
                            </div>
                            <span className="text-secondary opacity-50">•</span>
                            <a href="#reviews" className="rating-text">{reviews} reviews</a>
                        </div>
                    </div>
                </div>

                {/* Gallery Component */}
                <GalleryImages images={images} />
            </div>
        </section>
    );
};

export default TourPackageHero;

