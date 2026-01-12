import { motion } from "framer-motion";
import { Info } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const features = [
  { label: "Secure Booking", icon: "🎟" },
  { label: "Instant Confirmation", icon: "⚡" },
  { label: "Safe Payments", icon: "💳" },
  { label: "Easy to Use", icon: "📱" },
];

const AboutUs = () => {
  return (
    <section className="relative py-24 bg-linear-to-br from-teal-800 via-teal-700 to-teal-600
">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Heading */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-3"
        >
          <Info className="w-7 h-7 text-sky-400" />
          <h2 className="text-4xl font-bold tracking-tight text-white">
            About Us
          </h2>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="mt-3 text-sky-400 text-sm uppercase tracking-wider"
        >
          Built for seamless ticket booking
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="mt-6 max-w-3xl mx-auto text-slate-300 leading-relaxed"
        >
          We are a modern online ticket booking platform built to simplify how
          people discover and book travel, movies, concerts, and live events.
          With secure payments, real-time availability, and instant
          confirmations, we ensure every booking is fast, reliable, and
          stress-free.
        </motion.p>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          className="mt-16 flex flex-wrap justify-center gap-6"
        >
          {features.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group relative w-[280px] cursor-pointer rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-xl transition-all"
            >
              {/* Gradient glow */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100 bg-linear-to-br from-sky-400/20 to-transparent" />

              {/* Icon */}
              <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-sky-400/15 text-3xl">
                {item.icon}
              </div>

              {/* Text */}
              <p className="relative text-sm font-semibold text-slate-100">
                {item.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutUs;
