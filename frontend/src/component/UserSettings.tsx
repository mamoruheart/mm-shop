
import { Button, Grid, TextField } from "@mui/material"
import { AxiosError } from "axios"
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { createAxiosInstance } from "./utils/AxiosInstance";
import { useNavigate } from "react-router-dom";

export const UserSettings = () => {
    const [errorMsg,  setErrorMsg] = useState('');
    const [successMsg,  setSuccessMsg] = useState('');
    const auth = useSelector((state: RootState) => state.auth)
    const axios = createAxiosInstance(useNavigate());
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const fname = data.get('fname');
        const lname = data.get('lname');
        const passwordConfirm = data.get('passwordConfirm');
        const email = auth.user?.email;
        const phone = data.get('phone');
        const password = data.get('password');
        axios.post('/changeInfo', {fname, lname, password, passwordConfirm, phone, email}).then(res => {setSuccessMsg(res.data.msg)}).catch((err: AxiosError) => {setErrorMsg(err.response?.data!.msg)})
    }
    
    
    return(
        <div className="flex flex-row justify-center">
            <div className="h-[100%] max-w-screen-xl w-full bg-white shadow-2xl border border-gray">
                <div className="flex flex-row justify-between text-[20px] pb-2 mb-2 mt-10 border-[#f94316] border-b-[1px] p-2 my-3 mx-10">
                    <p>Personal Information</p>
                    <div className="flex flex-row justify-end text-sm text-gray-500 gap-x-10 md:visible invisible">
                        Please complete your information
                    </div>
                </div>
                <div className="flex flex-row">
                <form
                    action="/changeInfo"
                    onSubmit={onSubmit}>
                    <Grid container spacing={2} className="px-[40px]">
                        <Grid item md={6} xs={12} className="">
                            <TextField
                                variant="standard"
                                label = "First Name"
                                name = "fname"
                                defaultValue={auth.user?.name.split(' ')[0]}
                                className="w-full"
                            />
                        </Grid>
                        <Grid item md={6} xs={12} >
                            <TextField
                                variant="standard"
                                name = "lname"
                                label = "Last Name"
                                defaultValue={auth.user?.name.split(' ')[1]}
                                className="w-full"
                            />
                        </Grid>
                        <Grid item md={6} xs={12}  className="">
                            <TextField
                                variant="standard"
                                label = "Email Address"
                                name = "email"
                                disabled = {true}
                                defaultValue={auth.user?.email}
                                className="w-full"
                            />
                        </Grid>
                        <Grid item md={6} xs={12} >
                            <TextField
                                variant="standard"
                                label = "Phone Number (Required)"
                                name = "phone"
                                defaultValue={auth.user?.phone}
                                className="w-full"
                            />
                        </Grid>
                        <Grid item md={6} xs={12}  className="">
                            <TextField
                                variant="standard"
                                label = "Password"
                                name = "password"
                                type = "password"
                                className="w-full"
                            />
                        </Grid>
                        <Grid item md={6} xs={12} >
                            <TextField
                                variant="standard"
                                label = "Password Confirm"
                                type = "password"
                                name = "passwordConfirm"
                                className="w-full"
                            />
                        </Grid>
                        <Grid item md={12} className="flex flex-row justify-between pb-10">
                            <div>
                                <p className="text-[#ff0000]">{errorMsg}</p>
                                <p className="text-[#1b5e20]">{successMsg}</p>
                            </div>
                            <div className="flex flex-row justify-end">
                                <Button
                                    color="success"
                                    variant="contained"
                                    type="submit"
                                >Save Changes</Button>
                            </div>

                        </Grid>
                    </Grid> 
                </form>     
                </div>
            </div>
        </div>
    )
}