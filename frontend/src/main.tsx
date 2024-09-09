import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './redux/store.ts';
import { SnackbarProvider } from './component/utils/SnackbarProvider.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './constant.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
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
  </React.StrictMode>,
)
