import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const userAPI = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8080/api/hr/",
  }),
  tagTypes: ["hr"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (hr) => ({
        url: "login",
        method: "POST",
        body: hr,
      }),
      invalidatesTags: ["hr"],
    }),
    register:builder.mutation({
      query:(hrData) =>({
        url:"register",
        method:"POST",
        body:hrData
      }),
      invalidatesTags:["hr"]
    })
  }),
});

export const {useLoginMutation,useRegisterMutation} = userAPI
