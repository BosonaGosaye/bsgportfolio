import { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Download, Mail, Code, Briefcase, Users, Award, Sparkles, TrendingUp, Github, Linkedin, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getProfile, getProjects, getSkills, getBlogs, getServices, getEducation, getExperience } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import BlogCard from '../components/BlogCard';
import SkillBar from '../components/SkillBar';
import ServiceCard from '../components/ServiceCard';
import SkeletonLoader from '../components/SkeletonLoader';
import Meta from '../components/Meta';
import TimelineItem from '../components/TimelineItem';
import SectionHeader from '../components/SectionHeader';
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
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
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
        const [profileRes, eduRes, expRes, projectsRes, skillsRes, blogsRes, servicesRes] = await Promise.all([
          getProfile(),
          getEducation(),
          getExperience(),
          getProjects(true),
          getSkills(),
          getBlogs({ limit: 3 }),
          getServices()
        ]);

        setProfile(profileRes.data);
        setEducation(eduRes.data?.data || eduRes.data || []);
        setExperience(expRes.data?.data || expRes.data || []);
        setProjects(projectsRes.data?.data || projectsRes.data || []);
        const allSkills = skillsRes.data?.data || skillsRes.data || [];
        setSkills(allSkills.filter(skill => skill.category === 'Tools & Technologies'));
        setBlogs(blogsRes.data?.data || blogsRes.data || []);
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

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 animate-gradient-shift" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.05] tracking-tighter text-slate-900 dark:text-white">
                Hi, I'm <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">{profile?.name || '...'}</span>
              </h1>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-700 dark:text-slate-300 mb-10 min-h-[4rem] tracking-tight">
                {!loading && <TypingAnimation texts={typingTexts} />}
              </h2>

              <div className="prose prose-xl dark:prose-invert max-w-2xl mb-12 text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-6">{children}</p>,
                    strong: ({ children }) => <strong className="text-primary font-black uppercase tracking-wide">{children}</strong>,
                  }}
                >
                  {profile?.shortBio || '...'}
                </ReactMarkdown>
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

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="w-64 h-64 md:w-96 md:h-96 mx-auto relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-full blur-2xl opacity-30 animate-pulse" />
                {loading ? (
                  <div className="w-full h-full bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse relative z-10" />
                ) : (
                  <motion.img
                    whileHover={{ scale: 1.05, rotate: 2 }}
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

      {/* Stats Section */}
      <section className="py-12 relative overflow-hidden">
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
                className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 text-center"
              >
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                <p className="text-base font-bold text-slate-900 dark:text-white mt-3 tracking-tight">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative w-full max-w-md mx-auto">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary to-purple-500 rounded-3xl blur-2xl opacity-20" />
                <img
                  src={profile?.aboutImage || profile?.profileImage}
                  alt="About Me"
                  className="relative w-full rounded-3xl shadow-2xl border-4 border-white dark:border-slate-800 z-10"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200/50 dark:border-slate-700/50 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-10">
                <Sparkles className="w-10 h-10 text-primary animate-bounce" />
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">About Me</h2>
              </div>
              <div className="prose prose-xl md:prose-2xl dark:prose-invert max-w-none mb-12">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-8 text-xl font-medium">{children}</p>,
                    strong: ({ children }) => <strong className="text-primary dark:text-primary font-black border-b-4 border-primary/20">{children}</strong>,
                    em: ({ children }) => <em className="text-purple-600 dark:text-purple-400 italic not-italic font-bold bg-purple-500/10 px-2 rounded-md">{children}</em>,
                    li: ({ children }) => <li className="text-slate-700 dark:text-slate-300 mb-4 text-xl font-medium list-none flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-3 shrink-0" />{children}</li>,
                    a: ({ children, href }) => <a href={href} className="text-primary hover:text-blue-700 underline decoration-4 underline-offset-8 transition-all font-black" target="_blank" rel="noopener noreferrer">{children}</a>
                  }}
                >
                  {profile?.bio || profile?.shortBio}
                </ReactMarkdown>
              </div>
              
              <div className="flex flex-wrap gap-4 mb-8">
                {socialLinks.map(({ icon: Icon, url, label }) => url && (
                  <motion.a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-xl text-slate-600 dark:text-slate-400 hover:text-primary transition-all"
                    aria-label={label}
                  >
                    <Icon size={24} />
                  </motion.a>
                ))}
              </div>

              {profile?.resumeUrl && (
                <Link
                  to={profile.resumeUrl}
                  target="_blank"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white font-bold rounded-xl shadow-lg"
                >
                  <Download size={20} /> Download Resume
                </Link>
              )}
            </div>
          </motion.div>
        </div>

          {/* Experience & Education Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-20">
            <section>
              <SectionHeader title="Experience" />
              <div className="mt-8 space-y-6">
                {loading ? (
                  [...Array(2)].map((_, i) => <SkeletonLoader key={i} />)
                ) : Array.isArray(experience) && experience.length > 0 ? (
                  experience.map((exp, index) => (
                    <TimelineItem
                      key={exp._id}
                      title={exp.position}
                      subtitle={exp.company}
                      duration={`${new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${exp.current ? 'Present' : new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                      description={exp.description}
                      type="experience"
                    />
                  ))
                ) : (
                  <p className="text-slate-500">No experience records found.</p>
                )}
              </div>
            </section>
            <section>
              <SectionHeader title="Education" />
              <div className="mt-8 space-y-6">
                {loading ? (
                  [...Array(2)].map((_, i) => <SkeletonLoader key={i} />)
                ) : Array.isArray(education) && education.length > 0 ? (
                  education.map((edu, index) => (
                    <TimelineItem
                      key={edu._id}
                      title={edu.degree}
                      subtitle={edu.institution}
                      duration={`${new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${edu.current ? 'Present' : new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                      description={edu.description}
                      type="education"
                    />
                  ))
                ) : (
                  <p className="text-slate-500">No education records found.</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Featured Projects</h2>
              <p className="text-slate-600 dark:text-slate-400">Some of my recent work that I'm proud of.</p>
            </div>
            <Link to="/projects" className="hidden md:flex items-center text-primary font-bold hover:underline group">
              View All <ArrowRight size={20} className="ml-2 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [...Array(3)].map((_, i) => <SkeletonLoader key={i} />)
            ) : Array.isArray(projects) && projects.length > 0 ? (
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

      {/* Services Section */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Services I Offer" subtitle="Professional solutions tailored to your needs." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {loading ? (
              [...Array(3)].map((_, i) => <SkeletonLoader key={i} />)
            ) : Array.isArray(services) && services.length > 0 ? (
              services.map((service, index) => (
                <ServiceCard key={service._id} service={service} index={index} />
              ))
            ) : (
              <p className="col-span-full text-center text-slate-500">No services available yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Tools & Technologies" subtitle="My technical expertise and toolset." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mt-12">
            {loading ? (
              [...Array(6)].map((_, i) => <SkeletonLoader key={i} type="bar" />)
            ) : Array.isArray(skills) && skills.length > 0 ? (
              skills.map((skill, index) => (
                <SkillBar key={skill._id} skill={skill} />
              ))
            ) : (
              <p className="col-span-full text-center text-slate-500">No skills added yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <SectionHeader title="Latest from the Blog" subtitle="Insights, tutorials, and thoughts on development." />
            <Link to="/blog" className="hidden md:flex items-center text-primary font-bold hover:underline group">
              View All <ArrowRight size={20} className="ml-2 group-hover:translate-x-2 transition-transform" />
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

      {/* Contact CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-600 to-purple-600" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Sparkles className="w-16 h-16 text-white mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Let's work together on your next project</h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            I'm currently available for freelance work and full-time opportunities.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-10 py-4 bg-white text-primary rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-2xl"
          >
            Get In Touch <Mail className="ml-2" size={24} />
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
