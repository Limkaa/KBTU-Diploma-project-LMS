import { authApi } from "../api/apiService";

export const termsApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getTerms: builder.query({
      query: ({ year_id, page }) => `/api/years/${year_id}/terms?page=${page}`,
      keepUnusedDataFor: 5,
    }),
    addTerm: builder.mutation({
      query: ({ ...data }) => ({
        url: `/api/terms`,
        method: "POST",
        body: data,
      }),
    }),
    updateTerm: builder.mutation({
      query: ({ term_id, ...data }) => ({
        url: `/api/terms/${term_id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const { useGetTermsQuery, useAddTermMutation, useUpdateTermMutation } =
  termsApiSlice;
