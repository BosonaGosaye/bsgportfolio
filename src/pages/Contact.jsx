import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, AlertCircle, CheckCircle2, Github, Linkedin, Twitter, Instagram, Sparkles, Clock } from 'lucide-react';
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
  const [errors, setErrors] = useState({});

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
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });

    // Clear error for this field when user starts typing
    if (errors[id]) {
      setErrors({ ...errors, [id]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await sendMessage(formData);
      setStatus({
        type: 'success',
        message: 'Your message has been sent successfully! I will get back to you soon.'
      });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });

      // Show confetti effect (simple version)
      setTimeout(() => {
        setStatus({ type: '', message: '' });
      }, 5000);
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Something went wrong. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = [
    { icon: Github, url: profile?.socialLinks?.github, label: 'GitHub', color: 'hover:bg-slate-900 hover:text-white' },
    { icon: Linkedin, url: profile?.socialLinks?.linkedin, label: 'LinkedIn', color: 'hover:bg-blue-600 hover:text-white' },
    { icon: Twitter, url: profile?.socialLinks?.twitter, label: 'Twitter', color: 'hover:bg-sky-500 hover:text-white' },
    { icon: Instagram, url: profile?.socialLinks?.instagram, label: 'Instagram', color: 'hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white' },
  ];

  return (
    <>
      <Meta
        title="Contact Me"
        description="Get in touch with me for collaborations, job opportunities, or just to say hi!"
      />

      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Let's Connect</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">Get In Touch</h1>
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

            <div className="space-y-6">
              {/* Email */}
              <motion.a
                href={`mailto:${profile?.email || 'hello@example.com'}`}
                whileHover={{ x: 4 }}
                className="flex items-start group hover:bg-slate-50 dark:hover:bg-slate-800/50 p-4 rounded-2xl transition-all -mx-4"
              >
                <div className="p-4 bg-primary/10 rounded-2xl text-primary mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">Email</h3>
                  <p className="text-slate-600 dark:text-slate-400 break-all">{profile?.email || 'hello@example.com'}</p>
                </div>
              </motion.a>

              {/* Phone */}
              {profile?.phone && (
                <motion.a
                  href={`tel:${profile.phone}`}
                  whileHover={{ x: 4 }}
                  className="flex items-start group hover:bg-slate-50 dark:hover:bg-slate-800/50 p-4 rounded-2xl transition-all -mx-4"
                >
                  <div className="p-4 bg-primary/10 rounded-2xl text-primary mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">Phone</h3>
                    <p className="text-slate-600 dark:text-slate-400">{profile.phone}</p>
                  </div>
                </motion.a>
              )}

              {/* Location */}
              {profile?.location && (
                <motion.a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 4 }}
                  className="flex items-start group hover:bg-slate-50 dark:hover:bg-slate-800/50 p-4 rounded-2xl transition-all -mx-4"
                >
                  <div className="p-4 bg-primary/10 rounded-2xl text-primary mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">Location</h3>
                    <p className="text-slate-600 dark:text-slate-400">{profile.location}</p>
                  </div>
                </motion.a>
              )}
            </div>

            {/* Social Media Quick Links */}
            <div className="mt-12">
              <h3 className="font-bold text-lg mb-4">Connect on Social Media</h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map(({ icon: Icon, url, label, color }) => url && (
                  <motion.a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 transition-all duration-300 ${color}`}
                    aria-label={label}
                  >
                    <Icon size={24} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Availability Section with Enhanced Design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12 p-8 bg-gradient-to-br from-primary/5 to-purple-500/5 dark:from-primary/10 dark:to-purple-500/10 rounded-3xl border border-primary/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500 rounded-full animate-pulse">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
                <h3 className="font-bold text-xl">Currently Available</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                I'm currently available for freelance projects and full-time positions.
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Clock size={16} />
                <span>Response time: 24-48 hours</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form with Enhanced Validation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-700/50"
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-3xl pointer-events-none" />

            <div className="relative z-10">
              <AnimatePresence mode="wait">
                {status.message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className={`mb-6 p-4 rounded-xl flex items-center text-sm font-medium ${status.type === 'success'
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
                      }`}
                  >
                    {status.type === 'success' ? (
                      <CheckCircle2 size={18} className="mr-2 shrink-0" />
                    ) : (
                      <AlertCircle size={18} className="mr-2 shrink-0" />
                    )}
                    {status.message}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold mb-2 ml-1">Name *</label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-primary'} bg-slate-50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 transition-all`}
                      placeholder="John Doe"
                    />
                    <AnimatePresence>
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-red-500 text-xs mt-1 ml-1"
                        >
                          {errors.name}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-bold mb-2 ml-1">Email *</label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-primary'} bg-slate-50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 transition-all`}
                      placeholder="john@example.com"
                    />
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-red-500 text-xs mt-1 ml-1"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-bold mb-2 ml-1">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-bold mb-2 ml-1">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.subject ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-primary'} bg-slate-50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 transition-all`}
                    placeholder="Project Inquiry"
                  />
                  <AnimatePresence>
                    {errors.subject && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-red-500 text-xs mt-1 ml-1"
                      >
                        {errors.subject}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="message" className="block text-sm font-bold ml-1">Message *</label>
                    <span className="text-xs text-slate-400">
                      {formData.message.length} characters
                    </span>
                  </div>
                  <textarea
                    id="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-primary'} bg-slate-50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 transition-all resize-none`}
                    placeholder="Tell me about your project..."
                  />
                  <AnimatePresence>
                    {errors.message && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-red-500 text-xs mt-1 ml-1"
                      >
                        {errors.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="group w-full py-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl font-bold flex items-center justify-center hover:shadow-xl hover:shadow-primary/50 transition-all duration-300 shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Contact;
