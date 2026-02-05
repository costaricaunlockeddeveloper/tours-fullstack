"use client"
import React from "react";
import GalleryImages from "../Common/GalleryImages";

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

    const handleShare = async () => {
        const shareData = {
            title: title,
            text: description,
            url: typeof window !== 'undefined' ? window.location.href : '',
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                alert("Link copied to clipboard!");
            }
        } catch (err) {
            console.error("Error sharing:", err);
        }
    };

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
                .share-btn {
                    width: 44px !important;
                    height: 44px !important;
                    min-width: 44px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    border-radius: 50% !important;
                    border: 1px solid var(--brand-blue) !important;
                    color: var(--brand-blue) !important;
                    background: #fff !important;
                    transition: all 0.3s ease !important;
                    cursor: pointer !important;
                    padding: 0 !important;
                    line-height: 0 !important;
                }
                .share-btn:hover {
                    background: var(--brand-blue) !important;
                    color: white !important;
                    transform: scale(1.05);
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
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <i className="bi bi-geo-alt-fill text-primary" style={{ fontSize: '14px' }}></i>
                                    <span style={{ fontSize: '15px', color: '#4a4a4a', fontWeight: '500' }}>{location}</span>
                                </div>
                                <span className="text-secondary opacity-50">•</span>
                                <div className="rating-score">
                                    <i className="bi bi-star-fill text-warning"></i>
                                    {rating}
                                </div>
                                <span className="text-secondary opacity-50">•</span>
                                <a href="#reviews" className="rating-text">{reviews} reviews</a>
                            </div>
                        </div>
                        
                        <button className="share-btn" onClick={handleShare}>
                            <i className="bi bi-share" style={{ fontSize: '1.2rem' }}></i>
                        </button>
                    </div>
                </div>

                {/* Gallery Component */}
                <GalleryImages images={images} />
            </div>
        </section>
    );
};

export default TourPackageHero;

