import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Instagram, Mail } from 'lucide-react';
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

  return (
    <>
      <Meta
        title="About Me"
        description={profile?.bio?.substring(0, 160)}
        image={profile?.profileImage}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Profile Overview */}
        <section className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={profile?.profileImage}
                alt={profile?.name}
                className="w-full max-w-md mx-auto rounded-2xl shadow-2xl border-4 border-white dark:border-slate-800"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl font-bold mb-6">About Me</h1>
              <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
                <ReactMarkdown>{profile?.bio}</ReactMarkdown>
              </div>
              <div className="mt-8 flex space-x-6">
                {profile?.socialLinks?.github && (
                  <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                    <Github size={28} />
                  </a>
                )}
                {profile?.socialLinks?.linkedin && (
                  <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                    <Linkedin size={28} />
                  </a>
                )}
                {profile?.socialLinks?.twitter && (
                  <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                    <Twitter size={28} />
                  </a>
                )}
                {profile?.socialLinks?.instagram && (
                  <a href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                    <Instagram size={28} />
                  </a>
                )}
                {profile?.email && (
                  <a href={`mailto:${profile.email}`} className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                    <Mail size={28} />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Experience Section */}
          <section>
            <SectionHeader title="Experience" />
            <div className="mt-8">
              {experience.length > 0 ? (
                experience.map((exp) => (
                  <TimelineItem
                    key={exp._id}
                    title={exp.position}
                    subtitle={exp.company}
                    duration={`${new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${exp.current ? 'Present' : new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                    description={exp.description}
                  />
                ))
              ) : (
                <p className="text-slate-500">No experience records found.</p>
              )}
            </div>
          </section>

          {/* Education Section */}
          <section>
            <SectionHeader title="Education" />
            <div className="mt-8">
              {education.length > 0 ? (
                education.map((edu) => (
                  <TimelineItem
                    key={edu._id}
                    title={edu.degree}
                    subtitle={edu.institution}
                    duration={`${new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${edu.current ? 'Present' : new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                    description={edu.description}
                  />
                ))
              ) : (
                <p className="text-slate-500">No education records found.</p>
              )}
            </div>
          </section>
        </div>

        {/* Skills & Tools */}
        <section className="mt-24">
          <SectionHeader title="Skills & Tools" subtitle="My technical expertise across different domains." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-12">
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-slate-50 dark:bg-slate-800/30 p-8 rounded-2xl"
              >
                <h3 className="text-xl font-bold mb-6 text-primary">{category}</h3>
                <div className="space-y-4">
                  {categorySkills.map((skill) => (
                    <SkillBar key={skill._id} skill={skill} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="mt-24">
          <SectionHeader title="Certifications" subtitle="Professional certifications and achievements." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {certifications.length > 0 ? (
              certifications.map((cert) => (
                <CertificationCard key={cert._id} cert={cert} />
              ))
            ) : (
              <p className="col-span-full text-center text-slate-500 py-12">No certifications added yet.</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
