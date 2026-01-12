"use client"
import { useEffect } from "react";
import loadBackgroudImages from "../Common/loadBackgroudImages";

interface DestinationHeroProps {
    title: string;
    bgimg: string;
    climate: string;
    region: string;
    province: string;
}

const DestinationHero = ({ title, bgimg, climate, region, province }: DestinationHeroProps) => {
    
    useEffect(() => {
        loadBackgroudImages();
    }, []);

    return (
        <section className="breadcrumb-wrapper fix bg-cover" data-background={bgimg}>
            <div className="container">
                <div className="row">
                    <div className="page-heading">
                        {/* Climate Badge - Using breadcrumb styling */}
                        <div className="breadcrumb-list mb-6 text-white">
                            <span>{climate}</span>
                        </div>

                        {/* Destination Title */}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 leading-tight">
                            {title}
                        </h1>

                        {/* Location - Simple & Clean */}
                        <div className="flex items-center gap-4 text-lg font-medium text-white space-x-2">
                            <i className="bi bi-geo-alt-fill text-[#d4494c]"></i>
                            <span>{region}, {province}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DestinationHero;
