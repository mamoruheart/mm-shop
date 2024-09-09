import React from "react";
import { Header } from "./Header";
import { ProductCard } from "./utils/ProductCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChildRifle, faGears, faGun, faHandHoldingMedical, faPersonMilitaryRifle, faPersonRifle, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Box, Divider, ListItemIcon, ListItemText, MenuItem, MenuList, TextField} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Product, getProducts } from "../redux/reducer/productSlice";
import { useEffect } from "react";
import { RootState } from "../redux/store";
import { getCategorys } from "../redux/reducer/categorySlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const fontIconArray = [faPersonMilitaryRifle, faChildRifle, faGun, faPersonRifle, faHandHoldingMedical, faGears]

export const Categories:React.FC = () => {

    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

    const dispatch = useDispatch()
    const products = useSelector((state: RootState) => state.product)
    const category = useSelector((state: RootState) => state.category)
    const navigate = useNavigate();
    useEffect(()=>{
        dispatch(getProducts(navigate));
        dispatch(getCategorys(navigate));
        setFilteredProducts(products.products);
    }, [dispatch])

    const menuItemClick = (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        setFilteredProducts(products.products.filter(item => item.category._id == id));
    }

    const onChange = (e) => {
        const str = e.currentTarget.value;
        setFilteredProducts(products.products.filter(item => item.title.toLowerCase().indexOf(str.toLowerCase()) !== -1));
    }

    return(
        <>
        <Header/>
            <div className="grid grid-cols-12 max-w-8xl mx-auto px-4 sm:px-6 md:px-8 max-w-screen-xl pt-[100px] h-screen">
                <div className="md:col-span-3 col-span-12 md:block z-20 mb-10 ml-8 mr-6 px-4 border-gray-600 bg-white shadow-xl">
                    <nav id='nav' className="md:text-sm md:leading-6 relative ">
                        <ul className='mt-5'>
                            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                <FontAwesomeIcon icon={faSearch} className="mr-2 my-1 text-xl"/>
                                <TextField id="input-with-sx" label="Search Products" variant="standard" onChange={onChange} className="w-full"/>
                            </Box>
                            <MenuList sx={{marginTop: '30px'}}>
                                {
                                    category.categorys.map((item,index) => (
                                    <MenuItem 
                                        onClick={menuItemClick} 
                                        data-id={item._id} 
                                        >
                                        <ListItemIcon>
                                            <FontAwesomeIcon icon={fontIconArray[index]} />
                                        </ListItemIcon>
                                    <ListItemText>{item.title}</ListItemText>

                                    </MenuItem>
                                    ))
                                }
                            </MenuList>
                        </ul>
                    </nav>
                </div>
                <div className="md:col-span-9 col-span-12">
                    <div className=' pb-10 pl-3 pr-3 p-5'>
                        {
                            filteredProducts.length !== 0 ? (
                                <div className="grid sm:grid-cols-3 grid-cols-2 gap-x-5 gap-y-12">
                                    {
                                        filteredProducts.map((item) => (
                                            <ProductCard  product={item} />
                                        ))
                                    }
                                    {/* <ProductCard title="MM23 5.56MM x 90MM" image="/images/parts.PNG" price='8.99'/> */}
                                </div>
                            ) : <div className="w-full bg-white shadow-md h-20 flex flex-row justify-center pt-5">
                                <p className="text-[#515151] text-xl">No Product available for now.</p>
                            </div>
                        }
                        
                    </div>
                </div>
            </div>
        </>
    );
}