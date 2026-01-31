"use client"
import React from "react";

interface DestinationHeroProps {
    title: string;
    climate: string;
    region: string;
    province: string;
    description?: string; // Added description prop
}

const DestinationHero = ({ title, climate, region, province, description }: DestinationHeroProps) => {

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
                    margin-bottom: 12px;
                    line-height: 1.2;
                }
                .meta-row {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 16px;
                    margin-bottom: 10px;
                    font-size: 15px;
                    color: #4a4a4a;
                }
                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .tour-description {
                    font-size: 16px;
                    color: #4a4a4a;
                    line-height: 1.6;
                    max-width: 100%;
                }
                .climate-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-weight: 500;
                    color: #1a1a1a;
                    background: #f8f9fa;
                    padding: 4px 12px;
                    border-radius: 50px;
                    border: 1px solid #e9ecef;
                    font-size: 13px;
                }
            `}</style>
            
            <div className="container">
                {/* Header */}
                <div className="header-section">
                    <div className="d-flex justify-content-between align-items-start gap-4">
                        <div className="grow">
                            <h1 className="tour-title">{title}</h1>
                            
                            {/* Metadata Row: Location | Climate */}
                            <div className="meta-row">
                                <div className="meta-item">
                                    <i className="bi bi-geo-alt-fill text-primary"></i>
                                    <span className="fw-medium">{region}, {province}</span>
                                </div>
                                <div className="meta-item">
                                    <div className="climate-badge">
                                        <i className="bi bi-sun-fill text-warning"></i>
                                        {climate}
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="tour-description">
                                {description}
                            </div>
                        </div>
                        
                        <div className="share-btn text-primary pointer shrink-0" style={{ cursor: 'pointer' }}>
                            <i className="bi bi-share fs-4"></i>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DestinationHero;
