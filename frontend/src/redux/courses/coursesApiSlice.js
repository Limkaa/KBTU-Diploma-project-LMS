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
    getSchoolCoursesWithout: builder.query({
      query: ({ school_id, grade, year_id }) =>
        `/api/schools/${school_id}/courses?subject__grade=${grade}&year=${year_id}`,
    }),
    getTeacherCourses: builder.query({
      query: ({ teacher_id, search, year_id }) =>
        `/api/teachers/${teacher_id}/courses?search=${search}&year=${year_id}`,
    }),
    getTeacherCoursesWithout: builder.query({
      query: ({ teacher_id, year_id, grade }) =>
        `/api/teachers/${teacher_id}/courses?year=${year_id}&subject__grade=${grade}`,
    }),
    getGroupCourses: builder.query({
      query: ({ group_id, subject__grade, search }) =>
        `/api/groups/${group_id}/courses?subject__grade=${subject__grade}&search=${search}`,
    }),
    getCourseStudents: builder.query({
      query: ({ course_id, search }) => `/api/courses/${course_id}/students`,
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
  useLazyGetSchoolCoursesWithoutQuery,
  useGetCourseQuery,
  useLazyGetGroupCoursesQuery,
  useLazyGetTeacherCoursesQuery,
  useLazyGetTeacherCoursesWithoutQuery,
  useGetCourseStudentsQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
} = coursesApiSlice;
