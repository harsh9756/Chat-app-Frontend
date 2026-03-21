import { motion, useAnimationControls } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ChevronLeft, Edit2, X, User, AtSign, Mail } from 'lucide-react';
import axios from 'axios';
import AvatarText from '../miscellaneous/AvatarText';
import Toaster from '../miscellaneous/Toaster';

export default function Profile() {
    const controls = useAnimationControls();
    const navigateTo = useNavigate();
    const dark = useSelector((state) => state.theme.dark);

    useEffect(() => {
        controls.set('initial');
        controls.start('fadein');
    }, []);

    const [toast, setToast] = useState({ state: false, severity: "success", message: "" });
    const handleToast = (type, message) => setToast({ state: true, severity: type, message });

    // FIX: safe parse
    const safeUser = () => { try { return JSON.parse(localStorage.getItem('userData')); } catch { return {}; } };
    const [userData, setUserData] = useState(safeUser());
    const [newUserData, setNewUserData] = useState({ ...userData });
    const [editing, setEditing] = useState({ name: false, username: false, email: false });

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    function handleEdit(field) {
        setNewUserData({ ...userData });
        setEditing({ name: false, username: false, email: false, [field]: true });
    }

    function handleCancel(field) {
        setNewUserData({ ...userData });
        setEditing(prev => ({ ...prev, [field]: false }));
    }

    // FIX: e.preventDefault() always called
    async function handleSave(e) {
        e.preventDefault();
        setEditing({ name: false, email: false, username: false });

        if (JSON.stringify(userData) === JSON.stringify(newUserData)) {
            handleToast("success", "No changes were made."); return;
        }
        if (!newUserData.name || !newUserData.username || !newUserData.email) {
            handleToast("error", "Fields cannot be empty."); return;
        }
        if (!validateEmail(newUserData.email)) {
            handleToast("error", "Invalid email address."); return;
        }
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/user/api/edit`,
                { old: { ...userData }, update: { ...newUserData } },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            if (response.status === 202) {
                handleToast("success", "Profile updated!");
                localStorage.setItem('userData', JSON.stringify(response.data.userData));
                localStorage.setItem('token', response.data.token);
                setUserData(response.data.userData);
            }
        } catch (_) {
            handleToast("error", "Username or email already in use.");
        }
    }

    function goBack() {
        controls.start('fadeOut');
        setTimeout(() => navigateTo('..'), 300);
    }

    const isEditing = editing.name || editing.username || editing.email;
    const borderClass = dark ? 'border-[#1e2230]' : 'border-gray-200';

    return (
        <motion.div
            variants={{ initial: { x: 15, opacity: 0 }, fadein: { x: 0, opacity: 1 }, fadeOut: { x: 15, opacity: 0 } }}
            transition={{ duration: 0.3 }}
            animate={controls}
            className={`flex flex-col h-[100dvh] flex-grow sm:absolute sm:top-0 sm:w-full lg:static z-20 ${dark ? 'bg-[#0d0f14]' : 'bg-gray-50'}`}
        >
            <Toaster toast={toast} setToast={setToast} />

            {/* Header */}
            <div className={`flex items-center gap-3 px-4 py-3 border-b ${dark ? 'bg-[#151820] border-[#1e2230]' : 'bg-white border-gray-200'}`}>
                <button onClick={goBack}
                    className={`p-1.5 rounded-lg md:hidden ${dark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:bg-gray-100'}`}>
                    <ChevronLeft size={18} />
                </button>
                <span className={`text-sm font-semibold flex-1 ${dark ? 'text-white' : 'text-gray-900'}`}>Profile</span>
                {isEditing && (
                    <button onClick={handleSave}
                        className="bg-blue-500 hover:bg-blue-400 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                        Save changes
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* Avatar section */}
                <div className={`flex flex-col items-center py-10 px-6 border-b ${dark ? 'bg-[#151820] border-[#1e2230]' : 'bg-white border-gray-200'}`}>
                    <AvatarText name={userData.name || '?'} profile={true} />
                    <h2 className={`text-lg font-semibold mt-4 mb-1 tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
                        {userData.name}
                    </h2>
                    <p className="text-sm text-gray-500">@{userData.username}</p>
                </div>

                {/* Fields */}
                <div className="px-4 pt-2 pb-8">
                    {[
                        { icon: <User size={14} />, label: 'Display name', field: 'name', value: userData.name },
                        { icon: <AtSign size={14} />, label: 'Username', field: 'username', value: userData.username },
                        { icon: <Mail size={14} />, label: 'Email address', field: 'email', value: userData.email },
                    ].map(({ icon, label, field, value }) => (
                        <div key={field} className={`flex items-center gap-3 py-4 border-b ${borderClass}`}>
                            <span className="text-gray-500 flex-shrink-0">{icon}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-gray-500 text-xs font-medium mb-0.5">{label}</p>
                                {editing[field] ? (
                                    <input
                                        autoFocus
                                        value={newUserData[field] || ''}
                                        onChange={e => setNewUserData(p => ({ ...p, [field]: e.target.value }))}
                                        className={`text-sm w-full rounded-lg px-2.5 py-1.5 outline-none border transition-colors
                                            ${dark
                                                ? 'bg-[#0d0f14] border-[#2a2d35] focus:border-blue-500 text-white'
                                                : 'bg-gray-50 border-gray-200 focus:border-blue-400 text-gray-900'
                                            }`}
                                    />
                                ) : (
                                    <p className={`text-sm truncate ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{value}</p>
                                )}
                            </div>
                            <div className="flex-shrink-0">
                                {editing[field] ? (
                                    <button onClick={() => handleCancel(field)}
                                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors">
                                        <X size={14} />
                                    </button>
                                ) : (
                                    <button onClick={() => handleEdit(field)}
                                        className={`p-1.5 rounded-lg transition-colors ${dark ? 'text-gray-500 hover:text-gray-300 hover:bg-white/5' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}>
                                        <Edit2 size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}