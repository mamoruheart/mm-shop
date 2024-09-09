import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App.tsx";
import { store } from "./redux/store.ts";
import { SnackbarProvider } from "./component/utils/SnackbarProvider.tsx";
import { GOOGLE_CLIENT_ID } from "./constant.ts";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <SnackbarProvider>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <App />
          </GoogleOAuthProvider>
        </SnackbarProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
