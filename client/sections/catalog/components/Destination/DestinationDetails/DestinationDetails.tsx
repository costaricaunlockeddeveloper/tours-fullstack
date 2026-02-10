"use client"
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import GalleryImages from '../../../../shared/common/GalleryImages';

const DestinationDetails = () => {
    const [activeTab, setActiveTab] = useState<'general' | 'tours' | 'packages'>('general');

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
                                        0
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
                                        0
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
                                    {/* Image Gallery - Mosaic Grid */}
                                    <GalleryImages images={[
                                        '/assets/img/destails/desti-details.jpg',
                                        '/assets/img/destails/desti-details-2.jpg',
                                        '/assets/img/destails/desti-details-3.jpg',
                                        '/assets/img/destination/01.jpg',
                                        '/assets/img/destination/02.jpg',
                                        '/assets/img/destination/03.jpg',
                                    ]} />
                                </div>
                                <div className="map-area">
                                    <h3>View in Map</h3>
                                    <div className="google-map">
                                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6678.7619084840835!2d144.9618311901502!3d-37.81450084255415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642b4758afc1d%3A0x3119cc820fdfc62e!2sEnvato!5e0!3m2!1sen!2sbd!4v1641984054261!5m2!1sen!2sbd" loading="lazy"></iframe>
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