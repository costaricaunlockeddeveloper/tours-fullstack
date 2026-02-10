"use client"
import React from 'react';

const LoadingState: React.FC = () => {
    return (
        <>
            <style jsx>{`
                .loading-container {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                .skeleton-card {
                    background: white;
                    border-radius: 16px;
                    padding: 20px;
                    display: flex;
                    gap: 24px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
                    border: 1px solid #f0f0f0;
                }

                .skeleton-image {
                    width: 220px;
                    height: 280px;
                    border-radius: 12px;
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: shimmer 2s infinite;
                    flex-shrink: 0;
                }

                .skeleton-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .skeleton-line {
                    height: 16px;
                    border-radius: 8px;
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: shimmer 2s infinite;
                }

                .skeleton-title {
                    height: 24px;
                    width: 70%;
                    margin-bottom: 4px;
                }

                .skeleton-line.short {
                    width: 40%;
                }

                .skeleton-line.medium {
                    width: 50%;
                }

                .skeleton-divider {
                    height: 1px;
                    background: #f0f0f0;
                    margin: auto 0 16px 0;
                }

                .skeleton-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .skeleton-price {
                    width: 120px;
                    height: 32px;
                    border-radius: 8px;
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: shimmer 2s infinite;
                }

                .skeleton-buttons {
                    display: flex;
                    gap: 10px;
                }

                .skeleton-button {
                    width: 120px;
                    height: 44px;
                    border-radius: 10px;
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: shimmer 2s infinite;
                }

                @keyframes shimmer {
                    0% {
                        background-position: 200% 0;
                    }
                    100% {
                        background-position: -200% 0;
                    }
                }

                @media (max-width: 768px) {
                    .skeleton-card {
                        flex-direction: column;
                    }

                    .skeleton-image {
                        width: 100%;
                        height: 220px;
                    }

                    .skeleton-footer {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 12px;
                    }

                    .skeleton-buttons {
                        width: 100%;
                        flex-direction: column;
                    }

                    .skeleton-button {
                        width: 100%;
                    }
                }
            `}</style>

            <div className="loading-container">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="skeleton-card">
                        <div className="skeleton-image"></div>
                        <div className="skeleton-content">
                            <div className="skeleton-line skeleton-title"></div>
                            <div className="skeleton-line medium"></div>
                            <div className="skeleton-line short"></div>
                            <div className="skeleton-line medium"></div>
                            <div className="skeleton-divider"></div>
                            <div className="skeleton-footer">
                                <div className="skeleton-price"></div>
                                <div className="skeleton-buttons">
                                    <div className="skeleton-button"></div>
                                    <div className="skeleton-button"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default LoadingState;
