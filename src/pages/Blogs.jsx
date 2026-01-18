import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Tag, Calendar as CalendarIcon, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { getBlogs } from '../services/api';
import BlogCard from '../components/BlogCard';
import SkeletonLoader from '../components/SkeletonLoader';
import Meta from '../components/Meta';
import SectionHeader from '../components/SectionHeader';

const BLOGS_PER_PAGE = 6;

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
        setBlogs(data.blogs);
        setTotalPages(data.pages);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [currentPage, selectedTag]);

  // Client-side search for the current page (could be improved by server-side search)
  const filteredBlogs = useMemo(() => {
    if (!searchTerm) return blogs;
    const term = searchTerm.toLowerCase();
    return blogs.filter(blog => 
      blog.title.toLowerCase().includes(term) || 
      blog.excerpt.toLowerCase().includes(term)
    );
  }, [blogs, searchTerm]);

  // Extract all unique tags for the filter (ideally this would come from an API)
  // For now, we'll just use a set of common tags or collect from current blogs
  const allTags = useMemo(() => {
    return ['All', 'React', 'Node.js', 'Web Dev', 'JavaScript', 'Tutorial', 'Personal'];
  }, []);

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
        <SectionHeader 
          title="Our Blog" 
          subtitle="Sharing knowledge, experiences, and the latest trends in technology."
        />

        {/* Search and Tag Filter */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar lg:max-w-md">
            <Tag size={18} className="text-slate-400 flex-shrink-0" />
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => {setSelectedTag(tag); setCurrentPage(1);}}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedTag === tag 
                    ? 'bg-primary text-white' 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [...Array(6)].map((_, i) => <SkeletonLoader key={i} type="blog" />)
          ) : filteredBlogs.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {filteredBlogs.map((blog) => (
                <motion.div
                  key={blog._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <BlogCard blog={blog} />
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="col-span-full py-20 text-center">
              <BookOpen size={64} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-bold mb-2">No blog posts found</h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                We couldn't find any articles matching your search or tag. Try a different term or browse all posts.
              </p>
              <button 
                onClick={() => {setSearchTerm(''); setSelectedTag('All');}}
                className="mt-6 text-primary font-bold hover:underline"
              >
                View all articles
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center mt-16 space-x-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-full border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Blogs;
