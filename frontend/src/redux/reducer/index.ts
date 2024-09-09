import { combineReducers } from "redux";
import { authReducer } from "./authSlice";
import { orderReducer } from "./orderSlice";
import { cartReducer } from "./cartSlice";
import { productReducer } from "./productSlice";
import { uiReducer } from "./uiSlice";
import { wishReducer } from "./wishSlice";
import { categoryReducer } from "./categorySlice";
import { customerReducer } from "./customerSlice";

const appReducer = combineReducers({
    auth: authReducer,
    order: orderReducer,
    cart: cartReducer,
    product: productReducer,
    ui: uiReducer,
    wish: wishReducer,
    category: categoryReducer,
    customer: customerReducer,
  });
  
  // Root reducer to handle reset
  export const rootReducer = (state: any, action: any) => {
    if (action.type === 'RESET') {
      state = undefined;
    }
  
    return appReducer(state, action);
  };
  