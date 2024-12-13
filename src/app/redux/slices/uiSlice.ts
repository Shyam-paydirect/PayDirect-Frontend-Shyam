import { createSlice } from '@reduxjs/toolkit';

interface UIState {
    isDarkMode: boolean;
}

const initialState: UIState = {
    isDarkMode: false,
}

const uiSlice = createSlice({
    name: 'ui',
    initialState, 
    reducers: {
        toggleDarkMode: (state) => {
            state.isDarkMode = !state.isDarkMode;
        },  
        setDarkMode: (state, action) => {
            state.isDarkMode = action.payload;
        }
    }
})

export const {toggleDarkMode, setDarkMode} = uiSlice.actions;
export default uiSlice.reducer;