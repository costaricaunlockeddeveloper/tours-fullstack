import React from 'react';
import BreadCumb from '../../../../Components/Common/BreadCumb';
import TourPackages from '../../../../Components/TourPackages/TourPackages';

const page = () => {
  return (
    <div>
             <BreadCumb
                bgimg="/assets/img/breadcrumb/breadcrumb.jpg"
                Title="Tour Packages"
            ></BreadCumb>    
              <TourPackages></TourPackages>       
    </div>
  );
};

export default page;
