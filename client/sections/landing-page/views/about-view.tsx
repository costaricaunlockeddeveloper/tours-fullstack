import BreadCumb from '../../shared/common/BreadCumb';
import About2 from '../components/about/About2';
import Choose1 from '../components/about/Choose1';
import Counter4 from '../components/about/Counter4';

import Testimonial3 from '../components/home/Testimonial3';


const AboutView = () => {
  return (
    <div>
            <BreadCumb
                bgimg="/assets/img/breadcrumb/about-us.jpg"
                Title="About Us"
            ></BreadCumb>  
            <About2></About2>   
            <Choose1></Choose1> 
            <Counter4></Counter4>
            <Testimonial3></Testimonial3>
    </div>
  );
};

export default AboutView;