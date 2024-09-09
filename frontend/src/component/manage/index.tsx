/* eslint-disable @typescript-eslint/no-explicit-any */
import Grid from "@mui/material/Grid";
import { Header } from "../Header";
import { Avatar, CardContent, ListItemIcon, ListItemText, MenuItem, MenuList, ThemeProvider, Typography, createTheme } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping, faCartFlatbed, faGear, faUserGear}  from "@fortawesome/free-solid-svg-icons";
import { deepOrange } from "@mui/material/colors";
import { useEffect, useState } from "react";
import Products from "./Products";
import Customers from "./Customers";
import { useDispatch, useSelector } from "react-redux";
import { CustomerData, Data } from "../types";
import { RootState } from "../../redux/store";
import { getProducts } from "../../redux/reducer/productSlice";
import { getCustomers } from "../../redux/reducer/customerSlice";
import MyOrders from "../dash/MyOrders";
import { getOrders } from "../../redux/reducer/orderSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Order } from "../Order";
import { UserSettings } from "../UserSettings";

// Temproy end

export const Manage = () => {

    const dispatch = useDispatch();

    const products = useSelector((state:RootState) => state.product)

    const customers = useSelector((state:RootState) => state.customer)

    const {user} = useSelector((state: RootState) => state.auth)

    const params = useParams();

    const [rows, setRows] = useState<Data[]>([]);

    const [customerRows, setCustomerRows] = useState<Data[]>([]);

    const [comState, setComState] = useState('');

    const navigate = useNavigate();

    const darkTheme = createTheme({
        typography:{
            fontSize:14
        }
    })

    useEffect(()=>{
        dispatch(getProducts(navigate)); // Ensure this fetches data and updates Redux state
        dispatch(getCustomers(navigate));
        dispatch(getOrders(navigate));
        setComState(params.mode);
    }, [useParams()])
    
    useEffect(() => {
        console.log(products);
        const parsedData: Data[] = products.products.map((item: any) => ({
            id: item._id!,
            product: item.title,
            date: item.date_added!.toString(),
            price: String(item.price!),
            detail: `${item.caliber != 0 ? `${item.caliber}MM x ${item.barrelLength}MM ${item.actionType}` : item.description}`
        }));
        setRows(parsedData); // Update state with parsed data
    },[products]); // Trigger on changes to products array

    useEffect(()=>{
        const parsedData: CustomerData[] = customers.customers.map((item: any) => ({
            id: item._id!,
            email: item.email,
            name: item.name!.toString(),
            phone: String(item.phone!),
            register_date: String(item.register_date!),
            state:  String(item.state!),
        })); 
        setCustomerRows(parsedData); // Update state with parsed data

    },[customers])


    const mainComponent = () => {
        switch(comState){
            case 'products':
                return(<Products rows={rows} />)
            case 'customers':
                return(<Customers rows={customerRows} />)
            case 'orders':
                return(<MyOrders/>)
            case 'setting':
                return(<UserSettings />)
            case 'track':
                return(<Order/>)
            default:
                return(<Products rows={rows} />)
        }
    }
    return(
        <ThemeProvider theme={darkTheme}>
        <Header/>
            <div className=" flex flex-row justify-center mt-28">
                <Grid container spacing={3} className="max-w-screen-xl px-8">
                    <Grid md={3}  xs={12} className="border border-white md:h-screen p-2">
                    <ul className='mt-5'>
                            <div>
                            <CardContent className='bg-white border border-[#eff2ff] rounded-lg flex flex-row gap-x-3'>
                                <Typography sx={{ fontSize: 14 }}  gutterBottom className="flex flex-row justify-center">
                                    <Avatar className='text-black' sx={{ bgcolor: deepOrange[500], width:'30px',height:'30px'}}/> 
                                    <div className="flex flex-col justify-center pl-1 text-lg">Welcome Eric</div>
                                </Typography>
                                <Typography variant="h5" component="div">
                                    <Typography variant="body2">
                                    <br />
                                    </Typography>
                                </Typography>
                                
                            </CardContent>

                            </div>
                            <MenuList sx={{marginTop: '30px'}} className="bg-white border border-[#eff2ff] rounded-lg">
                                <MenuItem onClick={()=>navigate('/manage/products')}>
                                    <ListItemIcon>
                                        <FontAwesomeIcon icon={faBagShopping} />
                                    </ListItemIcon>
                                    <ListItemText secondary>Products</ListItemText>

                                </MenuItem>
                                <MenuItem onClick={()=>navigate('/manage/customers')}>
                                    <ListItemIcon>
                                        <FontAwesomeIcon icon={faUserGear} />
                                    </ListItemIcon>
                                    <ListItemText>Customers</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={()=>navigate('/manage/orders')}>
                                    <ListItemIcon>
                                        <FontAwesomeIcon icon={faCartFlatbed} />
                                    </ListItemIcon>
                                    <ListItemText>Orders</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={()=>navigate('/manage/setting')}>
                                    <ListItemIcon>
                                        <FontAwesomeIcon icon={faGear} />
                                    </ListItemIcon>
                                    <ListItemText>Settings</ListItemText>
                                </MenuItem>
                            </MenuList>
                        </ul>
                    </Grid>
                    <Grid md={9} xs={12} className="border border-white p-2 mt-6">
                        {mainComponent()}
                    </Grid>
                    
                </Grid>
            </div>
        </ThemeProvider>
    );
}