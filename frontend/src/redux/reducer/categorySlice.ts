import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../store';
import { AxiosError } from 'axios';
import { useSelector } from 'react-redux';
import axios, { createAxiosInstance } from "../../component/utils/AxiosInstance";

export interface Category {
  _id?: number;
  image?: string;
  title: string;
  description: string;
}

interface CategoryState {
  categorys: Category[];
  loading: boolean;
  error: string | null;
}

const localStorageData = JSON.parse(localStorage.getItem('reduxState')!);

const initialState: CategoryState = localStorageData ? localStorageData.category : {
  categorys: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
      fetchCategorysStart(state) {
        state.loading = true;
        state.error = null;
      },
      fetchCategorysSuccess(state, action: PayloadAction<Category[]>) {
        state.loading = false;
        state.categorys = action.payload;
      },
      fetchCategorysFailure(state, action: PayloadAction<{msg: string}>) {
        state.loading = false;
        state.error = action.payload.msg;
      },
      clearCategory(state){
        state.categorys = []
      }
      // Optionally add reducers for adding, updating, deleting categorys
    },
  });
  
  export const {
    fetchCategorysStart,
    fetchCategorysSuccess,
    fetchCategorysFailure,
    clearCategory
  } = categorySlice.actions;
  

  export const getCategorys = (navigate: any) => async (dispatch: AppDispatch) => {
    dispatch(fetchCategorysStart());
    
    createAxiosInstance(navigate).get('/category', ).then((res) => {
        dispatch(fetchCategorysSuccess(res.data));
    }).catch((error:AxiosError) => {
        dispatch(fetchCategorysFailure(error.response.data));
    })
  }

  export const postCategorys = (navigate:any, updateCategory: Category) => async (dispatch: AppDispatch) => {
    dispatch(fetchCategorysStart());
    
    createAxiosInstance(navigate).post('/category', updateCategory).then((res) => {
        dispatch(fetchCategorysSuccess(res.data));
    }).catch((error:AxiosError) => {
        dispatch(fetchCategorysFailure(error.response.data));
    })
  }

  export const putCategory = (navigate:any, updateCategory: Category) => async (dispatch: AppDispatch) => {
    dispatch(fetchCategorysStart());

    createAxiosInstance(navigate).put(`/category/${updateCategory._id}`, updateCategory, ).then((res) => {
        dispatch(fetchCategorysSuccess(res.data));
    }).catch( (error:AxiosError) => {
        dispatch(fetchCategorysFailure(error.response.data));
    })

  }

  export const deleteCategory = (navigate:any, deleteCategoryId: CategoryParams) => async (dispatch: AppDispatch) => {
    dispatch(fetchCategorysStart());

    createAxiosInstance(navigate).delete(`/category/${deleteCategoryId}`).then((res) => {
        dispatch(fetchCategorysSuccess(res.data));
    }).catch( (error:AxiosError) => {
        dispatch(fetchCategorysFailure(error.response.data));
    })

  }
  export const categoryReducer = categorySlice.reducer;
  