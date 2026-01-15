"use client"
import { useEffect } from "react";
import loadBackgroudImages from "../Common/loadBackgroudImages";

interface TourPackageHeroProps {
    title: string;
    bgimg: string;
    difficulty: string;
    duration_days: number;
    duration_nights: number;
}

const TourPackageHero = ({ title, bgimg, difficulty, duration_days, duration_nights }: TourPackageHeroProps) => {
    
    useEffect(() => {
        loadBackgroudImages();
    }, []);

    return (
        <section className="breadcrumb-wrapper fix bg-cover" data-background={bgimg}>
            <div className="container">
                <div className="row">
                    <div className="page-heading">
                        {/* Badge Superior: Difficulty + Duration */}
                        <div className="breadcrumb-list mb-6 text-white">
                            <span>{difficulty}</span>
                            <span className="mx-3">•</span>
                            <span>{duration_days} Days / {duration_nights} Nights</span>
                        </div>

                        {/* Package Title */}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 leading-tight">
                            {title}
                        </h1>

                        {/* No location icon as per user request */}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TourPackageHero;
