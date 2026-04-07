import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Instagram, Mail, Download, Sparkles, TrendingUp, Users, Code, Briefcase, Award } from 'lucide-react';

import ReactMarkdown from 'react-markdown';
import { getProfile, getEducation, getExperience, getSkills, getCertifications } from '../services/api';
import TimelineItem from '../components/TimelineItem';
import SectionHeader from '../components/SectionHeader';
import CertificationCard from '../components/CertificationCard';
import SkillBar from '../components/SkillBar';
import Meta from '../components/Meta';
import SkeletonLoader from '../components/SkeletonLoader';

const About = () => {
  const [profile, setProfile] = useState(null);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"]
  });

  const imgY = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const imgRotate = useTransform(scrollYProgress, [0, 1], [-2, 2]);

  useEffect(() => {

    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, eduRes, expRes, skillsRes, certRes] = await Promise.all([
          getProfile(),
          getEducation(),
          getExperience(),
          getSkills(),
          getCertifications()
        ]);

        setProfile(profileRes.data);
        setEducation(eduRes.data);
        setExperience(expRes.data);
        setSkills(skillsRes.data);
        setCertifications(certRes.data);
      } catch (err) {
        console.error('Error fetching about data:', err);
        setError('Failed to load information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="h-96 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-1/2" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-full" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-full" />
          </div>
          <div className="space-y-6">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-1/2" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-full" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

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

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  // Social links configuration
  const socialLinks = [
    { icon: Github, url: profile?.socialLinks?.github, label: 'GitHub' },
    { icon: Linkedin, url: profile?.socialLinks?.linkedin, label: 'LinkedIn' },
    { icon: Twitter, url: profile?.socialLinks?.twitter, label: 'Twitter' },
    { icon: Instagram, url: profile?.socialLinks?.instagram, label: 'Instagram' },
  ];

  return (
    <>


      <Meta
        title="About Me"
        description={profile?.bio?.substring(0, 160)}
        image={profile?.profileImage}
      />

      <div className="relative overflow-hidden">
        {/* Enhanced animated background blobs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-primary/10 via-purple-500/10 to-transparent rounded-full blur-[150px] animate-blob" />
        <div className="absolute bottom-1/4 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-purple-500/10 via-pink-500/10 to-transparent rounded-full blur-[150px] animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-[120px] animate-blob animation-delay-4000" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          {/* Enhanced Profile Overview - Hero Section */}
          <section ref={heroRef} className="mb-48">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              {/* Enhanced Profile Image with 3D effects */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: -50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, type: 'spring' }}
                className="relative order-2 lg:order-1"
              >
                <div className="relative w-full max-w-lg mx-auto group perspective-1000">
                  {/* Multiple animated gradient layers with 3D rotation */}
                  <motion.div 
                    className="absolute -inset-14 bg-gradient-to-r from-primary/40 to-purple-500/40 rounded-full blur-[120px]"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.div 
                    className="absolute -inset-12 bg-gradient-to-l from-pink-500/30 to-blue-500/30 rounded-full blur-[100px]"
                    animate={{ 
                      scale: [1.2, 1, 1.2],
                      rotate: [360, 180, 0]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                  />

                  <motion.div
                    style={{ y: imgY, rotate: imgRotate }}
                    className="relative z-10 preserve-3d"
                    whileHover={{ scale: 1.05, rotateY: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <img
                      src={profile?.aboutImage || profile?.profileImage}
                      alt={profile?.name}
                      loading="eager"
                      className="w-full rounded-[4rem] shadow-2xl border-8 border-white/30 dark:border-slate-800/30 aspect-[4/5] object-cover backdrop-blur-sm"
                    />

                    {/* Enhanced Experience Badge with animation */}
                    <motion.div 
                      className="absolute -bottom-10 -right-10 glass-card p-8 rounded-3xl shadow-2xl border-4 border-white/50 dark:border-slate-700/50"
                      animate={{ 
                        y: [0, -15, 0],
                        rotate: [0, 5, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <p className="text-5xl font-black bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">1+</p>
                      <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-tight">Years Of<br />Experience</p>
                    </motion.div>
                  </motion.div>

                  {/* Enhanced Decorative Dots Grid */}
                  <motion.div 
                    className="absolute top-1/2 -left-16 w-40 h-40 opacity-30"
                    style={{
                      backgroundImage: 'radial-gradient(circle, currentColor 2px, transparent 2px)',
                      backgroundSize: '20px 20px'
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                  />
                  
                  {/* Floating emoji decorations */}
                  <motion.div
                    className="absolute -top-8 -right-8 text-6xl"
                    animate={{ 
                      y: [0, -20, 0],
                      rotate: [0, 15, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    💡
                  </motion.div>
                  <motion.div
                    className="absolute -bottom-8 -left-8 text-6xl"
                    animate={{ 
                      y: [0, 20, 0],
                      rotate: [0, -15, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  >
                    🎯
                  </motion.div>
                </div>
              </motion.div>


              {/* Enhanced Bio Content */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
                className="relative order-1 lg:order-2"
              >
                {/* Enhanced Glassmorphism Container */}
                <div className="relative bg-gradient-to-br from-white/70 via-white/60 to-white/50 dark:from-slate-800/70 dark:via-slate-800/60 dark:to-slate-800/50 backdrop-blur-2xl rounded-[3rem] p-6 md:p-10 shadow-2xl border-2 border-white/50 dark:border-slate-700/50 overflow-hidden group">
                  {/* Animated gradient overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                  />
                  
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-12 h-12 text-primary" />
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl lg:text-5xl font-black tracking-tighter bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      About Me
                    </h1>
                  </div>

                  <div className="prose prose-xl md:prose-2xl dark:prose-invert max-w-none mb-10 text-slate-700 dark:text-slate-300 leading-relaxed font-medium relative z-10">
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

                  <div className="flex flex-wrap gap-5 mb-12 relative z-10">
                    {socialLinks.map(({ icon: Icon, url, label }, index) => url && (
                      <motion.a
                        key={label}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + (index * 0.1) }}
                        whileHover={{ scale: 1.15, y: -6, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="relative p-5 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-2xl text-slate-600 dark:text-slate-400 hover:text-white hover:shadow-2xl border-2 border-slate-200/50 dark:border-slate-700/50 hover:border-primary/50 transition-all duration-300 group/social overflow-hidden"
                        aria-label={label}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600 opacity-0 group-hover/social:opacity-100 transition-opacity duration-300" />
                        <Icon size={24} className="relative z-10" />
                      </motion.a>
                    ))}
                  </div>

                  {/* Enhanced CTA Buttons */}
                  <div className="flex flex-wrap gap-6 relative z-10">
                    {profile?.resumeUrl && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          to="/resume"
                          className="group px-10 py-5 bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-white rounded-2xl font-black text-lg flex items-center justify-center hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 relative overflow-hidden"
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-primary"
                            initial={{ x: '100%' }}
                            whileHover={{ x: 0 }}
                            transition={{ duration: 0.3 }}
                          />
                          <span className="relative z-10">View my Resume</span>
                          <Download className="ml-3 group-hover:translate-y-1 group-hover:animate-bounce transition-all relative z-10" size={22} />
                        </Link>
                      </motion.div>
                    )}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/contact"
                        className="group px-10 py-5 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-black text-lg flex items-center justify-center hover:border-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-600/10 transition-all duration-300 shadow-lg"
                      >
                        Initiate Collaboration
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

            </div>
          </section>

          {/* Enhanced Experience & Education Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-40">
            {/* Experience Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
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
              <div className="mt-10 space-y-8">
                {experience.length > 0 ? (
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
                  <p className="text-slate-500 text-center py-10">No experience records found.</p>
                )}
              </div>
            </motion.section>

            {/* Education Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
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
              <div className="mt-10 space-y-8">
                {education.length > 0 ? (
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
                  <p className="text-slate-500 text-center py-10">No education records found.</p>
                )}
              </div>
            </motion.section>
          </div>

          {/* Enhanced Philosophies of Engineering */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-40"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <motion.div 
                className="inline-flex items-center gap-3 px-5 py-2 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-full mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                <span className="text-sm font-black uppercase tracking-wider text-primary">Philosophy</span>
              </motion.div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6">
                <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Engineering Philosophies
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
                Core principles that drive my development process.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
              {[
                { title: 'Scalability First', desc: 'Designing systems that grow seamlessly with user demands and data volume.', icon: TrendingUp, color: 'from-blue-500 to-cyan-500' },
                { title: 'SOLID Principles', desc: 'Executing clean, maintainable, and decoupled code for long-term project health.', icon: Code, color: 'from-purple-500 to-pink-500' },
                { title: 'User-Centric Design', desc: 'Bridging the gap between complex backend logic and intuitive frontend experiences.', icon: Users, color: 'from-green-500 to-emerald-500' },
                { title: 'Continuous Evolution', desc: 'Perpetual learning and integration of state-of-the-art technologies and patterns.', icon: Sparkles, color: 'from-orange-500 to-red-500' }
              ].map((phi, idx) => (
                <motion.div
                  key={phi.title}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15, type: 'spring' }}
                  whileHover={{ y: -15, scale: 1.05 }}
                  className="relative glass-card p-10 group overflow-hidden"
                >
                  {/* Animated gradient background */}
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-br ${phi.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />
                  
                  <motion.div 
                    className={`w-16 h-16 bg-gradient-to-br ${phi.color} rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:shadow-2xl`}
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                  >
                    <phi.icon className="text-white w-8 h-8" />
                  </motion.div>
                  <h3 className="font-black text-2xl mb-4 dark:text-white">{phi.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{phi.desc}</p>
                  
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Enhanced Skills & Tools */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-40"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <motion.div 
                className="inline-flex items-center gap-3 px-5 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <Code className="w-5 h-5 text-blue-600 animate-pulse" />
                <span className="text-sm font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Skills</span>
              </motion.div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6">
                <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                  Technical Arsenal
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
                My technical expertise across the engineering spectrum.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-16">
              {Object.entries(skillsByCategory).map(([category, categorySkills], index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, type: 'spring' }}
                  whileHover={{ y: -12, scale: 1.03 }}
                  className="relative group h-full"
                >
                  <div className="glass-card p-12 h-full relative overflow-hidden flex flex-col">
                    {/* Animated glowing background */}
                    <motion.div 
                      className="absolute -top-10 -right-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360]
                      }}
                      transition={{ duration: 10, repeat: Infinity }}
                    />

                    <div className="relative z-10 mb-10 flex items-center justify-between">
                      <h3 className="text-3xl font-black tracking-tight text-gradient uppercase">
                        {category}
                      </h3>
                      <motion.div 
                        className="w-14 h-14 bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-2xl flex items-center justify-center"
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Code className="text-primary w-7 h-7" />
                      </motion.div>
                    </div>

                    <div className="space-y-8 flex-grow">
                      {categorySkills.map((skill) => (
                        <SkillBar key={skill._id} skill={skill} />
                      ))}
                    </div>

                    <div className="mt-10 pt-8 border-t-2 border-slate-200/50 dark:border-slate-700/50">
                      <p className="text-xs uppercase tracking-[0.2em] font-black text-slate-400 dark:text-slate-500">Mastery Level Established</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>


          {/* Enhanced Certifications - Featured Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <motion.div 
                className="inline-flex items-center gap-3 px-5 py-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full mb-6"
                whileHover={{ scale: 1.05, rotate: 2 }}
              >
                <Award className="w-5 h-5 text-yellow-600 animate-pulse" />
                <span className="text-sm font-black uppercase tracking-wider bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">Achievements</span>
              </motion.div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6">
                <span className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                  Certifications & Achievements
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
                Professional certifications and credentials
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {certifications.length > 0 ? (
                certifications.map((cert, index) => (
                  <motion.div
                    key={cert._id}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15, type: 'spring' }}
                  >
                    <CertificationCard cert={cert} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <div className="inline-block p-12 bg-slate-100 dark:bg-slate-800/50 rounded-3xl">
                    <Award size={64} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 dark:text-slate-400 text-xl font-medium">
                      No certifications added yet.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.section>
        </div>
      </div>
    </>
  );
};

export default About;
