import React from 'react';
import {useContext} from "react";
import {useDispatch, useSelector} from "react-redux";
import {logOut, selectCurrentToken, selectCurrentUser} from "../redux/auth/authSlice";
// import AuthContext from "../context/AuthProvider";

const HomePage = () => {
    // const {user, logoutUser} = useContext(AuthContext);
    const dispatch = useDispatch();
    // const user = useSelector(selectCurrentUser);
    // const token = useSelector(selectCurrentToken);
    const {user} = useSelector(state => state.auth);
    return (
        <div>
            {user && <p>Hello, {user.first_name}</p>}
            {/*{user && <button onClick={dispatch(logOut())}>Logout</button>}*/}
        </div>
    );
};

export default HomePage;