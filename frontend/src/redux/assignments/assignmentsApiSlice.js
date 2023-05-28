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
    getStudentOrTeacherAssignments: builder.query({
      query: ({type, studentId, teacherId}) => {
        if (type === "teacher") {
          return `api/teachers/${teacherId}/assignments?page=1`;
        }
        else if (type === "student") {
          return `api/students/${studentId}/assignments?page=1`;
        }
      }
    }),
    getStudentAssignments: builder.query({
      query: ({ student_id, search }) =>
        `api/students/${student_id}/assignments?ordering=-datetime&search=${search}`,
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
  useLazyGetAssignmentQuery,
  useGetTeacherAssignmentsQuery,
  useGetStudentOrTeacherAssignmentsQuery,
  useGetAssignmentMarksByEnrollmentsQuery,
  useGetAssignmentMarksQuery,
  useAddAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
  useLazyGetAssignmentMarksByEnrollmentsQuery,
  useGetStudentAssignmentsQuery,
} = assignmentsApiSlice;
