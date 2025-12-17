import React from "react";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
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
        {
            id: 8,
            title: "Dhaka to Dubai",
            from: "Dhaka",
            to: "Dubai",
            price: 45000,
            image: "https://images.unsplash.com/photo-1504274066651-8d31a536b11a",
        },
        {
            id: 9,
            title: "Dhaka to Singapore",
            from: "Dhaka",
            to: "Singapore",
            price: 38000,
            image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8",
        },
        {
            id: 10,
            title: "Dhaka to Kuala Lumpur",
            from: "Dhaka",
            to: "Kuala Lumpur",
            price: 32000,
            image: "https://images.unsplash.com/photo-1509088296860-42b1a6f3e859",
        },
        {
            id: 11,
            title: "Dhaka to Bangkok",
            from: "Dhaka",
            to: "Bangkok",
            price: 30000,
            image: "https://images.unsplash.com/photo-1519121782843-184f61660e1a",
        },
        {
            id: 12,
            title: "Dhaka to London",
            from: "Dhaka",
            to: "London",
            price: 95000,
            image: "https://images.unsplash.com/photo-1462887749044-b47cb05df2cc",
        },
        {
            id: 13,
            title: "Dhaka to New York",
            from: "Dhaka",
            to: "New York",
            price: 120000,
            image: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2",
        }
    ];

    const popularRoutes = routes.slice(0, 7);
    // const popularRoutes = routes;

    return (
        <div className="my-10 container mx-auto">
            <div className="text-center mb-10">
                <h3 className="text-4xl font-bold my-4 text-slate-900 dark:text-white">Popular Routes</h3>
                <p className="max-w-2xl mx-auto text-gray-600 dark:text-slate-400">
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
                pagination={{
                    clickable: true,
                    bulletClass: "swiper-pagination-bullet dark:bg-slate-600",
                    bulletActiveClass: "swiper-pagination-bullet-active dark:bg-teal-500",
                }}
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
