import { authApi } from "../api/apiService";

export const usersApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ school_id, page }) =>
        `/api/schools/${school_id}/users?page=${page}`,
      keepUnusedDataFor: 5,
    }),
    addUser: builder.mutation({
      query: ({ school_id, ...values }) => ({
        url: `/api/schools/${school_id}/users`,
        method: "POST",
        body: values,
      }),
    }),
  }),
});

export const { useGetUsersQuery, useAddUserMutation } = usersApiSlice;
