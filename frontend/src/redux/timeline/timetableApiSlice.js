import { authApi } from "../api/apiService";

export const timetablesApiSlice = authApi.injectEndpoints({
    endpoints: (builder) => ({
        getTimeTable: builder.query({
            query: ({type, schoolId, courseId, roomId, groupId, teacherId, studentGroupId}) =>{
                if (type === "school") {
                    return 'api/schools/' + schoolId + '/timetable'
                }
                else if (type === "course") {
                    return 'api/courses/' + courseId + '/timetable';
                }
                else if (type === "room") {
                    return 'api/rooms/'+ roomId +
                        '/timetable?'
                }
                else if (type === "group") {
                    return 'api/groups/' + groupId + '/timetable'
                }
                else if (type === "student") {
                    return 'api/groups/' + studentGroupId + '/timetable'
                }
                else if (type === "teacher") {
                    return 'api/teachers/' + teacherId + '/timetable'
                }
            }

        }),
        getTimeTableWithWeekday: builder.query({
            query: ({type, teacherId, studentGroupId, weekday}) => {
                if (type === "student") {
                    return 'api/groups/' + studentGroupId + '/timetable?weekday=' + weekday
                }
                else if (type === "teacher") {
                    return 'api/teachers/' + teacherId + '/timetable?weekday=' + weekday
                }
            }
        }),
        getSchoolTimeTable: builder.query({
            query: ({schoolId, page, weekday, timeBound, courseId, room, noCourse, search}) => {
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
    }),
});

export const {
    useGetTimeTableQuery,
    useGetSchoolTimeTableQuery,
    useUpdateTimeSlotMutation,
    useGetTimeTableWithWeekdayQuery,
} = timetablesApiSlice;
