import { createSlice } from '@reduxjs/toolkit'
import { userLogin } from './authActions'
import Cookies from "universal-cookie/lib";
import jwtDecode from "jwt-decode";

const cookies = new Cookies();

// initialize userToken from local storage
const userAccessToken = cookies.get('authToken') ? cookies.get('authToken') : null;
const userRefreshToken = cookies.get('refToken') ? cookies.get('authToken') : null;
const user = cookies.get('authToken') ? jwtDecode(cookies.get('authToken')) : null;

const initialState = {
    loading: false,
    user,
    userAccessToken,
    userRefreshToken,
    error: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: {
        // login user
        [userLogin.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [userLogin.fulfilled]: (state, { payload }) => {
            state.loading = false;
            state.user = jwtDecode(payload.access);
            state.userRefreshTokenToken = payload.refresh;
            state.userAccessTokenToken = payload.access;
        },
        [userLogin.rejected]: (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        },
        // register user reducer...
    },
    // extraReducers: (builder) => {
    //     builder
    //         .addCase(userLogin.pending, (state, {payload}) => {
    //             state.loading = true;
    //             state.error = null;
    //         })
    //         .addCase(userLogin.fulfilled, (state, {payload}) => {
    //             state.loading = false;
    //             state.user = jwtDecode(payload.access);
    //             state.userRefreshTokenToken = payload.refresh;
    //             state.userAccessTokenToken = payload.access;
    //         })
    //         .addCase(userLogin.rejected, (state, {payload}) => {
    //             state.loading = false;
    //             state.error = payload;
    //         })
    // },
})
export default authSlice.reducer;