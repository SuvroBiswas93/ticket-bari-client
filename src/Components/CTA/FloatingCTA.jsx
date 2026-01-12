import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const FloatingCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
          }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 group cursor-pointer "
          aria-label="Scroll to top"
        >
          <div className="relative">
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 20px 0 rgba(59, 130, 246, 0.4)',
                  '0 0 40px 0 rgba(59, 130, 246, 0.6)',
                  '0 0 20px 0 rgba(59, 130, 246, 0.4)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="absolute inset-0 rounded-full "
            />

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative cursor-pointer w-14 h-14 rounded-full bg-linear-to-br from-teal-500 via-teal-600 to-teal-700 flex items-center justify-center text-white shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <motion.div
                animate={{ y: [-2, 2, -2] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              >
                <ArrowUp size={22} strokeWidth={2.5} />
              </motion.div>
            </motion.button>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default FloatingCTA;