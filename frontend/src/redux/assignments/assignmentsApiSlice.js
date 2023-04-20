import { authApi } from "../api/apiService";

export const assignmentsApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourseAssignments: builder.query({
      query: ({ course_id, search }) =>
        `api/courses/${course_id}/assignments?ordering=-datetime&search=${search}`,
      keepUnusedDataFor: 5,
    }),
    getAssignment: builder.query({
      query: ({ assignment_id }) => `api/assignments/${assignment_id}`,
      keepUnusedDataFor: 5,
    }),
    addAssignment: builder.mutation({
      query: ({ course_id, ...data }) => ({
        url: `/api/courses/${course_id}/assignments`,
        method: "POST",
        body: data,
      }),
    }),
    // updateTerm: builder.mutation({
    //   query: ({ term_id, ...data }) => ({
    //     url: `/api/terms/${term_id}`,
    //     method: "PUT",
    //     body: data,
    //   }),
    // }),
  }),
});

export const {
  useGetCourseAssignmentsQuery,
  useGetAssignmentQuery,
  useAddAssignmentMutation,
} = assignmentsApiSlice;
