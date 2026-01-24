import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Save, Star, GripVertical } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getServices, createService, updateService, deleteService } from '../../services/api';

const ServicesAdmin = () => {
    const { user } = useAuth();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        icon: 'Briefcase',
        features: [''],
        price: '',
        duration: '',
        featured: false,
        order: 0
    });
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Popular Lucide icons for services
    const popularIcons = [
        'Briefcase', 'Code', 'Smartphone', 'Globe', 'Palette', 'Database',
        'Cloud', 'Cpu', 'Layout', 'Zap', 'Settings', 'Shield',
        'Rocket', 'Target', 'TrendingUp', 'Users', 'Package', 'Server'
    ];

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await getServices();
            const servicesData = response.data?.data || response.data || [];
            setServices(Array.isArray(servicesData) ? servicesData : []);
        } catch (error) {
            console.error('Error fetching services:', error);
            showNotification('Failed to load services', 'error');
            setServices([]);
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    };

    const handleOpenModal = (service = null) => {
        if (service) {
            setEditingService(service);
            setFormData({
                title: service.title,
                description: service.description,
                icon: service.icon,
                features: service.features.length > 0 ? service.features : [''],
                price: service.price || '',
                duration: service.duration || '',
                featured: service.featured,
                order: service.order
            });
        } else {
            setEditingService(null);
            setFormData({
                title: '',
                description: '',
                icon: 'Briefcase',
                features: [''],
                price: '',
                duration: '',
                featured: false,
                order: services.length
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingService(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const addFeature = () => {
        setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
    };

    const removeFeature = (index) => {
        if (formData.features.length > 1) {
            const newFeatures = formData.features.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, features: newFeatures }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = user?.token;

        // Filter out empty features
        const cleanedData = {
            ...formData,
            features: formData.features.filter(f => f.trim() !== '')
        };

        try {
            if (editingService) {
                await updateService(editingService._id, cleanedData, token);
                showNotification('Service updated successfully!');
            } else {
                await createService(cleanedData, token);
                showNotification('Service created successfully!');
            }
            handleCloseModal();
            fetchServices();
        } catch (error) {
            console.error('Error saving service:', error);
            showNotification('Failed to save service', 'error');
        }
    };

    const handleDelete = async (id) => {
        const token = user?.token;
        try {
            await deleteService(id, token);
            showNotification('Service deleted successfully!');
            setDeleteConfirm(null);
            fetchServices();
        } catch (error) {
            console.error('Error deleting service:', error);
            showNotification('Failed to delete service', 'error');
        }
    };

    const IconPreview = ({ iconName }) => {
        const IconComponent = Icons[iconName] || Icons.Briefcase;
        return <IconComponent className="w-6 h-6" />;
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Services Management
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Manage your professional services and offerings
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg hover:shadow-lg transition-all hover:scale-105"
                >
                    <Plus size={20} />
                    Add Service
                </button>
            </div>

            {/* Notification */}
            <AnimatePresence>
                {notification.show && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`mb-6 p-4 rounded-lg ${notification.type === 'error'
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : 'bg-green-100 text-green-700 border border-green-200'
                            }`}
                    >
                        {notification.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Services Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                    ))}
                </div>
            ) : services.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-slate-500 text-lg mb-4">No services yet</p>
                    <button
                        onClick={() => handleOpenModal()}
                        className="text-primary hover:underline"
                    >
                        Create your first service
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <motion.div
                            key={service._id}
                            layout
                            className="relative bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow"
                        >
                            {/* Featured Badge */}
                            {service.featured && (
                                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-current" />
                                    Featured
                                </div>
                            )}

                            {/* Icon */}
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                                <IconPreview iconName={service.icon} />
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                                {service.description}
                            </p>

                            {/* Features Count */}
                            {service.features && service.features.length > 0 && (
                                <p className="text-xs text-slate-500 mb-4">
                                    {service.features.length} feature{service.features.length !== 1 ? 's' : ''}
                                </p>
                            )}

                            {/* Price & Duration */}
                            <div className="flex gap-2 mb-4 text-xs">
                                {service.price && (
                                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                                        {service.price}
                                    </span>
                                )}
                                {service.duration && (
                                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
                                        {service.duration}
                                    </span>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <button
                                    onClick={() => handleOpenModal(service)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    <Edit size={16} />
                                    Edit
                                </button>
                                <button
                                    onClick={() => setDeleteConfirm(service._id)}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={handleCloseModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 flex justify-between items-center z-10">
                                <h2 className="text-2xl font-bold">
                                    {editingService ? 'Edit Service' : 'Create New Service'}
                                </h2>
                                <button
                                    onClick={handleCloseModal}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        Service Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-slate-700"
                                        placeholder="e.g., Web Development"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        rows={4}
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-slate-700"
                                        placeholder="Describe your service..."
                                    />
                                </div>

                                {/* Icon Selector */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        Icon *
                                    </label>
                                    <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
                                        {popularIcons.map((iconName) => {
                                            const IconComponent = Icons[iconName];
                                            return (
                                                <button
                                                    key={iconName}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, icon: iconName }))}
                                                    className={`p-3 rounded-lg border-2 transition-all hover:scale-110 ${formData.icon === iconName
                                                        ? 'border-primary bg-primary/10 text-primary'
                                                        : 'border-slate-300 dark:border-slate-600 hover:border-primary'
                                                        }`}
                                                    title={iconName}
                                                >
                                                    <IconComponent className="w-6 h-6 mx-auto" />
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">Selected: {formData.icon}</p>
                                </div>

                                {/* Features */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        Features
                                    </label>
                                    <div className="space-y-2">
                                        {formData.features.map((feature, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={feature}
                                                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                                                    className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-slate-700"
                                                    placeholder={`Feature ${index + 1}`}
                                                />
                                                {formData.features.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFeature(index)}
                                                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                                    >
                                                        <X size={20} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addFeature}
                                        className="mt-2 text-primary hover:underline text-sm"
                                    >
                                        + Add Feature
                                    </button>
                                </div>

                                {/* Price and Duration */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">
                                            Price (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-slate-700"
                                            placeholder="e.g., Starting at 5000 ETB"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">
                                            Duration (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-slate-700"
                                            placeholder="e.g., 2-4 weeks"
                                        />
                                    </div>
                                </div>

                                {/* Featured and Order */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            name="featured"
                                            id="featured"
                                            checked={formData.featured}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 text-primary focus:ring-primary rounded"
                                        />
                                        <label htmlFor="featured" className="text-sm font-semibold cursor-pointer">
                                            Featured Service
                                        </label>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">
                                            Display Order
                                        </label>
                                        <input
                                            type="number"
                                            name="order"
                                            value={formData.order}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-slate-700"
                                            min="0"
                                        />
                                    </div>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                                    >
                                        <Save size={20} />
                                        {editingService ? 'Update Service' : 'Create Service'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setDeleteConfirm(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6"
                        >
                            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                Are you sure you want to delete this service? This action cannot be undone.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ServicesAdmin;
