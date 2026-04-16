import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import bgImage from '../biceps.jpg';

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Member since 2023",
        quote: "Challenge Fitness completely transformed my approach to health. The trainers are incredible and the community is so supportive.",
        results: "Lost 15kg in 6 months"
    },
    {
        name: "Mike Chen",
        role: "Bodybuilder",
        quote: "The equipment here is top-notch. I've been to many gyms, but this is the only place where I feel pushed to my absolute limits.",
        results: "Gained 10kg muscle mass"
    },
    {
        name: "Emily Rodriguez",
        role: "Yoga Enthusiast",
        quote: "I love the variety of classes. From high-intensity interval training to calming yoga sessions, there's something for every mood.",
        results: "Improved flexibility & balance"
    }
];

const Testimonials = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Parallax effect for background
    const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

    return (
        <section ref={ref} className="py-24 bg-black text-white relative overflow-hidden">
            {/* Background Image with Parallax */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <motion.div style={{ y }} className="absolute inset-0">
                    <img src={bgImage} alt="Background" className="w-full h-[120%] object-cover opacity-50" />
                </motion.div>
                <div className="absolute inset-0 bg-black/60" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-orange-500 font-bold uppercase tracking-widest mb-2">Success Stories</h2>
                    <h3 className="text-3xl md:text-5xl font-black" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                        REAL PEOPLE, REAL RESULTS
                    </h3>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.5 }}
                            whileHover={{ y: -10 }}
                            className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 p-8 rounded-2xl relative shadow-xl hover:border-orange-500 transition-colors"
                        >
                            <div className="text-orange-500 text-6xl font-serif absolute top-4 left-6 opacity-20">"</div>

                            <p className="text-zinc-300 italic mb-6 relative z-10 leading-relaxed">
                                "{testimonial.quote}"
                            </p>

                            <div className="flex items-center justify-between border-t border-zinc-500/30 pt-6">
                                <div>
                                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                                    <p className="text-sm text-zinc-400">{testimonial.role}</p>
                                </div>
                                <div className="text-xs font-bold text-black bg-lime-400 px-3 py-1 rounded-full uppercase tracking-wide">
                                    {testimonial.results}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
