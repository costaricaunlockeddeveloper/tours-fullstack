"use client"
import React, { useEffect, useRef, useState } from 'react';
import loadBackgroudImages from '../Common/loadBackgroudImages';
import Link from 'next/link';
import Image from 'next/image';
import BookingWidget from './BookingWidget';
import ChecklistItem from '../Common/ChecklistItem';
import DestinationCard from '../Destination/DestinationCard';

interface TourDetailsProps {
    duration?: number;
}

const TourDetails = ({ duration = 8 }: TourDetailsProps) => {

            useEffect(() => {
                loadBackgroudImages();
            }, []);

            const faqContent = [
                {title:'How do I book a tour with your agency?', content:'Nullam faucibus eleifend mi eu varius. Integer vel tincidunt massa, quis semper odio.Mauris et mollis quam. Nullam fringilla erat id ante'},
                {title:' What payment methods do you accept?', content:'Nullam faucibus eleifend mi eu varius. Integer vel tincidunt massa, quis semper odio.Mauris et mollis quam. Nullam fringilla erat id ante'},
                {title:'Can I customize my travel itinerary?', content:'Nullam faucibus eleifend mi eu varius. Integer vel tincidunt massa, quis semper odio.Mauris et mollis quam. Nullam fringilla erat id ante'},
                {title:' What is your cancellation policy?', content:'Nullam faucibus eleifend mi eu varius. Integer vel tincidunt massa, quis semper odio.Mauris et mollis quam. Nullam fringilla erat id ante'},
              ]; 

       const accordionContentRef = useRef(null);
       const [openItemIndex, setOpenItemIndex] = useState(-1);
       const [firstItemOpen, setFirstItemOpen] = useState(true);
     
       const handleItemClick = (index:number) => {
         if (index === openItemIndex) {
           setOpenItemIndex(-1);
         } else {
           setOpenItemIndex(index);
         }
       };
       useEffect(() => {
         if (firstItemOpen) {
           setOpenItemIndex(0);
           setFirstItemOpen(false);
         }
       }, [firstItemOpen]);
       
       // Tab state
       const [activeTab, setActiveTab] = useState('info');
       
       // Related destinations for this tour
       const tourDestinations = [
           {
               img: '/assets/img/destination/03.jpg',
               location: 'Alajuela',
               title: 'Arenal Volcano',
               climate: 'Volcano & Hot Springs',
               tours: 20,
               packages: 12
           },
           {
               img: '/assets/img/destination/01.jpg',
               location: 'Puntarenas',
               title: 'Manuel Antonio',
               climate: 'Beach & Wildlife',
               tours: 12,
               packages: 8
           },
           {
               img: '/assets/img/destination/02.jpg',
               location: 'Puntarenas',
               title: 'Monteverde',
               climate: 'Cloud Forest',
               tours: 18,
               packages: 14
           }
       ];              

    return (
<section className="activities-details-section fix section-padding">
        <div className="container">
            <div className="activities-details-wrapper">
                <div className="row g-4 justify-content-center flex-row-reverse">
                    <div className="col-12 col-lg-4">
                        <BookingWidget />
                    </div>
                    <div className="col-12 col-lg-8">
                        <div className="activities-details-content">
                            
                            {/* Key Info Section */}
                            <div className="tour-key-info mb-4 p-4 rounded-3 border bg-white shadow-sm">
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <div className="d-flex align-items-start gap-3">
                                            <div className="icon-wrapper d-flex align-items-center justify-content-center bg-success-subtle rounded-circle p-2" style={{width: '40px', height: '40px'}}>
                                                <i className="bi bi-check-lg text-success fs-5"></i>
                                            </div>
                                            <div>
                                                <h6 className="mb-1 fw-bold">Free Cancellation</h6>
                                                <p className="mb-0 text-muted small">Cancel up to 24 hours in advance for a full refund</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="d-flex align-items-start gap-3">
                                            <div className="icon-wrapper d-flex align-items-center justify-content-center bg-primary-subtle rounded-circle p-2" style={{width: '40px', height: '40px'}}>
                                                <i className="bi bi-clock text-primary fs-5"></i>
                                            </div>
                                            <div>
                                                <h6 className="mb-1 fw-bold">Duration</h6>
                                                <p className="mb-0 text-muted small">{duration} {duration === 1 ? 'Hour' : 'Hours'}</p>
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
                                    <div className="mb-5">
                                        <h3 className="mb-4">What to bring</h3>
                                        <div className="row g-3">
                                            {[
                                                "Sunscreen & Insect Repellent",
                                                "Light Rain Jacket",
                                                "Comfortable Walking Shoes",
                                                "Hat & Sunglasses",
                                                "Reusable Water Bottle",
                                                "Binoculars (Optional)",
                                                "Camera or Smartphone",
                                                "Small Backpack"
                                            ].map((item, index) => (
                                                <div key={index} className="col-md-6 col-12">
                                                    <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ backgroundColor: '#f9f9f9' }}>
                                                        <i className="bi bi-check-circle-fill text-success fs-5"></i>
                                                        <span className="fw-medium text-dark">{item}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <div className="row g-4">
                                            {/* Included Column */}
                                            <div className="col-md-6">
                                                <h3 className="mb-4">What&apos;s Included</h3>
                                                <ul className="list-unstyled d-flex flex-column gap-3">
                                                    {[
                                                        "Round-trip transportation starting from your hotel",
                                                        "Bilingual certified naturalist guide",
                                                        "Delicious typical Costa Rican lunch",
                                                        "Refreshments and bottled water",
                                                        "All entrance fees to the National Park",
                                                        "Professional equipment for activities"
                                                    ].map((item, index) => (
                                                        <li key={index} className="d-flex align-items-start gap-3">
                                                            <i className="bi bi-check-lg fs-5 text-success mt-1"></i>
                                                            <span className="text-secondary" style={{ fontSize: '16px', lineHeight: '1.6' }}>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Not Included Column */}
                                            <div className="col-md-6">
                                                <h3 className="mb-4">What's Not Included</h3>
                                                <ul className="list-unstyled d-flex flex-column gap-3">
                                                    {[
                                                        "Tips for the guide and driver",
                                                        "Alcoholic beverages",
                                                        "Souvenirs and personal expenses",
                                                        "Additional optional activities not listed"
                                                    ].map((item, index) => (
                                                        <li key={index} className="d-flex align-items-start gap-3">
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
                                            
                                            {/* Stop 1 */}
                                            <div className="d-flex gap-3 position-relative pb-5">
                                                {/* Line Connector */}
                                                <div className="position-absolute" style={{ 
                                                    left: '11px', 
                                                    top: '40px', 
                                                    bottom: '0', 
                                                    width: '2px', 
                                                    borderLeft: '2px dashed #dee2e6' 
                                                }}></div>

                                                <div className="shrink-0 mt-1">
                                                     <i className="bi bi-geo-alt fs-4 text-dark" style={{ lineHeight: 1 }}></i>
                                                </div>
                                                <div className="grow">
                                                    <h5 className="mb-2 fw-bold">Tarcoles River Bridge</h5>
                                                    <p className="text-secondary mb-2">
                                                        A quick stop at the famous "Crocodile Bridge" to observe massive American crocodiles in their natural habitat from a safe distance. Great photo opportunity!
                                                    </p>
                                                    <div className="d-flex align-items-center gap-2 text-secondary small fw-medium">
                                                        <i className="bi bi-hourglass-split"></i>
                                                        <span>Duration: 20 minutes</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Stop 2 */}
                                            <div className="d-flex gap-3 position-relative pb-5">
                                                {/* Line Connector */}
                                                 <div className="position-absolute" style={{ 
                                                    left: '11px', 
                                                    top: '40px', 
                                                    bottom: '0', 
                                                    width: '2px', 
                                                    borderLeft: '2px dashed #dee2e6' 
                                                }}></div>

                                                <div className="shrink-0 mt-1">
                                                     <i className="bi bi-geo-alt fs-4 text-dark" style={{ lineHeight: 1 }}></i>
                                                </div>
                                                <div className="grow">
                                                    <h5 className="mb-2 fw-bold">Manuel Antonio National Park</h5>
                                                    <p className="text-secondary mb-2">
                                                        Explore the pristine trails of the national park, spotting monkeys, sloths, and exotic birds. The trail leads to stunning white sand beaches where you can relax and swim.
                                                    </p>
                                                    <div className="d-flex align-items-center gap-2 text-secondary small fw-medium">
                                                        <i className="bi bi-hourglass-split"></i>
                                                        <span>Duration: 4 hours</span>
                                                    </div>
                                                </div>
                                            </div>

                                             {/* Stop 3 - End */}
                                             <div className="d-flex gap-3 position-relative">
                                                <div className="shrink-0 mt-1">
                                                     <i className="bi bi-geo-alt fs-4 text-dark" style={{ lineHeight: 1 }}></i>
                                                </div>
                                                <div className="grow">
                                                    <h5 className="mb-2 fw-bold">Return to Hotel</h5>
                                                    <p className="text-secondary mb-2">
                                                        Relax on the comfortable drive back to your hotel after a day of adventure.
                                                    </p>
                                                    <div className="d-flex align-items-center gap-2 text-secondary small fw-medium">
                                                        <i className="bi bi-hourglass-split"></i>
                                                        <span>Duration: 2 hours</span>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    {/* Meeting Point Section */}
                                    <div className="mt-5">
                                        <h3 className="mb-4">Meeting Point</h3>
                                        <div className="rounded-4 overflow-hidden mb-4" style={{ height: '450px', width: '100%' }}>
                                            <iframe 
                                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6678.7619084840835!2d144.9618311901502!3d-37.81450084255415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642b4758afc1d%3A0x3119cc820fdfc62e!2sEnvato!5e0!3m2!1sen!2sbd!4v1641984054261!5m2!1sen!2sbd" 
                                                width="100%" 
                                                height="100%" 
                                                style={{ border: 0 }} 
                                                allowFullScreen={true} 
                                                loading="lazy" 
                                                referrerPolicy="no-referrer-when-downgrade"
                                            ></iframe>
                                        </div>
                                        <div className="d-flex gap-3">
                                            <div className="shrink-0 mt-1">
                                                <i className="bi bi-geo-alt fs-4 text-dark"></i>
                                            </div>
                                            <div>
                                                <h5 className="mb-2 fw-bold">Pickup Point</h5>
                                                <p className="text-secondary mb-3" style={{ lineHeight: '1.6' }}>
                                                    We offer round-trip transportation from most hotels in the Manuel Antonio and Quepos area. 
                                                    Please indicate your hotel or accommodation when booking. The exact pickup time will be confirmed 
                                                    via email or WhatsApp the day before your tour, typically between 7:00 AM and 7:30 AM depending on your location. 
                                                    If your hotel is outside the pickup zone, we will coordinate a convenient meeting point.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                </>
                            )}

                            {/* TAB CONTENT: DESTINATIONS */}
                            {activeTab === 'destinations' && (
                                <div className="mt-4">
                                    <h3 className="mb-4">Related Destinations</h3>
                                    <div className="row g-4">
                                        {tourDestinations.map((destination, index) => (
                                            <div key={index} className="col-lg-4 col-md-6">
                                                <DestinationCard
                                                    img={destination.img}
                                                    location={destination.location}
                                                    title={destination.title}
                                                    climate={destination.climate}
                                                    tours={destination.tours}
                                                    packages={destination.packages}
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