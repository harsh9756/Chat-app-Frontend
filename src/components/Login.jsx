import { Backdrop, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from 'axios';
import Toaster from "./miscellaneous/Toaster";
import { Eye, EyeOff, MessageSquare } from 'lucide-react';
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
    const navigateTo = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [view, setView] = useState(false);
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [toast, setToast] = useState({ state: false, severity: "success", message: "" });

    const handleToast = (type, message) => {
        if (!toast.state) setToast({ state: true, severity: type, message });
    };

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/api/tokenVerify`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.status === 200) {
                    localStorage.setItem('userData', JSON.stringify(response.data.userData));
                    navigateTo('/app');
                }
            } catch (_) {}
        };
        verifyToken();
    }, []);

    async function handleLogin(e) {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/api/login`, { email, password: pass });
            if (response.status === 200) {
                localStorage.setItem('userData', JSON.stringify(response.data.userData));
                localStorage.setItem('token', response.data.token);
                navigateTo('/app');
            }
        } catch (error) {
            handleToast("error", error?.response?.data?.message || "Invalid credentials.");
        }
        setIsLoading(false);
    }

    const handleGoogleSuccess = (credentialResponse) => {
        axios.post(`${import.meta.env.VITE_API_URL}/user/api/google-login`, { credential: credentialResponse.credential })
            .then((res) => {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('userData', JSON.stringify(res.data.userData));
                navigateTo('/app');
            })
            .catch((err) => handleToast("error", err?.response?.data || "Google login failed."));
    };

    return (
        <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center p-4">
            <Toaster toast={toast} setToast={setToast} />
            <Backdrop sx={{ color: '#4a9eff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <div className="w-full max-w-md bg-[#151820] border border-[#1e2230] rounded-2xl p-8">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                        <MessageSquare size={20} className="text-blue-400" />
                    </div>
                    <span className="text-white text-lg font-semibold tracking-tight">Convo</span>
                </div>

                <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">Welcome back</h1>
                <p className="text-gray-500 text-sm mb-7">Sign in to continue your conversations.</p>

                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-gray-400 text-xs font-medium">Email address</label>
                        <input
                            type="email" required value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="bg-[#0d0f14] border border-[#2a2d35] focus:border-blue-500 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-gray-400 text-xs font-medium">Password</label>
                        <div className="relative">
                            <input
                                type={view ? 'text' : 'password'} required value={pass}
                                onChange={(e) => setPass(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-[#0d0f14] border border-[#2a2d35] focus:border-blue-500 rounded-lg px-3.5 py-2.5 pr-10 text-sm text-white placeholder-gray-600 outline-none transition-colors"
                            />
                            <button type="button" onClick={() => setView(!view)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                                {view ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit"
                        className="bg-blue-500 hover:bg-blue-400 text-white rounded-lg py-2.5 text-sm font-medium transition-colors mt-1">
                        Sign in
                    </button>
                </form>

                <div className="flex items-center gap-3 my-6">
                    <span className="flex-1 h-px bg-[#1e2230]" />
                    <span className="text-gray-600 text-xs">or</span>
                    <span className="flex-1 h-px bg-[#1e2230]" />
                </div>

                <div className="flex justify-center mb-6">
                    <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => handleToast("error", "Google login failed.")} />
                </div>

                <p className="text-gray-500 text-sm text-center">
                    No account?{' '}
                    <NavLink to="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                        Create one
                    </NavLink>
                </p>
            </div>
        </div>
    );
}