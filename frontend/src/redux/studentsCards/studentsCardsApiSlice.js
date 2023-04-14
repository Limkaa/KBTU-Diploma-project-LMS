import { authApi } from "../api/apiService";

export const studentsCardsApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudentCard: builder.query({
      query: ({ student_id }) => `/api/students/${student_id}`,
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetStudentCardQuery } = studentsCardsApiSlice;
