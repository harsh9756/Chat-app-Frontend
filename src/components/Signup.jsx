import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import axios from 'axios';
import { NavLink, useNavigate } from "react-router-dom";
import Toaster from "./miscellaneous/Toaster";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

export default function Signup() {

    const [toast, setToast] = useState({ state: false, severity: "success", message: "" });
    const [view, setView] = useState(false);

    const handleToast = (type,message) => {
        setOpen({ "state": true, "severity": type,message:message });
    };

    const [user, setUser] = useState({})
    const navigateTo = useNavigate()

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    async function handleSubmit(e) {
        if (user.name && user.username && user.email && user.password && user.password && user.password == user.confirm && validateEmail(user.email)) {
            e.preventDefault();
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/api/register`, user);
                if (response.status == 200) {
                    localStorage.setItem('token', response.data.token)
                    localStorage.setItem('userData', JSON.stringify(response.data.userData))
                    navigateTo('/app')
                }
            } catch (error) {
                handleToast("error",error.response.data)
            }
        }
        else {
            if (!user.username) {
                handleToast("error","Please fill in the required fields")
                return;
            }
            if (user.password != user.confirm) {
                handleToast("error","Password Does not Match")
                return;
            }
            if (!validateEmail(user.email)) {
                handleToast("error","Invalid Email")
            }
        }
    }

    return (
        <div className="pb-6">
            <Toaster toast={toast} setToast={setToast} />
            <div className="p-6 mt-4 elev rounded-xl lg:w-1/3 md:w-2/3 sm:w-3/4 mx-auto">
                <h1 className="text-4xl text-center text-black">Welcome</h1>
                <hr />
                <p className="text-xl mt-4 text-green-700 mb-2">Register a new account.</p>
                <form>
                    <TextField onChange={(e) => setUser({ ...user, [e.target.name]: e.target.value })} id="outlined-basic" fullWidth type="text" name="name" label="Name" variant="outlined" required autoComplete="off" /> <br /> <br />
                    <TextField onChange={(e) => setUser({ ...user, [e.target.name]: e.target.value })} id="outlined-basic" fullWidth type="text" name="username" label="Username" variant="outlined" required autoComplete="off" /><br /> <br />
                    <TextField onChange={(e) => setUser({ ...user, [e.target.name]: e.target.value })} id="outlined-basic" fullWidth type="email" name="email" label="Email" variant="outlined" required autoComplete="off" /><br /> <br />
                    <TextField onChange={(e) => setUser({ ...user, [e.target.name]: e.target.value })} id="outlined-password" fullWidth name="password" label="Password" variant="outlined" required type={view ? 'text' : 'password'}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setView(!view)} edge="end">
                                        {view ? <EyeOff /> : <Eye />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    /> <br />
                    <br />
                    <TextField onChange={(e) => setUser({ ...user, [e.target.name]: e.target.value })} id="outlined-password" fullWidth name="confirm" label="Password" variant="outlined" required type={view ? 'text' : 'password'}
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
                    <div className="my-4 flex items-center justify-center">
                        or
                    </div>
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
                    <p>Already have an account?<NavLink to={'/'} className="text-blue-800 underline">Login?</NavLink></p><br />
                    <Button onClick={handleSubmit} variant="contained" color="success">Signup</Button>
                </form>
            </div>
        </div>
    )
}
