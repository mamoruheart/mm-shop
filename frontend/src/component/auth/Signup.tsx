/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  ThemeProvider,
  Typography,
  createTheme
} from "@mui/material";

import { AppDispatch } from "../../redux/store";
import { RootState } from "../../redux/store";
import { signup } from "../../redux/reducer/authSlice";

export const Signup: React.FC = () => {
  const { error, user } = useSelector((state: RootState) => state.auth);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = `${data.get("email")}`;
    const password = `${data.get("password")}`;
    const name = `${data.get("firstName")} ${data.get("lastName")}`;
    const phone = `${data.get("phone")}`;
    dispatch(signup(navigate, email!, name!, phone!, password!));
    navigate("/login");
    console.log(user);
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

  //-- TODO remove, this app shouldn't need to reset the theme.
  const defaultTheme = createTheme({});

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container
        component="main"
        maxWidth="xs"
        className="bg-white p-2 m-16 rounded-xl"
      >
        <Box className="bg-white flex items-center flex-col mt-10">
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            {/* <LockOutlinedIcon /> */}
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  variant="standard"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  size="small"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  variant="standard"
                  label="Last Name"
                  name="lastName"
                  size="small"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phone"
                  variant="standard"
                  label="Phone Number"
                  size="small"
                  name="phone"
                  autoComplete="phone"
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

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Grid container className="flex flex-row justify-start">
              <Grid item className="text-[#ff0000] pt-2 ">
                {error && <p>{"Error: " + error}</p>}
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  onClick={() => {
                    navigate("/login");
                  }}
                  variant="body2"
                  className="cursor-pointer"
                >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
};
