import { authApi } from "../api/apiService";

export const usersApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ school_id, page }) =>
        `/api/schools/${school_id}/users?page=${page}`,
      keepUnusedDataFor: 5,
    }),
    addUser: builder.mutation({
      query: ({ school_id, ...data }) => ({
        url: `/api/schools/${school_id}/users`,
        method: "POST",
        // headers: {
        //   "content-type": "multipart/form-data",
        // },
        body: data,
      }),
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/users/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    getTeachers: builder.query({
      query: (school_id) =>
          `/api/schools/${school_id}/teachers`
    })
  }),
});

export const {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useGetTeachersQuery
} =
  usersApiSlice;
