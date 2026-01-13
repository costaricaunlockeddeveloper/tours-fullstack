"use client"
import React, { useState } from 'react';

const BookingWidget = () => {
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [pickupLocation, setPickupLocation] = useState('');
    const [showOtherInput, setShowOtherInput] = useState(false);

    // Pricing
    const adultPrice = 65;
    const childPrice = 35;
    const totalPrice = (adults * adultPrice) + (children * childPrice);

    // Available times (this will be dynamic from TOUR_SESSION)
    const availableTimes = ['08:00 AM', '02:00 PM'];

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

    const handlePickupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setPickupLocation(value);
        setShowOtherInput(value === 'other');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Create BOOKING record and redirect to Lemon Squeezy
        console.log({
            date: selectedDate,
            time: selectedTime,
            adults,
            children,
            pickupLocation,
            totalPrice
        });
    };

    return (
        <div className="main-bar" style={{ position: 'sticky', zIndex: 10 }}>
            <div className="main-sideber">
                <div className="single-sidebar-widget">
                    <div className="wid-title">
                        <h4>Book Your Tour</h4>
                    </div>
                    <div className="desti-booking-form">
                        <form onSubmit={handleSubmit} id="booking-form">
                            <div className="row g-4">
                                
                                {/* Step 1: Date Selection */}
                                <div className="col-lg-12">
                                    <div className="position-relative">
                                        <div 
                                            className="form-control d-flex align-items-center"
                                            style={{ 
                                                cursor: 'pointer',
                                                minHeight: '48px',
                                                position: 'relative'
                                            }}
                                            onClick={() => (document.getElementById('tour-date') as HTMLInputElement)?.showPicker?.()}
                                        >
                                            <i className="bi bi-calendar3 me-2" style={{ fontSize: '18px', color: 'var(--theme)' }}></i>
                                            <span className={selectedDate ? 'fw-bold' : 'text-muted'}>
                                                {selectedDate 
                                                    ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { 
                                                        month: 'short', 
                                                        day: 'numeric', 
                                                        year: 'numeric' 
                                                    })
                                                    : 'Select date'
                                                }
                                            </span>
                                        </div>
                                        <input 
                                            type="date" 
                                            name="tour-date" 
                                            id="tour-date" 
                                            className="form-control"
                                            style={{ 
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                opacity: 0,
                                                cursor: 'pointer'
                                            }}
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Step 2: Time Selection */}
                                <div className="col-lg-12">
                                    <label className="form-label fw-bold mb-2">
                                        <i className="bi bi-clock me-2"></i>
                                        Select Time
                                    </label>
                                    <div className="d-flex gap-2 flex-wrap">
                                        {availableTimes.map((time) => (
                                            <button 
                                                key={time}
                                                type="button" 
                                                className={`btn flex-fill ${selectedTime === time ? 'btn-primary' : 'btn-outline-primary'}`}
                                                style={{ 
                                                    borderRadius: '20px',
                                                    padding: '10px 20px',
                                                    fontSize: '14px',
                                                    fontWeight: selectedTime === time ? '600' : '400',
                                                    backgroundColor: selectedTime === time ? 'var(--theme)' : 'transparent',
                                                    color: selectedTime === time ? '#fff' : 'var(--theme)',
                                                    border: `2px solid ${selectedTime === time ? 'var(--theme)' : '#dee2e6'}`,
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onClick={() => setSelectedTime(time)}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Step 3: Passenger Selection */}
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
                                                ${adultPrice} per person
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
                                                ${childPrice} per child
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

                                {/* Step 4: Logistics */}
                                <div className="col-lg-12">
                                    <label className="form-label fw-bold mb-2">
                                        <i className="bi bi-geo-alt-fill me-2"></i>
                                        Meeting Point
                                    </label>

                                    {/* Meeting Point Information */}
                                    <div 
                                        className="p-3" 
                                        style={{ 
                                            backgroundColor: '#f8f9fa', 
                                            borderRadius: '8px',
                                            border: '1px solid #dee2e6'
                                        }}
                                    >
                                        <div className="d-flex align-items-start">
                                            <div className="flex-shrink-0">
                                                <div 
                                                    className="d-flex align-items-center justify-content-center"
                                                    style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        backgroundColor: '#EBF5FF',
                                                        borderRadius: '8px'
                                                    }}
                                                >
                                                    <i className="bi bi-pin-map-fill fs-5" style={{ color: 'var(--theme)' }}></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className="mb-1 fw-bold" style={{ fontSize: '15px' }}>
                                                    Parque Nacional Manuel Antonio
                                                </h6>
                                                <p className="text-muted mb-2" style={{ fontSize: '13px', lineHeight: '1.4' }}>
                                                    <i className="bi bi-geo-alt me-1"></i>
                                                    Av. Central, Quepos, Puntarenas, Costa Rica
                                                </p>
                                                <a 
                                                    href="https://www.google.com/maps/search/?api=1&query=Parque+Nacional+Manuel+Antonio" 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-decoration-none d-inline-flex align-items-center"
                                                    style={{ 
                                                        fontSize: '13px',
                                                        color: 'var(--theme)',
                                                        fontWeight: '500'
                                                    }}
                                                >
                                                    <i className="bi bi-map me-1"></i>
                                                    View on Google Maps
                                                    <i className="bi bi-box-arrow-up-right ms-1" style={{ fontSize: '10px' }}></i>
                                                </a>
                                            </div>
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
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span style={{ color: '#495057' }}>Adults ({adults} × ${adultPrice})</span>
                                            <span className="fw-semibold" style={{ color: '#2f2f2f' }}>${adults * adultPrice}</span>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span style={{ color: '#495057' }}>Children ({children} × ${childPrice})</span>
                                            <span className="fw-semibold" style={{ color: '#2f2f2f' }}>${children * childPrice}</span>
                                        </div>
                                        <hr style={{ borderColor: '#B8DAFF' }} />
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="fw-bold fs-5" style={{ color: '#2f2f2f' }}>Total</span>
                                            <span className="fw-bold fs-4" style={{ color: 'var(--theme)' }}>
                                                ${totalPrice} USD
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
                                        Book Now - ${totalPrice} USD
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

export default BookingWidget;
