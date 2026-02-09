import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Instagram, Mail, Download, Sparkles, TrendingUp, Users, Code } from 'lucide-react';

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
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          {/* Profile Overview - Hero Section */}
          <section ref={heroRef} className="mb-40">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              {/* Profile Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="relative w-full max-w-lg mx-auto">
                  <div className="absolute -inset-10 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-full blur-[100px] opacity-20 animate-pulse" />

                  <motion.div
                    style={{ y: imgY, rotate: imgRotate }}
                    className="relative z-10"
                  >
                    <img
                      src={profile?.aboutImage || profile?.profileImage}
                      alt={profile?.name}
                      loading="eager"
                      className="w-full rounded-[3rem] shadow-2xl border-4 border-white/20 aspect-[4/5] object-cover"
                    />

                    {/* Experience Badge */}
                    <div className="absolute -bottom-8 -right-8 glass-card p-6 rounded-2xl shadow-2xl animate-bounce-slow">
                      <p className="text-4xl font-black text-primary">1+</p>
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-tight">Years Of<br />Experience</p>
                    </div>
                  </motion.div>

                  {/* Decorative Dots Grid */}
                  <div className="absolute top-1/2 -left-12 w-32 h-32 bg-dot-grid opacity-20 -z-10" />
                </div>
              </motion.div>


              {/* Bio Content */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                {/* Glassmorphism Container */}
                <div className="relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center gap-3 mb-10">
                    <Sparkles className="w-10 h-10 text-primary animate-bounce" />
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      About Me
                    </h1>
                  </div>

                  <div className="prose prose-xl md:prose-2xl dark:prose-invert max-w-none mb-12 text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-8 leading-relaxed text-xl">{children}</p>,
                        strong: ({ children }) => <strong className="text-primary dark:text-primary font-black border-b-4 border-primary/20">{children}</strong>,
                        em: ({ children }) => <em className="text-purple-600 dark:text-purple-400 italic not-italic font-bold bg-purple-500/10 px-2 rounded-md">{children}</em>,
                        li: ({ children }) => <li className="mb-4 text-xl list-none flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-3 shrink-0" />{children}</li>,
                        a: ({ children, href }) => <a href={href} className="text-primary hover:text-blue-700 underline decoration-4 underline-offset-8 transition-all font-black" target="_blank" rel="noopener noreferrer">{children}</a>
                      }}
                    >
                      {profile?.bio}
                    </ReactMarkdown>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-10">
                    {socialLinks.map(({ icon: Icon, url, label }, index) => url && (
                      <motion.a
                        key={label}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + (index * 0.1) }}
                        whileHover={{ scale: 1.1, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl text-slate-600 dark:text-slate-400 hover:text-primary hover:shadow-xl hover:shadow-primary/10 border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300"
                        aria-label={label}
                      >
                        <Icon size={22} />
                      </motion.a>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-5">
                    {profile?.resumeUrl && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        <Link
                          to="/resume"
                          className="group px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
                        >
                          <span className="relative z-10">View my Resume</span>
                          <Download className="ml-2 group-hover:translate-y-0.5 transition-transform relative z-10" size={20} />
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </motion.div>
                    )}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                    >
                      <Link
                        to="/contact"
                        className="group px-8 py-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl font-bold flex items-center justify-center hover:border-primary hover:bg-primary/5 hover:scale-[1.02] transition-all duration-300 shadow-sm"
                      >
                        Initiate Collaboration
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

            </div>
          </section>

          {/* Experience & Education Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
            {/* Experience Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SectionHeader title="Experience" />
              <div className="mt-8 space-y-6">
                {experience.length > 0 ? (
                  experience.map((exp, index) => (
                    <motion.div
                      key={exp._id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
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

            {/* Education Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <SectionHeader title="Education" />
              <div className="mt-8 space-y-6">
                {education.length > 0 ? (
                  education.map((edu, index) => (
                    <motion.div
                      key={edu._id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
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

          {/* Philosophies of Engineering */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-32"
          >
            <SectionHeader
              title="Engineering Philosophies"
              subtitle="Core principles that drive my development process."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {[
                { title: 'Scalability First', desc: 'Designing systems that grow seamlessly with user demands and data volume.', icon: TrendingUp },
                { title: 'SOLID Principles', desc: 'Executing clean, maintainable, and decoupled code for long-term project health.', icon: Code },
                { title: 'User-Centric Design', desc: 'Bridging the gap between complex backend logic and intuitive frontend experiences.', icon: Users },
                { title: 'Continuous Evolution', desc: 'Perpetual learning and integration of state-of-the-art technologies and patterns.', icon: Sparkles }
              ].map((phi, idx) => (
                <motion.div
                  key={phi.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card p-8 group hover:scale-[1.02] transition-all"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <phi.icon className="text-primary w-6 h-6" />
                  </div>
                  <h3 className="font-black text-xl mb-3 dark:text-white">{phi.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{phi.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Skills & Tools */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-32"
          >
            <SectionHeader
              title="Technical Arsenal"
              subtitle="My technical expertise across the engineering spectrum."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {Object.entries(skillsByCategory).map(([category, categorySkills], index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="relative group h-full"
                >
                  <div className="glass-card p-10 h-full relative overflow-hidden flex flex-col">
                    {/* Glowing background hint */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

                    <div className="relative z-10 mb-8 flex items-center justify-between">
                      <h3 className="text-2xl font-black tracking-tight text-gradient uppercase">
                        {category}
                      </h3>
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Code className="text-primary w-5 h-5" />
                      </div>
                    </div>

                    <div className="space-y-6 flex-grow">
                      {categorySkills.map((skill) => (
                        <SkillBar key={skill._id} skill={skill} />
                      ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                      <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 dark:text-slate-500">Mastery Level Established</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>


          {/* Certifications - Featured Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block"
              >
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Certifications & Achievements
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  Professional certifications and credentials
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certifications.length > 0 ? (
                certifications.map((cert, index) => (
                  <motion.div
                    key={cert._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <CertificationCard cert={cert} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <div className="inline-block p-8 bg-slate-100 dark:bg-slate-800/50 rounded-2xl">
                    <p className="text-slate-500 dark:text-slate-400 text-lg">
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
