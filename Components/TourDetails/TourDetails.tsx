"use client"
import React, { useEffect, useRef, useState } from 'react';
import loadBackgroudImages from '../Common/loadBackgroudImages';
import Link from 'next/link';
import Image from 'next/image';
import BookingWidget from './BookingWidget';
import ChecklistItem from '../Common/ChecklistItem';

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
                            <h2 className="mb-3">Description</h2>
                            <p>
                                Consectetur adipisicing elit sed do eiusmod tempor is incididunt ut labore et dolore of
                                magna aliqua. ut enim ad minim veniam made of owl the quis nostrud exercitation ullamco
                                laboris nisi ut aliquip ex ea dolor commodo consequat duis aute irure and dolor in
                                reprehenderit.Nullam semper quam mauris nec mollis felis aliquam eu ut non gravida mi
                                quam mauris nec mollis felis aliquam phasellus.
                            </p>
                            
                            
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
                            
                            <div className="map-area mt-5">
                                <h3>Tu aventura en [Nombre Destination]</h3>
                                <div className="google-map">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6678.7619084840835!2d144.9618311901502!3d-37.81450084255415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642b4758afc1d%3A0x3119cc820fdfc62e!2sEnvato!5e0!3m2!1sen!2sbd!4v1641984054261!5m2!1sen!2sbd"
                                         loading="lazy"></iframe>
                                </div>
                                <div className="mt-4 text-center">
                                    <Link href="/destination/destination-details" className="theme-btn">
                                        <i className="bi bi-geo-alt-fill me-2"></i>
                                        Descubre más sobre este destino
                                        <i className="bi bi-arrow-right ms-2"></i>
                                    </Link>
                                </div>
                            </div>

                            <div className="faq-items">
                                <h3>Tour Plan</h3>
                                <div className="faq-accordion">
                                    <div className="accordion" id="accordion">

                                    {faqContent.map((item, index) => (                                        
                                        <div key={index} className={`accordion-item mb-3 ${index === openItemIndex ? "active" : "" }`} >
                                            <h5 onClick={() => handleItemClick(index)} className="accordion-header">
                                                <button className="accordion-button collapsed" type="button"
                                                    data-bs-toggle="collapse" data-bs-target="#faq1"
                                                    aria-expanded="true" aria-controls="faq1">
                                                    {item.title}
                                                </button>
                                            </h5>
                                            <div ref={accordionContentRef} id="faq1" className="accordion-collapse collapse"
                                                data-bs-parent="#accordion">
                                                <div className="accordion-body">
                                                    <p>
                                                    {item.content}
                                                    </p>
                                                    <div className="faq-image">
                                                        <Image src="/assets/img/destails/faq-img.jpg" alt="img" width={160} height={125}   />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        ))}


                                    </div>
                                </div>
                            </div>
                            
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