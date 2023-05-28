import { authApi } from "../../api/apiService";

export const marksOfCourseApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getMarksOfCourse: builder.query({
      query: ({ course_id, page, search, term }) =>
        `/api/courses/${course_id}/marks?page=${page}&search=${search}&term=${term}`,
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetMarksOfCourseQuery } = marksOfCourseApiSlice;
