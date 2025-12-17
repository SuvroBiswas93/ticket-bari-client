import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Trusted Ticket Partners",
    desc: "We work with verified bus, train, launch, and airline operators to ensure safe and reliable journeys.",
    img: "https://cdn-icons-png.flaticon.com/512/1827/1827504.png",
  },
  {
    title: "Quick & Easy Booking",
    desc: "Search, compare, and book tickets in minutes with our smooth and user-friendly platform.",
    img: "https://cdn-icons-png.flaticon.com/512/814/814513.png",
  },
  {
    title: "Transparent Pricing",
    desc: "No hidden charges. See real-time prices and seat availability before booking.",
    img: "https://cdn-icons-png.flaticon.com/512/929/929610.png",
  },
  {
    title: "Instant Booking Confirmation",
    desc: "Get immediate booking confirmation with e-ticket details sent directly to your email and dashboard.",
    img: "https://cdn-icons-png.flaticon.com/512/1041/1041916.png",
  },
];


const FeatureCard = ({ feature }) => {
    return (
        <motion.div
            className="bg-green-200 hover:bg-green-300 p-6 rounded-xl shadow cursor-pointer"
            whileHover={{ scale: 1.05, y: -5 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, type: "spring", stiffness: 120 }}
        >
            <img src={feature.img} alt={feature.title} className="w-14 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
        </motion.div>
    );
};

const WhyChooseUs = () => {
    return (
        <motion.section
            className="px-6 py-16 "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }} // FAST, no delay
        >
            <div className="container mx-auto text-center">

                {/* FAST Title Animation */}
                <motion.h2
                    className="text-3xl font-bold dark:text-white mb-4"
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    Why Choose TicketBari?
                </motion.h2>

                {/* FAST Paragraph Animation */}
                <motion.p
                    className="dark:text-gray-100 mb-12 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    Book bus, train, plane, and launch tickets with confidence. TicketBari makes travel
                    simple, fast, and reliable,so you can focus on your journey, not the hassle.

                </motion.p>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} />
                    ))}
                </div>
            </div>
        </motion.section>
    );
};

export default WhyChooseUs;
