import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Filter, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getServices } from '../services/api';
import ServiceCard from '../components/ServiceCard';
import SkeletonLoader from '../components/SkeletonLoader';
import Meta from '../components/Meta';

const Services = () => {
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // 'all' or 'featured'

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                const response = await getServices();
                const servicesData = response.data?.data || response.data || [];
                const servicesArray = Array.isArray(servicesData) ? servicesData : [];
                setServices(servicesArray);
                setFilteredServices(servicesArray);
            } catch (err) {
                console.error('Error fetching services:', err);
                setError('Failed to load services. Please try again later.');
                setServices([]);
                setFilteredServices([]);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    useEffect(() => {
        if (filter === 'featured') {
            setFilteredServices(services.filter(service => service.featured));
        } else {
            setFilteredServices(services);
        }
    }, [filter, services]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <h2 className="text-2xl font-bold text-red-500 mb-4">{error}</h2>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <>
            <Meta
                title="Services"
                description="Professional services I offer including web development, mobile apps, and consulting"
            />

            {/* Hero Section */}
            <section className="relative min-h-[50vh] flex items-center pt-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6"
                        >
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm font-semibold text-primary">What I Offer</span>
                        </motion.div>

                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                            Professional{' '}
                            <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Services
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
                            Transforming ideas into exceptional digital experiences with cutting-edge technology and creative solutions
                        </p>

                        {/* Filter Buttons */}
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <Filter className="w-5 h-5 text-slate-500" />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${filter === 'all'
                                        ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/30'
                                        : 'bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700 hover:border-primary'
                                        }`}
                                >
                                    All Services
                                </button>
                                <button
                                    onClick={() => setFilter('featured')}
                                    className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${filter === 'featured'
                                        ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/30'
                                        : 'bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700 hover:border-primary'
                                        }`}
                                >
                                    Featured
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <SkeletonLoader key={i} />
                            ))}
                        </div>
                    ) : filteredServices.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredServices.map((service, index) => (
                                <ServiceCard key={service._id} service={service} index={index} />
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-20"
                        >
                            <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Sparkles className="w-10 h-10 text-slate-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">No Services Found</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-8">
                                {filter === 'featured'
                                    ? 'No featured services available at the moment.'
                                    : 'Services will be added soon. Check back later!'}
                            </p>
                            {filter === 'featured' && (
                                <button
                                    onClick={() => setFilter('all')}
                                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    View All Services
                                </button>
                            )}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-600 to-purple-600" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Sparkles className="w-16 h-16 text-white mx-auto mb-6 animate-pulse" />
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Need a Custom Solution?
                        </h2>
                        <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
                            Don't see exactly what you're looking for? Let's discuss your unique requirements
                            and create a tailored solution that perfectly fits your needs.
                        </p>
                        <Link
                            to="/contact"
                            className="inline-flex items-center px-10 py-4 bg-white text-primary rounded-xl font-bold text-lg hover:bg-blue-50 hover:scale-105 transition-all shadow-2xl group"
                        >
                            Get In Touch
                            <Mail className="ml-2 group-hover:translate-x-1 transition-transform" size={24} />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Additional Info Section */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            Why Work With Me?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                            {[
                                { title: 'Quality First', description: 'Clean, maintainable code following best practices' },
                                { title: 'On-Time Delivery', description: 'Committed to meeting deadlines and milestones' },
                                { title: 'Ongoing Support', description: 'Post-launch support and maintenance available' }
                            ].map((item, index) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-700/50"
                                >
                                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400">{item.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default Services;
