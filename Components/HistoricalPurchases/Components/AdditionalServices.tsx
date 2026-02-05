"use client"
import React from 'react';

const AdditionalServices: React.FC = () => {
    const handleAddToCalendar = () => {
        // TODO: Implement calendar integration
        console.log('Add to calendar clicked');
    };

    const handleContactSupport = () => {
        // TODO: Implement WhatsApp integration
        const phoneNumber = '+50612345678'; // Replace with actual number
        const message = 'Hello, I need support with my booking.';
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <>
            <style jsx>{`
                .additional-services {
                    margin-top: 64px;
                    padding: 32px 0;
                }

                .services-title {
                    font-size: 24px;
                    font-weight: 700;
                    color: #1a1a1a;
                    margin-bottom: 24px;
                }

                .services-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 20px;
                }

                .service-card {
                    background: white;
                    border-radius: 16px;
                    padding: 24px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 2px solid transparent;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
                }

                .service-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
                    border-color: #1f4d85;
                }

                .service-icon {
                    width: 56px;
                    height: 56px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 26px;
                    flex-shrink: 0;
                    transition: all 0.3s ease;
                }

                .calendar-icon {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .whatsapp-icon {
                    background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
                    color: white;
                }

                .service-card:hover .service-icon {
                    transform: scale(1.1) rotate(5deg);
                }

                .service-content {
                    flex: 1;
                }

                .service-title {
                    font-size: 16px;
                    font-weight: 700;
                    color: #1a1a1a;
                    margin: 0 0 4px 0;
                }

                .service-description {
                    font-size: 13px;
                    color: #666;
                    margin: 0;
                }

                .service-arrow {
                    font-size: 20px;
                    color: #1f4d85;
                    transition: transform 0.3s ease;
                }

                .service-card:hover .service-arrow {
                    transform: translateX(4px);
                }

                @media (max-width: 768px) {
                    .services-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            <div className="additional-services">
                <h2 className="services-title">Additional Services</h2>
                <div className="services-grid">
                    <div className="service-card" onClick={handleAddToCalendar}>
                        <div className="service-icon calendar-icon">
                            <i className="bi bi-calendar-check"></i>
                        </div>
                        <div className="service-content">
                            <h3 className="service-title">Add to Calendar</h3>
                            <p className="service-description">Never miss your trip dates</p>
                        </div>
                        <i className="bi bi-arrow-right service-arrow"></i>
                    </div>

                    <div className="service-card" onClick={handleContactSupport}>
                        <div className="service-icon whatsapp-icon">
                            <i className="bi bi-whatsapp"></i>
                        </div>
                        <div className="service-content">
                            <h3 className="service-title">Contact Support via WhatsApp</h3>
                            <p className="service-description">Get instant help from our team</p>
                        </div>
                        <i className="bi bi-arrow-right service-arrow"></i>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdditionalServices;
