import { authApi } from "../api/apiService";

export const winnersApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getWinnersOfAward: builder.query({
      query: ({ award_id, page }) =>
        `/api/awards/${award_id}/winners?page=${page}`,
    }),
    getCourseWinners: builder.query({
      query: ({ course_id, award_id, page }) =>
        `/api/courses/${course_id}/winners?award=${award_id}&page=${page}`,
    }),
    createCourseWinner: builder.mutation({
      query: ({ course_id, ...data }) => ({
        url: `/api/courses/${course_id}/winners`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetWinnersOfAwardQuery,
  useGetCourseWinnersQuery,
  useCreateCourseWinnerMutation,
} = winnersApiSlice;
