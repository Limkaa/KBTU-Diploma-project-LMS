import { authApi } from "../api/apiService";

export const groupsApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchoolGroups: builder.query({
      query: ({ school_id }) => `/api/schools/${school_id}/groups`,
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetSchoolGroupsQuery } = groupsApiSlice;
