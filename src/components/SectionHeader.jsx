const SectionHeader = ({ title, subtitle }) => {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      {subtitle && <p className="text-slate-600 dark:text-slate-400">{subtitle}</p>}
      <div className="w-20 h-1.5 bg-primary mt-4 rounded-full" />
    </div>
  );
};

export default SectionHeader;
