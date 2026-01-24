import { Github, Linkedin, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#5D4037] border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">BSG Portfolio</h3>
            <p className="text-slate-200">
              Building modern web applications with a focus on performance and user experience.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-slate-200">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/projects" className="hover:text-white transition-colors">Projects</a></li>
              <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Connect</h4>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="text-slate-200 hover:text-white transition-colors">
                <Github size={24} />
              </a>
              <a href="#" className="text-slate-200 hover:text-white transition-colors">
                <Linkedin size={24} />
              </a>
              <a href="#" className="text-slate-200 hover:text-white transition-colors">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-slate-200 hover:text-white transition-colors">
                <Instagram size={24} />
              </a>
              <a href={`mailto:${profile.email}`} className="text-slate-200 hover:text-white transition-colors">
                <Mail size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-slate-300">
          <p>&copy; {new Date().getFullYear()} BSG Portfolio. All rights reserved. /Developed by <b>Bosona G.</b></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
