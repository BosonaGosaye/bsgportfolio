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
    Phone,
    Send,
    MailOpen,
    Reply,
    Inbox,
    Archive
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getMessages, deleteMessage, updateMessageStatus } from '../../services/api';
import ConfirmationModal from '../../components/ConfirmationModal';
import { motion, AnimatePresence } from 'framer-motion';

const MessagesAdmin = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('unread'); // unread, read, replied

    // Selected Message
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [sendingReply, setSendingReply] = useState(false);

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

    // Filter messages by tab and search
    const filteredMessages = messages
        .filter(msg => msg.status === activeTab)
        .filter(msg =>
            msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.subject.toLowerCase().includes(searchQuery.toLowerCase())
        );

    // Count messages by status
    const unreadCount = messages.filter(m => m.status === 'unread').length;
    const readCount = messages.filter(m => m.status === 'read').length;
    const repliedCount = messages.filter(m => m.status === 'replied').length;

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

    const handleViewMessage = async (msg) => {
        setSelectedMessage(msg);
        setShowReplyForm(false);
        setReplyText('');

        // Mark as read if unread
        if (msg.status === 'unread') {
            try {
                await updateMessageStatus(msg._id, 'read', user.token);
                setMessages(prev => prev.map(m =>
                    m._id === msg._id ? { ...m, status: 'read' } : m
                ));
            } catch (err) {
                console.error('Error updating message status:', err);
            }
        }
    };

    const handleSendReply = async () => {
        if (!replyText.trim() || !selectedMessage) return;

        setSendingReply(true);
        try {
            // Update message with reply
            const updatedData = {
                status: 'replied',
                reply: replyText,
                repliedAt: new Date()
            };
            
            await updateMessageStatus(selectedMessage._id, 'replied', user.token, updatedData);
            
            // Update local state
            setMessages(prev => prev.map(m =>
                m._id === selectedMessage._id
                    ? { ...m, ...updatedData }
                    : m
            ));
            
            setSelectedMessage({ ...selectedMessage, ...updatedData });
            
            // Open email client
            const mailtoLink = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}&body=${encodeURIComponent(replyText)}`;
            window.open(mailtoLink, '_blank');
            
            setShowReplyForm(false);
            setReplyText('');
        } catch (err) {
            console.error('Error sending reply:', err);
            alert('Failed to save reply');
        } finally {
            setSendingReply(false);
        }
    };

    const tabs = [
        { id: 'unread', label: 'Unread', icon: Inbox, count: unreadCount, color: 'text-blue-600' },
        { id: 'read', label: 'Read', icon: MailOpen, count: readCount, color: 'text-green-600' },
        { id: 'replied', label: 'Replied', icon: Reply, count: repliedCount, color: 'text-purple-600' }
    ];

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-black mb-2">Messages</h1>
                    <p className="text-sm text-slate-500">Manage and respond to contact form submissions</p>
                </div>
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

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setSelectedMessage(null);
                            }}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                                activeTab === tab.id
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                            }`}
                        >
                            <Icon size={18} />
                            <span>{tab.label}</span>
                            {tab.count > 0 && (
                                <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
                                    activeTab === tab.id
                                        ? 'bg-white/20 text-white'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                {/* Messages List */}
                <div className={`w-full md:w-1/3 lg:w-96 border-r border-slate-200 dark:border-slate-700 flex flex-col ${selectedMessage ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                        <h2 className="font-bold text-sm text-slate-500 uppercase tracking-wider">
                            {tabs.find(t => t.id === activeTab)?.label} ({filteredMessages.length})
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {loading ? (
                            <div className="flex justify-center p-8">
                                <Loader className="animate-spin text-primary" />
                            </div>
                        ) : filteredMessages.length === 0 ? (
                            <div className="text-center p-8 text-slate-500">
                                <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="font-semibold">No {activeTab} messages</p>
                                <p className="text-xs mt-1">Messages will appear here</p>
                            </div>
                        ) : (
                            filteredMessages.map((msg) => (
                                <motion.div
                                    key={msg._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={() => handleViewMessage(msg)}
                                    className={`p-4 rounded-xl cursor-pointer transition-all hover:bg-slate-100 dark:hover:bg-slate-700 relative ${
                                        selectedMessage?._id === msg._id
                                            ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800'
                                            : 'border-2 border-transparent'
                                    }`}
                                >
                                    {/* Status Indicator */}
                                    <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${
                                        msg.status === 'unread' ? 'bg-blue-500' :
                                        msg.status === 'read' ? 'bg-green-500' :
                                        'bg-purple-500'
                                    }`} />

                                    <div className="flex justify-between items-start mb-2 pr-4">
                                        <h3 className={`font-bold truncate ${selectedMessage?._id === msg._id ? 'text-primary' : ''}`}>
                                            {msg.name}
                                        </h3>
                                        <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                                            {new Date(msg.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate mb-1">
                                        {msg.subject}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                                        {msg.message}
                                    </p>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Message Detail */}
                <div className={`flex-1 flex flex-col ${!selectedMessage ? 'hidden md:flex' : 'flex'}`}>
                    {selectedMessage ? (
                        <div className="flex-1 flex flex-col h-full overflow-hidden">
                            {/* Header */}
                            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-start bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
                                <div className="flex-1">
                                    <button
                                        onClick={() => setSelectedMessage(null)}
                                        className="md:hidden mb-4 flex items-center text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                                    >
                                        ← Back to inbox
                                    </button>
                                    
                                    {/* Status Badge */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                                            selectedMessage.status === 'unread' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                            selectedMessage.status === 'read' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                            'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                        }`}>
                                            {selectedMessage.status}
                                        </span>
                                    </div>

                                    <h2 className="text-2xl font-black mb-3">{selectedMessage.subject}</h2>
                                    <div className="flex flex-col gap-2 text-sm">
                                        <div className="flex items-center gap-3">
                                            <UserIcon name={selectedMessage.name} />
                                            <span className="font-bold text-slate-700 dark:text-slate-300">{selectedMessage.name}</span>
                                            <span className="text-slate-500">&lt;{selectedMessage.email}&gt;</span>
                                        </div>
                                        {selectedMessage.phone && (
                                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                <Phone size={14} />
                                                <span className="font-medium">{selectedMessage.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {selectedMessage.status !== 'replied' && (
                                        <button
                                            onClick={() => setShowReplyForm(!showReplyForm)}
                                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors border border-primary/30"
                                            title="Reply"
                                        >
                                            <Reply size={20} />
                                        </button>
                                    )}
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
                                    <div className="mb-6">
                                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Message</h3>
                                        <p className="whitespace-pre-wrap font-sans text-base leading-relaxed text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                                            {selectedMessage.message}
                                        </p>
                                    </div>

                                    {/* Show existing reply if replied */}
                                    {selectedMessage.status === 'replied' && selectedMessage.reply && (
                                        <div className="mt-6">
                                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                                <Reply size={16} />
                                                Your Reply
                                            </h3>
                                            <p className="whitespace-pre-wrap font-sans text-base leading-relaxed text-slate-700 dark:text-slate-300 bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
                                                {selectedMessage.reply}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-2">
                                                Replied on {new Date(selectedMessage.repliedAt).toLocaleString()}
                                            </p>
                                        </div>
                                    )}

                                    {/* Reply Form */}
                                    <AnimatePresence>
                                        {showReplyForm && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mt-6"
                                            >
                                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Write Reply</h3>
                                                <textarea
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    placeholder="Type your reply here..."
                                                    rows="6"
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                                />
                                                <div className="flex gap-3 mt-3">
                                                    <button
                                                        onClick={handleSendReply}
                                                        disabled={!replyText.trim() || sendingReply}
                                                        className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-primary/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {sendingReply ? (
                                                            <>
                                                                <Loader size={18} className="animate-spin" />
                                                                Sending...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Send size={18} />
                                                                Send Reply
                                                            </>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setShowReplyForm(false);
                                                            setReplyText('');
                                                        }}
                                                        className="px-6 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-2">
                                                    This will open your email client with the reply pre-filled
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Footer Info */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex items-center justify-between">
                                <span className="flex items-center gap-1">
                                    <Clock size={14} />
                                    Received {new Date(selectedMessage.createdAt).toLocaleString()}
                                </span>
                                <span className="uppercase tracking-wider font-bold">ID: {selectedMessage._id.slice(-8)}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <MessageSquare size={40} />
                            </div>
                            <h3 className="text-xl font-black text-slate-600 dark:text-slate-300 mb-2">Select a message</h3>
                            <p className="text-sm">Choose a message from the list to view details and reply</p>
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
    <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-black shadow-lg">
        {name.charAt(0).toUpperCase()}
    </div>
);

export default MessagesAdmin;
