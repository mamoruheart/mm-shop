/* eslint-disable @typescript-eslint/no-unused-vars */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Header } from "./Header";
import { faCartShopping, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../redux/reducer/cartSlice";
import { useEffect, useState } from "react";
import { showIsOpen } from "../redux/reducer/uiSlice";
import { DefaultCarousel } from "./utils/Carousel";
import { RootState } from "../redux/store";
import { useParams } from "react-router-dom";
import { UPLOAD_URI } from "../constant";

export const Product:React.FC = () => {
    
    const params = useParams();
    const productId = params.id;
    const products = useSelector((state: RootState) => state.product);
    const dispatch = useDispatch();
    const product = products.products.filter(item => item._id == productId)[0];
    const images = product.images.map(image => image = UPLOAD_URI + image)

    const addToCart = () => {
        console.log(productId, product, 'asdfasdfasdf')
        dispatch(addItem({
            ...product,
            quantity: 1
        }));
        dispatch(showIsOpen());
    }
    return(
        <>
            <Header/>
            <div className="relative flex flex-row justify-center mt-5">
                <div className="flex md:flex-row flex-col w-full justify-center absolute top-[6.4rem] max-w-screen-xl overflow-x-auto md:gap-x-5 md:p-10">
                    <div className="md:w-[45%] m-2 border border-white p-10 bg-white shadow-2xl border border-[#c3c3c3]">
                        <div>
                            <DefaultCarousel images={images}/>
                        </div>
                    </div>
                    <div className="md:w-[55%] border border-white m-2 bg-white md:px-10 md:pt-10 md:pb-10 bg-white shadow-xl border border-[#c3c3c3] p-10">
                        <div className='text-left md:text-2xl text-xl text-[#888] md:px-3 '>
                            <span className="md:text-4xl text-2xl text-black md:font-semibold font-bold"> {product.title}</span> {product.caliber !== 0 ? `${product.caliber} MM`: ''}
                        </div>
                        <div className="text-left px-3 pt-2">
                            <span className="md:text-xl text-lg text-black">$ {product.price.toFixed(2)}</span>
                        </div>
                        <div className='text-left text-md mt-3 px-3'>
                            {product.description} 
                        </div>
                        <div className="flex md:flex-row flex-col justify-center w-full pt-10">
                            <div className="flex flex-col md:w-[50%] w-full">
                                <div className="flex flex-row">
                                    <div className="w-[50%] font-bold text-left">Calibar :</div>
                                    <div className="text-left pl-1">{product.caliber == 0 ? 'None' : `${product.caliber} MM`  }</div>
                                </div>
                                <div className="flex flex-row">
                                    <div className="w-[50%] font-bold text-left">Barrel Length :</div>
                                    <div className="text-left pl-1">{product.barrelLength == 0 ? 'None' : `${product.barrelLength} MM`}</div>
                                </div>
                                <div className="flex flex-row">
                                    <div className="w-[50%] font-bold text-left">Overall Length :</div>
                                    <div className="text-left pl-1">{product.overAllLength == 0 ? 'None' : `${product.overAllLength} MM`}</div>
                                </div>
                                <div className="flex flex-row">
                                    <div className="w-[50%] font-bold text-left">Magazine Cap :</div>
                                    <div className="text-left pl-1">{product.magazineCapacity == 0 ? 'None' : product.magazineCapacity}</div>
                                </div>
                            </div>
                            <div className="flex flex-col md:w-[50%]">
                                <div className="flex flex-row">
                                    <div className="w-[50%] font-bold text-left">Weight :</div>
                                    <div className="text-left pl-1">{product.weight == 0 ? 'None' : `${product.weight} kg`}</div>
                                </div>
                                <div className="flex flex-row">
                                    <div className="w-[50%] font-bold text-left">Action Type :</div>
                                    <div className="text-left pl-1">{product.actionType}</div>
                                </div>
                                <div className="flex flex-row">
                                    <div className="w-[50%] font-bold text-left">Stock Type :</div>
                                    <div className="text-left pl-1">{product.stockType == '' ? 'None' : product.stockType}</div>
                                </div>
                                <div className="flex flex-row">
                                    <div className="w-[50%] font-bold text-left">Category :</div>
                                    <div className="text-left pl-1">{product.category.title}</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row w-full">
                            <div className='text-center text-md text-[#888] mt-5 text-orange-500 mb-[25px] w-full'>
                                
                            </div>
                        </div>
                        
                        <div className="w-full">
                            <button className="w-full p-3 bg-orange-500 text-white md:text-xl text-lg font-bold shadow-md shadow-black hover:shadow-lg hover:shadow-black" onClick={addToCart}><FontAwesomeIcon icon={faCartShopping}/> ADD TO CART</button>
                        </div>
                    </div>
                </div>
                <div className="">

                </div>
            </div>
        </>
    );
}