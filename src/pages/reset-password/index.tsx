"use client";

import React, { useState } from "react";
import {
  Container,
  Card,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./forgot-password.css"; 

import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/app/redux/slices/api/forgotPasswordSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";

import { useRouter } from 'next/router';

const ForgotPassword: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";

  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setPasswordsMatch(newPassword === e.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!passwordsMatch) {
      toast.error("Passwords do not match!");
      return;
    }

     try {
      const body = {
        token: token,
        password: newPassword
      }
          const response = await dispatch(resetPassword(body)).unwrap();
          toast.success(response?.message);
        router.push('/login-signup');
        } catch (error) {
          // console.log("error-====",typeof error)
          const errorMessage: string = 
          typeof error === "string" ? error : "An unknown error occurred";
          toast.error(errorMessage);
        }
  };

  return (
    <>
      <ToastContainer />
      <main className="main forgot-password-mode">
        {/* <Container> */}
          <Card className="box">
            <Box className="inner-box">
              <Box className="forms-wrap">
                <form className="form forgot-password-form" onSubmit={handleSubmit}>
                  <Box className="logo">
                    <img src="/assets/svg/logos/logoName.svg" alt="Logo" />
                  </Box>
                  <Box className="heading">
                    <Typography variant="h5">Reset Your Password</Typography>
                    <Typography variant="subtitle1">
                      Enter a new password to secure your account.
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    label="New Password"
                    variant="standard"
                    type="password"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    required
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    variant="standard"
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                    margin="normal"
                    error={!passwordsMatch && confirmPassword !== ""}
                    helperText={!passwordsMatch && confirmPassword !== "" ? "Passwords do not match" : ""}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    className="small-btn mt-10 mb-30"
                    disabled={!newPassword || !confirmPassword || !passwordsMatch}
                  >
                    Update Password
                  </Button>
                  <Typography variant="body2" align="center" className="text">
                    Remembered your password? <a href="/login-signup">Go back to login</a>.
                  </Typography>
                </form>
              </Box>
            </Box>
          </Card>
        {/* </Container> */}
      </main>
    </>
  );
};

export default ForgotPassword;
