import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SortAsc, SortDesc, SlidersHorizontal, LayoutGrid, List, X, Sparkles } from 'lucide-react';
import { getProjects } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import SkeletonLoader from '../components/SkeletonLoader';
import Meta from '../components/Meta';
import SectionHeader from '../components/SectionHeader';

const PROJECTS_PER_PAGE = 6;

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, popularity
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState(localStorage.getItem('projectViewMode') || 'grid'); // grid or list

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const { data } = await getProjects();
        setProjects(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const categories = useMemo(() => {
    const cats = projects.map(p => p.category).filter(Boolean);
    return ['All', ...new Set(cats)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Search filter (Title or Tech Stack)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(term) ||
        p.techStack.some(tech => tech.toLowerCase().includes(term))
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'popularity') return b.popularity - a.popularity;
      return 0;
    });

    return result;
  }, [projects, searchTerm, selectedCategory, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem('projectViewMode', mode);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortBy('newest');
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'All' || sortBy !== 'newest';

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold text-red-500 mb-4">{error}</h2>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <Meta
        title="Projects"
        description="Explore my portfolio of web development projects, ranging from small tools to full-stack applications."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Enhanced Header with Gradient and Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 relative"
        >
          {/* Animated background elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 rounded-full blur-[150px] animate-pulse" />
          
          <motion.div 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-2 border-primary/30 rounded-full mb-6 relative z-10"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-sm font-black uppercase tracking-widest bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Portfolio</span>
          </motion.div>
          
          <motion.h1 
            className="text-6xl md:text-8xl lg:text-9xl font-black mb-10 tracking-tighter relative z-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm animate-gradient-shift">
              My Projects
            </span>
            <motion.div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-2 bg-gradient-to-r from-primary via-purple-600 to-pink-600 rounded-full shadow-lg"
              animate={{ scaleX: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.h1>
          
          <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium relative z-10">
            A collection of my work, experiments, and open-source contributions.
          </p>
        </motion.div>

        {/* Enhanced Search and Filters Bar with Glassmorphism and 3D Effects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative bg-gradient-to-br from-white/80 via-white/70 to-white/60 dark:from-slate-800/80 dark:via-slate-800/70 dark:to-slate-800/60 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border-2 border-white/50 dark:border-slate-700/50 mb-16 group"
        >
          {/* Animated Gradient Overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 rounded-3xl pointer-events-none"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />

          <div className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
              {/* Enhanced Search */}
              <div className="lg:col-span-2 relative group/search">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-primary transition-colors z-10" size={22} />
                <input
                  type="text"
                  placeholder="Search by title or tech stack..."
                  className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm hover:shadow-md font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Enhanced Category Filter */}
              <div className="relative group/filter">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" size={20} />
                <select
                  className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none cursor-pointer appearance-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all shadow-sm hover:shadow-md font-bold"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Enhanced Sort */}
              <div className="relative group/sort">
                <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" size={20} />
                <select
                  className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none cursor-pointer appearance-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all shadow-sm hover:shadow-md font-bold"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="popularity">Most Popular</option>
                </select>
              </div>
            </div>

            {/* Enhanced View Toggle and Clear Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.span 
                  className="text-sm font-black text-slate-600 dark:text-slate-400 px-4 py-2 bg-slate-100 dark:bg-slate-900/50 rounded-full"
                  key={filteredProjects.length}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                >
                  {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} found
                </motion.span>
                {hasActiveFilters && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-black text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-full transition-all shadow-lg hover:shadow-xl"
                  >
                    <X size={16} />
                    Clear filters
                  </motion.button>
                )}
              </div>

              {/* Enhanced View Mode Toggle */}
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-xl shadow-inner">
                <motion.button
                  onClick={() => handleViewModeChange('grid')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 rounded-lg transition-all ${viewMode === 'grid'
                      ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                  aria-label="Grid view"
                >
                  <LayoutGrid size={20} />
                </motion.button>
                <motion.button
                  onClick={() => handleViewModeChange('list')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 rounded-lg transition-all ${viewMode === 'list'
                      ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                  aria-label="List view"
                >
                  <List size={20} />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid/List */}
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
          : 'flex flex-col gap-6'
        }>
          {loading ? (
            [...Array(6)].map((_, i) => <SkeletonLoader key={i} />)
          ) : paginatedProjects.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {paginatedProjects.map((project, index) => (
                <motion.div
                  key={project._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={viewMode === 'list' ? 'w-full' : ''}
                >
                  <ProjectCard project={project} viewMode={viewMode} />
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full py-20 text-center"
            >
              <div className="inline-block p-12 bg-slate-100 dark:bg-slate-800/50 rounded-3xl">
                <LayoutGrid size={64} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold mb-2">No projects found</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Enhanced Pagination */}
        {!loading && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-16 gap-2"
          >
            {[...Array(totalPages)].map((_, i) => (
              <motion.button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === i + 1
                    ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/30'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
              >
                {i + 1}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Projects;
