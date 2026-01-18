const SkillBar = ({ skill }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{skill.name}</span>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{skill.percentage}%</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${skill.percentage}%` }}
        />
      </div>
    </div>
  );
};

export default SkillBar;
