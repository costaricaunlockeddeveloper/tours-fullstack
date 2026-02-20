"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import the 3D map to avoid SSR issues with Three.js
const InteractiveMap = dynamic(
    () => import('@/components/Landing/InteractiveMap').then(mod => ({ default: mod.InteractiveMap })),
    { ssr: false, loading: () => <div style={{ height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>Loading map...</div> }
);

const HomeMapSection = () => {
    return (
        <>
            <style jsx>{`
                .map-section {
                    position: relative;
                    overflow: hidden;
                }
                .map-section__header {
                    text-align: center;
                    padding: 60px 0 30px;
                }
                .map-section__subtitle {
                    font-size: 14px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    color: var(--brand-blue, #1a6eb2);
                    margin-bottom: 10px;
                }
                .map-section__title {
                    font-size: 36px;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0;
                }
                /* Desktop: show 3D map */
                .map-section__desktop {
                    display: none;
                }
                /* Mobile: show CTA card */
                .map-section__mobile {
                    display: block;
                    padding: 0 20px 40px;
                }
                .map-cta-card {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    padding: 24px 28px;
                    background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%);
                    border: 1px solid rgba(26, 110, 178, 0.15);
                    border-radius: 16px;
                    text-decoration: none;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .map-cta-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
                }
                .map-cta-card__icon {
                    flex-shrink: 0;
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    background: var(--brand-blue, #1a6eb2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    font-size: 24px;
                }
                .map-cta-card__text h4 {
                    font-size: 18px;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0 0 4px;
                }
                .map-cta-card__text p {
                    font-size: 14px;
                    color: #64748b;
                    margin: 0;
                }
                .map-cta-card__arrow {
                    margin-left: auto;
                    font-size: 20px;
                    color: var(--brand-blue, #1a6eb2);
                }

                @media (min-width: 992px) {
                    .map-section__desktop {
                        display: block;
                    }
                    .map-section__mobile {
                        display: none;
                    }
                }
            `}</style>

            <section className="map-section">
                <div className="map-section__header">
                    <div className="container">
                        <p className="map-section__subtitle">Explore the Map</p>
                        <h2 className="map-section__title">Discover Costa Rica</h2>
                    </div>
                </div>

                {/* Desktop: Full 3D interactive map */}
                <div className="map-section__desktop">
                    <InteractiveMap />
                </div>

                {/* Mobile: CTA card linking to full map page */}
                <div className="map-section__mobile">
                    <div className="container">
                        <Link href="/explore-map" className="map-cta-card">
                            <div className="map-cta-card__icon">
                                <i className="bi bi-globe-americas"></i>
                            </div>
                            <div className="map-cta-card__text">
                                <h4>Interactive 3D Map</h4>
                                <p>Tap to explore Costa Rica in full screen</p>
                            </div>
                            <div className="map-cta-card__arrow">
                                <i className="bi bi-chevron-right"></i>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomeMapSection;
