import {authApi} from "../api/apiService";

export const usersApiSlice = authApi.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: (scId) => `/api/schools/1/users`,
            keepUnusedDataFor: 5,
        })
    })
});

export const {useGetUsersQuery} = usersApiSlice;