import { authApi } from "../api/apiService";

export const studentsApiSlice = authApi.injectEndpoints({
    endpoints: (builder) => ({
        getGroupStudents: builder.query({
            query: ({groupId, page}) =>
                `api/groups/${groupId}/students?page=${page}`,
        }),
        getSchoolStudents: builder.query({
            query: ({schoolId, page, order, search, gender, groupId, teacherId, gradeId, noGroup}) =>
                'api/schools/' + schoolId +
                '/students?page='+ page +
                '&ordering='+ order +
                '&search=' + search +
                '&user__gender=' + gender +
                '&group=' + groupId +
                '&group__teacher=' + teacherId +
                '&group__grade=' + gradeId +
                '&no_group=' + noGroup,
        }),
        updateStudentGroup: builder.mutation({
            query: ({ studentId, ...data }) => ({
                url: `/api/students/${studentId}`,
                method: "PUT",
                body: data,
            }),
        })
    }),
});

export const {
    useGetGroupStudentsQuery,
    useGetSchoolStudentsQuery,
    useUpdateStudentGroupMutation,
} = studentsApiSlice;