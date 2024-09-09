import axios from "axios";
import Cookies from "js-cookie";

type NavigateFunction = (path: string) => void;

export const createAxiosInstance = (navigate: NavigateFunction) => {
  const axiosInstance = axios.create({
    baseURL: "/api",
    headers: {
      Authorization: `Bearer ${Cookies.get("authToken")}`
    }
  });

  //-- Add a request interceptor to include the token in headers
  axiosInstance.interceptors.response.use(
    (response) => {
      console.log();
      return response;
    },
    (error) => {
      console.log("axios Instance Error");
      if (error.response && error.response.status === 403) {
        //-- Redirect to logout if user is unauthorized (cookie expired)
        navigate("/logout");
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};
