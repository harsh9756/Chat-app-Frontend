import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { IconButton, Tooltip } from '@mui/material';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom';
import { themeActions } from '../../store/ThemeSlice';
import ChatItem from '../Chat/ChatItem';
import Modal from '../miscellaneous/Modal';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AvatarText from '../miscellaneous/AvatarText';
import { socket } from '../../Utils/socket';
import { chatActions } from '../../store/ChatSlice';

export default function SideBar() {
  const chatData = useSelector(state => state.chat)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [msg, setMsg] = useState()
  const dark = useSelector(state => state.theme.dark)
  const boxClasses = `p-1 flex rounded-lg  ${dark ? 'bg-gray-950' : 'bg-gray-100'}`
  const iconColor = dark ? 'text-white' : '';

  const navigateTo = useNavigate()
  const dispatch = useDispatch()
  function handleLogout() {
    localStorage.clear()
    navigateTo('/')
  }

  async function handleCreateChat(id) {
    setOpen(false)
    setName("")
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/chat/api/getAllChats`,
        { "userId": id },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      if (response.status == 200) {
        if (Array.isArray(response.data.fullChat) && response.data.fullChat.length > 0) {
          dispatch(chatActions.createChat(response.data.fullChat))
        }
      }
      if (error?.response.status == 404) {
        setMsg(error?.response?.data.message)
      }
    }
    catch (error) {
    }
  }
  useEffect(() => {
    socket.connect()

    function setData(data) {
      dispatch(chatActions.updateChat(data))
    }

    socket.on("newChat", (newChat) => {
      dispatch(chatActions.appendChat(newChat));
    });

    socket.on("newMessage", setData)

    socket.emit("register", JSON.parse(localStorage.getItem("userData"))?._id)
    handleCreateChat()
    return () => socket.disconnect()
  }, [])

  async function handleSearchUser(e) {
    e.preventDefault()
    try {
      if (name == JSON.parse(localStorage.getItem("userData")).username) {
        setName("")
        setMsg("You entered Your Username!")
        return
      }
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/api/getSearchedUser?q=${name}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      if (response.status == 200) {
        setMsg({ name: response.data.name, id: response.data._id })
      }
    }
    catch (error) {
      if (error.response?.status == 404) {
        setMsg(error?.response?.data.message)
      }
    }
  }

  return (
    <motion.nav initial={{ x: 15 }} animate={{ x: 0 }} transition={{ duration: 0.5 }} className={`h-[100dvh] px-1 sm:w-full md:w-1/3 lg:w-1/4 flex-col rounded-lg flex z-20`}>
      <div className={`elev py-1 mt-2 ${boxClasses} justify-between`} >
        <Modal open={open} setOpen={setOpen}>
          <form onSubmit={handleSearchUser} className="p-4 md:p-5">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter Username/Email</label>
            <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg dark:bg-gray-600 dark:border-gray-500">
              <input type="text" name="name" id="name" onChange={(e) => setName(e.target.value)} value={name}
                className="my-2 focus:outline-none bg-transparent border-none text-gray-900 text-sm rounded-lg block w-full p-2.5 "
                placeholder="example@example.com"
                required />
              <IconButton type='submit'>
                <SearchIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </IconButton>
            </div>
            {msg && msg !== "User not found" && msg !== "You entered Your Username!" ? (
              <motion.div
                whileTap={{ scale: 0.99 }}
                onClick={() => handleCreateChat(msg.id)}
                className="flex p-2 items-center"
              >
                <AvatarText className="mr-2 mt-1" name={msg.name} />
                <div className="flex flex-grow gap-6 items-center">
                  <p>{msg.name}</p>
                  <IconButton>
                    <ChatOutlinedIcon />
                  </IconButton>
                </div>
              </motion.div>
            ) : (<p className="text-red-600 text-xl text-center mt-5">{msg}</p>)}
          </form>
        </Modal>
        <div>
          <Tooltip title="Profile">
            <IconButton onClick={() => navigateTo('user/profile')} className='icons'>
              <AccountCircleOutlinedIcon className={iconColor} />
            </IconButton>
          </Tooltip>
        </div>
        <div>
          <Tooltip title="Add Friend">
            <IconButton className='icons' onClick={() => setOpen(true)}>
              <PersonAddAltOutlinedIcon className={iconColor} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Create Group">
            <IconButton className='icons'>
              <GroupAddOutlinedIcon className={iconColor} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Change Theme">
            <IconButton className='icons' onClick={() => dispatch(themeActions.change())}>
              <DarkModeOutlinedIcon className={iconColor} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton className='icons' onClick={handleLogout}>
              <LogoutIcon className={iconColor} />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div className={`elev my-2 ${boxClasses}`}>
        <IconButton className='icons'><SearchOutlinedIcon className={iconColor} /></IconButton>
        <input type="text" className={`focus:outline-none p-0 bg-transparent focus:border-none ${iconColor}`} placeholder='Search' />
      </div>
      <div id="full" className={`elev ${boxClasses} overflow-auto grow flex-col mb-2 pt-2`}>
        {chatData?.map((chat, index) => {
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, }}
              animate={{ opacity: 1, y: 0, delay: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <ChatItem chat={chat} />
            </motion.div>
          )
        })}
      </div>
    </motion.nav >
  );
}

