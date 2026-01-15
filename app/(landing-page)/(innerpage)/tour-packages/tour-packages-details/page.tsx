import React from 'react';
import TourPackageHero from '../../../../../Components/TourPackageDetails/TourPackageHero';
import TourPackageDetails from '../../../../../Components/TourPackageDetails/TourPackageDetails';

const page = () => {
  return (
    <div>
            <TourPackageHero
                bgimg="/assets/img/breadcrumb/breadcrumb.jpg"
                title="Costa Rica Esencial: Volcán Arenal & Playa Manuel Antonio"
                difficulty="🟢 Easy"
                duration_days={7}
                duration_nights={6}
            ></TourPackageHero>    
            <TourPackageDetails></TourPackageDetails>        
    </div>
  );
};

export default page;
