import React from 'react';
import BreadCumb from '../../shared/common/BreadCumb';
import TourPackages from '../components/TourPackages/TourPackages';

const TourPackagesView = () => {
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

export default TourPackagesView;
