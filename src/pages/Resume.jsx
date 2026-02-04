import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Printer, ExternalLink } from 'lucide-react';
import { getProfile } from '../services/api';
import Meta from '../components/Meta';

const Resume = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Use Google Docs Viewer for mobile devices as they don't support inline PDFs in iframes well
  const getPdfUrl = (url) => {
    if (!url) return '';
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
    }
    return `${url}#view=FitH`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getProfile();
        setProfile(res.data);
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
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Meta title="Resume" description={`Professional resume of ${profile?.name}`} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Actions - Hidden on Print */}
        <div className="flex flex-wrap justify-end gap-4 mb-8 print:hidden">
          <button
            id="print-button"
            name="print-button"
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            <Printer size={20} />
            Print
          </button>
          {profile?.resumeUrl && (
            <a
              href={profile.resumeUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30"
            >
              <Download size={20} />
              Download PDF
            </a>
          )}
        </div>

        {profile?.resumeUrl ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-2xl min-h-[500px] md:min-h-[800px]"
          >
            <iframe
              src={getPdfUrl(profile.resumeUrl)}
              className="w-full h-[500px] md:h-[800px] border-none"
              title="Resume PDF"
              loading="lazy"
            ></iframe>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 text-center border-t border-slate-100 dark:border-slate-800">
              <a 
                href={profile.resumeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary font-bold hover:underline inline-flex items-center gap-2"
              >
                <ExternalLink size={16} />
                Open in Full Screen
              </a>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400">No resume file uploaded yet.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Resume;
