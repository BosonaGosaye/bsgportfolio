import { useState, useEffect, useRef } from 'react';
import {
    Save,
    Loader,
    User,
    Mail,
    Briefcase,
    Github,
    Linkedin,
    Twitter,
    Instagram,
    FileText,
    Image as ImageIcon,
    CloudUpload,
    Bold,
    Italic,
    Link as LinkIcon,
    List,
    Heading
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getProfile, updateProfile, uploadFile } from '../../services/api';

const ProfileAdmin = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Refs for markdown editor
    const bioRef = useRef(null);
    const shortBioRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        shortBio: '',
        profileImage: '',
        resumeUrl: '',
        socialLinks: {
            github: '',
            linkedin: '',
            twitter: '',
            instagram: ''
        }
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await getProfile();
            if (res.data) {
                setFormData({
                    name: res.data.name || '',
                    title: res.data.title || '',
                    email: res.data.email || '',
                    phone: res.data.phone || '',
                    location: res.data.location || '',
                    bio: res.data.bio || '',
                    shortBio: res.data.shortBio || '',
                    profileImage: res.data.profileImage || '',
                    resumeUrl: res.data.resumeUrl || '',
                    socialLinks: {
                        github: res.data.socialLinks?.github || '',
                        linkedin: res.data.socialLinks?.linkedin || '',
                        twitter: res.data.socialLinks?.twitter || '',
                        instagram: res.data.socialLinks?.instagram || ''
                    }
                });
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            // If 404, we just start with empty form
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('social_')) {
            const socialKey = name.replace('social_', '');
            setFormData(prev => ({
                ...prev,
                socialLinks: {
                    ...prev.socialLinks,
                    [socialKey]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            setUploading(true);
            const res = await uploadFile(formDataUpload, user.token);
            setFormData(prev => ({ ...prev, profileImage: res.data.url }));
        } catch (err) {
            console.error('Error uploading image:', err);
            setMessage({ type: 'error', text: 'Failed to upload image' });
        } finally {
            setUploading(false);
        }
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation for PDF
        if (file.type !== 'application/pdf') {
            setMessage({ type: 'error', text: 'Please upload a PDF file.' });
            return;
        }

        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            setUploading(true);
            const res = await uploadFile(formDataUpload, user.token);
            setFormData(prev => ({ ...prev, resumeUrl: res.data.url }));
            setMessage({ type: 'success', text: 'Resume uploaded successfully!' });
        } catch (err) {
            console.error('Error uploading resume:', err);
            setMessage({ type: 'error', text: 'Failed to upload resume' });
        } finally {
            setUploading(false);
        }
    };

    const insertMarkdown = (type, fieldName) => {
        const textarea = fieldName === 'bio' ? bioRef.current : shortBioRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = formData[fieldName];
        const before = text.substring(0, start);
        const after = text.substring(end);
        const selection = text.substring(start, end);

        let newText = '';
        let cursorOffset = 0;

        switch (type) {
            case 'bold':
                newText = `${before}**${selection || 'text'}**${after}`;
                cursorOffset = 2;
                break;
            case 'italic':
                newText = `${before}*${selection || 'text'}*${after}`;
                cursorOffset = 1;
                break;
            case 'h1':
                newText = `${before}# ${selection || 'Heading'}\n${after}`;
                cursorOffset = 2;
                break;
            case 'h2':
                newText = `${before}## ${selection || 'Heading'}\n${after}`;
                cursorOffset = 3;
                break;
            case 'link':
                newText = `${before}[${selection || 'text'}](url)${after}`;
                cursorOffset = 1;
                break;
            case 'list':
                newText = `${before}- ${selection || 'Item'}\n${after}`;
                cursorOffset = 2;
                break;
            default:
                return;
        }

        setFormData(prev => ({ ...prev, [fieldName]: newText }));

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + cursorOffset, start + cursorOffset + (selection.length || 4));
        }, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            await updateProfile(formData, user.token);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });

            // Clear success message after 3 seconds
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            console.error('Error saving profile:', err);
            setMessage({ type: 'error', text: 'Failed to save profile' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Profile Settings</h1>
                {message.text && (
                    <div className={`px-4 py-2 rounded-xl text-sm font-bold animate-in fade-in slide-in-from-top-2 ${message.type === 'success'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                        {message.text}
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-700 space-y-8">

                {/* Profile Image */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700 border-4 border-white dark:border-slate-800 shadow-lg">
                            {formData.profileImage ? (
                                <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-slate-400">
                                    <User size={48} />
                                </div>
                            )}
                            {uploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <Loader className="animate-spin text-white" size={24} />
                                </div>
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full cursor-pointer hover:bg-blue-600 transition-colors shadow-lg">
                            <ImageIcon size={16} />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>
                    </div>
                    <div className="text-center sm:text-left">
                        <h2 className="text-xl font-bold">{formData.name || 'Your Name'}</h2>
                        <p className="text-slate-500 dark:text-slate-400">{formData.title || 'Your Title'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-700 pb-2">Personal Info</h3>

                        <div>
                            <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                                <User size={16} className="text-slate-400" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                                <Briefcase size={16} className="text-slate-400" />
                                Professional Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                                <Mail size={16} className="text-slate-400" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                                <FileText size={16} className="text-slate-400" />
                                Resume (PDF)
                            </label>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400 font-bold w-full">
                                    <CloudUpload size={20} />
                                    <span className="truncate">Upload PDF Resume</span>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleResumeUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            {formData.resumeUrl && (
                                <div className="mt-2 text-sm">
                                    <span className="text-slate-500 mr-2">Current:</span>
                                    <a
                                        href={formData.resumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline font-medium break-all"
                                    >
                                        View Resume
                                    </a>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                                <span className="text-slate-400">📞</span>
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                                placeholder="+1 (123) 456-7890"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                                <span className="text-slate-400">📍</span>
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                                placeholder="City, Country"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-700 pb-2">Social Links</h3>

                        <div>
                            <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                                <Github size={16} className="text-slate-400" />
                                GitHub URL
                            </label>
                            <input
                                type="url"
                                name="social_github"
                                value={formData.socialLinks.github}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                                placeholder="https://github.com/..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                                <Linkedin size={16} className="text-slate-400" />
                                LinkedIn URL
                            </label>
                            <input
                                type="url"
                                name="social_linkedin"
                                value={formData.socialLinks.linkedin}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                                placeholder="https://linkedin.com/in/..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                                <Twitter size={16} className="text-slate-400" />
                                Twitter/X URL
                            </label>
                            <input
                                type="url"
                                name="social_twitter"
                                value={formData.socialLinks.twitter}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                                placeholder="https://twitter.com/..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                                <Instagram size={16} className="text-slate-400" />
                                Instagram URL
                            </label>
                            <input
                                type="url"
                                name="social_instagram"
                                value={formData.socialLinks.instagram}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-700 pb-2">Bio</h3>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-bold">Short Bio (Hero Section)</label>
                            <div className="flex gap-1">
                                <button type="button" onClick={() => insertMarkdown('bold', 'shortBio')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500" title="Bold">
                                    <Bold size={16} />
                                </button>
                                <button type="button" onClick={() => insertMarkdown('italic', 'shortBio')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500" title="Italic">
                                    <Italic size={16} />
                                </button>
                                <button type="button" onClick={() => insertMarkdown('h1', 'shortBio')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500" title="Heading">
                                    <Heading size={16} />
                                </button>
                                <button type="button" onClick={() => insertMarkdown('list', 'shortBio')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500" title="List">
                                    <List size={16} />
                                </button>
                                <button type="button" onClick={() => insertMarkdown('link', 'shortBio')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500" title="Link">
                                    <LinkIcon size={16} />
                                </button>
                            </div>
                        </div>
                        <textarea
                            ref={shortBioRef}
                            name="shortBio"
                            value={formData.shortBio}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all resize-none font-mono text-sm"
                            placeholder="A brief introduction... (Markdown supported)"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-bold">Full Bio (About Page)</label>
                            <div className="flex gap-1">
                                <button type="button" onClick={() => insertMarkdown('bold', 'bio')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500" title="Bold">
                                    <Bold size={16} />
                                </button>
                                <button type="button" onClick={() => insertMarkdown('italic', 'bio')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500" title="Italic">
                                    <Italic size={16} />
                                </button>
                                <button type="button" onClick={() => insertMarkdown('h1', 'bio')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500" title="Heading">
                                    <Heading size={16} />
                                </button>
                                <button type="button" onClick={() => insertMarkdown('list', 'bio')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500" title="List">
                                    <List size={16} />
                                </button>
                                <button type="button" onClick={() => insertMarkdown('link', 'bio')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500" title="Link">
                                    <LinkIcon size={16} />
                                </button>
                            </div>
                        </div>
                        <textarea
                            ref={bioRef}
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            rows="6"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all font-mono text-sm"
                            placeholder="Your full story... (Markdown supported)"
                        />
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex items-center"
                    >
                        {saving ? <Loader size={20} className="animate-spin mr-2" /> : <Save size={20} className="mr-2" />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileAdmin;
