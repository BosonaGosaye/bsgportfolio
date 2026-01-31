import { useState, useEffect } from 'react';
import {
    PlusCircle,
    Search,
    Edit2,
    Trash2,
    X,
    Save,
    Loader,
    Code2,
    Database,
    Wrench,
    Palette,
    Terminal
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getSkills, createSkill, updateSkill, deleteSkill } from '../../services/api';
import ConfirmationModal from '../../components/ConfirmationModal';

const SkillsAdmin = () => {
    const { user } = useAuth();
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);
    const [showPercentage, setShowPercentage] = useState(true);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [skillToDelete, setSkillToDelete] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        category: 'Frontend',
        percentage: 80,
        icon: ''
    });

    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            setLoading(true);
            const res = await getSkills();
            setSkills(res.data);
        } catch (err) {
            console.error('Error fetching skills:', err);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['Frontend', 'Backend', 'Mobile Application', 'Tools & Technologies', 'Database & Cloud', 'DevOps & Deployment', 'Testing & Debugging', 'Design', 'Soft Skills', 'Other'];

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredSkills = skills.filter(skill =>
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenModal = (skill = null) => {
        if (skill) {
            setEditingSkill(skill);
            const hasPercentage = skill.percentage !== undefined && skill.percentage !== null;
            setShowPercentage(hasPercentage);
            setFormData({
                name: skill.name,
                category: skill.category,
                percentage: hasPercentage ? skill.percentage : 80,
                icon: skill.icon || ''
            });
        } else {
            setEditingSkill(null);
            setShowPercentage(true);
            setFormData({
                name: '',
                category: 'Frontend',
                percentage: 80,
                icon: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSkill(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'percentage' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        const dataToSubmit = {
            ...formData,
            percentage: showPercentage ? formData.percentage : null
        };

        try {
            if (editingSkill) {
                const res = await updateSkill(editingSkill._id, dataToSubmit, user.token);
                setSkills(prev => prev.map(s => s._id === editingSkill._id ? res.data : s));
            } else {
                const res = await createSkill(dataToSubmit, user.token);
                setSkills(prev => [...prev, res.data]);
            }
            handleCloseModal();
        } catch (err) {
            console.error('Error saving skill:', err);
            alert('Failed to save skill');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteClick = (skill) => {
        setSkillToDelete(skill);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!skillToDelete) return;

        try {
            await deleteSkill(skillToDelete._id, user.token);
            setSkills(prev => prev.filter(s => s._id !== skillToDelete._id));
            setDeleteModalOpen(false);
            setSkillToDelete(null);
        } catch (err) {
            console.error('Error deleting skill:', err);
            alert('Failed to delete skill');
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Frontend': return <Code2 size={24} className="text-blue-500" />;
            case 'Backend': return <Database size={24} className="text-emerald-500" />;
            case 'Tools': return <Wrench size={24} className="text-amber-500" />;
            case 'Design': return <Palette size={24} className="text-purple-500" />;
            default: return <Terminal size={24} className="text-slate-500" />;
        }
    };

    const groupedSkills = categories.reduce((acc, category) => {
        const categorySkills = filteredSkills.filter(s => s.category === category);
        if (categorySkills.length > 0) {
            acc[category] = categorySkills;
        }
        return acc;
    }, {});

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h1 className="text-2xl font-bold">Skills Management</h1>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search skills..."
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
                        Add Skill
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                        <div key={category} className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                {getCategoryIcon(category)}
                                {category}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {categorySkills.map((skill) => (
                                    <div key={skill._id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            {skill.icon && <img src={skill.icon} alt="" className="w-8 h-8 object-contain" />}
                                            <div>
                                                <h3 className="font-bold">{skill.name}</h3>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{skill.percentage}% Proficiency</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleOpenModal(skill)}
                                                className="p-2 text-slate-400 hover:text-primary transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(skill)}
                                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {filteredSkills.length === 0 && (
                        <div className="text-center py-20 text-slate-500">
                            No skills found matching your search.
                        </div>
                    )}
                </div>
            )}

            {/* Edit/Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold">{editingSkill ? 'Edit Skill' : 'New Skill'}</h2>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-2">Skill Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                                    placeholder="e.g. React"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all appearance-none cursor-pointer"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-bold">Proficiency</label>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={showPercentage}
                                            onChange={(e) => setShowPercentage(e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                        <span className="ml-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                                            {showPercentage ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </label>
                                </div>
                                {showPercentage && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold text-slate-500">
                                            <span>Beginner</span>
                                            <span>{formData.percentage}%</span>
                                            <span>Expert</span>
                                        </div>
                                        <input
                                            type="range"
                                            name="percentage"
                                            min="0"
                                            max="100"
                                            value={formData.percentage}
                                            onChange={handleInputChange}
                                            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">Icon URL (optional)</label>
                                <input
                                    type="text"
                                    name="icon"
                                    value={formData.icon}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="px-6 py-2 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex items-center"
                                >
                                    {formLoading ? <Loader size={18} className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
                                    Save
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
                title="Delete Skill?"
                message={`Are you sure you want to delete "${skillToDelete?.name}"? This action cannot be undone.`}
            />
        </div>
    );
};

export default SkillsAdmin;
