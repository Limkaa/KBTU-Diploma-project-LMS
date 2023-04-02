import { authApi } from "../api/apiService";

export const subjectsApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubjects: builder.query({
      query: ({ school_id, page }) =>
        `/api/schools/${school_id}/subjects?page=${page}`,
      keepUnusedDataFor: 5,
    }),
    addSubjects: builder.mutation({
      query: ({ ...data }) => ({
        url: `/api/subjects`,
        method: "POST",
        body: data,
      }),
    }),
    updateSchoolGrade: builder.mutation({
      query: ({ subject_id, ...data }) => ({
        url: `/api/subjects/${subject_id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetSubjectsQuery,
  useAddSubjectsMutation,
  useUpdateSubjectsMutation,
} = subjectsApiSlice;
