"use client"
import React, { useState } from 'react';

interface PackageBookingWidgetProps {
    adultPrice?: number; // Price per adult (default 1200)
    childPrice?: number; // Price per child (default 800)
}

const PackageBookingWidget = ({ 
    adultPrice = 1200,
    childPrice = 800
}: PackageBookingWidgetProps) => {
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    // Calculate nights for price summary if needed
    const getNights = () => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
        console.log({
            startDate,
            endDate,
            adults,
            children,
            totalPrice,
            nights: getNights()
        });
    };

    const minCheckoutDate = startDate 
        ? new Date(new Date(startDate + 'T00:00:00').getTime() + 86400000).toISOString().split('T')[0]
        : new Date(Date.now() + 172800000).toISOString().split('T')[0]; // At least 2 days from now if no start date

    return (
        <div className="main-bar" style={{ position: 'sticky', zIndex: 10 }}>
            <div className="main-sideber">
                <div className="single-sidebar-widget">
                    <div className="wid-title">
                        <h4>Book Your Package</h4>
                    </div>
                    <div className="desti-booking-form">
                        <form onSubmit={handleSubmit} id="package-booking-form">
                            <div className="row g-3">
                                
                                {/* Step 1: Check-in Date */}
                                <div className="col-lg-12">
                                    <label className="form-label fw-bold mb-1" style={{ fontSize: '13px', color: '#666' }}>
                                        Check-in
                                    </label>
                                    <div className="position-relative">
                                        <div 
                                            className="form-control d-flex align-items-center"
                                            style={{ 
                                                cursor: 'pointer',
                                                minHeight: '48px',
                                                position: 'relative',
                                                zIndex: 1
                                            }}
                                        >
                                            <i className="bi bi-calendar3 me-2" style={{ fontSize: '18px', color: 'var(--theme)' }}></i>
                                            <span className={startDate ? 'fw-bold' : 'text-muted'}>
                                                {startDate ? formatDate(startDate) : 'Select date'}
                                            </span>
                                        </div>
                                        <input 
                                            type="date" 
                                            name="package-start-date" 
                                            id="package-start-date" 
                                            className="form-control"
                                            style={{ 
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                opacity: 0,
                                                cursor: 'pointer',
                                                zIndex: 10
                                            }}
                                            value={startDate}
                                            onChange={(e) => {
                                                setStartDate(e.target.value);
                                                // If end date is before or same as new start date, reset it
                                                if (endDate && new Date(e.target.value) >= new Date(endDate)) {
                                                    setEndDate('');
                                                }
                                            }}
                                            onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                                            min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Step 2: Check-out Date */}
                                <div className="col-lg-12">
                                    <label className="form-label fw-bold mb-1" style={{ fontSize: '13px', color: '#666' }}>
                                        Check-out
                                    </label>
                                    <div className="position-relative">
                                        <div 
                                            className="form-control d-flex align-items-center"
                                            style={{ 
                                                cursor: 'pointer',
                                                minHeight: '48px',
                                                position: 'relative',
                                                zIndex: 1,
                                                backgroundColor: !startDate ? '#f8f9fa' : 'white'
                                            }}
                                        >
                                            <i className="bi bi-calendar-check me-2" style={{ fontSize: '18px', color: startDate ? 'var(--theme)' : '#ccc' }}></i>
                                            <span className={endDate ? 'fw-bold' : 'text-muted'}>
                                                {endDate ? formatDate(endDate) : 'Select date'}
                                            </span>
                                        </div>
                                        <input 
                                            type="date" 
                                            name="package-end-date" 
                                            id="package-end-date" 
                                            className="form-control"
                                            style={{ 
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                opacity: 0,
                                                cursor: 'pointer',
                                                zIndex: 10
                                            }}
                                            value={endDate}
                                            disabled={!startDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                                            min={minCheckoutDate}
                                            required
                                        />
                                    </div>
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
