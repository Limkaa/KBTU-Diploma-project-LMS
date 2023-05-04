import { authApi } from "../../api/apiService";

export const awardsStatsApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchoolAwards: builder.query({
      query: ({ school_id, search }) =>
        `/api/schools/${school_id}/awards-overview?search=${search}`,
    }),
  }),
});

export const { useGetSchoolAwardsQuery } = awardsStatsApiSlice;
