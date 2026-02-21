"use client"
import React, { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Tour, TourDateEntry, TourMeetingPoint } from '@/services/api-service';
import BookingCalendar from './BookingCalendar';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface BookingWidgetProps {
    tour: Tour;
    priceAdult: number;
    priceChild: number;
    availableDates: TourDateEntry[];
    defaultSchedules: string[];
    meetingPoint?: TourMeetingPoint;
}

const BookingWidget = ({ tour, priceAdult, priceChild, availableDates, defaultSchedules, meetingPoint }: BookingWidgetProps) => {
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    // Filter only future dates
    const futureDates = useMemo(() => {
        const today = dayjs().format('YYYY-MM-DD');
        return availableDates
            .filter(d => d.date >= today)
            .sort((a, b) => a.date.localeCompare(b.date));
    }, [availableDates]);

    // Set of available date strings for quick lookup
    const availableDateSet = useMemo(() => {
        return new Set(futureDates.map(d => d.date));
    }, [futureDates]);

    // Selected date entry
    const selectedDateEntry = useMemo(() => {
        return futureDates.find(d => d.date === selectedDate);
    }, [futureDates, selectedDate]);

    // Dynamic schedules: per-date schedules or fall back to defaults
    const currentSchedules = useMemo(() => {
        if (selectedDateEntry?.schedules?.length) return selectedDateEntry.schedules;
        return defaultSchedules;
    }, [selectedDateEntry, defaultSchedules]);

    // Dynamic pricing: per-date or fall back to default props
    const currentPriceAdult = selectedDateEntry?.price ?? priceAdult;
    const currentPriceChild = selectedDateEntry?.priceChild ?? priceChild;

    // Quota
    const maxQuota = selectedDateEntry?.maxQuota || 0;
    const enrolled = selectedDateEntry?.enrolled || 0;
    const spotsRemaining = maxQuota > 0 ? maxQuota - enrolled : Infinity;

    // Total
    const totalPrice = (adults * currentPriceAdult) + (children * currentPriceChild);

    const handleAdultsChange = (increment: boolean) => {
        if (increment) {
            if (adults + children < spotsRemaining) setAdults(adults + 1);
        } else if (adults > 1) {
            setAdults(adults - 1);
        }
    };

    const handleChildrenChange = (increment: boolean) => {
        if (increment) {
            if (adults + children < spotsRemaining) setChildren(children + 1);
        } else if (children > 0) {
            setChildren(children - 1);
        }
    };

    const [isLoading, setIsLoading] = useState(false);
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const handleSelectDate = (dateStr: string) => {
        setSelectedDate(dateStr);
        setSelectedTime('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (authLoading) return;

        if (!user) {
            router.push('/auth/signin?redirect=' + encodeURIComponent(window.location.pathname));
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/checkout_sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tourId: tour.id,
                    tourName: tour.name,
                    packageId: tour.slug, // Using slug as ID for compatibility with previous implementation logic
                    userId: user.uid || user.id || user.email,
                    userEmail: user.email,
                    userName: user.name || user.displayName,
                    date: selectedDate,
                    time: selectedTime,
                    adults,
                    children,
                    subtotal: totalPrice,
                    total: totalPrice,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                window.location.href = data.url;
            } else {
                console.error('Checkout failed:', data.error);
                alert('Checkout failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Build Google Maps link from meeting point data
    const getMeetingPointMapLink = () => {
        if (!meetingPoint) return '#';
        if (meetingPoint.coordinates) {
            return `https://www.google.com/maps/search/?api=1&query=${meetingPoint.coordinates.lat},${meetingPoint.coordinates.lng}`;
        }
        if (meetingPoint.link) return meetingPoint.link;
        if (meetingPoint.name) {
            return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(meetingPoint.name)}`;
        }
        return '#';
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

                                {/* Step 1: Calendar Date Selection */}
                                <div className="col-lg-12">
                                    <label className="form-label fw-bold mb-2">
                                        <i className="bi bi-calendar3 me-2"></i>
                                        Select Date
                                    </label>
                                    <BookingCalendar
                                        availableDateSet={availableDateSet}
                                        futureDates={futureDates}
                                        selectedDate={selectedDate}
                                        onSelectDate={handleSelectDate}
                                        spotsRemaining={spotsRemaining}
                                        selectedDateEntry={selectedDateEntry}
                                    />
                                </div>

                                {/* Step 2: Time Selection */}
                                {selectedDate && currentSchedules.length > 0 && (
                                    <div className="col-lg-12">
                                        <label className="form-label fw-bold mb-2">
                                            <i className="bi bi-clock me-2"></i>
                                            Select Time
                                        </label>
                                        <div className="d-flex gap-2 flex-wrap">
                                            {currentSchedules.map((time) => (
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
                                )}

                                {/* Step 3: Passenger Selection */}
                                <div className="col-lg-12">
                                    <label className="form-label fw-bold mb-2">
                                        <i className="bi bi-people me-2"></i>
                                        Passengers
                                    </label>

                                    {/* Adults Counter */}
                                    <div className="d-flex justify-content-between align-items-center mb-3 p-3"
                                        style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                                        <div>
                                            <div className="fw-semibold">Adults</div>
                                            <div className="fw-bold" style={{ color: '#2f2f2f', fontSize: '15px' }}>
                                                ${currentPriceAdult} per person
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center gap-3">
                                            <button type="button" className="btn btn-sm btn-outline-secondary"
                                                style={{ minWidth: '44px', minHeight: '44px', borderRadius: '50%', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                onClick={() => handleAdultsChange(false)} disabled={adults <= 1}>
                                                <i className="bi bi-dash" style={{ fontSize: '18px' }}></i>
                                            </button>
                                            <span className="fw-bold" style={{ minWidth: '24px', textAlign: 'center', fontSize: '16px' }}>{adults}</span>
                                            <button type="button" className="btn btn-sm btn-outline-secondary"
                                                style={{ minWidth: '44px', minHeight: '44px', borderRadius: '50%', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                onClick={() => handleAdultsChange(true)}
                                                disabled={spotsRemaining !== Infinity && adults + children >= spotsRemaining}>
                                                <i className="bi bi-plus" style={{ fontSize: '18px' }}></i>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Children Counter */}
                                    <div className="d-flex justify-content-between align-items-center p-3"
                                        style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                                        <div>
                                            <div className="fw-semibold">Children</div>
                                            <div className="fw-bold" style={{ color: '#2f2f2f', fontSize: '15px' }}>
                                                ${currentPriceChild} per child
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center gap-3">
                                            <button type="button" className="btn btn-sm btn-outline-secondary"
                                                style={{ minWidth: '44px', minHeight: '44px', borderRadius: '50%', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                onClick={() => handleChildrenChange(false)} disabled={children <= 0}>
                                                <i className="bi bi-dash" style={{ fontSize: '18px' }}></i>
                                            </button>
                                            <span className="fw-bold" style={{ minWidth: '24px', textAlign: 'center', fontSize: '16px' }}>{children}</span>
                                            <button type="button" className="btn btn-sm btn-outline-secondary"
                                                style={{ minWidth: '44px', minHeight: '44px', borderRadius: '50%', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                onClick={() => handleChildrenChange(true)}
                                                disabled={spotsRemaining !== Infinity && adults + children >= spotsRemaining}>
                                                <i className="bi bi-plus" style={{ fontSize: '18px' }}></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 4: Meeting Point (from DB) */}
                                {meetingPoint && (
                                    <div className="col-lg-12">
                                        <label className="form-label fw-bold mb-2">
                                            <i className="bi bi-geo-alt-fill me-2"></i>
                                            Meeting Point
                                        </label>
                                        <div className="p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                                            <div className="d-flex align-items-start">
                                                <div className="shrink-0">
                                                    <div className="d-flex align-items-center justify-content-center"
                                                        style={{ width: '40px', height: '40px', backgroundColor: '#EBF5FF', borderRadius: '8px' }}>
                                                        <i className="bi bi-pin-map-fill fs-5" style={{ color: 'var(--theme)' }}></i>
                                                    </div>
                                                </div>
                                                <div className="grow ms-3">
                                                    <h6 className="mb-1 fw-bold" style={{ fontSize: '15px' }}>
                                                        {meetingPoint.name || 'Meeting Point'}
                                                    </h6>
                                                    {meetingPoint.description && (
                                                        <p className="text-muted mb-2" style={{ fontSize: '13px', lineHeight: '1.4' }}>
                                                            <i className="bi bi-geo-alt me-1"></i>
                                                            {meetingPoint.description}
                                                        </p>
                                                    )}
                                                    <a href={getMeetingPointMapLink()} target="_blank" rel="noopener noreferrer"
                                                        className="text-decoration-none d-inline-flex align-items-center"
                                                        style={{ fontSize: '13px', color: 'var(--theme)', fontWeight: '500' }}>
                                                        <i className="bi bi-map me-1"></i>
                                                        View on Google Maps
                                                        <i className="bi bi-box-arrow-up-right ms-1" style={{ fontSize: '10px' }}></i>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Price Summary */}
                                <div className="col-lg-12">
                                    <div className="p-3" style={{ backgroundColor: '#EBF5FF', borderRadius: '8px', border: '1px solid #B8DAFF' }}>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span style={{ color: '#495057' }}>Adults ({adults} × ${currentPriceAdult})</span>
                                            <span className="fw-semibold" style={{ color: '#2f2f2f' }}>${adults * currentPriceAdult}</span>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span style={{ color: '#495057' }}>Children ({children} × ${currentPriceChild})</span>
                                            <span className="fw-semibold" style={{ color: '#2f2f2f' }}>${children * currentPriceChild}</span>
                                        </div>
                                        <hr style={{ borderColor: '#B8DAFF' }} />
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="fw-bold fs-5" style={{ color: '#2f2f2f' }}>Total</span>
                                            <span className="fw-bold fs-4" style={{ color: 'var(--theme)' }}>${totalPrice} USD</span>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <div className="col-lg-12">
                                    <button type="submit" className="theme-btn text-center w-100"
                                        style={{ padding: '15px', fontSize: '16px', fontWeight: 'bold' }}
                                        disabled={isLoading || authLoading || !selectedDate || !selectedTime || futureDates.length === 0}>
                                        {isLoading ? 'Processing...' : `Book Now - $${totalPrice} USD`}
                                        {!isLoading && <i className="bi bi-arrow-right ms-2"></i>}
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
