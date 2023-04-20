import { authApi } from "../api/apiService";

export const groupsApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query({
      query: ({ groupType, school_id, grade_id, teacher_id, page }) => {
        if (groupType === "school") {
          return `/api/schools/${school_id}/groups?page=${page}`;
        } else if (groupType === "teacher") {
          return `/api/teachers/${teacher_id}/groups?page=${page}`;
        } else if (groupType === "grade") {
          return `/api/grades/${grade_id}/groups?page=${page}`;
        }
      },
    }),
    getSchoolGroups: builder.query({
      query: ({ school_id }) => `/api/schools/${school_id}/groups`,
    }),
    getOneGroup: builder.query({
      query: (groupId) => `api/groups/${groupId}`,
    }),
    createGroup: builder.mutation({
      query: (data) => ({
        url: `/api/groups`,
        method: "POST",
        body: data,
      }),
    }),
    updateGroup: builder.mutation({
      query: ({ school_id, ...data }) => ({
        url: `/api/groups/${school_id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetGroupsQuery,
  useGetOneGroupQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useGetSchoolGroupsQuery,
} = groupsApiSlice;
