import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { AppDispatch } from "../store";
import { createAxiosInstance } from "../../component/utils/AxiosInstance";

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

const localStorageData = JSON.parse(localStorage.getItem("reduxState")!);

const initialState: CategoryState = localStorageData
  ? localStorageData.category
  : {
      categorys: [],
      loading: false,
      error: null
    };

const categorySlice = createSlice({
  name: "category",
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
    fetchCategorysFailure(state, action: PayloadAction<{ msg: string }>) {
      state.loading = false;
      state.error = action.payload.msg;
    },
    clearCategory(state) {
      state.categorys = [];
    }
    //-- Optionally add reducers for adding, updating, deleting categorys
  }
});

export const {
  fetchCategorysStart,
  fetchCategorysSuccess,
  fetchCategorysFailure,
  clearCategory
} = categorySlice.actions;

interface ErrorData {
  msg: string;
}

export const getCategorys =
  (navigate: any) => async (dispatch: AppDispatch) => {
    dispatch(fetchCategorysStart());

    createAxiosInstance(navigate)
      .get("/category")
      .then((res) => {
        dispatch(fetchCategorysSuccess(res.data));
      })
      .catch((error: AxiosError) => {
        if (error.response && error.response.data) {
          const errorData = error.response.data as ErrorData;
          dispatch(fetchCategorysFailure(errorData));
        } else {
          console.log("An unexpected error:", error.message);
        }
      });
  };

export const postCategorys =
  (navigate: any, updateCategory: Category) =>
  async (dispatch: AppDispatch) => {
    dispatch(fetchCategorysStart());

    createAxiosInstance(navigate)
      .post("/category", updateCategory)
      .then((res) => {
        dispatch(fetchCategorysSuccess(res.data));
      })
      .catch((error: AxiosError) => {
        if (error.response && error.response.data) {
          const errorData = error.response.data as ErrorData;
          dispatch(fetchCategorysFailure(errorData));
        } else {
          console.log("An unexpected error:", error.message);
        }
      });
  };

export const putCategory =
  (navigate: any, updateCategory: Category) =>
  async (dispatch: AppDispatch) => {
    dispatch(fetchCategorysStart());

    createAxiosInstance(navigate)
      .put(`/category/${updateCategory._id}`, updateCategory)
      .then((res) => {
        dispatch(fetchCategorysSuccess(res.data));
      })
      .catch((error: AxiosError) => {
        if (error.response && error.response.data) {
          const errorData = error.response.data as ErrorData;
          dispatch(fetchCategorysFailure(errorData));
        } else {
          console.log("An unexpected error:", error.message);
        }
      });
  };

export const deleteCategory =
  (navigate: any, deleteCategoryId: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(fetchCategorysStart());

    createAxiosInstance(navigate)
      .delete(`/category/${deleteCategoryId}`)
      .then((res) => {
        dispatch(fetchCategorysSuccess(res.data));
      })
      .catch((error: AxiosError) => {
        if (error.response && error.response.data) {
          const errorData = error.response.data as ErrorData;
          dispatch(fetchCategorysFailure(errorData));
        } else {
          console.log("An unexpected error:", error.message);
        }
      });
  };

export const categoryReducer = categorySlice.reducer;
