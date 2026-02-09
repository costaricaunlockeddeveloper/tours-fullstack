"use client"
import React, { useEffect } from 'react';
import loadBackgroudImages from '../common/loadBackgroudImages';
import Link from 'next/link';

const Footer1 = () => {

    useEffect(() => {
        loadBackgroudImages();
    }, []);

    return (
        <footer className="footer-section fix bg-linear-to-b from-[#0A1F24] via-[#0D282E] to-[#1f4d85]">
            <div className="container">
                <div className="footer-widget-wrapper-new py-16">
                    <div className="row" style={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                        {/* Logo & Newsletter Column */}
                        <div className="col-xl-4 col-lg-5 col-md-8 col-sm-6 wow fadeInUp" data-wow-delay=".2s">
                            <div className="text-center">
                                <div className="widget-head mb-6 flex justify-center">
                                    <Link href="/">
                                        <img src="/assets/img/logo/white-log.svg" alt="Costa Rica Unlocked" style={{ width: "170px", filter: "brightness(0) invert(1)" }} className="mx-auto" />
                                    </Link>
                                </div>
                                <div>
                                    <style jsx>{`
                                        .insta-btn {
                                            background-color: transparent !important;
                                        }
                                        .insta-btn:hover {
                                            background-color: transparent !important;
                                        }
                                    `}</style>
                                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                        <a 
                                            href="https://www.instagram.com/costaricaunlocked?igsh=MWs4c3pqNmd4M3R0aw==" 
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="insta-btn"
                                            style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '10px',
                                                padding: '10px 24px',
                                                borderRadius: '50px', 
                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                transition: 'all 0.3s ease',
                                                textDecoration: 'none'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ffffff" viewBox="0 0 16 16">
                                                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                                            </svg>
                                            <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>@costaricaunlocked</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links Column */}
                        <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 ps-lg-5 wow fadeInUp" data-wow-delay=".4s">
                            <div className="single-widget-items">
                                <div className="widget-head mb-6">
                                   <h4 className="text-white text-lg font-semibold">Quick Links</h4>
                                </div>
                                <ul className="list-items space-y-3">
                                    <li><Link href="/" className="text-white/70 hover:text-[#1ca8cb] transition-colors">Home</Link></li>
                                    <li><Link href="/about" className="text-white/70 hover:text-[#1ca8cb] transition-colors">About Us</Link></li>
                                    <li><Link href="/destination" className="text-white/70 hover:text-[#1ca8cb] transition-colors">Destinations</Link></li>
                                    <li><Link href="/tour" className="text-white/70 hover:text-[#1ca8cb] transition-colors">Tours</Link></li>
                                    <li><Link href="/tour-packages" className="text-white/70 hover:text-[#1ca8cb] transition-colors">Tour Packages</Link></li>
                                    <li><Link href="/contact" className="text-white/70 hover:text-[#1ca8cb] transition-colors">Contact</Link></li>
                                </ul>
                            </div>
                        </div>

                        {/* Contact Column */}
                        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 ps-xl-5 wow fadeInUp" data-wow-delay=".6s">
                            <div className="single-widget-items">
                                <div className="widget-head mb-6">
                                   <h4 className="text-white text-lg font-semibold">Contact Us</h4>
                                </div>
                                <div className="contact-info space-y-4">
                                    {/* <div className="contact-items flex items-start gap-3">
                                        <div className="icon w-10 h-10 rounded-full bg-[#1ca8cb]/20 flex items-center justify-center shrink-0">
                                            <i className="bi bi-geo-alt-fill text-[#1ca8cb]"></i>
                                        </div>
                                        <div className="content">
                                            <p className="text-white text-sm">San José, Costa Rica <br/>
                                                Central America
                                            </p>
                                        </div>
                                    </div> */}
                                    <div className="contact-items flex items-start gap-3">
                                        <div className="icon w-10 h-10 rounded-full bg-[#1ca8cb]/20 flex items-center justify-center shrink-0">
                                            <i className="bi bi-envelope-fill text-[#1ca8cb]"></i>
                                        </div>
                                        <div className="content">
                                            <a href="mailto:costaricaunlocked@gmail.com" className="text-white hover:text-[#1ca8cb] transition-colors text-sm">costaricaunlocked@gmail.com</a> 
                                        </div>
                                    </div>
                                    <div className="contact-items flex items-start gap-3">
                                        <div className="icon w-10 h-10 rounded-full bg-[#1ca8cb]/20 flex items-center justify-center shrink-0">
                                            <i className="bi bi-telephone-fill text-[#1ca8cb]"></i>
                                        </div>
                                        <div className="content">
                                            <a href="tel:+50671320030" className="text-white hover:text-[#1ca8cb] transition-colors text-sm block">+506 7132-0030</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                     </div>
                </div>

                {/* Footer Bottom */}
                <div className="footer-bottom border-t border-white/10 py-6">
                    <div className="footer-wrapper flex flex-wrap justify-between items-center gap-4">
                        <p className="wow fadeInUp text-white/50 text-sm" data-wow-delay=".3s">
                            Copyright © {new Date().getFullYear()} <span className="text-white">Costa Rica Unlocked.</span> All Rights Reserved.
                        </p>
                        <ul className="bottom-list wow fadeInUp flex gap-6" data-wow-delay=".5s">
                            <li><a href="#" className="hover:text-[#1ca8cb] transition-colors text-sm" style={{color: "white"}}>Terms of use</a></li>
                            <li><a href="#" className="hover:text-[#1ca8cb] transition-colors text-sm" style={{color: "white"}}>Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer1;