import { authApi } from "../api/apiService";

export const finalMarksOfCourseApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getFinalMarksOfCourse: builder.query({
      query: ({ course_id, page, search, term }) =>
        `/api/courses/${course_id}/final-marks?page=${page}&search=${search}&ordering=student__user__last_name`,
      keepUnusedDataFor: 5,
    }),
    getFinalMarksOfStudent: builder.query({
      query: ({ student_id, page, search, year }) =>
        `/api/students/${student_id}/final-marks?page=${page}&search=${search}&ordering=terms_average&year=${year}`,
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetFinalMarksOfCourseQuery, useGetFinalMarksOfStudentQuery } =
  finalMarksOfCourseApiSlice;
