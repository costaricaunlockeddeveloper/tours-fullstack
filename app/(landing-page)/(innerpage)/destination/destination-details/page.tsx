import React from 'react';
import DestinationHero from '../../../../../Components/DestinationDetails/DestinationHero';
import DestinationDetails from '../../../../../Components/DestinationDetails/DestinationDetails';

const page = () => {
  return (
    <div>
            <DestinationHero
                bgimg="/assets/img/breadcrumb/breadcrumb.jpg"
                title="Manuel Antonio National Park"
                climate="🏖️ Beach & Wildlife"
                region="Puntarenas"
                province="Costa Rica"
            ></DestinationHero>    
            <DestinationDetails></DestinationDetails>       
    </div>
  );
};

export default page;