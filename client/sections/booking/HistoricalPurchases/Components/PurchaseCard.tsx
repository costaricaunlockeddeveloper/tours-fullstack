"use client"
import React, { useState } from 'react';

export type PurchaseStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';
export type PurchaseType = 'tour' | 'tour_package';

export interface PurchaseCardProps {
    id: string;
    type: PurchaseType;
    image: string;
    title: string;
    location: string;
    date: string;
    selectedTime?: string;
    endDate?: string;
    adults: number;
    children?: number;
    status: PurchaseStatus;
    price: number;
    meetingPointUrl?: string;
    whatsappNumber?: string;
    onViewDetails?: () => void;
    onDownloadReceipt?: () => void;
    onRequestRefund?: () => void;
}

const PurchaseCard: React.FC<PurchaseCardProps> = ({
    type,
    image,
    title,
    location,
    date,
    selectedTime,
    endDate,
    adults,
    children,
    status,
    price,
    meetingPointUrl,
    whatsappNumber,
    onViewDetails,
    onDownloadReceipt,
    onRequestRefund
}) => {
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);

    const getStatusColor = (status: PurchaseStatus) => {
        switch (status) {
            case 'confirmed':
                return '#10b981';
            case 'pending':
                return '#f59e0b';
            case 'completed':
                return '#3b82f6';
            case 'cancelled':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    const getStatusLabel = (status: PurchaseStatus) => {
        return status.toUpperCase();
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const formatPrice = (price: number) => {
        return `US$${price.toFixed(2)}`;
    };

    const handleWhatsAppClick = () => {
        if (whatsappNumber) {
            window.open(`https://wa.me/${whatsappNumber}`, '_blank');
        }
    };

    const handleMeetingPointClick = () => {
        if (meetingPointUrl) {
            window.open(meetingPointUrl, '_blank');
        }
    };

    return (
        <>
            <style jsx>{`
                .purchase-card {
                    background: white;
                    border-radius: 16px;
                    padding: 20px;
                    display: flex;
                    gap: 20px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
                    border: 1px solid #f0f0f0;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }

                .purchase-card:hover {
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                    transform: translateY(-2px);
                }

                .image-container {
                    position: relative;
                    width: 200px;
                    flex-shrink: 0;
                    border-radius: 12px;
                    overflow: hidden;
                    background-image: url('${image}');
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                }

                .type-badge {
                    position: absolute;
                    top: 12px;
                    left: 12px;
                    background: white;
                    padding: 6px 12px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 11px;
                    font-weight: 600;
                    color: #1f4d85;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
                    z-index: 10;
                }

                .card-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    min-height: 0;
                }

                .status-badge {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    padding: 8px 18px;
                    border-radius: 8px;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                    color: white;
                    background-color: ${getStatusColor(status)};
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
                }

                .card-header {
                    padding-right: 120px;
                    margin-bottom: 8px;
                }

                .card-title {
                    font-size: 20px;
                    font-weight: 700;
                    color: #1a1a1a;
                    margin: 0;
                    line-height: 1.3;
                }

                .card-info {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    margin-bottom: ${type === 'tour_package' ? '8px' : '12px'};
                }

                .info-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                    font-size: 14px;
                    color: #666;
                    line-height: 1.4;
                }

                .info-icon {
                    color: #1f4d85;
                    font-size: 16px;
                    width: 18px;
                    flex-shrink: 0;
                    margin-top: 2px;
                }

                .quick-action {
                    padding: 0;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 13px;
                    color: #25d366;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    margin-bottom: 8px;
                    width: fit-content;
                }

                .quick-action:hover {
                    color: #1faa52;
                    text-decoration: underline;
                }

                .quick-action i {
                    font-size: 14px;
                }

                .quick-action-maps {
                    color: #4285f4;
                }

                .quick-action-maps:hover {
                    color: #3367d6;
                }

                .price-section {
                    margin-top: auto;
                    padding-top: 12px;
                    border-top: 1px solid #f0f0f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .price-container {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .price-label {
                    font-size: 12px;
                    color: #888;
                    font-weight: 500;
                }

                .price {
                    font-size: 28px;
                    font-weight: 800;
                    color: #1f4d85;
                    line-height: 1;
                }

                .card-actions {
                    display: flex;
                    gap: 10px;
                }

                .action-btn {
                    padding: 12px 20px;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 600;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    white-space: nowrap;
                }

                .btn-primary {
                    background: #1f4d85;
                    color: white;
                }

                .btn-primary:hover {
                    background: #163a65;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(31, 77, 133, 0.25);
                }

                .btn-secondary {
                    background: white;
                    color: #1f4d85;
                    border: 2px solid #e0e0e0;
                    position: relative;
                }

                .btn-secondary:hover {
                    background: #f8f9fa;
                    border-color: #1f4d85;
                    transform: translateY(-1px);
                }

                .options-menu {
                    position: absolute;
                    bottom: 60px;
                    right: 0;
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
                    border: 1px solid #e0e0e0;
                    overflow: hidden;
                    min-width: 160px;
                    z-index: 100;
                }

                .options-menu-item {
                    padding: 12px 16px;
                    font-size: 14px;
                    color: #333;
                    background: white;
                    border: none;
                    width: 100%;
                    text-align: left;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: background 0.2s ease;
                }

                .options-menu-item:hover {
                    background: #f8f9fa;
                }

                .options-menu-item i {
                    font-size: 16px;
                    color: #1f4d85;
                }

                /* Mobile */
                @media (max-width: 768px) {
                    .purchase-card {
                        flex-direction: column;
                        padding: 16px;
                    }

                    .image-container {
                        width: 100%;
                        height: 200px;
                    }

                    .status-badge {
                        top: 16px;
                        right: 16px;
                    }

                    .card-header {
                        padding-right: 100px;
                    }

                    .card-title {
                        font-size: 18px;
                    }

                    .price {
                        font-size: 24px;
                    }

                    .price-section {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 12px;
                    }

                    .card-actions {
                        width: 100%;
                        flex-direction: column;
                    }

                    .action-btn {
                        width: 100%;
                        justify-content: center;
                    }

                    .options-menu {
                        right: auto;
                        left: 0;
                    }
                }
            `}</style>

            <div className="purchase-card">
                <div className="image-container">
                    <div className="type-badge">
                        {type === 'tour_package' ? (
                            <>
                                <i className="bi bi-calendar-range"></i>
                                Package
                            </>
                        ) : (
                            <>
                                <i className="bi bi-geo-alt"></i>
                                Tour
                            </>
                        )}
                    </div>
                </div>

                <div className="card-content">
                    <div className="status-badge">
                        {getStatusLabel(status)}
                    </div>

                    <div className="card-header">
                        <h3 className="card-title">{title}</h3>
                    </div>

                    <div className="card-info">
                        <div className="info-item">
                            <i className="bi bi-geo-alt-fill info-icon" style={{ marginTop: '0px' }}></i>
                            <span>{location}</span>
                        </div>

                        <div className="info-item">
                            <i className="bi bi-calendar-event info-icon" style={{ marginTop: '0px' }}></i>
                            <span>
                                {formatDate(date)}
                                {selectedTime && ` @ ${selectedTime}`}
                                {endDate && ` - ${formatDate(endDate)}`}
                            </span>
                        </div>

                        <div className="info-item">
                            <i className="bi bi-people-fill info-icon" style={{ marginTop: '0px' }}></i>
                            <span>
                                {adults} Adult{adults > 1 ? 's' : ''}
                                {children ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}
                            </span>
                        </div>
                    </div>

                    {/* Quick Action Based on Type */}
                    {type === 'tour_package' && whatsappNumber && (
                        <button className="quick-action" onClick={handleWhatsAppClick}>
                            <i className="bi bi-whatsapp"></i>
                            Contact us on arrival day for pickup details
                        </button>
                    )}

                    {type === 'tour' && meetingPointUrl && (
                        <button className="quick-action quick-action-maps" onClick={handleMeetingPointClick}>
                            <i className="bi bi-geo-alt-fill" style={{ marginTop: '0px' }}></i>
                            View meeting point on map
                        </button>
                    )}

                    <div className="price-section">
                        <div className="price-container">
                            <span className="price-label">Total Price</span>
                            <div className="price">{formatPrice(price)}</div>
                        </div>

                        <div className="card-actions">
                            <button className="action-btn btn-primary" onClick={onViewDetails}>
                                <i className="bi bi-map"></i>
                                View Details
                            </button>
                            <button
                                className="action-btn btn-secondary"
                                onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                            >
                                <i className="bi bi-three-dots"></i>
                                Options
                            </button>

                            {showOptionsMenu && (
                                <div className="options-menu">
                                    <button className="options-menu-item" onClick={() => {
                                        onDownloadReceipt?.();
                                        setShowOptionsMenu(false);
                                    }}>
                                        <i className="bi bi-download"></i>
                                        Receipt
                                    </button>
                                    <button className="options-menu-item" onClick={() => {
                                        onRequestRefund?.();
                                        setShowOptionsMenu(false);
                                    }}>
                                        <i className="bi bi-arrow-counterclockwise"></i>
                                        Request Refund
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PurchaseCard;
