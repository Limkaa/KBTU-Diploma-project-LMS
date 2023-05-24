import { authApi } from "../../api/apiService";

export const marksOfStudentApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getMarksOfStudent: builder.query({
      query: ({ student_id, search, grade }) =>
        `api/students/${student_id}/marks?page=1&term=&year&subject__grade=${grade}&search=${search}&ordering=-average_mark`,
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetMarksOfStudentQuery } = marksOfStudentApiSlice;
