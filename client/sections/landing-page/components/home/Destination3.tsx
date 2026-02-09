import DestinationCard from './DestinationCard';
import Image from 'next/image';

const Destination3 = () => {
    return (
        <section className="top-destination-section section-padding fix">
            {/* Floating decorative elements */}
            <div className="bag-shape float-bob-x">
                <Image src="/assets/img/destination/bag-shape.png" alt="shape" width={160} height={206} />
            </div>
            <div className="watch-shape float-bob-y">
                <Image src="/assets/img/destination/watch.png" alt="shape" width={76} height={76} />
            </div>

            <div className="container">
                <div className="section-title text-center">
                    <span className="sub-title wow fadeInUp">Costa Rica Icons</span>
                    <h2 className="wow fadeInUp" data-wow-delay=".3s">
                        Paradise Calling
                    </h2>
                </div>

                <div className="new-top-destination-wrapper">
                    <div className="row">
                        {/* --- LEFT COLUMN --- */}
                        <div className="col-lg-6">
                            <div className="row">
                                <div className="col-md-6">
                                    {/* Card 1: Volcano */}
                                    <DestinationCard
                                        img="/assets/img/destination/new/05.jpg"
                                        title="Volcanoes & Mountains"
                                        content="Adventure Travel"
                                    />
                                    
                                    {/* Card 2: Kayaks on the beach */}
                                    <DestinationCard
                                        img="/assets/img/destination/new/06.jpg"
                                        title="Pacific Coasts"
                                        content="Water Sports"
                                    />
                                </div>

                                <div className="col-md-6">
                                    {/* Card 3: Large Waterfall (Vertical) */}
                                    <DestinationCard
                                        img="/assets/img/destination/new/07.jpg"
                                        title="Hidden Paradises"
                                        content="Ecotourism & Relaxation"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* --- RIGHT COLUMN --- */}
                        <div className="col-lg-6">
                            <div className="row">
                                <div className="col-md-6">
                                    {/* Card 4: Macaw/Parrot */}
                                    <DestinationCard
                                        img="/assets/img/destination/new/08.jpg"
                                        title="Wildlife"
                                        content="Fauna Sighting"
                                    />

                                    {/* Card 5: Palms/Sky */}
                                    <DestinationCard
                                        img="/assets/img/destination/new/09.jpg"
                                        title="Tropical Caribbean"
                                        content="Sun & Beach"
                                    />
                                </div>

                                <div className="col-md-6">
                                    {/* Card 6: Boat on the beach */}
                                    <DestinationCard
                                        img="/assets/img/destination/new/10.jpg"
                                        title="Pristine Beaches"
                                        content="Romantic Getaways"
                                    />

                                    {/* Card 7: Person looking at waterfall */}
                                    <DestinationCard
                                        img="/assets/img/destination/new/11.jpg"
                                        title="Hiking Trails"
                                        content="Nature Connection"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Destination3;