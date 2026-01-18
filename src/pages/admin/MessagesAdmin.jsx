import { useState, useEffect } from 'react';
import {
    Trash2,
    Search,
    Mail,
    Clock,
    CheckCircle,
    X,
    Loader,
    MessageSquare,
    Phone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getMessages, deleteMessage, updateMessageStatus } from '../../services/api';
import ConfirmationModal from '../../components/ConfirmationModal';

const MessagesAdmin = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Selected Message
    const [selectedMessage, setSelectedMessage] = useState(null);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const res = await getMessages(user.token);
            setMessages(res.data);
        } catch (err) {
            console.error('Error fetching messages:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredMessages = messages.filter(msg =>
        msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDeleteClick = (msg, e) => {
        e.stopPropagation();
        setMessageToDelete(msg);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!messageToDelete) return;

        try {
            await deleteMessage(messageToDelete._id, user.token);
            setMessages(prev => prev.filter(m => m._id !== messageToDelete._id));
            if (selectedMessage?._id === messageToDelete._id) {
                setSelectedMessage(null);
            }
            setDeleteModalOpen(false);
            setMessageToDelete(null);
        } catch (err) {
            console.error('Error deleting message:', err);
            alert('Failed to delete message');
        }
    };

    const handleViewMessage = (msg) => {
        setSelectedMessage(msg);
        // You could mark as read here if you had an 'isRead' field
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold">Messages</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-64"
                    />
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                {/* Messages List */}
                <div className={`w-full md:w-1/3 lg:w-96 border-r border-slate-200 dark:border-slate-700 flex flex-col ${selectedMessage ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                        <h2 className="font-bold text-sm text-slate-500 uppercase tracking-wider">Inbox ({filteredMessages.length})</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {loading ? (
                            <div className="flex justify-center p-8">
                                <Loader className="animate-spin text-primary" />
                            </div>
                        ) : filteredMessages.length === 0 ? (
                            <div className="text-center p-8 text-slate-500">
                                No messages found.
                            </div>
                        ) : (
                            filteredMessages.map((msg) => (
                                <div
                                    key={msg._id}
                                    onClick={() => handleViewMessage(msg)}
                                    className={`p-4 rounded-xl cursor-pointer transition-all hover:bg-slate-100 dark:hover:bg-slate-700 ${selectedMessage?._id === msg._id
                                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                                        : 'border border-transparent'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className={`font-bold truncate pr-2 ${selectedMessage?._id === msg._id ? 'text-primary' : ''}`}>
                                            {msg.name}
                                        </h3>
                                        <span className="text-xs text-slate-400 whitespace-nowrap">
                                            {new Date(msg.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate mb-1">
                                        {msg.subject}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                                        {msg.message}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Message Detail */}
                <div className={`flex-1 flex flex-col ${!selectedMessage ? 'hidden md:flex' : 'flex'}`}>
                    {selectedMessage ? (
                        <div className="flex-1 flex flex-col h-full overflow-hidden">
                            {/* Header */}
                            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-start">
                                <div>
                                    <button
                                        onClick={() => setSelectedMessage(null)}
                                        className="md:hidden mb-4 flex items-center text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                                    >
                                        ← Back to inbox
                                    </button>
                                    <h2 className="text-2xl font-bold mb-2">{selectedMessage.subject}</h2>
                                    <div className="flex flex-col gap-2 text-sm text-slate-500">
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                                                <UserIcon name={selectedMessage.name} />
                                                {selectedMessage.name}
                                            </span>
                                            <span>&lt;{selectedMessage.email}&gt;</span>
                                        </div>
                                        {selectedMessage.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone size={14} className="text-slate-400" />
                                                <span className="font-medium text-slate-600 dark:text-slate-400">{selectedMessage.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <a
                                        href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors border border-blue-200 dark:border-blue-800"
                                        title="Reply via Email"
                                    >
                                        <Mail size={20} />
                                    </a>
                                    <button
                                        onClick={(e) => handleDeleteClick(selectedMessage, e)}
                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-red-200 dark:border-red-800"
                                        title="Delete Message"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-8">
                                <div className="prose dark:prose-invert max-w-none">
                                    <p className="whitespace-pre-wrap font-sans text-base leading-relaxed text-slate-700 dark:text-slate-300">
                                        {selectedMessage.message}
                                    </p>
                                </div>
                            </div>

                            {/* Footer Info */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex items-center justify-between">
                                <span className="flex items-center gap-1">
                                    <Clock size={14} />
                                    Sent on {new Date(selectedMessage.createdAt).toLocaleString()}
                                </span>
                                <span className="uppercase tracking-wider font-bold">ID: {selectedMessage._id}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <MessageSquare size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-600 dark:text-slate-300">Select a message to view</h3>
                            <p className="text-sm">Choose a message from the list to see details.</p>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Message?"
                message={`Are you sure you want to delete this message from "${messageToDelete?.name}"? This action cannot be undone.`}
            />
        </div>
    );
};

// Helper component for user avatar
const UserIcon = ({ name }) => (
    <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold mr-1">
        {name.charAt(0)}
    </div>
);

export default MessagesAdmin;
