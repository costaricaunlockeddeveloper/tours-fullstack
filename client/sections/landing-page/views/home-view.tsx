import HeroBanner3 from '../components/home/HeroBanner3';
import Destination3 from '../components/home/Destination3';
import About3 from '../components/home/About3';
import Counter2 from '../components/home/Counter2';
import Testimonial3 from '../components/home/Testimonial3';
import Cta4 from '../components/home/Cta4';
import Faq1 from '../components/home/Faq1';
import HomeMapSection from '../components/home/HomeMapSection';

const HomeView = () => {
    return (
        <div>
            <HeroBanner3></HeroBanner3>
            <HomeMapSection />
            <Destination3></Destination3>
            <About3></About3>
            <Counter2></Counter2>
            <Testimonial3></Testimonial3>
            <Cta4></Cta4>
            <Faq1></Faq1>
        </div>
    );
};

export default HomeView;