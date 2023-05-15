import { authApi } from "../api/apiService";

export const assignmentsApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourseAssignments: builder.query({
      query: ({ course_id, search }) =>
        `api/courses/${course_id}/assignments?ordering=-datetime&search=${search}`,
    }),
    getAssignment: builder.query({
      query: ({ assignment_id }) => `api/assignments/${assignment_id}`,
    }),
    getTeacherAssignments: builder.query({
      query: ({ teacher_id, search }) =>
        `api/teachers/${teacher_id}/assignments?ordering=-datetime&search=${search}`,
    }),
    getAssignmentMarks: builder.query({
      query: ({ assignment_id }) => `api/assignments/${assignment_id}/marks`,
    }),
    getAssignmentMarksByEnrollments: builder.query({
      query: ({ assignment_id, search }) =>
        `api/assignments/${assignment_id}/marks-grouped?search=${search}`,
      keepUnusedDataFor: 5,
    }),
    addAssignment: builder.mutation({
      query: ({ course_id, ...data }) => ({
        url: `/api/courses/${course_id}/assignments`,
        method: "POST",
        body: data,
      }),
    }),
    updateAssignment: builder.mutation({
      query: ({ assignment_id, ...data }) => ({
        url: `/api/assignments/${assignment_id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteAssignment: builder.mutation({
      query: ({ assignment_id }) => ({
        url: `/api/assignments/${assignment_id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCourseAssignmentsQuery,
  useGetAssignmentQuery,
  useGetTeacherAssignmentsQuery,
  useGetAssignmentMarksByEnrollmentsQuery,
  useGetAssignmentMarksQuery,
  useAddAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
  useLazyGetAssignmentMarksByEnrollmentsQuery,
} = assignmentsApiSlice;
