import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import AvatarText from '../miscellaneous/AvatarText';
import { CheckCheck } from 'lucide-react';

export default function ChatItem({ chat }) {
    const navigateTo = useNavigate();
    const user = JSON.parse(localStorage.getItem("userData"));
    let name = "";
    let Rid = "";
    if (chat.users[1]?.name === user?.name) {
        name = chat.users[0]?.name;
        Rid = chat.users[0]?._id;
    } else {
        name = chat.users[1]?.name;
        Rid = chat.users[1]?._id;
    }

    const onlineUsers = useSelector((state) => state.online);
    const isOnline = onlineUsers.includes(Rid);
    const createdAt = chat.latestMessage?.createdAt;
    const timeOnly = createdAt ? new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";
    const dark = useSelector((state) => state.theme.dark);

    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigateTo(`chat/${name}/${chat._id}/${Rid}`)}
            className={`flex p-2 ${dark ? 'hover:bg-black cursor-pointer text-white' : 'hover:bg-white'}`}>

            <div className="relative inline-block">
                <AvatarText name={name} />
                <span className={`absolute top-0 right-0 w-4 h-4 rounded-full border-2 border-white ${isOnline ? 'bg-green-400' : 'bg-red-500'}`}></span>
            </div>

            <div className="flex-grow">
                <div className="flex justify-between w-full">
                    <div>
                        <div className="font-bold">{name}</div>
                        <div className="text-gray-600 flex">
                            {chat.latestMessage == null ? "Tap to Chat" : chat.latestMessage?.content}
                            {chat.latestMessage?.sender._id != Rid && chat.latestMessage!==null ? <CheckCheck className='mt-2 ml-2' size="15px" color={chat.latestMessage?.isRead ? "#34B7F1" : "#999"} /> : ""}
                        </div>
                    </div>
                    <div className='items-center flex flex-col'>
                        <div className="text-sm ">{timeOnly === "Invalid Date" ? "" : timeOnly}
                        </div>
                        {chat.latestMessage && chat.latestMessage?.sender?._id === Rid && chat.latestMessage?.isRead === false ? (
                            <span style={{ display: "inline-block", width: '10px', height: '10px', backgroundColor: 'green', borderRadius: '50%', margin: 'auto', padding: "0px" }}></span>
                        ) : ""}
                    </div>
                </div>
                <hr />
            </div>
        </motion.div>
    );
}
