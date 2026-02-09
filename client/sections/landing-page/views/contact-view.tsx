import React from 'react';
import BreadCumb from '../../shared/common/BreadCumb';
import Contact from '../components/contact/Contact';

const ContactView = () => {
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

export default ContactView;