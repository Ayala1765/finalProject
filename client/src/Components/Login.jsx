import React, { useState } from 'react'
import axios from 'axios'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { useNavigate } from 'react-router-dom'
import Register from './Register'
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setUser, setRole } from '../redux/tokenSlice';

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const handleLogin = async () => {
        try {
            if (!email || !password) {
                alert('Please fill in all fields.')
                return
            }
            console.log("👍👍😁😁💕💕"+email, password)
            const res = await axios.post('http://localhost:1135/auth/login', { email, password })
            console.log("!!!!!!!!!!!!!!!!!!"+res.data.user)
            dispatch(setUser(res.data.user))
            dispatch(setRole(res.data.role))
            dispatch(setToken(res.data.token))
            navigate('/homeDonor')
        } catch (error) {
            {
                console.log('Error logging in:', error);
                alert('Login failed. Please check your credentials.')
            }
        }
    }

    return (
        <div className="card">
            <div className="flex flex-column md:flex-row">
                <div className="w-full md:w-5 flex flex-column align-items-center justify-content-center gap-3 py-5">
                    <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                        <label className="w-6rem">Email</label>
                        <InputText
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="text"
                            className="w-12rem"
                        />
                    </div>
                    <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                        <label className="w-6rem">Password</label>
                        <InputText
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            className="w-12rem"
                        />
                    </div>
                    <Button
                        label="Login"
                        icon="pi pi-user"
                        className="w-10rem mx-auto"
                        onClick={handleLogin}
                    />
                </div>
            </div>
            <Register></Register>
        </div>
    );
};

export default Login