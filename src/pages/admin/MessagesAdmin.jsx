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
import { getMessages, deleteMessage, updateMessageStatus, replyToMessage } from '../../services/api';
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
            // Send reply via email
            const response = await replyToMessage(selectedMessage._id, replyText, user.token);
            
            // Update local state with the response data
            const updatedMessage = response.data.data;
            setMessages(prev => prev.map(m =>
                m._id === selectedMessage._id ? updatedMessage : m
            ));
            
            setSelectedMessage(updatedMessage);
            setShowReplyForm(false);
            setReplyText('');
            
            alert('Reply sent successfully!');
        } catch (err) {
            console.error('Error sending reply:', err);
            alert(err.response?.data?.message || 'Failed to send reply. Please check your email configuration.');
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
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                                activeTab === tab.id
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                            }`}
                        >
                            <Icon size={16} />
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
                <div className={`w-full md:w-80 border-r border-slate-200 dark:border-slate-700 flex flex-col ${selectedMessage ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                        <h2 className="font-bold text-xs text-slate-500 uppercase tracking-wider">
                            {tabs.find(t => t.id === activeTab)?.label} ({filteredMessages.length})
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {loading ? (
                            <div className="flex justify-center p-8">
                                <Loader className="animate-spin text-primary" />
                            </div>
                        ) : filteredMessages.length === 0 ? (
                            <div className="text-center p-8 text-slate-500">
                                <MessageSquare size={40} className="mx-auto mb-3 opacity-20" />
                                <p className="font-semibold text-sm">No {activeTab} messages</p>
                                <p className="text-xs mt-1">Messages will appear here</p>
                            </div>
                        ) : (
                            filteredMessages.map((msg) => (
                                <motion.div
                                    key={msg._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={() => handleViewMessage(msg)}
                                    className={`p-4 rounded-xl cursor-pointer transition-all relative group ${
                                        selectedMessage?._id === msg._id
                                            ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-2 border-blue-300 dark:border-blue-700 shadow-md'
                                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md'
                                    }`}
                                >
                                    {/* Status Indicator with Glow */}
                                    <div className={`absolute top-4 right-4 w-2.5 h-2.5 rounded-full ${
                                        msg.status === 'unread' ? 'bg-blue-500 shadow-lg shadow-blue-500/50 animate-pulse' :
                                        msg.status === 'read' ? 'bg-green-500 shadow-lg shadow-green-500/50' :
                                        'bg-purple-500 shadow-lg shadow-purple-500/50'
                                    }`} />

                                    {/* Sender Name */}
                                    <div className="flex justify-between items-start mb-2 pr-6">
                                        <h3 className={`font-black text-lg truncate transition-colors ${
                                            selectedMessage?._id === msg._id 
                                                ? 'text-primary' 
                                                : 'text-slate-800 dark:text-slate-100 group-hover:text-primary'
                                        }`}>
                                            {msg.name}
                                        </h3>
                                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 whitespace-nowrap ml-2">
                                            {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>

                                    {/* Subject */}
                                    <p className="text-sm font-bold text-slate-600 dark:text-slate-400 truncate leading-relaxed">
                                        {msg.subject}
                                    </p>

                                    {/* Hover Effect Border */}
                                    <div className={`absolute inset-0 rounded-xl border-2 border-primary transition-opacity ${
                                        selectedMessage?._id === msg._id ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
                                    }`} />
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
                            <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-start bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900/10">
                                <div className="flex-1">
                                    <button
                                        onClick={() => setSelectedMessage(null)}
                                        className="md:hidden mb-3 flex items-center text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                                    >
                                        ← Back
                                    </button>
                                    
                                    <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-3 leading-tight">
                                        {selectedMessage.subject}
                                    </h2>

                                    <div className="flex items-center gap-3 text-sm">
                                        <UserIcon name={selectedMessage.name} />
                                        <div className="flex flex-col">
                                            <span className="font-black text-slate-800 dark:text-slate-100">{selectedMessage.name}</span>
                                            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                                                <span className="font-medium">{selectedMessage.email}</span>
                                                {selectedMessage.phone && (
                                                    <>
                                                        <span className="text-slate-300">•</span>
                                                        <span className="font-medium">{selectedMessage.phone}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    {selectedMessage.status !== 'replied' && (
                                        <button
                                            onClick={() => setShowReplyForm(!showReplyForm)}
                                            className="p-2.5 text-white bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary rounded-xl transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105"
                                            title="Reply"
                                        >
                                            <Reply size={18} />
                                        </button>
                                    )}
                                    <button
                                        onClick={(e) => handleDeleteClick(selectedMessage, e)}
                                        className="p-2.5 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-500 rounded-xl transition-all shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105"
                                        title="Delete Message"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-800">
                                <div className="prose dark:prose-invert max-w-none">
                                    <div className="mb-6">
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                                            <div className="relative whitespace-pre-wrap font-medium text-base leading-relaxed text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-lg max-h-[calc(100vh-400px)] overflow-y-auto hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                                                {selectedMessage.message}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Show existing reply if replied */}
                                    {selectedMessage.status === 'replied' && selectedMessage.reply && (
                                        <div className="mt-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
                                                <h3 className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                                    <Reply size={16} />
                                                    Your Reply
                                                </h3>
                                            </div>
                                            <div className="relative group">
                                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                                                <div className="relative whitespace-pre-wrap font-medium text-base leading-relaxed text-slate-800 dark:text-slate-200 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-2xl border-2 border-purple-200 dark:border-purple-800 shadow-lg max-h-[300px] overflow-y-auto hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                                                    {selectedMessage.reply}
                                                </div>
                                            </div>
                                            <p className="text-xs font-semibold text-slate-500 mt-3 flex items-center gap-2">
                                                <Clock size={12} />
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
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-1 h-6 bg-gradient-to-b from-primary to-blue-600 rounded-full"></div>
                                                    <h3 className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Write Reply</h3>
                                                </div>
                                                <textarea
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    placeholder="Type your reply here..."
                                                    rows="6"
                                                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none text-base font-medium shadow-lg transition-all"
                                                />
                                                <div className="flex gap-3 mt-4">
                                                    <button
                                                        onClick={handleSendReply}
                                                        disabled={!replyText.trim() || sendingReply}
                                                        className="px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white text-sm font-black rounded-xl hover:from-blue-600 hover:to-primary transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                                                    >
                                                        {sendingReply ? (
                                                            <>
                                                                <Loader size={16} className="animate-spin" />
                                                                Sending...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Send size={16} />
                                                                Send Reply
                                                            </>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setShowReplyForm(false);
                                                            setReplyText('');
                                                        }}
                                                        className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-black rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all shadow-md hover:shadow-lg"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                                <p className="text-xs font-semibold text-slate-500 mt-3 flex items-center gap-2">
                                                    <Mail size={12} />
                                                    This will open your email client with the reply pre-filled
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Footer Info */}
                            <div className="p-4 bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-900/10 border-t border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Clock size={14} className="text-primary" />
                                    {new Date(selectedMessage.createdAt).toLocaleString()}
                                </span>
                                <span className="uppercase tracking-wider text-[10px] px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded-full">
                                    ID: {selectedMessage._id.slice(-8)}
                                </span>
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
    <div className="w-10 h-10 bg-gradient-to-br from-primary via-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-base font-black shadow-lg shadow-primary/30 flex-shrink-0 ring-2 ring-white dark:ring-slate-800">
        {name.charAt(0).toUpperCase()}
    </div>
);

export default MessagesAdmin;
