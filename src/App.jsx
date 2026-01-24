import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import Resume from './pages/Resume';
import Services from './pages/Services';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ProjectsAdmin from './pages/admin/ProjectsAdmin';
import BlogsAdmin from './pages/admin/BlogsAdmin';
import SkillsAdmin from './pages/admin/SkillsAdmin';
import ServicesAdmin from './pages/admin/ServicesAdmin';
import ProfileAdmin from './pages/admin/ProfileAdmin';
import MessagesAdmin from './pages/admin/MessagesAdmin';
import AboutAdmin from './pages/admin/AboutAdmin';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col">
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
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
