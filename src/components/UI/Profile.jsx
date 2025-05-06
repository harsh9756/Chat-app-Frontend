import { Button, IconButton, Snackbar, TextField } from '@mui/material';
import { motion, useAnimationControls } from 'framer-motion';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AvatarText from '../miscellaneous/AvatarText';
import axios from 'axios';

import Toaster from '../miscellaneous/Toaster';

export default function Profile() {

    useEffect(() => {
        controls.set('initial');
        controls.start('fadein');
    }, []);

    const [toast, setToast] = useState({ state: false, severity: "success", message: "" });

    const handleToast = (type,message) => {
        setToast({ "state": true, "severity": type,message });
    };

    const [editing, setEditing] = useState({
        "name": false,
        "username": false,
        "email": false,
    })

    const navigateTo = useNavigate();
    const controls = useAnimationControls();
    const dark = useSelector((state) => state.theme.dark);
    const iconColor = dark ? 'text-white' : '';

    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')))
    const [newUserData, setNewUserData] = useState({ ...userData })

    function goBack() {
        controls.start('fadeOut');
        setTimeout(() => {
            navigateTo('..');
        }, 300);
    }
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    function handleEdit(field) {
        setNewUserData({ ...userData })
        setEditing((prev) => ({ ...prev, [field]: !prev[field] }))
    }

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    async function handleSave(e) {
        setEditing({ "name": false, "email": false, "username": false })
        if (JSON.stringify(userData) !== JSON.stringify(newUserData) && newUserData.name && newUserData.username && newUserData.email && validateEmail(newUserData.email)) {
            e.preventDefault();
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/api/edit`,
                    {
                        "old": { ...userData },
                        "update": { ...newUserData },
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                if (response.status == 202) {
                    handleToast("success", "Profile Updates Successfully!")
                    localStorage.setItem('userData', JSON.stringify(response.data.userData))
                    localStorage.setItem('token', response.data.token)
                    setUserData(response.data.userData)
                }
            } catch (error) {
                handleToast("error", "Username/Email already in Use!")
            }
        }
        else {
            if (JSON.stringify(userData) === JSON.stringify(newUserData)) {
                handleToast("success", "No changes were made")
            } else {
                handleToast("error", "Fields can not be empty!")
            }
        }
    }
    return (
        <motion.div
            variants={{
                initial: { x: 20, opacity: 0 },
                fadein: { x: 0, opacity: 1 },
                fadeOut: { x: 20, opacity: 0 }
            }}
            transition={{ duration: 0.5 }}
            animate={controls}
            className={`${dark ? 'text-white' : 'text-black'} flex h-[100dvh] flex-col rounded-lg p-1 sm:absolute sm:top-0 lg:static z-20 sm:w-full flex-grow`}>
            <Toaster toast={toast} setToast={setToast} />
            <div className={`${dark ? 'text-white bg-gray-950' : 'text-black bg-gray-100'} h-screen elev rounded-md p-4`}>
                <div className="flex items-center">
                    <IconButton onClick={goBack} >
                        <ArrowBackIosNewOutlinedIcon className={`${iconColor} md:hidden`} />
                    </IconButton>
                    <h1 className="text-xl font-semibold ml-2">Your Profile</h1>
                </div>
                <div className="flex flex-col items-center lg:mt-4 sm:mt-8">
                    <div className="relative">
                        <AvatarText name={userData.name} profile={true} />
                    </div>
                    <div className="mt-4 text-center w-full max-w-md">
                        <div className="flex items-center my-4">
                            <div className="ml-4 mt-4 flex-grow">
                                {editing.name ? <TextField id="outlined-basic" size='small' variant="outlined" onChange={handleInputChange} name='name' value={newUserData.name} /> :
                                    <h2 className="text-lg font-semibold">{userData.name}</h2>
                                }
                                <p className="text-sm text-gray-500">This is not your username or pin. This name will be visible to people you chat with.</p>
                            </div>
                            <IconButton onClick={() => handleEdit("name")}>
                                <EditOutlinedIcon className={`${iconColor}`} />
                            </IconButton>
                        </div>
                        <div className="flex ml-4 mt-4 items-center my-4">
                            <PersonOutlinedIcon />
                            <h2 className="text-lg font-semibold">Username-</h2>
                            {editing.username ? <TextField id="outlined-basic" size='small' variant="outlined" onChange={handleInputChange} name='username' value={newUserData.username} /> :
                                <p className="text-gray-500">{userData.username}</p>
                            }
                            <IconButton onClick={() => handleEdit("username")}>
                                <EditOutlinedIcon className={`${iconColor}`} />
                            </IconButton>
                        </div>
                        <div className="flex ml-4  items-center my-4">
                            <EmailOutlinedIcon />
                            <h2 className="text-lg font-semibold">Email-</h2>
                            {editing.email ? <TextField id="outlined-basic" size='small' variant="outlined" onChange={handleInputChange} name='email' value={newUserData.email} /> :
                                <p className="text-gray-500">{userData.email}</p>
                            }
                            <IconButton onClick={() => handleEdit("email")}>
                                <EditOutlinedIcon className={`${iconColor}`} />
                            </IconButton>
                        </div>
                        {(editing.name || editing.username || editing.email) && <Button onClick={handleSave} size='small' variant="contained">Save</Button>}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
