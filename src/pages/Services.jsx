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

            {/* Enhanced Hero Section with 3D Effects */}
            <section className="relative min-h-[60vh] flex items-center pt-32 overflow-hidden">
                {/* Animated gradient orbs */}
                <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-[150px] animate-blob" />
                <div className="absolute top-40 right-10 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[150px] animate-blob animation-delay-2000" />
                <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-pink-500/15 rounded-full blur-[150px] animate-blob animation-delay-4000" />
                
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
                            whileHover={{ scale: 1.05, rotate: 2 }}
                            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-2 border-primary/30 rounded-full mb-8 shadow-lg"
                        >
                            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                            <span className="text-sm font-black uppercase tracking-widest bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">What I Offer</span>
                        </motion.div>

                        <motion.h1 
                            className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight relative"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Professional{' '}
                            <span className="relative inline-block">
                                <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-shift">
                                    Services
                                </span>
                                <motion.span
                                    className="absolute -bottom-2 left-0 w-full h-3 bg-gradient-to-r from-primary/30 to-purple-600/30 blur-xl"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </span>
                        </motion.h1>

                        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
                            Transforming ideas into exceptional digital experiences with cutting-edge technology and creative solutions
                        </p>

                        {/* Enhanced Filter Buttons */}
                        <div className="flex items-center justify-center gap-5 mb-10">
                            <Filter className="w-6 h-6 text-slate-500" />
                            <div className="flex gap-3">
                                <motion.button
                                    onClick={() => setFilter('all')}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`px-8 py-4 rounded-2xl font-black text-lg transition-all duration-300 shadow-lg ${filter === 'all'
                                        ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-primary/40 scale-105'
                                        : 'bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-700 hover:border-primary'
                                        }`}
                                >
                                    All Services
                                </motion.button>
                                <motion.button
                                    onClick={() => setFilter('featured')}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`px-8 py-4 rounded-2xl font-black text-lg transition-all duration-300 shadow-lg ${filter === 'featured'
                                        ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-primary/40 scale-105'
                                        : 'bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-700 hover:border-primary'
                                        }`}
                                >
                                    Featured
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Enhanced Services Grid */}
            <section className="py-32 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {[...Array(6)].map((_, i) => (
                                <SkeletonLoader key={i} />
                            ))}
                        </div>
                    ) : filteredServices.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {filteredServices.map((service, index) => (
                                <motion.div
                                    key={service._id}
                                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ delay: index * 0.1, type: 'spring' }}
                                >
                                    <ServiceCard service={service} index={index} />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-32"
                        >
                            <div className="inline-block p-16 bg-slate-100 dark:bg-slate-800/50 rounded-[3rem]">
                                <Sparkles size={80} className="mx-auto text-slate-300 mb-6" />
                                <h3 className="text-3xl font-black mb-4">No Services Found</h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-10 text-lg">
                                    {filter === 'featured'
                                        ? 'No featured services available at the moment.'
                                        : 'Services will be added soon. Check back later!'}
                                </p>
                                {filter === 'featured' && (
                                    <motion.button
                                        onClick={() => setFilter('all')}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-8 py-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-primary/50 transition-all"
                                    >
                                        View All Services
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Enhanced CTA Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-600 to-purple-600" />
                <motion.div 
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }}
                    animate={{ 
                        backgroundPosition: ['0px 0px', '40px 40px']
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <motion.div
                            animate={{ 
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <Sparkles className="w-20 h-20 text-white mx-auto mb-10 drop-shadow-2xl" />
                        </motion.div>
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-10 tracking-tighter">
                            Need a Custom Solution?
                        </h2>
                        <p className="text-blue-100 text-xl md:text-2xl mb-14 max-w-3xl mx-auto font-medium leading-relaxed">
                            Don't see exactly what you're looking for? Let's discuss your unique requirements
                            and create a tailored solution that perfectly fits your needs.
                        </p>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to="/contact"
                                className="inline-flex items-center px-12 py-6 bg-white text-primary rounded-2xl font-black text-2xl hover:bg-gradient-to-r hover:from-yellow-300 hover:to-pink-300 hover:text-slate-900 hover:scale-105 transition-all shadow-2xl group relative overflow-hidden"
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300"
                                    initial={{ x: '-100%' }}
                                    whileHover={{ x: 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                                <span className="relative z-10">Get In Touch</span>
                                <Mail className="ml-3 group-hover:translate-x-2 group-hover:rotate-12 transition-all relative z-10" size={28} />
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Enhanced Additional Info Section */}
            <section className="py-32 relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-[150px] animate-blob" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full blur-[150px] animate-blob animation-delay-2000" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <motion.div 
                            className="inline-flex items-center gap-3 px-5 py-2 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-full mb-8"
                            whileHover={{ scale: 1.05 }}
                        >
                            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                            <span className="text-sm font-black uppercase tracking-wider text-primary">Why Choose Me</span>
                        </motion.div>
                        <h2 className="text-5xl md:text-6xl font-black mb-10 tracking-tighter">
                            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                Why Work With Me?
                            </span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
                            {[
                                { title: 'Quality First', description: 'Clean, maintainable code following best practices', color: 'from-blue-500 to-cyan-500' },
                                { title: 'On-Time Delivery', description: 'Committed to meeting deadlines and milestones', color: 'from-purple-500 to-pink-500' },
                                { title: 'Ongoing Support', description: 'Post-launch support and maintenance available', color: 'from-green-500 to-emerald-500' }
                            ].map((item, index) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.15, type: 'spring' }}
                                    whileHover={{ y: -10, scale: 1.05 }}
                                    className="relative p-10 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl border-2 border-slate-200/50 dark:border-slate-700/50 group overflow-hidden"
                                >
                                    <motion.div 
                                        className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                                    />
                                    <h3 className="text-2xl font-black mb-4 relative z-10">{item.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-lg font-medium leading-relaxed relative z-10">{item.description}</p>
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
