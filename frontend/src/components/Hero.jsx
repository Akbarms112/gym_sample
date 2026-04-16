import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Import images
import heroImg1 from '../body-building.jpg';
import heroImg2 from '../barbel.jpg';
import heroImg3 from '../girl_back.jpg';

const Hero = () => {
    const navigate = useNavigate();
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"]
    });

    // Rewritten opacity transitions - slower, smoother transitions
    const opacity1 = useTransform(scrollYProgress, [0, 0.1, 0.35], [1, 1, 0]);
    const opacity2 = useTransform(scrollYProgress, [0.2, 0.45, 0.65], [0, 1, 0]);
    const opacity3 = useTransform(scrollYProgress, [0.4, 0.95, 1], [0, 1, 1]);

    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    // Text Animation Variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-black">
            <div className="sticky top-0 h-screen overflow-hidden">
                {/* Background Images with Morphing Effect */}
                <motion.div style={{ opacity: opacity1, scale }} className="absolute inset-0 z-0">
                    <img src={heroImg1} alt="Hero 1" className="w-full h-full object-cover opacity-60" />
                </motion.div>

                <motion.div style={{ opacity: opacity2, scale }} className="absolute inset-0 z-0">
                    <img src={heroImg2} alt="Hero 2" className="w-full h-full object-cover opacity-60" />
                </motion.div>

                <motion.div style={{ opacity: opacity3, scale }} className="absolute inset-0 z-0">
                    <img src={heroImg3} alt="Hero 3" className="w-full h-full object-cover opacity-60" />
                </motion.div>

                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/50 z-10" />

                {/* Content */}
                <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4">
                    <div className="max-w-4xl">
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-orange-500 font-bold tracking-widest uppercase mb-4 text-xl"
                        >
                            Construct Your Body
                        </motion.h2>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter"
                            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                        >
                            UNLEASH YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">POTENTIAL</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
                        >
                            Experience fitness evolution with our world-class facilities and expert guidance.
                            Your journey to greatness starts here.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-6 justify-center"
                        >
                            <button
                                onClick={() => navigate('/user-login')}
                                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold uppercase tracking-wider hover:opacity-90 transition-all transform hover:scale-105"
                            >
                                Join Now
                            </button>
                            <button
                                onClick={() => navigate('/admin-login')}
                                className="px-8 py-4 border-2 border-white text-white font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all"
                            >
                                Admin Access
                            </button>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
                    className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
                >
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-1.5 h-1.5 bg-orange-500 rounded-full"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
