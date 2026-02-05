"use client"
import React from "react";
import ExpandableTitleDescription from "../Common/ExpandableTitleDescription";

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
            <section className="top-blue-rect"></section>
            <style jsx>{`
                .header-section {
                    margin-bottom: 25px;
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
                    <ExpandableTitleDescription title={title} description={description || ''} />
                    
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
                </div>
            </div>
        </section>
    );
};

export default DestinationHero;
