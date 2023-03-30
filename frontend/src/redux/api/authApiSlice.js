import {authApi} from "./apiService";

export const authApiSlice = authApi.injectEndpoints({
    endpoints: builder => ({
        tokenObtain: builder.mutation({
            query: credentials => ({
                url: '/api/auth/token/obtain',
                method: 'POST',
                body: {...credentials}
            }),
        })
    })
});

export const {useTokenObtainMutation} = authApiSlice;