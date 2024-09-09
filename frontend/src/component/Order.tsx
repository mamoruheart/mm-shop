/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Stepper from "./order/Steps";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Step1 } from "./order/Step1";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { Invoice } from "./order/Invoice";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { OrderItem, getOrders, putOrder } from "../redux/reducer/orderSlice";
import { CONTACT, TITLES } from "../constant";
import { getProducts } from "../redux/reducer/productSlice";


export const Order = () => {

    const dispatch = useDispatch();
    const orders = useSelector((state: RootState) => state.order);
    const orderId = useParams().id;
    const { user } = useSelector((state: RootState) => state.auth)
    const [stepNo, setStepNo] = useState(  orders.newOrder ? orders.newOrder.stepNo! : 0 );
    const navigate = useNavigate();
    useEffect(()=>{
        dispatch(getOrders(navigate, user?.state == 1 ? 'undefined' : user!.id))
        dispatch(getProducts(navigate));
        console.log(user.state)
        // if(user?.state == 0)
        //     dispatch(putOrder(navigate, {}, orderId, '0'));
    },[dispatch])
    useEffect(()=>{
        console.log(orderId)
        console.log(orders.orders);
        if(orders.orders.length){
            if(!orders.newOrder && !orderId){
                setStepNo(0);
            }else{ 
                const filteredOrder = orders.orders.filter((item) => item._id!.toString() === orderId);
                orders.newOrder ? setStepNo(orders.newOrder.stepNo!) : setStepNo(filteredOrder[0].stepNo!);
                console.log(filteredOrder);
            }
        }
    },[orders.newOrder, orders.orders])
    const alert = ['', 'Your Invoice is submitted. Contact with seller to approve your payment', 'Your Payment is approved. ', 'Your product is delivered, Delivery Tracking ID is ',  'This order is finished'];
    const alertAdmin = ['', 'When you get payment from user, Click "Continue" Button', 'Your Payment is approved. ', 'Your product is delivered, Delivery Tracking ID is ', 'This order is finished'];
    
    const leftForm = () => {
        switch(stepNo){
            case 0: 
                return (<Step1/>);
            case 1: 
                return (<Invoice />);
            case 2: 
                return (<Invoice />);
            case 3: 
                return (<Invoice />);
            default:
                return (<></>);
        }
    }   

    const handleNext = () => {
        dispatch(putOrder(navigate, {stepNo: stepNo + 1}, orderId, '1' ));
    }

    return(
        <div className="flex flex-row justify-center">
            <div className="h-[100%] max-w-screen-xl w-full bg-white shadow-2xl border border-gray">
                <div className="flex flex-row justify-between text-[20px] pb-2 mb-2 mt-10 border-[#f94316] border-b-[1px] p-2 my-3 mx-10">
                    <p>{TITLES[stepNo!]}</p>
                    <div className="flex md:flex-row flex-col justify-end text-sm text-gray-500 gap-x-10">
                        <p><FontAwesomeIcon icon={faEnvelope} /> {CONTACT.email} </p>
                        <p><FontAwesomeIcon icon={faPhone} /> {CONTACT.phone}</p>
                    </div>
                </div>
                <div className="flex md:flex-row flex-col ">
                    {window.innerWidth < 768 ? (<div className="md:w-[30%] p-10 w-full">
                        <div className=" rounded-xl border border-[#f94316] p-4">
                            <div className="pb-2.5 border-b-[1px] border-[#f94316] text-xl">Order Progress</div>
                            <Stepper stepNo={stepNo} handleNext={handleNext}/>
                        </div>
                    </div>) : (<></>)}
                    <div className="md:w-[70%] w-full px-10 py-3">
                        <div className="pb-4">
                            { stepNo != 0 ? (
                                <Alert severity="info" className="">       
                                    <AlertTitle>Info</AlertTitle>
                                    {user?.state == 1 ? alertAdmin[stepNo!] : alert[stepNo!]}
                                </Alert>
                                ) : (<></>)
                            }
                        </div>
                        {leftForm()}
                    </div>
                    {window.innerWidth >= 768 ? (<div className="md:w-[30%] p-10 ">
                        <div className=" rounded-xl border border-[#f94316] p-4">
                            <div className="pb-2.5 border-b-[1px] border-[#f94316] text-xl">Order Progress</div>
                            <Stepper stepNo={stepNo} handleNext={handleNext}/>
                        </div>
                    </div>) : (<></>)}
                </div>
            </div>
        </div>
    );
}