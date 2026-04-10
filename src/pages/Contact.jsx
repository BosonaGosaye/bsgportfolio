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
        {/* Enhanced Header with 3D Effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 relative"
        >
          {/* Animated background orbs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 rounded-full blur-[150px] animate-pulse" />
          
          <motion.div 
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-2 border-primary/30 rounded-full mb-8 relative z-10 shadow-lg"
            whileHover={{ scale: 1.05, rotate: 2 }}
          >
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-sm font-black uppercase tracking-widest bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Let's Connect</span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-10 tracking-tighter relative z-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm animate-gradient-shift">
              Get In Touch
            </span>
            <motion.div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-56 h-2 bg-gradient-to-r from-primary via-purple-600 to-pink-600 rounded-full shadow-lg"
              animate={{ scaleX: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.h1>
          
          <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium relative z-10">
            Have a project in mind or just want to chat? Feel free to reach out using the form below or via my contact details.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl font-black mb-12 flex items-center tracking-tighter text-slate-900 dark:text-white relative"
              whileHover={{ x: 10 }}
            >
              <MessageSquare className="mr-4 text-primary shrink-0" size={40} />
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Contact Information
              </span>
            </motion.h2>

            <div className="space-y-6">
              {/* Simple Email */}
              <motion.a
                href={`mailto:${profile?.email || 'bosona01234@gmail.com'}`}
                whileHover={{ x: 5 }}
                className="flex items-center group"
              >
                <motion.div 
                  className="p-3 bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-xl text-primary mr-4 group-hover:scale-110 transition-transform"
                  whileHover={{ rotate: 5 }}
                >
                  <Mail size={24} />
                </motion.div>
                <div>
                  <h3 className="font-bold text-sm text-slate-500 dark:text-slate-400 mb-1">Email</h3>
                  <p className="text-slate-900 dark:text-white font-semibold break-all group-hover:text-primary transition-colors">{profile?.email || 'hello@example.com'}</p>
                </div>
              </motion.a>

              {/* Simple Phone */}
              {profile?.phone && (
                <motion.a
                  href={`tel:${profile.phone}`}
                  whileHover={{ x: 5 }}
                  className="flex items-center group"
                >
                  <motion.div 
                    className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl text-green-600 mr-4 group-hover:scale-110 transition-transform"
                    whileHover={{ rotate: 5 }}
                  >
                    <Phone size={24} />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-500 dark:text-slate-400 mb-1">Phone</h3>
                    <p className="text-slate-900 dark:text-white font-semibold group-hover:text-green-600 transition-colors">{profile.phone}</p>
                  </div>
                </motion.a>
              )}

              {/* Simple Location */}
              {profile?.location && (
                <motion.a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 5 }}
                  className="flex items-center group"
                >
                  <motion.div 
                    className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl text-purple-600 mr-4 group-hover:scale-110 transition-transform"
                    whileHover={{ rotate: 5 }}
                  >
                    <MapPin size={24} />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-500 dark:text-slate-400 mb-1">Location</h3>
                    <p className="text-slate-900 dark:text-white font-semibold group-hover:text-purple-600 transition-colors">{profile.location}</p>
                  </div>
                </motion.a>
              )}
            </div>

            {/* Enhanced Social Media Quick Links */}
            <div className="mt-12">
              <h3 className="font-black text-xl mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Connect on Social Media</h3>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map(({ icon: Icon, url, label, color }) => url && (
                  <motion.a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, y: -6, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className={`relative p-4 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-2xl text-slate-600 dark:text-slate-400 hover:text-white hover:shadow-2xl border-2 border-slate-200/50 dark:border-slate-700/50 hover:border-primary/50 transition-all duration-300 group overflow-hidden`}
                    aria-label={label}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${color.replace('hover:', '')} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <Icon size={24} className="relative z-10" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Enhanced Availability Section with Better Design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12 p-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 rounded-3xl border-2 border-green-200/50 dark:border-green-700/50 relative overflow-hidden group"
            >
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10"
                animate={{ 
                  backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
                }}
                transition={{ duration: 10, repeat: Infinity }}
              />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <motion.div 
                    className="p-3 bg-green-500 rounded-full shadow-lg"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </motion.div>
                  <h3 className="font-black text-xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Currently Available</h3>
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-4 text-base font-medium leading-relaxed">
                  I'm currently available for freelance projects and full-time positions.
                </p>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-bold text-sm">
                  <Clock size={18} className="text-green-600" />
                  <span>Response time: 24-48 hours</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* 3D Contact Form with Attractive Design */}
          <motion.div
            initial={{ opacity: 0, x: 30, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative perspective-1000"
          >
            {/* Floating background orbs */}
            <motion.div
              className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-primary/30 to-purple-500/30 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br from-blue-500/30 to-pink-500/30 rounded-full blur-3xl"
              animate={{ 
                scale: [1.2, 1, 1.2],
                rotate: [90, 0, 90]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />

            {/* Main form container with 3D effect */}
            <motion.div
              whileHover={{ 
                scale: 1.02,
                rotateX: 2,
                rotateY: 2,
                transition: { duration: 0.3 }
              }}
              className="relative bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl border-2 border-white/50 dark:border-slate-700/50 transform-gpu"
              style={{
                transformStyle: 'preserve-3d',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
              }}
            >
              {/* 3D Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 rounded-[2.5rem] pointer-events-none opacity-50" style={{ transform: 'translateZ(-10px)' }} />
              
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-[2.5rem] pointer-events-none"
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 5,
                  ease: 'easeInOut'
                }}
              />

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

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 3D Name Input */}
                  <motion.div
                    whileHover={{ scale: 1.02, z: 10 }}
                    className="transform-gpu"
                  >
                    <label htmlFor="name" className="block text-sm font-bold mb-2 ml-1 text-slate-700 dark:text-slate-300">Name *</label>
                    <div className="relative group">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-5 py-4 rounded-2xl border-2 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-primary focus:border-primary'} bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 transition-all shadow-lg hover:shadow-xl group-hover:shadow-primary/20 transform-gpu`}
                        placeholder="Your Name"
                        style={{
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
                        }}
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    <AnimatePresence>
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-red-500 text-xs mt-2 ml-1 font-semibold"
                        >
                          {errors.name}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* 3D Email Input */}
                  <motion.div
                    whileHover={{ scale: 1.02, z: 10 }}
                    className="transform-gpu"
                  >
                    <label htmlFor="email" className="block text-sm font-bold mb-2 ml-1 text-slate-700 dark:text-slate-300">Email *</label>
                    <div className="relative group">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-5 py-4 rounded-2xl border-2 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-primary focus:border-primary'} bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 transition-all shadow-lg hover:shadow-xl group-hover:shadow-primary/20 transform-gpu`}
                        placeholder="example@gmail.com"
                        style={{
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
                        }}
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-red-500 text-xs mt-2 ml-1 font-semibold"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* 3D Phone Input */}
                <motion.div
                  whileHover={{ scale: 1.02, z: 10 }}
                  className="transform-gpu"
                >
                  <label htmlFor="phone" className="block text-sm font-bold mb-2 ml-1 text-slate-700 dark:text-slate-300">Phone Number</label>
                  <div className="relative group">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-lg hover:shadow-xl group-hover:shadow-primary/20 transform-gpu"
                      placeholder="+1 (555) 123-4567"
                      style={{
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
                      }}
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                </motion.div>

                {/* 3D Subject Input */}
                <motion.div
                  whileHover={{ scale: 1.02, z: 10 }}
                  className="transform-gpu"
                >
                  <label htmlFor="subject" className="block text-sm font-bold mb-2 ml-1 text-slate-700 dark:text-slate-300">Subject *</label>
                  <div className="relative group">
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-5 py-4 rounded-2xl border-2 ${errors.subject ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-primary focus:border-primary'} bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 transition-all shadow-lg hover:shadow-xl group-hover:shadow-primary/20 transform-gpu`}
                      placeholder="Project Inquiry"
                      style={{
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
                      }}
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <AnimatePresence>
                    {errors.subject && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-red-500 text-xs mt-2 ml-1 font-semibold"
                      >
                        {errors.subject}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* 3D Message Textarea */}
                <motion.div
                  whileHover={{ scale: 1.02, z: 10 }}
                  className="transform-gpu"
                >
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="message" className="block text-sm font-bold ml-1 text-slate-700 dark:text-slate-300">Message *</label>
                    <span className="text-xs text-slate-400 font-semibold">
                      {formData.message.length} characters
                    </span>
                  </div>
                  <div className="relative group">
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full px-5 py-4 rounded-2xl border-2 ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-primary focus:border-primary'} bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 transition-all resize-none shadow-lg hover:shadow-xl group-hover:shadow-primary/20 transform-gpu`}
                      placeholder="Tell me about your project..."
                      style={{
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
                      }}
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <AnimatePresence>
                    {errors.message && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-red-500 text-xs mt-2 ml-1 font-semibold"
                      >
                        {errors.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* 3D Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.05, y: loading ? 0 : -2 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                  className="group relative w-full py-5 bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-white rounded-2xl font-black text-lg flex items-center justify-center overflow-hidden transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform-gpu"
                  style={{
                    boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
                  }}
                >
                  {/* Animated background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-primary"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                  />
                  
                  {/* Button content */}
                  <span className="relative z-10 flex items-center">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Send size={20} className="ml-2" />
                        </motion.div>
                      </>
                    )}
                  </span>
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              </form>
            </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Contact;
