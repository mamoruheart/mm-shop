import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping, faBell, faBox, faBoxTissue, faCartFlatbed, faCartShopping, faClose, faGear, faHouse, faMinus, faPlus, faRightToBracket, faSignOut, faUserGear, faUsers } from "@fortawesome/free-solid-svg-icons";
import Button from "@mui/material/Button";
import { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart, removeItem, updateQuantity } from "../redux/reducer/cartSlice";
import { hideIsOpen, toggleIsOpen } from "../redux/reducer/uiSlice";
import { Avatar, Divider, IconButton, ListItemIcon, Menu, MenuItem, Popover, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSnackbar } from "./utils/SnackbarProvider";
import { deepOrange } from "@mui/material/colors";
import { clearNewOrder, getOrders, Order } from "../redux/reducer/orderSlice";
import { UPLOAD_URI } from "../constant";

export const Header: React.FC = () => {
  const dispatch = useDispatch();
  const {items} = useSelector((state: RootState) => state.cart);
  const {isOpen} = useSelector((state: RootState) => state.ui);
  const {user} = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const orders = useSelector((state: RootState) => state.order);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const {showSnackbar} = useSnackbar();

  const toggleDrawer = () => {
    dispatch(toggleIsOpen());
  };
  //MUI config
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCheckOut = () => {
    dispatch(hideIsOpen());
    dispatch(clearNewOrder());
    if(user){
      navigate(`/dashboard/track`)
    }
    else {
      showSnackbar('Please login first.', 'warning');
      navigate('/login')
    }
  }
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(()=>{
    if(user)
      dispatch(getOrders(navigate, user?.state == 1 ? 'undefined' : user!.id))
  },[dispatch])
  useEffect(()=>{
    setFilteredOrders(orders.orders.filter(order => !order.user_confirm));
  },[orders])
  //MUI confg end
  return (
    <>
      <header className='fixed top-0 z-50 w-full backdrop-blur sm:block bg-[#fff]/25 flex flex-row justify-between bg-black/90'>
        <div className="flex justify-between gap-x-8 px-10 mx-auto max-w-screen-xl text-[20px]">
          <a className="flex flex-col justify-center cursor-pointer p-1.5 rounded-md first-letter:uppercase hover:transition-colors hover:duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 sm:hover:text-orange-500 text-white font-poppins text-md header-text p-5"
             onClick={()=>{navigate('/')}}>
            {window.innerWidth >= 768 ? 'SANDWITCH' : <FontAwesomeIcon icon={faHouse}/>}
          </a>
          <div className='flex justify-around gap-x-1'>
            <a className='flex flex-col justify-center cursor-pointer p-1.5 rounded-md first-letter:uppercase hover:transition-colors hover:duration-300 sm:hover:text-orange-500 text-white font-poppins text-md header-text p-5' onClick={()=>{navigate('/Categories')}}>
              {window.innerWidth >= 768 ? 'Product' : <FontAwesomeIcon icon={faBox}/>}
            </a>
            {user !== null ? (
              <div className='cursor-pointer p-1.5 rounded-md first-letter:uppercase hover:transition-colors hover:duration-300 sm:hover:text-orange-500 text-white font-poppins text-md header-text p-5'>
                <button>
                  <Tooltip title="Account settings">
                    <IconButton
                      onClick={handleClick}
                      size="small" 
                      sx={{ ml: 2 }}
                      aria-controls={open ? 'account-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                    >
                      <Avatar className='text-black' sx={{ bgcolor: deepOrange[500], width:'30px',height:'30px'}}>{user.name[0].toUpperCase()}</Avatar>
                    </IconButton>
                  </Tooltip>
                </button>
                <Popover
                  open={open}
                  onClose={handleClose}
                >
                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        '&::before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem onClick={handleClose} >
                      <Avatar /> Welcome {user.name}.
                    </MenuItem>
                    <Divider />
                    {
                      user.state == 1 ? (
                        <>
                          <MenuItem onClick={() => {navigate('/manage/products');  handleClose()}}>
                            <ListItemIcon>
                              <FontAwesomeIcon icon={faBagShopping}/>
                            </ListItemIcon>
                            Products
                          </MenuItem>
                          <MenuItem onClick={() => {navigate('/manage/customers');  handleClose() }}>
                            <ListItemIcon>
                              <FontAwesomeIcon icon={faUserGear}/>
                            </ListItemIcon>
                            Customers
                          </MenuItem>
                          <MenuItem onClick={() => {navigate('/manage/orders'); handleClose()}}>
                            <ListItemIcon>
                              <FontAwesomeIcon icon={faCartFlatbed}/>
                            </ListItemIcon>
                            Orders
                          </MenuItem>
                          <MenuItem onClick={() => navigate('/manage/setting')}>
                            <ListItemIcon>
                              <FontAwesomeIcon icon={faGear}/>
                            </ListItemIcon>
                            Settings
                          </MenuItem>
                        </>
                      ) : (
                        <>
                          <MenuItem onClick={() => navigate('/dashboard')}>
                            <ListItemIcon>
                              <FontAwesomeIcon icon={faBagShopping}/>
                            </ListItemIcon>
                            My Orders
                          </MenuItem>
                          <MenuItem onClick={() => navigate('/dashboard/setting')}>
                            <ListItemIcon>
                              <FontAwesomeIcon icon={faGear}/>
                            </ListItemIcon>
                            Settings
                          </MenuItem>
                        </>
                      )
                    }
                    
                    <MenuItem onClick={() => {navigate('/logout')}}>
                      <a >
                        <ListItemIcon>
                          <FontAwesomeIcon icon={faSignOut}/>
                        </ListItemIcon>
                        Logout
                      </a>

                    </MenuItem>
                  </Menu>
                </Popover>
              </div>
            ) : (
              <a className='cursor-pointer rounded-md first-letter:uppercase hover:transition-colors hover:duration-300 sm:hover:text-orange-500 text-white font-poppins text-md header-text p-5'
                onClick={()=>{navigate('/login')}}
                >
                <FontAwesomeIcon icon={faRightToBracket}/>
              </a>
            )}
            <button className='cursor-pointer p-1.5 rounded-md first-letter:uppercase hover:transition-colors hover:duration-300 sm:hover:text-orange-500 text-white font-poppins text-md header-text py-5 px-0'
             onClick={toggleDrawer}
             >
              <FontAwesomeIcon icon={faCartShopping} />
              {items.length !== 0 ? (<span className="badge-after">{items.length}</span>) : (<></>)}
              
            </button>
            <button className='cursor-pointer p-1.5 ml-5 rounded-md first-letter:uppercase hover:transition-colors hover:duration-300 sm:hover:text-orange-500 text-white font-poppins text-md header-text py-5 px-0'
             onClick={toggleDrawer}
             >
              <FontAwesomeIcon icon={faBell} />
              { user ? (user!.state == 0 && filteredOrders.length !== 0 ? (<span className="badge-after">{filteredOrders!.length}</span>) : (<></>)):<></>}
              
            </button>
          </div>
        </div>
      </header>
      
      {/*Cart Drawer */}
      <div
        className={`fixed top-16 right-0 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } bg-white transition-transform duration-300 ease-in-out z-40 w-full max-w-md lg:max-w-lg`}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold flex justify-between">
            <div className="flex">Cart</div>
            <div className="flex font-md font-semibold pointer">
              <IconButton onClick={()=>{dispatch(toggleIsOpen())}}><FontAwesomeIcon icon={faClose} /></IconButton>
            </div>
          </h2>
          <nav className="mt-4 max-h-[500px] overflow-auto">
            {
              items.map((cartItem) => 
                (
                <div className=" flex flex-col border-b gap-y-2  overflow-y-auto">
                  <div className="flex gap-x-4 py-2 lg:px-6 border-b border-gray-200 w-full font-light text-gray-500">
                      <div className="w-full min-h-[100px] flex items-center gap-x-4">
                          <a href={"/product/" + cartItem._id}>
                              <img className="max-w-[80px]" src={UPLOAD_URI + cartItem.images[0]} alt=""></img>
                          </a>
                          <div className=" w-full flex flex-col">
                              <div className=" flex justify-between mb-2">
                                  <a className=" text-sm uppercase font-medium max-w-[240px] text-slate-800 hover:underline" onClick={()=>{navigate('/product/' + cartItem.id)}}>
                                      {cartItem.title}
                                  </a>
                                  <div className=" text-xl cursor-pointer">
                                  </div>
                              </div>
                              <div className=" flex gap-x-2 h-[36px] text-sm">
                                  <div className=" flex flex-1 max-w-[100px] items-center h-full border text-slate-700 font-medium ">
                                      <button className="flex-1 h-full flex items-center justify-center cursor-pointer"
                                      onClick={()=>{dispatch(updateQuantity({_id:cartItem._id, quantity: cartItem.quantity - 1 >= 0 ? cartItem.quantity - 1 : 0})); if(cartItem.quantity == 1) dispatch(removeItem(cartItem.id))}}>
                                        <FontAwesomeIcon icon={faMinus}/>
                                      </button>
                                      <div className="h-full flex justify-center items-center px-2 ">
                                          {cartItem.quantity}
                                      </div>
                                      <button className="flex-1 h-full flex items-center justify-center cursor-pointer"
                                        onClick={()=>{dispatch(updateQuantity({...cartItem, quantity: cartItem.quantity + 1}))}}>
                                        <FontAwesomeIcon icon={faPlus}/>
                                      </button>
                                  </div>
                                  <div className="flex-1 flex items-center justify-around ">$ {cartItem.price}</div>
                                  <div className="flex-1 flex justify-end items-center text-slate-700  font-medium ">$ {cartItem.price * cartItem.quantity}</div>
                              </div>
                          </div>
                      </div>
                  </div>
                </div>
                )
              )
            }

            {/* end */}
            <div className="flex flex-row justify-between">
                <Button
                    variant="contained"
                    className="w-[49%]"
                    color='success'
                    onClick={()=>{dispatch(hideIsOpen()); navigate('/Categories')}}
                    disabled={items.length > 0 ? false : true}
                >
                    Go Shopping
                </Button>
                <Button
                    variant="contained"
                    className="w-[49%]"
                    color='error'
                    onClick={handleCheckOut}
                    disabled={items.length > 0 ? false : true}
                >
                    CheckOut
                </Button>
            </div>
          </nav>
        </div>
      </div>
      {/*Cart Drawer */}
      <div
        className={`fixed top-16 right-0 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } bg-white transition-transform duration-300 ease-in-out z-40 w-full max-w-md lg:max-w-lg`}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold flex justify-between">
            <div className="flex">Cart</div>
            <div className="flex font-md font-semibold pointer">
              <IconButton onClick={()=>{dispatch(toggleIsOpen())}}><FontAwesomeIcon icon={faClose} /></IconButton>
            </div>
          </h2>
          <nav className="mt-4 max-h-[500px] overflow-auto">
            {
              items.map((cartItem) => 
                (
                <div className=" flex flex-col border-b gap-y-2  overflow-y-auto">
                  <div className="flex gap-x-4 py-2 lg:px-6 border-b border-gray-200 w-full font-light text-gray-500">
                      <div className="w-full min-h-[100px] flex items-center gap-x-4">
                          <a href={"/product/" + cartItem._id}>
                              <img className="max-w-[80px]" src={UPLOAD_URI + cartItem.images[0]} alt=""></img>
                          </a>
                          <div className=" w-full flex flex-col">
                              <div className=" flex justify-between mb-2">
                                  <a className=" text-sm uppercase font-medium max-w-[240px] text-slate-800 hover:underline" onClick={()=>{navigate('/product/' + cartItem.id)}}>
                                      {cartItem.title}
                                  </a>
                                  <div className=" text-xl cursor-pointer">
                                  </div>
                              </div>
                              <div className=" flex gap-x-2 h-[36px] text-sm">
                                  <div className=" flex flex-1 max-w-[100px] items-center h-full border text-slate-700 font-medium ">
                                      <button className="flex-1 h-full flex items-center justify-center cursor-pointer"
                                      onClick={()=>{dispatch(updateQuantity({_id:cartItem._id, quantity: cartItem.quantity - 1 >= 0 ? cartItem.quantity - 1 : 0})); if(cartItem.quantity == 1) dispatch(removeItem(cartItem.id))}}>
                                        <FontAwesomeIcon icon={faMinus}/>
                                      </button>
                                      <div className="h-full flex justify-center items-center px-2 ">
                                          {cartItem.quantity}
                                      </div>
                                      <button className="flex-1 h-full flex items-center justify-center cursor-pointer"
                                        onClick={()=>{dispatch(updateQuantity({...cartItem, quantity: cartItem.quantity + 1}))}}>
                                        <FontAwesomeIcon icon={faPlus}/>
                                      </button>
                                  </div>
                                  <div className="flex-1 flex items-center justify-around ">$ {cartItem.price}</div>
                                  <div className="flex-1 flex justify-end items-center text-slate-700  font-medium ">$ {cartItem.price * cartItem.quantity}</div>
                              </div>
                          </div>
                      </div>
                  </div>
                </div>
                )
              )
            }

            {/* end */}
            <div className="flex flex-row justify-between">
                <Button
                    variant="contained"
                    className="w-[49%]"
                    color='success'
                    onClick={()=>{dispatch(hideIsOpen()); navigate('/Categories')}}
                    disabled={items.length > 0 ? false : true}
                >
                    Go Shopping
                </Button>
                <Button
                    variant="contained"
                    className="w-[49%]"
                    color='error'
                    onClick={handleCheckOut}
                    disabled={items.length > 0 ? false : true}
                >
                    CheckOut
                </Button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
