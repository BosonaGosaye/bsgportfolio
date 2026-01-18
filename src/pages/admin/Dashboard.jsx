import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  BookOpen,
  MessageSquare,
  Eye,
  TrendingUp,
  Mail,
  PlusCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { getAdminStats } from '../../services/api';
import Meta from '../../components/Meta';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminStats(user.token);
        setData(res.data);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchStats();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Projects', count: data?.stats?.totalProjects || 0, icon: Briefcase, color: 'bg-blue-500' },
    { label: 'Blog Posts', count: data?.stats?.totalBlogs || 0, icon: BookOpen, color: 'bg-emerald-500' },
    { label: 'Messages', count: data?.stats?.totalMessages || 0, icon: MessageSquare, color: 'bg-amber-500' },
    { label: 'Total Views', count: data?.stats?.totalViews || 0, icon: Eye, color: 'bg-purple-500' },
  ];

  return (
    <>
      <Meta title="Admin Dashboard" description="Manage your portfolio and blog" />

      <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Hello {user?.email}, here's what's happening today.</p>
        </div>
        <Link to="/admin/projects" className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30">
          <PlusCircle size={20} className="mr-2" />
          New Project
        </Link>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700"
          >
            <div className={`w-12 h-12 ${stat.color} text-white rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">{stat.label}</h3>
            <p className="text-3xl font-bold mt-1">{stat.count}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Blog Views Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="text-emerald-500" size={20} />
              Top Blog Posts (Views)
            </h2>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.charts?.blogViews}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="title"
                  hide={true}
                />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="views" stroke="#10b981" fillOpacity={1} fill="url(#colorViews)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Popularity Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Briefcase className="text-blue-500" size={20} />
              Project Popularity
            </h2>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.charts?.projectPopularity}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="title" hide={true} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="popularity" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Messages */}
        <section className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Messages</h2>
            <Link to="/admin/messages" className="text-primary text-sm font-bold hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {data?.recentMessages?.length > 0 ? (
              data.recentMessages.map((msg) => (
                <div key={msg._id} className="flex items-start p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold mr-4 shrink-0">
                    {msg.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold truncate">{msg.name}</h4>
                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                      {msg.message}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">No messages yet.</div>
            )}
          </div>
        </section>

        {/* Quick Stats Summary */}
        <section className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="text-xl font-bold mb-6 italic">Developer Note</h2>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
            <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
              Welcome to your admin control center. From here you can monitor your portfolio's performance, manage content, and respond to inquiries. Use the sidebar to navigate between different sections.
            </p>
            <div className="mt-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Mail size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Stay active, stay connected.</span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Dashboard;
