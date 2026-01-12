import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import ImageGallery from './ImageGallery';

const DestinationDetails = () => {
    return (
        <section className="destination-details-section fix section-padding">
        <div className="container">
            <div className="destination-details-wrapper">
                <div className="destination-details-items">
                    <div className="details-content">
                        <h2>Description</h2>
                        <p className="mt-3">
                            Consectetur adipisicing elit sed do eiusmod tempor is incididunt ut labore et dolore of magna aliqua. ut enim ad minim veniam made of owl the quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea dolor commodo consequat duis aute irure and dolor in reprehenderit.Nullam semper quam mauris nec mollis felis aliquam eu ut non gravida mi quam mauris nec mollis felis aliquam eu ut phasellus.
                        </p>
                        {/* Image Gallery - Mosaic Grid */}
                        <ImageGallery images={[
                            '/assets/img/destails/desti-details.jpg',
                            '/assets/img/destails/desti-details-2.jpg',
                            '/assets/img/destails/desti-details-3.jpg',
                            '/assets/img/destination/01.jpg',
                            '/assets/img/destination/02.jpg',
                            '/assets/img/destination/03.jpg',
                        ]} />
                    </div>
                    <div className="map-area">
                        <h3>View in Map</h3>
                        <div className="google-map">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6678.7619084840835!2d144.9618311901502!3d-37.81450084255415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642b4758afc1d%3A0x3119cc820fdfc62e!2sEnvato!5e0!3m2!1sen!2sbd!4v1641984054261!5m2!1sen!2sbd"   loading="lazy"></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    );
};

export default DestinationDetails;