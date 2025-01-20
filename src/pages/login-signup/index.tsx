"use client"

import React, { useEffect, useState } from 'react';
import {
  Container,
  Card,
  Box,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import './login-signup.css'; // Assuming the CSS will be in this file
import '@/../public/assets/css/table.css';
import '@/../public/assets/css/master.css';
import { setDarkMode } from '@/app/redux/slices/uiSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/redux/store';
import { login, signup, sendEmailOtp, verifyEmailOtp, verifyLoginOtp } from '@/app/redux/slices/api/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const LoginSignup: React.FC = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [activeTextIndex, setActiveTextIndex] = useState(0);
  const [otp, setOtp] = useState('');
  const [isOtpFieldVisible, setIsOtpFieldVisible] = useState(false);
  const [isLoginOtpSent, setIsLoginOtpSent] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    // setIsClient(true);
    if (Cookies.get("token")) {
      window.location.href = '/dashboard';
    }
  }, [router])

  useEffect(() => {
    dispatch(setDarkMode(true));

    const interval = setInterval(() => {
      setActiveTextIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleToggleMode = () => {
    setIsSignUpMode((prev) => !prev);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSignUpMode) {
      try {
        const response = await dispatch(signup({ email, username, password })).unwrap();
        toast.success(response?.message);
      } catch (error) {
        const errorMessage =
          typeof error === "string"
            ? error
            : error instanceof Error
              ? error.message
              : "An unknown error occurred";
        toast.error(errorMessage);
      }
    }
    else {
      try {
        const response = await dispatch(verifyLoginOtp({ username, otp })).unwrap();
        toast.success(response);
        router.push('/dashboard');
      } catch (error) {
        const errorMessage =
          typeof error === "string"
            ? error
            : error instanceof Error
              ? error.message
              : "An unknown error occurred";
        toast.error(errorMessage);
      }
    }
  };

  const handleSendLoginOtp = async () => {
    try {
      const response = await dispatch(login({ username, password })).unwrap();
      toast.success(response.message);
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error instanceof Error
            ? error.message
            : "An unknown error occurred";
      toast.error(errorMessage);
    }
    finally {
      setIsLoginOtpSent(true)
    }
  }

  const handleVerifyOtp = async () => {
    try {
      const response = await dispatch(verifyEmailOtp({ otp })).unwrap();
      toast.success("OTP verified successfully!");
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error instanceof Error
            ? error.message
            : "An unknown error occurred";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <ToastContainer />
      <main className={isSignUpMode ? 'main sign-up-mode' : 'main'}>
        <Container>
          <Card className="box">
            <Box className="inner-box">
              <Box className="forms-wrap">
                <form
                  className={isSignUpMode ? 'form sign-up-form' : 'form sign-in-form'}
                  autoComplete="off"
                  onSubmit={handleSubmit}
                >
                  <Box className="logo">
                    <img src="/assets/svg/logos/logoName.svg" alt="Logo" />
                  </Box>
                  <Box className="heading">
                    <Typography variant="h5">
                      {isSignUpMode ? 'Get Started' : 'Welcome Back'}
                    </Typography>
                    <Typography variant="subtitle1">
                      {isSignUpMode
                        ? 'Already have an account? '
                        : 'Not registered yet? '}
                      <span className="toggle" onClick={handleToggleMode}>
                        {isSignUpMode ? 'Sign in' : 'Sign up'}
                      </span>
                    </Typography>
                  </Box>
                  {isSignUpMode && (
                    <>
                      <TextField
                        fullWidth
                        label="Email"
                        variant="standard"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      {isOtpFieldVisible && (
                        <>
                          <TextField
                            fullWidth
                            label="Enter OTP"
                            variant="standard"
                            value={otp}
                            type='number'
                            onChange={(e) => setOtp(e.target.value)}
                            required
                          />
                          <Button
                            type="button"
                            variant="contained"
                            color="primary"
                            fullWidth
                            className="small-btn mt-10"
                            onClick={handleVerifyOtp}
                          >
                            Verify OTP
                          </Button>
                        </>
                      )}
                    </>
                  )}
                  <TextField
                    fullWidth
                    label="Username"
                    variant="standard"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    variant="standard"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    margin="normal"
                  />
                  {
                    !isSignUpMode && !isLoginOtpSent &&
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      fullWidth
                      className="small-btn mt-10"
                      onClick={handleSendLoginOtp}
                    >
                      Send OTP
                    </Button>
                  }
                  {
                    !isSignUpMode && isLoginOtpSent &&
                    <>
                      <TextField
                        fullWidth
                        label="Enter OTP"
                        variant="standard"
                        value={otp}
                        type='number'
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        className="small-btn mt-10 mb-30"
                      >
                        Login
                      </Button>
                    </>
                  }
                  {
                    isSignUpMode && 
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        className="small-btn mt-10 mb-30"
                      >
                        Sign Up
                      </Button>
                  }
                  <Typography variant="body2" align="center" className="text">
                    Forgot Password? <a href="">Get help</a> signing in.
                  </Typography>
                </form>
              </Box>
              <Box className="carousel">
                <Box className="images-wrapper">
                  <img src="/assets/svg/login/image1.svg" className={activeTextIndex === 0 ? 'image show' : 'image'} alt="" />
                  <img src="/assets/svg/login/image2.svg" className={activeTextIndex === 1 ? 'image show' : 'image'} alt="" />
                  <img src="/assets/img/login/image3.png" className={activeTextIndex === 2 ? 'image show' : 'image'} alt="" />
                </Box>
                <Box className="text-slider">
                  <Box className="text-wrap">
                    <Box className="text-group" style={{ transform: `translateY(${-(activeTextIndex) * 2.2}rem)` }}>
                      <Typography variant="h5">Streamline your finances effortlessly</Typography>
                      <Typography variant="h5">Your all-in-one accounting solution</Typography>
                      <Typography variant="h5">Effortless financial management</Typography>
                    </Box>
                  </Box>
                  <Box className="bullets">
                    {[...Array(3)].map((_, index) => (
                      <span
                        key={index}
                        className={index === activeTextIndex ? 'active' : ''}
                        data-value={index + 1}
                        onClick={() => setActiveTextIndex(index)}
                      ></span>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Card>
        </Container>
      </main>
    </>
  );
};

export default LoginSignup;
