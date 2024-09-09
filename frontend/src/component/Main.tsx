import { useDispatch, useSelector } from "react-redux";
import { Header } from "./Header"
import { Category } from "./main/Categories";
import { NewProduct } from "./main/NewProduct"
import { useEffect } from "react";
import { getOrders } from "../redux/reducer/orderSlice";
import { getProducts } from "../redux/reducer/productSlice";
import { RootState } from "../redux/store";

export const Main : React.FC = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(getProducts());
    },[dispatch])
    return(
        <>
            <Header/>
            <NewProduct/>
            <Category/>
        </>
    );

}