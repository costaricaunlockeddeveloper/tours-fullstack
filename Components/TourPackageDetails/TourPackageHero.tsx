"use client"
import React from "react";
import GalleryImages from "../Common/GalleryImages";

interface TourPackageHeroProps {
    title: string;
    description: string;
    rating?: number;
    reviews?: number;
    images: string[];
}

const TourPackageHero = ({ 
    title, 
    description, 
    rating = 4.8, 
    reviews = 124, 
    images 
}: TourPackageHeroProps) => {

    return (
        <section className="tour-hero-section pb-4 bg-white">
            <section className="h-32 bg-(--brand-blue) mb-7"></section>
            <style jsx>{`
                .header-section {
                    margin-bottom: 25px;
                }
                .tour-title {
                    font-size: 32px;
                    font-weight: 800;
                    color: #1a1a1a;
                    margin-bottom: 8px;
                    line-height: 1.2;
                }
                .tour-description {
                    font-size: 16px;
                    color: #4a4a4a;
                    margin-bottom: 15px;
                    line-height: 1.6;
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
            `}</style>
            
            <div className="container">
                {/* Header */}
                <div className="header-section">
                    <div className="d-flex justify-content-between align-items-start gap-4">
                        <div className="grow">
                            <h1 className="tour-title">{title}</h1>
                            

                            
                            <p className="tour-description">{description}</p>
                            
                            {/* Rating Section */}
                            <div className="rating-presentation">
                                <div className="rating-score">
                                    <i className="bi bi-star-fill text-warning"></i>
                                    {rating}
                                </div>
                                <span className="text-secondary">•</span>
                                <a href="#reviews" className="rating-text">{reviews} reviews</a>
                            </div>
                        </div>
                        
                        <div className="share-btn text-primary shrink-0" style={{ cursor: 'pointer' }}>
                            <i className="bi bi-share fs-4"></i>
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

