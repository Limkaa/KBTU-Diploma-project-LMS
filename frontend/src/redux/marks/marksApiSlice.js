import { authApi } from "../api/apiService";

export const assignmentsApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    createMark: builder.mutation({
      query: ({ assignment_id, ...data }) => ({
        url: `/api/assignments/${assignment_id}/marks`,
        method: "POST",
        body: data,
      }),
    }),
    updateMark: builder.mutation({
      query: ({ mark_id, ...data }) => ({
        url: `/api/marks/${mark_id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteMark: builder.mutation({
      query: ({ mark_id }) => ({
        url: `/api/marks/${mark_id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateMarkMutation,
  useUpdateMarkMutation,
  useDeleteMarkMutation,
} = assignmentsApiSlice;
