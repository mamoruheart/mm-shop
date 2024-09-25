import { success } from "react-notification-system-redux";
import axios from "axios";

import {
  ACCOUNT_CHANGE,
  FETCH_PROFILE,
  CLEAR_ACCOUNT,
  SET_PROFILE_LOADING
} from "./constants";
import handleError from "../../utils/error";
import { API_URL } from "../../constants";

export const accountChange = (name, value) => {
  let formData = {};
  formData[name] = value;

  return {
    type: ACCOUNT_CHANGE,
    payload: formData
  };
};

export const clearAccount = () => {
  return {
    type: CLEAR_ACCOUNT
  };
};

export const setProfileLoading = (value) => {
  return {
    type: SET_PROFILE_LOADING,
    payload: value
  };
};

export const fetchProfile = () => {
  return async (dispatch, getState) => {
    try {
      dispatch(setProfileLoading(true));
      const response = await axios.get(`${API_URL}/user/me`);

      dispatch({ type: FETCH_PROFILE, payload: response.data.user });
    } catch (err) {
      console.error("fetchProfile:", err?.message);
      handleError(err, dispatch);
    } finally {
      dispatch(setProfileLoading(false));
    }
  };
};

export const updateProfile = () => {
  return async (dispatch, getState) => {
    try {
      const profile = getState().account.user;
      const response = await axios.put(`${API_URL}/user`, {
        profile
      });

      const successfulOptions = {
        title: `${response.data.message}`,
        position: "tr",
        autoDismiss: 3
      };

      dispatch({ type: FETCH_PROFILE, payload: response.data.user });

      dispatch(success(successfulOptions));
    } catch (err) {
      console.error("updateProfile:", err?.message);
      handleError(err, dispatch);
    }
  };
};
