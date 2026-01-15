import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const TourPackages = () => {

    // Sample tour package data structure based on your requirements
    // First 3 inclusions are standardized (Hotel, Transfer, Meals) for easy comparison
    // 4th inclusion is the differentiator
    const packageContent = [
        {
            images: ['/assets/img/destination/01.jpg'],
            tags: ['Best Seller'],
            duration_days: 7,
            duration_nights: 6,
            title: 'Costa Rica Adventure Package',
            included: ['Hotel', 'Transfer', 'Meals', 'Tours'],
            price_adult: 1200
        },
        {
            images: ['/assets/img/destination/02.jpg'],
            tags: ['Honeymoon'],
            duration_days: 5,
            duration_nights: 4,
            title: 'Romantic Beach Getaway',
            included: ['Hotel', 'Transfer', 'Meals', 'Spa'],
            price_adult: 950
        },
        {
            images: ['/assets/img/destination/03.jpg'],
            tags: ['Family'],
            duration_days: 10,
            duration_nights: 9,
            title: 'Family Fun Costa Rica',
            included: ['Hotel', 'Transfer', 'Meals', 'Activities'],
            price_adult: 1500
        },
        {
            images: ['/assets/img/destination/04.jpg'],
            tags: ['Best Seller'],
            duration_days: 8,
            duration_nights: 7,
            title: 'Eco-Tourism Experience',
            included: ['Hotel', 'Transfer', 'Meals', 'Guides'],
            price_adult: 1350
        },
        {
            images: ['/assets/img/destination/01.jpg'],
            tags: ['Adventure'],
            duration_days: 6,
            duration_nights: 5,
            title: 'Volcano & Rainforest Package',
            included: ['Hotel', 'Transfer', 'Meals', 'Tours'],
            price_adult: 1100
        },
        {
            images: ['/assets/img/destination/02.jpg'],
            tags: ['Best Seller'],
            duration_days: 12,
            duration_nights: 11,
            title: 'Complete Costa Rica Tour',
            included: ['Hotel', 'Transfer', 'Meals', 'Tours'],
            price_adult: 2200
        },
        {
            images: ['/assets/img/destination/03.jpg'],
            tags: ['Honeymoon'],
            duration_days: 7,
            duration_nights: 6,
            title: 'Caribbean Paradise Package',
            included: ['Hotel', 'Transfer', 'Meals', 'Activities'],
            price_adult: 1400
        },
        {
            images: ['/assets/img/destination/04.jpg'],
            tags: ['Family'],
            duration_days: 9,
            duration_nights: 8,
            title: 'Wildlife & Beach Adventure',
            included: ['Hotel', 'Transfer', 'Meals', 'Tours'],
            price_adult: 1650
        },
        {
            images: ['/assets/img/destination/01.jpg'],
            tags: ['Best Seller'],
            duration_days: 5,
            duration_nights: 4,
            title: 'Quick Escape Package',
            included: ['Hotel', 'Transfer', 'Meals', 'Tours'],
            price_adult: 850
        },
    ];

    // Icon mapping for inclusions
    const getInclusionIcon = (item: string) => {
        const iconMap: { [key: string]: string } = {
            'Hotel': 'bi-house-door',
            'Transfer': 'bi-airplane',
            'Meals': 'bi-egg-fried',
            'All Meals': 'bi-egg-fried',
            'Breakfast': 'bi-cup-hot',
            'Tours': 'bi-ticket-perforated',
            'Activities': 'bi-activity',
            'Guides': 'bi-person-badge',
            'Spa': 'bi-flower1'
        };
        return iconMap[item] || 'bi-check-circle';
    };

    return (
        <section className="tour-section section-padding fix">
            <div className="container custom-container">
                <div className="tour-destination-wrapper">
                    <div className="row g-4">
                        <div className="col-xl-8">
                            <div className="row g-4">
                            {packageContent.map((item, i) => (
                                <div key={i} className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp wow" data-wow-delay=".3s">
                                    <div className="destination-card-items mt-0">
                                        {/* A. Zona Visual (El Sueño) */}
                                        <div className="destination-image" style={{ position: 'relative' }}>
                                            <Image src={item.images[0]} alt={item.title} width={287} height={240} />
                                            
                                            {/* Etiqueta (Badge) - Tag */}
                                            {item.tags[0] && (
                                                <span 
                                                    style={{
                                                        position: 'absolute',
                                                        top: '12px',
                                                        left: '12px',
                                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                        color: '#333',
                                                        padding: '4px 12px',
                                                        borderRadius: '20px',
                                                        fontSize: '12px',
                                                        fontWeight: '600',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                    }}
                                                >
                                                    {item.tags[0]}
                                                </span>
                                            )}
                                            
                                            {/* Duración (Distintivo Clave) */}
                                            <span 
                                                style={{
                                                    position: 'absolute',
                                                    bottom: '12px',
                                                    right: '12px',
                                                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                                                    color: '#fff',
                                                    padding: '6px 12px',
                                                    borderRadius: '6px',
                                                    fontSize: '13px',
                                                    fontWeight: '600',
                                                    backdropFilter: 'blur(4px)'
                                                }}
                                            >
                                                {item.duration_days} Days / {item.duration_nights} Nights
                                            </span>
                                        </div>
                                        
                                        <div className="destination-content">
                                            {/* B. Zona de Contenido (La Información) */}
                                            <h5>
                                                <Link href="/tour-packages/tour-packages-details">
                                                    {item.title}
                                                </Link>
                                            </h5>
                                            
                                            {/* C. Zona de Valor (Los Iconos) - Inclusiones Destacadas */}
                                            <ul className="info" style={{ marginTop: '12px', marginBottom: '12px' }}>
                                                {item.included.slice(0, 4).map((inclusion, idx) => (
                                                    <li key={idx} style={{ fontSize: '13px' }}>
                                                        <i className={getInclusionIcon(inclusion)}></i>
                                                        {inclusion}
                                                    </li>
                                                ))}
                                            </ul>
                                            
                                            {/* D. Zona de Precio y Acción */}
                                            <div className="price">
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    <span style={{ fontSize: '12px', color: '#666', fontWeight: '400' }}>From</span>
                                                    <h6 style={{ margin: 0 }}>${item.price_adult.toLocaleString()}</h6>
                                                    <span style={{ fontSize: '11px', color: '#999', fontWeight: '400' }}>per person</span>
                                                </div>
                                                <Link href="/tour-packages/tour-packages-details" className="theme-btn style-2">
                                                    View Itinerary<i className="bi bi-arrow-right"></i>
                                                </Link>
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
                        <div className="col-xl-4">
                            <div className="main-sidebar mt-0">
                                <div className="single-sidebar-widget">
                                    <div className="wid-title">
                                        <h3>Package Category</h3>
                                    </div>
                                    <div className="categories-list">
                                        <label className="checkbox-single d-flex justify-content-between align-items-center">
                                            <span className="d-flex gap-xl-3 gap-2 align-items-center">
                                                <span className="checkbox-area d-center">
                                                    <input type="checkbox" />
                                                    <span className="checkmark d-center"></span>
                                                </span>
                                                <span className="text-color">
                                                    Best Seller
                                                </span>
                                            </span>
                                            <span className="text-color">05</span>
                                        </label>
                                        <label className="checkbox-single d-flex justify-content-between align-items-center">
                                            <span className="d-flex gap-xl-3 gap-2 align-items-center">
                                                <span className="checkbox-area d-center">
                                                    <input type="checkbox" />
                                                    <span className="checkmark d-center"></span>
                                                </span>
                                                <span className="text-color">
                                                    Honeymoon
                                                </span>
                                            </span>
                                            <span className="text-color">02</span>
                                        </label>
                                        <label className="checkbox-single d-flex justify-content-between align-items-center">
                                            <span className="d-flex gap-xl-3 gap-2 align-items-center">
                                                <span className="checkbox-area d-center">
                                                    <input type="checkbox" />
                                                    <span className="checkmark d-center"></span>
                                                </span>
                                                <span className="text-color">
                                                    Family
                                                </span>
                                            </span>
                                            <span className="text-color">02</span>
                                        </label>
                                        <label className="checkbox-single d-flex justify-content-between align-items-center">
                                            <span className="d-flex gap-xl-3 gap-2 align-items-center">
                                                <span className="checkbox-area d-center">
                                                    <input type="checkbox" />
                                                    <span className="checkmark d-center"></span>
                                                </span>
                                                <span className="text-color">
                                                    Adventure
                                                </span>
                                            </span>
                                            <span className="text-color">01</span>
                                        </label>
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

export default TourPackages;
