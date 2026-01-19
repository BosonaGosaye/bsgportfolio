import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getProfile, getProjects, getSkills, getBlogs } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import BlogCard from '../components/BlogCard';
import SkillBar from '../components/SkillBar';
import SkeletonLoader from '../components/SkeletonLoader';
import Meta from '../components/Meta';

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, projectsRes, skillsRes, blogsRes] = await Promise.all([
          getProfile(),
          getProjects(true),
          getSkills(),
          getBlogs({ limit: 3 })
        ]);

        setProfile(profileRes.data);
        setProjects(projectsRes.data);
        setSkills(skillsRes.data);
        setBlogs(blogsRes.data);
      } catch (err) {
        console.error('Error fetching home data:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
        title="Home"
        description={profile?.shortBio}
        image={profile?.profileImage}
      />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                Hi, I'm <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient">{profile?.name || '...'}</span>
              </h1>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-600 dark:text-slate-400 mb-6">
                {profile?.title || '...'}
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-xl mb-8">
                <ReactMarkdown>{profile?.bio || '...'}</ReactMarkdown>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="group px-8 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl font-bold flex items-center hover:shadow-xl hover:shadow-primary/50 hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-500/30"
                >
                  Contact Me <Mail className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
                {profile?.resumeUrl && (
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group px-8 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-xl font-bold flex items-center hover:border-primary hover:bg-primary/5 hover:scale-105 transition-all duration-300"
                  >
                    Download Resume <Download className="ml-2 group-hover:translate-y-0.5 transition-transform" size={20} />
                  </a>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="w-64 h-64 md:w-96 md:h-96 mx-auto relative z-10">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-blob filter blur-3xl" />
                {loading ? (
                  <div className="w-full h-full bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
                ) : (
                  <img
                    src={profile?.profileImage}
                    alt={profile?.name}
                    className="w-full h-full object-cover rounded-full border-4 border-white dark:border-slate-800 shadow-2xl relative z-10"
                  />
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 bg-slate-100 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">About Me</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 italic">
              "{profile?.shortBio || '...'}"
            </p>
            <Link
              to="/about"
              className="text-primary font-bold inline-flex items-center hover:underline"
            >
              Read Full Story <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
              <p className="text-slate-600 dark:text-slate-400">Some of my recent work that I'm proud of.</p>
            </div>
            <Link to="/projects" className="hidden md:flex items-center text-primary font-bold hover:underline">
              View All Projects <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [...Array(3)].map((_, i) => <SkeletonLoader key={i} />)
            ) : projects.length > 0 ? (
              projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))
            ) : (
              <p className="col-span-full text-center text-slate-500">No projects found.</p>
            )}
          </div>
        </div>
      </section>

      {/* Skills Summary */}
      <section className="py-20 bg-slate-100 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Core Skills</h2>
            <p className="text-slate-600 dark:text-slate-400">My technical expertise and toolset.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {loading ? (
              [...Array(6)].map((_, i) => <SkeletonLoader key={i} type="bar" />)
            ) : skills.length > 0 ? (
              skills.map((skill) => (
                <SkillBar key={skill._id} skill={skill} />
              ))
            ) : (
              <p className="col-span-full text-center text-slate-500">No skills added yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Latest from the Blog</h2>
              <p className="text-slate-600 dark:text-slate-400">Insights, tutorials, and thoughts on development.</p>
            </div>
            <Link to="/blog" className="hidden md:flex items-center text-primary font-bold hover:underline">
              View All Posts <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [...Array(3)].map((_, i) => <SkeletonLoader key={i} type="blog" />)
            ) : blogs.length > 0 ? (
              blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))
            ) : (
              <p className="col-span-full text-center text-slate-500">No blog posts found.</p>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Let's work together on your next project
          </h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            I'm currently available for freelance work and full-time opportunities.
            Feel free to reach out for a consultation or just to say hi!
          </p>
          <Link
            to="/contact"
            className="px-10 py-4 bg-white text-primary rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl"
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
