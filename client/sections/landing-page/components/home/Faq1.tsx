"use client"
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

const Faq1 = () => {

    const faqContent = [
        {
            title: 'How do I book a tour or package?', 
            content: 'Booking is simple! Just browse our "Tours" or "Packages" sections, select your dates and number of travelers, and click "Book Now." You can complete your secure payment online in just a few minutes.'
        },
        {
            title: 'Are my reservations confirmed immediately?', 
            content: 'Yes! Most of our day tours offer instant confirmation. For multi-day packages, our team will finalize all logistics and send your official confirmation and vouchers via email within 24 hours.'
        },
        {
            title: 'Can I combine multiple tours into one package?', 
            content: 'Absolutely! That is what we do best. You can book individual tours or contact our experts to design a custom package that "unlocks" several destinations in one seamless itinerary.'
        },
        {
            title: 'What payment methods do you accept?', 
            content: 'We accept all major credit cards (Visa, Mastercard, AMEX) and secure digital payments. All transactions are encrypted to ensure your peace of mind while booking your paradise escape.'
        },
    ]; 

      const accordionContentRef = useRef(null);
      const [openItemIndex, setOpenItemIndex] = useState(-1);
      const [firstItemOpen, setFirstItemOpen] = useState(true);
    
      const handleItemClick = (index: number) => {
        if (index === openItemIndex) {
          setOpenItemIndex(-1);
        } else {
          setOpenItemIndex(index);
        }
      };
      useEffect(() => {
        if (firstItemOpen) {
          setOpenItemIndex(0);
          setFirstItemOpen(false);
        }
      }, [firstItemOpen]);    

    return (
        <section className="faq-section section-padding pt-0 fix">
            <div className="left-shape float-bob-y">
                 <Image src="/assets/img/tree-shape-2.png" alt="img" width={221} height={241}   />
            </div>
            <div className="container">
                <div className="faq-wrapper">
                    <div className="row g-4">
                        <div className="col-lg-6">
                            <div className="faq-content">
                                <div className="section-title">
                                    <span className="sub-title wow fadeInUp">
                                        Booking & Reservations
                                    </span>
                                    <h2 className="wow fadeInUp" data-wow-delay=".3s">
                                        Your Gateway to <br/> Seamless Travel
                                    </h2>
                                </div>
                                <p className="mt-3 wow fadeInUp text-gray-600" data-wow-delay=".5s">
                                    Planning your dream vacation should be as relaxing as the breeze in Manuel Antonio. We've optimized our booking process to ensure you can reserve your spot in paradise with total confidence.
                                </p>
                                <ul className="faq-list wow fadeInUp flex flex-wrap gap-6 mt-6" data-wow-delay=".7s">
                                    <li className="flex items-center gap-2 text-gray-700">
                                         <Image src="/assets/img/icon/15.svg" alt="check" width={14} height={12} />
                                        <span>Instant Online Booking</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-gray-700">
                                         <Image src="/assets/img/icon/15.svg" alt="check" width={14} height={12} />
                                        <span>Secure Payment System</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="faq-items">
                                <div className="faq-accordion">
                                    <div className="accordion flex flex-col gap-3" id="accordion">
                                    {faqContent.map((item, index) => (
                                        <div 
                                            key={index} 
                                            className={`rounded-lg border transition-all duration-200 ${
                                                index === openItemIndex 
                                                    ? "bg-white border-[#1ca8cb] shadow-sm" 
                                                    : "bg-white border-gray-200 hover:border-gray-300"
                                            }`}
                                        >
                                            <button 
                                                onClick={() => handleItemClick(index)} 
                                                className={`w-full text-left px-5 py-4 font-medium flex justify-between items-center transition-colors ${
                                                    index === openItemIndex 
                                                        ? "text-[#1ca8cb]" 
                                                        : "text-gray-800 hover:text-[#1ca8cb]"
                                                }`}
                                                type="button"
                                            >
                                                <span>{item.title}</span>
                                                <i className={`bi ${index === openItemIndex ? "bi-chevron-up" : "bi-chevron-down"} text-sm`}></i>
                                            </button>
                                            {index === openItemIndex && (
                                                <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed">
                                                    {item.content}
                                                </div>
                                            )}
                                        </div>
                                    ))}
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

export default Faq1;