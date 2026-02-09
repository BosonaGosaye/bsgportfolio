import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AnimatedBackground from './components/AnimatedBackground';
import ScrollProgress from './components/ScrollProgress';
import { ThemeProvider } from './context/ThemeContext';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Blogs = lazy(() => import('./pages/Blogs'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const Resume = lazy(() => import('./pages/Resume'));
const Services = lazy(() => import('./pages/Services'));
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProjectsAdmin = lazy(() => import('./pages/admin/ProjectsAdmin'));
const BlogsAdmin = lazy(() => import('./pages/admin/BlogsAdmin'));
const SkillsAdmin = lazy(() => import('./pages/admin/SkillsAdmin'));
const ServicesAdmin = lazy(() => import('./pages/admin/ServicesAdmin'));
const ProfileAdmin = lazy(() => import('./pages/admin/ProfileAdmin'));
const MessagesAdmin = lazy(() => import('./pages/admin/MessagesAdmin'));
const AboutAdmin = lazy(() => import('./pages/admin/AboutAdmin'));
const AdminLayout = lazy(() => import('./components/AdminLayout'));

const PageLoader = () => (
  <div className="flex justify-center items-center min-h-[60vh]">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
      <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="relative min-h-screen text-slate-900 dark:text-slate-100 flex flex-col">
          <AnimatedBackground />
          <ScrollProgress />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes with Navbar/Footer */}
              <Route path="/" element={<><Navbar /><main className="flex-grow"><Home /></main><Footer /></>} />
              <Route path="/about" element={<><Navbar /><main className="flex-grow"><About /></main><Footer /></>} />
              <Route path="/projects" element={<><Navbar /><main className="flex-grow"><Projects /></main><Footer /></>} />
              <Route path="/projects/:slug" element={<><Navbar /><main className="flex-grow"><ProjectDetail /></main><Footer /></>} />
              <Route path="/blog" element={<><Navbar /><main className="flex-grow"><Blogs /></main><Footer /></>} />
              <Route path="/blog/:slug" element={<><Navbar /><main className="flex-grow"><BlogDetail /></main><Footer /></>} />
              <Route path="/services" element={<><Navbar /><main className="flex-grow"><Services /></main><Footer /></>} />
              <Route path="/resume" element={<><Navbar /><main className="flex-grow"><Resume /></main><Footer /></>} />
              <Route path="/contact" element={<><Navbar /><main className="flex-grow"><Contact /></main><Footer /></>} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="projects" element={<ProjectsAdmin />} />
                  <Route path="blog" element={<BlogsAdmin />} />
                  <Route path="services" element={<ServicesAdmin />} />
                  <Route path="skills" element={<SkillsAdmin />} />
                  <Route path="profile" element={<ProfileAdmin />} />
                  <Route path="about" element={<AboutAdmin />} />
                  <Route path="messages" element={<MessagesAdmin />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
