import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//-- Replace with your actual path or import structure for Product interface
import { Product } from "./productSlice";

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const localStorageData = JSON.parse(localStorage.getItem("reduxState")!);

const initialState: CartState = localStorageData
  ? localStorageData.cart
  : {
      items: []
    };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item._id === newItem._id);

      if (existingItem) {
        //-- If item exists in cart, increase quantity
        existingItem.quantity += newItem.quantity;
      } else {
        //-- Otherwise, add new item to cart with quantity 1
        state.items.push({ ...newItem, quantity: newItem.quantity });
      }
    },
    removeItem(state, action: PayloadAction<number>) {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item._id! !== String(itemId));
    },
    updateQuantity(
      state,
      action: PayloadAction<{ _id: number; quantity: number }>
    ) {
      const { _id, quantity } = action.payload;
      if (quantity == 0) {
        state.items = state.items.filter((item) => item._id! !== String(_id));
        return;
      }
      const itemToUpdate = state.items.find(
        (item) => item._id! === String(_id)
      );
      if (itemToUpdate) {
        itemToUpdate.quantity = quantity;
      }
    },
    clearCart(state) {
      state.items = [];
    }
  }
});

export const { addItem, removeItem, updateQuantity, clearCart } =
  cartSlice.actions;

export const cartReducer = cartSlice.reducer;
