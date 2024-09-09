import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from './productSlice'; // Replace with your actual path or import structure for Product interface

export interface WishItem extends Product {
    quantity: number;
  }

interface WishState {
  items: WishItem[];
}

const initialState: WishState = {
  items: []
};
const wishSlice = createSlice({
    name: 'wish',
    initialState,
    reducers: {
      addItem(state, action: PayloadAction<WishItem>) {
        const newItem = action.payload;
        const existingItem = state.items.find(item => item.id === newItem.id);
  
        if (!existingItem) {
          // Otherwise, add new item to wish with quantity 1
          state.items.push({ ...newItem, quantity: newItem.quantity });
        }
      },
      removeItem(state, action: PayloadAction<number>) {
        const itemId = action.payload;
        state.items = state.items.filter(item => item.id !== itemId);
      },

      clearWish(state) {
        state.items = [];
      }
    },
  });
  
  export const { addItem, removeItem, clearWish} = wishSlice.actions;
  
  export const wishReducer = wishSlice.reducer;