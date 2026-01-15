"use client"
import React, { useState } from 'react';

interface PackageBookingWidgetProps {
    packageDuration?: number; // Duration in days (default 7)
    adultPrice?: number; // Price per adult (default 1200)
    childPrice?: number; // Price per child (default 800)
}

const PackageBookingWidget = ({ 
    packageDuration = 7,
    adultPrice = 1200,
    childPrice = 800
}: PackageBookingWidgetProps) => {
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [selectedDate, setSelectedDate] = useState('');

    // Calculate end date based on start date and duration
    const getEndDate = (startDate: string): Date | null => {
        if (!startDate) return null;
        const start = new Date(startDate + 'T00:00:00');
        const end = new Date(start);
        end.setDate(end.getDate() + packageDuration - 1); // -1 because we count the start day
        return end;
    };

    const formatDateRange = (startDate: string) => {
        if (!startDate) return '';
        const start = new Date(startDate + 'T00:00:00');
        const end = getEndDate(startDate);
        
        if (!end) return '';
        
        const startFormatted = start.toLocaleDateString('en-US', { 
            day: 'numeric', 
            month: 'short' 
        });
        const endFormatted = end.toLocaleDateString('en-US', { 
            day: 'numeric', 
            month: 'short' 
        });
        
        return `${startFormatted} - ${endFormatted} (${packageDuration} Days)`;
    };

    // Pricing
    const totalPrice = (adults * adultPrice) + (children * childPrice);

    const handleAdultsChange = (increment: boolean) => {
        if (increment) {
            setAdults(adults + 1);
        } else if (adults > 1) {
            setAdults(adults - 1);
        }
    };

    const handleChildrenChange = (increment: boolean) => {
        if (increment) {
            setChildren(children + 1);
        } else if (children > 0) {
            setChildren(children - 1);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Create PACKAGE_BOOKING record and redirect to Lemon Squeezy
        console.log({
            startDate: selectedDate,
            endDate: getEndDate(selectedDate),
            adults,
            children,
            totalPrice,
            duration: packageDuration
        });
    };

    return (
        <div className="main-bar" style={{ position: 'sticky', zIndex: 10 }}>
            <div className="main-sideber">
                <div className="single-sidebar-widget">
                    <div className="wid-title">
                        <h4>Book Your Package</h4>
                    </div>
                    <div className="desti-booking-form">
                        <form onSubmit={handleSubmit} id="package-booking-form">
                            <div className="row g-4">
                                
                                {/* Step 1: Start Date Selection */}
                                <div className="col-lg-12">
                                    <div className="position-relative">
                                        <i 
                                            className="bi bi-calendar3" 
                                            style={{ 
                                                position: 'absolute',
                                                left: '12px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                fontSize: '18px',
                                                color: 'var(--theme)',
                                                pointerEvents: 'none',
                                                zIndex: 1
                                            }}
                                        ></i>
                                        <input 
                                            type="date" 
                                            name="package-start-date" 
                                            id="package-start-date" 
                                            className="form-control"
                                            style={{ 
                                                paddingLeft: '40px',
                                                minHeight: '48px',
                                                cursor: 'pointer'
                                            }}
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            placeholder="Select start date"
                                            required
                                        />
                                    </div>
                                    
                                    {/* Trip Duration Display */}
                                    {selectedDate && (
                                        <div 
                                            className="mt-3 p-3 text-center" 
                                            style={{ 
                                                backgroundColor: '#EBF5FF', 
                                                borderRadius: '8px',
                                                border: '1px solid #B8DAFF'
                                            }}
                                        >
                                            <div className="text-muted mb-1" style={{ fontSize: '13px' }}>
                                                <i className="bi bi-calendar-check me-1"></i>
                                                Your trip
                                            </div>
                                            <div className="fw-bold" style={{ color: 'var(--theme)', fontSize: '15px' }}>
                                                {formatDateRange(selectedDate)}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Step 2: Passenger Selection */}
                                <div className="col-lg-12">
                                    <label className="form-label fw-bold mb-2">
                                        <i className="bi bi-people me-2"></i>
                                        Passengers
                                    </label>
                                    
                                    {/* Adults Counter */}
                                    <div className="d-flex justify-content-between align-items-center mb-3 p-3" 
                                         style={{ 
                                             backgroundColor: '#f8f9fa', 
                                             borderRadius: '8px' 
                                         }}>
                                        <div>
                                            <div className="fw-semibold">Adults</div>
                                            <div className="fw-bold" style={{ color: '#2f2f2f', fontSize: '15px' }}>
                                                ${adultPrice.toLocaleString()} per person
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center gap-3">
                                            <button 
                                                type="button" 
                                                className="btn btn-sm btn-outline-secondary"
                                                style={{ 
                                                    minWidth: '44px', 
                                                    minHeight: '44px',
                                                    borderRadius: '50%',
                                                    padding: '0',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                onClick={() => handleAdultsChange(false)}
                                                disabled={adults <= 1}
                                            >
                                                <i className="bi bi-dash" style={{ fontSize: '18px' }}></i>
                                            </button>
                                            <span className="fw-bold" style={{ minWidth: '24px', textAlign: 'center', fontSize: '16px' }}>
                                                {adults}
                                            </span>
                                            <button 
                                                type="button" 
                                                className="btn btn-sm btn-outline-secondary"
                                                style={{ 
                                                    minWidth: '44px', 
                                                    minHeight: '44px',
                                                    borderRadius: '50%',
                                                    padding: '0',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                onClick={() => handleAdultsChange(true)}
                                            >
                                                <i className="bi bi-plus" style={{ fontSize: '18px' }}></i>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Children Counter */}
                                    <div className="d-flex justify-content-between align-items-center p-3" 
                                         style={{ 
                                             backgroundColor: '#f8f9fa', 
                                             borderRadius: '8px' 
                                         }}>
                                        <div>
                                            <div className="fw-semibold">Children</div>
                                            <div className="fw-bold" style={{ color: '#2f2f2f', fontSize: '15px' }}>
                                                ${childPrice.toLocaleString()} per child
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center gap-3">
                                            <button 
                                                type="button" 
                                                className="btn btn-sm btn-outline-secondary"
                                                style={{ 
                                                    minWidth: '44px', 
                                                    minHeight: '44px',
                                                    borderRadius: '50%',
                                                    padding: '0',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                onClick={() => handleChildrenChange(false)}
                                                disabled={children <= 0}
                                            >
                                                <i className="bi bi-dash" style={{ fontSize: '18px' }}></i>
                                            </button>
                                            <span className="fw-bold" style={{ minWidth: '24px', textAlign: 'center', fontSize: '16px' }}>
                                                {children}
                                            </span>
                                            <button 
                                                type="button" 
                                                className="btn btn-sm btn-outline-secondary"
                                                style={{ 
                                                    minWidth: '44px', 
                                                    minHeight: '44px',
                                                    borderRadius: '50%',
                                                    padding: '0',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                onClick={() => handleChildrenChange(true)}
                                            >
                                                <i className="bi bi-plus" style={{ fontSize: '18px' }}></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Price Summary */}
                                <div className="col-lg-12">
                                    <div className="p-3" 
                                         style={{ 
                                             backgroundColor: '#EBF5FF', 
                                             borderRadius: '8px',
                                             border: '1px solid #B8DAFF'
                                         }}>
                                        {adults > 0 && (
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span style={{ color: '#495057' }}>Adults ({adults} × ${adultPrice.toLocaleString()})</span>
                                                <span className="fw-semibold" style={{ color: '#2f2f2f' }}>${(adults * adultPrice).toLocaleString()}</span>
                                            </div>
                                        )}
                                        {children > 0 && (
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span style={{ color: '#495057' }}>Children ({children} × ${childPrice.toLocaleString()})</span>
                                                <span className="fw-semibold" style={{ color: '#2f2f2f' }}>${(children * childPrice).toLocaleString()}</span>
                                            </div>
                                        )}
                                        <hr style={{ borderColor: '#B8DAFF' }} />
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="fw-bold fs-5" style={{ color: '#2f2f2f' }}>Total</span>
                                            <span className="fw-bold fs-4" style={{ color: 'var(--theme)' }}>
                                                ${totalPrice.toLocaleString()} USD
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <div className="col-lg-12">
                                    <button 
                                        type="submit" 
                                        className="theme-btn text-center w-100"
                                        style={{ 
                                            padding: '15px',
                                            fontSize: '16px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Book Now - ${totalPrice.toLocaleString()} USD
                                        <i className="bi bi-arrow-right ms-2"></i>
                                    </button>
                                    <small className="text-muted d-block text-center mt-2">
                                        <i className="bi bi-shield-check me-1"></i>
                                        Secure payment via Lemon Squeezy
                                    </small>
                                </div>
                            </div>
                        </form>
                    </div>
                </div> 
            </div>
        </div>
    );
};

export default PackageBookingWidget;
