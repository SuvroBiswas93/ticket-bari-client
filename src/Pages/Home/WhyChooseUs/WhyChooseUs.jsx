import React from "react";
import Marquee from "react-fast-marquee";

const features = [
  {
    title: "Trusted Ticket Partners",
    desc: "We work with verified bus, train, launch, and airline operators to ensure safe and reliable journeys.",
    img: "https://cdn-icons-png.flaticon.com/512/2920/2920277.png",
  },
  {
    title: "Quick & Easy Booking",
    desc: "Search, compare, and book tickets in minutes with our smooth and user-friendly platform.",
    img: "https://cdn-icons-png.flaticon.com/512/709/709496.png",
  },
  {
    title: "Transparent Pricing",
    desc: "No hidden charges. See real-time prices and seat availability before booking.",
    img: "https://cdn-icons-png.flaticon.com/512/3135/3135706.png",
  },
  {
    title: "Instant Booking Confirmation",
    desc: "Get immediate booking confirmation with e-ticket details sent directly to your email and dashboard.",
    img: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
  },
  {
    title: "24/7 Customer Support",
    desc: "Our support team is available round the clock to help you with any travel or booking issues.",
    img: "https://cdn-icons-png.flaticon.com/512/597/597177.png",
  },
  {
    title: "Safe & Secure Payments",
    desc: "All transactions are encrypted and secure, giving you peace of mind while booking tickets.",
    img: "https://cdn-icons-png.flaticon.com/512/2910/2910763.png",
  },
];

const FeatureCard = ({ feature }) => (
  <div className="bg-teal-300 hover:bg-teal-400 p-6 rounded-xl shadow cursor-pointer h-[300px] w-[300px] flex flex-col justify-center items-center mx-2">
    <img src={feature.img} alt={feature.title} className="w-12 h-12 mb-4" />
    <h3 className="text-xl font-semibold mb-2 text-center">{feature.title}</h3>
    <p className="text-gray-600 text-center">{feature.desc}</p>
  </div>
);

const WhyChooseUs = () => {
  return (
    <section className=" py-16 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="  text-center">
        <h2 className="text-3xl font-bold dark:text-white mb-4">
          Why Choose TicketBari?
        </h2>
        <p className="dark:text-gray-100 mb-12 max-w-2xl mx-auto">
          Book bus, train, plane, and launch tickets with confidence. TicketBari makes travel
          simple, fast, and reliable, so you can focus on your journey, not the hassle.
        </p>

        {/* Marquee */}
        <Marquee gradient={false} speed={50} pauseOnHover={true}>
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default WhyChooseUs;
