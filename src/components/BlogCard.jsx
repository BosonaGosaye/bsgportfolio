import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  return (
    <article className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-slate-200 dark:border-slate-700 flex flex-col h-full group">
      <Link to={`/blog/${blog.slug}`} className="aspect-video relative overflow-hidden block">
        <img
          src={blog.featuredImage}
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
          <div className="flex items-center">
            <User size={14} className="mr-1" />
            {blog.author}
          </div>
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            {new Date(blog.publishDate).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            {blog.readTime}
          </div>
        </div>
        <h3 className="text-xl font-bold mb-3 hover:text-primary transition-colors">
          <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 flex-grow">
          {blog.excerpt}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[10px] font-medium">
              #{tag}
            </span>
          ))}
        </div>
        <Link
          to={`/blog/${blog.slug}`}
          className="inline-flex items-center text-primary font-semibold hover:underline"
        >
          Read More <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
