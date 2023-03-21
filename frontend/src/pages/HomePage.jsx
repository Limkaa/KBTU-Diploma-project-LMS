import React from 'react';
import {useContext} from "react";
import AuthContext from "../context/AuthProvider";

const HomePage = () => {
    const {user, logoutUser} = useContext(AuthContext);
    return (
        <div>
            {user && <p>Hello, {user.first_name}</p>}
            {user && <button onClick={logoutUser}>Logout</button>}
        </div>
    );
};

export default HomePage;