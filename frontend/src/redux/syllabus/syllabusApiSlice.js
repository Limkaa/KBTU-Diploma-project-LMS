import { authApi } from "../api/apiService";

export const syllabusApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourseSyllabusWithout: builder.query({
      query: ({ course_id }) => `/api/courses/${course_id}/syllabus`,
      keepUnusedDataFor: 5,
    }),
    getCourseSyllabus: builder.query({
      query: ({ course_id, search }) =>
        `/api/courses/${course_id}/syllabus?search=${search}`,
      keepUnusedDataFor: 5,
    }),
    getSyllabusPoint: builder.query({
      query: ({ id }) => `/api/syllabus/${id}`,
      keepUnusedDataFor: 5,
    }),
    addSyllabusPoint: builder.mutation({
      query: ({ course_id, ...data }) => ({
        url: `/api/courses/${course_id}/syllabus`,
        method: "POST",
        body: data,
      }),
    }),
    updateSyllabusPoint: builder.mutation({
      query: ({ syllabus_id, ...data }) => ({
        url: `/api/syllabus/${syllabus_id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteSyllabusPoint: builder.mutation({
      query: ({ syllabus_id }) => ({
        url: `/api/syllabus/${syllabus_id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCourseSyllabusWithoutQuery,
  useLazyGetCourseSyllabusQuery,
  useGetSyllabusPointQuery,
  useAddSyllabusPointMutation,
  useUpdateSyllabusPointMutation,
  useDeleteSyllabusPointMutation,
} = syllabusApiSlice;
