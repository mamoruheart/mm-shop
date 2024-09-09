/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  ThemeProvider,
  Typography,
  createTheme
} from "@mui/material";
import Cookies from "js-cookie";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import AppleSignInButton from "react-apple-signin-auth";

import { AppDispatch } from "../../redux/store";
import { RootState } from "../../redux/store";
import { login, loginSuccess } from "../../redux/reducer/authSlice";
import {
  APPLE_CLIENT_ID,
  APPLE_REDIRECT_URL,
  APPLE_SCOPE
} from "../../constant";

export const Login: React.FC = () => {
  const { error, user } = useSelector((state: RootState) => state.auth);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = `${data.get("email")}`;
    const password = `${data.get("password")}`;
    dispatch(login(navigate, email, password));
    console.log(user);
  };

  const handleLogin = async (credentialResponse: any) => {
    try {
      console.log(credentialResponse);
      const response = await axios.post(
        "/api/auth/google/callback",
        {
          credential: credentialResponse.credential
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      const data = response.data;
      Cookies.set("token", data.token, { expires: 1 }); //-- 1 day expiry
      data.user.id = data.user._id;
      data.user.phone = data.user.phone ?? "";
      dispatch(loginSuccess({ user: data.user, token: data.token }));
      console.log(data.user.phone == undefined, "phone");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  function Copyright(props: any) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {"Copyright © "}
        <Link
          color="inherit"
          onClick={() => {
            navigate("/");
          }}
        >
          Michaels Machines
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  }

  //-- TODO remove, this app shouldn't need to reset the theme
  const defaultTheme = createTheme({});

  useEffect(() => {
    if (user)
      if (user!.phone == "") navigate("/dashboard/setting/");
      else navigate("/");
  });

  return (
    <div className="h-screen  flex flex-row justify-center m-4">
      <ThemeProvider theme={defaultTheme}>
        <div className="flex flex-col md:w-[50%] w-screen">
          <div className="top-1 h-[80px] ">
            <div className="h-full p-1 flex flex-row">
              <img src="/images/logo.gif" className="h-full p-4" />
              <div className="flex flex-col justify-center">
                <p className="text-2xl font-bold "> Michael's Machines</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center h-full">
            <Container
              component="main"
              maxWidth="xs"
              className="bg-white p-2 pb-5 rounded-xl"
            >
              <Box className="bg-white flex items-left flex-col mt-10">
                <Typography component="h1" variant="h5" className="text-left">
                  Sign In
                </Typography>
                <div>
                  New to Here?{" "}
                  <a
                    className="text-[#1e77cf] cursor-pointer"
                    onClick={() => {
                      navigate("/register");
                    }}
                  >
                    Sign Up
                  </a>
                </div>
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 3 }}
                >
                  <Grid container spacing={2}>
                    <Grid
                      item
                      md={6}
                      xs={12}
                      className="flex flex-row justify-center"
                    >
                      <GoogleLogin onSuccess={handleLogin} />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                      className="flex flex-row justify-center"
                    >
                      <AppleSignInButton
                        authOptions={{
                          clientId: APPLE_CLIENT_ID,
                          scope: APPLE_SCOPE,
                          redirectURI: APPLE_REDIRECT_URL
                        }}
                        uiType="dark"
                        className="h-[40px]"
                        noDefaultStyle={false}
                        buttonExtraChildren="Continue with Apple"
                        onSuccess={(res: any) => console.log(res)} // default = undefined
                        onError={(err: any) => console.error(err)} // default = undefined
                        skipScript={false} // default = undefined
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="email"
                        variant="standard"
                        label="Email Address"
                        size="small"
                        name="email"
                        autoComplete="email"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        variant="standard"
                        size="small"
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    className="flex flex-row justify-start"
                  ></Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 6, mb: 2 }}
                  >
                    Sign In
                  </Button>
                  <Grid container className="flex flex-row justify-between">
                    <Grid item className=" pt-2">
                      <a className="underline underline-offset-auto cursor-pointer text-[#0000aa]">
                        Forgot Password?
                      </a>
                    </Grid>
                    <Grid item className="text-[#ff0000] pt-2 ">
                      {error && <p>{error}</p>}
                    </Grid>
                  </Grid>
                </Box>
              </Box>
              <Copyright sx={{ mt: 5 }} />
            </Container>
          </div>
        </div>
        <div className="flex flex-col md:w-[50%] bg-[url('/images/Map.PNG')] bg-cover"></div>
      </ThemeProvider>
    </div>
  );
};
