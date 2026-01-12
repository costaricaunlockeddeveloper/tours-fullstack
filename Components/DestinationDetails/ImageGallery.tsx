"use client"
import Image from 'next/image';
import React, { useState } from 'react';

interface ImageGalleryProps {
    images: string[];
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const displayImages = images.slice(0, 5); // Show max 5 images in grid
    const remainingCount = images.length - 5;

    return (
        <>
            {/* Gallery Grid */}
            <div className="image-gallery-container">
                <div className="gallery-grid">
                    {/* Left Side - Main Image (50%) */}
                    <div className="gallery-main" onClick={() => openLightbox(0)}>
                        <Image 
                            src={displayImages[0]} 
                            alt="Main destination image" 
                            fill
                            className="gallery-image"
                            style={{ objectFit: 'cover' }}
                        />
                    </div>

                    {/* Right Side - 2x2 Grid (50%) */}
                    <div className="gallery-grid-small">
                        {displayImages.slice(1, 5).map((img, index) => (
                            <div 
                                key={index} 
                                className="gallery-item"
                                onClick={() => openLightbox(index + 1)}
                            >
                                <Image 
                                    src={img} 
                                    alt={`Destination image ${index + 2}`} 
                                    fill
                                    className="gallery-image"
                                    style={{ objectFit: 'cover' }}
                                />
                                {/* Show "+X" overlay on last image if there are more */}
                                {index === 3 && remainingCount > 0 && (
                                    <div className="gallery-overlay">
                                        <span className="overlay-text">+{remainingCount}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
                <div className="lightbox-overlay" onClick={closeLightbox}>
                    <button className="lightbox-close" onClick={closeLightbox}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                    
                    <button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    
                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <Image 
                            src={images[currentImageIndex]} 
                            alt={`Image ${currentImageIndex + 1}`}
                            width={1200}
                            height={800}
                            className="lightbox-image"
                            style={{ objectFit: 'contain' }}
                        />
                        <div className="lightbox-counter">
                            {currentImageIndex + 1} / {images.length}
                        </div>
                    </div>
                    
                    <button className="lightbox-next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </div>
            )}

            <style jsx>{`
                .image-gallery-container {
                    margin: 24px 0;
                }

                .gallery-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                    border-radius: 16px;
                    overflow: hidden;
                    height: 500px;
                }

                .gallery-main {
                    position: relative;
                    cursor: pointer;
                    overflow: hidden;
                    transition: transform 0.3s ease;
                }

                .gallery-main:hover {
                    transform: scale(1.02);
                }

                .gallery-grid-small {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-template-rows: 1fr 1fr;
                    gap: 8px;
                }

                .gallery-item {
                    position: relative;
                    cursor: pointer;
                    overflow: hidden;
                    transition: transform 0.3s ease;
                }

                .gallery-item:hover {
                    transform: scale(1.05);
                }

                .gallery-image {
                    transition: transform 0.3s ease;
                }

                .gallery-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.3s ease;
                }

                .gallery-overlay:hover {
                    background: rgba(0, 0, 0, 0.7);
                }

                .overlay-text {
                    color: white;
                    font-size: 32px;
                    font-weight: 700;
                }

                /* Lightbox Styles */
                .lightbox-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.95);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .lightbox-content {
                    position: relative;
                    max-width: 90vw;
                    max-height: 90vh;
                }

                .lightbox-image {
                    max-width: 90vw;
                    max-height: 90vh;
                    width: auto;
                    height: auto;
                }

                .lightbox-close {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    color: white;
                    font-size: 24px;
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.3s ease;
                    z-index: 10000;
                }

                .lightbox-close:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                .lightbox-prev,
                .lightbox-next {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    color: white;
                    font-size: 32px;
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.3s ease;
                    z-index: 10000;
                }

                .lightbox-prev {
                    left: 20px;
                }

                .lightbox-next {
                    right: 20px;
                }

                .lightbox-prev:hover,
                .lightbox-next:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                .lightbox-counter {
                    position: absolute;
                    bottom: -40px;
                    left: 50%;
                    transform: translateX(-50%);
                    color: white;
                    font-size: 16px;
                    font-weight: 500;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .gallery-grid {
                        grid-template-columns: 1fr;
                        height: auto;
                    }

                    .gallery-main {
                        height: 300px;
                    }

                    .gallery-grid-small {
                        grid-template-columns: 1fr 1fr;
                    }

                    .gallery-item {
                        height: 150px;
                    }

                    .lightbox-prev,
                    .lightbox-next {
                        width: 40px;
                        height: 40px;
                        font-size: 24px;
                    }

                    .lightbox-prev {
                        left: 10px;
                    }

                    .lightbox-next {
                        right: 10px;
                    }
                }
            `}</style>
        </>
    );
};

export default ImageGallery;
