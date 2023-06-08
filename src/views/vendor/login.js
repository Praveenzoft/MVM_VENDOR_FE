/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useCallback } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";


// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import configurations from "config";
import { useTranslation } from "react-i18next";
import CircularProgress from "@mui/material/CircularProgress";

import {
    LoginSocialGoogle,
    LoginSocialAmazon,
    LoginSocialFacebook,
    LoginSocialGithub,
    LoginSocialInstagram,
    LoginSocialLinkedin,
    LoginSocialMicrosoft,
    LoginSocialPinterest,
    LoginSocialTwitter,
    LoginSocialApple,
    IResolveParams,
} from 'reactjs-social-login';

import {
    FacebookLoginButton,
    GoogleLoginButton,
    GithubLoginButton,
    AmazonLoginButton,
    InstagramLoginButton,
    LinkedInLoginButton,
    MicrosoftLoginButton,
    TwitterLoginButton,
    AppleLoginButton,
} from 'react-social-login-buttons';

import { toast, Toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Button } from "@mui/material";
import { position } from "stylis";
import 'assets/css/common.css';


// const REDIRECT_URI = 'http://localhost:3000/user/facebookResponse'



function Login() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [controller] = useMaterialUIController();
    const { minPasswordLength } = controller;
    const [isLoading, setIsLoading] = useState(false);

    // const [provider, setProvider] = useState('');
    // const [profile, setProfile] = useState('');

    const baseUrl=configurations.baseUrl;
    const azureFunctionVendorFrontendKey=configurations.azureFunctionVendorFrontendKey;


    const {
        register,
        handleSubmit,
        formState: { errors },
        //   setError
    } = useForm();

    const onSubmit = async (data) => {
        console.log(data);
        setIsLoading(true);

        await axios.post(baseUrl+'/login', data,
        {
            headers:{function:azureFunctionVendorFrontendKey}
        }).then((response) => {
            setIsLoading(false);

            console.log(response);
            const requestStatus = response.status;


            if (requestStatus == 200) {
                const status = response.data.status;
                const message = response.data.message;
                if (status == 1) {

                    const token = response.data.data.token; // Assuming the token is returned as "token" property in the response
                    const userID = response.data.data.id;
                    // Store the token in the browser's local storage
                    localStorage.setItem('JWTToken', token)
                    localStorage.setItem("userID", userID)
                    // localStorage.setItem('i18nextLng', configurations.locale)
                    // toast.success(message)
                    console.log(message);
                    // alert(message)
                    //  navigate('/dashboard');
                    navigate('/');
                }
                else {
                    if (message != '')
                        toast.error(t(message), { position: toast.POSITION.TOP_CENTER, hideProgressBar: true });

                    if (response && response.data && response.data.errors) {
                        const errorData = response.data.errors;

                        console.log(errorData);
                        // Iterate over the errors and set them using setError from react-hook-form
                        errorData.forEach((error) => {
                            console.log(error.field);
                            setError(error.field, {
                                type: 'server',
                                message: t(error.errors[0])
                            });
                        });
                    }
                }
            }
            else {
                // setError('email', { message: 'An error occurred. Please try again later.' });
                toast.error(t('unableToProccessRequest'), { position: toast.POSITION.TOP_CENTER, hideProgressBar: true });

            }



        }).catch(error => {
            // The login failed, handle the error response
            console.log('Login failed!');
            console.log(error);
            toast.error(error, { position: toast.POSITION.TOP_CENTER, hideProgressBar: true });

        });




    };

    const onLoginStart = useCallback(() => {
        alert('login start');
    }, []);

    const onLogoutSuccess = useCallback(() => {
        setProfile(null);
        setProvider('');
        alert('logout success');
    }, []);

    const onLogout = useCallback(() => { }, []);



    return (
        <BasicLayout image={bgImage}>
            <Card>
                <ToastContainer toastClassName="custom-toast" />
                <MDBox
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="info"
                    mx={2}
                    mt={-3}
                    p={2}
                    mb={1}
                    textAlign="center"
                >
                    <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                        {t('signIn')}
                    </MDTypography>
                    {/* <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
                        <Grid item xs={2}>
                            <LoginSocialFacebook
                                appId='1317538085776964'
                                fieldsProfile={
                                    'id,first_name,last_name,middle_name,name,name_format,picture,short_name,email,gender'
                                }
                                onLoginStart={onLoginStart}
                                onLogoutSuccess={onLogoutSuccess}

                                redirect_uri={REDIRECT_URI}
                                onResolve={({ provider, data }: IResolveParams) => {
                                    setProvider(provider);
                                    setProfile(data);

                                    console.log("provide");
                                    console.log(provider);
                                    console.log("data");
                                    console.log(data);
                                }}
                                onReject={err => {
                                    console.log(err);
                                }}
                            >

                                <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                                    <FacebookIcon />
                                </MDTypography>
                            </LoginSocialFacebook>
                        </Grid>
                        <Grid item xs={2}>
                            <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                                <GitHubIcon color="inherit" />
                            </MDTypography>
                        </Grid>
                        <Grid item xs={2}>
                            <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                                <GoogleIcon color="inherit" />
                            </MDTypography>
                        </Grid>
                    </Grid> */}


                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                    <MDBox component="form" role="form" onSubmit={handleSubmit(onSubmit)}>
                        <MDBox mb={2}>
                            <MDInput
                                type="text"
                                label={t('email')}
                                name="email"
                                {...register("email", {
                                    required: {
                                        value: true,
                                        message: t('emailRequired')
                                    },
                                    pattern: {
                                        value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                                        message: t('invalidEmail')
                                    }
                                })}
                                fullWidth />


                            {errors.email && (
                                <p className="errorMsg">{errors.email.message}</p>
                            )}
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                type="password"
                                label={t('password')}
                                name="password"
                                {...register("password", {
                                    required: {
                                        value: true,
                                        message: t('passwordRequired')
                                    },
                                    minLength: {
                                        value: minPasswordLength,
                                        message: t('passwordMinLength', { minPasswordLength })
                                    }
                                })}
                                fullWidth />

                            {errors.password && (
                                <p className="errorMsg">{errors.password.message}</p>
                            )}

                        </MDBox>

                        <MDBox mt={4} mb={1}>
                            <MDButton type="submit" variant="gradient" color="info" fullWidth>
                            {isLoading ? (
                                <CircularProgress color='inherit' size={20}/>
                              ) : (
                                t('signIn')
                              )} 
                            </MDButton>
                        </MDBox>
                        <MDBox mt={3} mb={1} textAlign="center">
                            <MDTypography variant="button" color="text">
                                {t('dontHaveAccount')}
                                <MDTypography
                                    component={Link}
                                    to="/vendor/register"
                                    variant="button"
                                    color="info"
                                    fontWeight="medium"
                                    textGradient
                                >
                                    {t('signUp')}
                                </MDTypography>
                            </MDTypography>
                        </MDBox>
                        <MDBox mt={3} mb={1} textAlign="center">
                            <MDTypography
                                component={Link}
                                to="/vendor/forgotPassword"
                                variant="button"
                                color="info"
                                fontWeight="medium"
                                textGradient
                            >
                                {t('forgotPassword')}
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </MDBox>
            </Card>
        </BasicLayout>
    );
}

export default Login;
