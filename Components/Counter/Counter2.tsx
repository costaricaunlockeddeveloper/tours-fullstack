"use client"
import React, { useEffect } from 'react';
import loadBackgroudImages from '../Common/loadBackgroudImages';
import Link from 'next/link';
import Image from 'next/image';

const Counter2 = () => {

         useEffect(() => {
             loadBackgroudImages();
         }, []);   

    return (
        <section className="cta-offer-section section-padding fix bg-cover" data-background="/assets/img/offer/bg2.jpg" >
            <div className="container">
                <div className="cta-offer-wrapper">
                    <div className="row g-4">
                        <div className="col-lg-6">
                            <div className="offer-content">
                                <div className="section-title">
                                    <span className="sub-title text-white wow fadeInUp">LIMITED TIME DEALS</span>
                                    <h2 className="text-white wow fadeInUp" data-wow-delay=".2s">
                                        Save Up to 20% on <br/>
                                        Season Packages
                                    </h2>
                                </div>
                                <div className="coming-soon-timer">
                                    <div className="timer-content wow fadeInUp" data-wow-delay=".2s">
                                        <h3 id="day">05</h3>
                                        <p>Days</p>
                                    </div>
                                    <div className="timer-content wow fadeInUp" data-wow-delay=".4s">
                                        <h3 id="hour">12</h3>
                                        <p>HRS</p>
                                    </div>
                                    <div className="timer-content wow fadeInUp" data-wow-delay=".6s">
                                        <h3 id="min">30</h3>
                                        <p>MINS</p>
                                    </div>
                                    <div className="timer-content wow fadeInUp" data-wow-delay=".8s">
                                        <h3 id="sec">00</h3>
                                        <p>SECS</p>
                                    </div>
                                </div>
                                <Link href="/tour-packages" className="theme-btn wow fadeInUp" data-wow-delay=".9s">Claim Your Offer<i className="bi bi-arrow-right"></i></Link>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="offer-image">
                                <Image src="/assets/img/offer/circle.jpg" alt="img" width={386} height={260}   />
                                <div className="circle">
                                    <div className="text-item">
                                        <div className="icon">
                                            <Link href="/tour-packages">
                                                <Image src="/assets/img/icon/16.svg" alt="img" width={70} height={51}   />
                                            </Link>
                                        </div>
                                        <div className="image">
                                            <Image src="/assets/img/offer/text.png" alt="img" width={212} height={216}   />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Counter2;