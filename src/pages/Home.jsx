import { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Download, Mail, Code, Briefcase, Users, Award, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getProfile, getProjects, getSkills, getBlogs, getServices } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import BlogCard from '../components/BlogCard';
import SkillBar from '../components/SkillBar';
import ServiceCard from '../components/ServiceCard';
import SkeletonLoader from '../components/SkeletonLoader';
import Meta from '../components/Meta';
import { useRef } from 'react';

// Counter Animation Component
const AnimatedCounter = ({ end, duration = 2, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isInView]);

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
      {prefix}{count}{suffix}
    </span>
  );
};

// Typing Animation Component
const TypingAnimation = ({ texts, speed = 100 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[currentIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((currentIndex + 1) % texts.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [displayText, currentIndex, isDeleting, texts, speed]);

  return (
    <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, projectsRes, skillsRes, blogsRes, servicesRes] = await Promise.all([
          getProfile(),
          getProjects(true),
          getSkills(),
          getBlogs({ limit: 3 }),
          getServices()
        ]);

        setProfile(profileRes.data);
        setProjects(projectsRes.data);
        setSkills(skillsRes.data);
        setBlogs(blogsRes.data);
        const servicesData = servicesRes.data?.data || servicesRes.data || [];
        setServices(Array.isArray(servicesData) ? servicesData.filter(s => s.featured).slice(0, 3) : []);
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

  const typingTexts = [
    profile?.title || 'Full Stack Developer',
    'Problem Solver',
    'Creative Thinker',
    'Tech Enthusiast'
  ];

  return (
    <>
      <Meta
        title="Home"
        description={profile?.shortBio}
        image={profile?.profileImage}
      />

      {/* Hero Section with Enhanced Animations */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 animate-gradient-shift" />

        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-blob animation-delay-4000" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Welcome to my portfolio</span>
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                Hi, I'm <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">{profile?.name || '...'}</span>
              </h1>

              <h2 className="text-2xl md:text-3xl font-bold text-slate-600 dark:text-slate-400 mb-6 min-h-[3rem]">
                {!loading && <TypingAnimation texts={typingTexts} />}
              </h2>

              <div className="prose prose-lg dark:prose-invert max-w-xl mb-8">
                <ReactMarkdown>{profile?.shortBio || '...'}</ReactMarkdown>
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
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group px-8 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-slate-300 dark:border-slate-600 rounded-xl font-bold flex items-center hover:border-primary hover:bg-primary/5 hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Download Resume <Download className="ml-2 group-hover:translate-y-0.5 transition-transform" size={20} />
                  </a>
                )}
              </div>
            </motion.div>

            {/* Profile Image with Enhanced Effects */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="w-64 h-64 md:w-96 md:h-96 mx-auto relative">
                {/* Animated Glow Rings */}
                <div className="absolute -inset-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-full blur-2xl opacity-30 animate-pulse" />
                <div className="absolute -inset-8 bg-gradient-to-r from-pink-500 via-purple-500 to-primary rounded-full blur-3xl opacity-20 animate-blob" />

                {loading ? (
                  <div className="w-full h-full bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse relative z-10" />
                ) : (
                  <motion.img
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    src={profile?.profileImage}
                    alt={profile?.name}
                    className="w-full h-full object-cover rounded-full border-4 border-white dark:border-slate-800 shadow-2xl relative z-10"
                  />
                )}

                {/* Decorative Elements */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-primary to-purple-500 rounded-2xl opacity-20 blur-xl"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl opacity-20 blur-xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section - NEW */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Code, label: 'Projects Completed', value: projects.length, suffix: '+' },
              { icon: Briefcase, label: 'Years Experience', value: 3, suffix: '+' },
              { icon: Award, label: 'Certifications', value: 5, suffix: '' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.05 }}
                className="relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 text-center group"
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-8 h-8 text-primary" />
                  </div>
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-2">
                    {stat.label}
                  </p>
                </div>

                {/* Decorative Element */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview with Glassmorphism */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800/50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-12 rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-700/50"
          >
            <TrendingUp className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">About Me</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 italic leading-relaxed">
              "{profile?.shortBio || '...'}"
            </p>
            <Link
              to="/about"
              className="inline-flex items-center text-primary font-bold hover:underline group"
            >
              Read Full Story <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-end mb-12"
          >
            <div>
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Featured Projects</h2>
              <p className="text-slate-600 dark:text-slate-400">Some of my recent work that I'm proud of.</p>
            </div>
            <Link to="/projects" className="hidden md:flex items-center text-primary font-bold hover:underline group">
              View All Projects <ArrowRight size={20} className="ml-2 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [...Array(3)].map((_, i) => <SkeletonLoader key={i} />)
            ) : projects.length > 0 ? (
              projects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))
            ) : (
              <p className="col-span-full text-center text-slate-500">No projects found.</p>
            )}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-end mb-12"
          >
            <div>
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Services I Offer</h2>
              <p className="text-slate-600 dark:text-slate-400">Professional solutions tailored to your needs.</p>
            </div>
            <Link to="/services" className="hidden md:flex items-center text-primary font-bold hover:underline group">
              View All Services <ArrowRight size={20} className="ml-2 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [...Array(3)].map((_, i) => <SkeletonLoader key={i} />)
            ) : services.length > 0 ? (
              services.map((service, index) => (
                <ServiceCard key={service._id} service={service} index={index} />
              ))
            ) : (
              <p className="col-span-full text-center text-slate-500">No services available yet.</p>
            )}
          </div>

          <div className="text-center mt-12 md:hidden">
            <Link
              to="/services"
              className="inline-flex items-center text-primary font-bold hover:underline group"
            >
              View All Services <ArrowRight size={20} className="ml-2 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Skills Summary */}
      <section className="py-20 bg-slate-100 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Core Skills</h2>
            <p className="text-slate-600 dark:text-slate-400">My technical expertise and toolset.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {loading ? (
              [...Array(6)].map((_, i) => <SkeletonLoader key={i} type="bar" />)
            ) : skills.length > 0 ? (
              skills
                .filter(skill => skill.category === 'Tools & Technologies')
                .map((skill, index) => (
                  <motion.div
                    key={skill._id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <SkillBar skill={skill} />
                  </motion.div>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-end mb-12"
          >
            <div>
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Latest from the Blog</h2>
              <p className="text-slate-600 dark:text-slate-400">Insights, tutorials, and thoughts on development.</p>
            </div>
            <Link to="/blog" className="hidden md:flex items-center text-primary font-bold hover:underline group">
              View All Posts <ArrowRight size={20} className="ml-2 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [...Array(3)].map((_, i) => <SkeletonLoader key={i} type="blog" />)
            ) : blogs.length > 0 ? (
              blogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BlogCard blog={blog} />
                </motion.div>
              ))
            ) : (
              <p className="col-span-full text-center text-slate-500">No blog posts found.</p>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA with Enhanced Design */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-600 to-purple-600" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-16 h-16 text-white mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Let's work together on your next project
            </h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
              I'm currently available for freelance work and full-time opportunities.
              Feel free to reach out for a consultation or just to say hi!
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-10 py-4 bg-white text-primary rounded-xl font-bold text-lg hover:bg-blue-50 hover:scale-105 transition-all shadow-2xl group"
            >
              Get In Touch
              <Mail className="ml-2 group-hover:translate-x-1 transition-transform" size={24} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
