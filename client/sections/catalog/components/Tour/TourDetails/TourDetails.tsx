"use client"
import React, { useEffect, useState } from 'react';
import loadBackgroudImages from '@/client/sections/shared/common/loadBackgroudImages';
import Link from 'next/link';
import Image from 'next/image';
import BookingWidget from './BookingWidget';
import DestinationCard from '@/client/sections/catalog/components/Destination/DestinationCard';
import { Tour, Place } from '@/services/api-service';

interface TourDetailsProps {
    tour: Tour;
}

const TourDetails = ({ tour }: TourDetailsProps) => {
    const [tourDestinations, setTourDestinations] = useState<Place[]>(tour.places || []);

    useEffect(() => {
        loadBackgroudImages();
        if (tour.places) {
            setTourDestinations(tour.places);
        }
    }, [tour]);

    // Tab state
    const [activeTab, setActiveTab] = useState('info');

    const priceAdult = tour.defaults?.price || 0;
    const priceChild = tour.defaults?.priceChild || 0;

    return (
        <section className="activities-details-section fix section-padding">
            <div className="container">
                <div className="activities-details-wrapper">
                    <div className="row g-4 justify-content-center flex-row-reverse">
                        <div className="col-12 col-lg-4">
                            <BookingWidget
                                tour={tour}
                                priceAdult={priceAdult}
                                priceChild={priceChild}
                                availableDates={tour.availableDates || []}
                                defaultSchedules={tour.defaults?.schedules || []}
                                meetingPoint={tour.meetingPoint}
                            />
                        </div>
                        <div className="col-12 col-lg-8">
                            <div className="activities-details-content">

                                {/* Key Info Section */}
                                <div className="tour-key-info mb-4 p-4 rounded-3 border bg-white shadow-sm">
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <div className="d-flex align-items-start gap-3">
                                                <div className="icon-wrapper d-flex align-items-center justify-content-center bg-success-subtle rounded-circle p-2" style={{ width: '40px', height: '40px' }}>
                                                    <i className="bi bi-check-lg text-success fs-5"></i>
                                                </div>
                                                <div>
                                                    <h6 className="mb-1 fw-bold">Cancellation Policy</h6>
                                                    <Link className="mb-0 text-muted small leading-0.5" href="/terms-and-conditions">Make sure you read the terms and conditions before booking</Link>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="d-flex align-items-start gap-3">
                                                <div className="icon-wrapper d-flex align-items-center justify-content-center bg-primary-subtle rounded-circle p-2" style={{ width: '40px', height: '40px' }}>
                                                    <i className="bi bi-clock text-primary fs-5"></i>
                                                </div>
                                                <div>
                                                    <h6 className="mb-1 fw-bold">Duration</h6>
                                                    <p className="mb-0 text-muted small">{tour.duration} {tour.duration === 1 ? 'Hour' : 'Hours'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* TABS NAVIGATION */}
                                <div className="mt-5 mb-4">
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
                                                Tour Info
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
                                                    {tourDestinations.length}
                                                </span>
                                            </button>
                                        </li>
                                    </ul>
                                </div>

                                {/* TAB CONTENT: TOUR INFO */}
                                {activeTab === 'info' && (
                                    <>
                                        {/* Includes/Excludes */}
                                        <div className="mt-5">
                                            <div className="row g-4">
                                                {/* Included Column */}
                                                <div className="col-md-6">
                                                    <h3 className="mb-4">What&apos;s Included</h3>
                                                    <ul className="list-unstyled d-flex flex-column gap-3">
                                                        {tour.includes?.map((item, index) => (
                                                            <li key={index} className="d-flex align-items-center gap-3">
                                                                <i className="bi bi-check-lg fs-5 text-success mt-1"></i>
                                                                <span className="text-secondary" style={{ fontSize: '16px', lineHeight: '1.6' }}>{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Not Included Column */}
                                                <div className="col-md-6">
                                                    <h3 className="mb-4">What&apos;s Not Included</h3>
                                                    <ul className="list-unstyled d-flex flex-column gap-3">
                                                        {tour.excludes?.map((item, index) => (
                                                            <li key={index} className="d-flex align-items-center gap-3">
                                                                <i className="bi bi-x-lg fs-5 text-danger mt-1"></i>
                                                                <span className="text-secondary" style={{ fontSize: '16px', lineHeight: '1.6' }}>{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tour Itinerary Section */}
                                        <div className="mt-5">
                                            <h3 className="mb-4">Itinerary</h3>
                                            <div className="itinerary-timeline ms-2">
                                                {tour.itinerary?.map((stop, index) => (
                                                    <div key={index} className={`d-flex gap-3 position-relative ${index !== (tour.itinerary?.length || 0) - 1 ? 'pb-5' : ''}`}>
                                                        {/* Line Connector for all but last item */}
                                                        {index !== (tour.itinerary?.length || 0) - 1 && (
                                                            <div className="position-absolute" style={{
                                                                left: '11px',
                                                                top: '40px',
                                                                bottom: '0',
                                                                width: '2px',
                                                                borderLeft: '2px dashed #dee2e6'
                                                            }}></div>
                                                        )}

                                                        <div className="shrink-0 mt-1">
                                                            <i className="bi bi-geo-alt fs-4 text-dark" style={{ lineHeight: 1 }}></i>
                                                        </div>
                                                        <div className="grow">
                                                            <h5 className="mb-2 fw-bold">{stop.title}</h5>
                                                            <p className="text-secondary mb-2">
                                                                {stop.description}
                                                            </p>
                                                            <div className="d-flex align-items-center gap-2 text-secondary small fw-medium">
                                                                <i className="bi bi-hourglass-split"></i>
                                                                <span>Duration: {stop.duration}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Meeting Point Section */}
                                        {tour.meetingPoint && (
                                            <div className="mt-5">
                                                <h3 className="mb-4">Meeting Point</h3>
                                                {/* Map */}
                                                {(tour.meetingPoint.coordinates || tour.meetingPoint.link) && (
                                                    <div className="rounded-4 overflow-hidden mb-4" style={{ height: '450px', width: '100%' }}>
                                                        <iframe
                                                            src={
                                                                tour.meetingPoint.coordinates
                                                                    ? `https://maps.google.com/maps?q=${tour.meetingPoint.coordinates.lat},${tour.meetingPoint.coordinates.lng}&z=15&output=embed`
                                                                    : tour.meetingPoint.link
                                                            }
                                                            width="100%"
                                                            height="100%"
                                                            style={{ border: 0 }}
                                                            allowFullScreen={true}
                                                            loading="lazy"
                                                            referrerPolicy="no-referrer-when-downgrade"
                                                        ></iframe>
                                                    </div>
                                                )}

                                                <div className="d-flex gap-3">
                                                    <div className="shrink-0 mt-1">
                                                        <i className="bi bi-geo-alt fs-4 text-dark"></i>
                                                    </div>
                                                    <div>
                                                        <h5 className="mb-2 fw-bold">{tour.meetingPoint.name || 'Meeting Point'}</h5>
                                                        <p className="text-secondary mb-3" style={{ lineHeight: '1.6' }}>
                                                            {tour.meetingPoint.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </>
                                )}

                                {/* TAB CONTENT: DESTINATIONS */}
                                {activeTab === 'destinations' && (
                                    <div className="mt-4">
                                        <h3 className="mb-4">Related Destinations</h3>
                                        <div className="row g-4">
                                            {tourDestinations.map((destination) => (
                                                <div key={destination.id} className="col-lg-4 col-md-6">
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

export default TourDetails;
