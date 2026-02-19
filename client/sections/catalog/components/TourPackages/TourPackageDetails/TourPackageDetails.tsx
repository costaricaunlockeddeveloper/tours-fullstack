"use client"
import React, { useEffect, useState } from 'react';
import loadBackgroudImages from '../../../../shared/common/loadBackgroudImages';
import PackageBookingWidget from './PackageBookingWidget';
import DestinationCard from '../../Destination/DestinationCard';
import { Package } from '@/services/api-service';

interface TourPackageDetailsProps {
    pkg: Package;
}

const TourPackageDetails = ({ pkg }: TourPackageDetailsProps) => {

            useEffect(() => {
                loadBackgroudImages();
            }, []);
            
            // State for showing all activities or just first 3
            const [showAllActivities, setShowAllActivities] = useState(false);
            const activitiesToShow = showAllActivities ? (pkg.activities?.length || 0) : 3;
            
            // Tab state
            const [activeTab, setActiveTab] = useState('info');
            
            // Places/destinations from the package
            const packageDestinations = pkg.places || [];

    return (
<section className="activities-details-section fix section-padding">
        <div className="container">
            <div className="activities-details-wrapper">
                <div className="row g-4 justify-content-center flex-row-reverse">
                    <div className="col-12 col-lg-4">
                        <PackageBookingWidget 
                            adultPrice={pkg.price}
                            childPrice={pkg.priceChild || 0}
                            packageId={pkg.id}
                            packageName={pkg.name}
                        />
                    </div>
                    <div className="col-12 col-lg-8">
                        <div className="activities-details-content">
                            {/* TABS NAVIGATION */}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 w-full">
                                <div className="flex items-center gap-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100 transition-all hover:bg-blue-50">
                                    <div className="shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                        <i className="bi bi-headset fs-4"></i>
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-slate-900 mb-0">24/7 Expert Support</h4>
                                        <p className="text-xs text-slate-500 mb-0">Always here for you during your trip</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 bg-orange-50/50 p-4 rounded-xl border border-orange-100 transition-all hover:bg-orange-50">
                                    <div className="shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                                        <i className="bi bi-car-front-fill fs-4"></i>
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-slate-900 mb-0">Hotel Pickup Included</h4>
                                        <p className="text-xs text-slate-500 mb-0">Hassle-free transportation from your stay</p>
                                    </div>
                                </div>
                            </div>
                            <div className=" mb-4">
                                <ul className="nav nav-tabs" style={{ 
                                    borderBottom: '2px solid #e9ecef',
                                    gap: '1rem'
                                }}>
                                    <li className="nav-item">
                                        <button 
                                            className={`nav-link ${activeTab === 'info' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('info')}
                                            style={{
                                                border: 'none',
                                                borderBottom: activeTab === 'info' ? '3px solid var(--theme)' : '3px solid transparent',
                                                backgroundColor: 'transparent',
                                                color: activeTab === 'info' ? 'var(--theme)' : '#6c757d',
                                                fontWeight: activeTab === 'info' ? '600' : '400',
                                                padding: '12px 24px',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                fontSize: '16px'
                                            }}
                                        >
                                            <i className="bi bi-info-circle me-2"></i>
                                            Package Info
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button 
                                            className={`nav-link ${activeTab === 'destinations' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('destinations')}
                                            style={{
                                                border: 'none',
                                                borderBottom: activeTab === 'destinations' ? '3px solid var(--theme)' : '3px solid transparent',
                                                backgroundColor: 'transparent',
                                                color: activeTab === 'destinations' ? 'var(--theme)' : '#6c757d',
                                                fontWeight: activeTab === 'destinations' ? '600' : '400',
                                                padding: '12px 24px',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                fontSize: '16px'
                                            }}
                                        >
                                            <i className="bi bi-geo-alt me-2"></i>
                                            Destinations
                                            <span className="badge ms-2" style={{
                                                backgroundColor: activeTab === 'destinations' ? 'var(--theme)' : '#6c757d',
                                                color: '#fff',
                                                borderRadius: '12px',
                                                padding: '4px 8px',
                                                fontSize: '12px'
                                            }}>
                                                {packageDestinations.length}
                                            </span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            
                            {/* TAB CONTENT: PACKAGE INFO */}
                            {activeTab === 'info' && (
                                <>
                                    {/* Activities - Timeline Vertical */}
                                    {pkg.activities && pkg.activities.length > 0 && (
                                    <div className="mt-5">
                                        <h3 className="mb-4">Activities Included</h3>
                                        <div className="timeline-wrapper" style={{ position: 'relative', paddingLeft: '40px' }}>
                                            {/* Vertical Line */}
                                            <div style={{
                                                position: 'absolute',
                                                left: '15px',
                                                top: '10px',
                                                bottom: '10px',
                                                width: '2px',
                                                backgroundColor: '#e9ecef'
                                            }}></div>

                                            {pkg.activities.slice(0, activitiesToShow).map((activity, index) => {
                                                const isLastShown = index === activitiesToShow - 1;
                                                
                                                return (
                                                    <div 
                                                        key={index} 
                                                        className={`timeline-item ${!isLastShown ? 'mb-4' : ''}`} 
                                                        style={{ position: 'relative' }}
                                                    >
                                                        {/* Timeline Dot */}
                                                        <div style={{
                                                            position: 'absolute',
                                                            left: '-33px',
                                                            top: '5px',
                                                            width: '12px',
                                                            height: '12px',
                                                            borderRadius: '50%',
                                                            backgroundColor: 'var(--theme)',
                                                            border: '3px solid #fff',
                                                            boxShadow: '0 0 0 2px var(--theme)'
                                                        }}></div>
                                                        
                                                        {/* Activity Content */}
                                                        <div 
                                                            className="p-3" 
                                                            style={{ 
                                                                backgroundColor: '#f8f9fa', 
                                                                borderRadius: '8px', 
                                                                border: '1px solid #e9ecef'
                                                            }}
                                                        >
                                                            {/* Activity Title */}
                                                            <h5 className="mb-2" style={{ color: 'var(--theme)', fontSize: '16px', fontWeight: '700' }}>
                                                                {activity.title}
                                                            </h5>
                                                            
                                                            {/* Description */}
                                                            <p className="mb-0" style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>
                                                                {activity.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        
                                        {/* Show All Activities Button */}
                                        {!showAllActivities && (pkg.activities?.length || 0) > 3 && (
                                            <div className="text-center mt-4">
                                                <button 
                                                    onClick={() => setShowAllActivities(true)}
                                                    className="theme-btn"
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '8px'
                                                    }}
                                                >
                                                    Show All {pkg.activities?.length} Activities
                                                    <i className="bi bi-chevron-down"></i>
                                                </button>
                                            </div>
                                        )}
                                        
                                        {/* Collapse Button */}
                                        {showAllActivities && (
                                            <div className="text-center mt-4">
                                                <button 
                                                    onClick={() => setShowAllActivities(false)}
                                                    className="theme-btn style-2"
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '8px'
                                                    }}
                                                >
                                                    Show Less
                                                    <i className="bi bi-chevron-up"></i>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    )}

                                    {/* WHAT'S INCLUDED / NOT INCLUDED - Two Columns */}
                                    <div className="mt-5">
                                        <div className="row g-4">
                                            {/* Included Column */}
                                            {pkg.included && pkg.included.length > 0 && (
                                            <div className="col-md-6">
                                                <h3 className="mb-4">What&apos;s Included</h3>
                                                <ul className="list-unstyled d-flex flex-column gap-3">
                                                    {pkg.included.map((item, index) => (
                                                        <li key={index} className="d-flex align-items-start gap-3">
                                                            <i className="bi bi-check-lg fs-5 text-success mt-1"></i>
                                                            <span className="text-secondary" style={{ fontSize: '16px', lineHeight: '1.6' }}>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            )}

                                            {/* Not Included Column */}
                                            {pkg.excludes && pkg.excludes.length > 0 && (
                                            <div className="col-md-6">
                                                <h3 className="mb-4">What&apos;s Not Included</h3>
                                                <ul className="list-unstyled d-flex flex-column gap-3">
                                                    {pkg.excludes.map((item, index) => (
                                                        <li key={index} className="d-flex align-items-start gap-3">
                                                            <i className="bi bi-x-lg fs-5 text-danger mt-1"></i>
                                                            <span className="text-secondary" style={{ fontSize: '16px', lineHeight: '1.6' }}>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* TAB CONTENT: DESTINATIONS */}
                            {activeTab === 'destinations' && (
                                <div className="mt-4">
                                    <h3 className="mb-4">Destinations Included in This Package</h3>
                                    <div className="row g-4">
                                        {packageDestinations.map((destination, index) => (
                                            <div key={index} className="col-lg-4 col-md-6">
                                                <DestinationCard
                                                    {...destination}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}


                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    );
};

export default TourPackageDetails;
