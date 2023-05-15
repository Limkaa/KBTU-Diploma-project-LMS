import {authApi} from "../api/apiService";

export const todoApiSlice = authApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllTodos: builder.query({
            query: ({page, isDone, priority, order, search}) =>
                '/api/todos?page=' + page +
                '&is_done=' + isDone +
                '&priority=' + priority +
                '&search=' + search +
                '&ordering=' + order
        }),
        createTodo: builder.mutation({
            query: (data) => ({
                url: `/api/todos`,
                method: "POST",
                body: data,
            }),
        }),
        deleteTodo: builder.mutation({
            query: (todoId) => ({
                url: `/api/todos/${todoId}`,
                method: "DELETE",
            }),
        }),
        updateTodo: builder.mutation({
            query: ({todoId,...data}) => ({
                url: `/api/todos/${todoId}`,
                method: "PUT",
                body: data,
            })
        })
    })
})

export const {
    useGetAllTodosQuery,
    useCreateTodoMutation,
    useDeleteTodoMutation,
    useUpdateTodoMutation,
} = todoApiSlice;