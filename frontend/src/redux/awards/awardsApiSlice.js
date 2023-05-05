import { authApi } from "../api/apiService";

export const awardsApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getAward: builder.query({
      query: ({ award_id }) => `/api/awards/${award_id}`,
    }),
    createAward: builder.mutation({
      query: ({ school_id, ...data }) => ({
        url: `/api/schools/${school_id}/awards`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetAwardQuery, useCreateAwardMutation } = awardsApiSlice;
