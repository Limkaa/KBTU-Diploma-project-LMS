import React, {useEffect} from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {userLogin} from "../../redux/auth/authActions";
import {useNavigate} from "react-router-dom";

function Login() {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const { loading, error, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/home');
        }
    }, [navigate, user]);

    // useEffect(() => {
    //     if (user) {
    //         ;
    //     }
    // }, [loading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(userLogin({email, password}));
        navigate('/home');
    }

    const content = loading ? <h1>Loading...</h1> : (
        <form onSubmit={handleSubmit}>
            <h1>StudyMate</h1>
            <div className="form-group">
                <input
                    placeholder='Username'
                    type='email'
                    id='email'
                    name='email'
                    required
                    autoFocus
                    onChange={(e) => setEmail(e.target.value)}
                    value = {email}
                />
                <input
                    placeholder='Password'
                    type='password'
                    id='password'
                    name='password'
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    value = {password}
                />
            </div>
            {error && <p>{error}</p>}
            <button type='submit'>Login</button>
        </form>
    );

    return content;
}

export default Login;