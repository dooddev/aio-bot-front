import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "axios";
import {instance} from "../../../instance/instance";



// Создание createAsyncThunk
export const fetchMeData = createAsyncThunk(
    'appReducer/fetchUserData',
    async (id, thunkAPI) => {
        try {
            const userData = await instance(`auth/me`, { method: 'GET' });
            return userData;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const appSlice = createSlice({
    name: 'appReducer',
    initialState: {
        theme:'dark',
        loading:null,
        isAuth:false,
        emailVerify:null,
        tempPassword:null,
        page:null
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
        setPage:(state,action)=>{
            state.page=action.payload
        },
    }}

);

export const { setTheme,setPage,setEmailVerify,setIsAuth,setTempPassword } = appSlice.actions;

export default appSlice.reducer;



// import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
// import axios from "axios";
// import {instance} from "../../../instance/instance";
//
//
//
// // Создание createAsyncThunk
// export const fetchMeData = createAsyncThunk(
//     'appReducer/fetchMeData',
//     async (id, thunkAPI) => {
//         try {
//             console.log('hell')
//             const userData = await instance(`auth/me`, { method: 'GET' });
//             return userData;
//         } catch (error) {
//             return thunkAPI.rejectWithValue(error.message);
//         }
//     }
// );
//
// const appSlice = createSlice({
//     name: 'appReducer',
//     initialState: {
//         theme: 'dark',
//         loading: null,
//         isAuth: null,
//         emailVerify: null,
//         tempPassword: null
//     },
//     reducers: {
//         setTheme: (state, action) => {
//             state.theme = action.payload;
//         },
//         setEmailVerify: (state, action) => {
//             state.emailVerify = action.payload;
//         },
//         setIsAuth: (state, action) => {
//             state.isAuth = action.payload;
//         },
//         setTempPassword: (state, action) => {
//             state.tempPassword = action.payload;
//         }
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchMeData.pending, (state) => {
//                 state.loading = 'pending';
//             })
//             .addCase(fetchMeData.fulfilled, (state, action) => {
//                 state.loading = 'idle';
//                 state.isAuth = true;
//             })
//             .addCase(fetchMeData.rejected, (state, action) => {
//                 state.loading = 'idle';
//                 state.isAuth = false;
//             });
//     }
// });
//
// export const { setTheme,setEmailVerify,setIsAuth,setTempPassword } = appSlice.actions;
//
// export default appSlice.reducer;
