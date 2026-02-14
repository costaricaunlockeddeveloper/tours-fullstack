"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageGalleryProps {
    images: string[];
    height?: string; // Tailwind class, e.g., "h-[300px]" or "h-64"
    className?: string;
    alt: string;
}

export default function ImageGallery({
    images = [],
    height = "h-[400px]",
    className = "",
    alt
}: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Filter valid images (just in case)
    const validImages = images.filter(Boolean);
    const hasImages = validImages.length > 0;
    const isMultiple = validImages.length > 1;

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % validImages.length);
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
    };

    if (!hasImages) {
        return (
            <div className={`relative w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-dark-2 flex items-center justify-center text-dark-6 ${height} ${className}`}>
                <div className="flex flex-col items-center gap-2">
                    <svg className="w-10 h-10 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span className="text-sm font-medium">Sin imágenes disponibles</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative w-full overflow-hidden rounded-2xl group ${height} ${className}`}>
            <Image
                src={validImages[currentIndex]}
                alt={`${alt} - Image ${currentIndex + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority={currentIndex === 0}
            />

            {/* Overlay Gradient for better text visibility if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {isMultiple && (
                <>
                    {/* Navigation Arrows */}
                    <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm transform hover:scale-110"
                        aria-label="Previous image"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </button>

                    <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm transform hover:scale-110"
                        aria-label="Next image"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>

                    {/* Indicators/Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-md">
                        {validImages.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"
                                    }`}
                                aria-label={`Go to image ${idx + 1}`}
                            />
                        ))}
                    </div>

                    {/* Counter Badge */}
                    <div className="absolute top-4 right-4 bg-black/50 text-white text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                        {currentIndex + 1} / {validImages.length}
                    </div>
                </>
            )}
        </div>
    );
}
