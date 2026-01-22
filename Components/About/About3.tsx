"use client"
import React, { useEffect } from 'react';
import loadBackgroudImages from '../Common/loadBackgroudImages';
import Image from 'next/image';

const About3 = () => {

            useEffect(() => {
                loadBackgroudImages();
            }, []);

    return (
        <section className="about-section section-padding bg-color" data-background="/assets/img/about/about-bg-2.jpg" >
            <div className="container">
                <div className="left-shape float-bob-x">
                    <Image src="/assets/img/about/bag-shape.png" alt="img" width={204} height={195}   />
                </div>
                <div className="about-wrapper-3">
                    <div className="row g-4 align-items-center">
                        <div className="col-lg-6">
                            <div className="about-image wow fadeInUp" data-wow-delay=".3s">
                                <Image src="/assets/img/about/06.jpg" alt="img" width={450} height={449}   />
                                <div className="about-image-2 wow fadeInUp" data-wow-delay=".5s">
                                    <Image src="/assets/img/about/07.jpg" alt="img" width={350} height={350}   />
                                    <div className="plane-shape float-bob-y">
                                        <Image src="/assets/img/about/plane-shape3.png" alt="img" width={335} height={357}   />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="about-content">
                                <div className="section-title">
                                    <span className="sub-title wow fadeInUp">Unlock Costa Rica</span>
                                    <h2 className="wow fadeInUp" data-wow-delay=".3s">
                                        Expertly Curated Journeys <br/>
                                        Through Tropical Paradise
                                    </h2>
                                </div>
                                <p className="wow fadeInUp" data-wow-delay=".5s">
                                    At Costa Rica Unlocked, we don't just plan trips; we craft authentic experiences. Our local expertise ensures you unlock the most breathtaking hidden gems, from mist-covered cloud forests to sun-drenched coastal escapes.
                                </p>
                                <div className="about-items wow fadeInUp" data-wow-delay=".3s">
                                    <div className="about-icon-items">
                                        <div className="icon">
                                            <Image src="/assets/img/icon/13.svg" alt="img" width={37} height={41}   />
                                        </div>
                                        <div className="content">
                                            <h4>
                                                Tailored Itineraries
                                            </h4>
                                            <p>
                                                Custom-built travel plans that match your pace, <br/>
                                                style, and sense of adventure.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="about-items wow fadeInUp" data-wow-delay=".5s">
                                    <div className="about-icon-items">
                                        <div className="icon">
                                            <Image src="/assets/img/icon/14.svg" alt="img" width={40} height={41}   />
                                        </div>
                                        <div className="content">
                                            <h4>
                                                Local Insider Access
                                            </h4>
                                            <p>
                                                Explore off-the-beaten-path destinations <br/>
                                                with our deep network of local guides.
                                            </p>
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

export default About3;