import { authApi } from "../api/apiService";

export const studentsApiSlice = authApi.injectEndpoints({
    endpoints: (builder) => ({
        getGroupStudents: builder.query({
            query: ({groupId, page}) =>
                `api/groups/${groupId}/students?page=${page}`,
        }),
    }),
});

export const {useGetGroupStudentsQuery} = studentsApiSlice;