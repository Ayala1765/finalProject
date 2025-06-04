import React, { useState } from 'react'
import axios from 'axios'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setToken, setUser, setRole } from '../redux/tokenSlice'
import Register from './Register'
import ForgetPassword from './ForgetPassword'
const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogin = async () => {
        try {
            if (!email || !password) {
                alert('Please fill in all fields.')
                return
            }
            const res = await axios.post('http://localhost:1135/api/auth/login', { email, password })
            dispatch(setUser(res.data.user))
            dispatch(setRole(res.data.role))
            dispatch(setToken(res.data.token))
            navigate('/homeDonor')
        } catch (error) {
            console.log('Error logging in:', error)
            alert('Login failed. Please check your credentials.')
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleLogin()
        }
    }

    return (
        <div className="login-page-container">
            <div className="login-card">
                <h2 className="login-title">Login</h2>
                <div className="p-fluid">
                    <div className="field">
                        <span className="p-float-label">
                            <InputText
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="text"
                                className="w-full"
                            />
                            <label htmlFor="email">Email</label>
                        </span>
                    </div>
                    <div className="field">
                        <span className="p-float-label">
                            <InputText
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                className="w-full"
                                onKeyDown={handleKeyDown}
                            />
                            <label htmlFor="password">Password</label>
                        </span>
                    </div>

                    <Button
                        label="Login"
                        icon="pi pi-sign-in"
                        className="p-button-primary mt-4"
                        onClick={handleLogin}
                    />

                   
                    <div className="login-aux-links mt-4"> 
                        <ForgetPassword /> 
                         <Register />      
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login