"use client"
import React, { useEffect, useState } from 'react';
import loadBackgroudImages from '../Common/loadBackgroudImages';
import Link from 'next/link';
import Image from 'next/image';
import PackageBookingWidget from './PackageBookingWidget';
import ModernDestinationCard from '../Card/ModernDestinationCard';

const TourPackageDetails = () => {

            useEffect(() => {
                loadBackgroudImages();
            }, []);
            
            // Itinerary data
            const itineraryDays = [
                {
                    day: 1,
                    title: "Arrival & Welcome",
                    description: "Private transfer from Juan Santamaría International Airport (SJO) to your hotel in San José. Welcome briefing and free afternoon to explore the city at your leisure.",
                    accommodation: "Hotel Presidente (or similar)"
                },
                {
                    day: 2,
                    title: "San José to Arenal Volcano",
                    description: "Scenic drive to La Fortuna (3.5 hours). Visit Arenal Volcano National Park with guided hike. Afternoon relaxation at natural hot springs with dinner included.",
                    accommodation: "Arenal Springs Resort & Spa (or similar)"
                },
                {
                    day: 3,
                    title: "Arenal Adventures",
                    description: "Morning zip-lining through the rainforest canopy. Afternoon hanging bridges walk with wildlife spotting. Evening free to explore La Fortuna town.",
                    accommodation: "Arenal Springs Resort & Spa (or similar)"
                },
                {
                    day: 4,
                    title: "Arenal to Manuel Antonio",
                    description: "Scenic drive along the Pacific Coast to Manuel Antonio (4 hours). Check-in at beachfront hotel. Sunset beach walk and welcome cocktail.",
                    accommodation: "Parador Resort & Spa (or similar)"
                },
                {
                    day: 5,
                    title: "Manuel Antonio National Park",
                    description: "Guided tour of Manuel Antonio National Park. Wildlife spotting (sloths, monkeys, toucans) and pristine beach time. Free afternoon for optional water activities.",
                    accommodation: "Parador Resort & Spa (or similar)"
                },
                {
                    day: 6,
                    title: "Beach Day & Relaxation",
                    description: "Full day at leisure to enjoy the beach and resort amenities. Optional activities: snorkeling, kayaking, or spa treatments. Farewell dinner with ocean views.",
                    accommodation: "Parador Resort & Spa (or similar)"
                },
                {
                    day: 7,
                    title: "Departure",
                    description: "Morning at leisure for last-minute shopping or beach time. Private transfer to San José airport for your departure flight. ¡Pura Vida!",
                    accommodation: null
                }
            ];
            
            // State for showing all days or just first 3
            const [showAllDays, setShowAllDays] = useState(false);
            const daysToShow = showAllDays ? itineraryDays.length : 3;
            
            // Tab state
            const [activeTab, setActiveTab] = useState('info');
            
            // Destinations included in this package
            const packageDestinations = [
                {
                    img: '/assets/img/destination/03.jpg',
                    location: 'Alajuela',
                    title: 'Arenal Volcano',
                    climate: '🌋 Volcano & Hot Springs',
                    days: 3
                },
                {
                    img: '/assets/img/destination/01.jpg',
                    location: 'Puntarenas',
                    title: 'Manuel Antonio',
                    climate: '🏖️ Beach & Wildlife',
                    days: 3
                },
                {
                    img: '/assets/img/destination/05.jpg',
                    location: 'Puntarenas',
                    title: 'Monteverde',
                    climate: '🌿 Cloud Forest',
                    days: 1
                }
            ];              

    return (
<section className="activities-details-section fix section-padding">
        <div className="container">
            <div className="activities-details-wrapper">
                <div className="row g-4 justify-content-center">
                    <div className="col-12 col-lg-8">
                        <div className="details-thumb">
                            <Image src="/assets/img/destails/tour-details.jpg" alt="img" width={856} height={510}   />
                            <ul className="image-list">
                                <li>
                                    <Image src="/assets/img/destails/tour-details-2.jpg" alt="img" width={173} height={110}   />
                                </li>
                                <li>
                                    <Image src="/assets/img/destails/tour-details-3.jpg" alt="img" width={173} height={110}   />
                                </li>
                                <li>
                                    <Image src="/assets/img/destails/tour-details-4.jpg" alt="img" width={173} height={110}   />
                                </li>
                            </ul>
                        </div>
                        <div className="activities-details-content">
                            {/* 1. DESCRIPCIÓN GENERAL */}
                            <h2 className="mb-3">Package Overview</h2>
                            <p>
                                Experience the best of Costa Rica with this carefully curated 7-day adventure package. 
                                From the majestic Arenal Volcano to the pristine beaches of Manuel Antonio, this journey 
                                combines natural wonders, thrilling activities, and ultimate relaxation. Perfect for couples, 
                                families, and adventure seekers looking to explore Costa Rica&apos;s diverse landscapes and 
                                rich biodiversity in comfort and style.
                            </p>
                            
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
                                    {/* 2. ITINERARIO DÍA POR DÍA - TIMELINE VERTICAL */}
                                    <div className="mt-5">
                                        <h3 className="mb-4">Your Travel Itinerary</h3>
                                        <div className="timeline-wrapper" style={{ position: 'relative', paddingLeft: '40px' }}>
                                            {/* Línea vertical */}
                                            <div style={{
                                                position: 'absolute',
                                                left: '15px',
                                                top: '10px',
                                                bottom: '10px',
                                                width: '2px',
                                                backgroundColor: '#e9ecef'
                                            }}></div>

                                            {itineraryDays.slice(0, daysToShow).map((dayItem, index) => {
                                                const isLastShown = index === daysToShow - 1;
                                                
                                                return (
                                                    <div 
                                                        key={index} 
                                                        className={`timeline-item ${!isLastShown ? 'mb-4' : ''}`} 
                                                        style={{ position: 'relative' }}
                                                    >
                                                        {/* Punto del timeline */}
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
                                                        
                                                        {/* Contenido del día */}
                                                        <div 
                                                            className="p-3" 
                                                            style={{ 
                                                                backgroundColor: '#f8f9fa', 
                                                                borderRadius: '8px', 
                                                                border: '1px solid #e9ecef'
                                                            }}
                                                        >
                                                            {/* Título del día */}
                                                            <h5 className="mb-2" style={{ color: 'var(--theme)', fontSize: '16px', fontWeight: '700' }}>
                                                                Day {dayItem.day}: {dayItem.title}
                                                            </h5>
                                                            
                                                            {/* Descripción */}
                                                            <p className="mb-2" style={{ fontSize: '14px', color: '#555' }}>
                                                                {dayItem.description}
                                                            </p>
                                                            
                                                            {/* Alojamiento (si existe) */}
                                                            {dayItem.accommodation && (
                                                                <div 
                                                                    className="d-flex align-items-center gap-2" 
                                                                    style={{ fontSize: '13px', color: '#666' }}
                                                                >
                                                                    <i className="bi bi-house-door-fill" style={{ color: 'var(--theme)' }}></i>
                                                                    <span><strong>Accommodation:</strong> {dayItem.accommodation}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        
                                        {/* Botón para mostrar todos los días */}
                                        {!showAllDays && itineraryDays.length > 3 && (
                                            <div className="text-center mt-4">
                                                <button 
                                                    onClick={() => setShowAllDays(true)}
                                                    className="theme-btn"
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '8px'
                                                    }}
                                                >
                                                    Show All {itineraryDays.length} Days
                                                    <i className="bi bi-chevron-down"></i>
                                                </button>
                                            </div>
                                        )}
                                        
                                        {/* Botón para colapsar */}
                                        {showAllDays && (
                                            <div className="text-center mt-4">
                                                <button 
                                                    onClick={() => setShowAllDays(false)}
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

                                    {/* 3. WHAT'S INCLUDED - EXPANDIDA */}
                                    <div className="mt-5">
                                        <h3 className="mb-4">What&apos;s Included</h3>
                                        <div className="row g-3">
                                            {[
                                                { icon: 'bi-house-door-fill', label: '6 Nights Hotel', description: '4-star accommodations' },
                                                { icon: 'bi-bus-front-fill', label: 'Private Transfers', description: 'Airport & between destinations' },
                                                { icon: 'bi-cup-hot-fill', label: 'Daily Breakfast', description: 'All mornings included' },
                                                { icon: 'bi-ticket-perforated-fill', label: 'Tours & Activities', description: 'Entrance fees & guides' },
                                                { icon: 'bi-person-badge-fill', label: 'Bilingual Guides', description: 'Expert local knowledge' },
                                                { icon: 'bi-shield-check', label: 'Travel Insurance', description: 'Basic coverage included' },
                                                { icon: 'bi-headset', label: '24/7 Support', description: 'Emergency assistance' },
                                                { icon: 'bi-receipt', label: 'Hotel Taxes', description: 'All taxes included' }
                                            ].map((item, index) => (
                                                <div key={index} className="col-6 col-md-3">
                                                    <div className="text-center p-3" style={{
                                                        backgroundColor: '#f8f9fa',
                                                        borderRadius: '12px',
                                                        border: '1px solid #e9ecef',
                                                        transition: 'all 0.3s ease',
                                                        height: '100%'
                                                    }}>
                                                        <div className="mb-2">
                                                            <i className={`bi ${item.icon}`} style={{ fontSize: '32px', color: 'var(--theme)' }}></i>
                                                        </div>
                                                        <h6 className="mb-1 fw-bold" style={{ fontSize: '14px', color: '#2f2f2f' }}>
                                                            {item.label}
                                                        </h6>
                                                        <p className="mb-0" style={{ fontSize: '12px', color: '#666' }}>
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 4. WHAT'S NOT INCLUDED */}
                                    <div className="mt-5">
                                        <h3 className="mb-4">What&apos;s Not Included</h3>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <ul className="list-unstyled">
                                                    <li className="mb-2 d-flex align-items-start">
                                                        <i className="bi bi-x-circle me-2" style={{ color: '#999', fontSize: '18px', marginTop: '2px' }}></i>
                                                        <span style={{ fontSize: '14px', color: '#555' }}>International flights to/from Costa Rica</span>
                                                    </li>
                                                    <li className="mb-2 d-flex align-items-start">
                                                        <i className="bi bi-x-circle me-2" style={{ color: '#999', fontSize: '18px', marginTop: '2px' }}></i>
                                                        <span style={{ fontSize: '14px', color: '#555' }}>Meals not mentioned in the itinerary</span>
                                                    </li>
                                                    <li className="mb-2 d-flex align-items-start">
                                                        <i className="bi bi-x-circle me-2" style={{ color: '#999', fontSize: '18px', marginTop: '2px' }}></i>
                                                        <span style={{ fontSize: '14px', color: '#555' }}>Alcoholic beverages</span>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="col-md-6">
                                                <ul className="list-unstyled">
                                                    <li className="mb-2 d-flex align-items-start">
                                                        <i className="bi bi-x-circle me-2" style={{ color: '#999', fontSize: '18px', marginTop: '2px' }}></i>
                                                        <span style={{ fontSize: '14px', color: '#555' }}>Tips for guides and drivers</span>
                                                    </li>
                                                    <li className="mb-2 d-flex align-items-start">
                                                        <i className="bi bi-x-circle me-2" style={{ color: '#999', fontSize: '18px', marginTop: '2px' }}></i>
                                                        <span style={{ fontSize: '14px', color: '#555' }}>Personal expenses and souvenirs</span>
                                                    </li>
                                                    <li className="mb-2 d-flex align-items-start">
                                                        <i className="bi bi-x-circle me-2" style={{ color: '#999', fontSize: '18px', marginTop: '2px' }}></i>
                                                        <span style={{ fontSize: '14px', color: '#555' }}>Optional activities not listed</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* 5. MAPA DEL DESTINO */}
                                    <div className="map-area mt-5">
                                        <h3>Your Costa Rica Route</h3>
                                        <div className="google-map">
                                            <iframe
                                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6678.7619084840835!2d144.9618311901502!3d-37.81450084255415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642b4758afc1d%3A0x3119cc820fdfc62e!2sEnvato!5e0!3m2!1sen!2sbd!4v1641984054261!5m2!1sen!2sbd"
                                                 loading="lazy"></iframe>
                                        </div>
                                        <div className="mt-4 text-center">
                                            <Link href="/destination/destination-details" className="theme-btn">
                                                <i className="bi bi-geo-alt-fill me-2"></i>
                                                Discover More About Costa Rica
                                                <i className="bi bi-arrow-right ms-2"></i>
                                            </Link>
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
                                                <ModernDestinationCard
                                                    img={destination.img}
                                                    location={destination.location}
                                                    title={destination.title}
                                                    climate={destination.climate}
                                                    stat1={{
                                                        icon: 'bi-calendar-check',
                                                        number: destination.days,
                                                        label: 'Days'
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}


                        </div>
                    </div>
                    <div className="col-12 col-lg-4">
                        <PackageBookingWidget 
                            packageDuration={7}
                            adultPrice={1200}
                            childPrice={800}
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>
    );
};

export default TourPackageDetails;
