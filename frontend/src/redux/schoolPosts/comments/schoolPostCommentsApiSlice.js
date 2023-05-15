import { authApi } from "../../api/apiService";

export const schoolPostCommentsApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchoolPostComments: builder.query({
      query: ({ post_id }) => `/api/schools-posts/${post_id}/comments`,
    }),
    addSchoolPostComment: builder.mutation({
      query: ({ post_id, ...data }) => ({
        url: `/api/schools-posts/${post_id}/comments`,
        method: "POST",
        body: data,
      }),
    }),
    updateSchoolPostComment: builder.mutation({
      query: ({ comment_id, ...data }) => ({
        url: `/api/schools-posts-comments/${comment_id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteSchoolPostComment: builder.mutation({
      query: ({ comment_id }) => ({
        url: `/api/schools-posts-comments/${comment_id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetSchoolPostCommentsQuery,
  useAddSchoolPostCommentMutation,
  useUpdateSchoolPostCommentMutation,
  useDeleteSchoolPostCommentMutation,
} = schoolPostCommentsApiSlice;
