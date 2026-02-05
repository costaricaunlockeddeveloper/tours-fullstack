import React from 'react';
import BreadCumb from '../../../../Components/Common/BreadCumb';
import Contact from '../../../../Components/Contact/Contact';

const page = () => {
  return (
    <div>
            <BreadCumb
                bgimg="/assets/img/breadcrumb/contact-us.jpg"
                Title="Contact Us"
            ></BreadCumb>
            <Contact></Contact>        
    </div>
  );
};

export default page;