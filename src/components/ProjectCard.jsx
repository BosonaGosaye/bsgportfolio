import { ExternalLink, Github, ArrowRight, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import ProjectModal from './ProjectModal';

const ProjectCard = ({ project, viewMode = 'grid' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [shinePosition, setShinePosition] = useState({ x: 50, y: 50 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current || viewMode === 'list') return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
    setShinePosition({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  if (viewMode === 'list') {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          whileHover={{ x: 4, transition: { duration: 0.3 } }}
          className="glass-card rounded-2xl overflow-hidden group relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

          <div className="flex flex-col md:flex-row relative z-10">
            <div className="relative overflow-hidden md:w-80 aspect-video md:aspect-auto cursor-pointer bg-slate-100 dark:bg-slate-800" onClick={() => setIsModalOpen(true)}>
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                <div className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-slate-900 hover:bg-primary hover:text-white transition-all hover:scale-110 shadow-lg">
                  <Eye size={20} />
                </div>
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-slate-900 hover:bg-primary hover:text-white transition-all hover:scale-110 shadow-lg"
                  >
                    <Github size={20} />
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-slate-900 hover:bg-primary hover:text-white transition-all hover:scale-110 shadow-lg"
                  >
                    <ExternalLink size={20} />
                  </a>
                )}
              </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <Link to={`/projects/${project.slug}`}>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
              </Link>
              <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack.slice(0, 5).map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-600"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <Link
                to={`/projects/${project.slug}`}
                className="inline-flex items-center text-primary font-bold hover:gap-3 gap-2 transition-all group/link mt-auto"
              >
                View Details <ArrowRight size={18} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
        <ProjectModal project={project} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  // Grid view with 3D tilt effect
  return (
    <>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: 'transform 0.1s ease-out'
        }}
        className="glass-card rounded-2xl overflow-hidden group flex flex-col h-full relative preserve-3d"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl overflow-hidden"
          style={{
            background: `radial-gradient(circle at ${shinePosition.x}% ${shinePosition.y}%, rgba(255,255,255,0.2) 0%, transparent 50%)`
          }}
        />

        <div className="relative overflow-hidden aspect-video cursor-pointer bg-slate-100 dark:bg-slate-800" onClick={() => setIsModalOpen(true)}>
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
            <div className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-slate-900 hover:bg-primary hover:text-white transition-all hover:scale-110 shadow-lg">
              <Eye size={20} />
            </div>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-slate-900 hover:bg-primary hover:text-white transition-all hover:scale-110 shadow-lg"
              >
                <Github size={20} />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-slate-900 hover:bg-primary hover:text-white transition-all hover:scale-110 shadow-lg"
              >
                <ExternalLink size={20} />
              </a>
            )}
          </div>
        </div>
        <div className="p-6 flex flex-col flex-grow relative z-10">
          <Link to={`/projects/${project.slug}`}>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
          </Link>
          <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 flex-grow leading-relaxed">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-600 hover:border-primary hover:text-primary transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
          <Link
            to={`/projects/${project.slug}`}
            className="inline-flex items-center text-primary font-bold hover:gap-3 gap-2 transition-all group/link"
          >
            View Details <ArrowRight size={18} className="group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>
      <ProjectModal project={project} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default ProjectCard;
