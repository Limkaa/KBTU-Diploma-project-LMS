import { authApi } from "../api/apiService";

export const coursePostsApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getCoursePosts: builder.query({
      query: ({ course_id }) =>
        `/api/courses/${course_id}/posts?ordering=-updated_at`,
      keepUnusedDataFor: 5,
    }),
    addCoursePost: builder.mutation({
      query: ({ course_id, ...data }) => ({
        url: `/api/courses/${course_id}/posts`,
        method: "POST",
        body: data,
      }),
    }),
    updateCoursePost: builder.mutation({
      query: ({ post_id, ...data }) => ({
        url: `/api/courses-posts/${post_id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteCoursePost: builder.mutation({
      query: ({ post_id }) => ({
        url: `/api/courses-posts/${post_id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCoursePostsQuery,
  useAddCoursePostMutation,
  useUpdateCoursePostMutation,
  useDeleteCoursePostMutation,
} = coursePostsApiSlice;
