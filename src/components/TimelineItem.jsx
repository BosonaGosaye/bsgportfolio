import { motion } from 'framer-motion';

const TimelineItem = ({ title, subtitle, duration, description, responsibilities }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative pl-8 pb-12 border-l-2 border-slate-200 dark:border-slate-800 last:pb-0"
    >
      <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white dark:border-slate-900" />
      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          <h4 className="text-primary font-semibold">{subtitle}</h4>
        </div>
        <span className="text-sm font-medium px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 md:mt-0">
          {duration}
        </span>
      </div>
      {description && <p className="text-slate-600 dark:text-slate-400 mt-3">{description}</p>}
      {responsibilities && responsibilities.length > 0 && (
        <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 mt-4 space-y-2">
          {responsibilities.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

export default TimelineItem;
