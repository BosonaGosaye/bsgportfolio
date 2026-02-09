import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

import { Menu, X, Sun, Moon, ArrowRight } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { useTheme } from '../context/ThemeContext';


const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();


    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 text-slate-900 cursor-default
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 sticky top-0 z-30 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="font-black text-xl tracking-tight hidden lg:block">Admin <span className="text-primary">Panel</span></h1>
                        <span className="font-bold lg:hidden">Admin Panel</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                        >
                            <ArrowRight size={16} className="rotate-180" /> View Site
                        </Link>

                        <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700 hidden sm:block" />

                        <button
                            onClick={toggleTheme}
                            className="p-2.5 bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:text-primary transition-all border border-slate-200 dark:border-slate-600 flex items-center justify-center"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <Outlet />
                </main>

            </div>
        </div>
    );
};

export default AdminLayout;
