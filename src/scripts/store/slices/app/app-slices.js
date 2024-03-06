import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

const appSlice = createSlice({
    name: 'appReducer',
    initialState: {
        theme:'dark',
        isAuth:null,
        emailVerify:null,
        tempPassword:null
    },
    reducers: {

        setTheme: (state, action) => {
            state.theme = action.payload;
        },
        setEmailVerify:(state,action)=>{
            state.emailVerify=action.payload
        },
        setIsAuth:(state,action)=>{
            state.isAuth=action.payload
        },
        setTempPassword:(state,action)=>{
            state.tempPassword=action.payload
        },
    },
});

export const { setTheme,setEmailVerify,setIsAuth,setTempPassword } = appSlice.actions;

export default appSlice.reducer;
