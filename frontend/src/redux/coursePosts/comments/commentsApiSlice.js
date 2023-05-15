import { authApi } from "../../api/apiService";

export const coursePostCommentsApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getCoursePostComments: builder.query({
      query: ({ post_id }) => `/api/courses-posts/${post_id}/comments`,
    }),
    addCoursePostComment: builder.mutation({
      query: ({ post_id, ...data }) => ({
        url: `/api/courses-posts/${post_id}/comments`,
        method: "POST",
        body: data,
      }),
    }),
    updateCoursePostComment: builder.mutation({
      query: ({ comment_id, ...data }) => ({
        url: `/api/courses-posts-comments/${comment_id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteCoursePostComment: builder.mutation({
      query: ({ comment_id }) => ({
        url: `/api/courses-posts-comments/${comment_id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCoursePostCommentsQuery,
  useAddCoursePostCommentMutation,
  useUpdateCoursePostCommentMutation,
  useDeleteCoursePostCommentMutation,
} = coursePostCommentsApiSlice;
