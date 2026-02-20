"use client"
import React, { useMemo } from "react";
import GalleryImages from "@/client/sections/shared/common/GalleryImages";
import ExpandableTitleDescription from "@/client/sections/shared/common/ExpandableTitleDescription";
import { PlaceImages, AssetMeta } from "@/services/api-service";

interface TourHeroProps {
    title: string;
    description: string;
    rating: number;
    reviews: number;
    images?: PlaceImages;
}

const TourHero = ({ title, description, rating, reviews, images }: TourHeroProps) => {
    // Combine heroImage + secondaryAssets into a single gallery array
    // Combine heroImage + secondaryAssets into a single gallery array
    const galleryImages = useMemo(() => {
        const result: (string | AssetMeta)[] = [];
        if (images?.heroImage) result.push(images.heroImage);
        if (images?.secondaryAssets?.length) {
            images.secondaryAssets.forEach(asset => {
                if (asset.path) result.push(asset);
            });
        }
        return result.length > 0 ? result : ['/assets/img/destination/01.jpg'];
    }, [images]);



    return (
        <section className="tour-hero-section pb-4 bg-white">
            <section className="top-blue-rect"></section>
            <style jsx>{`
                .header-section {
                    margin-bottom: 25px;
                }

                .bestseller-badge {
                    background-color: #003580;
                    color: white;
                    padding: 4px 12px;
                    font-size: 12px;
                    font-weight: 600;
                    border-radius: 4px;
                    display: inline-block;
                }
                
                /* Rating Presentation in Header */
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
                    <ExpandableTitleDescription title={title} description={description} />
                    
                    {/* Rating Section Presentation */}
                    <div className="rating-presentation">
                        <div className="rating-score">
                            <i className="bi bi-star-fill text-warning"></i>
                            {rating}
                        </div>
                        <span className="text-secondary">•</span>
                        <a href="#reviews" className="rating-text">{reviews} reviews</a>
                    </div>
                </div>

                {/* Gallery Component */}
                <GalleryImages images={galleryImages} />
            </div>
        </section>
    );
};

export default TourHero;
