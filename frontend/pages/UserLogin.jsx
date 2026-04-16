import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import img1 from '../src/girl.jpg';
import img2 from '../src/aa915783f11c5687cb49d3d02109ae27.jpg';
import img3 from '../src/aad34e88c7cebbbfbbeb82b614d8eee1.jpg';
import img4 from '../src/draw.jpg';

const UserLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('male');
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPlans, setShowPlans] = useState(false); // Added toggle state for plans
  const { login, register } = useAuth(); // Added register
  const navigate = useNavigate();

  const backgroundImages = [img1, img2, img3, img4];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password, 'user');
        navigate('/user-dashboard');
      } else {
        // Call register function
        await register({ email, password, name, phone, gender });
        // After successful registration, log the user in automatically
        await login(email, password, 'user');
        navigate('/user-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || ('Failed to ' + (isLogin ? 'log in' : 'sign up')));
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode='wait'>
          <motion.img
            key={currentImageIndex}
            src={backgroundImages[currentImageIndex]}
            alt="Background"
            className="w-full h-full object-cover absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row gap-8 items-center">
        {/* Left Side - Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-white p-8 rounded-3xl bg-gradient-to-br from-lime-400/20 via-zinc-900/50 to-zinc-900/50 backdrop-blur-sm border border-lime-400/30"
        >
          <Link to="/" className="text-sm text-zinc-400 hover:text-white mb-8 block transition-colors">&larr; Back to Home</Link>
          <h1 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Start Your Fitness <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Journey Today</span>
          </h1>
          <p className="text-zinc-300 text-lg mb-8 leading-relaxed">
            Join our community of fitness enthusiasts and achieve your goals with expert guidance.
          </p>

          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setShowPlans(false)}
              className={`px-6 py-2 rounded-full font-bold transition-all ${!showPlans ? 'bg-lime-400 text-black shadow-[0_0_20px_rgba(163,230,53,0.3)]' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
            >
              Why Choose Us
            </button>
            <button
              onClick={() => setShowPlans(true)}
              className={`px-6 py-2 rounded-full font-bold transition-all ${showPlans ? 'bg-lime-400 text-black shadow-[0_0_20px_rgba(163,230,53,0.3)]' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
            >
              View Plans
            </button>
          </div>

          {!showPlans ? (
            <div className="space-y-6">
              <motion.div whileHover={{ x: 10 }} className="flex items-center gap-4 bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50">
                <div className="w-10 h-10 rounded-full bg-lime-400/20 text-lime-400 flex items-center justify-center font-bold">⚡</div>
                <span className="font-medium">500+ Active Members</span>
              </motion.div>
              <motion.div whileHover={{ x: 10 }} className="flex items-center gap-4 bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50">
                <div className="w-10 h-10 rounded-full bg-lime-400/20 text-lime-400 flex items-center justify-center font-bold">✓</div>
                <span className="font-medium">Expert Trainers</span>
              </motion.div>
              <motion.div whileHover={{ x: 10 }} className="flex items-center gap-4 bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50">
                <div className="w-10 h-10 rounded-full bg-lime-400/20 text-lime-400 flex items-center justify-center font-bold">🏋️‍♀️</div>
                <span className="font-medium">Modern Equipment</span>
              </motion.div>
              <motion.div whileHover={{ x: 10 }} className="flex items-center gap-4 bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50">
                <div className="w-10 h-10 rounded-full bg-lime-400/20 text-lime-400 flex items-center justify-center font-bold">💲</div>
                <span className="font-medium">Flexible Plans</span>
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar"
            >
              {/* Special Plans */}
              <div className="bg-zinc-800/50 p-4 rounded-xl border border-orange-500/30">
                <h3 className="text-orange-500 font-bold mb-3 text-lg uppercase tracking-wider border-b border-orange-500/20 pb-2">Special Offers (Unisex)</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-300">60 Days Challenge (Strength + Cardio)</span>
                    <span className="font-bold text-white">₹12,000 <span className="text-xs text-zinc-500 line-through">₹17,000</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-300">Personal Training (Monthly)</span>
                    <span className="font-bold text-white">₹3,000 <span className="text-xs text-zinc-500 line-through">₹5,000</span></span>
                  </div>
                </div>
              </div>

              {/* Men Plans */}
              {(isLogin || gender === 'male' || gender === 'female' || gender === 'other') && (
                <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50">
                  <h3 className="text-lime-400 font-bold mb-3 text-lg uppercase tracking-wider border-b border-lime-400/20 pb-2">Men</h3>

                  <div className="mb-4">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase mb-2">Strength</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between"><span>1 Year</span><span className="font-bold">₹7,500</span></div>
                      <div className="flex justify-between"><span>6 Months</span><span className="font-bold">₹4,500</span></div>
                      <div className="flex justify-between"><span>3 Months</span><span className="font-bold">₹2,500</span></div>
                      <div className="flex justify-between"><span>1 Month</span><span className="font-bold">₹900</span></div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-zinc-400 uppercase mb-2">Strength + Cardio</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between"><span>1 Year</span><span className="font-bold">₹10,000</span></div>
                      <div className="flex justify-between"><span>6 Months</span><span className="font-bold">₹5,500</span></div>
                      <div className="flex justify-between"><span>3 Months</span><span className="font-bold">₹3,000</span></div>
                      <div className="flex justify-between"><span>1 Month</span><span className="font-bold">₹1,200</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Women Plans */}
              {(isLogin || gender === 'female' || gender === 'other') && (
                <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50">
                  <h3 className="text-pink-400 font-bold mb-3 text-lg uppercase tracking-wider border-b border-pink-400/20 pb-2">Women</h3>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-400 uppercase mb-2">Strength + Cardio</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between"><span>1 Year</span><span className="font-bold">₹8,000</span></div>
                      <div className="flex justify-between"><span>6 Months</span><span className="font-bold">₹5,000</span></div>
                      <div className="flex justify-between"><span>3 Months</span><span className="font-bold">₹2,800</span></div>
                      <div className="flex justify-between"><span>1 Month</span><span className="font-bold">₹1,000</span></div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Right Side - Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
          className="flex-1 w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl relative"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-zinc-400">
              {isLogin ? 'Sign in to continue your journey' : 'Enter your details to get started'}
            </p>
          </div>

          {error && <div className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-6 text-sm border border-red-500/20 text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-400 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Phone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-400 transition-colors"
                    placeholder="1234567890"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-400 transition-colors"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-400 transition-colors"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-400 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-lime-400 text-black font-bold py-4 rounded-xl hover:bg-lime-500 transition-colors uppercase tracking-wide shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:shadow-[0_0_30px_rgba(163,230,53,0.5)]"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </motion.button>
          </form>

          <div className="mt-8 text-center pt-8 border-t border-zinc-800">
            <p className="text-zinc-400 text-sm mb-4">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-white font-bold hover:text-lime-400 transition-colors"
            >
              {isLogin ? 'Create an account' : 'Sign in to your account'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserLogin;
