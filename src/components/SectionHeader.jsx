const SectionHeader = ({ title, subtitle }) => {
  return (
    <div className="mb-12">
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
      <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-blue-600 mt-6 rounded-full shadow-sm" />
    </div>
  );
};

export default SectionHeader;
