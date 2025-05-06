import { createSlice } from '@reduxjs/toolkit'

const themeSlice = createSlice({
    name: 'theme',
    initialState: { dark: false },
    reducers: {
        change(state) {
            state.dark=!state.dark
        }
    }
})  

export const themeActions = themeSlice.actions
export default themeSlice.reducer