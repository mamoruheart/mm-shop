import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { logout } from "../../redux/reducer/authSlice";
import { clearCart } from "../../redux/reducer/cartSlice";
import { clearCategory } from "../../redux/reducer/categorySlice";
import { clearCustomers } from "../../redux/reducer/customerSlice";
import { clearOrder } from "../../redux/reducer/orderSlice";
import { clearProducts } from "../../redux/reducer/productSlice";
import { hideIsOpen } from "../../redux/reducer/uiSlice";
import { clearWish } from "../../redux/reducer/wishSlice";

export const Logout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logout());
    localStorage.setItem("reduxState", "");
    dispatch(clearCart());
    dispatch(clearCategory());
    dispatch(clearCustomers());
    dispatch(clearOrder());
    dispatch(clearProducts());
    dispatch(hideIsOpen());
    dispatch(clearWish());
    navigate("/login");
  });

  return <div>Signing out...</div>;
};
