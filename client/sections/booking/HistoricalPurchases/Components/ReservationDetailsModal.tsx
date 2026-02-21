import React from 'react';
import dayjs from 'dayjs';
import { Reservation } from '@/types';

interface ReservationDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    reservation: Reservation | null;
}

const ReservationDetailsModal: React.FC<ReservationDetailsModalProps> = ({ isOpen, onClose, reservation }) => {
    if (!isOpen || !reservation) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return '#10b981';
            case 'pending': return '#f59e0b';
            case 'completed': return '#3b82f6';
            case 'cancelled': return '#ef4444';
            default: return '#6b7280';
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.4);
                    backdrop-filter: blur(2px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    padding: 10px;
                    animation: fadeIn 0.2s ease;
                }

                .modal-content {
                    background: white;
                    width: 100%;
                    max-width: 600px;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    animation: slideUp 0.15s ease-out;
                    position: relative;
                }

                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

                .modal-header {
                    background: #1f4d85;
                    color: white;
                    padding: 12px 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .close-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    width: 28px;
                    height: 28px;
                    border-radius: 4px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .close-btn:hover { background: rgba(255, 255, 255, 0.3); }

                .modal-body { padding: 16px; }

                .compact-grid {
                    display: grid;
                    grid-template-cols: repeat(3, 1fr);
                    gap: 12px;
                    margin-bottom: 16px;
                    background: #f8faff;
                    padding: 12px;
                    border-radius: 10px;
                    border: 1px solid #eef2f8;
                }

                .info-item { display: flex; flex-direction: column; gap: 2px; }
                .info-label { font-size: 10px; color: #718096; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
                .info-value { font-size: 13px; font-weight: 600; color: #1a202c; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

                .status-pill {
                    display: inline-flex;
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: 800;
                    color: white;
                    text-transform: uppercase;
                }

                .action-row {
                    display: grid;
                    grid-template-cols: 1fr 1fr;
                    align-items: center;
                    gap: 16px;
                    border-top: 1px dashed #e2e8f0;
                    padding-top: 16px;
                }

                .total-box { display: flex; flex-direction: column; }
                .total-label { font-size: 11px; color: #718096; font-weight: 700; text-transform: uppercase; }
                .total-value { font-size: 24px; font-weight: 900; color: #1f4d85; }

                .btn-whatsapp {
                    background: #25d366;
                    color: white;
                    padding: 10px;
                    border-radius: 8px;
                    font-weight: 700;
                    font-size: 13px;
                    cursor: pointer;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    transition: all 0.2s;
                }

                .btn-whatsapp:hover { background: #128c7e; transform: translateY(-1px); }

                @media (max-width: 500px) {
                    .compact-grid { grid-template-cols: 1fr; }
                    .action-row { grid-template-cols: 1fr; gap: 12px; text-align: center; }
                    .total-box { align-items: center; }
                }
            `}</style>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>{reservation.packageName || reservation.tourName}</h2>
                        <span style={{ fontSize: '10px', opacity: 0.8 }}>ID: {reservation.id}</span>
                    </div>
                    <button className="close-btn" onClick={onClose} aria-label="Close">
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="modal-body">
                    <div className="compact-grid">
                        <div className="info-item">
                            <span className="info-label">Status</span>
                            <div>
                                <span className="status-pill" style={{ backgroundColor: getStatusColor(reservation.status) }}>
                                    {reservation.status}
                                </span>
                            </div>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Date & Time</span>
                            <span className="info-value">
                                {dayjs(reservation.startDate || reservation.date).format('MMM D')}
                                {reservation.selectedTime && ` @ ${reservation.selectedTime}`}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Passengers</span>
                            <span className="info-value">{reservation.adults} Ad / {reservation.children} Ch</span>
                        </div>
                    </div>

                    {reservation.paymentId && (
                        <div style={{ marginBottom: '12px', fontSize: '10px', color: '#718096', borderBottom: '1px solid #f7fafc', paddingBottom: '6px' }}>
                            <span style={{ fontWeight: 700 }}>Payment:</span> {reservation.paymentMethod} • ID: {reservation.paymentId.substring(0, 20)}...
                        </div>
                    )}

                    <div className="action-row">
                        <div className="total-box">
                            <span className="total-label">Total Amount</span>
                            <span className="total-value">${reservation.totalPrice?.toFixed(2)} <small style={{ fontSize: '12px', fontWeight: 600 }}>USD</small></span>
                        </div>
                        <button className="btn-whatsapp" onClick={() => window.open('https://wa.me/50688888888', '_blank')}>
                            <i className="bi bi-whatsapp"></i>
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservationDetailsModal;
