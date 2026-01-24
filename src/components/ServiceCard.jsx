import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Clock, DollarSign, Star } from 'lucide-react';

const ServiceCard = ({ service, index = 0 }) => {
    // Dynamically get the icon component
    const IconComponent = Icons[service.icon] || Icons.Briefcase;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
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
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Featured
                    </div>
                </motion.div>
            )}

            {/* Card Container */}
            <div className="relative h-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Decorative Corner Element */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

                {/* Content */}
                <div className="relative z-10 p-8 h-full flex flex-col">
                    {/* Icon */}
                    <motion.div
                        whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl mb-6 group-hover:shadow-lg transition-shadow duration-300"
                    >
                        <IconComponent className="w-8 h-8 text-primary" />
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                        {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed flex-grow">
                        {service.description}
                    </p>

                    {/* Features List */}
                    {service.features && service.features.length > 0 && (
                        <ul className="space-y-3 mb-6">
                            {service.features.map((feature, idx) => (
                                <motion.li
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 + idx * 0.05 }}
                                    className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary to-purple-500 mt-1.5 flex-shrink-0" />
                                    <span>{feature}</span>
                                </motion.li>
                            ))}
                        </ul>
                    )}

                    {/* Price and Duration */}
                    <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                        {service.price && (
                            <div className="flex items-center gap-2 text-sm">
                                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                                    <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                                </div>
                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                    {service.price}
                                </span>
                            </div>
                        )}
                        {service.duration && (
                            <div className="flex items-center gap-2 text-sm">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                    {service.duration}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/20 transition-colors duration-500" />
                </div>
            </div>
        </motion.div>
    );
};

export default ServiceCard;
