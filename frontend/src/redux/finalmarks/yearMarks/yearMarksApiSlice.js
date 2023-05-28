import { authApi } from "../../api/apiService";

export const yearMarksApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    createYearMark: builder.mutation({
      query: ({ course_id, ...data }) => ({
        url: `/api/courses/${course_id}/years-marks`,
        method: "POST",
        body: data,
      }),
    }),
    updateYearMark: builder.mutation({
      query: ({ mark_id, ...data }) => ({
        url: `/api/years-marks/${mark_id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteYearMark: builder.mutation({
      query: ({ mark_id }) => ({
        url: `/api/years-marks/${mark_id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateYearMarkMutation,
  useUpdateYearMarkMutation,
  useDeleteYearMarkMutation,
} = yearMarksApiSlice;
