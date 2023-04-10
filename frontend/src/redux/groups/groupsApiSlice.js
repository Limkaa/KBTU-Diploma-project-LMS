import { authApi } from "../api/apiService";

export const groupsApiSlice = authApi.injectEndpoints({
    endpoints: (builder) => ({
        getGroups: builder.query({
            query: ({groupType, school_id, grade_id, teacher_id, limit}) => {
                if (groupType === "school") {
                    return `/api/schools/${school_id}/groups?limit=${limit}`
                }
                else if (groupType === "teacher") {
                    return `/api/teachers/${teacher_id}/groups?limit=${limit}`
                }
                else if (groupType === "grade") {
                    return `/api/grades/${grade_id}/groups?limit=${limit}`
                }
            }
        }),
        // getSchoolGroups: builder.query({
        //     query: ({school_id, limit}) =>
        //         `/api/schools/${school_id}/groups?limit=${limit}`,
        // }),
        // getTeacherGroups: builder.query({
        //     query: ({teacher_id, limit}) =>
        //         `/api/teachers/${teacher_id}/groups?limit=${limit}`,
        // }),
        // getGradeGroups: builder.query({
        //     query: ({grade, limit}) =>
        //         `/api/grades/${grade}/groups?limit=${limit}`,
        // }),

        // updateSchool: builder.mutation({
        //     query: ({ school_id, ...data }) => ({
        //         url: `/api/schools/${school_id}`,
        //         method: "PUT",
        //         body: data,
        //     }),
        // }),
    }),
});

export const {useGetGroupsQuery,
    // useGetSchoolGroupsQuery,
    // useGetTeacherGroupsQuery,
    // useGetGradeGroupsQuery
} = groupsApiSlice;