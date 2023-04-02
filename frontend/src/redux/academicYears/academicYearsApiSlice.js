import { authApi } from "../api/apiService";

export const academicYearsApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getAcademicYears: builder.query({
      query: ({ school_id, page }) =>
        `/api/schools/${school_id}/years?page=${page}`,
      keepUnusedDataFor: 5,
    }),
    addAcademicYears: builder.mutation({
      query: ({ ...data }) => ({
        url: `/api/years`,
        method: "POST",
        body: data,
      }),
    }),
    updateAcademicYears: builder.mutation({
      query: ({ years_id, ...data }) => ({
        url: `/api/years/${years_id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAcademicYearsQuery,
  useAddAcademicYearsMutation,
  useUpdateAcademicYearsMutation,
} = academicYearsApiSlice;
