import { authApi } from "../api/apiService";

export const timeBoundsApiSlice = authApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllTimeBounds: builder.query({
            query: (schoolId) =>
                `api/schools/${schoolId}/timebounds`
        }),
        getTimeBounds: builder.query({
            query: ({schoolId, order}) =>
                `api/schools/${schoolId}/timebounds?ordering=${order}`
        }),
        addTimeBound: builder.mutation({
            query: ({ schoolId, ...data }) => ({
                url: `/api/schools/${schoolId}/timebounds`,
                method: "POST",
                body: data,
            }),
        }),
        deleteTimeBound: builder.mutation({
            query: (id) => ({
                url: `/api/timebounds/${id}`,
                method: "DELETE",
            }),
        }),
        updateTimeBound: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/api/timebounds/${id}`,
                method: "PUT",
                body: data,
            }),
        }),
    }),
});

export const {
    useGetAllTimeBoundsQuery,
    useGetTimeBoundsQuery,
    useAddTimeBoundMutation,
    useDeleteTimeBoundMutation,
    useUpdateTimeBoundMutation
} = timeBoundsApiSlice;
