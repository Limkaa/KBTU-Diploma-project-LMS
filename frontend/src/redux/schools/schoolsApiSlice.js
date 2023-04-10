import { authApi } from "../api/apiService";

export const schoolsApiSlice = authApi.injectEndpoints({
    endpoints: (builder) => ({
        getSchool: builder.query({
            query: (school_id) =>
                `/api/schools/${school_id}`,
        }),
        updateSchool: builder.mutation({
            query: ({ school_id, ...data }) => ({
                url: `/api/schools/${school_id}`,
                method: "PUT",
                body: data,
            }),
        }),
    }),
});

export const {useGetSchoolQuery, useUpdateSchoolMutation} = schoolsApiSlice;