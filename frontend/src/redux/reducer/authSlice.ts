/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import Cookies from 'js-cookie';
import { AxiosError } from "axios";
import { createAxiosInstance } from "../../component/utils/AxiosInstance";

interface AuthState {
    user: {id: number; name: string; email: string; phone: string, state: number} | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const localStorageData = JSON.parse(localStorage.getItem('reduxState')!);

const initialState: AuthState = 
    localStorageData ? localStorageData.auth:
    {
        error: null,
        loading: false,
        token: null,
        user:null,
        state:null,
    }

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        loginStart(state) {
            state.loading = true;
            state.error = null;
            state.user = null;
            state.token = null;
        },
        loginSuccess(state, action: PayloadAction<{ user: { id: number; name: string; email: string; phone: string; state: number }; token: string }>) {
            state.loading = false;
            Cookies.set('authToken', action.payload.token);
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        loginFailure(state, action: PayloadAction<{msg: string}>) {
            state.loading = false;
            state.error = action.payload.msg;
            state.user = null;
            state.token = null;
        },
        logout(state) {
            state.user = null;
            state.token = null;
            state.user = null;
            state.token = null;
        },
        
    }
})

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

export const login = (navigate:any, email: string, password: string) => async (dispatch: AppDispatch) => {
    dispatch(loginStart());

    createAxiosInstance(navigate).post('/login', {email, password}).then((res) => {
        dispatch(loginSuccess({user: res.data.user, token: res.data.token}));
    }).catch((error:AxiosError) => {
        dispatch(loginFailure(error.response.data));
    })
}

export const signup = (navigate:any ,email: string, name: string, phone: string, password: string) => async (dispatch: AppDispatch) => {
    
    dispatch(loginStart());
    
    createAxiosInstance(navigate).post('/signup', { name, password, email, phone }).then((res) => {
        dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));
    }).catch( (error:AxiosError) => {
        dispatch(loginFailure(error.response.data));
    })

}

export const authReducer = authSlice.reducer;