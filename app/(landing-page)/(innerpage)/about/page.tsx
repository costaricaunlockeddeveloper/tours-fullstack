import React from 'react';
import BreadCumb from '../../../../Components/Common/BreadCumb';
import About2 from '../../../../Components/About/About2';
import Choose1 from '../../../../Components/Choose/Choose1';
import Counter4 from '../../../../Components/Counter/Counter4';

import Testimonial3 from '../../../../Components/Testimonial/Testimonial3';


const page = () => {
  return (
    <div>
            <BreadCumb
                bgimg="/assets/img/breadcrumb/breadcrumb.jpg"
                Title="About Us"
            ></BreadCumb>  
            <About2></About2>   
            <Choose1></Choose1> 
            <Counter4></Counter4>

            <Testimonial3></Testimonial3>

    </div>
  );
};

export default page;