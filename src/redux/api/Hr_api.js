import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userAPI = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8080/api/",
    credentials: "include",
  }),
  tagTypes: ["hr","employee"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (hr) => ({
        url: "hr/login",
        method: "POST",
        body: hr,
      }),
      invalidatesTags: ["hr"],
    }),
    register: builder.mutation({
      query: (hrData) => ({
        url: "hr/",
        method: "POST",
        body: hrData,
      }),
      invalidatesTags: ["hr"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "hr/logout",
        method: "POST",
      }),
      invalidatesTags: ["hr"],
    }),
    userInfo: builder.query({
      query: () => ({
        url: "hr/me",
        method: "GET",
      }),
      providesTags: ["hr"],
    }),
    allEmployee:builder.query({
      query:()=>({
        url:"employee/all",
        method:"GET"
      }),
invalidatesTags:["emplyee"]
    })
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useUserInfoQuery,
  useLogoutMutation,
  useAllEmployeeQuery,
} = userAPI;
