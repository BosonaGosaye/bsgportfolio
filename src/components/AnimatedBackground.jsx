import { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Generate random floating shapes
    const shapeCount = 12;
    for (let i = 0; i < shapeCount; i++) {
      const shape = document.createElement('div');
      shape.className = 'tech-shape';
      shape.style.width = `${Math.random() * 200 + 100}px`;
      shape.style.height = shape.style.width;
      shape.style.top = `${Math.random() * 100}%`;
      shape.style.left = `${Math.random() * 100}%`;
      shape.style.animationDelay = `${Math.random() * 10}s`;
      shape.style.animationDuration = `${Math.random() * 10 + 15}s`;
      container.appendChild(shape);
    }

    // Parallax mouse effect
    const handleMouseMove = (e) => {
      const shapes = container.querySelectorAll('.tech-shape, .tech-icon');
      shapes.forEach((el, i) => {
        const speed = (i + 1) * 0.005;
        const x = (e.clientX - window.innerWidth / 2) * speed;
        const y = (e.clientY - window.innerHeight / 2) * speed;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="tech-bg" ref={containerRef}>
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-700" />

      {/* Large gradient circles */}
      <div className="tech-shape tech-circle" style={{ width: '300px', height: '300px', top: '10%', left: '5%', animationDelay: '0s' }} />
      <div className="tech-shape tech-circle" style={{ width: '250px', height: '250px', bottom: '10%', right: '5%', animationDelay: '4s' }} />
      <div className="tech-shape tech-circle" style={{ width: '200px', height: '200px', top: '50%', right: '15%', animationDelay: '2s' }} />

      {/* Tech Icons - React */}
      <svg className="tech-icon" style={{ top: '20%', left: '30%', animationDelay: '2s' }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85S10.13 13 10.13 12c0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 0 1-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9c-.6 0-1.17 0-1.71.03-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03.6 0 1.17 0 1.71-.03.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68s-1.83 2.93-4.37 3.68c.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68s1.83-2.93 4.37-3.68c-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26 0-.73-1.18-1.63-3.28-2.26-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26 0 .73 1.18 1.63 3.28 2.26.25-.76.55-1.51.89-2.26m9.45 0c.39-.86.73-1.74 1.01-2.64-.39-.1-.8-.19-1.22-.26-.27.64-.59 1.27-.92 1.9-.33.63-.68 1.24-1.05 1.83.37.59.72 1.2 1.05 1.83.33.63.65 1.26.92 1.9.42-.07.83-.16 1.22-.26-.28-.9-.62-1.78-1.01-2.64-.13-.26-.26-.51-.39-.76-.13-.25-.26-.5-.39-.76.13-.26.26-.51.39-.76.13-.25.26-.5.39-.76m-4.74 0c.39.86.73 1.74 1.01 2.64.39-.1.8-.19 1.22-.26.27-.64.59-1.27.92-1.9.33-.63.68-1.24 1.05-1.83-.37-.59-.72-1.2-1.05-1.83-.33-.63-.65-1.26-.92-1.9-.42.07-.83.16-1.22.26.28.9.62 1.78 1.01 2.64.13.26.26.51.39.76.13.25.26.5.39.76-.13.26-.26.51-.39.76-.13.25-.26.5-.39.76z" fill="currentColor" />
      </svg>

      {/* Code Brackets */}
      <div className="tech-icon tech-text" style={{ top: '60%', left: '10%', animationDelay: '6s' }}>
        &lt;/&gt;
      </div>

      {/* JavaScript */}
      <div className="tech-icon tech-text" style={{ top: '40%', right: '20%', animationDelay: '8s' }}>
        JS
      </div>

      {/* Firebase Icon */}
      <svg className="tech-icon" style={{ top: '70%', right: '30%', animationDelay: '3s' }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.89 15.672L6.255.461A.542.542 0 0 1 7.27.288l2.543 4.771zm16.794 3.692l-2.25-14a.54.54 0 0 0-.919-.295L3.316 19.365l7.856 4.427a1.621 1.621 0 0 0 1.588 0zM14.3 7.147l-1.82-3.482a.542.542 0 0 0-.96 0L3.53 17.984z" fill="currentColor" />
      </svg>

      {/* Flutter Icon */}
      <svg className="tech-icon" style={{ top: '30%', left: '60%', animationDelay: '5s' }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.314 0L2.3 12 6 15.7 21.684.013h-7.357zm.014 11.072L7.857 17.53l6.47 6.47H21.7l-6.46-6.468 6.46-6.46h-7.37z" fill="currentColor" />
      </svg>

      {/* Database Icon */}
      <svg className="tech-icon" style={{ top: '15%', right: '10%', animationDelay: '7s' }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>

      {/* Git Icon */}
      <svg className="tech-icon" style={{ top: '80%', left: '40%', animationDelay: '4s' }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.546 10.93L13.067.452a1.55 1.55 0 0 0-2.188 0L8.708 2.627l2.76 2.76a1.838 1.838 0 0 1 2.327 2.341l2.658 2.66a1.838 1.838 0 0 1 1.924 3.041 1.837 1.837 0 0 1-2.6 0 1.846 1.846 0 0 1-.404-2.002l-2.477-2.477v6.51a1.846 1.846 0 0 1 .495 3.015 1.838 1.838 0 1 1-2.6-2.598 1.846 1.846 0 0 1 .497-.36v-6.57a1.846 1.846 0 0 1-.998-2.413L7.531 3.96.451 11.04a1.55 1.55 0 0 0 0 2.188l10.479 10.479a1.55 1.55 0 0 0 2.188 0l10.428-10.428a1.55 1.55 0 0 0 0-2.188" fill="currentColor" />
      </svg>

      {/* API Icon */}
      <div className="tech-icon tech-text" style={{ top: '50%', left: '80%', animationDelay: '9s', fontSize: '48px' }}>
        API
      </div>

      {/* Laptop Icon */}
      <svg className="tech-icon" style={{ top: '25%', left: '75%', animationDelay: '10s' }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M2 15h20" stroke="currentColor" strokeWidth="2" />
        <path d="M1 19h22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>

      {/* Computer/Monitor Icon */}
      <svg className="tech-icon" style={{ top: '65%', right: '15%', animationDelay: '11s' }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M8 21h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 17v4" stroke="currentColor" strokeWidth="2" />
      </svg>

      {/* Smartphone Icon */}
      <svg className="tech-icon" style={{ top: '45%', left: '15%', animationDelay: '12s' }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="2" width="12" height="20" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M6 18h12" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="20" r="0.5" fill="currentColor" stroke="currentColor" strokeWidth="1" />
      </svg>

      {/* Terminal/Command Icon */}
      <svg className="tech-icon" style={{ top: '10%', left: '45%', animationDelay: '13s' }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M6 8l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>

      {/* Cloud Icon */}
      <svg className="tech-icon" style={{ top: '75%', left: '65%', animationDelay: '14s' }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {/* Server Icon */}
      <svg className="tech-icon" style={{ top: '55%', right: '40%', animationDelay: '15s' }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="8" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
        <rect x="2" y="14" width="20" height="8" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="6" cy="6" r="1" fill="currentColor" />
        <circle cx="6" cy="18" r="1" fill="currentColor" />
      </svg>

      {/* Code Window Icon */}
      <svg className="tech-icon" style={{ top: '35%', left: '5%', animationDelay: '16s' }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="3" width="20" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M2 7h20" stroke="currentColor" strokeWidth="2" />
        <circle cx="5" cy="5" r="0.5" fill="currentColor" />
        <circle cx="7" cy="5" r="0.5" fill="currentColor" />
        <circle cx="9" cy="5" r="0.5" fill="currentColor" />
        <path d="M8 12l3 3-3 3M13 18h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {/* Tablet Icon */}
      <svg className="tech-icon" style={{ top: '85%', right: '25%', animationDelay: '17s' }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M4 18h16" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="20" r="0.5" fill="currentColor" stroke="currentColor" strokeWidth="1" />
      </svg>

      {/* CPU/Chip Icon */}
      <svg className="tech-icon" style={{ top: '5%', right: '35%', animationDelay: '18s' }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="7" y="7" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
        <rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M9 2v5M12 2v5M15 2v5M9 17v5M12 17v5M15 17v5M2 9h5M2 12h5M2 15h5M17 9h5M17 12h5M17 15h5" stroke="currentColor" strokeWidth="2" />
      </svg>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
