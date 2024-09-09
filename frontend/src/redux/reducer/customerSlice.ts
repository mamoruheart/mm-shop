import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';
import { AxiosError } from 'axios';
import axios, { createAxiosInstance } from "../../component/utils/AxiosInstance";

export interface Customer {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  state: number;
  register_date: Date;
}

interface CustomerState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
}

const localStorageData = JSON.parse(localStorage.getItem('reduxState')!);

const initialState: CustomerState = localStorageData ? localStorageData.customer : {
  customers: [],
  loading: false,
  error: null,
};

const customerSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {
      fetchCustomersStart(state) {
        state.loading = true;
        state.error = null;
      },
      fetchCustomersSuccess(state, action: PayloadAction<Customer[]>) {
        state.loading = false;
        state.customers = action.payload;
      },
      fetchCustomersFailure(state, action: PayloadAction<{msg: string}>) {
        state.loading = false;
        state.error = action.payload.msg;
      },
      clearCustomers(state){
        state.customers = []
      }
      // Optionally add reducers for adding, updating, deleting customers
    },
});
  
export const {
    fetchCustomersStart,
    fetchCustomersSuccess,
    fetchCustomersFailure,
    clearCustomers
} = customerSlice.actions;
  
export const getCustomers = (navigate:any ) => async (dispatch: AppDispatch) => {
    dispatch(fetchCustomersStart());
    
    createAxiosInstance(navigate).get('/customer', ).then((res) => {
        dispatch(fetchCustomersSuccess(res.data));
    }).catch((error:AxiosError) => {
        dispatch(fetchCustomersFailure(error.response.data));
    })
}

  export const postCustomer = (navigate:any, data: FormData) => async (dispatch: AppDispatch) => {
    dispatch(fetchCustomersStart());
    createAxiosInstance(navigate).post('/customer', data).then((res) => {
        dispatch(fetchCustomersSuccess(res.data));
    }).catch( (error:AxiosError) => {
        dispatch(fetchCustomersFailure(error.response.data));
    })

}

export const putCustomer = (navigate:any, updateState: {state: number} , id: string) => async (dispatch: AppDispatch) => {
    dispatch(fetchCustomersStart());

    createAxiosInstance(navigate).put(`/customer/${id}`, updateState).then((res) => {
        dispatch(fetchCustomersSuccess(res.data));
    }).catch( (error:AxiosError) => {
        dispatch(fetchCustomersFailure(error.response.data));
    })

}

export const deleteCustomer = (navigate:any, deleteCustomerId: string) => async (dispatch: AppDispatch) => {
    dispatch(fetchCustomersStart());

    createAxiosInstance(navigate).delete(`/customer/${deleteCustomerId}`).then((res) => {
        dispatch(fetchCustomersSuccess(res.data));
    }).catch( (error:AxiosError) => {
        dispatch(fetchCustomersFailure(error.response.data));
    })

}
  export const customerReducer = customerSlice.reducer;
  