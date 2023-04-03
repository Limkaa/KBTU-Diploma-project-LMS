import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {logout, setAccessToken} from "../auth/authSlice";

const baseQuery = fetchBaseQuery({
    // base url of backend API
    baseUrl: 'http://127.0.0.1:8000/',
    // isJsonContentType: true,
    // prepareHeaders is used to configure the header of every request and gives access to getState which we use to include the token from the store
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.userAccessToken;
        if (token) {
            // include token in req header
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithRefresh = async (args, api, extraOptions) => {
    console.log('base query');
    let result = await baseQuery(args, api, extraOptions);
    // console.log(result?.error?.status);
    if (result?.error?.status === 401) {
            // send refresh
            const refreshToken = api.getState().auth.userRefreshToken;
            // console.log("tokennn" + refreshToken);
            const refreshResult = await baseQuery({
                url: '/api/auth/token/refresh',
                method: 'POST',
                headers: {'Content-type': 'Application/json'},
                body: JSON.stringify({"refresh" : refreshToken}),
                },
                api, extraOptions);
            console.log(`baseQueryWithRefresh ${refreshResult}`);
            if (refreshResult?.data) {
                // const user = api.getState().auth.user;
                api.dispatch(setAccessToken({userAccessToken: refreshResult.data.access}));
                // retry the original query
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