import React from "react";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import PopularRouteCard from "./PopularRouteCard";

const PopularRoutes = () => {
    const routes = [
        {
            id: 1,
            title: "Dhaka to Cox’s Bazar",
            from: "Dhaka",
            to: "Cox’s Bazar",
            price: 1200,
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        },
        {
            id: 2,
            title: "Dhaka to Sylhet",
            from: "Dhaka",
            to: "Sylhet",
            price: 900,
            image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
        },
        {
            id: 3,
            title: "Dhaka to Chittagong",
            from: "Dhaka",
            to: "Chittagong",
            price: 800,
            image: "https://images.unsplash.com/photo-1501147830916-ce44a6359892",
        },
        {
            id: 4,
            title: "Dhaka to Khulna",
            from: "Dhaka",
            to: "Khulna",
            price: 750,
            image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        },
        {
            id: 5,
            title: "Dhaka to Rajshahi",
            from: "Dhaka",
            to: "Rajshahi",
            price: 700,
            image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
        },
        {
            id: 6,
            title: "Barishal to Dhaka",
            from: "Barishal",
            to: "Dhaka",
            price: 650,
            image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
        },
        {
            id: 7,
            title: "Sylhet to Dhaka",
            from: "Sylhet",
            to: "Dhaka",
            price: 850,
            image: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2",
        },
    ];

    const popularRoutes = routes.slice(0, 7);

    return (
        <div className="my-24 ">
            <div className="text-center mb-16">
                <h3 className="text-4xl font-bold my-4">Popular Routes</h3>
                <p className="max-w-2xl mx-auto text-gray-600">
                    Choose from the most frequently booked & highly rated travel routes.
                </p>
            </div>

            <Swiper
                loop={true}
                effect="coverflow"
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={3}
                coverflowEffect={{
                    rotate: 30,
                    stretch: "50%",
                    depth: 200,
                    modifier: 1,
                    scale: 0.75,
                    slideShadows: true,
                }}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                pagination={true}
                modules={[EffectCoverflow, Pagination, Autoplay]}
                className="mySwiper"
            >
                {popularRoutes.map((route) => (
                    <SwiperSlide key={route.id}>
                        <PopularRouteCard route={route} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default PopularRoutes;
