import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Calendar, Clock, User, ArrowLeft, Share2, Eye, Tag } from 'lucide-react';
import { getBlogBySlug, incrementBlogViews, getBlogs } from '../services/api';
import Meta from '../components/Meta';
import BlogCard from '../components/BlogCard';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        const { data } = await getBlogBySlug(slug);
        setBlog(data);
        
        // Increment views
        await incrementBlogViews(data._id);

        // Fetch related posts (latest 3 excluding current)
        const relatedRes = await getBlogs({ limit: 4 });
        setRelatedPosts(relatedRes.data.blogs.filter(b => b._id !== data._id).slice(0, 3));
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Blog post not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogData();
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 w-24 mb-8 rounded" />
        <div className="h-12 bg-slate-200 dark:bg-slate-800 w-full mb-6 rounded" />
        <div className="flex gap-4 mb-12">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 w-32 rounded" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 w-32 rounded" />
        </div>
        <div className="aspect-video bg-slate-200 dark:bg-slate-800 rounded-2xl mb-12" />
        <div className="space-y-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 w-full rounded" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 w-full rounded" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 w-3/4 rounded" />
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold text-red-500 mb-4">{error}</h2>
        <Link to="/blog" className="text-primary font-bold flex items-center hover:underline">
          <ArrowLeft size={20} className="mr-2" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <>
      <Meta 
        title={blog.title} 
        description={blog.excerpt} 
        image={blog.featuredImage}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Link to="/blog" className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-primary mb-8 font-medium transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Back to Blog
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">{blog.title}</h1>
          
          <div className="flex flex-wrap items-center gap-6 text-slate-600 dark:text-slate-400 text-sm md:text-base border-b border-slate-200 dark:border-slate-800 pb-8">
            <div className="flex items-center">
              <User size={20} className="mr-2 text-primary" />
              <span className="font-semibold">{blog.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar size={18} className="mr-2" />
              {new Date(blog.publishDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
            </div>
            <div className="flex items-center">
              <Clock size={18} className="mr-2" />
              {blog.readTime} read
            </div>
            <div className="flex items-center">
              <Eye size={18} className="mr-2" />
              {blog.views} views
            </div>
            <button 
              onClick={handleShare}
              className="ml-auto p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-primary hover:text-white transition-all"
              title="Share Article"
            >
              <Share2 size={20} />
            </button>
          </div>
        </header>

        <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl mb-12">
          <img 
            src={blog.featuredImage} 
            alt={blog.title} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </div>

        <div className="flex flex-wrap gap-2 mb-16 pb-12 border-b border-slate-200 dark:border-slate-800">
          <Tag size={20} className="mr-2 text-slate-400" />
          {blog.tags?.map(tag => (
            <Link 
              key={tag} 
              to={`/blog?tag=${tag}`}
              className="px-4 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-sm font-bold hover:bg-primary hover:text-white transition-all"
            >
              #{tag}
            </Link>
          ))}
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-10">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map(post => (
                <BlogCard key={post._id} blog={post} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-20 bg-primary/5 dark:bg-primary/10 rounded-3xl p-8 md:p-12 text-center">
          <h3 className="text-2xl font-bold mb-4">Enjoyed this article?</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">
            Stay updated with my latest thoughts on technology, development, and more. 
            Feel free to reach out if you have any questions!
          </p>
          <Link 
            to="/contact" 
            className="inline-block px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30"
          >
            Get In Touch
          </Link>
        </div>
      </article>
    </>
  );
};

export default BlogDetail;
