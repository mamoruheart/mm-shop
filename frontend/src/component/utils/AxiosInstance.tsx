import axios from 'axios';
import Cookies from 'js-cookie';

export const createAxiosInstance = (navigate) => {

  const axiosInstance = axios.create({
    baseURL: '/api', // Replace with your API base URL
    headers: {
      Authorization: `Bearer ${Cookies.get('authToken')}`
    }
  });
  
  // Add a request interceptor to include the token in headers
  axiosInstance.interceptors.response.use(
    response => {
      console.log();
      return response;
    }
    ,
    error => {
      console.log('axios Instance Error')
      if (error.response && error.response.status === 403) {
        // Redirect to logout if user is unauthorized (cookie expired)
        navigate('/logout');
      }
      return Promise.reject(error); // Pass through other errors
    }
  );
  
  
  return axiosInstance;
}
