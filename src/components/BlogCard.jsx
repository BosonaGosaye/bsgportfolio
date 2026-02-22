import { Calendar, Clock, ArrowRight, User, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BlogCard = ({ blog, readingTime }) => {
  const displayReadingTime = readingTime || blog.readTime || '5 min';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      className="glass-card rounded-2xl overflow-hidden flex flex-col h-full group relative"
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-purple-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

      <Link to={`/blog/${blog.slug}`} className="aspect-video relative overflow-hidden block bg-slate-100 dark:bg-slate-800">
        <img
          src={blog.featuredImage || blog.coverImage}
          alt={blog.title}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Reading Time Badge */}
        <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full flex items-center gap-1.5 shadow-lg">
          <Clock size={14} className="text-primary" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {typeof displayReadingTime === 'number' ? `${displayReadingTime} min` : displayReadingTime}
          </span>
        </div>
      </Link>

      <div className="p-6 flex flex-col flex-grow relative z-10">
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
          {blog.author && (
            <div className="flex items-center gap-1">
              <User size={14} />
              <span className="font-medium">{blog.author}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            {new Date(blog.publishedAt || blog.publishDate || blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
          <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
        </h3>

        <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 flex-grow leading-relaxed">
          {blog.excerpt}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="px-2.5 py-1 bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary dark:text-primary-light rounded-full text-xs font-semibold border border-primary/20">
              #{tag}
            </span>
          ))}
        </div>

        <Link
          to={`/blog/${blog.slug}`}
          className="inline-flex items-center text-primary font-bold hover:gap-2 gap-1 transition-all group/link"
        >
          Read More <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.article>
  );
};

export default BlogCard;
