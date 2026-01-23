import { ExternalLink, Calendar } from 'lucide-react';

const CertificationCard = ({ cert }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        {cert.image && (
          <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            <img src={cert.image} alt={cert.name} className="w-full h-full object-contain p-2" />
          </div>
        )}
        <div className="flex-grow">
          <h3 className="text-lg font-bold mb-1">{cert.name}</h3>
          <p className="text-slate-600 dark:text-slate-400 font-medium mb-3">{cert.issuer}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
              <Calendar size={14} className="mr-1" />
              {cert.date}
            </div>
            {cert.url && (
              <a
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center text-sm font-semibold"
              >
                Verify <ExternalLink size={14} className="ml-1" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificationCard;
