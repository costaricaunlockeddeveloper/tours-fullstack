"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface GalleryImagesProps {
    images: string[];
}

const GalleryImages = ({ images }: GalleryImagesProps) => {

    const [isOpen, setIsOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);

    const safeImages = images && images.length >= 3 
        ? images 
        : [...(images || []), ...Array(3).fill('/assets/img/destination/01.jpg')].slice(0, 3);

    const mainImage = safeImages[0];
    const sideImages = safeImages.slice(1, 3);

    // Lightbox Handlers
    const openLightbox = (index: number) => {
        setPhotoIndex(index);
        setIsOpen(true);
        // Prevent body scroll when modal is open
        if (typeof window !== 'undefined') {
            document.body.style.overflow = 'hidden';
        }
    };

    const closeLightbox = () => {
        setIsOpen(false);
        if (typeof window !== 'undefined') {
            document.body.style.overflow = 'auto';
        }
    };

    const nextSrc = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPhotoIndex((photoIndex + 1) % safeImages.length);
    };

    const prevSrc = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPhotoIndex((photoIndex + safeImages.length - 1) % safeImages.length);
    };

    // Slider settings for mobile
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        adaptiveHeight: true
    };

    // Inline styles for critical layout (prevents FOUC)
    const desktopGalleryStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '8px',
        height: '480px',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative'
    };

    const sideGridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: '1fr 1fr',
        gap: '8px',
        height: '100%'
    };

    const sliderImageWrapperStyle: React.CSSProperties = {
        position: 'relative',
        height: '300px',
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden'
    };

    return (
        <div className="gallery-section">
            <style jsx>{`
                .gallery-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    cursor: pointer;
                    transition: opacity 0.2s;
                }
                .gallery-img:hover {
                    opacity: 0.9;
                }

                .show-all-btn {
                    position: absolute;
                    bottom: 20px;
                    right: 20px;
                    background: white;
                    border: 1px solid #1a1a1a;
                    padding: 6px 14px;
                    border-radius: 4px;
                    font-size: 13px;
                    font-weight: 600;
                    color: #1a1a1a;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    z-index: 5;
                }

                /* Mobile Slider Container */
                .mobile-gallery {
                    margin-bottom: 20px;
                }

                /* Lightbox Modal Styles */
                .lightbox-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background-color: rgba(0, 0, 0, 0.9);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                }
                .lightbox-content {
                    position: relative;
                    width: 90%;
                    max-width: 1000px;
                    height: 80vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .lightbox-close {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: transparent;
                    border: none;
                    color: white;
                    font-size: 30px;
                    cursor: pointer;
                    z-index: 10001;
                }
                .lightbox-nav {
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    padding: 15px;
                    border-radius: 50%;
                    cursor: pointer;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .lightbox-nav:hover {
                    background: rgba(255,255,255,0.4);
                }
                .nav-prev { left: -60px; }
                .nav-next { right: -60px; }
                
                .lightbox-counter {
                    color: white;
                    margin-top: 15px;
                    font-size: 16px;
                }

                /* Mobile nav adjustment */
                @media (max-width: 768px) {
                    .nav-prev { left: 10px; }
                    .nav-next { right: 10px; }
                    .lightbox-content { width: 100%; height: 60vh; }
                }
            `}</style>

            {/* Desktop Gallery Grid - Inline styles prevent FOUC */}
            <div className="d-none d-lg-grid" style={desktopGalleryStyle}>
                {/* Main Image (Left) */}
                <div style={{ position: 'relative', height: '100%', width: '100%' }} onClick={() => openLightbox(0)}>
                    <Image 
                        src={mainImage} 
                        alt="Main tour image" 
                        fill
                        style={{ objectFit: "cover", cursor: 'pointer' }}
                        priority
                    />
                </div>

                {/* Side Images (Right) */}
                <div style={sideGridStyle}>
                    {sideImages.map((img, index) => (
                        <div key={index} style={{ position: 'relative', width: '100%', height: '100%' }} onClick={() => openLightbox(index + 1)}>
                            <Image
                                src={img}
                                alt={`Gallery image ${index + 2}`}
                                fill
                                style={{ objectFit: "cover", objectPosition: "center", cursor: 'pointer' }}
                            />
                            {/* Show button on the last image */}
                            {index === sideImages.length - 1 && (
                                <button className="show-all-btn" onClick={(e) => { e.stopPropagation(); openLightbox(0); }}>
                                    <i className="bi bi-grid-3x3-gap"></i>
                                    Show all photos
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile Slider */}
            <div className="mobile-gallery d-block d-lg-none">
                <Slider {...settings}>
                    {safeImages.map((img, index) => (
                        <div key={index} className="slider-item">
                            <div style={sliderImageWrapperStyle}>
                                <Image
                                    src={img}
                                    alt={`Mobile gallery image ${index + 1}`}
                                    fill
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>

            {/* Lightbox Modal */}
            {isOpen && (
                <div className="lightbox-overlay" onClick={closeLightbox}>
                    <button className="lightbox-close" onClick={closeLightbox}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                    
                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <button className="lightbox-nav nav-prev" onClick={prevSrc}>
                            <i className="bi bi-chevron-left"></i>
                        </button>
                        
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            <Image 
                                src={safeImages[photoIndex]} 
                                alt={`Full screen image ${photoIndex + 1}`}
                                fill
                                style={{ objectFit: "contain" }}
                            />
                        </div>

                        <button className="lightbox-nav nav-next" onClick={nextSrc}>
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>
                    
                    <div className="lightbox-counter">
                        {photoIndex + 1} / {safeImages.length}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryImages;
