/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { AxiosError } from "axios";
import axios, { createAxiosInstance } from "../../component/utils/AxiosInstance";

export interface OrderItem {
    product: string | null,
    amount: number | null,
    price: number | null
}

export interface Order {
    _id?: number | null;
    id: number | null;
    user: number | null;
    stepNo: number | null;
    billAddress:Address | null;
    deliveryAddress: Address | null;
    totalPrice: number | null;
    payment: string | null;
    items: OrderItem[];
    date_added?:Date | null;
    user_confirm?: boolean | null;
    error: string | null;
    ffl: string | null;
}

export const createOrder = (): Order => ({
    id: null,
    error: null,
    billAddress: { city: '', state: '', zip: '' },
    deliveryAddress: { city: '', state: '', zip: '' },
    payment: '',
    stepNo: 0,
    totalPrice: 0,
    user: 0,
    items: [],
    ffl: null
  });

interface OrderState {
    orders: Order[];
    newOrder: Order | null;
    loading: boolean;
    error: string | null
}


export interface Address {
    city: string,
    state: string,
    zip: string,
}

const localStorageData = JSON.parse(localStorage.getItem('reduxState')!);


const initialState: OrderState = localStorageData ? localStorageData.order :{
    orders: [],
    loading: false,
    error: null
}
const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers:{
        fetchOrderStart(state){
            state.loading = true;
            state.error = null;
            state.orders = [];
        },
        fetchOrdersSuccess(state, action: PayloadAction<Order[]>) {
            state.loading = false;
            state.orders = action.payload;
        },
        fetchNewOrdersSuccess(state, action: PayloadAction<Order>) {
            state.loading = false;
            state.newOrder = action.payload;
        },
        fetchOrdersFailure(state, action: PayloadAction<{msg: string}>) {
            state.loading = false;
            state.error = action.payload.msg;
        },
        setNewOrder(state, action: PayloadAction<Order>) {
            state.loading = false;
            state.newOrder = action.payload;
        },
        clearNewOrder(state) {
            state.loading = false;
            state.newOrder = null
        },
        clearOrder(state){
            state.orders = []
            state.newOrder = null
        }
    }
})

export const {
    fetchOrderStart,
    fetchOrdersFailure,
    fetchOrdersSuccess,
    fetchNewOrdersSuccess,
    clearNewOrder,
    setNewOrder,
    clearOrder
} = orderSlice.actions;


export const getOrders = (navigate:any, id: number) => async (dispatch: AppDispatch) => {
    dispatch(fetchOrderStart());
    
    createAxiosInstance(navigate).get('/order/' + id, ).then((res) => {
        dispatch(fetchOrdersSuccess(res.data));
    }).catch((error:AxiosError) => {
        dispatch(fetchOrdersFailure(error.response.data));
    })
}

  export const postOrder = (navigate:any, data: FormData) => async (dispatch: AppDispatch) => {
    dispatch(fetchOrderStart());
    createAxiosInstance(navigate).post('/order', data, {headers: {
      'Content-Type': 'multipart/form-data',
      },
    }).then((res) => {
        dispatch(fetchNewOrdersSuccess(res.data)); 
    }).catch( (error:AxiosError) => {
        dispatch(fetchOrdersFailure(error.response.data));
    })

  }

  export const putOrder = (navigate:any, updateOrder: {stepNo: number} , id: string, action: string) => async (dispatch: AppDispatch) => {
    dispatch(fetchOrderStart());
    updateOrder.action = action;
    createAxiosInstance(navigate).put(`/order/${id}`, updateOrder).then((res) => {
        dispatch(fetchOrdersSuccess(res.data));
    }).catch( (error:AxiosError) => {
        dispatch(fetchOrdersFailure(error.response.data));
    })

  }

  export const deleteOrder = (navigate:any, deleteOrderId: string) => async (dispatch: AppDispatch) => {
    dispatch(fetchOrderStart());

    createAxiosInstance(navigate).delete(`/order/${deleteOrderId}`).then((res) => {
        dispatch(fetchOrdersSuccess(res.data));
    }).catch( (error:AxiosError) => {
        dispatch(fetchOrdersFailure(error.response.data));
    })

  }

export const orderReducer = orderSlice.reducer;