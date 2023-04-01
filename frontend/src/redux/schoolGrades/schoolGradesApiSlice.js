import { authApi } from "../api/apiService";

export const schoolGradesApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchoolGrades: builder.query({
      query: ({ school_id }) => `/api/schools/${school_id}/grades`,
      keepUnusedDataFor: 5,
    }),
    addSchoolGrade: builder.mutation({
      query: ({ ...data }) => ({
        url: `/api/schools/2/grades`,
        method: "POST",
        body: data,
      }),
    }),
    updateSchoolGrade: builder.mutation({
      query: ({ school_id, ...data }) => ({
        url: `/api/grades/${school_id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetSchoolGradesQuery,
  useAddSchoolGradeMutation,
  useUpdateSchoolGradeMutation,
} = schoolGradesApiSlice;
