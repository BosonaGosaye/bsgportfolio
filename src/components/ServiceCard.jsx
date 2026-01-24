import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Clock, Star, CheckCircle2 } from 'lucide-react';

const ServiceCard = ({ service, index = 0 }) => {
    // Dynamically get the icon component
    const IconComponent = Icons[service.icon] || Icons.Briefcase;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -12, scale: 1.03 }}
            className="relative group h-full"
        >
            {/* Featured Badge */}
            {service.featured && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                    className="absolute -top-3 -right-3 z-10"
                >
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-5 py-2 rounded-full text-sm font-bold shadow-xl flex items-center gap-1.5">
                        <Star className="w-4 h-4 fill-current" />
                        Featured
                    </div>
                </motion.div>
            )}

            {/* Card Container */}
            <div className="relative h-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-slate-200/50 dark:border-slate-700/50 overflow-hidden group-hover:border-primary/30">
                {/* Animated Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Decorative Elements */}
                <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

                {/* Content */}
                <div className="relative z-10 p-10 h-full flex flex-col">
                    {/* Icon */}
                    <motion.div
                        whileHover={{ rotate: [0, -15, 15, -15, 0], scale: 1.15 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/30 to-purple-500/30 rounded-3xl mb-8 group-hover:shadow-2xl group-hover:shadow-primary/30 transition-all duration-500"
                    >
                        <IconComponent className="w-10 h-10 text-primary" />
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-3xl font-extrabold mb-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent leading-tight">
                        {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-base text-slate-600 dark:text-slate-400 mb-8 leading-relaxed flex-grow">
                        {service.description}
                    </p>

                    {/* Features List */}
                    {service.features && service.features.length > 0 && (
                        <ul className="space-y-4 mb-8">
                            {service.features.map((feature, idx) => (
                                <motion.li
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 + idx * 0.05 }}
                                    className="flex items-start gap-3 text-base text-slate-700 dark:text-slate-300 group/item"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                                    <span className="font-medium">{feature}</span>
                                </motion.li>
                            ))}
                        </ul>
                    )}

                    {/* Price and Duration */}
                    <div className="flex flex-wrap gap-4 pt-6 border-t-2 border-slate-200/50 dark:border-slate-700/50">
                        {service.price && (
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/50 dark:border-green-700/50 group/price"
                            >
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center group-hover/price:scale-110 transition-transform">
                                    <span className="text-2xl">💰</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wide">Price</span>
                                    <span className="text-lg font-bold text-slate-800 dark:text-slate-200">
                                        {service.price.replace(/ETB/gi, '').trim()}
                                        <span className="ml-1.5 text-xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                                            ETB
                                        </span>
                                    </span>
                                </div>
                            </motion.div>
                        )}
                        {service.duration && (
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50 group/duration"
                            >
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center group-hover/duration:scale-110 transition-transform">
                                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wide">Duration</span>
                                    <span className="text-lg font-bold text-slate-800 dark:text-slate-200">
                                        {service.duration}
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-primary/40 transition-colors duration-500" />
                </div>
            </div>
        </motion.div>
    );
};

export default ServiceCard;
