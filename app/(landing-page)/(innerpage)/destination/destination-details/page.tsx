import React from 'react';
import DestinationHero from '../../../../../Components/DestinationDetails/DestinationHero';
import DestinationDetails from '../../../../../Components/DestinationDetails/DestinationDetails';

const page = () => {
  return (
    <div>
            <DestinationHero
                title="Manuel Antonio National Park"
                climate="🏖️ Beach & Wildlife"
                region="Puntarenas"
                province="Costa Rica"
                description='Consectetur adipisicing elit sed do eiusmod tempor is incididunt ut labore et dolore of magna aliqua. ut enim ad minim veniam made of owl the quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea dolor commodo consequat duis aute irure and dolor in reprehenderit.Nullam semper quam mauris nec mollis felis aliquam eu ut non gravida mi quam mauris nec mollis felis aliquam eu ut phasellus.'
            ></DestinationHero>    
            <DestinationDetails></DestinationDetails>       
    </div>
  );
};

export default page;