import React from 'react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';


const HeroSlider = () => {
    return (
        <div className="w-full h-[50vh] md:h-[60vh] lg:h-[70vh] ">
          <Swiper
            navigation={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            loop={true}
            modules={[Navigation, Autoplay]}
            className="mySwiper w-full h-full"
          >
            {/* Slide 1 */}
            <SwiperSlide>
              <div
                className="relative w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://plus.unsplash.com/premium_photo-1661629443170-b6df0c2b130d?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                }}
              >
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white px-6">
                  <h2 className="text-4xl md:text-5xl font-bold mb-3">Book Your Journey Anytime, Anywhere</h2>
                  <p className="text-lg md:text-xl max-w-2xl">
                    Bus, train, flight, or launch compare routes, check availability, and book tickets instantly with a smooth experience.
                  </p>
                </div>
              </div>
            </SwiperSlide>
    
            {/* Slide 2 */}
            <SwiperSlide>
              <div
                className="relative w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://plus.unsplash.com/premium_photo-1684407617181-3408b55fef8e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                }}
              >
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white px-6">
                  <h2 className="text-4xl md:text-5xl font-bold mb-3">Travel Made Simple & Affordable</h2>
                  <p className="text-lg md:text-xl max-w-2xl">
                    Find the best bus and train tickets with real-time schedules, seat plans, and fast booking—no hassle, no delays.
                  </p>
                </div>
              </div>
            </SwiperSlide>
    
            {/* Slide 3 */}
            <SwiperSlide>
              <div
                className="relative w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1593186344142-ef775a6e596f?q=80&w=876&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                }}
              >
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white px-6">
                  <h2 className="text-4xl md:text-5xl font-bold mb-3">Comfortable Train Journeys Start Here</h2>
                  <p className="text-lg md:text-xl max-w-2xl">
                    Book your Train tickets effortlessly — explore routes, compare fares, and travel with comfort and convenience.
                  </p>
                </div>
              </div>
            </SwiperSlide>
            
            {/* Slide 4 */}

            <SwiperSlide>
              <div
                className="relative w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1559023234-1e773470544f?q=80&w=872&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                }}
              >
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white px-6">
                  <h2 className="text-4xl md:text-5xl font-bold mb-3">Fly Smarter with Ticket Bari</h2>
                  <p className="text-lg md:text-xl max-w-2xl">
                    Search flights, compare fares, and book your airplane tickets quickly with safe payments and instant confirmation.
                  </p>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      );
};

export default HeroSlider;