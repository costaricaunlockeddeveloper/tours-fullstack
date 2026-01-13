"use client"
import { useEffect } from "react";
import loadBackgroudImages from "../Common/loadBackgroudImages";

interface TourHeroProps {
    title: string;
    bgimg: string;
    difficulty: string;
    duration: string;
    location: string;
}

const TourHero = ({ title, bgimg, difficulty, duration, location }: TourHeroProps) => {
    
    useEffect(() => {
        loadBackgroudImages();
    }, []);

    return (
        <section className="breadcrumb-wrapper fix bg-cover" data-background={bgimg}>
            <div className="container">
                <div className="row">
                    <div className="page-heading">
                        {/* Difficulty Badge */}
                        <div className="breadcrumb-list mb-6 text-white">
                            <span>{difficulty}</span>
                            {duration && (
                                <>
                                    <span className="mx-3">•</span>
                                    <span>{duration}</span>
                                </>
                            )}
                        </div>

                        {/* Tour Title */}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 leading-tight">
                            {title}
                        </h1>

                        {/* Location - Simple & Clean */}
                        <div className="flex items-center gap-4 text-lg font-medium text-white space-x-2">
                            <i className="bi bi-geo-alt-fill text-[#d4494c]"></i>
                            <span>{location}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TourHero;
