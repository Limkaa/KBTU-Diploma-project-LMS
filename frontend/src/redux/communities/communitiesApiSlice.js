import { authApi } from "../api/apiService";

export const communitiesApiSlice = authApi.injectEndpoints({
    endpoints: (builder) => ({
        getSchoolCommunities: builder.query({
            query: ({schoolId, page, isActive, order, search}) =>
                'api/schools/' + schoolId +
                '/communities?limit=6&offset=' + (page - 1) * 6 +
                '&is_active=' + isActive +
                '&ordering=' + order +
                '&search=' + search
        }),
        createCommunity: builder.mutation({
            query: ({schoolId, ...data}) => ({
                url: `/api/schools/${schoolId}/communities`,
                method: "POST",
                body: data,
            }),
        }),
        updateCommunity: builder.mutation({
            query: ({ commId, ...data }) => ({
                url: `/api/communities/${commId}`,
                method: "PUT",
                body: data,
            }),
        }),
        joinCommunity: builder.mutation({
            query: (commId) => ({
                url: `/api/communities/${commId}/memberships`,
                method: "POST",
            })
        }),
        leaveCommunity: builder.mutation({
            query: (memId) => ({
                url: `/api/memberships/${memId}`,
                method: "DELETE",
            })
        }),
        getStudentMemberships: builder.query({
            query: (studentId) => `/api/students/${studentId}/memberships`
        }),
        getCommunityMembers: builder.query({
            query: ({commId, page, search, order}) =>
                '/api/communities/'+ commId +
                '/memberships?page=' + page +
                '&search=' + search +
                '&ordering=' + order
        }),
        getCommunity: builder.query({
            query: (commId) => `/api/communities/${commId}`
        }),
    }),
});

export const {
    useGetSchoolCommunitiesQuery,
    useCreateCommunityMutation,
    useUpdateCommunityMutation,
    useJoinCommunityMutation,
    useGetStudentMembershipsQuery,
    useGetCommunityQuery,
    useGetCommunityMembersQuery,
    useLeaveCommunityMutation
} = communitiesApiSlice;
