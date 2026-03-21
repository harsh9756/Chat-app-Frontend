import { useSelector } from "react-redux";
import React from "react";

function Recv({ msg }) {
    const dark = useSelector((state) => state.theme.dark);
    const timeOnly = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="flex justify-start my-[1px] ml-2">
            <div className={`flex items-end gap-1.5 px-3 py-2 rounded-2xl rounded-tl-sm max-w-[65%] ${dark ? 'bg-white/10' : 'bg-white border border-gray-200'}`}>
                <p className={`text-sm leading-relaxed break-words m-0 ${dark ? 'text-gray-100' : 'text-gray-900'}`}>{msg.content}</p>
                <span className={`text-[10px] flex-shrink-0 whitespace-nowrap ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{timeOnly}</span>
            </div>
        </div>
    );
}

export default React.memo(Recv);