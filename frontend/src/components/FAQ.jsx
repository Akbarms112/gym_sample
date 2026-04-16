import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import bgImage from '../images (3).jpeg'; // Reusing an existing image

const faqs = [
    {
        question: "What are your operating hours?",
        answer: "We are open 24/7 for our members. Staff is available from 6:00 AM to 10:00 PM daily to assist you with any needs."
    },
    {
        question: "Do you offer personal training?",
        answer: "Yes, we have a team of expert personal trainers available. You can book sessions individually or as part of our premium membership packages."
    },
    {
        question: "Can I freeze my membership?",
        answer: "Absolutely. We understand life happens. You can freeze your membership for up to 3 months per year for a nominal fee."
    },
    {
        question: "Is there a guest policy?",
        answer: "Premium members can bring one guest per visit for free. Basic members can bring guests for a small daily pass fee."
    }
];

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="py-24 bg-zinc-950 text-white relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img src={bgImage} alt="Background" className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 bg-black/60" />
            </div>

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-orange-500 font-bold uppercase tracking-widest mb-2">Common Questions</h2>
                    <h3 className="text-3xl md:text-5xl font-black" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                        NEED HELP?
                    </h3>
                </motion.div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="border border-zinc-800 rounded-xl bg-zinc-900/50 overflow-hidden hover:border-zinc-700 transition"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none"
                            >
                                <span className={`text-lg font-bold transition-colors ${activeIndex === index ? 'text-lime-400' : 'text-white'}`}>
                                    {faq.question}
                                </span>
                                <motion.span
                                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-zinc-500"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </motion.span>
                            </button>

                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-8 pb-6 text-zinc-400 leading-relaxed border-t border-zinc-800/50 pt-4">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
