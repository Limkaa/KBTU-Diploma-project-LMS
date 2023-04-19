import { authApi } from "../api/apiService";

export const studentsApiSlice = authApi.injectEndpoints({
    endpoints: (builder) => ({
        getGroupStudents: builder.query({
            query: ({groupId, page}) =>
                `api/groups/${groupId}/students?page=${page}`,
        }),
        getSchoolStudents: builder.query({
            query: ({schoolId, page, order, search, gender}) =>
                `api/schools/${schoolId}/students?page=${page}&ordering=${order}&search=${search}&gender=${gender}`,
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