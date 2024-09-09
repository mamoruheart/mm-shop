/* eslint-disable @typescript-eslint/no-unused-vars */
import Grid from "@mui/material/Grid";
import { Header } from "./Header";
import { Avatar, CardContent, ListItemIcon, ListItemText, MenuItem, MenuList, ThemeProvider, Typography, createTheme } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping, faGear, faHeart}  from "@fortawesome/free-solid-svg-icons";
import { deepOrange } from "@mui/material/colors";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect, useState } from "react";
import MyOrders from "./dash/MyOrders";
import { Order } from "./Order";
import { useNavigate, useParams } from "react-router-dom";
import { getProducts } from "../redux/reducer/productSlice";
import { getOrders } from "../redux/reducer/orderSlice";
import { UserSettings } from "./UserSettings";

// Temproy end

export const Dashboard = () => {

    const {user} = useSelector((state: RootState) => state.auth);
    const [mode, setMode] = useState('');
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const darkTheme = createTheme({
        typography:{
            fontSize:14
        }
    })

    useEffect(()=>{
        dispatch(getProducts(navigate))
        console.log(user)
        dispatch(getOrders(navigate,user?._id ?? user?.id))
        setMode(params.mode!);
    },[useParams()])

    const mainComponent = () => {
        
    }
    return(
        <ThemeProvider theme={darkTheme}>
        <Header/>
            <div className=" flex flex-row justify-center mt-28">
                <Grid container className="max-w-screen-xl">
                    <Grid md={3}  xs={12} className=" md:visible md:border md:border-white md:h-screen md:p-2 md:m-0 m-2">
                        <ul className='mt-5'>
                            <div>
                                <CardContent className='bg-white border border-[#eff2ff] rounded-lg flex flex-row gap-x-3 shadow-md'>
                                    <Typography sx={{ fontSize: 14 }}  gutterBottom className="flex flex-col justify-center">
                                        <Avatar className='text-black' sx={{ bgcolor: deepOrange[500], width:'30px',height:'30px'}}>{user!.name[0].toUpperCase()}</Avatar>
                                    </Typography>
                                    <Typography variant="h5" component="div">
                                        <Typography variant="body2">
                                        {user!.name}
                                        <br />
                                        {user!.email}
                                        </Typography>
                                    </Typography>
                                    
                                </CardContent>

                            </div>
                            <MenuList sx={{marginTop: '30px'}} className="bg-white border border-[#eff2ff] rounded-lg shadow-md">
                                <MenuItem onClick={()=>navigate('/dashboard/order/')}>
                                    <ListItemIcon>
                                        <FontAwesomeIcon icon={faBagShopping} />
                                    </ListItemIcon>
                                    <ListItemText secondary>My orders</ListItemText>

                                </MenuItem>
                                {/* <MenuItem onClick={()=>navigate('/dashboard/wish/')}>
                                    <ListItemIcon>
                                        <FontAwesomeIcon icon={faHeart} />
                                    </ListItemIcon>
                                    <ListItemText>My Wishlist</ListItemText>
                                </MenuItem> */}
                                <MenuItem onClick={()=>navigate('/dashboard/setting/')}>
                                    <ListItemIcon>
                                        <FontAwesomeIcon icon={faGear} />
                                    </ListItemIcon>
                                    <ListItemText>Settings</ListItemText>
                                </MenuItem>
                            </MenuList>
                        </ul>
                    </Grid>
                    <Grid md={9} xs={12} className="border border-white p-2 mt-6">
                        {
                            (()=>{
                                switch(mode){
                                    case 'order':
                                        return(<MyOrders/>)
                                    case 'wish':
                                        return(<></>)
                                    case 'track':
                                        return(<Order/>)
                                    case 'setting':
                                        return(<UserSettings/>)
                                    default:
                                        return(<MyOrders/>)
                                }
                            })()
                        }
                    </Grid>
                    
                </Grid>
            </div>
        </ThemeProvider>
    );
}