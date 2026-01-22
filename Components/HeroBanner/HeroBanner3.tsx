"use client"
import React, { useEffect } from 'react';
import loadBackgroudImages from '../Common/loadBackgroudImages';
import Slider from 'react-slick';
import parse from 'html-react-parser';
import Link from 'next/link';

const HeroBanner3 = () => {

    const heroContent = [
        {
            img: '/assets/img/hero/03.jpg', 
            subtitle: 'Start Your Journey', 
            title: 'Unlock Your Ultimate <br> Costa Rica Adventure', 
            content: 'From mist-covered cloud forests to sun-drenched beaches, discover the heart of Pura Vida with our expertly curated tours and packages.'
        },              
        {
            img: '/assets/img/hero/04.jpg', 
            subtitle: 'Hand-Picked Experiences', 
            title: 'Authentic Local Tours <br> Tailored Only For You', 
            content: 'Don\'t just visit Costa Rica—experience it. We connect you with hidden gems and professional guides to ensure your trip is truly unforgettable.'
        },              
        {
            img: '/assets/img/hero/03.jpg', 
            subtitle: 'The Pura Vida Life', 
            title: 'Seamless Packages For <br> Stress-Free Travel', 
            content: 'We handle every detail from transfers to excursions, so you can focus on making memories in the world\'s most beautiful natural paradise.'
        },              
      ];     

       useEffect(() => {
         loadBackgroudImages();
     }, []);
 
     const settings = {
         dots: false,
         infinite: true,
         fade: true,
         speed: 2000,
         slidesToShow: 1,
         slidesToScroll: 1,
         arrows: false,
         autoplay: true,
         autoplaySpeed: 4000,        
         responsive: [
           {
             breakpoint: 1399,
             settings: {
               slidesToShow: 1,
             }
           },
           {
             breakpoint: 1199,
             settings: {
               slidesToShow: 1,
             }
           },{
             breakpoint: 575,
             settings: {
               slidesToShow: 1,
             }
           }
         ]
       };       

    return (
        <section className="hero-section hero-3">
            <div className="swiper hero-slider-3">
                <div className="swiper-wrapper">
                <Slider {...settings}>
                {heroContent.map((item, i) => (
                    <div key={i} className="swiper-slide">
                        <div className="hero-image bg-cover" data-background={item.img}></div>
                        <div className="container">
                                <div className="row justify-content-center">
                                    <div className="col-lg-8">
                                        <div className="hero-content">
                                            <div className="sub-title" data-animation="fadeInUp" data-delay="1.2s">
                                            {item.subtitle}
                                            </div>
                                            <h1 data-animation="fadeInUp" data-delay="1.4s">
                                                {parse(item.title)}
                                            </h1>
                                            <p data-animation="fadeInUp" data-delay="1.6s">
                                            {item.content}
                                            </p>
                                            <div className="about-button" data-animation="fadeInUp" data-delay="1.8s">
                                                <Link href="/tour" className="theme-btn">Explore Tours<i className="bi bi-arrow-right"></i></Link>
                                                <Link href="/tour-packages" className="theme-btn style-2">View Packages<i className="bi bi-arrow-right"></i></Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </div>
                     </div>
                ))}
                 </Slider>

                   </div>
                   <div className="swiper-dot">
                      <div className="dot2"></div>
                   </div>
            </div>
        </section>
    );
};

export default HeroBanner3;