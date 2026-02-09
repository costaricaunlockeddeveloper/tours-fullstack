import React from 'react';
import BreadCumb from '../../../../client/sections/shared/common/BreadCumb';
import Tour from '../../../../Components/Tour/Tour';

const page = () => {
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

export default page;