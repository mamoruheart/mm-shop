import React from "react";

import { GoogleIcon, AppleIcon } from "../Icon";
import { API_URL } from "../../../constants";

const SignupProvider = () => {
  return (
    <div className="signup-provider">
      <a href={`${API_URL}/auth/google`} className="mb-2 google-btn">
        <GoogleIcon />
        <span className="btn-text">Signup with Google</span>
      </a>

      <a href={`${API_URL}/auth/apple`} className="apple-btn">
        <AppleIcon />
        <span className="btn-text">Signup with Apple</span>
      </a>
    </div>
  );
};

export default SignupProvider;
