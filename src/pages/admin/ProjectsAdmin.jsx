import { useState, useEffect, useRef } from 'react';
import {
    PlusCircle,
    Search,
    Edit2,
    Trash2,
    ExternalLink,
    Github,
    Image as ImageIcon,
    X,
    Save,
    Loader,
    Video,
    Bold,
    Italic,
    Link as LinkIcon,
    List,
    Heading
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../../context/AuthContext';
import { getProjects, createProject, updateProject, deleteProject, uploadFile } from '../../services/api';
import ConfirmationModal from '../../components/ConfirmationModal';

const ProjectsAdmin = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);

    // Preview State
    const [showPreview, setShowPreview] = useState(false);

    // Editor Ref
    const textareaRef = useRef(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        longDescription: '',
        coverImage: '',
        gallery: [],
        techStack: '', // Comma separated for input
        challenges: '',
        solutions: '',
        videoUrl: '',
        githubUrl: '',
        liveUrl: '',
        isFeatured: false,
        category: ''
    });
    const [formLoading, setFormLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [galleryUploading, setGalleryUploading] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const res = await getProjects();
            setProjects(res.data);
        } catch (err) {
            console.error('Error fetching projects:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenModal = (project = null) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                title: project.title,
                slug: project.slug,
                description: project.description,
                longDescription: project.longDescription || '',
                coverImage: project.coverImage,
                gallery: project.gallery || [],
                techStack: project.techStack.join(', '),
                challenges: project.challenges || '',
                solutions: project.solutions || '',
                videoUrl: project.videoUrl || '',
                githubUrl: project.githubUrl || '',
                liveUrl: project.liveUrl || '',
                isFeatured: project.isFeatured,
                category: project.category || ''
            });
        } else {
            setEditingProject(null);
            setFormData({
                title: '',
                slug: '',
                description: '',
                longDescription: '',
                coverImage: '',
                gallery: [],
                techStack: '',
                challenges: '',
                solutions: '',
                videoUrl: '',
                githubUrl: '',
                liveUrl: '',
                isFeatured: false,
                category: ''
            });
        }
        setShowPreview(false);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProject(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'title' && !editingProject) {
            const slug = value.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            setFormData(prev => ({ ...prev, title: value, slug }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
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
            setFormData(prev => ({ ...prev, coverImage: res.data.url }));
        } catch (err) {
            console.error('Error uploading image:', err);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleGalleryUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setGalleryUploading(true);
        try {
            const uploadPromises = files.map(file => {
                const formData = new FormData();
                formData.append('file', file);
                return uploadFile(formData, user.token);
            });
            const responses = await Promise.all(uploadPromises);
            const urls = responses.map(res => res.data.url);
            setFormData(prev => ({ ...prev, gallery: [...(prev.gallery || []), ...urls] }));
        } catch (err) {
            console.error('Error uploading gallery:', err);
            alert('Failed to upload gallery images');
        } finally {
            setGalleryUploading(false);
        }
    };

    const removeGalleryImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            gallery: prev.gallery.filter((_, index) => index !== indexToRemove)
        }));
    };

    const insertMarkdown = (type) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = formData.longDescription; // Using longDescription for Markdown
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

        setFormData(prev => ({ ...prev, longDescription: newText }));

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + cursorOffset, start + cursorOffset + (selection.length || 4));
        }, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        const projectData = {
            ...formData,
            techStack: formData.techStack.split(',').map(item => item.trim()).filter(Boolean)
        };

        try {
            if (editingProject) {
                const res = await updateProject(editingProject._id, projectData, user.token);
                setProjects(prev => prev.map(p => p._id === editingProject._id ? res.data : p));
            } else {
                const res = await createProject(projectData, user.token);
                setProjects(prev => [res.data, ...prev]);
            }
            handleCloseModal();
        } catch (err) {
            console.error('Error saving project:', err);
            alert('Failed to save project');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteClick = (project) => {
        setProjectToDelete(project);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!projectToDelete) return;

        try {
            await deleteProject(projectToDelete._id, user.token);
            setProjects(prev => prev.filter(p => p._id !== projectToDelete._id));
            setDeleteModalOpen(false);
            setProjectToDelete(null);
        } catch (err) {
            console.error('Error deleting project:', err);
            alert('Failed to delete project');
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h1 className="text-2xl font-bold">Projects Management</h1>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-64"
                        />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
                    >
                        <PlusCircle size={20} className="mr-2" />
                        Add Project
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <div key={project._id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                            <div className="aspect-video relative overflow-hidden bg-slate-100 dark:bg-slate-900">
                                <img
                                    src={project.coverImage || '/placeholder-project.jpg'}
                                    alt={project.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {project.isFeatured && (
                                    <div className="absolute top-3 left-3 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg">
                                        Featured
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleOpenModal(project)}
                                        className="p-2 bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 rounded-lg hover:text-primary transition-colors shadow-sm backdrop-blur-sm"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(project)}
                                        className="p-2 bg-white/90 dark:bg-slate-800/90 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm backdrop-blur-sm"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg line-clamp-1">{project.title}</h3>
                                    <span className="text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400 capitalize">
                                        {project.category || 'Portfolio'}
                                    </span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4 h-10">
                                    {project.description}
                                </p>
                                <div className="flex gap-2">
                                    {project.githubUrl && (
                                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-colors">
                                            <Github size={18} />
                                        </a>
                                    )}
                                    {project.liveUrl && (
                                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-colors">
                                            <ExternalLink size={18} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit/Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCloseModal} />
                    <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 h-full shadow-2xl overflow-y-auto transform transition-transform animate-in slide-in-from-right duration-300">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
                            <h2 className="text-xl font-bold">{editingProject ? 'Edit Project' : 'New Project'}</h2>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowPreview(!showPreview)}
                                    className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors ${showPreview ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                >
                                    {showPreview ? 'Edit' : 'Preview'}
                                </button>
                                <button onClick={handleCloseModal} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {showPreview ? (
                                <div className="prose dark:prose-invert max-w-none">
                                    <h1>{formData.title}</h1>
                                    <img src={formData.coverImage} alt={formData.title} className="w-full rounded-xl max-h-96 object-cover mb-4" />
                                    <p className="lead">{formData.description}</p>

                                    <h3>Project Details</h3>
                                    <ReactMarkdown>{formData.longDescription}</ReactMarkdown>

                                    {/* Gallery Preview */}
                                    {formData.gallery?.length > 0 && (
                                        <div className="my-8">
                                            <h3>Gallery</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {formData.gallery.map((img, idx) => (
                                                    <img key={idx} src={img} alt={`Gallery ${idx}`} className="rounded-lg object-cover h-40 w-full" />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Video Preview */}
                                    {formData.videoUrl && (
                                        <div className="my-8">
                                            <h3>Video Demo</h3>
                                            <a href={formData.videoUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">{formData.videoUrl}</a>
                                        </div>
                                    )}

                                    {/* Challenges & Solutions */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                                        <div>
                                            <h3>Challenges</h3>
                                            <p>{formData.challenges}</p>
                                        </div>
                                        <div>
                                            <h3>Solutions</h3>
                                            <p>{formData.solutions}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Basic Info */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-2">Basic Info</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold mb-2">Title</label>
                                                <input
                                                    type="text"
                                                    name="title"
                                                    value={formData.title}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                                                    placeholder="Project Title"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2">Slug</label>
                                                <input
                                                    type="text"
                                                    name="slug"
                                                    value={formData.slug}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                                                    placeholder="project-slug"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold mb-2">Category</label>
                                            <input
                                                type="text"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                                                placeholder="e.g. Web App, Mobile App, AI"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold mb-2">Short Description</label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                required
                                                rows="3"
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                                                placeholder="Brief summary for the card view..."
                                            />
                                        </div>
                                    </div>

                                    {/* Media */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-2">Media</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold mb-2">Cover Image</label>
                                                <div className="flex items-center gap-4">
                                                    <div className="h-32 w-48 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 flex items-center justify-center relative">
                                                        {formData.coverImage ? (
                                                            <img src={formData.coverImage} alt="Cover" className="h-full w-full object-cover" />
                                                        ) : (
                                                            <ImageIcon className="text-slate-400" size={32} />
                                                        )}
                                                        {uploading && (
                                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                                <Loader className="animate-spin text-white" size={24} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleImageUpload}
                                                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                                        />
                                                        <p className="text-xs text-slate-500 mt-2">Required. 1280x720px.</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold mb-2">Video URL (Optional)</label>
                                                <div className="relative">
                                                    <Video className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                                    <input
                                                        type="url"
                                                        name="videoUrl"
                                                        value={formData.videoUrl}
                                                        onChange={handleInputChange}
                                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                                                        placeholder="https://youtube.com/..."
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold mb-2">Gallery Images</label>
                                            <div className="mb-4 flex flex-wrap gap-4">
                                                {formData.gallery?.map((img, idx) => (
                                                    <div key={idx} className="relative h-24 w-24 rounded-lg overflow-hidden group">
                                                        <img src={img} alt={`Gallery ${idx}`} className="h-full w-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeGalleryImage(idx)}
                                                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>
                                                ))}
                                                <label className="h-24 w-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                                                    {galleryUploading ? (
                                                        <Loader className="animate-spin text-primary" size={24} />
                                                    ) : (
                                                        <>
                                                            <PlusCircle className="text-slate-400 mb-1" size={24} />
                                                            <span className="text-xs text-slate-500 font-bold">Add</span>
                                                        </>
                                                    )}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={handleGalleryUpload}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detailed Content */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Long Description (Markdown)</h3>
                                            <div className="flex gap-1">
                                                <button type="button" onClick={() => insertMarkdown('bold')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500" title="Bold">
                                                    <Bold size={18} />
                                                </button>
                                                <button type="button" onClick={() => insertMarkdown('italic')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500" title="Italic">
                                                    <Italic size={18} />
                                                </button>
                                                <button type="button" onClick={() => insertMarkdown('h1')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500" title="Heading 1">
                                                    <Heading size={18} />
                                                </button>
                                                <button type="button" onClick={() => insertMarkdown('list')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500" title="List">
                                                    <List size={18} />
                                                </button>
                                                <button type="button" onClick={() => insertMarkdown('link')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500" title="Link">
                                                    <LinkIcon size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <textarea
                                                ref={textareaRef}
                                                name="longDescription"
                                                value={formData.longDescription}
                                                onChange={handleInputChange}
                                                rows="12"
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all font-mono text-sm leading-relaxed"
                                                placeholder="# Detailed Project Overview&#10;&#10;Explain the architecture, design decisions, and features..."
                                            />
                                        </div>
                                    </div>

                                    {/* Tech & URLs */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-2">Additional Details</h3>

                                        <div>
                                            <label className="block text-sm font-bold mb-2">Tech Stack (comma separated)</label>
                                            <input
                                                type="text"
                                                name="techStack"
                                                value={formData.techStack}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                                                placeholder="React, Node.js, MongoDB..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold mb-2">GitHub URL</label>
                                                <input
                                                    type="url"
                                                    name="githubUrl"
                                                    value={formData.githubUrl}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                                                    placeholder="https://github.com/..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2">Live URL</label>
                                                <input
                                                    type="url"
                                                    name="liveUrl"
                                                    value={formData.liveUrl}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold mb-2">Challenges</label>
                                            <textarea
                                                name="challenges"
                                                value={formData.challenges}
                                                onChange={handleInputChange}
                                                rows="3"
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                                                placeholder="What challenges did you face?"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold mb-2">Solutions</label>
                                            <textarea
                                                name="solutions"
                                                value={formData.solutions}
                                                onChange={handleInputChange}
                                                rows="3"
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                                                placeholder="How did you solve them?"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pt-4">
                                        <input
                                            type="checkbox"
                                            id="isFeatured"
                                            name="isFeatured"
                                            checked={formData.isFeatured}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 rounded text-primary focus:ring-primary"
                                        />
                                        <label htmlFor="isFeatured" className="font-bold">Feature this project on homepage</label>
                                    </div>
                                </>
                            )}

                            <div className="pt-6 pb-20 sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent dark:from-slate-900 dark:via-slate-900 flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-6 py-3 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex items-center"
                                >
                                    {formLoading ? <Loader size={20} className="animate-spin mr-2" /> : <Save size={20} className="mr-2" />}
                                    {editingProject ? 'Update Project' : 'Create Project'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Project?"
                message={`Are you sure you want to delete "${projectToDelete?.title}"? This action cannot be undone.`}
            />
        </div>
    );
};

export default ProjectsAdmin;
