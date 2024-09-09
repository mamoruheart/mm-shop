import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';
import { AxiosError } from 'axios';
import axios, { createAxiosInstance } from "../../component/utils/AxiosInstance";

interface ProductParams {
  caliber: number,
  actionType: 'Bolt-Action' | 'Lever-action' | 'Semi-Automatic' | 'Automatic' | 'Pump-Action' | 'Break-Action',
  barrelLength: number,
  overAllLength: number,
  weight: number,
  magazineCapacity: number,
  stockType: string
}

export interface Product {
  _id?: string;
  images: string[];
  title: string;
  description: string;
  price: number; 
  category: {
    _id?: string,
    title: string,
    description: string
  },
  date_added?: Date,
  caliber: number,
  actionType: 'Bolt-Action' | 'Lever-action' | 'Semi-Automatic' | 'Automatic' | 'Pump-Action' | 'Break-Action',
  barrelLength: number,
  overAllLength: number,
  weight: number,
  magazineCapacity: number,
  stockType: string
}

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const localStorageData = JSON.parse(localStorage.getItem('reduxState')!);

const initialState: ProductState = localStorageData ? localStorageData.product : {
  products: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
      fetchProductsStart(state) {
        state.loading = true;
        state.error = null;
      },
      fetchProductsSuccess(state, action: PayloadAction<Product[]>) {
        state.loading = false;
        state.products = action.payload;
      },
      fetchProductsFailure(state, action: PayloadAction<{msg: string}>) {
        state.loading = false;
        state.error = action.payload.msg;
      },
      clearProducts(state){
        state.products = []
      }
      // Optionally add reducers for adding, updating, deleting products
    },
  });
  
  export const {
    fetchProductsStart,
    fetchProductsSuccess,
    fetchProductsFailure,
    clearProducts
  } = productSlice.actions;
  

  export const getProducts = (navigate:any) => async (dispatch: AppDispatch) => {
    dispatch(fetchProductsStart());
    
    createAxiosInstance(navigate).get('/product', ).then((res) => {
        dispatch(fetchProductsSuccess(res.data));
    }).catch((error:AxiosError) => {
        dispatch(fetchProductsFailure(error.response.data));
    })
  }

  export const postProduct = (navigate:any, data: FormData) => async (dispatch: AppDispatch) => {
    dispatch(fetchProductsStart());
    createAxiosInstance(navigate).post('/product', data, {headers: {
      'Content-Type': 'multipart/form-data',
      },
    }).then((res) => {
        dispatch(fetchProductsSuccess(res.data));
    }).catch( (error:AxiosError) => {
        dispatch(fetchProductsFailure(error.response.data));
    })

  }

  export const putProduct = (navigate:any, updateProduct: FormData , id: string) => async (dispatch: AppDispatch) => {
    dispatch(fetchProductsStart());

    createAxiosInstance(navigate).put(`/product/${id}`, updateProduct, {headers: {
      'Content-Type': 'multipart/form-data',
      },
    }).then((res) => {
        dispatch(fetchProductsSuccess(res.data));
    }).catch( (error:AxiosError) => {
        dispatch(fetchProductsFailure(error.response.data));
    })

  }

  export const deleteProduct = (navigate:any, deleteProductId: string) => async (dispatch: AppDispatch) => {
    dispatch(fetchProductsStart());

    createAxiosInstance(navigate).delete(`/product/${deleteProductId}`).then((res) => {
        dispatch(fetchProductsSuccess(res.data));
    }).catch( (error:AxiosError) => {
        dispatch(fetchProductsFailure(error.response.data));
    })

  }
  export const productReducer = productSlice.reducer;
  