import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Download, Mail, Code, Briefcase, Users, Award, Sparkles, Github, Linkedin, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getHomeData } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import BlogCard from '../components/BlogCard';
import SkillBar from '../components/SkillBar';
import ServiceCard from '../components/ServiceCard';
import SkeletonLoader from '../components/SkeletonLoader';
import Meta from '../components/Meta';
import TimelineItem from '../components/TimelineItem';
import SectionHeader from '../components/SectionHeader';
import MagneticButton from '../components/MagneticButton';


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
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [services, setServices] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const homeData = await getHomeData();
        const { profile, education, experience, projects, skills, blogs, services, certifications } = homeData.data || homeData;

        setProfile(profile);
        setEducation(education || []);
        setExperience(experience || []);
        setProjects(projects || []);
        setSkills(skills || []);
        setBlogs(blogs || []);
        setServices(services || []);
        setCertifications(certifications || []);
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
          id="retry-button"
          name="retry-button"
          type="button"
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const typingTexts = profile?.titles?.length > 0
    ? profile.titles
    : [
      profile?.title || 'Full Stack Developer',
      'Problem Solver',
      'Creative Thinker',
      'Tech Enthusiast'
    ];

  const socialLinks = [
    { icon: Github, url: profile?.socialLinks?.github, label: 'GitHub' },
    { icon: Linkedin, url: profile?.socialLinks?.linkedin, label: 'LinkedIn' },
    { icon: Twitter, url: profile?.socialLinks?.twitter, label: 'Twitter' },
    { icon: Instagram, url: profile?.socialLinks?.instagram, label: 'Instagram' },
  ];

  return (
    <>
      <Meta
        title="Home"
        description={profile?.shortBio}
        image={profile?.profileImage}
      />

      {/* Hero Section with Parallax Effect */}
      <section className="relative min-h-[100vh] flex items-center pt-24 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-[120px] animate-blob" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/30 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-[120px] animate-blob animation-delay-4000" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Profile Image - Shows first on mobile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="relative perspective-1000 order-1 lg:order-2 lg:mb-16"
            >
              <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-[450px] md:h-[450px] mx-auto relative">
                {/* Multiple animated gradient layers */}
                <motion.div 
                  className="absolute -inset-8 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-full blur-3xl opacity-40"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div 
                  className="absolute -inset-6 bg-gradient-to-l from-blue-500 via-cyan-500 to-purple-500 rounded-full blur-2xl opacity-30"
                  animate={{ 
                    scale: [1.2, 1, 1.2],
                    rotate: [360, 180, 0]
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                />
                
                {loading ? (
                  <div className="w-full h-full bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse relative z-10" />
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.08, rotate: 3 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="relative z-10 w-full h-full"
                  >
                    <img
                      src={profile?.profileImage}
                      alt={profile?.name}
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover rounded-full border-8 border-white/50 dark:border-slate-800/50 shadow-2xl backdrop-blur-sm"
                    />
                    {/* Floating badge */}
                    <motion.div
                      className="absolute -bottom-4 -right-4 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-black text-xs sm:text-sm shadow-2xl flex items-center gap-2"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse" />
                      Available for work
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Text Content - Shows second on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >

              <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-black mb-3 sm:mb-5 leading-[1.05] tracking-tighter text-slate-900 dark:text-white">
                Hi, I'm{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-shift">
                    {profile?.name || '...'}
                  </span>
                  <motion.span
                    className="absolute -bottom-2 left-0 w-full h-2 sm:h-3 bg-gradient-to-r from-primary/30 to-purple-600/30 blur-xl"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </span>
              </h1>

              <h2 className="text-3xl md:text-4xl font-black text-slate-700 dark:text-slate-300 mb-3 min-h-[4rem]">
                {!loading && <TypingAnimation texts={typingTexts} />}
              </h2>

              <div className="prose prose-xl dark:prose-invert max-w-2xl mb-14 text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-6 text-lg md:text-xl text-justify">{children}</p>,
                    strong: ({ children }) => <strong className="text-primary font-bold relative inline-block">{children}</strong>,
                  }}
                >
                  {profile?.shortBio || '...'}
                </ReactMarkdown>
              </div>

              <div className="flex flex-wrap gap-3 sm:gap-5 mb-8 sm:mb-12">
                {socialLinks.map(({ icon: Icon, url, label }) => url && (
                  <motion.a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, y: -6, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative p-3 sm:p-5 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-2xl text-slate-600 dark:text-slate-400 hover:text-white hover:shadow-2xl border-2 border-slate-200/50 dark:border-slate-700/50 hover:border-primary/50 transition-all duration-300 group overflow-hidden"
                    aria-label={label}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Icon size={20} className="sm:w-6 sm:h-6 relative z-10" />
                  </motion.a>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <MagneticButton strength={0.3}>
                  <Link
                    to="/contact"
                    className="group px-8 py-3 sm:px-12 sm:py-5 bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-white rounded-2xl font-black text-base sm:text-lg flex items-center justify-center hover:shadow-2xl hover:shadow-primary/50 hover:scale-[1.05] transition-all duration-300 relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-primary"
                      initial={{ x: '100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative z-10">Get in touch</span>
                    <Mail className="ml-2 sm:ml-3 group-hover:translate-x-2 group-hover:rotate-12 transition-all relative z-10" size={20} />
                  </Link>
                </MagneticButton>
                <MagneticButton strength={0.3}>
                  <Link
                    to="/resume"
                    className="group px-8 py-3 sm:px-12 sm:py-5 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center hover:border-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-600/10 hover:scale-[1.05] transition-all duration-300 shadow-lg"
                  >
                    View Resume <Download className="ml-2 sm:ml-3 group-hover:translate-y-1 group-hover:animate-bounce transition-all" size={20} />
                  </Link>
                </MagneticButton>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section with Glassmorphism */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {[
              { icon: Code, label: 'Projects Completed', value: projects.length, suffix: '+', color: 'from-blue-500 to-cyan-500' },
              { icon: Briefcase, label: 'Years Experience', value: 3, suffix: '+', color: 'from-purple-500 to-pink-500' },
              { icon: Award, label: 'Certifications', value: certifications.length, suffix: '', color: 'from-orange-500 to-red-500' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, type: 'spring' }}
                whileHover={{ y: -15, scale: 1.05 }}
                className="relative glass-card p-12 text-center group hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                {/* Animated background gradient */}
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  animate={{ 
                    backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
                
                <motion.div 
                  className={`w-20 h-20 bg-gradient-to-br ${stat.color} rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl group-hover:shadow-2xl`}
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon className="w-10 h-10 text-white" />
                </motion.div>
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                <p className="text-lg font-black text-slate-900 dark:text-white mt-6 tracking-tight uppercase tracking-widest">{stat.label}</p>
                
                {/* Decorative corner elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section with Enhanced Design */}
      <section className="py-32 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-28 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: -50 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="relative order-2 lg:order-1"
            >
              <div className="relative w-full max-w-lg mx-auto group">
                {/* Multiple animated gradient layers */}
                <motion.div 
                  className="absolute -inset-10 bg-gradient-to-r from-primary to-purple-500 rounded-[4rem] blur-3xl opacity-20 group-hover:opacity-30"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div 
                  className="absolute -inset-8 bg-gradient-to-l from-pink-500 to-blue-500 rounded-[4rem] blur-2xl opacity-15 group-hover:opacity-25"
                  animate={{ rotate: [360, 0] }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                />
                
                <motion.img
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  src={profile?.aboutImage || profile?.profileImage}
                  alt="About Me"
                  loading="lazy"
                  decoding="async"
                  className="relative w-full rounded-[3rem] shadow-2xl border-4 border-white/30 dark:border-slate-800/30 z-10 aspect-[4/5] object-cover backdrop-blur-sm"
                />
                
                {/* Floating decorative elements */}
                <motion.div
                  className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-2xl flex items-center justify-center"
                  animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <span className="text-4xl">⚡</span>
                </motion.div>
                <motion.div
                  className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl shadow-2xl flex items-center justify-center"
                  animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                >
                  <span className="text-4xl">🚀</span>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="glass-card p-6 md:p-10 relative overflow-hidden order-1 lg:order-2"
            >
              <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />

              <div className="relative z-10">
                <motion.div 
                  className="flex items-center gap-4 mb-6"
                  whileHover={{ x: 10 }}
                >
                  <Sparkles className="w-12 h-12 text-primary animate-pulse" />
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-gradient">About Me</h2>
                </motion.div>
                <div className="prose prose-xl md:prose-2xl dark:prose-invert max-w-none mb-8 text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                     <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-10 leading-relaxed text-xl text-justify">{children}</p>,
                        strong: ({ children }) => <strong className="text-primary dark:text-primary font-black border-b-4 border-primary/30 pb-1">{children}</strong>,
                        em: ({ children }) => <em className="text-purple-600 dark:text-purple-400 italic not-italic font-bold bg-purple-500/10 px-3 py-1 rounded-lg">{children}</em>,
                        li: ({ children }) => <li className="mb-5 text-xl list-none flex items-start gap-4"><span className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-purple-600 mt-3 shrink-0 shadow-lg" />{children}</li>,
                        a: ({ children, href }) => <a href={href} className="text-primary hover:text-blue-700 underline decoration-4 underline-offset-8 transition-all font-black hover:decoration-wavy" target="_blank" rel="noopener noreferrer">{children}</a>
                       }}
                      >
                        {profile?.bio}
                     </ReactMarkdown>
                 </div>
                

                <motion.div whileHover={{ x: 10 }}>
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-3 text-primary font-black text-xl group hover:gap-5 transition-all"
                  >
                    Learn more about me 
                    <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Experience & Education Grid */}
      <section className="py-32 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-[150px] animate-blob" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full blur-[150px] animate-blob animation-delay-2000" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <motion.div 
                className="flex items-center gap-5 mb-16"
                whileHover={{ x: 10 }}
              >
                <motion.div 
                  className="p-4 bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-3xl"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Briefcase className="text-primary" size={32} />
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Experience</h2>
              </motion.div>
              <div className="space-y-8">
                {loading ? (
                  [...Array(2)].map((_, i) => <SkeletonLoader key={i} />)
                ) : Array.isArray(experience) && experience.length > 0 ? (
                  experience.map((exp, index) => (
                    <motion.div
                      key={exp._id}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 10, scale: 1.02 }}
                    >
                      <TimelineItem
                        title={exp.position}
                        subtitle={exp.company}
                        duration={`${new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${exp.current ? 'Present' : new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                        description={exp.description}
                        type="experience"
                      />
                    </motion.div>
                  ))
                ) : (
                  <p className="text-slate-500 text-center py-8">No experience records found.</p>
                )}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <motion.div 
                className="flex items-center gap-5 mb-16"
                whileHover={{ x: 10 }}
              >
                <motion.div 
                  className="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-3xl"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Users className="text-blue-500" size={32} />
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent">Education</h2>
              </motion.div>
              <div className="space-y-8">
                {loading ? (
                  [...Array(2)].map((_, i) => <SkeletonLoader key={i} />)
                ) : Array.isArray(education) && education.length > 0 ? (
                  education.map((edu, index) => (
                    <motion.div
                      key={edu._id}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 10, scale: 1.02 }}
                    >
                      <TimelineItem
                        title={edu.degree}
                        subtitle={edu.institution}
                        duration={`${new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${edu.current ? 'Present' : new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                        description={edu.description}
                        type="education"
                      />
                    </motion.div>
                  ))
                ) : (
                  <p className="text-slate-500 text-center py-8">No education records found.</p>
                )}
              </div>
            </motion.section>
          </div>
        </div>
      </section>

      {/* Enhanced Featured Projects Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-[150px] animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-[150px] animate-blob animation-delay-2000" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="inline-flex items-center gap-3 px-5 py-2 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-full mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <Code className="w-5 h-5 text-primary" />
                <span className="text-sm font-black uppercase tracking-wider text-primary">Portfolio</span>
              </motion.div>
              <h2 className="text-4xl md:text-5xl lg:text-5xl font-black tracking-tighter mb-6">
                <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Featured Projects
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
                A curated selection of my most recent and innovative digital solutions.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/projects"
                className="group px-10 py-5 bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-white rounded-2xl font-black text-lg flex items-center gap-3 hover:shadow-2xl hover:shadow-primary/50 transition-all relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-primary"
                  initial={{ x: '100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10">Explore All</span>
                <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform relative z-10" />
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
              [...Array(3)].map((_, i) => <SkeletonLoader key={i} />)
            ) : Array.isArray(projects) && projects.length > 0 ? (
              projects.slice(0, 3).map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, type: 'spring' }}
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

      {/* Enhanced Services Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-[150px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-pink-500/10 to-transparent rounded-full blur-[150px] animate-blob animation-delay-4000" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div 
              className="inline-flex items-center gap-3 px-5 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full mb-6"
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
              <span className="text-sm font-black uppercase tracking-wider bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Services</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-5xl font-black tracking-tighter mb-6">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                Expertise
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
              Delivering high-quality digital experiences tailored to your business goals.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-20">
            {loading ? (
              [...Array(3)].map((_, i) => <SkeletonLoader key={i} />)
            ) : Array.isArray(services) && services.length > 0 ? (
              services.map((service, index) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, type: 'spring' }}
                >
                  <ServiceCard service={service} index={index} />
                </motion.div>
              ))
            ) : (
              <p className="col-span-full text-center text-slate-500">No services available yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Enhanced Skills Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-transparent rounded-full blur-[150px] animate-pulse" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div 
              className="inline-flex items-center gap-3 px-5 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full mb-6"
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              <Code className="w-5 h-5 text-blue-600 animate-pulse" />
              <span className="text-sm font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Tech Stack</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-5xl font-black tracking-tighter mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                Tools & Technologies
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
              My technical expertise and toolset for building modern applications.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 mt-20">
            {loading ? (
              [...Array(6)].map((_, i) => <SkeletonLoader key={i} type="bar" />)
            ) : Array.isArray(skills) && skills.length > 0 ? (
              skills.map((skill, index) => (
                <motion.div
                  key={skill._id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
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

      {/* Blog Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-gradient mb-4">Insights & Thoughts</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 font-medium max-w-2xl">Sharing my journey, tutorials, and latest trends in technology.</p>
            </div>
            <Link to="/blog" className="px-8 py-3 glass-card rounded-2xl font-bold flex items-center gap-2 hover:text-primary transition-all group">
              Read Blog <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [...Array(3)].map((_, i) => <SkeletonLoader key={i} type="blog" />)
            ) : Array.isArray(blogs) && blogs.length > 0 ? (
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

      {/* Enhanced Contact CTA with 3D Effect */}
      <section className="py-40 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-pink-600" />
        <motion.div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
          animate={{ 
            backgroundPosition: ['0px 0px', '40px 40px']
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="relative overflow-hidden group"
          >
            {/* Glassmorphism card */}
            <div className="bg-white/10 backdrop-blur-2xl p-16 md:p-24 text-center rounded-[3rem] border-2 border-white/20 shadow-2xl">
              {/* Animated gradient orbs */}
              <motion.div
                className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  x: [0, 50, 0],
                  y: [0, -50, 0]
                }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-64 h-64 bg-purple-300/20 rounded-full blur-3xl"
                animate={{ 
                  scale: [1.2, 1, 1.2],
                  x: [0, -50, 0],
                  y: [0, 50, 0]
                }}
                transition={{ duration: 10, repeat: Infinity }}
              />

              <div className="relative z-10">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Sparkles className="w-20 h-20 text-white mx-auto mb-10 drop-shadow-2xl" />
                </motion.div>
                
                <h2 className="text-5xl md:text-7xl font-black text-white mb-10 tracking-tighter leading-tight">
                  Let's build something{" "}
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                      extraordinary
                    </span>
                    <motion.span
                      className="absolute -bottom-2 left-0 w-full h-4 bg-yellow-300/50 blur-lg"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </span>
                  {" "}together
                </h2>
                
                <p className="text-2xl text-white/90 mb-14 max-w-2xl mx-auto font-medium leading-relaxed">
                  I'm currently available for freelance work and full-time opportunities. Let's transform your vision into reality.
                </p>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/contact"
                    className="inline-flex items-center px-14 py-6 bg-white text-primary rounded-2xl font-black text-2xl hover:shadow-2xl hover:bg-gradient-to-r hover:from-yellow-300 hover:to-pink-300 hover:text-slate-900 transition-all relative overflow-hidden group/btn"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative z-10">Start a conversation</span>
                    <Mail className="ml-4 relative z-10 group-hover/btn:rotate-12 group-hover/btn:scale-110 transition-all" size={28} />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
