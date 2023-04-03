import { authApi } from "./apiService";

export const authApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    tokenObtain: builder.mutation({
      query: (credentials) => ({
        url: "/api/auth/token/obtain",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    getAuthUser: builder.query({
      query: () => `/api/users/me`,
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useTokenObtainMutation, useGetAuthUserQuery } = authApiSlice;
