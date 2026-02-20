"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AssetMeta } from '@/services/api-service';
import ThreeSixtyViewer from './ThreeSixtyViewer';

interface GalleryImagesProps {
    images: (string | AssetMeta)[];
}

const GalleryImages = ({ images }: GalleryImagesProps) => {

    const [isOpen, setIsOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [show360Viewer, setShow360Viewer] = useState(false);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    const normalizedImages: AssetMeta[] = (images || []).map(img => {
        if (typeof img === 'string') {
            return { path: img, mediaType: 'standard' };
        }
        return { ...img, mediaType: img.mediaType || 'standard' };
    });
    
    const safeImages = normalizedImages.length >= 3 
        ? normalizedImages 
        : [...normalizedImages, ...Array(3).fill({ path: '/assets/img/destination/01.jpg', mediaType: 'standard' })].slice(0, 3);

    const mainImage = safeImages[0];
    const sideImages = safeImages.slice(1, 3);

    const currentImage = safeImages[photoIndex];

    /** Returns the display image path: thumbnailPath for videos, path for everything else */
    const getDisplayPath = (img: AssetMeta): string => {
        if (img.mediaType === 'video') {
            return img.thumbnailPath || "/assets/img/destination/01.jpg";
        }
        if (img.path && img.path.match(/\.(mp4|webm|ogg|mov)$/i)) {
            return "/assets/img/destination/01.jpg";
        }
        return img.path || "/assets/img/destination/01.jpg";
    };

    // Lightbox Handlers — always opens lightbox, never auto-activates media
    const handleImageClick = (index: number) => {
        setPhotoIndex(index);
        setIsVideoPlaying(false);
        setIsOpen(true);
        if (typeof window !== 'undefined') {
            document.body.style.overflow = 'hidden';
        }
    };

    /** Activates 360 viewer or video player when user clicks the overlay button */
    const handleMediaActivate = () => {
        const img = safeImages[photoIndex];
        if (img.mediaType === '360') {
            setShow360Viewer(true);
        } else if (img.mediaType === 'video') {
            setIsVideoPlaying(true);
        }
    };

    const closeLightbox = () => {
        setIsOpen(false);
        setShow360Viewer(false);
        setIsVideoPlaying(false);
        if (typeof window !== 'undefined') {
            document.body.style.overflow = 'auto';
        }
    };

    /** Closes 360 viewer but keeps lightbox open */
    const close360Viewer = () => {
        setShow360Viewer(false);
    };

    const nextSrc = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPhotoIndex((photoIndex + 1) % safeImages.length);
        setIsVideoPlaying(false);
    };

    const prevSrc = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPhotoIndex((photoIndex + safeImages.length - 1) % safeImages.length);
        setIsVideoPlaying(false);
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

    /**
     * Renders the overlay for 360° and video media types.
     * - 360°: Dark overlay + "Ver en 360°" button
     * - Video: Dark overlay + play button
     * - Standard: No overlay
     */
    const renderMediaOverlay = (type?: string, isSmall: boolean = false) => {
        if (type === '360') {
            return (
                <div className="media-overlay">
                    <div className="media-overlay-content">
                        <i className={`bi bi-globe2 media-overlay-icon ${isSmall ? 'media-overlay-icon--small' : ''}`}></i>
                        {!isSmall && <span className="media-overlay-label">Ver en 360°</span>}
                    </div>
                </div>
            );
        }
        if (type === 'video') {
            return (
                <div className="media-overlay">
                    <div className="media-overlay-content">
                        <i className={`bi bi-play-circle-fill media-overlay-icon media-overlay-icon--play ${isSmall ? 'media-overlay-icon--small-play' : ''}`}></i>
                        {!isSmall && <span className="media-overlay-label">Reproducir video</span>}
                    </div>
                </div>
            );
        }
        return null;
    };


    // Inline styles 
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
                .gallery-img-wrapper {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    cursor: pointer;
                    overflow: hidden;
                }
                .gallery-img-wrapper:hover .media-overlay {
                    background: rgba(0, 0, 0, 0.65);
                }

                /* --- Media Overlay --- */
                .media-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.4);
                    z-index: 2;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 1; /* Always visible */
                    transition: background 0.3s ease;
                    pointer-events: none; /* Let clicks pass through to the wrapper */
                }
                .media-overlay-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    pointer-events: none;
                }
                .media-overlay-icon {
                    font-size: 44px;
                    color: white;
                    filter: drop-shadow(0 2px 6px rgba(0,0,0,0.4));
                }
                .media-overlay-icon--play {
                    font-size: 56px;
                }
                .media-overlay-icon--small {
                    font-size: 28px;
                }
                .media-overlay-icon--small-play {
                    font-size: 38px;
                }

                /* --- Side Thumbnail Overlay (independent of lightbox overlay) --- */
                .side-media-badge {
                    position: absolute;
                    inset: 0;
                    z-index: 3;
                    pointer-events: none;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    background: rgba(0, 0, 0, 0.38);
                    transition: background 0.25s ease;
                }
                .gallery-img-wrapper:hover .side-media-badge {
                    background: rgba(0, 0, 0, 0.55);
                }
                .side-media-badge__icon {
                    font-size: 30px;
                    color: #fff;
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
                    line-height: 1;
                }
                .side-media-badge__label {
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.6px;
                    text-transform: uppercase;
                    color: #fff;
                    background: rgba(255,255,255,0.18);
                    border: 1px solid rgba(255,255,255,0.3);
                    border-radius: 12px;
                    padding: 3px 10px;
                    backdrop-filter: blur(4px);
                }
                .media-overlay-label {
                    color: white;
                    font-size: 14px;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                    background: rgba(255,255,255,0.15);
                    padding: 6px 18px;
                    border-radius: 20px;
                    backdrop-filter: blur(4px);
                    border: 1px solid rgba(255,255,255,0.25);
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
                    z-index: 10; /* Make sure button is strictly above the media overlay */
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

                /* Clickable overlay for 360/video in lightbox */
                .lightbox-media-overlay {
                    position: absolute;
                    inset: 0;
                    z-index: 2;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    background: rgba(0, 0, 0, 0.30);
                    transition: background 0.25s ease;
                }
                .lightbox-media-overlay:hover {
                    background: rgba(0, 0, 0, 0.45);
                }
                .lightbox-media-cta {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 14px;
                    background: rgba(15, 15, 15, 0.72);
                    border: 1px solid rgba(255,255,255,0.18);
                    border-radius: 20px;
                    padding: 40px 52px;
                    backdrop-filter: blur(14px);
                    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                    transition: transform 0.2s ease, background 0.2s ease;
                }
                .lightbox-media-overlay:hover .lightbox-media-cta {
                    transform: scale(1.05);
                    background: rgba(15, 15, 15, 0.85);
                }
                .lightbox-media-cta__icon {
                    font-size: 72px;
                    color: #fff;
                    line-height: 1;
                    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5));
                }
                .lightbox-media-cta__icon--play {
                    color: #fff;
                }
                .lightbox-media-cta__label {
                    font-size: 15px;
                    font-weight: 700;
                    letter-spacing: 1.2px;
                    text-transform: uppercase;
                    color: #fff;
                    background: rgba(255,255,255,0.15);
                    border: 1px solid rgba(255,255,255,0.3);
                    border-radius: 30px;
                    padding: 8px 26px;
                    backdrop-filter: blur(4px);
                }
                .lightbox-media-cta__hint {
                    font-size: 12px;
                    color: rgba(255,255,255,0.55);
                    letter-spacing: 0.3px;
                }

                @media (max-width: 768px) {
                    .nav-prev { left: 10px; }
                    .nav-next { right: 10px; }
                    .lightbox-content { width: 100%; height: 60vh; }
                }
            `}</style>
            
            {/* 360 Viewer Modal — closing returns to lightbox */}
            {show360Viewer && (
                <ThreeSixtyViewer 
                    imageUrl={currentImage.path} 
                    onClose={close360Viewer} 
                />
            )}

            {/* Desktop Gallery Grid */}
            <div className="d-none d-lg-grid" style={desktopGalleryStyle}>
                {/* Main Image (Left) */}
                <div className="gallery-img-wrapper" onClick={() => handleImageClick(0)}>
                    <Image 
                        src={getDisplayPath(mainImage)} 
                        alt="Main tour image" 
                        fill
                        style={{ objectFit: "cover" }}
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {renderMediaOverlay(mainImage.mediaType)}
                </div>

                {/* Side Images (Right) */}
                <div style={sideGridStyle}>
                    {sideImages.map((img, index) => (
                        <div key={index} className="gallery-img-wrapper" onClick={() => handleImageClick(index + 1)}>
                            <Image
                                src={getDisplayPath(img)}
                                alt={`Gallery image ${index + 2}`}
                                fill
                                style={{ objectFit: "cover", objectPosition: "center" }}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            {/* Side thumbnail overlay: always visible for 360 and video */}
                            {img.mediaType === '360' && (
                                <div className="side-media-badge">
                                    <i className="bi bi-globe2 side-media-badge__icon"></i>
                                    <span className="side-media-badge__label">360°</span>
                                </div>
                            )}
                            {img.mediaType === 'video' && (
                                <div className="side-media-badge">
                                    <i className="bi bi-play-circle-fill side-media-badge__icon"></i>
                                    <span className="side-media-badge__label">Video</span>
                                </div>
                            )}
                            {/* Show button on the last image */}
                            {index === sideImages.length - 1 && (
                                <button className="show-all-btn" onClick={(e) => { e.stopPropagation(); handleImageClick(0); }}>
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
                        <div key={index} className="slider-item" onClick={() => handleImageClick(index)}>
                            <div style={sliderImageWrapperStyle}>
                                <Image
                                    src={getDisplayPath(img)}
                                    alt={`Mobile gallery image ${index + 1}`}
                                    fill
                                    style={{ objectFit: "cover" }}
                                    sizes="100vw"
                                />
                                {img.mediaType === '360' && (
                                    <div className="side-media-badge">
                                        <i className="bi bi-globe2 side-media-badge__icon"></i>
                                        <span className="side-media-badge__label">360°</span>
                                    </div>
                                )}
                                {img.mediaType === 'video' && (
                                    <div className="side-media-badge">
                                        <i className="bi bi-play-circle-fill side-media-badge__icon"></i>
                                        <span className="side-media-badge__label">Video</span>
                                    </div>
                                )}
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
                            {/* Video player — only shown after user clicks play */}
                            {currentImage.mediaType === 'video' && isVideoPlaying ? (
                                <video 
                                    src={currentImage.path} 
                                    controls 
                                    autoPlay 
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                >
                                    Your browser does not support the video element.
                                </video>
                            ) : (
                                /* Thumbnail for ALL media types, with overlay for 360/video */
                                <>
                                    <Image 
                                        src={getDisplayPath(currentImage)} 
                                        alt={`Full screen image ${photoIndex + 1}`}
                                        fill
                                        style={{ objectFit: "contain" }}
                                        sizes="100vw"
                                    />
                                    {currentImage.mediaType === 'video' && (
                                        <div
                                            className="lightbox-media-overlay"
                                            onClick={(e) => { e.stopPropagation(); handleMediaActivate(); }}
                                        >
                                            <div className="lightbox-media-cta">
                                                <i className="bi bi-play-circle-fill lightbox-media-cta__icon lightbox-media-cta__icon--play"></i>
                                                <span className="lightbox-media-cta__label">Play video</span>
                                                <span className="lightbox-media-cta__hint">Click to play</span>
                                            </div>
                                        </div>
                                    )}
                                    {currentImage.mediaType === '360' && (
                                        <div
                                            className="lightbox-media-overlay"
                                            onClick={(e) => { e.stopPropagation(); handleMediaActivate(); }}
                                        >
                                            <div className="lightbox-media-cta">
                                                <i className="bi bi-globe2 lightbox-media-cta__icon"></i>
                                                <span className="lightbox-media-cta__label">View in 360°</span>
                                                <span className="lightbox-media-cta__hint">Click to explore</span>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
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
