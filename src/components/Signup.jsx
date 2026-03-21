import { useState } from "react";
import axios from 'axios';
import { NavLink, useNavigate } from "react-router-dom";
import Toaster from "./miscellaneous/Toaster";
import { Eye, EyeOff, MessageSquare } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

export default function Signup() {
    const [toast, setToast] = useState({ state: false, severity: "success", message: "" });
    const [view, setView] = useState(false);
    const [user, setUser] = useState({});
    const navigateTo = useNavigate();

    // FIX: was calling undefined setOpen
    const handleToast = (type, message) => setToast({ state: true, severity: type, message });

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // FIX: e.preventDefault() always at the top
    async function handleSubmit(e) {
        e.preventDefault();
        if (!user.name || !user.username || !user.email || !user.password || !user.confirm) {
            handleToast("error", "Please fill in all fields.");
            return;
        }
        if (user.password !== user.confirm) {
            handleToast("error", "Passwords do not match.");
            return;
        }
        if (!validateEmail(user.email)) {
            handleToast("error", "Invalid email address.");
            return;
        }
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/api/register`, user);
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userData', JSON.stringify(response.data.userData));
                navigateTo('/app');
            }
        } catch (error) {
            handleToast("error", error?.response?.data || "Registration failed.");
        }
    }

    const handleGoogleSuccess = (credentialResponse) => {
        axios.post(`${import.meta.env.VITE_API_URL}/user/api/google-login`, { credential: credentialResponse.credential })
            .then((res) => {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('userData', JSON.stringify(res.data.userData));
                navigateTo('/app');
            })
            .catch((err) => handleToast("error", err?.response?.data || "Google signup failed."));
    };

    const inputClass = "bg-[#0d0f14] border border-[#2a2d35] focus:border-blue-500 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors w-full";

    return (
        <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center p-4">
            <Toaster toast={toast} setToast={setToast} />

            <div className="w-full max-w-lg bg-[#151820] border border-[#1e2230] rounded-2xl p-8">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                        <MessageSquare size={20} className="text-blue-400" />
                    </div>
                    <span className="text-white text-lg font-semibold tracking-tight">Convo</span>
                </div>

                <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">Create an account</h1>
                <p className="text-gray-500 text-sm mb-7">Join and start messaging.</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-gray-400 text-xs font-medium">Full name</label>
                            <input type="text" name="name" placeholder="Alex Johnson" autoComplete="off" required
                                onChange={(e) => setUser(p => ({ ...p, [e.target.name]: e.target.value }))}
                                className={inputClass} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-gray-400 text-xs font-medium">Username</label>
                            <input type="text" name="username" placeholder="alexj" autoComplete="off" required
                                onChange={(e) => setUser(p => ({ ...p, [e.target.name]: e.target.value }))}
                                className={inputClass} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-gray-400 text-xs font-medium">Email address</label>
                        <input type="email" name="email" placeholder="you@example.com" autoComplete="off" required
                            onChange={(e) => setUser(p => ({ ...p, [e.target.name]: e.target.value }))}
                            className={inputClass} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-gray-400 text-xs font-medium">Password</label>
                            <div className="relative">
                                <input name="password" required type={view ? 'text' : 'password'} placeholder="••••••••"
                                    onChange={(e) => setUser(p => ({ ...p, [e.target.name]: e.target.value }))}
                                    className={`${inputClass} pr-10`} />
                                <button type="button" onClick={() => setView(!view)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                                    {view ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-gray-400 text-xs font-medium">Confirm password</label>
                            <input name="confirm" required type={view ? 'text' : 'password'} placeholder="••••••••"
                                onChange={(e) => setUser(p => ({ ...p, [e.target.name]: e.target.value }))}
                                className={inputClass} />
                        </div>
                    </div>

                    <button type="submit"
                        className="bg-blue-500 hover:bg-blue-400 text-white rounded-lg py-2.5 text-sm font-medium transition-colors mt-1">
                        Create account
                    </button>
                </form>

                <div className="flex items-center gap-3 my-6">
                    <span className="flex-1 h-px bg-[#1e2230]" />
                    <span className="text-gray-600 text-xs">or sign up with</span>
                    <span className="flex-1 h-px bg-[#1e2230]" />
                </div>

                <div className="flex justify-center mb-6">
                    <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => handleToast("error", "Google signup failed.")} />
                </div>

                <p className="text-gray-500 text-sm text-center">
                    Already have an account?{' '}
                    <NavLink to="/" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Sign in</NavLink>
                </p>
            </div>
        </div>
    );
}