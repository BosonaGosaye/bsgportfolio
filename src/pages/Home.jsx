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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const homeData = await getHomeData();
        const { profile, education, experience, projects, skills, blogs, services } = homeData.data || homeData;

        setProfile(profile);
        setEducation(education || []);
        setExperience(experience || []);
        setProjects(projects || []);
        setSkills(skills || []);
        setBlogs(blogs || []);
        setServices(services || []);
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

      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center pt-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-5 py-2 bg-primary/10 border border-primary/20 backdrop-blur-md rounded-full mb-8"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Welcome to my portfolio</span>
              </motion.div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-[1.1] tracking-tight text-slate-900 dark:text-white">
                Hi, I'm{" "}
                <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {profile?.name || '...'}
                </span>
              </h1>

              <h2 className="text-2xl md:text-4xl font-bold text-slate-700 dark:text-slate-300 mb-10 min-h-[3rem]">
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

              <div className="flex flex-wrap gap-5 mb-10">
                {socialLinks.map(({ icon: Icon, url, label }) => url && (
                  <motion.a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl text-slate-600 dark:text-slate-400 hover:text-primary hover:shadow-lg hover:shadow-primary/10 border border-slate-200/50 dark:border-slate-700/50 transition-all"
                    aria-label={label}
                  >
                    <Icon size={22} />
                  </motion.a>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-5">
                <MagneticButton strength={0.2}>
                  <Link
                    to="/contact"
                    className="group px-10 py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
                  >
                    <span className="relative z-10">Get in touch</span>
                    <Mail className="ml-2 group-hover:translate-x-1 transition-transform relative z-10" size={20} />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </MagneticButton>
                {profile?.resumeUrl && (
                  <MagneticButton strength={0.2}>
                    <Link
                      to="/resume"
                      className="group px-10 py-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl font-bold flex items-center justify-center hover:border-primary hover:bg-primary/5 hover:scale-[1.02] transition-all duration-300 shadow-sm"
                    >
                      View Resume <Download className="ml-2 group-hover:translate-y-0.5 transition-transform" size={20} />
                    </Link>
                  </MagneticButton>
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
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover rounded-full border-4 border-white dark:border-slate-800 shadow-2xl relative z-10"
                  />
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
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
                className="glass-card p-10 text-center group hover:scale-[1.05] transition-all duration-500"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-4 tracking-tight uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative w-full max-w-lg mx-auto">
                <div className="absolute -inset-6 bg-gradient-to-r from-primary to-purple-500 rounded-[3rem] blur-3xl opacity-20" />
                <img
                  src={profile?.aboutImage || profile?.profileImage}
                  alt="About Me"
                  loading="lazy"
                  decoding="async"
                  className="relative w-full rounded-[2.5rem] shadow-2xl border-2 border-white/20 z-10 aspect-[4/5] object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-12 md:p-16 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <Sparkles className="w-10 h-10 text-primary" />
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-gradient">About Me</h2>
                </div>
                <div className="prose prose-xl dark:prose-invert max-w-none mb-12">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-8 text-xl font-medium">{children}</p>,
                      strong: ({ children }) => <strong className="text-primary font-black">{children}</strong>,
                      li: ({ children }) => <li className="text-slate-700 dark:text-slate-300 mb-4 text-xl font-medium flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-3 shrink-0" />{children}</li>,
                    }}
                  >
                    {profile?.bio || profile?.shortBio}
                  </ReactMarkdown>
                </div>

                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-primary font-bold text-lg group hover:gap-4 transition-all"
                >
                  Learn more about me <ArrowRight size={20} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience & Education Grid */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-12">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <Briefcase className="text-primary" size={24} />
                </div>
                <h2 className="text-3xl font-black tracking-tight dark:text-white">Experience</h2>
              </div>
              <div className="space-y-6">
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
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-12">
                <div className="p-3 bg-blue-500/10 rounded-2xl">
                  <Users className="text-blue-500" size={24} />
                </div>
                <h2 className="text-3xl font-black tracking-tight dark:text-white">Education</h2>
              </div>
              <div className="space-y-6">
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
            </motion.section>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-gradient mb-4">Featured Projects</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 font-medium max-w-2xl">A curated selection of my most recent and innovative digital solutions.</p>
            </div>
            <Link
              to="/projects"
              className="px-8 py-3 glass-card rounded-2xl font-bold flex items-center gap-2 hover:text-primary transition-all group"
            >
              Explore All <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [...Array(3)].map((_, i) => <SkeletonLoader key={i} />)
            ) : Array.isArray(projects) && projects.length > 0 ? (
              projects.slice(0, 3).map((project, index) => (
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
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Expertise" subtitle="Delivering high-quality digital experiences tailored to your business goals." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
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

      {/* Contact CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 md:p-20 text-center relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative z-10">
              <Sparkles className="w-16 h-16 text-primary mx-auto mb-8 animate-pulse" />
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter">
                Let's build something <span className="text-gradient">extraordinary</span> together
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto font-medium">
                I'm currently available for freelance work and full-time opportunities. Let's transform your vision into reality.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center px-12 py-5 bg-primary text-white rounded-2xl font-black text-xl hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.05] transition-all relative overflow-hidden"
              >
                <span className="relative z-10">Start a conversation</span>
                <Mail className="ml-3 relative z-10" size={24} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
