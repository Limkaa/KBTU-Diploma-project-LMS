import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector } from 'react-redux';
import {useNavigate, Navigate, useLocation} from "react-router-dom";
import {useTokenObtainMutation} from "../../redux/api/authApiSlice";
import {setCredentials} from "../../redux/auth/authSlice";
import Alert from "../Alert/Alert";
import { selectCurrentUser } from "../../redux/auth/authSlice";

function Login() {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [err, setErr] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectCurrentUser);
    const location = useLocation();

    const [obtainTokens, {isLoading}] = useTokenObtainMutation();

    useEffect(() => {
        setErr('');
    }, [email, password])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userTokens = await obtainTokens({email, password}).unwrap();
            dispatch(setCredentials({userAccessToken: userTokens.access, userRefreshToken: userTokens.refresh}));
            setEmail("");
            setPassword("");
            navigate('/');
        } catch(err) {
            console.log(err);
            if (err?.response) {
                setErr("No server response");
            } else if (err.response?.status === 401) {
                setErr("No active account with given credentials");
            } else {
                setErr("Login failed");
            }
        }
    }

    if(user){
        return <Navigate to="/" state={{ from: location }} replace />
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>StudyMate</h1>
            {err !== "" && <Alert message={err}/>}
            <div className="form-group">
                <input
                    placeholder='Username'
                    type='email'
                    id='email'
                    name='email'
                    required
                    autoFocus
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <input
                    placeholder='Password'
                    type='password'
                    id='password'
                    name='password'
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
            </div>
            <button type='submit'>Login</button>
        </form>
    );
}

export default Login;