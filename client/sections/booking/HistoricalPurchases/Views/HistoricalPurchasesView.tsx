"use client"
import React, { useState } from 'react';
import PurchaseCard, { PurchaseCardProps } from '../Components/PurchaseCard';
import PurchasesTabs, { TabType } from '../Components/PurchasesTabs';
import EmptyState from '../Components/EmptyState';

// Mock data for demonstration
const mockPurchases: PurchaseCardProps[] = [
    {
        id: '1',
        type: 'tour',
        image: '/assets/img/about/01.png',
        title: 'Parque Nacional Manuel Antonio Tour',
        location: 'Manuel Antonio, Puntarenas',
        date: '2026-02-15T08:00:00',
        adults: 2,
        children: 0,
        status: 'confirmed',
        price: 130,
        meetingPointUrl: 'https://www.google.com/maps/place/Manuel+Antonio+National+Park',
        onViewDetails: () => console.log('View details clicked'),
        onDownloadReceipt: () => console.log('Download receipt clicked'),
        onRequestRefund: () => console.log('Request refund clicked')
    },
    {
        id: '2',
        type: 'tour_package',
        image: '/assets/img/about/01.png',
        title: 'Arenal Volcano & Hot Springs Package',
        location: 'La Fortuna, Alajuela',
        date: '2026-03-10T09:00:00',
        endDate: '2026-03-12T17:00:00',
        adults: 2,
        children: 1,
        status: 'pending',
        price: 2800,
        whatsappNumber: '50612345678',
        onViewDetails: () => console.log('View details clicked'),
        onDownloadReceipt: () => console.log('Download receipt clicked'),
        onRequestRefund: () => console.log('Request refund clicked')
    },
    {
        id: '3',
        type: 'tour',
        image: '/assets/img/about/01.png',
        title: 'Monteverde Cloud Forest Adventure',
        location: 'Monteverde, Puntarenas',
        date: '2026-01-20T07:30:00',
        adults: 3,
        children: 2,
        status: 'cancelled',
        price: 450,
        meetingPointUrl: 'https://www.google.com/maps/place/Monteverde+Cloud+Forest',
        onViewDetails: () => console.log('View details clicked'),
        onDownloadReceipt: () => console.log('Download receipt clicked'),
        onRequestRefund: () => console.log('Request refund clicked')
    }
];

const HistoricalPurchasesView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('upcoming');

    // Filter purchases by upcoming vs past
    const now = new Date();
    const upcomingPurchases = mockPurchases.filter(purchase => 
        new Date(purchase.date) >= now && 
        (purchase.status === 'confirmed' || purchase.status === 'pending')
    );
    const pastPurchases = mockPurchases.filter(purchase => 
        new Date(purchase.date) < now || 
        purchase.status === 'completed' || 
        purchase.status === 'cancelled'
    );

    const currentPurchases = activeTab === 'upcoming' ? upcomingPurchases : pastPurchases;

    return (
        <>
         <section className='top-blue-rect' style={{marginBottom: '0px'}}></section>
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
            </div>
        </>
    );
};

export default HistoricalPurchasesView;
