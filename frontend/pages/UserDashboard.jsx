import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../config';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('plans');
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchPlans();
    fetchMembership();
  }, []);

  // Hardcoded plans data to match the gym flyer and UserLogin.jsx
  const fetchPlans = () => {
    const plansData = [
      // Special Offers
      {
        id: 'special-challenge',
        title: '60 Days Challenge',
        category: 'Unisex',
        type: 'Strength + Cardio',
        price: 12000,
        originalPrice: 17000,
        duration: '2 months',
        durationDays: 60,
        features: ['Gym Access', 'Strength Training', 'Cardio', 'Diet Plan', 'Weekly Check-ins']
      },
      {
        id: 'special-pt',
        title: 'Personal Training',
        category: 'Unisex',
        type: 'Strength + Cardio',
        price: 3000,
        originalPrice: 5000,
        duration: '1 month',
        durationDays: 30,
        features: ['1-on-1 Training', 'Custom Workout Plan', 'Diet Plan', 'Progress Tracking']
      },
      // Men - Strength
      {
        id: 'men-strength-1y',
        title: 'Men Strength - 1 Year',
        category: 'Men',
        type: 'Strength',
        price: 7500,
        originalPrice: 12000,
        duration: '1 year',
        durationDays: 365,
        features: ['Gym Access', 'Strength Equipment']
      },
      {
        id: 'men-strength-6m',
        title: 'Men Strength - 6 Months',
        category: 'Men',
        type: 'Strength',
        price: 4500,
        originalPrice: 6000,
        duration: '6 months',
        durationDays: 180,
        features: ['Gym Access', 'Strength Equipment']
      },
      {
        id: 'men-strength-3m',
        title: 'Men Strength - 3 Months',
        category: 'Men',
        type: 'Strength',
        price: 2500,
        originalPrice: 3500,
        duration: '3 months',
        durationDays: 90,
        features: ['Gym Access', 'Strength Equipment']
      },
      {
        id: 'men-strength-1m',
        title: 'Men Strength - 1 Month',
        category: 'Men',
        type: 'Strength',
        price: 900,
        originalPrice: 1200,
        duration: '1 month',
        durationDays: 30,
        features: ['Gym Access', 'Strength Equipment']
      },
      // Men - Strength + Cardio
      {
        id: 'men-sc-1y',
        title: 'Men S+C - 1 Year',
        category: 'Men',
        type: 'Strength + Cardio',
        price: 10000,
        originalPrice: 18000,
        duration: '1 year',
        durationDays: 365,
        features: ['Gym Access', 'Strength & Cardio']
      },
      {
        id: 'men-sc-6m',
        title: 'Men S+C - 6 Months',
        category: 'Men',
        type: 'Strength + Cardio',
        price: 5500,
        originalPrice: 9000,
        duration: '6 months',
        durationDays: 180,
        features: ['Gym Access', 'Strength & Cardio']
      },
      {
        id: 'men-sc-3m',
        title: 'Men S+C - 3 Months',
        category: 'Men',
        type: 'Strength + Cardio',
        price: 3000,
        originalPrice: 4500,
        duration: '3 months',
        durationDays: 90,
        features: ['Gym Access', 'Strength & Cardio']
      },
      {
        id: 'men-sc-1m',
        title: 'Men S+C - 1 Month',
        category: 'Men',
        type: 'Strength + Cardio',
        price: 1200,
        originalPrice: 1500,
        duration: '1 month',
        durationDays: 30,
        features: ['Gym Access', 'Strength & Cardio']
      },
      // Women - Strength + Cardio
      {
        id: 'women-sc-1y',
        title: 'Women S+C - 1 Year',
        category: 'Women',
        type: 'Strength + Cardio',
        price: 8000,
        originalPrice: 18000,
        duration: '1 year',
        durationDays: 365,
        features: ['Gym Access', 'Strength & Cardio', 'Women Friendly Zone']
      },
      {
        id: 'women-sc-6m',
        title: 'Women S+C - 6 Months',
        category: 'Women',
        type: 'Strength + Cardio',
        price: 5000,
        originalPrice: 9000,
        duration: '6 months',
        durationDays: 180,
        features: ['Gym Access', 'Strength & Cardio', 'Women Friendly Zone']
      },
      {
        id: 'women-sc-3m',
        title: 'Women S+C - 3 Months',
        category: 'Women',
        type: 'Strength + Cardio',
        price: 2800,
        originalPrice: 4500,
        duration: '3 months',
        durationDays: 90,
        features: ['Gym Access', 'Strength & Cardio', 'Women Friendly Zone']
      },
      {
        id: 'women-sc-1m',
        title: 'Women S+C - 1 Month',
        category: 'Women',
        type: 'Strength + Cardio',
        price: 1000,
        originalPrice: 1500,
        duration: '1 month',
        durationDays: 30,
        features: ['Gym Access', 'Strength & Cardio', 'Women Friendly Zone']
      },
    ];

    // Filter plans based on user gender
    const userGender = user?.gender?.toLowerCase();
    const filteredPlans = plansData.filter(plan => {
      // Always show Unisex plans
      if (plan.category === 'Unisex') return true;

      // If user gender is not specified or 'other', show all
      if (!userGender || userGender === 'other') return true;

      // Show Men plans only to male users
      if (userGender === 'male' && plan.category === 'Men') return true;

      // Show Women plans only to female users
      if (userGender === 'female' && plan.category === 'Women') return true;

      return false;
    });

    setPlans(filteredPlans);
  };

  const fetchMembership = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user/membership`);
      if (response.data) {
        setMembership(response.data);
      }
    } catch (error) {
      console.log('No active membership');
    }
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePayment = async (paymentMethod) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/user/subscribe`, {
        plan_id: selectedPlan.id,
        plan_name: selectedPlan.title,
        amount: selectedPlan.price,
        duration_days: selectedPlan.durationDays,
        payment_method: paymentMethod
      });

      setMembership(response.data);
      setShowPayment(false);
      setSelectedPlan(null);
      setActiveTab('membership');
      alert('Membership request sent successfully! Please wait for admin approval.');
    } catch (error) {
      alert(error.response?.data?.detail || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const getDaysRemaining = () => {
    if (!membership) return 0;
    const endDate = new Date(membership.end_date);
    const today = new Date();
    const diff = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-sm flex items-center justify-center font-black text-xl transform -skew-x-6">
              CF
            </div>
            <div>
              <h1 className="text-xl font-black text-orange-500" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                MEMBER PORTAL
              </h1>
              <p className="text-xs text-gray-400">Welcome, {user?.name}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="px-6 py-2 border-2 border-orange-500 font-bold uppercase text-sm hover:bg-orange-500/10 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {['plans', 'membership', 'profile'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 font-bold uppercase text-sm border-b-4 transition-colors ${activeTab === tab
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-400 hover:text-white'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Plans Tab */}
        {activeTab === 'plans' && (
          <div>
            <h2 className="text-4xl font-black mb-8" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Available Membership Plans
            </h2>

            {membership && (
              <div className={`mb-8 p-6 border-2 rounded ${membership.status === 'pending'
                ? 'bg-yellow-500/10 border-yellow-500'
                : 'bg-orange-500/10 border-orange-500'
                }`}>
                <p className={`${membership.status === 'pending' ? 'text-yellow-500' : 'text-orange-500'} font-bold`}>
                  {membership.status === 'pending'
                    ? '⚠️ You have a pending membership request. Please wait for approval.'
                    : '⚠️ You already have an active membership. You can purchase a new plan after your current membership expires.'
                  }
                </p>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-zinc-900 border-2 border-zinc-800 hover:border-orange-500 transition-all p-6"
                >
                  <div className="mb-4">
                    <span className="text-xs font-bold text-orange-500 uppercase tracking-wide">
                      {plan.category}
                    </span>
                    <h3 className="text-2xl font-black mt-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                      {plan.title}
                    </h3>
                    <p className="text-gray-400 text-sm">{plan.type}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline space-x-3">
                      {plan.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">₹{plan.originalPrice}</span>
                      )}
                      <span className="text-4xl font-black text-orange-500">₹{plan.price}</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{plan.duration}</p>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-300">
                        <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={membership !== null}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 font-bold uppercase text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {membership ? (membership.status === 'pending' ? 'Request Pending' : 'Already Subscribed') : 'Select Plan'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Membership Tab */}
        {activeTab === 'membership' && (
          <div>
            <h2 className="text-4xl font-black mb-8" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              My Membership
            </h2>

            {membership ? (
              <div className="max-w-2xl">
                {membership.status === 'pending' ? (
                  <div className="bg-yellow-500/10 border-2 border-yellow-500 p-8 mb-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center text-2xl">
                        ⏳
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-yellow-500" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                          Membership Pending Approval
                        </h3>
                        <p className="text-gray-400">Your request for <strong>{membership.plan_name}</strong> is under review.</p>
                      </div>
                    </div>
                    <div className="bg-black/50 p-4 rounded-lg border border-yellow-500/30">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Amount Paid</span>
                        <span className="font-bold text-white">₹{membership.amount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Payment Method</span>
                        <span className="font-bold text-white uppercase">{membership.payment_method}</span>
                      </div>
                      <div className="mt-4 text-xs text-gray-500 text-center">
                        Please wait for admin approval. You will be notified once active.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-orange-500/10 to-red-600/10 border-2 border-orange-500 p-8 mb-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-3xl font-black mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                          {membership.plan_name}
                        </h3>
                        <span className={`inline-block px-4 py-1 text-sm font-bold uppercase ${membership.status === 'active'
                          ? 'bg-green-500/20 text-green-500 border border-green-500'
                          : 'bg-gray-500/20 text-gray-500 border border-gray-500'
                          }`}>
                          {membership.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-black text-orange-500">₹{membership.amount}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="bg-black/50 p-4 border border-zinc-700">
                        <div className="text-sm text-gray-400 mb-1">Start Date</div>
                        <div className="text-lg font-bold">
                          {new Date(membership.start_date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="bg-black/50 p-4 border border-zinc-700">
                        <div className="text-sm text-gray-400 mb-1">End Date</div>
                        <div className="text-lg font-bold">
                          {new Date(membership.end_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/50 p-6 border border-zinc-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">Days Remaining</span>
                        <span className="text-3xl font-black text-orange-500">{getDaysRemaining()}</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-red-600"
                          style={{
                            width: `${(getDaysRemaining() / membership.duration_days) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-zinc-900 border border-zinc-800 p-6">
                  <h4 className="text-xl font-bold mb-4">Payment Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Payment Method</span>
                      <span className="font-semibold uppercase">{membership.payment_method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Transaction Date</span>
                      <span className="font-semibold">
                        {new Date(membership.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🏋️</div>
                <h3 className="text-2xl font-bold mb-4">No Active Membership</h3>
                <p className="text-gray-400 mb-8">Choose a plan to start your fitness journey</p>
                <button
                  onClick={() => setActiveTab('plans')}
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 font-bold uppercase"
                >
                  Browse Plans
                </button>
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div>
            <h2 className="text-4xl font-black mb-8" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              My Profile
            </h2>

            <div className="max-w-2xl bg-zinc-900 border border-zinc-800 p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                  <div className="text-xl font-bold">{user?.name}</div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email</label>
                  <div className="text-xl font-bold">{user?.email}</div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Phone</label>
                  <div className="text-xl font-bold">{user?.phone}</div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Gender</label>
                  <div className="text-xl font-bold capitalize">{user?.gender}</div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Member Since</label>
                  <div className="text-xl font-bold">
                    {new Date(user?.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPayment && selectedPlan && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-zinc-900 border-2 border-orange-500 max-w-md w-full p-8">
            <h3 className="text-3xl font-black mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Complete Payment
            </h3>

            <div className="mb-6 p-6 bg-black border border-zinc-800">
              <div className="text-sm text-gray-400 mb-2">Selected Plan</div>
              <div className="text-2xl font-bold mb-4">{selectedPlan.title}</div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Amount</span>
                <span className="text-3xl font-black text-orange-500">₹{selectedPlan.price}</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <button
                onClick={() => handlePayment('cash')}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 font-bold uppercase hover:opacity-90 disabled:opacity-50"
              >
                💵 Pay with Cash
              </button>
              <button
                onClick={() => handlePayment('upi')}
                disabled={loading}
                className="w-full py-4 bg-zinc-800 border-2 border-zinc-700 font-bold uppercase hover:bg-zinc-700 disabled:opacity-50"
              >
                📱 Pay with UPI
              </button>
              <button
                onClick={() => handlePayment('card')}
                disabled={loading}
                className="w-full py-4 bg-zinc-800 border-2 border-zinc-700 font-bold uppercase hover:bg-zinc-700 disabled:opacity-50"
              >
                💳 Pay with Card
              </button>
            </div>

            <button
              onClick={() => {
                setShowPayment(false);
                setSelectedPlan(null);
              }}
              disabled={loading}
              className="w-full py-3 border-2 border-zinc-700 font-bold uppercase text-sm hover:bg-zinc-800 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
