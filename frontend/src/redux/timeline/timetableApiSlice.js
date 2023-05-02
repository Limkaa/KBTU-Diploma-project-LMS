import { authApi } from "../api/apiService";

export const timetablesApiSlice = authApi.injectEndpoints({
    endpoints: (builder) => ({
        getTimeTable: builder.query({
            query: ({type, schoolId, courseId, roomId, groupId}) =>{
                if (type === "school") {
                    return 'api/schools/' + schoolId + '/timetable'
                }
                else if (type === "course") {
                    return 'api/courses/' + courseId + '/timetable';
                }
                else if (type === "room") {
                    return 'api/rooms/'+ roomId +
                        '/timetable?'
                        // '&course=' + courseId +
                        // '&no_course=' + noCourse
                }
                else if (type === "group") {
                    return '/groups/' + groupId + '/timetable'
                }
            }

        }),
        getSchoolTimeTable: builder.query({
            query: ({schoolId, page, weekday, timeBound, courseId, room, noCourse, search}) =>{
                    return 'api/schools/' + schoolId +
                        '/timetable?weekday=' + weekday +
                        '&timebound=' + timeBound +
                        '&course=' + courseId +
                        '&room=' + room +
                        '&no_course=' + noCourse +
                        '&search=' + search +
                        '&page=' + page;
            }
        }),
        updateTimeSlot: builder.mutation({
            query: ({ slotId, course }) => ({
                url: `/api/timetables-slots/${slotId}`,
                method: "PUT",
                body: {course},
            }),
        }),
        // addRoom: builder.mutation({
        //     query: ({ schoolId, ...data }) => ({
        //         url: `/api/schools/${schoolId}/rooms`,
        //         method: "POST",
        //         body: data,
        //     }),
        // }),
        // deleteRoom: builder.mutation({
        //     query: (roomId) => ({
        //         url: `/api/rooms/${roomId}`,
        //         method: "DELETE",
        //     }),
        // }),
    }),
});

export const {
    useGetTimeTableQuery,
    useGetSchoolTimeTableQuery,
    useUpdateTimeSlotMutation,
} = timetablesApiSlice;
