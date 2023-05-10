import { authApi } from "../api/apiService";

export const coursesApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSchoolCourses: builder.query({
      query: (school_id) => `/api/schools/${school_id}/courses`,
      keepUnusedDataFor: 5,
    }),
    getSchoolCourses: builder.query({
      query: ({ school_id, page, search }) =>
        `/api/schools/${school_id}/courses?page=${page}&search=${search}`,
    }),
    getTeacherCourses: builder.query({
      query: ({ teacher_id, year_id, search }) =>
        `/api/teachers/${teacher_id}/courses?year=${year_id}&search=${search}`,
    }),
    getTeacherCoursesWithout: builder.query({
      query: ({ teacher_id, year_id }) =>
        `/api/teachers/${teacher_id}/courses?year=${year_id}`,
    }),
    getGroupCourses: builder.query({
      query: ({ group_id, year_id, search }) =>
        `/api/groups/${group_id}/courses?year=${year_id}&search=${search}`,
    }),
    getCourseStudents: builder.query({
      query: ({ course_id, search }) =>
        `/api/courses/${course_id}/students`,
    }),
    getCourse: builder.query({
      query: ({ id }) => `/api/courses/${id}`,
    }),
    addCourse: builder.mutation({
      query: ({ school_id, ...data }) => ({
        url: `/api/schools/${school_id}/courses`,
        method: "POST",
        body: data,
      }),
    }),
    updateCourse: builder.mutation({
      query: ({ course_id, ...data }) => ({
        url: `/api/courses/${course_id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllSchoolCoursesQuery,
  useGetSchoolCoursesQuery,
  useGetCourseQuery,
  useLazyGetGroupCoursesQuery,
  useLazyGetTeacherCoursesQuery,
  useLazyGetTeacherCoursesWithoutQuery,
  useGetCourseStudentsQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
} = coursesApiSlice;
