import { authApi } from "../../api/apiService";

export const coursePostCommentsApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getCoursePostComments: builder.query({
      query: ({ post_id }) => `/api/courses-posts/${post_id}/comments`,
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
  useGetCoursePostCommentsQuery,
  //   useGetYearsWithoutPageQuery,
  //   useAddYearMutation,
  //   useUpdateYearMutation,
} = coursePostCommentsApiSlice;
