import { authApi } from "../api/apiService";

export const groupsApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query({
      query: ({ groupType, school_id, grade_id, teacher_id, page, search, isActive }) => {
        if (groupType === "school") {
          return `/api/schools/${school_id}/groups?page=${page}&is_active=${isActive}&search=${search}`;
        } else if (groupType === "teacher") {
          return `/api/teachers/${teacher_id}/groups?page=${page}&is_active=${isActive}&search=${search}`;
        } else if (groupType === "grade") {
          return `/api/grades/${grade_id}/groups?page=${page}&is_active=${isActive}&search=${search}`;
        }
      },
    }),
    getAllActiveGroups: builder.query({
      query: (schoolId) => `api/schools/${schoolId}/groups?is_active=true`
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
      query: ({ groupId, ...data }) => ({
        url: `/api/groups/${groupId}`,
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
  useGetAllActiveGroupsQuery
} = groupsApiSlice;
