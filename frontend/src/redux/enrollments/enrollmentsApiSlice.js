import { authApi } from "../api/apiService";

export const enrollmentsApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourseEnrollments: builder.query({
      query: ({ course_id, page, search }) =>
        `/api/courses/${course_id}/enrollments?page=${page}&ordering=student__user__last_name&search=${search}`,
    }),
    getStudentsWithTransferredEnrollments: builder.query({
      query: ({ course_id, page, search }) =>
        `/api/courses/${course_id}/transferred-enrollments?page=${page}&ordering=student__user__last_name&search=${search}`,
    }),
    getNotEnrolledStudents: builder.query({
      query: ({ course_id, page, search }) =>
        `/api/courses/${course_id}/not-enrolled-students?page=${page}&ordering=student__user__last_name&search=${search}`,
    }),
    createEnrollment: builder.mutation({
      query: ({ course_id, ...data }) => ({
        url: `/api/courses/${course_id}/enrollments`,
        method: "POST",
        body: data,
      }),
    }),
    updateEnrollment: builder.mutation({
      query: ({ course_id, enrollment_id, ...data }) => ({
        url: `/api/courses/${course_id}/enrollments/${enrollment_id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetCourseEnrollmentsQuery,
  useGetStudentsWithTransferredEnrollmentsQuery,
  useGetNotEnrolledStudentsQuery,
  useCreateEnrollmentMutation,
  useUpdateEnrollmentMutation,
  useLazyGetCourseEnrollmentsQuery,
  useLazyGetNotEnrolledStudentsQuery,
  useLazyGetStudentsWithTransferredEnrollmentsQuery,
} = enrollmentsApiSlice;
