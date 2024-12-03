// import { configureStore } from "@reduxjs/toolkit";
// import { userAPI } from "./api/Hr_api.js";
// import { userReducer} from "./reducer/userReducer.js";

// export const store = configureStore({
//     reducer:{
//         [userAPI.reducerPath]: userAPI.reducer,
//         [hrReducer.name]:userReducer.reducer
//     },
//     middleware: (getDefaultMiddleware) => 
//         getDefaultMiddleware().concat(userAPI.middleware),
// })

// export type RootState = ReturnType<typeof store.getState>;




import {configureStore} from "@reduxjs/toolkit"
import userSlice from "./reducer/userReducer.js"
import { userAPI } from "./api/Hr_api.js"



export const store = configureStore({
    reducer:{
        [userSlice.name]:userSlice.reducer,
       
        [userAPI.reducerPath]:userAPI.reducer
    },
    middleware: (mid) => [
        ...mid(),
        userAPI.middleware,
       
      ],
   
})