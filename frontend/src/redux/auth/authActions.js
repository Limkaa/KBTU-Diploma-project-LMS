import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie/lib";

const backendURL = 'http://127.0.0.1:8000';
const cookies = new Cookies();

export const userLogin = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            // configure header's Content-Type as JSON
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const { data } = await axios.post(
                `${backendURL}/api/auth/token/obtain`,
                { email, password },
                config
            );
            // store user's tokens in cookie
            cookies.set('authToken', data.access, { path: '/' });
            cookies.set('refToken', data.refresh, { path: '/' });
            return data;
        } catch (error) {
            // return custom error message from API if any
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
)