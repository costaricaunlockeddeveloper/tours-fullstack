import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Cta4 = () => {
    return (
        <section className="cta-section section-padding fix">
            <div className="container">
                <div className="row g-4">
                    {/* Box 1: Destinations - Focus on "The Vision" */}
                    <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".3s">
                        <div className="cta-box-items">
                            <div className="cta-content">
                                <h3>
                                    HIDDEN <br/>
                                    PARADISES
                                </h3>
                                <div className="shape">
                                    <Image src="/assets/img/megh.png" alt="shape" width={173} height={46} />
                                </div>
                                <Link href="/destination" className="theme-btn">Explore Destinations</Link>
                            </div>
                            <div className="cta-image">
                                <Image src="/assets/img/bag.png" alt="img" width={192} height={234} />
                            </div>
                        </div>
                    </div>

                    {/* Box 2: Tours - Focus on "The Adventure" */}
                    <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".5s">
                        <div className="cta-box-items style-2">
                            <div className="cta-content">
                                <h3>
                                    EPIC DAY <br/>
                                    TOURS
                                </h3>
                                <Link href="/tour" className="theme-btn">View Experiences</Link>
                            </div>
                            <div className="cta-image">
                                <Image src="/assets/img/cta-plane.png" alt="img" width={241} height={250} />
                            </div>
                        </div>
                    </div>

                    {/* Box 3: Packages - Focus on "The Full Experience" */}
                    <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".7s">
                        <div className="cta-box-items style-2 bg-color">
                            <div className="cta-content">
                                <h3>
                                    PURA VIDA <br/>
                                    PACKAGES
                                </h3>
                                <Link href="/tour-packages" className="theme-btn">Unlock Paradise</Link>
                            </div>
                            <div className="cta-image">
                                <Image src="/assets/img/cta-bag.png" alt="img" width={210} height={236} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section> 
    );
};

export default Cta4;