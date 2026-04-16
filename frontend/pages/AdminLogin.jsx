import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import bgImage from '../src/back.jpg';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password, 'admin');
      navigate('/admin-dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={bgImage} alt="Background" className="w-full h-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-black/60" /> {/* Dark overlay */}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Link to="/" className="inline-flex items-center text-zinc-400 hover:text-lime-400 mb-8 transition">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-4"
            >
              <div className="w-16 h-16 bg-lime-400 rounded-2xl flex items-center justify-center shadow-lg shadow-lime-400/20">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </motion.div>
            <h2 className="text-3xl font-black text-white mb-2">Admin Portal</h2>
            <p className="text-zinc-400">Authorized access only</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-zinc-300 mb-2">Admin Email</label>
              <input
                type="email" required value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-black/50 border-2 border-zinc-800 rounded-xl text-white focus:border-lime-400 focus:outline-none transition placeholder-zinc-600"
                placeholder="admin@challengefitness.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-300 mb-2">Password</label>
              <input
                type="password" required value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-black/50 border-2 border-zinc-800 rounded-xl text-white focus:border-lime-400 focus:outline-none transition placeholder-zinc-600"
                placeholder="••••••••"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              className="w-full py-4 bg-lime-400 text-black rounded-full font-bold text-lg shadow-lg shadow-lime-400/20 hover:bg-lime-300 transition disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Access Admin Panel'}
            </motion.button>
          </form>

          <div className="mt-6 p-4 bg-lime-400/10 border border-lime-400/20 rounded-xl">
            <p className="text-xs text-zinc-400 text-center flex items-center justify-center">
              <span className="mr-2">🔒</span> This area is restricted to authorized personnel only
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
