"use client"
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import GalleryImages from "../Common/GalleryImages";

interface TourHeroProps {
    title: string;
    description: string;
    rating: number;
    reviews: number;
    images: string[];
}

const TourHero = ({ title, description, rating, reviews, images }: TourHeroProps) => {

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
                    <div className="d-flex justify-content-between align-items-start">
                        <div>
                            <h1 className="tour-title">{title}</h1>
                            <p className="tour-description">{description}</p>
                            
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
                        <div className="share-btn text-primary pointer">
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

export default TourHero;
