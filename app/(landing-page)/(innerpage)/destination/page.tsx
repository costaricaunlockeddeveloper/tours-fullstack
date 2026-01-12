import React from 'react';
import BreadCumb from '../../../../Components/Common/BreadCumb';
import Destination1 from '../../../../Components/Destination/Destination1';
import Story1 from '../../../../Components/Story/Story1';
import FeaturedTour1 from '../../../../Components/FeaturedTour/FeaturedTour1';

const page = () => {
  return (
    <div>
             <BreadCumb
                bgimg="/assets/img/breadcrumb/breadcrumb.jpg"
                Title="Destination"
            ></BreadCumb>    
            <Destination1></Destination1> 
             {/* <Story1></Story1>  
             <FeaturedTour1></FeaturedTour1>                 */}
    </div>
  );
};

export default page;