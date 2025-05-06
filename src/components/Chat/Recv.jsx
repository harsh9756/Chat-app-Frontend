import React from "react";
import { useSelector } from "react-redux";

function Recv({ msg }) {
  const dark = useSelector((state) => state.theme.dark)
  const createdAt = msg.createdAt;
  const timeOnly = new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div className={`my-[1px] ml-1 flex justify-between ${dark ? 'bg-gray-500 ' : 'bg-white'} rounded-xl w-fit max-w-[60%]`}>
      <h1 className="p-1">{msg.content}</h1>
      <p className={`text-[10px] ${dark?"text-gray-200":"text-gray-600"} mr-1 pr-1 self-end`}>{timeOnly}</p>
    </div>
  );
}

export default React.memo(Recv)
