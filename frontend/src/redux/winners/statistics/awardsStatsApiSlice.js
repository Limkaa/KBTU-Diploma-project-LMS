import { authApi } from "../../api/apiService";

export const awardsStatsApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchoolAwards: builder.query({
      query: ({ school_id }) => `/api/schools/${school_id}/awards-overview`,
    }),
  }),
});

export const { useGetSchoolAwardsQuery } = awardsStatsApiSlice;
