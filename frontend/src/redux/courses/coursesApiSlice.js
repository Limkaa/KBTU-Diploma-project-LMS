import { authApi } from "../api/apiService";

export const coursesApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchoolCourses: builder.query({
      query: ({ school_id, page }) =>
        `/api/schools/${school_id}/courses?page=${page}`,
      keepUnusedDataFor: 5,
    }),
    getTeacherCourses: builder.query({
      query: ({ teacher_id, page }) =>
        `/api/teachers/${teacher_id}/courses?page=${page}`,
      keepUnusedDataFor: 5,
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
  useGetSchoolCoursesQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
} = coursesApiSlice;
