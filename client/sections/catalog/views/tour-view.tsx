import React from 'react';
import BreadCumb from '../../shared/common/BreadCumb';
import Tour from '../components/Tour/Tour';

const TourView = () => {
    return (
        <div>
             <BreadCumb
                bgimg="/assets/img/breadcrumb/tour.jpg"
                Title="Tour"
            ></BreadCumb>    
              <Tour></Tour>       
        </div>
    );
};

export default TourView;
