import { useState, useEffect } from 'react';
import { Github, Linkedin, Twitter, Instagram, Mail } from 'lucide-react';
import { getProfile } from '../services/api';

const Footer = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <footer className="relative mt-auto py-16 bg-amber-100 dark:bg-slate-900 border-t border-amber-200 dark:border-slate-700 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-black tracking-tighter mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">BSG Portfolio</h3>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-md">
              Crafting exceptional digital experiences through innovative code and modern design principles. Focused on building scalable, user-centric solutions.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-slate-900 dark:text-white">Quick Links</h4>
            <ul className="space-y-4">
              <li><a href="/" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors font-medium">Home</a></li>
              <li><a href="/projects" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors font-medium">Projects</a></li>
              <li><a href="/blog" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors font-medium">Blog</a></li>
              <li><a href="/contact" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors font-medium">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-slate-900 dark:text-white">Connect</h4>
            <div className="flex justify-center md:justify-start gap-4">
              {profile?.socialLinks?.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-primary hover:border-primary transition-all"
                  aria-label="GitHub"
                >
                  <Github size={20} />
                </a>
              )}
              {profile?.socialLinks?.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-primary hover:border-primary transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
              )}
              {profile?.socialLinks?.instagram && (
                <a
                  href={profile.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-primary hover:border-primary transition-all"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
              )}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-primary hover:border-primary transition-all"
                  aria-label="Email"
                >
                  <Mail size={20} />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-slate-500 dark:text-slate-500 font-medium">&copy; {new Date().getFullYear()} BSG Portfolio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
