import { authApi } from "../api/apiService";

export const academicYearsApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getYears: builder.query({
      query: ({ school_id, page }) =>
        `/api/schools/${school_id}/years?page=${page}`,
      keepUnusedDataFor: 5,
    }),
    getYearsWithoutPage: builder.query({
      query: ({ school_id }) => `/api/schools/${school_id}/years`,
      keepUnusedDataFor: 5,
    }),
    addYear: builder.mutation({
      query: ({ ...data }) => ({
        url: `/api/years`,
        method: "POST",
        body: data,
      }),
    }),
    updateYear: builder.mutation({
      query: ({ year_id, ...data }) => ({
        url: `/api/years/${year_id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetYearsQuery,
  useGetYearsWithoutPageQuery,
  useAddYearMutation,
  useUpdateYearMutation,
} = academicYearsApiSlice;
