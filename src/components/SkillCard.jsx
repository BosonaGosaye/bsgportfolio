import { motion } from 'framer-motion';
import { useState } from 'react';

const SkillCard = ({ skill }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      <div className="glass-card p-2.5 rounded-lg flex items-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
        {/* Icon */}
        {skill.icon && (
          <motion.div
            className="relative w-6 h-6 flex-shrink-0 flex items-center justify-center"
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={skill.icon}
              alt={`${skill.name} icon`}
              className="w-full h-full object-contain"
            />
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 bg-primary/20 rounded-full blur-md"
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}

        {/* Skill Name */}
        <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors flex-grow truncate leading-tight">
          {skill.name}
        </h4>

        {/* Percentage Badge */}
        {skill.percentage !== undefined && skill.percentage !== null && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: isHovered ? 1 : 0.8 }}
            className="flex-shrink-0 bg-gradient-to-r from-primary to-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm"
          >
            {skill.percentage}%
          </motion.div>
        )}

        {/* Hover Border Effect */}
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

export default SkillCard;
