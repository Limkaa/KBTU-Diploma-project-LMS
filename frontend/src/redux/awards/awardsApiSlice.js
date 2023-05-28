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
    updateAward: builder.mutation({
      query: ({ award_id, ...data }) => ({
        url: `/api/awards/${award_id}`,
        method: "PUT",
        body: data,
      }),
    }),
    getStudentAwards: builder.query({
      query: (studentId) => `/api/students/${studentId}/awards`,
    })
  }),
});

export const {
  useGetAwardQuery,
  useCreateAwardMutation,
  useUpdateAwardMutation,
  useGetStudentAwardsQuery,
} = awardsApiSlice;
