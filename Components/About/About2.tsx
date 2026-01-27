import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const About2 = () => {
    return (
<section className="about-section section-padding fix">
            <div className="container">
                <div className="about-wrapper-2">
                    <div className="row g-4">
                        <div className="col-lg-6">
                            <div className="about-image">
                                <div style={{ width: '330px', height: '512px' }}>
                                    <Image 
                                        src="/assets/img/about/male-backpacker.jpg" 
                                        className="wow img-custom-anim-left" 
                                        alt="img" 
                                        width={330} 
                                        height={512} 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} 
                                    />
                                </div>
                                <div className="shape-image float-bob-y">
                                    <Image src="/assets/img/about/miniature-people.jpg" alt="img" width={196} height={109}   />
                                </div>
                                <div className="group-image float-bob-x">
                                    <Image src="/assets/img/about/group.png" alt="img" width={170} height={50}   />
                                </div>
                                <div className="about-image-2">
                                    <Image src="/assets/img/about/waterfall.jpg" className="wow img-custom-anim-top" alt="img" width={284} height={411}   />
                                    <div className="plane-shape">
                                        <Image src="/assets/img/about/plane-shape2.png" alt="img" width={370} height={205}   />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="about-content">
                                <div className="section-title">
                                    <span className="sub-title wow fadeInUp">
                                        Our Essence
                                    </span>
                                    <h2 className="wow fadeInUp wow" data-wow-delay=".3s">
                                        We Unlock the Costa Rica Ordinary Tourists Never See
                                    </h2>
                                </div>
                                <p className="wow fadeInUp wow" data-wow-delay=".5s">
                                    At Costa Rica Unlocked, we don't just organize trips; we create master keys to the country's most pristine corners. Our mission is to take you off the beaten path so you can experience the true "Pura Vida" through the eyes of those who call this paradise home.
                                </p>
                                <div className="about-items wow fadeInUp wow" data-wow-delay=".3s">
                                    <div className="about-icon-items" style={{ minWidth: '220px' }}>
                                        <div className="icon">
                                            <i className="bi bi-check-circle-fill" style={{ color: 'var(--theme)', fontSize: '24px' }}></i>
                                        </div>
                                        <div className="content">
                                            <h5>
                                                Off-the-Radar Routes
                                            </h5>
                                        </div>
                                    </div>
                                    <div className="text">
                                        <p>
                                            Exclusive access to secret trails and natural wonders that don't appear in conventional guidebooks.
                                        </p>
                                    </div>
                                </div>
                                <div className="about-items wow fadeInUp wow" data-wow-delay=".5s">
                                    <div className="about-icon-items" style={{ minWidth: '220px' }}>
                                        <div className="icon">
                                            <i className="bi bi-check-circle-fill" style={{ color: 'var(--theme)', fontSize: '24px' }}></i>
                                        </div>
                                        <div className="content">
                                            <h5>
                                                Handpicked Hotels
                                            </h5>
                                        </div>
                                    </div>
                                    <div className="text">
                                        <p>
                                            We offer the best curated accommodations, from luxury resorts to charming boutique stays.
                                        </p>
                                    </div>
                                </div>
                                <Link href="/about" className="theme-btn wow fadeInUp wow" data-wow-delay=".7s">Start the Adventure<i className="bi bi-arrow-right"></i></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About2;