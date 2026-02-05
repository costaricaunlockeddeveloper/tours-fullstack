"use client"
import React, { useState } from 'react';

export type TabType = 'upcoming' | 'past';

interface PurchasesTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    upcomingCount?: number;
    pastCount?: number;
}

const PurchasesTabs: React.FC<PurchasesTabsProps> = ({
    activeTab,
    onTabChange,
    upcomingCount = 0,
    pastCount = 0
}) => {
    return (
        <>
            <style jsx>{`
                .tabs-container {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 48px;
                    position: relative;
                }

                .tabs-wrapper {
                    background: white;
                    border-radius: 16px;
                    padding: 8px;
                    display: inline-flex;
                    gap: 8px;
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
                    border: 1px solid #f0f0f0;
                }

                .tab {
                    padding: 14px 32px;
                    border-radius: 12px;
                    font-size: 15px;
                    font-weight: 600;
                    border: none;
                    background: transparent;
                    color: #666;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    white-space: nowrap;
                }

                .tab:hover {
                    color: #1f4d85;
                }

                .tab.active {
                    background: #1f4d85;
                    color: white;
                    box-shadow: 0 4px 12px rgba(31, 77, 133, 0.25);
                }

                .tab-count {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 24px;
                    height: 24px;
                    padding: 0 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 700;
                    transition: all 0.3s ease;
                }

                .tab:not(.active) .tab-count {
                    background: #f0f0f0;
                    color: #666;
                }

                .tab.active .tab-count {
                    background: rgba(255, 255, 255, 0.25);
                    color: white;
                }

                @media (max-width: 768px) {
                    .tabs-wrapper {
                        width: 100%;
                    }

                    .tab {
                        flex: 1;
                        justify-content: center;
                        padding: 14px 20px;
                        font-size: 14px;
                    }
                }
            `}</style>

            <div className="tabs-container">
                <div className="tabs-wrapper">
                    <button
                        className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
                        onClick={() => onTabChange('upcoming')}
                    >
                        Upcoming Trips
                        {upcomingCount > 0 && (
                            <span className="tab-count">{upcomingCount}</span>
                        )}
                    </button>
                    <button
                        className={`tab ${activeTab === 'past' ? 'active' : ''}`}
                        onClick={() => onTabChange('past')}
                    >
                        Past Trips
                        {pastCount > 0 && (
                            <span className="tab-count">{pastCount}</span>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
};

export default PurchasesTabs;
