import { motion } from 'framer-motion';
import { ExternalLink, Calendar, Award, CheckCircle2, Clock, XCircle } from 'lucide-react';

const CertificationCard = ({ cert }) => {
  // Status configuration
  const statusConfig = {
    'Active': {
      gradient: 'from-emerald-500 to-green-600',
      icon: CheckCircle2,
      animation: 'animate-pulse',
      glow: 'shadow-emerald-500/50'
    },
    'Expired': {
      gradient: 'from-slate-400 to-slate-500',
      icon: XCircle,
      animation: '',
      glow: 'shadow-slate-500/30'
    },
    'In Progress': {
      gradient: 'from-blue-500 to-purple-600',
      icon: Clock,
      animation: 'animate-shimmer',
      glow: 'shadow-purple-500/50'
    }
  };

  const status = cert.status || 'Active';
  const config = statusConfig[status] || statusConfig['Active'];
  const StatusIcon = config.icon;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3, ease: 'easeOut' }
      }}
      className="group relative"
    >
      {/* Glassmorphism Card */}
      <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-10">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${config.gradient} text-white text-xs font-bold shadow-lg ${config.glow} ${config.animation}`}>
            <StatusIcon size={12} />
            <span>{status}</span>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Certificate Icon/Badge */}
          <div className="mb-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 dark:from-primary/20 dark:to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              {cert.image ? (
                <img
                  src={cert.image}
                  alt={cert.name}
                  className="w-12 h-12 object-contain"
                />
              ) : (
                <Award className="w-8 h-8 text-primary" />
              )}
            </div>
          </div>

          {/* Certificate Name */}
          <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-300">
            {cert.name}
          </h3>

          {/* Issuer */}
          <p className="text-slate-600 dark:text-slate-400 font-semibold mb-4">
            {cert.issuer}
          </p>

          {/* Date and Verification Link */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Calendar size={16} className="text-primary" />
              <span className="font-medium">{formatDate(cert.date)}</span>
            </div>

            {cert.url && (
              <motion.a
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 text-primary hover:text-blue-700 dark:hover:text-blue-400 font-bold text-sm transition-colors group/link"
              >
                <span>Verify</span>
                <ExternalLink
                  size={14}
                  className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200"
                />
              </motion.a>
            )}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
      </div>
    </motion.div>
  );
};

export default CertificationCard;
