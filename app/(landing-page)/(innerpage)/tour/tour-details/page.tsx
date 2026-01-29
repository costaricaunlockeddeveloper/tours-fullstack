import React from 'react';
import TourHero from '../../../../../Components/TourDetails/TourHero';
import TourDetails from '../../../../../Components/TourDetails/TourDetails';

const page = () => {
  return (
    <div>
            <TourHero
                title="Ghorepani Poon Hill Trek"
                description='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.'
                rating={4.5}
                reviews={120}
                images={['/assets/img/destination/01.jpg', '/assets/img/destination/01.jpg', '/assets/img/destination/01.jpg', '/assets/img/destination/01.jpg', '/assets/img/destination/01.jpg', '/assets/img/destination/01.jpg']}
            ></TourHero>    
            <TourDetails></TourDetails>        
    </div>
  );
};

export default page;