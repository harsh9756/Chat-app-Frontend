import { useSelector } from "react-redux";
import { CheckCheck } from "lucide-react"
import React from "react";
function Sent({ msg }) {
  const dark = useSelector((state) => state.theme.dark)
  const createdAt = msg.createdAt;
  const timeOnly = new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div className={`my-[1px] flex mr-1 justify-between ms-auto ${dark ? 'bg-green-800' : 'bg-green-200'} rounded-xl w-fit max-w-[60%]`}>
      <h1 className="p-1">{msg.content}</h1>
      <p className={`text-[10px] ${dark ? "text-gray-200" : "text-gray-600"} mr-1 self-end`}>{timeOnly}</p>
      <p className="flex items-center mr-1 self-end">
        <CheckCheck size="15px" color={msg.isRead ? "#34B7F1" : "#999"} />
      </p>
    </div>

  );
}

export default React.memo(Sent)
