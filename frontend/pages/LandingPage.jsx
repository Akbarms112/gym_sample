import React from 'react';
import Hero from '../src/components/Hero';
import Features from '../src/components/Features';
import Testimonials from '../src/components/Testimonials';
import FAQ from '../src/components/FAQ';

const LandingPage = () => {
  return (
    <div className="bg-black min-h-screen text-white">
      <Hero />
      <Features />
      <Testimonials />
      <FAQ />

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-sm flex items-center justify-center font-black text-xl transform -skew-x-6">
              CF
            </div>
            <span className="text-2xl font-black italic tracking-tighter">CHALLENGE FITNESS</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2024 Challenge Fitness. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
