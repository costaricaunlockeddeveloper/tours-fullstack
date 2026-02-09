"use client"
import Image from 'next/image';
import React from 'react';

const Contact = () => {
    return (
        <div>
            
         <section className="contact-us-section fix section-padding">
            <div className="container">
                <div className="row justify-content-center">
                    {/* Address Box - Hidden as requested */}
                    {/* <div className="col-xl-4 col-lg-6 col-md-6">
                        <div className="contact-us-main">
                            <div className="contact-box-items">
                                <div className="icon">
                                    <Image src="/assets/img/icon/18.svg" alt="img" width={70} height={70}   />
                                </div>
                                <div className="content">
                                    <h3>
                                        Our Address
                                    </h3>
                                    <p>
                                        2464 Royal Ln. Mesa, New Jersey 45463.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <div className="col-xl-4 col-lg-6 col-md-6">
                        <div className="contact-us-main style-2">
                            <div className="contact-box-items">
                                <div className="icon">
                                    <Image src="/assets/img/icon/19.svg" alt="img" width={70} height={70}   />
                                </div>
                                <div className="content">
                                    <h3 style={{ fontSize: '20px' }}>
                                        <a href="mailto:costaricaunlocked@gmail.com">costaricaunlocked@gmail.com</a>
                                    </h3>
                                    <p>
                                        Email us anytime for any kind <br/> of query.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-6 col-md-6">
                        <div className="contact-us-main">
                            <div className="contact-box-items">
                                <div className="icon">
                                    <Image src="/assets/img/icon/20.svg" alt="img" width={70} height={70}   />
                                </div>
                                <div className="content">
                                    <h3>
                                        <a href="tel:+50671320030">+506 7132-0030</a>
                                    </h3>
                                    <p>
                                        Call us any kind support, we will wait for it.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         </section>           

          <section className="contact-us-section-2 fix" style={{ backgroundColor: 'var(--brand-blue)' }}>
            <div className="container">
                <div className="contact-us-wrapper">
                    <div className="row g-4">
                        <div className="col-lg-6">
                            <div className="contact-us-contact">
                                <div className="section-title">
                                    <span className="sub-title text-white wow fadeInUp" style={{ color: 'rgba(255,255,255,0.7) !important' }}>
                                        Contact us
                                    </span>
                                    <h2 className=" text-white wow fadeInUp wow" data-wow-delay=".2s">
                                        Send Message Anytime
                                    </h2>
                                </div>
                                <div className="comment-form-wrap">
                                    <form action="#" id="contact-form" method="POST">
                                        <div className="row g-4">
                                            <div className="col-lg-6">
                                                <div className="form-clt">
                                                    <input type="text" name="name" id="name" placeholder="Your Name" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }} />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="form-clt">
                                                    <input type="text" name="email" id="email4" placeholder="Your Email" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }} />
                                                </div>
                                            </div>
                                            <div className="col-lg-12">
                                                <div className="form-clt">
                                                   <input type="text" name="subject" id="subject" placeholder="Subject" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }} />
                                                </div>
                                            </div>
                                            <div className="col-lg-12">
                                                <div className="form-clt">
                                                    <textarea name="message" id="message" placeholder="Your Message" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}></textarea>
                                                </div>
                                            </div>
                                            <div className="col-lg-12">
                                                <button type="submit" className="theme-btn submit-btn-custom">
                                                    Submit Message
                                                </button>
                                            </div>
                                            <style jsx>{`
                                                .submit-btn-custom {
                                                    background-color: white !important;
                                                    color: var(--brand-blue) !important;
                                                    border: 1px solid white !important;
                                                    transition: all 0.4s ease !important;
                                                }
                                                .submit-btn-custom:hover {
                                                    color: white !important;
                                                    background-color: transparent !important;
                                                }
                                                .submit-btn-custom::before {
                                                    background-color: var(--brand-blue) !important;
                                                }
                                            `}</style>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="map-area">
                                <div className="google-map">
                                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15721.49392688408!2d-84.0907246!3d9.9333333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0e342c51361c5%3A0xed770854c1d4414!2sSan%20Jos%C3%A9%2C%20Costa%20Rica!5e0!3m2!1sen!2scr!4v1707010000000!5m2!1sen!2scr" loading="lazy"></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         </section>           
        </div>
    );
};

export default Contact;