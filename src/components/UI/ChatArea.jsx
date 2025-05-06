import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { motion, useAnimationControls } from "framer-motion";
import axios from "axios";
import dayjs from "dayjs";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { IconButton } from "@mui/material";

import Sent from "../Chat/Sent";
import Recv from "../Chat/Recv";
import { socket } from "../../Utils/socket"
import AvatarText from "../miscellaneous/AvatarText";
import { chatActions } from "../../store/ChatSlice";

export default function ChatArea() {
  const dark = useSelector((state) => state.theme.dark);
  const data = useParams();
  const controls = useAnimationControls();
  const [msgs, setMsgs] = useState();
  const [messageText, setMessageText] = useState("");
  const [weTyping, setWeTyping] = useState(false)
  const [HeTyping, setHeTyping] = useState(false)
  const messagesEndRef = useRef();
  const navigateTo = useNavigate();
  const dispatch = useDispatch()

  const onlineUsers = useSelector((state) => state.online);
  const isOnline = onlineUsers.includes(data.Rid)

  async function handleSendMessage() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/msg`,
        {
          Rid: data.Rid,
          chatID: data.id,
          content: messageText,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setMessageText("");
        dispatch(chatActions.updateChat(response.data))
        setMsgs((msgs) => [{ ...response.data }, ...msgs]);
      }
    } catch (error) {
    }
  }
  const timer = useRef(null);

  function handleTyping(e) {
    setMessageText(e.target.value);
    if (weTyping == false) {
      setWeTyping(true)
      socket.emit("isTyping", { chatId: data.id, Rid: data.Rid });
    }
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      setWeTyping(false);
      socket.emit("stoppedTyping", { chatId: data.id, Rid: data.Rid });
    }, 1000);
  }


  useEffect(() => {

    const handleTyping = (id) => {
      if (data.id === id) setHeTyping(true);
    };

    const handleStoppedTyping = (id) => {
      if (data.id === id) setHeTyping(false);
    };

    const handleNewMessage = (newMsg) => {
      dispatch(chatActions.updateRead(data.id))
      socket.emit("msgsRead", { chatId: data.id, Rid: data.Rid, userId: JSON.parse(localStorage.getItem("userData"))._id });
      setHeTyping(false);
      setMsgs((msgs) => [{ ...newMsg }, ...msgs]);
    };

    const handleMarkRead = (id) => {
      dispatch(chatActions.updateRead(data.id))
      if (data.id === id) {
        setMsgs((prevMsgs) =>
          prevMsgs.map((msg) => ({
            ...msg,
            isRead: true
          }))
        );
      }
    };

    socket.on("markRead", handleMarkRead);
    socket.on("typing", handleTyping);
    socket.on("stopped Typing", handleStoppedTyping);
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stoppedTyping", handleStoppedTyping);
      socket.off("markRead", handleMarkRead);
      socket.off("newMessage", handleNewMessage);
    };
  }, [data.id, data.Rid, dispatch]);

  useEffect(() => {
    controls.set("initial");
    controls.start("fadein");
    socket.emit("msgsRead", { chatId: data.id, Rid: data.Rid, userId: JSON.parse(localStorage.getItem("userData"))._id });
    dispatch(chatActions.updateRead(data.id))
    async function getMsgs() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/msg/${data.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          setMsgs(response.data);
        }
      } catch (error) {
      }
    }

    getMsgs();

  }, [data]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [msgs]);

  function formatDate(dateString) {
    return dayjs(dateString).format("MMMM D, YYYY");
  }

  function goBack() {
    controls.start("fadeOut");
    setTimeout(() => {
      navigateTo("..");
    }, 300);
  }

  const iconColor = dark ? "text-white" : "";

  let lastDate = "";

  return (
    <motion.div
      variants={{
        initial: { x: 20, opacity: 0 },
        fadein: { x: 0, opacity: 1 },
        fadeOut: { x: 20, opacity: 0 },
      }}
      transition={{ duration: 0.5 }}
      animate={controls}
      className={`${dark ? "text-white" : "text-black"
        } flex h-[100dvh] flex-col rounded-lg py-2 md:pl-0 sm:absolute sm:top-0 lg:static bg-white sm:w-full flex-grow`}
    >
      <div className={`elev flex px-2 p-0 justify-between items-center rounded-md ${dark ? "bg-gray-950" : "bg-gray-100"
        }`}>
        <div className="flex items-center">
          <div className="md:hidden">
            <IconButton onClick={goBack}>
              <ArrowBackIosNewOutlinedIcon className={`${iconColor}`} />
            </IconButton>
          </div>
          <div className="relative inline-block">
            <AvatarText name={data.name} /><span
              className={`absolute top-0 right-0 w-4 h-4 rounded-full border-2 border-white ${isOnline ? 'bg-green-400' : 'bg-red-500'
                }`}
            ></span>
          </div>
          <div>
            <h1>{data.name}</h1>
            {HeTyping ? <i className="text-gray-500 animate-pulse duration-500">typing</i> : ""}
          </div>
        </div>
        <div>
          <IconButton className="icons">
            <DeleteOutlinedIcon className={`${iconColor}`} />
          </IconButton>
        </div>
      </div>

      {/* Messages Section */}
      <div
        className={`p-1 my-2 h-[90vh] elev overflow-auto ${dark ? "bg-gray-950" : "bg-gray-100"
          } rounded-md`}>
        {msgs?.slice().reverse().map((msg, index) => {
          if (msg.chatId !== data.id) return null;
          const messageDate = formatDate(msg.createdAt);
          const showDate = messageDate !== lastDate || index === 0;
          lastDate = messageDate;

          return (
            <div key={index}>
              {showDate && (
                <div className="text-center text-gray-500 my-2">{messageDate}</div>
              )}
              {msg.sender.name === data.name ? (
                <Recv msg={msg} />
              ) : (
                <Sent msg={msg} />
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} >
        </div>
      </div>

      {/* Input Section */}
      <div className={`bg-gray-100 elev flex rounded-md ${dark ? "bg-gray-950" : "bg-gray-100"
        }`}>
        <input
          type="text"
          value={messageText}
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          onChange={(e) => handleTyping(e)}
          className="w-full rounded-md p-2 bg-transparent focus:border-none"
          placeholder="Message"
        />
        <IconButton onClick={handleSendMessage} className="scale-125">
          <SendRoundedIcon
            className={`${dark ? "text-white" : "text-black"} rounded-sm`}
          />
        </IconButton>
      </div>
    </motion.div>
  );
}
