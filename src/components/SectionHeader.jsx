import { motion } from 'framer-motion';

const SectionHeader = ({ title, subtitle, centered = false }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`mb-16 ${centered ? 'text-center flex flex-col items-center' : ''}`}
    >
      <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl font-medium">
          {subtitle}
        </p>
      )}
      <div className="w-24 h-2 bg-gradient-to-r from-primary to-blue-600 mt-8 rounded-full shadow-lg shadow-primary/20" />
    </motion.div>
  );
};

export default SectionHeader;
