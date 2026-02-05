"use client"
import React, { useEffect, useState } from 'react';
import loadBackgroudImages from '../Common/loadBackgroudImages';
import Link from 'next/link';
import Image from 'next/image';

const Counter2 = () => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        loadBackgroudImages();

        // Timer logic: Recurring 5-day cycle
        const cycleLength = 5 * 24 * 60 * 60 * 1000; // 5 days
        const baseTime = new Date('2024-01-01T00:00:00').getTime();

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const timeSinceBase = now - baseTime;
            const cyclesPassed = Math.floor(timeSinceBase / cycleLength);
            const nextTarget = baseTime + (cyclesPassed + 1) * cycleLength;
            const difference = nextTarget - now;

            if (difference > 0) {
                 const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                 const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                 const minutes = Math.floor((difference / 1000 / 60) % 60);
                 const seconds = Math.floor((difference / 1000) % 60);
                 setTimeLeft({ days, hours, minutes, seconds });
            } else {
                 setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft(); // Initial call

        return () => clearInterval(timer);
    }, []);

    return (
        <section className="cta-offer-section section-padding fix bg-cover" data-background="/assets/img/offer/bg2.jpg" >
            <div className="container">
                <div className="cta-offer-wrapper">
                    <div className="row g-4 align-items-center">
                        <div className="col-lg-6">
                            <div className="offer-content">
                                <div className="section-title">
                                    <span className="sub-title text-white wow fadeInUp">UPCOMING EXPEDITION</span>
                                    <h2 className="text-white wow fadeInUp" data-wow-delay=".2s">
                                        Our Next Great <br/>
                                        Adventure Begins Soon
                                    </h2>
                                    <p className="text-white mt-3 wow fadeInUp" data-wow-delay=".3s">
                                        Join our guided expedition through the most pristine corners of Costa Rica.
                                    </p>
                                </div>
                                <div className="coming-soon-timer">
                                    <div className="timer-content wow fadeInUp" data-wow-delay=".2s">
                                        <h3 id="day">{timeLeft.days < 10 ? `0${timeLeft.days}` : timeLeft.days}</h3>
                                        <p>Days</p>
                                    </div>
                                    <div className="timer-content wow fadeInUp" data-wow-delay=".4s">
                                        <h3 id="hour">{timeLeft.hours < 10 ? `0${timeLeft.hours}` : timeLeft.hours}</h3>
                                        <p>Hours</p>
                                    </div>
                                    <div className="timer-content wow fadeInUp" data-wow-delay=".6s">
                                        <h3 id="min">{timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes}</h3>
                                        <p>Mins</p>
                                    </div>
                                    <div className="timer-content wow fadeInUp" data-wow-delay=".8s">
                                        <h3 id="sec">{timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}</h3>
                                        <p>Secs</p>
                                    </div>
                                </div>
                                <style jsx>{`
                                    .coming-soon-timer {
                                        display: flex;
                                        gap: 15px;
                                        margin: 30px 0;
                                        flex-wrap: wrap;
                                    }
                                    .timer-content {
                                        background: rgba(255, 255, 255, 0.15);
                                        backdrop-filter: blur(5px);
                                        border: 1px solid rgba(255, 255, 255, 0.3);
                                        border-radius: 12px;
                                        padding: 15px;
                                        min-width: 90px;
                                        text-align: center;
                                        flex: 1;
                                        max-width: 110px;
                                    }
                                    .timer-content h3 {
                                        font-size: 32px;
                                        font-weight: 800;
                                        color: white !important;
                                        margin: 0;
                                        line-height: 1;
                                    }
                                    .timer-content p {
                                        font-size: 13px;
                                        color: rgba(255, 255, 255, 0.8) !important;
                                        margin-top: 5px;
                                        text-transform: uppercase;
                                        letter-spacing: 1px;
                                        font-weight: 600;
                                    }
                                    @media (max-width: 575px) {
                                        .coming-soon-timer {
                                            justify-content: center;
                                            gap: 10px;
                                        }
                                        .timer-content {
                                            min-width: 75px;
                                            padding: 10px;
                                        }
                                        .timer-content h3 {
                                            font-size: 24px;
                                        }
                                        .timer-content p {
                                            font-size: 11px;
                                        }
                                    }
                                `}</style>
                                <Link href="/tour-packages" className="theme-btn wow fadeInUp" data-wow-delay=".9s">View Details<i className="bi bi-arrow-right"></i></Link>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="offer-image">
                                <Image src="/assets/img/offer/circle4.png" alt="img" width={386} height={260} className="car-img" />
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