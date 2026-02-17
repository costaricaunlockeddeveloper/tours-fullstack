"use client"
import React, { useState } from 'react';
import dayjs from 'dayjs';
import { TourDateEntry } from '@/services/api-service';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface BookingCalendarProps {
    availableDateSet: Set<string>;
    futureDates: TourDateEntry[];
    selectedDate: string;
    onSelectDate: (date: string) => void;
    spotsRemaining: number;
    selectedDateEntry?: TourDateEntry;
}

const BookingCalendar = ({ availableDateSet, futureDates, selectedDate, onSelectDate, spotsRemaining, selectedDateEntry }: BookingCalendarProps) => {
    const [currentMonth, setCurrentMonth] = useState(dayjs());

    if (futureDates.length === 0) {
        return (
            <div className="p-3 text-center" style={{ 
                backgroundColor: '#fff3cd', 
                borderRadius: '8px',
                border: '1px solid #ffc107'
            }}>
                <i className="bi bi-calendar-x fs-4 d-block mb-2" style={{ color: '#856404' }}></i>
                <span className="fw-semibold" style={{ color: '#856404' }}>No dates available</span>
                <p className="text-muted small mb-0 mt-1">Check back later for new dates</p>
            </div>
        );
    }

    return (
        <div style={{
            border: '1px solid #e9ecef',
            borderRadius: '12px',
            padding: '16px',
            backgroundColor: '#fff'
        }}>
            {/* Month Navigation */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button
                    type="button"
                    onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))}
                    className="btn btn-sm btn-outline-secondary"
                    style={{ borderRadius: '8px', padding: '4px 10px' }}
                >
                    <i className="bi bi-chevron-left"></i>
                </button>
                <span className="fw-bold" style={{ fontSize: '15px', textTransform: 'capitalize' }}>
                    {currentMonth.format('MMMM YYYY')}
                </span>
                <button
                    type="button"
                    onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))}
                    className="btn btn-sm btn-outline-secondary"
                    style={{ borderRadius: '8px', padding: '4px 10px' }}
                >
                    <i className="bi bi-chevron-right"></i>
                </button>
            </div>

            {/* Weekday Headers */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '2px',
                marginBottom: '4px',
                textAlign: 'center'
            }}>
                {WEEKDAYS.map((d) => (
                    <div key={d} style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#adb5bd',
                        padding: '4px 0'
                    }}>
                        {d}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '2px'
            }}>
                {/* Empty cells for offset */}
                {Array.from({ length: currentMonth.startOf('month').day() }).map((_, i) => (
                    <div key={`empty-${i}`} style={{ aspectRatio: '1' }}></div>
                ))}

                {/* Day cells */}
                {Array.from({ length: currentMonth.daysInMonth() }).map((_, i) => {
                    const date = currentMonth.date(i + 1);
                    const dateStr = date.format('YYYY-MM-DD');
                    const isAvailable = availableDateSet.has(dateStr);
                    const isPast = date.isBefore(dayjs(), 'day');
                    const isSelected = selectedDate === dateStr;
                    const dateEntry = futureDates.find(d => d.date === dateStr);
                    const isFull = dateEntry ? (dateEntry.maxQuota > 0 && dateEntry.enrolled >= dateEntry.maxQuota) : false;
                    const isToday = date.isSame(dayjs(), 'day');

                    return (
                        <button
                            key={dateStr}
                            type="button"
                            disabled={!isAvailable || isPast || isFull}
                            onClick={() => {
                                if (isAvailable && !isPast && !isFull) {
                                    onSelectDate(dateStr);
                                }
                            }}
                            style={{
                                aspectRatio: '1',
                                border: 'none',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '13px',
                                fontWeight: isSelected ? '700' : isAvailable ? '600' : '400',
                                cursor: isAvailable && !isPast && !isFull ? 'pointer' : 'default',
                                transition: 'all 0.2s ease',
                                backgroundColor: isSelected
                                    ? 'var(--theme)'
                                    : isAvailable && !isPast && !isFull
                                        ? '#EBF5FF'
                                        : 'transparent',
                                color: isSelected
                                    ? '#fff'
                                    : isPast
                                        ? '#d3d3d3'
                                        : isFull
                                            ? '#ccc'
                                            : isAvailable
                                                ? 'var(--theme)'
                                                : '#6c757d',
                                outline: isToday && !isSelected ? '2px solid var(--theme)' : 'none',
                                outlineOffset: '-2px',
                                textDecoration: isFull ? 'line-through' : 'none',
                                opacity: isPast ? 0.4 : 1,
                                position: 'relative'
                            }}
                        >
                            {i + 1}
                        </button>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="d-flex gap-3 mt-3 justify-content-center" style={{ fontSize: '11px' }}>
                <div className="d-flex align-items-center gap-1">
                    <span style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: '#EBF5FF',
                        border: '1px solid var(--theme)',
                        display: 'inline-block'
                    }}></span>
                    <span className="text-muted">Available</span>
                </div>
                <div className="d-flex align-items-center gap-1">
                    <span style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--theme)',
                        display: 'inline-block'
                    }}></span>
                    <span className="text-muted">Selected</span>
                </div>
            </div>

            {/* Spots remaining indicator */}
            {selectedDateEntry && spotsRemaining !== Infinity && (
                <div className="text-center mt-2">
                    <small style={{ 
                        color: spotsRemaining <= 3 ? '#dc3545' : '#6c757d',
                        fontWeight: spotsRemaining <= 3 ? '600' : '400'
                    }}>
                        <i className="bi bi-people-fill me-1"></i>
                        {spotsRemaining} spot{spotsRemaining !== 1 ? 's' : ''} remaining
                    </small>
                </div>
            )}
        </div>
    );
};

export default BookingCalendar;
