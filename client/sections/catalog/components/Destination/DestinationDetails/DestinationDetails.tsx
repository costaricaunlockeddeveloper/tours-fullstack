"use client"
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import GalleryImages from '../../../../shared/common/GalleryImages';

import { Place, AssetMeta } from '@/services/api-service';

interface DestinationDetailsProps {
    place?: Place;
}

const DestinationDetails = ({ place }: DestinationDetailsProps) => {
    const [activeTab, setActiveTab] = useState<'general' | 'tours' | 'packages'>('general');

    // Prepare images for gallery
    const galleryImages: (string | AssetMeta)[] = [];
    if (place?.images?.heroImage) {
        galleryImages.push(place.images.heroImage);
    }
    if (place?.images?.secondaryAssets) {
        place.images.secondaryAssets.forEach(img => {
            if (img.path) galleryImages.push(img);
        });
    }

    // Default images if none found
    if (galleryImages.length === 0) {
        galleryImages.push('/assets/img/destails/desti-details.jpg');
    }
    console.log(place);
    return (
        <section className="destination-details-section fix mb-20">
            <div className="container">
                <div className="destination-details-wrapper">
                    {/* Tab Navigation */}
                    <div className="mb-4">
                        <ul className="nav nav-tabs" style={{ 
                            borderBottom: '2px solid #e9ecef',
                            gap: '1rem'
                        }}>
                            <li className="nav-item">
                                <button 
                                    className={`nav-link ${activeTab === 'general' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('general')}
                                    style={{
                                        border: 'none',
                                        borderBottom: activeTab === 'general' ? '3px solid var(--theme)' : '3px solid transparent',
                                        backgroundColor: 'transparent',
                                        color: activeTab === 'general' ? 'var(--theme)' : '#6c757d',
                                        fontWeight: activeTab === 'general' ? '600' : '400',
                                        padding: '12px 24px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        fontSize: '16px'
                                    }}
                                >
                                    <i className="bi bi-info-circle me-2"></i>
                                    General Information
                                </button>
                            </li>
                            <li className="nav-item">
                                <button 
                                    className={`nav-link ${activeTab === 'tours' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('tours')}
                                    style={{
                                        border: 'none',
                                        borderBottom: activeTab === 'tours' ? '3px solid var(--theme)' : '3px solid transparent',
                                        backgroundColor: 'transparent',
                                        color: activeTab === 'tours' ? 'var(--theme)' : '#6c757d',
                                        fontWeight: activeTab === 'tours' ? '600' : '400',
                                        padding: '12px 24px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        fontSize: '16px'
                                    }}
                                >
                                    <i className="bi bi-map me-2"></i>
                                    Tours
                                    <span className="badge ms-2" style={{
                                        backgroundColor: activeTab === 'tours' ? 'var(--theme)' : '#6c757d',
                                        color: '#fff',
                                        borderRadius: '12px',
                                        padding: '4px 8px',
                                        fontSize: '12px'
                                    }}>
                                        {place?.tours || 0}
                                    </span>
                                </button>
                            </li>
                            <li className="nav-item">
                                <button 
                                    className={`nav-link ${activeTab === 'packages' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('packages')}
                                    style={{
                                        border: 'none',
                                        borderBottom: activeTab === 'packages' ? '3px solid var(--theme)' : '3px solid transparent',
                                        backgroundColor: 'transparent',
                                        color: activeTab === 'packages' ? 'var(--theme)' : '#6c757d',
                                        fontWeight: activeTab === 'packages' ? '600' : '400',
                                        padding: '12px 24px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        fontSize: '16px'
                                    }}
                                >
                                    <i className="bi bi-box-seam me-2"></i>
                                    Packages
                                    <span className="badge ms-2" style={{
                                        backgroundColor: activeTab === 'packages' ? 'var(--theme)' : '#6c757d',
                                        color: '#fff',
                                        borderRadius: '12px',
                                        padding: '4px 8px',
                                        fontSize: '12px'
                                    }}>
                                        {place?.packages || 0}
                                    </span>
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Tab Content */}
                    <div className="tab-content">
                        {/* General Information Tab */}
                        {activeTab === 'general' && (
                            <div className="destination-details-items">
                                <div className="details-content">
                                    {/* Image Gallery - Mosaic Grid */}
                                    <GalleryImages images={galleryImages} />
                                </div>
                                <div className="map-area">
                                    <h3>View in Map</h3>
                                    <div className="google-map">
                                        <iframe 
                                            src={`https://maps.google.com/maps?q=${place?.coordinates?.lat},${place?.coordinates?.lng}&z=15&output=embed`} 
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            style={{ border: 0, width: '100%', height: '450px' }}
                                        ></iframe>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tours Tab */}
                        {activeTab === 'tours' && (
                            <div className="text-center py-5">
                                <div className="mb-4">
                                    <i className="bi bi-map" style={{ fontSize: '64px', color: '#dee2e6' }}></i>
                                </div>
                                <h4 className="mb-3" style={{ color: '#6c757d' }}>No Tours Available</h4>
                                <p className="text-muted">
                                    Tours for this destination will be displayed here.
                                </p>
                                <div className="mt-4">
                                    <span className="badge" style={{
                                        backgroundColor: '#f8f9fa',
                                        color: '#6c757d',
                                        fontSize: '18px',
                                        padding: '12px 24px',
                                        borderRadius: '20px',
                                        border: '2px solid #dee2e6'
                                    }}>
                                        0 Tours
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Packages Tab */}
                        {activeTab === 'packages' && (
                            <div className="text-center py-5">
                                <div className="mb-4">
                                    <i className="bi bi-box-seam" style={{ fontSize: '64px', color: '#dee2e6' }}></i>
                                </div>
                                <h4 className="mb-3" style={{ color: '#6c757d' }}>No Packages Available</h4>
                                <p className="text-muted">
                                    Travel packages for this destination will be displayed here.
                                </p>
                                <div className="mt-4">
                                    <span className="badge" style={{
                                        backgroundColor: '#f8f9fa',
                                        color: '#6c757d',
                                        fontSize: '18px',
                                        padding: '12px 24px',
                                        borderRadius: '20px',
                                        border: '2px solid #dee2e6'
                                    }}>
                                        0 Packages
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DestinationDetails;