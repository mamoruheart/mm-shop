/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect, useState } from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
// import { createTheme } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { AppDispatch } from "../../redux/store";
import { RootState } from "../../redux/store";
import {
  createOrder,
  getOrders,
  postOrder
} from "../../redux/reducer/orderSlice";
import { useSnackbar } from "../utils/SnackbarProvider";
import { clearCart } from "../../redux/reducer/cartSlice";

export const Step1 = () => {
  const [file, setFile] = useState<File>();
  const { showSnackbar } = useSnackbar();
  const dispatch: AppDispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart);
  const user = useSelector((state: RootState) => state.auth);
  const orders = useSelector((state: RootState) => state.order);
  const navigate = useNavigate();

  // const theme = createTheme({
  //   palette: {
  //     primary: {
  //       main: "#f94316"
  //     }
  //   },
  //   typography: {
  //     allVariants: {
  //       color: "#000000"
  //     }
  //   }
  // });

  let totalPrice = 0;
  cartItems.items.map((item) => {
    totalPrice += item.quantity * item.price;
  });

  // useEffect(() => {
  //   if (orders.newOrder) {
  //     // navigate(`/dashboard/track/${orders.newOrder!._id}`);
  //   }
  // }, [orders.newOrder]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (!file) {
        showSnackbar("Please upload FFL document", "warning");
        return;
      }
      const newOrder = createOrder();
      const data = new FormData(e.currentTarget);
      newOrder.billAddress = {
        city: data.get("bill_city")?.toString() ?? "",
        state: data.get("bill_state")?.toString() ?? "",
        zip: data.get("bill_zip")?.toString() ?? ""
      };
      newOrder.deliveryAddress = {
        city: data.get("deli_city")?.toString() ?? "",
        state: data.get("deli_state")?.toString() ?? "",
        zip: data.get("deli_zip")?.toString() ?? ""
      };
      newOrder.payment = data.get("payment")?.toString() ?? "";
      newOrder.stepNo = 1;
      newOrder.totalPrice = totalPrice;
      newOrder.user = user.user!.id;
      cartItems.items.map((item) => {
        newOrder.items.push({
          product: item._id!,
          price: item.price,
          amount: item.quantity
        });
      });
      data.append("order", JSON.stringify(newOrder));
      dispatch(postOrder(navigate, data));
      dispatch(getOrders(navigate, `${user.user!.id}`));
      showSnackbar("New order created", "success");
      dispatch(clearCart());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-6">
          <label
            htmlFor="username"
            className="block text-md font-medium leading-6 text-gray-900"
          >
            FFL Copy *<br></br>
            <span className="text-sm font-light text-gray-400">
              DO NOT transform or edit photo. Delivery will be perform to your
              FFL address
            </span>
          </label>
          <div className="mt-2">
            <div className="flex rounded-md shadow-sm ring-gray-300 sm:max-w-md">
              {/* <Button
                component="label"
                theme={theme}
                role={undefined}
                variant="contained"
                size="small"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              > */}
              <Button
                variant="contained"
                role={undefined}
                size="small"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Upload FFL
                <input
                  hidden
                  type="file"
                  name="file"
                  onChange={(e) => {
                    if (e.target.files) {
                      const selectedFiles = Array.from(e.target.files);
                      setFile(selectedFiles[0]);
                    }
                  }}
                />
              </Button>
            </div>
          </div>
        </div>
        <div className="sm:col-span-6">
          <label
            htmlFor="username"
            className="block text-md font-medium leading-6 text-gray-900"
          >
            Billing Address *<br></br>
          </label>
          <div className="mt-2">
            <div className="flex md:flex-row flex-col rounded-md shadow-sm ring-gray-300 gap-x-5">
              <TextField
                name="bill_city"
                label="City"
                variant="standard"
                size="small"
                className="w-full"
                required
              />
              <TextField
                name="bill_state"
                label="State"
                variant="standard"
                size="small"
                className="w-full"
                required
              />
              <TextField
                name="bill_zip"
                label="Zip Code"
                variant="standard"
                size="small"
                className="w-full"
                required
              />
            </div>
          </div>
        </div>
        <div className="sm:col-span-6">
          <label
            htmlFor="username"
            className="block text-md font-medium leading-6 text-gray-900"
          >
            Delivery Address *<br></br>
          </label>
          <div className="mt-2">
            <div className="flex md:flex-row flex-col rounded-md shadow-sm ring-gray-300 gap-x-5">
              <TextField
                name="deli_city"
                label="City"
                variant="standard"
                size="small"
                className="w-full"
                required
              />
              <TextField
                name="deli_state"
                label="State"
                variant="standard"
                size="small"
                className="w-full"
                required
              />
              <TextField
                name="deli_zip"
                label="Zip Code"
                variant="standard"
                size="small"
                className="w-full"
                required
              />
            </div>
          </div>
        </div>
        <div className="sm:col-span-6">
          <label
            htmlFor="username"
            className="block text-md font-medium leading-6 text-gray-900"
          >
            Payment Method *
            <span className="ml-2 text-sm font-small text-gray-400"></span>
          </label>
          <div className="mt-2">
            <div className="flex rounded-md shadow-sm ring-gray-300 sm:max-w-md">
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                label="Payment"
                name="payment"
                defaultValue={"Check"}
                size="small"
                className="w-48"
                variant="standard"
                // onChange={}
              >
                <MenuItem value={"Check"}>By Check</MenuItem>
                <MenuItem value={"Bank"}>By Bank</MenuItem>
                <MenuItem value={"Crypto"}>By Crypto</MenuItem>
                <MenuItem value={"Credit Card"}>By Credit Card</MenuItem>
                <MenuItem value={"Payoneer/Paypal"}>Payoneer/Paypal</MenuItem>
              </Select>
            </div>
          </div>
        </div>
        <div className="sm:col-span-6">
          <label
            htmlFor="username"
            className="block text-md font-medium leading-6 text-gray-900"
          >
            Products
            <span className="ml-2 text-sm font-light text-gray-400">
              Total ${totalPrice} (exclude Delivery Fee)
            </span>
          </label>
          {cartItems.items.map((item, index) => (
            <div className="mt-2" key={index}>
              <ul className="sm:px-10 flex flex-row sm:w-full justify-between">
                <div className="flex flex-col items-start justify-between">
                  <h2 className="text-dm text-gray-900">
                    {item.title} {item.caliber !== 0 ? item.caliber + "mm" : ""}{" "}
                  </h2>
                </div>
                <div className="flex flex-col items-start justify-between">
                  <h2 className="text-md text-gray-900">
                    {" "}
                    {item.quantity} Pieces
                  </h2>
                </div>
                <div className="flex items-center space-x-4">
                  <p className=" font-semibold text-md">$ {item.price}/Pcs</p>
                </div>
              </ul>
            </div>
          ))}
        </div>
        <div className="sm:col-span-6">
          <div className="mt-2">
            <ul className="flex flex-row justify-end gap-x-5">
              {/* <Button
                size="small"
                theme={theme}
                variant="contained"
                startIcon={<CheckIcon />}
                type="submit"
                disabled={orders.loading}
              > */}
              <Button
                size="small"
                variant="contained"
                startIcon={<CheckIcon />}
                type="submit"
                disabled={orders.loading}
              >
                {orders.loading ? "Submitting..." : "Submit"}
              </Button>
              <Button
                size="small"
                variant="contained"
                color="inherit"
                startIcon={<CloseIcon />}
              >
                Cancel
              </Button>
            </ul>
          </div>
        </div>
      </div>
    </form>
  );
};
