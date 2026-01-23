import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

const SkillBar = ({ skill }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [isHovered, setIsHovered] = useState(false);

  // Determine proficiency level
  const getProficiencyLevel = (percentage) => {
    if (percentage >= 90) return 'Expert';
    if (percentage >= 75) return 'Advanced';
    if (percentage >= 60) return 'Intermediate';
    return 'Beginner';
  };

  return (
    <div
      ref={ref}
      className="mb-6 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Skill Name and Percentage */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          {skill.icon && (
            <motion.img
              src={skill.icon}
              alt={`${skill.name} icon`}
              className="w-5 h-5 object-contain"
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            />
          )}
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors duration-300">
            {skill.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <motion.span
            className="text-xs font-bold text-primary"
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
            transition={{ delay: 0.3 }}
          >
            {skill.percentage}%
          </motion.span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative w-full bg-slate-200 dark:bg-slate-700/50 rounded-full h-3 overflow-hidden shadow-inner">
        {/* Animated Progress Bar with Gradient */}
        <motion.div
          className="relative h-full rounded-full bg-gradient-to-r from-primary via-blue-500 to-purple-600 shadow-lg"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.percentage}%` } : { width: 0 }}
          transition={{
            duration: 1.2,
            ease: [0.4, 0, 0.2, 1],
            delay: 0.2
          }}
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />

          {/* Glow Effect on Hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 0.6 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </div>

      {/* Tooltip on Hover */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          y: isHovered ? 0 : -5
        }}
        transition={{ duration: 0.2 }}
        className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400"
      >
        {getProficiencyLevel(skill.percentage)} Level
      </motion.div>
    </div>
  );
};

export default SkillBar;
