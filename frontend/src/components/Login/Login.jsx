import React from 'react';
import {useContext} from "react";
import AuthContext from "../../context/AuthProvider";

function Login() {
    let {loginUser} = useContext(AuthContext);
    return (
        <form onSubmit={loginUser}>
            <h1>StudyMate</h1>
            <div className="form-group">
                <input
                    placeholder='Username'
                    type='email'
                    id='email'
                    name='email'
                    required
                    autoFocus
                />
                <input
                    placeholder='Password'
                    type='password'
                    id='password'
                    name='password'
                    required
                />
            </div>
            <button type='submit'>Login</button>
        </form>
    );
}

export default Login;