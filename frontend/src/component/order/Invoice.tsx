import {
  faEnvelope,
  faLocation,
  faPhone,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch } from "../../redux/store";
import { UPLOAD_URI, CONTACT, FEE } from "../../constant";
import { RootState } from "../../redux/store";
import { Order } from "../../redux/reducer/orderSlice";
import { Customer, getCustomers } from "../../redux/reducer/customerSlice";

export const Invoice = () => {
  const params = useParams();
  const orders = useSelector((state: RootState) => state.order);
  const { user } = useSelector((state: RootState) => state.auth);
  const { products } = useSelector((state: RootState) => state.product);
  const customer = useSelector((state: RootState) => state.customer);
  const [currentOrder, setCurrentOrder] = useState<Order>();
  const [currentCustomer, setCurrentCustomer] = useState<Customer>();
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const getProduct = (id: string) => {
    const filteredProduct = products.filter((item) => item._id == id);
    return filteredProduct[0];
  };

  useEffect(() => {
    console.log(user);
    const filteredOrders = orders.orders.filter(
      (item) => item._id!.toString() === params.id
    );
    if (!orders.newOrder) {
      console.log(filteredOrders, params.id, orders);
      setCurrentOrder(filteredOrders[0]);
    } else {
      setCurrentOrder(orders.newOrder);
    }
    if (user!.state == 1) dispatch(getCustomers(navigate));
  }, [params]);

  useEffect(() => {
    if (currentOrder) {
      let tempTotal = 0;
      for (const item of currentOrder!.items) {
        tempTotal += item.amount! * item.price!;
      }
      setTotalPrice(tempTotal);
    }
  }, [currentOrder]);

  useEffect(() => {
    if (customer && currentOrder) {
      if (user!.state == 1) {
        console.log(customer.customers[0]._id, currentOrder?.user);

        const filteredCustomer = customer.customers.filter(
          (item) => item._id == currentOrder!.user!.toString()
        );

        setCurrentCustomer(filteredCustomer[0]);
      }
    }
  }, [currentOrder]);

  return (
    <>
      <div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-6">
          <label className="block text-md font-medium leading-6 text-gray-900">
            Invoice Number: INV-41576
          </label>
          <label className="block text-md font-medium leading-6 text-gray-900">
            Invoice Date:{" "}
            {currentOrder ? currentOrder.date_added?.toString() : ""}
          </label>
          <label className="block text-md font-medium leading-6 text-gray-900">
            FFL:{" "}
            <a
              className="text-blue-500 underline-offset-2"
              href={UPLOAD_URI + currentOrder?.ffl}
            >
              Donwload FFL
            </a>
          </label>
          {/* <label className="block text-md font-medium leading-6 text-gray-900">
            Due Number: 2024-07-21
          </label> */}
        </div>
        <div className="sm:col-span-3">
          <label className="block text-md font-medium leading-6 text-gray-900 pb-2">
            From
          </label>
          <ul>
            <li className="block text-md font-medium leading-6 text-gray-900">
              <FontAwesomeIcon icon={faUser} className="pr-3" /> {CONTACT.name}
            </li>
            <li className="block text-md font-medium leading-6 text-gray-900">
              <FontAwesomeIcon icon={faLocation} className="pr-3" />{" "}
              {CONTACT.address}
            </li>
            <li className="block text-md font-medium leading-6 text-gray-900">
              <FontAwesomeIcon icon={faPhone} className="pr-3" />{" "}
              {CONTACT.phone}
            </li>
            <li className="block text-md font-medium leading-6 text-gray-900">
              <FontAwesomeIcon icon={faEnvelope} className="pr-3" />{" "}
              {CONTACT.email}
            </li>
          </ul>
          <div className="mt-2"></div>
        </div>

        <div className="sm:col-span-3">
          <label className="block text-md font-medium leading-6 text-gray-900 pb-2">
            Bill To
          </label>
          {user!.state == 1 ? (
            <ul>
              <li className="block text-md font-medium leading-6 text-gray-900">
                <FontAwesomeIcon icon={faUser} className="pr-3" />{" "}
                {currentCustomer ? currentCustomer!.name : ""}
              </li>
              <li className="block text-md font-medium leading-6 text-gray-900">
                <FontAwesomeIcon icon={faLocation} className="pr-3" />{" "}
                {currentCustomer
                  ? currentOrder?.billAddress?.city +
                    " " +
                    currentOrder?.billAddress?.state +
                    " " +
                    currentOrder?.billAddress?.zip
                  : ""}
              </li>
              <li className="block text-md font-medium leading-6 text-gray-900">
                <FontAwesomeIcon icon={faPhone} className="pr-3" />{" "}
                {currentCustomer ? currentCustomer!.phone : ""}
              </li>
              <li className="block text-md font-medium leading-6 text-gray-900">
                <FontAwesomeIcon icon={faEnvelope} className="pr-3" />{" "}
                {currentCustomer ? currentCustomer!.email : ""}
              </li>
            </ul>
          ) : (
            <ul>
              <li className="block text-md font-medium leading-6 text-gray-900">
                <FontAwesomeIcon icon={faUser} className="pr-3" /> {user?.name}
              </li>
              <li className="block text-md font-medium leading-6 text-gray-900">
                <FontAwesomeIcon icon={faLocation} className="pr-3" />{" "}
                {currentOrder?.billAddress?.city +
                  " " +
                  currentOrder?.billAddress?.state +
                  " " +
                  currentOrder?.billAddress?.zip}
              </li>
            </ul>
          )}
          <div className="mt-2"></div>
        </div>

        <div className="sm:col-span-6">
          <label className="block text-md font-medium leading-6 text-gray-900">
            Products
          </label>
          <div className="mt-2">
            {currentOrder?.items.map((item) => {
              const product = getProduct(item.product!);
              console.log(item);
              return (
                <ul className="sm:px-10 sm:flex sm:w-full sm:justify-between">
                  <div className="flex flex-col items-start justify-between">
                    <h2 className="text-dm text-gray-900">{product.title} </h2>
                  </div>
                  <div className="flex flex-col items-start justify-between">
                    <h2 className="text-md text-gray-900">
                      {" "}
                      {item.amount} Piece(s)
                    </h2>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className=" font-bold text-md">
                      $ {item.amount! * product.price} (Total)
                    </p>
                  </div>
                </ul>
              );
            })}
          </div>
        </div>
        <div className="sm:col-span-6">
          <label className="block text-md font-medium leading-6 text-gray-900">
            Bill
          </label>
          <div className="mt-2">
            <ul className="sm:px-10 sm:flex sm:w-full sm:justify-between">
              <div className="flex flex-col items-start justify-between">
                <h2 className="text-dm text-gray-900">Subtotal</h2>
              </div>

              <div className="flex items-center space-x-4">
                <p className=" font-bold text-md">$ {totalPrice}</p>
              </div>
            </ul>
            <ul className="sm:px-10 sm:flex sm:w-full sm:justify-between">
              <div className="flex flex-col items-start justify-between">
                <h2 className="text-dm text-gray-900">Delivery Fee (3%)</h2>
              </div>

              <div className="flex items-center space-x-4">
                <p className=" font-bold text-md">
                  + ${(totalPrice * FEE).toFixed(2)}
                </p>
              </div>
            </ul>
            <ul className="sm:px-10 sm:flex sm:w-full sm:justify-between">
              <div className="flex flex-col items-start justify-between">
                <h2 className="text-dm text-gray-900">Total</h2>
              </div>
              <div className="flex items-center space-x-4">
                <p className=" font-bold text-md">$ {totalPrice * (FEE + 1)}</p>
              </div>
            </ul>
          </div>
        </div>
        <div className="sm:col-span-6">
          <div className="mt-2"></div>
        </div>
      </div>
    </>
  );
};
