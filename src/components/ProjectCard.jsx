import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700 group flex flex-col h-full">
      <div className="relative overflow-hidden aspect-video">
        <img
          src={project.coverImage}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white rounded-full text-slate-900 hover:bg-primary hover:text-white transition-colors"
            >
              <Github size={20} />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white rounded-full text-slate-900 hover:bg-primary hover:text-white transition-colors"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <Link to={`/projects/${project.slug}`}>
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
        </Link>
        <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 flex-grow">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
        <Link 
          to={`/projects/${project.slug}`}
          className="inline-flex items-center text-primary font-bold hover:translate-x-2 transition-transform"
        >
          View Details <ArrowRight size={18} className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
