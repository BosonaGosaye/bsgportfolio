import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';
import Meta from '../components/Meta';
import { sendMessage, getProfile } from '../services/api';

const Contact = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      setProfile(res.data);
    } catch (err) {
      console.error('Error fetching profile for contact info:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await sendMessage(formData);
      setStatus({
        type: 'success',
        message: 'Your message has been sent successfully! I will get back to you soon.'
      });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Something went wrong. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Meta
        title="Contact Me"
        description="Get in touch with me for collaborations, job opportunities, or just to say hi!"
      />
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Get In Touch</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Have a project in mind or just want to chat? Feel free to reach out using the form below or via my contact details.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-8 flex items-center">
              <MessageSquare className="mr-3 text-primary" size={28} />
              Contact Information
            </h2>

            <div className="space-y-8">
              {/* Email */}
              <a
                href={`mailto:${profile?.email || 'hello@example.com'}`}
                className="flex items-start group hover:bg-slate-50 dark:hover:bg-slate-800/50 p-4 rounded-2xl transition-all -mx-4"
              >
                <div className="p-4 bg-primary/10 rounded-2xl text-primary mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">Email</h3>
                  <p className="text-slate-600 dark:text-slate-400 break-all">{profile?.email || 'hello@example.com'}</p>
                </div>
              </a>

              {/* Phone */}
              {profile?.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="flex items-start group hover:bg-slate-50 dark:hover:bg-slate-800/50 p-4 rounded-2xl transition-all -mx-4"
                >
                  <div className="p-4 bg-primary/10 rounded-2xl text-primary mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">Phone</h3>
                    <p className="text-slate-600 dark:text-slate-400">{profile.phone}</p>
                  </div>
                </a>
              )}

              {/* Location */}
              {profile?.location && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start group hover:bg-slate-50 dark:hover:bg-slate-800/50 p-4 rounded-2xl transition-all -mx-4"
                >
                  <div className="p-4 bg-primary/10 rounded-2xl text-primary mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">Location</h3>
                    <p className="text-slate-600 dark:text-slate-400">{profile.location}</p>
                  </div>
                </a>
              )}
            </div>

            <div className="mt-12 p-8 bg-slate-100 dark:bg-slate-800 rounded-3xl">
              <h3 className="font-bold text-xl mb-4">Availability</h3>
              <p className="text-slate-600 dark:text-slate-400">
                I'm currently available for freelance projects and full-time positions.
                Expect a response within 24-48 hours.
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700"
          >
            {status.message && (
              <div className={`mb-6 p-4 rounded-xl flex items-center text-sm font-medium ${status.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                }`}>
                {status.type === 'success' ? (
                  <CheckCircle2 size={18} className="mr-2 shrink-0" />
                ) : (
                  <AlertCircle size={18} className="mr-2 shrink-0" />
                )}
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold mb-2 ml-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="type name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-bold mb-2 ml-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="someone@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-bold mb-2 ml-1">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="+251 (0) 9876543210"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-bold mb-2 ml-1">Subject</label>
                <input
                  type="text"
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Project Inquiry"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-bold mb-2 ml-1">Message</label>
                <textarea
                  id="message"
                  rows="5"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                  placeholder="Tell me about your project..."
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Message'}
                <Send size={20} className="ml-2" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Contact;
