import { authApi } from "../api/apiService";

export const winnersApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getWinnersOfAward: builder.query({
      query: ({ award_id, page }) =>
        `/api/awards/${award_id}/winners?page=${page}`,
    }),
  }),
});

export const { useGetWinnersOfAwardQuery } = winnersApiSlice;
