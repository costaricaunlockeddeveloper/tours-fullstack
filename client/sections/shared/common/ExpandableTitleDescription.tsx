"use client"
import React from 'react';

interface ExpandableTitleDescriptionProps {
    title: string;
    description: string;
    className?: string;
}

const ExpandableTitleDescription: React.FC<ExpandableTitleDescriptionProps> = ({ title, description, className = '' }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const maxLength = 150;
    const shouldTruncate = description?.length > maxLength;
    const displayDescription = isExpanded || !shouldTruncate ? description : description?.slice(0, maxLength) + "...";

    const handleShare = async () => {
        const shareData = {
            title: title,
            text: description,
            url: typeof window !== 'undefined' ? window.location.href : '',
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                alert("Link copied to clipboard!");
            }
        } catch (err) {
            console.error("Error sharing:", err);
        }
    };

    return (
        <div className={`expandable-content ${className}`}>
            <style jsx>{`
                .tour-title {
                    font-size: 32px;
                    font-weight: 800;
                    color: #1a1a1a;
                    margin-bottom: 8px;
                    line-height: 1.2;
                }
                .tour-description {
                    font-size: 16px;
                    color: #4a4a4a;
                    margin-bottom: 5px;
                    line-height: 1.6;
                }
                .see-more-btn {
                    background: none;
                    border: none;
                    color: var(--brand-blue);
                    font-weight: 600;
                    font-size: 14px;
                    padding: 0;
                    cursor: pointer;
                    margin-bottom: 15px;
                    display: inline-block;
                }
                .see-more-btn:hover {
                    text-decoration: underline;
                }
                .share-btn {
                    width: 44px;
                    height: 44px;
                    min-width: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    border: 1px solid var(--brand-blue);
                    color: var(--brand-blue);
                    background: #fff;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    padding: 0;
                    line-height: 0;
                }
                .share-btn:hover {
                    background: var(--brand-blue);
                    color: white;
                    transform: scale(1.05);
                }
                .title-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 16px;
                }
                
                @media (max-width: 575px) {
                    .tour-title {
                        font-size: 24px;
                        line-height: 1.3;
                    }
                    .tour-description {
                        font-size: 14px;
                    }
                    .share-btn {
                        width: 36px;
                        height: 36px;
                        min-width: 36px;
                    }
                    .share-btn i {
                        font-size: 1rem !important;
                    }
                }
            `}</style>
            
            <div className="title-row">
                <h1 className="tour-title">{title}</h1>
                <button className="share-btn" onClick={handleShare}>
                    <i className="bi bi-share" style={{ fontSize: '1.2rem' }}></i>
                </button>
            </div>
            
            <p className="tour-description">
                {displayDescription}
            </p>
            {shouldTruncate && (
                <button 
                    className="see-more-btn"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? "See Less" : "See More"}
                </button>
            )}
        </div>
    );
};

export default ExpandableTitleDescription;
