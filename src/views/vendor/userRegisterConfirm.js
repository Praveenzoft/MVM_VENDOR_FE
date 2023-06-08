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

import { useState, useEffect } from "react";

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
import 'assets/css/common.css';
import { CircularProgress } from "@mui/material";



function UserRegisterConfirm() {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const [controller] = useMaterialUIController();
    const { minPasswordLength } = controller;
    const baseUrl = configurations.baseUrl;
    const azureFunctionVendorFrontendKey=configurations.azureFunctionVendorFrontendKey;
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        setValue,
        handleSubmit,
        setError,
        watch,
        formState: { errors }
    } = useForm();

    const [params, setParams] = useState(null);

    useEffect(() => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const paramsObj = Object.fromEntries(urlSearchParams.entries()); //console.log(paramsObj);
        setParams(paramsObj);
        if (paramsObj.email) {
            setValue('email', paramsObj.email);
        }
        if (paramsObj.token) {
            setValue('token', paramsObj.token);
        }


    }, []);



    const onSubmit = async (data) => {
        console.log(data);
        setIsLoading(true)
        await axios.post(baseUrl + '/registerConfirmation', data,
        {
            function : azureFunctionVendorFrontendKey
        }).then((response) => {
            console.log(response);
            if (response.status == 200) {
                const message = response.data.message;
                if (response.data.status == 1) {

                    setIsLoading(false);
                    toast.success(t(message), { position: toast.POSITION.TOP_CENTER, hideProgressBar: true });

                    navigate('/vendor/login');
                    //navigate('/');
                }
                else {
                    setIsLoading(false);
                    if (message != '')
                        toast.error(t(message), { position: toast.POSITION.TOP_CENTER, hideProgressBar: true });

                    // if (response && response.data && response.data.errors) {
                    //     const errorData = response.data.errors;

                    //     console.log(errorData);
                    //     // Iterate over the errors and set them using setError from react-hook-form

                    // }
                }

            }
            else {
                toast.error(t('unableToProccessRequest'), { position: toast.POSITION.TOP_CENTER, hideProgressBar: true });

            }


        }).catch(error => {
            // The login failed, handle the error response
            console.log(' failed!');
            console.log(error);
            toast.error(error, { position: toast.POSITION.TOP_CENTER, hideProgressBar: true });
        });



    };


    return (
        <BasicLayout image={bgImage}>
            {isLoading ? (
                <div style={{ textAlign: "center", marginTop: "50px" }}>
                    <CircularProgress />
                </div>
            ) : (

                <Card>
                    <ToastContainer toastClassName="custom-toast" />
                   
                        <MDBox component="form" role="form" onSubmit={handleSubmit(onSubmit)}>
                            
                                <MDButton type="submit" variant="gradient" color="info" fullWidth>
                                    {t('clickHere')}
                                </MDButton>


                    </MDBox>

                </Card>
            )}
        </BasicLayout>
    );
}

export default UserRegisterConfirm;
