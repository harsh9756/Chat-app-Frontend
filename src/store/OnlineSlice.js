import { createSlice } from "@reduxjs/toolkit";

const onlineSlice = createSlice({
    name: "online",
    initialState: [],
    reducers: {
        create(state, action){
            return action.payload
        }
    }
})

export const OnlineActions = onlineSlice.actions
export default onlineSlice.reducer;