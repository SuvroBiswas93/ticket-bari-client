import React, { useEffect } from 'react';
import HeroSlider from '../HeroSlider/HeroSlider';
import PopularRoutes from '../PopularRoutes/PolpularRoutes';
import AdvertisementSection from './AdvertisementSection/AdvertisementSection';
import LatestTicketsSection from './LatestTicketsSection/LatestTicketsSection';
import WhyChooseUs from './WhyChooseUs/WhyChooseUs';


const Home = () => {
    useEffect(()=>{
        window.scrollTo(0,0)
      },[])
    
    return (
        <div>
            <HeroSlider></HeroSlider>
            <AdvertisementSection></AdvertisementSection>
            <LatestTicketsSection></LatestTicketsSection>
            <PopularRoutes></PopularRoutes>
            <WhyChooseUs></WhyChooseUs>
        </div>
    );
};

export default Home;