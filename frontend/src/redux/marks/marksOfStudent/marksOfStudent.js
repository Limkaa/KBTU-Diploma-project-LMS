import { authApi } from "../api/apiService";

export const assignmentsApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getMarksOfStudent: builder.query({
      query: ({ student_id, search }) =>
        `api/students/${student_id}/marks?page=1&term=&year&subject__grade=6&search&ordering=-average_mark`,
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useCreateMarkMutation,
  useUpdateMarkMutation,
  useDeleteMarkMutation,
} = assignmentsApiSlice;
