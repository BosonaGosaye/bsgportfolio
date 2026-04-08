import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Calendar, Award, CheckCircle2, Clock, XCircle, FileText, X } from 'lucide-react';
import { useState } from 'react';

const CertificationCard = ({ cert }) => {
  const [showModal, setShowModal] = useState(false);

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
    <>
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
        onClick={() => cert.certificateFile && setShowModal(true)}
        style={{ cursor: cert.certificateFile ? 'pointer' : 'default' }}
      >
        {/* Glassmorphism Card */}
        <div className={`glass-card rounded-2xl p-8 group-hover:border-primary/50 transition-all duration-500 relative overflow-hidden h-full flex flex-col group-hover:shadow-2xl group-hover:${config.glow}`}>

        {/* Dynamic Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

        {/* Status Badge */}
        <div className="absolute top-6 right-6 z-10 flex flex-col gap-2 items-end">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${config.gradient} text-white text-[10px] font-black uppercase tracking-widest shadow-xl ${config.glow} ${config.animation}`}>
            <StatusIcon size={12} strokeWidth={3} />
            <span>{status}</span>
          </div>
          {cert.certificateFile && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-[9px] font-black uppercase tracking-widest shadow-lg">
              <FileText size={10} strokeWidth={3} />
              <span>View</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="relative z-10 flex-grow">
          {/* Certificate Icon/Badge */}
          <div className="mb-8">
            <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-slate-100 dark:border-slate-700">
              {cert.image ? (
                <img
                  src={cert.image}
                  alt={cert.name}
                  className="w-14 h-14 object-contain"
                />
              ) : (
                <div className="relative">
                  <Award className="w-10 h-10 text-primary" />
                  <div className="absolute -inset-2 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
            </div>
          </div>

          {/* Certificate Name */}
          <h3 className="text-2xl font-black mb-3 text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-300 leading-tight">
            {cert.name}
          </h3>

          {/* Issuer */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-primary/40" />
            <p className="text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-xs">
              {cert.issuer}
            </p>
          </div>
        </div>

        {/* Date and Verification Link */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-slate-200/50 dark:border-slate-700/50 mt-auto">
          <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 font-bold">
            <Calendar size={16} className="text-primary/60" />
            <span>{formatDate(cert.date)}</span>
          </div>

          {cert.url && (
            <motion.a
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 4 }}
              className="flex items-center gap-2 text-primary hover:text-blue-600 dark:hover:text-blue-400 font-black text-xs uppercase tracking-widest transition-all group/link"
            >
              <span>Verify</span>
              <ExternalLink
                size={14}
                className="transition-transform duration-200"
              />
            </motion.a>
          )}
        </div>

        {/* Decorative Light Leak */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
      </div>

    </motion.div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {showModal && cert.certificateFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative max-w-5xl w-full max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 z-10 p-3 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full transition-all hover:scale-110"
              >
                <X size={24} />
              </button>

              {/* Certificate Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-primary/10 to-purple-500/10">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{cert.name}</h3>
                <p className="text-slate-600 dark:text-slate-400 font-semibold">{cert.issuer}</p>
              </div>

              {/* Certificate Content */}
              <div className="p-6 overflow-auto max-h-[calc(90vh-140px)]">
                {cert.certificateFileType === 'pdf' ? (
                  <iframe
                    src={cert.certificateFile}
                    className="w-full h-[70vh] rounded-lg border border-slate-200 dark:border-slate-700"
                    title={cert.name}
                  />
                ) : (
                  <img
                    src={cert.certificateFile}
                    alt={cert.name}
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CertificationCard;
