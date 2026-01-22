"use client"
import React, { useEffect } from 'react';
import loadBackgroudImages from '../Common/loadBackgroudImages';
import Link from 'next/link';

const Footer1 = () => {

    useEffect(() => {
        loadBackgroudImages();
    }, []);

    return (
        <footer className="footer-section fix bg-gradient-to-b from-[#0A1F24] via-[#0D282E] to-[#1f4d85]">
            <div className="container">
                <div className="footer-widget-wrapper-new py-16">
                    <div className="row">
                        {/* Logo & Newsletter Column */}
                        <div className="col-xl-4 col-lg-5 col-md-8 col-sm-6 wow fadeInUp" data-wow-delay=".2s">
                            <div className="text-center">
                                <div className="widget-head mb-6 flex justify-center">
                                    <Link href="/">
                                        <img src="/assets/img/logo/white-log.svg" alt="Costa Rica Unlocked" style={{ width: "170px", filter: "brightness(0) invert(1)" }} className="mx-auto" />
                                    </Link>
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
                                        <a 
                                            href="#" 
                                            style={{ 
                                                width: '44px', 
                                                height: '44px', 
                                                borderRadius: '50%', 
                                                backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                transition: 'background-color 0.3s'
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#ffffff" viewBox="0 0 16 16">
                                                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
                                            </svg>
                                        </a>
                                        <a 
                                            href="#" 
                                            style={{ 
                                                width: '44px', 
                                                height: '44px', 
                                                borderRadius: '50%', 
                                                backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                transition: 'background-color 0.3s'
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#ffffff" viewBox="0 0 16 16">
                                                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
                                            </svg>
                                        </a>
                                        <a 
                                            href="#" 
                                            style={{ 
                                                width: '44px', 
                                                height: '44px', 
                                                borderRadius: '50%', 
                                                backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                transition: 'background-color 0.3s'
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#ffffff" viewBox="0 0 16 16">
                                                <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
                                            </svg>
                                        </a>
                                        <a 
                                            href="#" 
                                            style={{ 
                                                width: '44px', 
                                                height: '44px', 
                                                borderRadius: '50%', 
                                                backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                transition: 'background-color 0.3s'
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#ffffff" viewBox="0 0 16 16">
                                                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                                            </svg>
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
                                    <li><Link href="/contact" className="text-white/70 hover:text-[#1ca8cb] transition-colors">Contact</Link></li>
                                </ul>
                            </div>
                        </div>

                        {/* Experiences Column */}
                        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 ps-lg-5 wow fadeInUp" data-wow-delay=".6s">
                            <div className="single-widget-items">
                                <div className="widget-head mb-6">
                                   <h4 className="text-white text-lg font-semibold">Experiences</h4>
                                </div>
                                <ul className="list-items space-y-3">
                                    <li><Link href="/tour-packages" className="text-white/70 hover:text-[#1ca8cb] transition-colors">Pura Vida Packages</Link></li>
                                    <li><Link href="/tour" className="text-white/70 hover:text-[#1ca8cb] transition-colors">Adventure Tours</Link></li>
                                    <li><Link href="/destination" className="text-white/70 hover:text-[#1ca8cb] transition-colors">Hidden Gems</Link></li>
                                    <li><Link href="/tour" className="text-white/70 hover:text-[#1ca8cb] transition-colors">Eco-Exploration</Link></li>
                                    <li><Link href="/tour-packages" className="text-white/70 hover:text-[#1ca8cb] transition-colors">Family Escapes</Link></li>
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
                                    <div className="contact-items flex items-start gap-3">
                                        <div className="icon w-10 h-10 rounded-full bg-[#1ca8cb]/20 flex items-center justify-center shrink-0">
                                            <i className="bi bi-geo-alt-fill text-[#1ca8cb]"></i>
                                        </div>
                                        <div className="content">
                                            <p className="text-white text-sm">San José, Costa Rica <br/>
                                                Central America
                                            </p>
                                        </div>
                                    </div>
                                    <div className="contact-items flex items-start gap-3">
                                        <div className="icon w-10 h-10 rounded-full bg-[#1ca8cb]/20 flex items-center justify-center shrink-0">
                                            <i className="bi bi-envelope-fill text-[#1ca8cb]"></i>
                                        </div>
                                        <div className="content">
                                            <a href="mailto:hello@costaricaunlocked.com" className="text-white hover:text-[#1ca8cb] transition-colors text-sm">hello@costaricaunlocked.com</a> 
                                        </div>
                                    </div>
                                    <div className="contact-items flex items-start gap-3">
                                        <div className="icon w-10 h-10 rounded-full bg-[#1ca8cb]/20 flex items-center justify-center shrink-0">
                                            <i className="bi bi-telephone-fill text-[#1ca8cb]"></i>
                                        </div>
                                        <div className="content">
                                            <a href="tel:+50688888888" className="text-white hover:text-[#1ca8cb] transition-colors text-sm block">+506 8888-8888</a>
                                            <a href="tel:+18000000000" className="text-white hover:text-[#1ca8cb] transition-colors text-sm block">+1 (800) UNLOCK-CR</a>
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
                            <li><a href="#" className="text-white/50 hover:text-[#1ca8cb] transition-colors text-sm">Terms of use</a></li>
                            <li><a href="#" className="text-white/50 hover:text-[#1ca8cb] transition-colors text-sm">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer1;