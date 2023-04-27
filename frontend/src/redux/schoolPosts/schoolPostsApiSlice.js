import { authApi } from "../api/apiService";

export const schoolPostsApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchoolPosts: builder.query({
      query: ({ school_id }) =>
        `/api/schools/${school_id}/posts?ordering=-updated_at`,
    }),
    addSchoolPost: builder.mutation({
      query: ({ school_id, ...data }) => ({
        url: `/api/schools/${school_id}/posts`,
        method: "POST",
        body: data,
      }),
    }),
    updateSchoolPost: builder.mutation({
      query: ({ post_id, ...data }) => ({
        url: `/api/schools-posts/${post_id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteSchoolPost: builder.mutation({
      query: ({ post_id }) => ({
        url: `/api/schools-posts/${post_id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetSchoolPostsQuery,
  useAddSchoolPostMutation,
  useUpdateSchoolPostMutation,
  useDeleteSchoolPostMutation,
} = schoolPostsApiSlice;
