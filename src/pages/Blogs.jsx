import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Tag, Calendar as CalendarIcon, ChevronLeft, ChevronRight, BookOpen, Clock, Sparkles, TrendingUp } from 'lucide-react';
import { getBlogs } from '../services/api';
import BlogCard from '../components/BlogCard';
import SkeletonLoader from '../components/SkeletonLoader';
import Meta from '../components/Meta';
import SectionHeader from '../components/SectionHeader';
import { Link } from 'react-router-dom';

const BLOGS_PER_PAGE = 6;

// Calculate reading time
const calculateReadingTime = (content) => {
  const wordsPerMinute = 200;
  const words = content?.split(/\s+/).length || 0;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
};

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [selectedTag, setSelectedTag] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [featuredBlog, setFeaturedBlog] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: BLOGS_PER_PAGE,
          tag: selectedTag !== 'All' ? selectedTag : undefined
        };
        const { data } = await getBlogs(params);
        setBlogs(data.blogs || data);
        setTotalPages(data.pages || 1);

        // Set featured blog (first blog or most recent)
        if (currentPage === 1 && (data.blogs || data).length > 0) {
          setFeaturedBlog((data.blogs || data)[0]);
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [currentPage, selectedTag]);

  // Client-side search with debounce
  const filteredBlogs = useMemo(() => {
    if (!debouncedSearchTerm) return blogs;
    const term = debouncedSearchTerm.toLowerCase();
    return blogs.filter(blog =>
      blog.title.toLowerCase().includes(term) ||
      blog.excerpt.toLowerCase().includes(term)
    );
  }, [blogs, debouncedSearchTerm]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = blogs.flatMap(blog => blog.tags || []);
    return ['All', ...new Set(tags)];
  }, [blogs]);

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
        title="Blog"
        description="Read my latest thoughts, tutorials, and insights on software engineering and web development."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Enhanced Header with 3D Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 relative"
        >
          {/* Animated background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 rounded-full blur-[150px] animate-pulse" />
          
          <motion.div 
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-2 border-primary/30 rounded-full mb-8 relative z-10 shadow-lg"
            whileHover={{ scale: 1.05, rotate: 2 }}
          >
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-sm font-black uppercase tracking-widest bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Blog</span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-10 tracking-tighter relative z-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm animate-gradient-shift">
              Latest Articles
            </span>
            <motion.div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-56 h-2 bg-gradient-to-r from-primary via-purple-600 to-pink-600 rounded-full shadow-lg"
              animate={{ scaleX: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.h1>
          
          <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium relative z-10">
            Sharing knowledge, experiences, and the latest trends in technology.
          </p>
        </motion.div>

        {/* Featured Blog Hero with Enhanced Design */}
        {featuredBlog && currentPage === 1 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-20 relative group"
          >
            <Link to={`/blog/${featuredBlog.slug}`}>
              <div className="relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/20 dark:border-slate-800/20">
                <motion.img
                  src={featuredBlog.coverImage}
                  alt={featuredBlog.title}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-10 md:p-16">
                  <div className="flex items-center gap-5 mb-6">
                    <motion.span 
                      className="px-6 py-2 bg-gradient-to-r from-primary to-purple-600 text-white text-sm font-black rounded-full shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      Featured
                    </motion.span>
                    <div className="flex items-center gap-3 text-white/90 text-sm font-bold">
                      <Clock size={18} />
                      <span>{calculateReadingTime(featuredBlog.content)} min read</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/90 text-sm font-bold">
                      <CalendarIcon size={18} />
                      <span>{new Date(featuredBlog.publishedAt || featuredBlog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-10 group-hover:text-primary transition-all tracking-tighter leading-[1.1]">
                    {featuredBlog.title}
                  </h2>
                  <p className="text-white/90 text-2xl md:text-3xl mb-12 line-clamp-2 leading-relaxed max-w-5xl font-medium">
                    {featuredBlog.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {featuredBlog.tags?.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-black rounded-full border-2 border-white/30"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Enhanced Search and Tag Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col lg:flex-row gap-8 mb-16"
        >
          <div className="flex-grow relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors z-10" size={24} />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-14 pr-4 py-5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-lg hover:shadow-xl font-medium text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <motion.span 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Searching...
              </motion.span>
            )}
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar lg:max-w-3xl">
            <Tag size={22} className="text-slate-400 flex-shrink-0" />
            {allTags.map(tag => (
              <motion.button
                key={tag}
                onClick={() => { setSelectedTag(tag); setCurrentPage(1); }}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-2xl text-sm font-black whitespace-nowrap transition-all shadow-md ${selectedTag === tag
                    ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/40 scale-105'
                    : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700'
                  }`}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [...Array(6)].map((_, i) => <SkeletonLoader key={i} type="blog" />)
          ) : filteredBlogs.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {filteredBlogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <BlogCard blog={blog} readingTime={calculateReadingTime(blog.content)} />
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
                <BookOpen size={64} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold mb-2">No blog posts found</h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
                  We couldn't find any articles matching your search or tag. Try a different term or browse all posts.
                </p>
                <button
                  onClick={() => { setSearchTerm(''); setSelectedTag('All'); }}
                  className="px-6 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  View all articles
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Enhanced Pagination */}
        {!loading && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center items-center mt-16 gap-4"
          >
            <motion.button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              whileHover={{ scale: currentPage === 1 ? 1 : 1.1 }}
              whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
              className="p-3 rounded-full border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all disabled:cursor-not-allowed"
            >
              <ChevronLeft size={24} />
            </motion.button>

            <span className="font-bold text-slate-700 dark:text-slate-300 px-4">
              Page {currentPage} of {totalPages}
            </span>

            <motion.button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              whileHover={{ scale: currentPage === totalPages ? 1 : 1.1 }}
              whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
              className="p-3 rounded-full border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all disabled:cursor-not-allowed"
            >
              <ChevronRight size={24} />
            </motion.button>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Blogs;
