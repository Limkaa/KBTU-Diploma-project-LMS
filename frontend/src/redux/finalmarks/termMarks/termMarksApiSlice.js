import { authApi } from "../../api/apiService";

export const termMarksApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    createTermMark: builder.mutation({
      query: ({ course_id, ...data }) => ({
        url: `/api/courses/${course_id}/terms-marks`,
        method: "POST",
        body: data,
      }),
    }),
    updateTermMark: builder.mutation({
      query: ({ mark_id, ...data }) => ({
        url: `/api/terms-marks/${mark_id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteTermMark: builder.mutation({
      query: ({ mark_id }) => ({
        url: `/api/terms-marks/${mark_id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateTermMarkMutation,
  useUpdateTermMarkMutation,
  useDeleteTermMarkMutation,
} = termMarksApiSlice;
