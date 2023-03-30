import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {logout, setRefreshToken} from "../auth/authSlice";

const baseQuery = fetchBaseQuery({
    // base url of backend API
    baseUrl: 'http://127.0.0.1:8000/',
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
    let result = await baseQuery(args, api, extraOptions);
    if (result?.error?.originalStatus === 403) {
    // if (result?.status === 403) {
            // send refresh
            const refreshResult = await baseQuery('/api/auth/token/refresh', api, extraOptions);
            console.log(`baseQueryWithRefresh ${refreshResult}`);
            if (refreshResult?.data) {
                const user = api.getState().auth.user;
                api.dispatch(setRefreshToken({...refreshResult.data}));
                // retry the original query
                result = await baseQuery(args, api, extraOptions);
            } else {
                api.dispatch(logout());
            }
        }
};

export const authApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithRefresh,
    endpoints: builder => ({}),
});

export const { useGetUsersQuery } = authApi;