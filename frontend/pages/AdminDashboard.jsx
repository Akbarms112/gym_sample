import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../config';
import bgImage from '../src/biceps.jpg';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [members, setMembers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    expiringMembers: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  const motivationalQuotes = [
    "Success is the sum of small efforts repeated day in and day out.",
    "The only bad workout is the one that didn't happen.",
    "Your body can stand almost anything. It's your mind you have to convince.",
    "Strength doesn't come from what you can do. It comes from overcoming the things you thought you couldn't.",
    "The pain you feel today will be the strength you feel tomorrow."
  ];

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
    }, 5000); // Change quote every 5 seconds
    return () => clearInterval(quoteInterval);
  }, []);

  const fetchData = async () => {
    try {
      const [membersRes, membershipsRes, notificationsRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/members`),
        axios.get(`${API_URL}/api/admin/memberships`),
        axios.get(`${API_URL}/api/admin/notifications`)
      ]);

      setMembers(membersRes.data);
      setMemberships(membershipsRes.data);
      setNotifications(notificationsRes.data);

      const activeMembers = membershipsRes.data.filter(m => m.status === 'active').length;
      const pendingRequests = membershipsRes.data.filter(m => m.status === 'pending').length;
      const expiringMembers = membershipsRes.data.filter(m => {
        if (!m.end_date) return false;
        const daysRemaining = Math.ceil((new Date(m.end_date) - new Date()) / (1000 * 60 * 60 * 24));
        return daysRemaining <= 7 && daysRemaining > 0 && m.status === 'active';
      }).length;
      const totalRevenue = membershipsRes.data.reduce((sum, m) => m.status === 'active' ? sum + m.amount : sum, 0);

      setStats({
        totalMembers: membersRes.data.length,
        activeMembers,
        pendingRequests,
        expiringMembers,
        totalRevenue
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleApprove = async (membershipId) => {
    try {
      await axios.put(`${API_URL}/api/admin/membership/${membershipId}/approve`);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error approving membership:', error);
      alert('Failed to approve membership');
    }
  };

  const handleReject = async (membershipId) => {
    if (!window.confirm('Are you sure you want to reject this membership request?')) return;
    try {
      await axios.put(`${API_URL}/api/admin/membership/${membershipId}/reject`);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error rejecting membership:', error);
      alert('Failed to reject membership');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderOverview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-8">Dashboard Overview</h2>

      {/* Motivational Quote Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-orange-500/20 to-red-600/20 border border-orange-500/30 backdrop-blur-sm"
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={currentQuoteIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-lg md:text-xl font-semibold text-center text-white italic"
          >
            "{motivationalQuotes[currentQuoteIndex]}"
          </motion.p>
        </AnimatePresence>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'TOTAL MEMBERS', value: stats.totalMembers, color: 'orange', delay: 0 },
          { label: 'ACTIVE MEMBERS', value: stats.activeMembers, color: 'green', delay: 0.1 },
          { label: 'PENDING REQUESTS', value: stats.pendingRequests || 0, color: 'yellow', delay: 0.15 },
          { label: 'EXPIRING SOON', value: stats.expiringMembers, color: 'red', delay: 0.2 },
          { label: 'TOTAL REVENUE', value: `₹${stats.totalRevenue}`, color: 'blue', delay: 0.3 }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: stat.delay, duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className={`p-6 rounded-xl border-2 border-${stat.color}-500 bg-${stat.color}-500/10 backdrop-blur-sm`}
          >
            <h3 className={`text-${stat.color}-500 text-sm font-bold uppercase tracking-wider mb-2`}>{stat.label}</h3>
            <p className="text-4xl font-black text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-zinc-900/70 backdrop-blur-sm p-6 rounded-xl border border-zinc-800"
        >
          <h3 className="text-xl font-bold mb-4 text-orange-500">Recent Memberships</h3>
          {memberships.slice(0, 5).map((membership, index) => (
            <motion.div
              key={membership._id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="mb-3 p-3 bg-black/30 rounded-lg border-l-4 border-orange-500"
            >
              <p className="font-semibold">{membership.user_name}</p>
              <p className="text-sm text-zinc-400">{membership.plan_name} - ₹{membership.amount}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-zinc-900/70 backdrop-blur-sm p-6 rounded-xl border border-zinc-800"
        >
          <h3 className="text-xl font-bold mb-4 text-red-500">Expiring Soon</h3>
          {memberships
            .filter(m => {
              const daysRemaining = Math.ceil((new Date(m.end_date) - new Date()) / (1000 * 60 * 60 * 24));
              return daysRemaining <= 7 && daysRemaining > 0;
            })
            .slice(0, 5)
            .map((membership, index) => (
              <motion.div
                key={membership._id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="mb-3 p-3 bg-black/30 rounded-lg border-l-4 border-red-500"
              >
                <p className="font-semibold">{membership.user_name}</p>
                <p className="text-sm text-zinc-400">
                  Expires: {new Date(membership.end_date).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
        </motion.div>
      </div>
    </motion.div>
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    try {
      await axios.delete(`${API_URL}/api/admin/users/${userToDelete.id || userToDelete._id}`);
      fetchData();
      setShowDeleteModal(false);
      setUserToDelete(null);
      // alert('User deleted successfully'); // Optional: show notification instead
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const confirmDeleteMembership = async () => {
    try {
      await axios.delete(`${API_URL}/api/admin/users/${userToDelete.id || userToDelete._id}/membership`);
      fetchData();
      setShowDeleteModal(false);
      setUserToDelete(null);
      // alert('User membership deleted successfully');
    } catch (error) {
      console.error('Error deleting membership:', error);
      alert('Failed to delete membership (User might not have one)');
    }
  };

  const renderMembers = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-6">Members</h2>
      <div className="bg-zinc-900/70 backdrop-blur-sm rounded-xl border border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-black/50">
            <tr>
              <th className="px-6 py-4 text-left text-orange-500 font-bold">Name</th>
              <th className="px-6 py-4 text-left text-orange-500 font-bold">Email</th>
              <th className="px-6 py-4 text-left text-orange-500 font-bold">Phone</th>
              <th className="px-6 py-4 text-left text-orange-500 font-bold">Joined</th>
              <th className="px-6 py-4 text-left text-orange-500 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <motion.tr
                key={member.id || member._id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="border-t border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
              >
                <td className="px-6 py-4">{member.name}</td>
                <td className="px-6 py-4 text-zinc-400">{member.email}</td>
                <td className="px-6 py-4 text-zinc-400">{member.phone}</td>
                <td className="px-6 py-4 text-zinc-400">
                  {new Date(member.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDeleteClick(member)}
                    className="px-3 py-1 bg-red-500/20 hover:bg-red-500/40 text-red-500 border border-red-500 rounded text-sm font-bold transition-colors flex items-center gap-2"
                  >
                    <span>🗑️</span> Remove
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <h3 className="text-2xl font-bold mb-4 text-white">Remove User?</h3>
            <p className="text-zinc-400 mb-6">
              What would you like to remove for <span className="text-orange-500 font-bold">{userToDelete?.name}</span>?
            </p>

            <div className="space-y-3">
              <button
                onClick={confirmDeleteMembership}
                disabled={!memberships.some(m => m.user_id === (userToDelete?.id || userToDelete?._id))}
                className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg transition-colors border border-zinc-700 hover:border-zinc-600 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                title={!memberships.some(m => m.user_id === (userToDelete?.id || userToDelete?._id)) ? "User has no active membership" : ""}
              >
                <span>💳</span> Remove Membership Only
              </button>

              <button
                onClick={confirmDeleteUser}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
              >
                <span>👤</span> Remove User & All Data
              </button>

              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full py-3 text-zinc-500 hover:text-white font-bold transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );

  const renderMemberships = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-6">Memberships</h2>
      <div className="bg-zinc-900/70 backdrop-blur-sm rounded-xl border border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-black/50">
            <tr>
              <th className="px-6 py-4 text-left text-orange-500 font-bold">Member</th>
              <th className="px-6 py-4 text-left text-orange-500 font-bold">Plan</th>
              <th className="px-6 py-4 text-left text-orange-500 font-bold">Amount</th>
              <th className="px-6 py-4 text-left text-orange-500 font-bold">Start Date</th>
              <th className="px-6 py-4 text-left text-orange-500 font-bold">End Date</th>
              <th className="px-6 py-4 text-left text-orange-500 font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {memberships.map((membership, index) => (
              <motion.tr
                key={membership._id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="border-t border-zinc-800 hover:bg-zinc-800/50 transition-colors"
              >
                <td className="px-6 py-4">{membership.user_name}</td>
                <td className="px-6 py-4 text-zinc-400">{membership.plan_name}</td>
                <td className="px-6 py-4 text-lime-400 font-semibold">₹{membership.amount}</td>
                <td className="px-6 py-4 text-zinc-400">
                  {membership.start_date ? new Date(membership.start_date).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 text-zinc-400">
                  {membership.end_date ? new Date(membership.end_date).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${membership.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                    }`}>
                    {membership.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderNotifications = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-6">Notifications</h2>
      <div className="space-y-4">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, x: 10 }}
            className="bg-zinc-900/70 backdrop-blur-sm p-6 rounded-xl border border-zinc-800"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg mb-2">{notification.title}</h3>
                <p className="text-zinc-400">{notification.message}</p>
                <p className="text-sm text-zinc-500 mt-2">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${notification.type === 'expiring' ? 'bg-yellow-500/20 text-yellow-500' :
                notification.type === 'new' ? 'bg-green-500/20 text-green-500' :
                  'bg-blue-500/20 text-blue-500'
                }`}>
                {notification.type}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  const renderApprovals = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-6">Pending Approvals</h2>
      <div className="bg-zinc-900/70 backdrop-blur-sm rounded-xl border border-zinc-800 overflow-hidden">
        {memberships.filter(m => m.status === 'pending').length === 0 ? (
          <div className="p-8 text-center text-zinc-500">
            No pending membership approvals
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-black/50">
              <tr>
                <th className="px-6 py-4 text-left text-orange-500 font-bold">Member</th>
                <th className="px-6 py-4 text-left text-orange-500 font-bold">Plan</th>
                <th className="px-6 py-4 text-left text-orange-500 font-bold">Amount</th>
                <th className="px-6 py-4 text-left text-orange-500 font-bold">Date Requested</th>
                <th className="px-6 py-4 text-left text-orange-500 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {memberships.filter(m => m.status === 'pending').map((membership, index) => (
                <motion.tr
                  key={membership.id || membership._id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold">{membership.user_name}</td>
                  <td className="px-6 py-4 text-zinc-300">{membership.plan_name}</td>
                  <td className="px-6 py-4 text-white font-bold">₹{membership.amount}</td>
                  <td className="px-6 py-4 text-zinc-400">
                    {new Date(membership.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleApprove(membership.id || membership._id)}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-bold rounded-lg text-sm transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(membership.id || membership._id)}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-500 border border-red-500 rounded-lg text-sm transition-colors"
                    >
                      Reject
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <img src={bgImage} alt="Background" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90" />

        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated Gradient Orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-orange-500/30 to-red-600/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-to-br from-lime-400/20 to-green-600/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.25, 0.45, 0.25],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
            className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-3xl"
          />

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

          {/* Diagonal Lines */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500/5 via-transparent to-transparent" />
            <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-lime-400/5 via-transparent to-transparent" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-zinc-900/50 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50"
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center font-black text-xl">
                CF
              </div>
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tight">ADMIN DASHBOARD</h1>
                <p className="text-sm text-zinc-400">Logged in as {user?.email}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-colors"
            >
              LOGOUT
            </motion.button>
          </div>
        </motion.header>

        {/* Navigation Tabs */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900/30 backdrop-blur-sm border-b border-zinc-800"
        >
          <div className="max-w-7xl mx-auto px-6 flex gap-2 overflow-x-auto">
            {['overview', 'approvals', 'members', 'memberships', 'notifications'].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ y: -2 }}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === tab
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-zinc-400 hover:text-white'
                  }`}
              >
                {tab}
                {tab === 'approvals' && stats.pendingRequests > 0 && (
                  <span className="ml-2 bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full">
                    {stats.pendingRequests}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'approvals' && renderApprovals()}
          {activeTab === 'members' && renderMembers()}
          {activeTab === 'memberships' && renderMemberships()}
          {activeTab === 'notifications' && renderNotifications()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
