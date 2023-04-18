import { authApi } from "../api/apiService";

export const assignmentsApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourseAssignments: builder.query({
      query: ({ course_id }) =>
        `api/courses/${course_id}/assignments?ordering=-datetime`,
      keepUnusedDataFor: 5,
    }),
    // addTerm: builder.mutation({
    //   query: ({ ...data }) => ({
    //     url: `/api/terms`,
    //     method: "POST",
    //     body: data,
    //   }),
    // }),
    // updateTerm: builder.mutation({
    //   query: ({ term_id, ...data }) => ({
    //     url: `/api/terms/${term_id}`,
    //     method: "PUT",
    //     body: data,
    //   }),
    // }),
  }),
});

export const { useGetCourseAssignmentsQuery } = assignmentsApiSlice;
