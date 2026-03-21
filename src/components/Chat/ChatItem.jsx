import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import AvatarText from '../miscellaneous/AvatarText';
import { CheckCheck } from 'lucide-react';

export default function ChatItem({ chat }) {
    const navigateTo = useNavigate();
    const dark = useSelector((state) => state.theme.dark);
    const onlineUsers = useSelector((state) => state.online);

    // FIX: safe parse
    let userData;
    try { userData = JSON.parse(localStorage.getItem("userData")); } catch { userData = null; }

    let name = "", Rid = "";
    if (chat.users[1]?.name === userData?.name) {
        name = chat.users[0]?.name;
        Rid = chat.users[0]?._id;
    } else {
        name = chat.users[1]?.name;
        Rid = chat.users[1]?._id;
    }

    const isOnline = onlineUsers.includes(Rid);
    const createdAt = chat.latestMessage?.createdAt;
    const timeOnly = createdAt ? new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";
    const validTime = timeOnly && timeOnly !== "Invalid Date" ? timeOnly : "";

    // FIX: safe null check order
    const latestMsg = chat.latestMessage;
    const isUnread = latestMsg !== null && latestMsg?.sender?._id === Rid && latestMsg?.isRead === false;
    const isSentByMe = latestMsg !== null && latestMsg?.sender?._id !== Rid;

    return (
        <motion.div
            whileTap={{ scale: 0.99 }}
            onClick={() => navigateTo(`chat/${name}/${chat._id}/${Rid}`)}
            className={`flex items-center gap-3 px-3 py-3 cursor-pointer border-b transition-colors
                ${dark
                    ? 'border-[#1a1f2e] hover:bg-white/[0.03]'
                    : 'border-gray-100 hover:bg-gray-50'
                }`}
        >
            {/* Avatar + online dot */}
            <div className="relative flex-shrink-0">
                <AvatarText name={name || '?'} />
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 ${dark ? 'border-[#151820]' : 'border-white'} ${isOnline ? 'bg-green-400' : 'bg-gray-400'}`} />
            </div>
            {/* Text */}
            <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-0.5">
                    <span className={`text-sm truncate ${isUnread ? 'font-semibold' : 'font-medium'} ${dark ? 'text-white' : 'text-gray-900'}`}>
                        {name}
                    </span>
                    <span className={`text-[11px] flex-shrink-0 ml-2 ${isUnread ? 'text-blue-400' : dark ? 'text-gray-600' : 'text-gray-400'}`}>
                        {validTime}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className={`text-xs truncate flex items-center gap-1 ${isUnread ? (dark ? 'text-gray-300' : 'text-gray-700') : dark ? 'text-gray-400' : 'text-gray-400'}`}>
                        {latestMsg == null ? 'Tap to chat' : latestMsg.content}
                        {isSentByMe && latestMsg && (
                            <CheckCheck size={11} className="flex-shrink-0" color={latestMsg.isRead ? '#60a5fa' : '#6b7280'} />
                        )}
                    </span>
                    {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 ml-2" />
                    )}
                </div>
            </div>
        </motion.div>
    );
}