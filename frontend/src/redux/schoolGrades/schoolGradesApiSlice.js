import { authApi } from "../api/apiService";

export const schoolGradesApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchoolGrades: builder.query({
      query: ({ school_id, page }) =>
        `/api/schools/${school_id}/grades?page=${page}`,
      keepUnusedDataFor: 5,
    }),
    getSchoolGradesWithoutPage: builder.query({
      query: ({ school_id }) => `/api/schools/${school_id}/grades`,
      keepUnusedDataFor: 5,
    }),
    addSchoolGrade: builder.mutation({
      query: ({ ...data }) => ({
        url: `/api/grades`,
        method: "POST",
        body: data,
      }),
    }),
    updateSchoolGrade: builder.mutation({
      query: ({ grade_id, ...data }) => ({
        url: `/api/grades/${grade_id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetSchoolGradesQuery,
  useGetSchoolGradesWithoutPageQuery,
  useAddSchoolGradeMutation,
  useUpdateSchoolGradeMutation,
} = schoolGradesApiSlice;
