// Sent.jsx
import { useSelector } from "react-redux";
import { CheckCheck } from "lucide-react";
import React from "react";

function Sent({ msg }) {
    const dark = useSelector((state) => state.theme.dark);
    const timeOnly = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="flex justify-end my-[1px] mr-2">
            <div className={`flex items-end gap-1.5 px-3 py-2 rounded-2xl rounded-tr-sm max-w-[65%] ${dark ? 'bg-green-800' : 'bg-green-200'}`}>
                <p className={`${dark ? "text-white" : "text-black"}`}>{msg.content}</p>
                <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">{timeOnly}</span>
                    <CheckCheck size={11} color={msg.isRead ? "#34B7F1" : 'rgba(255,255,255,0.5)'} />
                </div>
            </div>
        </div>
    );
}

export default React.memo(Sent);