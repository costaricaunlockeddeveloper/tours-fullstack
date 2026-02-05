import React from 'react';
import TourPackageHero from '../../../../../Components/TourPackageDetails/TourPackageHero';
import TourPackageDetails from '../../../../../Components/TourPackageDetails/TourPackageDetails';

const page = () => {
  return (
    <div>
            <TourPackageHero
                title="Costa Rica Esencial: Volcán Arenal & Playa Manuel Antonio"
                location="La Fortuna & Manuel Antonio, Costa Rica"
                description="Experience the best of Costa Rica with this carefully curated 7-day adventure package. From the majestic Arenal Volcano to the pristine beaches of Manuel Antonio, this journey combines natural wonders, thrilling activities, and ultimate relaxation. Perfect for couples, families, and adventure seekers looking to explore Costa Rica's diverse landscapes and rich biodiversity in comfort and style."
                images={[
                    '/assets/img/destination/01.jpg',
                    '/assets/img/destination/02.jpg',
                    '/assets/img/destination/03.jpg',
                    '/assets/img/destination/04.jpg',
                    '/assets/img/destination/01.jpg'
                ]}
            />
            <TourPackageDetails />       
    </div>
  );
};

export default page;
