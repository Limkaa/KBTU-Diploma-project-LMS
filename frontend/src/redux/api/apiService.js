import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {logout, setAccessToken} from "../auth/authSlice";

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8000/',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.userAccessToken;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithRefresh = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result?.error?.status === 401) {
            const refreshToken = api.getState().auth.userRefreshToken;
            const refreshResult = await baseQuery({
                url: '/api/auth/token/refresh',
                method: 'POST',
                headers: {'Content-type': 'Application/json'},
                body: JSON.stringify({"refresh" : refreshToken}),
                },
                api, extraOptions);
            if (refreshResult?.data) {
                api.dispatch(setAccessToken({userAccessToken: refreshResult.data.access}));
                result = await baseQuery(args, api, extraOptions);
            }
            else {
                api.dispatch(logout());
            }
        }
    return result;
};

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: baseQueryWithRefresh,
    endpoints: builder => ({}),
});