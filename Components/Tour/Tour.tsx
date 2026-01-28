import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Tour = () => {

    const destinationContent = [
        {img:'/assets/img/destination/01.jpg', location:'Indonesia', title:'Brooklyn Beach Resort Tour', rating:'4.7', day:'4 hours', capacity:'50+', price:'$59.00'},      
        {img:'/assets/img/destination/02.jpg', location:'Indonesia', title:'Pak Chumphon Town Tour ', rating:'4.7', day:'4 hours', capacity:'50+', price:'$59.00'},      
        {img:'/assets/img/destination/03.jpg', location:'Indonesia', title:'Java & Bali One Life Adventure', rating:'4.7', day:'4 hours', capacity:'50+', price:'$59.00'},      
        {img:'/assets/img/destination/04.jpg', location:'Indonesia', title:'Places To Travel In November', rating:'4.7', day:'4 hours', capacity:'50+', price:'$59.00'},      
        {img:'/assets/img/destination/01.jpg', location:'Indonesia', title:'Brooklyn Beach Resort Tour', rating:'4.7', day:'4 hours', capacity:'50+', price:'$59.00'},      
        {img:'/assets/img/destination/02.jpg', location:'Indonesia', title:'Pak Chumphon Town Tour ', rating:'4.7', day:'4 hours', capacity:'50+', price:'$59.00'},      
        {img:'/assets/img/destination/03.jpg', location:'Indonesia', title:'Java & Bali One Life Adventure', rating:'4.7', day:'4 hours', capacity:'50+', price:'$59.00'},      
        {img:'/assets/img/destination/04.jpg', location:'Indonesia', title:'Places To Travel In November', rating:'4.7', day:'4 hours', capacity:'50+', price:'$59.00'},       
        {img:'/assets/img/destination/01.jpg', location:'Indonesia', title:'Places To Travel In November', rating:'4.7', day:'4 hours', capacity:'50+', price:'$59.00'},          
      ]; 


    return (
        <section className="tour-section section-padding fix">
            <div className="container custom-container">
                <div className="tour-destination-wrapper">
                    <div className="row g-4">
                        <div className="col-xl-8">
                            <div className="row g-4">
                            {destinationContent.map((item, i) => (
                                <div key={i} className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp wow" data-wow-delay=".3s">
                                    <div className="destination-card-items mt-0">
                                        <div className="destination-image">
                                             <Image src={item.img} alt="img" width={287} height={240}   />
                                        </div>
                                        <div className="destination-content">
                                            <ul className="meta">
                                                <li>
                                                <i className="bi bi-geo-alt"></i>
                                                    {item.location}
                                                </li>
                                            </ul>
                                            <h5>
                                            <Link href="/tour/tour-details">
                                                {item.title}
                                                </Link>
                                            </h5>
                                            <ul className="info">
                                                <li>
                                                <i className="bi bi-clock"></i>
                                                    {item.day}
                                                </li>
                                                <li>
                                                <i className="bi bi-person"></i>
                                                {item.capacity}
                                                </li>
                                            </ul>
                                            <div className="price">
                                                <h6>{item.price}</h6>
                                                <Link href="/tour/tour-details" className="theme-btn style-2">Book Now<i className="bi bi-arrow-right"></i></Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                ))}

                            </div>
                            <div className="page-nav-wrap text-center">
                                <ul>
                                    <li><a className="page-numbers" href="#"><i className="bi bi-arrow-left"></i></a></li>
                                    <li><a className="page-numbers" href="#">01</a></li>
                                    <li><a className="page-numbers" href="#">02</a></li>
                                    <li><a className="page-numbers" href="#">03</a></li>
                                    <li><a className="page-numbers" href="#"><i className="bi bi-arrow-right"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Tour;