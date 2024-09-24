import axios from "axios";

const setToken = (token) => {
  try {
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  } catch (err) {
    console.error("setToken:", err?.message);
  }
};

export default setToken;
