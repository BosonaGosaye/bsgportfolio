import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Briefcase, GraduationCap } from 'lucide-react';

const TimelineItem = ({ title, subtitle, duration, description, responsibilities, type = 'experience' }) => {
  const Icon = type === 'education' ? GraduationCap : Briefcase;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative pl-8 pb-12 last:pb-0 group"
    >
      {/* Animated Timeline Line */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-primary/30 to-transparent" />

      {/* Timeline Dot with Pulse */}
      <motion.div
        className="absolute left-[-7px] top-1 w-4 h-4 rounded-full bg-gradient-to-br from-primary to-blue-600 border-4 border-white dark:border-slate-900 shadow-lg shadow-primary/50"
        whileHover={{ scale: 1.3 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
      </motion.div>

      {/* Glassmorphism Card */}
      <motion.div
        whileHover={{
          y: -4,
          transition: { duration: 0.3, ease: 'easeOut' }
        }}
        className="glass-card rounded-2xl p-6 group-hover:border-primary/50 transition-all duration-300 relative overflow-hidden"
      >
        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Content */}
        <div className="relative z-10">
          {/* Header with Icon */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 dark:from-primary/20 dark:to-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <Icon className="w-6 h-6 text-primary" />
            </div>

            <div className="flex-grow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                <div>
                  <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-300 tracking-tight leading-tight mb-1">
                    {title}
                  </h3>
                  <h4 className="text-primary font-bold text-lg tracking-wide uppercase text-sm">
                    {subtitle}
                  </h4>
                </div>

                {/* Duration Badge */}
                <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary/10 to-purple-500/10 dark:from-primary/20 dark:to-purple-500/20 border border-primary/20 rounded-full text-sm font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                  {duration}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {description && (
            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 mt-6 leading-relaxed">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                  strong: ({ children }) => <strong className="text-slate-900 dark:text-white font-bold">{children}</strong>,
                  em: ({ children }) => <em className="text-primary italic not-italic font-medium">{children}</em>,
                  li: ({ children }) => <li className="mb-2">{children}</li>
                }}
              >
                {description}
              </ReactMarkdown>
            </div>
          )}

          {/* Responsibilities */}
          {responsibilities && responsibilities.length > 0 && (
            <ul className="mt-4 space-y-2">
              {responsibilities.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 text-slate-600 dark:text-slate-400"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          )}
        </div>

        {/* Decorative Element */}
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
      </motion.div>
    </motion.div>
  );
};

export default TimelineItem;
