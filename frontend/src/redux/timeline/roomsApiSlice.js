import { authApi } from "../api/apiService";

export const roomsApiSlice = authApi.injectEndpoints({
    endpoints: (builder) => ({
        getRooms: builder.query({
            query: ({schoolId, page, order, search}) =>
                `api/schools/${schoolId}/rooms?page=${page}&ordering=${order}&search=${search}`
        }),
        updateRoom: builder.mutation({
            query: ({ roomId, ...data }) => ({
                url: `/api/rooms/${roomId}`,
                method: "PUT",
                body: data,
            }),
        }),
        addRoom: builder.mutation({
            query: ({ schoolId, ...data }) => ({
                url: `/api/schools/${schoolId}/rooms`,
                method: "POST",
                body: data,
            }),
        }),
        deleteRoom: builder.mutation({
            query: (roomId) => ({
                url: `/api/rooms/${roomId}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetRoomsQuery,
    useUpdateRoomMutation,
    useAddRoomMutation,
    useDeleteRoomMutation
} = roomsApiSlice;
