import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BlogCard = ({ blog }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-primary/50 flex flex-col h-full group relative"
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-purple-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

      <Link to={`/blog/${blog.slug}`} className="aspect-video relative overflow-hidden block">
        <img
          src={blog.featuredImage}
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>
      <div className="p-6 flex flex-col flex-grow relative z-10">
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
          <div className="flex items-center gap-1">
            <User size={14} />
            <span className="font-medium">{blog.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            {new Date(blog.publishDate).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            {blog.readTime}
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
