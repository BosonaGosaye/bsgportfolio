import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Github, ExternalLink, ArrowLeft, Calendar, Share2, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProjectBySlug } from '../services/api';
import Meta from '../components/Meta';
import SectionHeader from '../components/SectionHeader';

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const { data } = await getProjectBySlug(slug);
        setProject(data);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Project not found or an error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: project.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 w-1/3 mb-8 rounded" />
        <div className="aspect-video bg-slate-200 dark:bg-slate-800 rounded-2xl mb-12" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-6 bg-slate-200 dark:bg-slate-800 w-full rounded" />
            <div className="h-6 bg-slate-200 dark:bg-slate-800 w-full rounded" />
            <div className="h-6 bg-slate-200 dark:bg-slate-800 w-2/3 rounded" />
          </div>
          <div className="space-y-6">
            <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold text-red-500 mb-4">{error}</h2>
        <Link to="/projects" className="text-primary font-bold flex items-center hover:underline">
          <ArrowLeft size={20} className="mr-2" /> Back to Projects
        </Link>
      </div>
    );
  }

  const allImages = [project.coverImage, ...(project.gallery || [])];

  return (
    <>
      <Meta 
        title={project.title} 
        description={project.description} 
        image={project.coverImage}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Link to="/projects" className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-primary mb-8 font-medium transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Back to Projects
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter text-slate-900 dark:text-white leading-[1.05] drop-shadow-sm">
              {project.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-slate-700 dark:text-slate-300 font-bold text-lg">
              <span className="flex items-center"><Calendar size={22} className="mr-3 text-primary" /> {new Date(project.createdAt).toLocaleDateString()}</span>
              <span className="px-6 py-2 bg-primary/10 text-primary text-base font-black rounded-full tracking-widest uppercase border-2 border-primary/20">{project.category}</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleShare}
              className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              title="Share Project"
            >
              <Share2 size={24} />
            </button>
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <Github size={24} />
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center">
                Live Demo <ExternalLink size={20} className="ml-2" />
              </a>
            )}
          </div>
        </div>

        {/* Gallery Section */}
        <section className="mb-16">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-xl mb-4">
            <img 
              src={allImages[activeImage]} 
              alt={`${project.title} screenshot ${activeImage + 1}`}
              className="w-full h-full object-contain"
            />
            {allImages.length > 1 && (
              <>
                <button 
                  onClick={() => setActiveImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={() => setActiveImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {allImages.map((img, index) => (
              <button 
                key={index}
                onClick={() => setActiveImage(index)}
                className={`flex-shrink-0 w-32 aspect-video rounded-lg overflow-hidden border-2 transition-all bg-slate-100 dark:bg-slate-800 ${activeImage === index ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <section className="mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-10 tracking-tighter text-slate-900 dark:text-white bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Project Overview
              </h2>
              <div className="prose prose-xl dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-8 leading-relaxed text-xl">{children}</p>,
                    strong: ({ children }) => <strong className="text-primary dark:text-primary font-black border-b-4 border-primary/20">{children}</strong>,
                    em: ({ children }) => <em className="text-purple-600 dark:text-purple-400 font-bold bg-purple-500/10 px-2 rounded-md italic not-italic">{children}</em>,
                    li: ({ children }) => <li className="mb-4 text-xl list-none flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-3 shrink-0" />{children}</li>,
                    h3: ({ children }) => <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-6 mt-12 tracking-tight">{children}</h3>
                  }}
                >
                  {project.longDescription || project.description}
                </ReactMarkdown>
              </div>
            </section>

            {(project.challenges || project.solutions) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {project.challenges && (
                  <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-2xl border border-red-100 dark:border-red-900/20">
                    <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">Challenges</h3>
                    <p className="text-slate-700 dark:text-slate-300">{project.challenges}</p>
                  </div>
                )}
                {project.solutions && (
                  <div className="bg-green-50 dark:bg-green-900/10 p-8 rounded-2xl border border-green-100 dark:border-green-900/20">
                    <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4">Solutions</h3>
                    <p className="text-slate-700 dark:text-slate-300">{project.solutions}</p>
                  </div>
                )}
              </div>
            )}

            {project.videoUrl && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Demo Video</h2>
                <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
                  <iframe 
                    src={project.videoUrl} 
                    className="w-full h-full"
                    allowFullScreen
                    title="Project Demo"
                  />
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-12">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold mb-6">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span key={tech} className="px-4 py-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-primary p-8 rounded-2xl text-white">
              <h3 className="text-xl font-bold mb-4">Interested in this project?</h3>
              <p className="mb-8 text-blue-100">Let's discuss how I can help you build something similar or even better!</p>
              <Link to="/contact" className="block w-full py-3 bg-white text-primary text-center rounded-xl font-bold hover:bg-blue-50 transition-colors">
                Start a Conversation
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default ProjectDetail;
