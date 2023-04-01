import { createSlice } from '@reduxjs/toolkit';
import Cookies from "universal-cookie/lib";
import jwtDecode from "jwt-decode";

const cookies = new Cookies();

// initialize userToken from cookie
let userAccessToken = cookies.get('authToken') ? cookies.get('authToken') : null;
let userRefreshToken = cookies.get('refToken') ? cookies.get('refToken') : null;
let user = (cookies.get('authToken') && cookies.get('authToken') !== null) ? jwtDecode(cookies.get('authToken')) : null;

const initialState = {
    user,
    userAccessToken,
    userRefreshToken,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            console.log('logout');
            cookies.remove('authToken');
            cookies.remove('refToken');
            state.user = null;
            state.userAccessToken = null;
            state.userRefreshToken = null;
        },
        setCredentials: (state, action) => {
            const {userAccessToken, userRefreshToken} = action.payload;
            // state.user = user;
            state.userAccessToken = userAccessToken;
            state.userRefreshToken = userRefreshToken;
            state.user = jwtDecode(userRefreshToken);
            cookies.set('authToken', state.userAccessToken, { path: '/' });
            cookies.set('refToken', state.userRefreshToken, { path: '/' });
        },
        setRefreshToken: (state, action) => {
            const {userRefreshToken} = action.payload;
            state.userRefreshToken = userRefreshToken;
            cookies.set('refToken', state.userRefreshToken, { path: '/' });
        },
        setAccessToken: (state, action) => {
            const {userAccessToken} = action.payload;
            state.userAccessToken = userAccessToken;
            cookies.set('authToken', state.userAccessToken, { path: '/' });
        },
    },
});

export default authSlice.reducer;
export const { logout, setCredentials, setRefreshToken, setAccessToken} = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
