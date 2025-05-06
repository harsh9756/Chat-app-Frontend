import { Backdrop, Button, CircularProgress, TextField, InputAdornment, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from 'axios';
import Toaster from "./miscellaneous/Toaster";
import { Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
    const navigateTo = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [view, setView] = useState(false);
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    const [toast, setToast] = useState({ state: false, severity: "success", message: "" });

    const handleToast = (type, message) => {
        if (!toast.state) {
            setToast({ state: true, severity: type, message });
        }
    };

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/api/tokenVerify`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    localStorage.setItem('userData', JSON.stringify(response.data.userData));
                    navigateTo('/app');
                }
            } catch (error) {
            }
        };
        verifyToken();
    }, []);

    async function handleLogin(e) {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/api/login`, {
                email,
                password: pass
            });
            if (response.status === 200) {
                localStorage.setItem('userData', JSON.stringify(response.data.userData));
                localStorage.setItem('token', response.data.token);
                navigateTo('/app');
            } else {
                handleToast("error", "Invalid login credentials");
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "An unknown error occurred.";
            handleToast("error", errorMessage);
        }
        setIsLoading(false);
    }

    return (
        <div className="pb-8">
            <Toaster toast={toast} setToast={setToast} />
            <Backdrop sx={{ color: '#f2c5bf', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className="p-6 mt-4 elev rounded-xl lg:w-1/3 md:w-2/3 sm:w-3/4 mx-auto">
                <h1 className="text-4xl text-center text-black">Welcome</h1>
                <hr />
                <form onSubmit={handleLogin}>
                    <p className="text-xl mt-4 text-green-700 mb-2">Login to continue.</p>
                    <TextField
                        id="outlined-email"
                        fullWidth
                        label="Email"
                        variant="outlined"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    /><br /><br />

                    <TextField
                        id="outlined-password"
                        fullWidth
                        label="Password"
                        variant="outlined"
                        required
                        type={view ? 'text' : 'password'}
                        value={pass}
                        onChange={(event) => setPass(event.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setView(!view)} edge="end">
                                        {view ? <EyeOff /> : <Eye />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <div className="my-4 flex justify-left">
                        <GoogleLogin
                            onSuccess={credentialResponse => {
                                const credential = credentialResponse.credential; // <-- This is the JWT string you need to send
                                axios.post(`${import.meta.env.VITE_API_URL}/user/api/google-login`, { credential })
                                    .then((response) => {
                                        localStorage.setItem('token', response.data.token);
                                        localStorage.setItem('userData', JSON.stringify(response.data.userData));
                                        navigateTo('/app');
                                    })
                                    .catch((err) => {
                                        handleToast("error", err.response.data);
                                    });
                            }}
                            onError={() => {
                                handleToast("error", "Google Login Failed");
                            }}
                        />

                    </div>
                    <p>Don't have an account? <NavLink to={'/signup'} className="text-blue-800 underline">Signup?</NavLink></p>
                    <br />
                    <Button type="submit" variant="contained" color="success">Login</Button>
                </form>
            </div>
        </div>
    );
}
