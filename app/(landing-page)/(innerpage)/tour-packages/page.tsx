import React from 'react';
import BreadCumb from '../../../../client/sections/shared/common/BreadCumb';
import TourPackages from '../../../../Components/TourPackages/TourPackages';

const page = () => {
  return (
    <div>
             <BreadCumb
                bgimg="/assets/img/breadcrumb/tour-packages.jpg"
                Title="Tour Packages"
            ></BreadCumb>    
              <TourPackages></TourPackages>       
    </div>
  );
};

export default page;
