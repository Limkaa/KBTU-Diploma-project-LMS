// import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query";
// import {setCredentials, logOut} from "../auth/authSlice";
// import header from "../../components/shared/Header";
//
// const baseQuery = fetchBaseQuery({
//     baseUrl: 'http://127.0.0.1:8000',
//     // credentials: 'include',
//     prepareHeaders: (headers, {getState}) => {
//         const token = getState().auth.token;
//         if (token) {
//             headers.set('authorization', `Bearer ${token}`);
//         }
//         return headers;
//     }
// })
//
// const baseQueryWithRefresh = async (args, api, extraOptions) => {
//     let result = await baseQuery(args, api, extraOptions);
//     if (result?.error?.originalStatus === 403) {
//         console.log('sending refresh token');
//         const  refreshResult = await baseQuery('/api/auth/token/refresh', api, extraOptions);
//         console.log(refreshResult);
//         if (refreshResult?.data) {
//             const user = api.getState().auth.user;
//             const token = api.getState().auth.token;
//             token.access = refreshResult.data;
//             api.dispatch(setCredentials({token, user}));
//             result = await baseQuery(args, api, extraOptions);
//         } else {
//             api.dispatch(logOut());
//         }
//         return result;
//     }
// }
//
// export const apiSlice = createApi({
//     baseQuery: baseQueryWithRefresh,
//     endpoints: build => ({}),
// });