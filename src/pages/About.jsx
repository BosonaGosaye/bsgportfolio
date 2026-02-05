import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Instagram, Mail, Download, Sparkles } from 'lucide-react';
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
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 animate-gradient-shift pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          {/* Profile Overview - Hero Section */}
          <section className="mb-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Profile Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="relative group"
              >
                <div className="relative w-full max-w-md mx-auto">
                  {/* Animated Glow Ring */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse" />

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="relative"
                  >
                    <img
                      src={profile?.aboutImage || profile?.profileImage}
                      alt={profile?.name}
                      loading="eager"
                      decoding="async"
                      className="relative w-full rounded-3xl shadow-2xl border-4 border-white dark:border-slate-800 z-10 aspect-[4/5] object-cover"
                    />
                    {/* Decorative Corner Elements */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-primary to-purple-500 rounded-2xl opacity-20 blur-xl group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl opacity-20 blur-xl group-hover:scale-110 transition-transform duration-500" />
                  </motion.div>
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

                  {/* Social Links */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    {socialLinks.map(({ icon: Icon, url, label }) => url && (
                      <motion.a
                        key={label}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-xl text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-300 shadow-md hover:shadow-lg"
                        aria-label={label}
                      >
                        <Icon size={24} />
                      </motion.a>
                    ))}
                    {profile?.email && (
                      <motion.a
                        href={`mailto:${profile.email}`}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-xl text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-300 shadow-md hover:shadow-lg"
                        aria-label="Email"
                      >
                        <Mail size={24} />
                      </motion.a>
                    )}
                  </div>

                  {/* Download Resume Button */}
                  {profile?.resumeUrl && (
                    <Link
                      to="/resume"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Download size={20} />
                      View Resume
                    </Link>
                  )}
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

          {/* Skills & Tools */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-32"
          >
            <SectionHeader
              title="Skills & Tools"
              subtitle="My technical expertise across different domains."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {Object.entries(skillsByCategory).map(([category, categorySkills], index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 overflow-hidden group"
                >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    <h3 className="text-2xl md:text-3xl font-black mb-8 tracking-tighter bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent uppercase">
                      {category}
                    </h3>
                    <div className="space-y-4">
                      {categorySkills.map((skill) => (
                        <SkillBar key={skill._id} skill={skill} />
                      ))}
                    </div>
                  </div>

                  {/* Decorative Element */}
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
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
