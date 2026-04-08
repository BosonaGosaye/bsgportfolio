import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Briefcase,
  BookOpen,
  MessageSquare,
  Settings,
  LogOut,
  User
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMessages } from '../services/api';

const AdminSidebar = () => {
  const { logout, user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user?.token) {
      fetchUnreadCount();
      // Poll for new messages every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const res = await getMessages(user.token);
      const unread = res.data.filter(m => m.status === 'unread').length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  const links = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/admin/projects', icon: Briefcase },
    { name: 'Blog', path: '/admin/blog', icon: BookOpen },
    { name: 'Services', path: '/admin/services', icon: Briefcase },
    { name: 'About / Resume', path: '/admin/about', icon: Briefcase },
    { name: 'Skills', path: '/admin/skills', icon: Settings },
    { name: 'Profile', path: '/admin/profile', icon: User },
    { name: 'Messages', path: '/admin/messages', icon: MessageSquare, badge: unreadCount },
  ];

  return (
    <aside className="w-full lg:w-64 h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-6 flex flex-col">
      <div className="flex items-center mb-10 px-2">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl mr-3">
          B
        </div>
        <span className="font-bold text-xl">Admin Panel</span>
      </div>

      <nav className="space-y-2 flex-1">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all ${isActive
                ? 'bg-primary text-white shadow-lg shadow-blue-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`
            }
          >
            <div className="flex items-center">
              <link.icon size={20} className="mr-3" />
              {link.name}
            </div>
            {link.badge > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-black rounded-full min-w-[20px] text-center animate-pulse">
                {link.badge}
              </span>
            )}
          </NavLink>
        ))}
        <hr className="my-6 border-slate-200 dark:border-slate-700" />
        <button
          onClick={logout}
          className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all font-bold"
        >
          <LogOut size={20} className="mr-3" />
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
