const SkeletonLoader = ({ type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md animate-pulse border border-slate-200 dark:border-slate-700">
        <div className="aspect-video bg-slate-300 dark:bg-slate-700" />
        <div className="p-6">
          <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-3/4 mb-4" />
          <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-full mb-2" />
          <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-5/6 mb-4" />
          <div className="flex gap-2">
            <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded-full w-16" />
            <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded-full w-16" />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'blog') {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md animate-pulse border border-slate-200 dark:border-slate-700 flex flex-col h-full">
        <div className="aspect-video bg-slate-300 dark:bg-slate-700" />
        <div className="p-6 flex-grow">
          <div className="flex gap-4 mb-3">
            <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-20" />
            <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-20" />
          </div>
          <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-full mb-3" />
          <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-full mb-2" />
          <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-5/6" />
        </div>
      </div>
    );
  }

  return <div className="animate-pulse bg-slate-300 dark:bg-slate-700 rounded" />;
};

export default SkeletonLoader;
