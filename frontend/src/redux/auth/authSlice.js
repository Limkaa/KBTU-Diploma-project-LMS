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
        }
    },
    // extraReducers: (builder) => {
    //     builder
    //         .addCase(userLogin.pending, (state) => {
    //             state.loading = true;
    //             state.error = null;
    //         })
    //         .addCase(userLogin.fulfilled, (state, {payload}) => {
    //             state.loading = false;
    //             state.user = jwtDecode(payload.access);
    //             state.userRefreshToken = payload.refresh;
    //             state.userAccessToken = payload.access;
    //         })
    //         .addCase(userLogin.rejected, (state, {payload}) => {
    //             state.loading = false;
    //             state.error = payload;
    //         })
    // },
});

// export const authMiddleware = (store) => (next) => (action) => {
//     const result = next(action);
//     if ( action.type?.startsWith('auth/')) {
//         const authState = store.getState().auth;
//         cookies.set('authToken', authState.userAccessToken, { path: '/' });
//         cookies.set('refToken', authState.userRefreshToken, { path: '/' });
//     }
//     return result;
// };
//
// export const localStorageMiddleware = ({ getState }) => {
//     return next => action => {
//         const result = next(action);
//         localStorage.setItem('applicationState', JSON.stringify(getState()));
//         return result;
//     };
// };

// const preloadCookieStore = () => {
//     if (cookies.get('authToken') !== null || cookies.get('authToken')) {
//         return JSON.parse(localStorage.getItem('applicationState')); // re-hydrate the store
//     }
// };

export default authSlice.reducer;
export const { logout, setCredentials, setRefreshToken} = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
// export const selectCurrent = (state) => state.auth.user;
