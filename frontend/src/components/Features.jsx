import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import img1 from '../images.jpeg';
import img2 from '../images (2).jpeg';
import img3 from '../images (3).jpeg';
import img4 from '../images (4).jpeg';
import bgImage from '../aad34e88c7cebbbfbbeb82b614d8eee1.jpg'; // Background Image

const features = [
    {
        title: "Expert Trainers",
        description: "Work with certified professionals who will guide you every step of the way.",
        icon: "💪"
    },
    {
        title: "Modern Equipment",
        description: "Access state-of-the-art machinery designed for maximum efficiency and safety.",
        icon: "🏋️‍♂️"
    },
    {
        title: "Nutrition Plans",
        description: "Get personalized diet plans to fuel your body and optimize your results.",
        icon: "🥗"
    },
    {
        title: "Community Support",
        description: "Join a community of like-minded individuals who motivate and support each other.",
        icon: "🤝"
    }
];

const galleryImages = [img1, img2, img3, img4];

const Features = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Parallax effect for background
    const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

    return (
        <section ref={ref} className="py-24 bg-zinc-900 text-white relative overflow-hidden">
            {/* Background Image with Parallax */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <motion.div style={{ y }} className="absolute inset-0">
                    <img src={bgImage} alt="Features Background" className="w-full h-[130%] object-cover opacity-50" />
                </motion.div>
                <div className="absolute inset-0 bg-black/70" /> {/* Darker overlay for readability */}
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-orange-500 font-bold uppercase tracking-widest mb-2"
                    >
                        Why Choose Us
                    </motion.h2>
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-4xl md:text-5xl font-black"
                        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                        REDEFINE YOUR LIMITS
                    </motion.h3>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="bg-black/50 p-8 border border-zinc-800 hover:border-orange-500 transition-colors group rounded-xl backdrop-blur-sm"
                        >
                            <div className="text-4xl mb-6 bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                                {feature.icon}
                            </div>
                            <h4 className="text-xl font-bold mb-4">{feature.title}</h4>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* New Image Gallery Section */}
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-4xl font-bold mb-4"
                    >
                        Inside Our Facility
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-zinc-400 max-w-2xl mx-auto"
                    >
                        Experience the atmosphere where champions are made.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {galleryImages.map((img, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8, y: 50 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                delay: index * 0.15,
                                duration: 0.6,
                                type: "spring",
                                stiffness: 50
                            }}
                            whileHover={{ scale: 1.05, zIndex: 10 }}
                            className="relative overflow-hidden rounded-xl aspect-[3/4] group cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-end p-6">
                                <span className="text-white font-bold tracking-wider">VIEW GALLERY</span>
                            </div>
                            <img
                                src={img}
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-full object-cover transform"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
