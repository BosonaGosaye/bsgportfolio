import { useState, useEffect } from 'react';
import {
    PlusCircle,
    Edit2,
    Trash2,
    Briefcase,
    GraduationCap,
    Award,
    Save,
    X,
    Loader,
    Upload,
    FileText,
    Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
    getExperience, createExperience, updateExperience, deleteExperience,
    getEducation, createEducation, updateEducation, deleteEducation,
    getCertifications, createCertification, updateCertification, deleteCertification,
    uploadFile
} from '../../services/api';
import ConfirmationModal from '../../components/ConfirmationModal';

const AboutAdmin = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('experience');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    // Initial Form States
    const initialExperience = { position: '', company: '', startDate: '', endDate: '', description: '', current: false };
    const initialEducation = { degree: '', institution: '', startDate: '', endDate: '', description: '', current: false };
    const initialCertification = { name: '', issuer: '', date: '', url: '', status: 'Active', certificateFile: '', certificateFileType: 'image' };

    const [formData, setFormData] = useState({});
    const [certificateFile, setCertificateFile] = useState(null);
    const [certificatePreview, setCertificatePreview] = useState(null);
    const [uploadingFile, setUploadingFile] = useState(false);

    useEffect(() => {
        fetchData();
        // Reset form data when switching tabs logic handled in handleTabChange if needed
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            let res;
            if (activeTab === 'experience') res = await getExperience();
            else if (activeTab === 'education') res = await getEducation();
            else if (activeTab === 'certifications') res = await getCertifications();
            setData(res?.data || []);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setEditingItem(null);
        setIsModalOpen(false);
    };

    const handleOpenModal = (item = null) => {
        setEditingItem(item);
        if (item) {
            // Format dates for input fields (YYYY-MM-DD)
            const formattedItem = { ...item };
            if (formattedItem.startDate) formattedItem.startDate = formattedItem.startDate.split('T')[0];
            if (formattedItem.endDate) formattedItem.endDate = formattedItem.endDate.split('T')[0];
            if (formattedItem.date) formattedItem.date = formattedItem.date.split('T')[0];
            setFormData(formattedItem);
            
            // Set certificate preview if editing
            if (activeTab === 'certifications' && formattedItem.certificateFile) {
                setCertificatePreview(formattedItem.certificateFile);
            }
        } else {
            if (activeTab === 'experience') setFormData(initialExperience);
            else if (activeTab === 'education') setFormData(initialEducation);
            else if (activeTab === 'certifications') setFormData(initialCertification);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setCertificateFile(null);
        setCertificatePreview(null);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type (images and PDFs only)
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
            if (!validTypes.includes(file.type)) {
                alert('Please upload an image (JPEG, PNG, WebP) or PDF file');
                return;
            }
            
            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('File size must be less than 10MB');
                return;
            }
            
            setCertificateFile(file);
            
            // Create preview
            if (file.type === 'application/pdf') {
                setCertificatePreview(URL.createObjectURL(file));
            } else {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setCertificatePreview(reader.result);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            let res;
            const isEdit = !!editingItem;
            let updatedFormData = { ...formData };

            // Upload certificate file if present
            if (activeTab === 'certifications' && certificateFile) {
                setUploadingFile(true);
                try {
                    const formData = new FormData();
                    formData.append('file', certificateFile);
                    
                    const uploadRes = await uploadFile(formData, user.token);
                    updatedFormData.certificateFile = uploadRes.data.url;
                    
                    // Determine file type
                    const fileType = certificateFile.type;
                    if (fileType === 'application/pdf') {
                        updatedFormData.certificateFileType = 'pdf';
                    } else {
                        updatedFormData.certificateFileType = 'image';
                    }
                } catch (uploadErr) {
                    console.error('Error uploading certificate file:', uploadErr);
                    alert('Failed to upload certificate file');
                    setFormLoading(false);
                    setUploadingFile(false);
                    return;
                }
                setUploadingFile(false);
            }

            if (activeTab === 'experience') {
                if (isEdit) res = await updateExperience(editingItem._id, updatedFormData, user.token);
                else res = await createExperience(updatedFormData, user.token);
            } else if (activeTab === 'education') {
                if (isEdit) res = await updateEducation(editingItem._id, updatedFormData, user.token);
                else res = await createEducation(updatedFormData, user.token);
            } else if (activeTab === 'certifications') {
                if (isEdit) res = await updateCertification(editingItem._id, updatedFormData, user.token);
                else res = await createCertification(updatedFormData, user.token);
            }

            // Update item in list or add new
            if (isEdit) {
                setData(prev => prev.map(item => item._id === editingItem._id ? res.data : item));
            } else {
                setData(prev => [res.data, ...prev]);
            }
            handleCloseModal();
        } catch (err) {
            console.error('Error saving data:', err);
            alert('Failed to save data');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            if (activeTab === 'experience') await deleteExperience(itemToDelete._id, user.token);
            else if (activeTab === 'education') await deleteEducation(itemToDelete._id, user.token);
            else if (activeTab === 'certifications') await deleteCertification(itemToDelete._id, user.token);

            setData(prev => prev.filter(item => item._id !== itemToDelete._id));
            setDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (err) {
            console.error('Error deleting item:', err);
            alert('Failed to delete item');
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h1 className="text-2xl font-bold">About & Resume</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
                >
                    <PlusCircle size={20} className="mr-2" />
                    Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-slate-200 dark:border-slate-700 overflow-x-auto pb-1">
                <button
                    onClick={() => handleTabChange('experience')}
                    className={`flex items-center px-4 py-2 font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === 'experience' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                    <Briefcase size={18} className="mr-2" />
                    Experience
                </button>
                <button
                    onClick={() => handleTabChange('education')}
                    className={`flex items-center px-4 py-2 font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === 'education' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                    <GraduationCap size={18} className="mr-2" />
                    Education
                </button>
                <button
                    onClick={() => handleTabChange('certifications')}
                    className={`flex items-center px-4 py-2 font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === 'certifications' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                    <Award size={18} className="mr-2" />
                    Certifications
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="grid gap-4">
                    {data.length === 0 && (
                        <div className="text-center py-10 text-slate-500">
                            No {activeTab} records found.
                        </div>
                    )}
                    {data.map((item) => (
                        <div key={item._id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex justify-between items-start group">
                            <div>
                                <h3 className="font-bold text-lg">{item.position || item.degree || item.name}</h3>
                                <p className="text-primary font-bold">{item.company || item.institution || item.issuer}</p>
                                <p className="text-sm text-slate-500">
                                    {item.startDate && new Date(item.startDate).getFullYear()}
                                    {item.endDate ? ` - ${new Date(item.endDate).getFullYear()}` : item.current ? ' - Present' : ''}
                                    {item.date && new Date(item.date).getFullYear()}
                                </p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleOpenModal(item)}
                                    className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:text-primary transition-colors"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(item)}
                                    className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCloseModal} />
                    <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                            <h2 className="text-xl font-bold">
                                {editingItem ? 'Edit' : 'Add'} {activeTab === 'experience' ? 'Experience' : activeTab === 'education' ? 'Education' : 'Certification'}
                            </h2>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {activeTab !== 'certifications' ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-bold mb-2">{activeTab === 'experience' ? 'Position' : 'Degree'}</label>
                                        <input
                                            type="text"
                                            name={activeTab === 'experience' ? 'position' : 'degree'}
                                            value={activeTab === 'experience' ? formData.position : formData.degree}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2">{activeTab === 'experience' ? 'Company' : 'Institution'}</label>
                                        <input
                                            type="text"
                                            name={activeTab === 'experience' ? 'company' : 'institution'}
                                            value={activeTab === 'experience' ? formData.company : formData.institution}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Start Date</label>
                                            <input
                                                type="date"
                                                name="startDate"
                                                value={formData.startDate}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2">End Date</label>
                                            <input
                                                type="date"
                                                name="endDate"
                                                value={formData.endDate || ''}
                                                onChange={handleInputChange}
                                                disabled={formData.current}
                                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none disabled:opacity-50"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="current"
                                            name="current"
                                            checked={formData.current}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 rounded text-primary focus:ring-primary"
                                        />
                                        <label htmlFor="current" className="text-sm font-bold">I currently work/study here</label>
                                    </div>

                                    {activeTab === 'experience' && (
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Description</label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                rows="4"
                                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none resize-none"
                                            />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Certificate Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Issuer</label>
                                        <input
                                            type="text"
                                            name="issuer"
                                            value={formData.issuer}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Date</label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2">URL (Optional)</label>
                                        <input
                                            type="url"
                                            name="url"
                                            value={formData.url || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Status</label>
                                        <select
                                            name="status"
                                            value={formData.status || 'Active'}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Expired">Expired</option>
                                            <option value="In Progress">In Progress</option>
                                        </select>
                                    </div>
                                    
                                    {/* Certificate File Upload */}
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Certificate File (Image or PDF)</label>
                                        <div className="space-y-3">
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                                                onChange={handleFileChange}
                                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                                            />
                                            <p className="text-xs text-slate-500">Upload certificate image (JPEG, PNG, WebP) or PDF. Max size: 10MB</p>
                                            
                                            {/* Preview */}
                                            {certificatePreview && (
                                                <div className="relative mt-3 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Preview:</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setCertificateFile(null);
                                                                setCertificatePreview(null);
                                                            }}
                                                            className="text-red-500 hover:text-red-700 transition-colors"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                    {certificateFile?.type === 'application/pdf' || formData.certificateFileType === 'pdf' ? (
                                                        <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg">
                                                            <FileText size={32} className="text-red-500" />
                                                            <div>
                                                                <p className="text-sm font-semibold">PDF Document</p>
                                                                <p className="text-xs text-slate-500">{certificateFile?.name || 'Existing PDF'}</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <img
                                                            src={certificatePreview}
                                                            alt="Certificate preview"
                                                            className="w-full h-48 object-contain rounded-lg bg-white dark:bg-slate-900"
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading || uploadingFile}
                                    className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {uploadingFile ? (
                                        <>
                                            <Upload size={18} className="animate-bounce mr-2" />
                                            Uploading...
                                        </>
                                    ) : formLoading ? (
                                        <>
                                            <Loader size={18} className="animate-spin mr-2" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} className="mr-2" />
                                            Save
                                        </>
                                    )}
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
                title="Delete Item?"
                message="Are you sure you want to delete this item? This action cannot be undone."
            />
        </div>
    );
};

export default AboutAdmin;
