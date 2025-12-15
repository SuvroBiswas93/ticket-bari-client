import React from 'react';
import HeroSlider from '../HeroSlider/HeroSlider';
import PopularRoutes from '../PopularRoutes/PolpularRoutes';
import AdvertisementSection from './AdvertisementSection/AdvertisementSection';
import LatestTicketsSection from './LatestTicketsSection/LatestTicketsSection';

const Home = () => {
    return (
        <div>
            <HeroSlider></HeroSlider>
            <AdvertisementSection></AdvertisementSection>
            <LatestTicketsSection></LatestTicketsSection>
            <PopularRoutes></PopularRoutes>
        </div>
    );
};

export default Home;