"use client"
import React, { useEffect, useRef, useState } from 'react';
import loadBackgroudImages from '../Common/loadBackgroudImages';
import Link from 'next/link';
import Image from 'next/image';
import BookingWidget from './BookingWidget';
import ChecklistItem from '../Common/ChecklistItem';
import ModernDestinationCard from '../Card/ModernDestinationCard';

const TourDetails = () => {

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
               climate: '🌋 Volcano & Hot Springs',
               tours: 20,
               packages: 12
           },
           {
               img: '/assets/img/destination/01.jpg',
               location: 'Puntarenas',
               title: 'Manuel Antonio',
               climate: '🏖️ Beach & Wildlife',
               tours: 12,
               packages: 8
           },
           {
               img: '/assets/img/destination/02.jpg',
               location: 'Puntarenas',
               title: 'Monteverde',
               climate: '🌿 Cloud Forest',
               tours: 18,
               packages: 14
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
                            <h2 className="mb-3">Tour Overview</h2>
                            <p>
                                Consectetur adipisicing elit sed do eiusmod tempor is incididunt ut labore et dolore of
                                magna aliqua. ut enim ad minim veniam made of owl the quis nostrud exercitation ullamco
                                laboris nisi ut aliquip ex ea dolor commodo consequat duis aute irure and dolor in
                                reprehenderit.Nullam semper quam mauris nec mollis felis aliquam eu ut non gravida mi
                                quam mauris nec mollis felis aliquam phasellus.
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
                                    <div className="activities-list-item">
                                        <h3>What to bring</h3>
                                        <div className="activities-item">
                                            <ul className="activities-list">
                                                <ChecklistItem text="Sunscreen & Insect Repellent" />
                                                <ChecklistItem text="Comfortable Walking Shoes" />
                                                <ChecklistItem text="Reusable Water Bottle" />
                                                <ChecklistItem text="Camera or Smartphone" />
                                            </ul>
                                             <ul className="activities-list">
                                                <ChecklistItem text="Light Rain Jacket" />
                                                <ChecklistItem text="Hat & Sunglasses" />
                                                <ChecklistItem text="Binoculars (Optional)" />
                                                <ChecklistItem text="Small Backpack" />
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <h3 className="mb-4">What&apos;s Included</h3>
                                        <div className="row g-3">
                                            {[
                                                { icon: 'bi-bus-front', label: 'Transport' },
                                                { icon: 'bi-person-badge', label: 'Bilingual Guide' },
                                                { icon: 'bi-cup-hot', label: 'Lunch' },
                                                { icon: 'bi-droplet-fill', label: 'Water' },
                                                { icon: 'bi-ticket-perforated', label: 'Park Entry' },
                                                { icon: 'bi-life-preserver', label: 'Equipment' },
                                                { icon: 'bi-box2-heart', label: 'Snacks' },
                                                { icon: 'bi-camera', label: 'Photos' }
                                            ].map((item, index) => (
                                                <div key={index} className="col-6 col-md-3">
                                                    <div className="text-center p-3" style={{
                                                        backgroundColor: '#f8f9fa',
                                                        borderRadius: '12px',
                                                        border: '1px solid #e9ecef',
                                                        transition: 'all 0.3s ease'
                                                    }}>
                                                        <div className="mb-2">
                                                            <i className={`bi ${item.icon}`} style={{ fontSize: '32px', color: 'var(--theme)' }}></i>
                                                        </div>
                                                        <h6 className="mb-0 fw-bold" style={{ fontSize: '14px', color: '#2f2f2f' }}>
                                                            {item.label}
                                                        </h6>
                                                    </div>
                                                </div>
                                            ))}
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
                                                <ModernDestinationCard
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
                    <div className="col-12 col-lg-4">
                        <BookingWidget />
                    </div>
                </div>
            </div>
        </div>
    </section>
    );
};

export default TourDetails;