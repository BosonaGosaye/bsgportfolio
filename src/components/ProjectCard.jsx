import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProjectCard = ({ project }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-primary/50 group flex flex-col h-full relative"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

      <div className="relative overflow-hidden aspect-video">
        <img
          src={project.coverImage}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
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
              className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-slate-900 hover:bg-primary hover:text-white transition-all hover:scale-110 shadow-lg"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow relative z-10">
        <Link to={`/projects/${project.slug}`}>
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text group-hover:from-primary group-hover:to-purple-600 transition-all duration-300">
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
  );
};

export default ProjectCard;
