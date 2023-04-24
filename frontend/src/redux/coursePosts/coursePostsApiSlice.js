import { authApi } from "../api/apiService";

export const coursePostsApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getCoursePosts: builder.query({
      query: ({ course_id }) => `/api/courses/${course_id}/posts`,
      keepUnusedDataFor: 5,
    }),
    // getYearsWithoutPage: builder.query({
    //   query: ({ school_id }) => `/api/schools/${school_id}/years`,
    //   keepUnusedDataFor: 5,
    // }),
    // addYear: builder.mutation({
    //   query: ({ ...data }) => ({
    //     url: `/api/years`,
    //     method: "POST",
    //     body: data,
    //   }),
    // }),
    // updateYear: builder.mutation({
    //   query: ({ year_id, ...data }) => ({
    //     url: `/api/years/${year_id}`,
    //     method: "PUT",
    //     body: data,
    //   }),
    // }),
  }),
});

export const {
  useGetCoursePostsQuery,
  //   useGetYearsWithoutPageQuery,
  //   useAddYearMutation,
  //   useUpdateYearMutation,
} = coursePostsApiSlice;
