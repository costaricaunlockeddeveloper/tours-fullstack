"use client"
import React, { useState } from 'react';

interface FloatingWhatsAppButtonProps {
    phoneNumber?: string;
}

const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = ({ 
    phoneNumber = '50612345678' 
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => {
        window.open(`https://wa.me/${phoneNumber}`, '_blank');
    };

    return (
        <>
            <style jsx>{`
                .floating-whatsapp-btn {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 16px rgba(37, 211, 102, 0.4);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    z-index: 9999;
                    border: none;
                }

                .floating-whatsapp-btn:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 24px rgba(37, 211, 102, 0.6);
                }

                .floating-whatsapp-btn:active {
                    transform: scale(0.95);
                }

                .whatsapp-icon {
                    font-size: 32px;
                    color: white;
                    transition: transform 0.3s ease;
                }

                .floating-whatsapp-btn:hover .whatsapp-icon {
                    transform: rotate(15deg);
                }

                .tooltip {
                    position: absolute;
                    right: 75px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: white;
                    color: #333;
                    padding: 10px 16px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    white-space: nowrap;
                    font-size: 14px;
                    font-weight: 600;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.3s ease, transform 0.3s ease;
                }

                .tooltip::after {
                    content: '';
                    position: absolute;
                    right: -6px;
                    top: 50%;
                    transform: translateY(-50%) rotate(45deg);
                    width: 12px;
                    height: 12px;
                    background: white;
                    box-shadow: 2px -2px 4px rgba(0, 0, 0, 0.05);
                }

                .floating-whatsapp-btn:hover .tooltip {
                    opacity: 1;
                    transform: translateY(-50%) translateX(-5px);
                }

                /* Pulse animation */
                @keyframes pulse {
                    0% {
                        box-shadow: 0 4px 16px rgba(37, 211, 102, 0.4),
                                    0 0 0 0 rgba(37, 211, 102, 0.7);
                    }
                    50% {
                        box-shadow: 0 4px 16px rgba(37, 211, 102, 0.4),
                                    0 0 0 10px rgba(37, 211, 102, 0);
                    }
                    100% {
                        box-shadow: 0 4px 16px rgba(37, 211, 102, 0.4),
                                    0 0 0 0 rgba(37, 211, 102, 0);
                    }
                }

                .floating-whatsapp-btn {
                    animation: pulse 2s infinite;
                }

                .floating-whatsapp-btn:hover {
                    animation: none;
                }

                /* Mobile responsiveness */
                @media (max-width: 768px) {
                    .floating-whatsapp-btn {
                        bottom: 20px;
                        right: 20px;
                        width: 56px;
                        height: 56px;
                    }

                    .whatsapp-icon {
                        font-size: 28px;
                    }

                    .tooltip {
                        display: none;
                    }
                }
            `}</style>

            <button
                className="floating-whatsapp-btn"
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                aria-label="Contact us on WhatsApp"
            >
                <i className="bi bi-whatsapp whatsapp-icon"></i>
                <span className="tooltip">Chat with us!</span>
            </button>
        </>
    );
};

export default FloatingWhatsAppButton;
