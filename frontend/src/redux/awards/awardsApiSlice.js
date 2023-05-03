import { authApi } from "../api/apiService";

export const awardsApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getAward: builder.query({
      query: ({ award_id }) =>
        `/api/awards/${award_id}`,
    }),
  }),
});

export const { useGetAwardQuery } = awardsApiSlice;
