import React from 'react';
import TourHero from '../../../../../Components/TourDetails/TourHero';
import TourDetails from '../../../../../Components/TourDetails/TourDetails';

const page = () => {
  return (
    <div>
            <TourHero
                bgimg="/assets/img/breadcrumb/breadcrumb.jpg"
                title="Ghorepani Poon Hill Trek"
                difficulty="🟢 Easy"
                duration="7 hours"
                location="Puntarenas, Costa Rica"
            ></TourHero>    
            <TourDetails></TourDetails>        
    </div>
  );
};

export default page;