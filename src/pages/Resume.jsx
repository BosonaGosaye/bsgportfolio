import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Printer, Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react';
import { getProfile, getExperience, getEducation, getSkills } from '../services/api';
import Meta from '../components/Meta';

const Resume = () => {
  const [profile, setProfile] = useState(null);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, expRes, eduRes, skillsRes] = await Promise.all([
          getProfile(),
          getExperience(),
          getEducation(),
          getSkills()
        ]);
        setProfile(profileRes.data);
        setExperience(expRes.data);
        setEducation(eduRes.data);
        setSkills(skillsRes.data);
      } catch (err) {
        console.error('Error fetching resume data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Meta title="Resume" description={`Professional resume of ${profile?.name}`} />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Actions - Hidden on Print */}
        <div className="flex justify-end gap-4 mb-8 print:hidden">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            <Printer size={20} />
            Print
          </button>
          {profile?.resumeUrl && (
            <a 
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30"
            >
              <Download size={20} />
              Download PDF
            </a>
          )}
        </div>

        {/* Resume Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 shadow-2xl dark:shadow-none border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden print:shadow-none print:border-none print:m-0"
        >
          {/* Header */}
          <header className="bg-slate-900 text-white p-10 md:p-16 print:bg-white print:text-slate-900 print:p-0 print:border-b-2 print:border-slate-200 print:pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-2">{profile?.name}</h1>
                <p className="text-xl md:text-2xl text-primary font-bold">{profile?.title}</p>
              </div>
              <div className="space-y-3 text-slate-300 print:text-slate-600">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-primary" />
                  <span>{profile?.email}</span>
                </div>
                {profile?.socialLinks?.linkedin && (
                  <div className="flex items-center gap-3">
                    <Globe size={18} className="text-primary" />
                    <span>linkedin.com/in/{profile.socialLinks.linkedin.split('/').pop()}</span>
                  </div>
                )}
                {profile?.socialLinks?.github && (
                  <div className="flex items-center gap-3">
                    <ExternalLink size={18} className="text-primary" />
                    <span>github.com/{profile.socialLinks.github.split('/').pop()}</span>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="p-10 md:p-16 space-y-16 print:p-8 print:space-y-12">
            {/* Summary */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900 dark:text-white print:text-slate-900">
                <span className="w-8 h-1 bg-primary rounded-full"></span>
                Professional Summary
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed print:text-slate-700">
                {profile?.bio}
              </p>
            </section>

            {/* Experience */}
            <section>
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-900 dark:text-white print:text-slate-900">
                <span className="w-8 h-1 bg-primary rounded-full"></span>
                Work Experience
              </h2>
              <div className="space-y-12">
                {experience.map((exp) => (
                  <div key={exp._id} className="relative pl-8 border-l-2 border-slate-100 dark:border-slate-800 print:border-slate-200">
                    <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-1"></div>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white print:text-slate-900">{exp.position}</h3>
                        <p className="text-primary font-bold">{exp.company}</p>
                      </div>
                      <div className="text-slate-500 font-medium mt-1 md:mt-0 print:text-slate-600">
                        {new Date(exp.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} - 
                        {exp.current ? ' Present' : ` ${new Date(exp.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`}
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed print:text-slate-700 whitespace-pre-line">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 print:gap-12">
              {/* Education */}
              <section>
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-900 dark:text-white print:text-slate-900">
                  <span className="w-8 h-1 bg-primary rounded-full"></span>
                  Education
                </h2>
                <div className="space-y-8">
                  {education.map((edu) => (
                    <div key={edu._id}>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white print:text-slate-900">{edu.degree}</h3>
                      <p className="text-primary font-bold">{edu.institution}</p>
                      <p className="text-sm text-slate-500 font-medium mt-1 print:text-slate-600">
                        {new Date(edu.startDate).getFullYear()} - {edu.current ? 'Present' : new Date(edu.endDate).getFullYear()}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Skills */}
              <section>
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-900 dark:text-white print:text-slate-900">
                  <span className="w-8 h-1 bg-primary rounded-full"></span>
                  Key Skills
                </h2>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill) => (
                    <span 
                      key={skill._id}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold print:bg-white print:border print:border-slate-200 print:text-slate-800"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Resume;
