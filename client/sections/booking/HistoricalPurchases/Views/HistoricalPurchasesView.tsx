"use client"
import React, { useState, useEffect } from 'react';
import PurchaseCard, { PurchaseCardProps } from '../Components/PurchaseCard';
import PurchasesTabs, { TabType } from '../Components/PurchasesTabs';
import EmptyState from '../Components/EmptyState';
import ReservationDetailsModal from '../Components/ReservationDetailsModal';
import { useAuth } from '@/contexts/AuthContext';

const HistoricalPurchasesView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('upcoming');
    const [purchases, setPurchases] = useState<PurchaseCardProps[]>([]);
    const [rawReservations, setRawReservations] = useState<any[]>([]);
    const [selectedRes, setSelectedRes] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { user, loading: authLoading } = useAuth();

    const fetchReservations = async () => {
        if (!user) return;

        try {
            const response = await fetch('/api/reservations/user');
            if (response.ok) {
                const data = await response.json();
                setRawReservations(data);
                const mappedPurchases: PurchaseCardProps[] = data.map((res: any) => ({
                    id: res._id || res.id,
                    type: res.packageId ? 'tour_package' : 'tour',
                    image: '/assets/img/destination/01.jpg', // Placeholder, ideally typically fetched or stored
                    title: res.packageName || res.tourName || 'Unknown Booking',
                    location: 'Costa Rica', // Placeholder
                    date: res.startDate || res.date,
                    selectedTime: res.selectedTime,
                    endDate: res.endDate,
                    adults: res.adults || 0,
                    children: res.children || 0,
                    status: res.status,
                    price: res.totalPrice,
                    // Additional methods could be implemented
                    onViewDetails: () => {
                        setSelectedRes(res);
                        setIsModalOpen(true);
                    },
                    onDownloadReceipt: () => handleDownloadReceipt(res),
                    onRequestRefund: () => handleRequestRefund(res),
                }));
                setPurchases(mappedPurchases);
            }
        } catch (error) {
            console.error("Failed to fetch reservations", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            if (user) {
                fetchReservations();
            } else {
                setIsLoading(false); // No user, so no loading needed (empty state or redirect)
            }
        }
    }, [user, authLoading]);

    const handleDownloadReceipt = (res: any) => {
        if (res.paymentStatus === 'paid') {
            alert(`Receipt for booking ${res._id || res.id} will be generated shortly. In the meantime, you can check your email for the Stripe confirmation.`);
        } else {
            alert("Digital receipt is not available yet as the payment is still in 'pending' status.");
        }
    };

    const handleRequestRefund = (res: any) => {
        const message = encodeURIComponent(`Hello, I would like to request a refund for my booking ${res.packageName || res.tourName} (ID: ${res._id || res.id}).`);
        if (confirm("To request a refund, you must contact our support team. Would you like to open WhatsApp support now?")) {
            window.open(`https://wa.me/50688888888?text=${message}`, '_blank');
        }
    };

    // Filter purchases by upcoming vs past
    const now = new Date();
    const upcomingPurchases = purchases.filter(purchase =>
        new Date(purchase.endDate || purchase.date) >= now &&
        (purchase.status === 'confirmed' || purchase.status === 'pending')
    );
    const pastPurchases = purchases.filter(purchase =>
        new Date(purchase.endDate || purchase.date) < now ||
        purchase.status === 'completed' ||
        purchase.status === 'cancelled'
    );

    const currentPurchases = activeTab === 'upcoming' ? upcomingPurchases : pastPurchases;

    if (authLoading || isLoading) {
        return (
            <div className="historical-purchases-container">
                <div className="content-wrapper">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading your trips...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <section className='top-blue-rect' style={{ marginBottom: '0px' }}></section>
            <style jsx>{`
                .historical-purchases-container {
                    background: linear-gradient(135deg, #f5f7fa 0%, #e8eef4 100%);
                    min-height: 100vh;
                    padding: 60px 0 80px;
                }

                .page-header {
                    text-align: center;
                    margin-bottom: 48px;
                }

                .page-title {
                    font-size: 42px;
                    font-weight: 800;
                    color: #1a1a1a;
                    margin: 0 0 12px 0;
                    letter-spacing: -0.5px;
                }

                .page-subtitle {
                    font-size: 16px;
                    color: #666;
                    margin: 0;
                }

                .content-wrapper {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                }

                .purchases-list {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    animation: fadeIn 0.5s ease-in-out;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .loading-state {
                    text-align: center;
                    padding: 60px 20px;
                }

                .spinner {
                    width: 48px;
                    height: 48px;
                    border: 4px solid #f0f0f0;
                    border-top: 4px solid #1f4d85;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 16px;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .stats-bar {
                    background: white;
                    border-radius: 16px;
                    padding: 20px 32px;
                    display: flex;
                    justify-content: space-around;
                    gap: 24px;
                    margin-bottom: 32px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
                }

                .stat-item {
                    text-align: center;
                }

                .stat-value {
                    font-size: 32px;
                    font-weight: 800;
                    color: #1f4d85;
                    margin: 0 0 4px 0;
                }

                .stat-label {
                    font-size: 13px;
                    color: #666;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    font-weight: 600;
                }

                @media (max-width: 768px) {
                    .page-title {
                        font-size: 32px;
                    }

                    .stats-bar {
                        flex-direction: column;
                        gap: 16px;
                    }

                    .stat-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }

                    .stat-value {
                        font-size: 24px;
                    }
                }
            `}</style>

            <div className="historical-purchases-container">
                <div className="content-wrapper">
                    <div className="page-header">
                        <h1 className="page-title">My Trips</h1>
                        <p className="page-subtitle">Manage and track all your Costa Rica adventures</p>
                    </div>
                    <PurchasesTabs
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        upcomingCount={upcomingPurchases.length}
                        pastCount={pastPurchases.length}
                    />

                    {currentPurchases.length > 0 ? (
                        <div className="purchases-list">
                            {currentPurchases.map((purchase) => (
                                <PurchaseCard key={purchase.id} {...purchase} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState type={activeTab} />
                    )}
                </div>

                <ReservationDetailsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    reservation={selectedRes}
                />
            </div>
        </>
    );
};

export default HistoricalPurchasesView;
