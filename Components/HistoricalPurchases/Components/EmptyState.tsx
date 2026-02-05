"use client"
import React from 'react';

const EmptyState: React.FC<{ type: 'upcoming' | 'past' }> = ({ type }) => {
    return (
        <>
            <style jsx>{`
                .empty-state {
                    text-align: center;
                    padding: 80px 20px;
                    background: white;
                    border-radius: 20px;
                    border: 2px dashed #e0e0e0;
                }

                .empty-icon {
                    width: 120px;
                    height: 120px;
                    margin: 0 auto 24px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #f0f4f8 0%, #e8eef4 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 48px;
                    color: #1f4d85;
                }

                .empty-title {
                    font-size: 24px;
                    font-weight: 700;
                    color: #1a1a1a;
                    margin: 0 0 12px 0;
                }

                .empty-description {
                    font-size: 16px;
                    color: #666;
                    margin: 0 0 32px 0;
                    max-width: 400px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .empty-action {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 14px 28px;
                    background: #1f4d85;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-decoration: none;
                }

                .empty-action:hover {
                    background: #163a65;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(31, 77, 133, 0.3);
                }
            `}</style>

            <div className="empty-state">
                <div className="empty-icon">
                    <i className="bi bi-airplane"></i>
                </div>
                <h2 className="empty-title">
                    {type === 'upcoming' ? 'No Upcoming Trips' : 'No Past Trips'}
                </h2>
                <p className="empty-description">
                    {type === 'upcoming' 
                        ? "You don't have any upcoming trips scheduled. Start exploring amazing destinations!"
                        : "You haven't completed any trips yet. Book your first adventure!"}
                </p>
                <button className="empty-action" onClick={() => window.location.href = '/tour'}>
                    <i className="bi bi-compass"></i>
                    Explore Tours
                </button>
            </div>
        </>
    );
};

export default EmptyState;
