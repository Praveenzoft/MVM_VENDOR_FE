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
import CircularProgress from "@mui/material/CircularProgress";



import { toast, Toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Button } from "@mui/material";
import { position } from "stylis";
import 'assets/css/common.css';


function ForgotPasswordConfirm() {
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
    const paramsObj = Object.fromEntries(urlSearchParams.entries()); console.log(paramsObj);
    setParams(paramsObj);
    if (paramsObj.email) {
      setValue('email', paramsObj.email);
    }
    if (paramsObj.token) {
      setValue('token', paramsObj.token);
    }

    if (paramsObj.expiry) {
      setValue('expiry', paramsObj.expiry);
    }
  }, []);



  const onSubmit = async (data) => {
    console.log(data);
    setIsLoading(true);

    await axios.post(baseUrl + '/forgotPasswordConfirm', data,
    {
      headers:{function:azureFunctionVendorFrontendKey}
    }).then((response) => {
      console.log(response);
      setIsLoading(false);

      if (response.status == 200) {
        const message = response.data.message;
        if (response.data.status == 1) {


          toast.success(t(message), { position: toast.POSITION.TOP_CENTER, hideProgressBar: true });

          navigate('/vendor/login');
          //navigate('/');
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
            {t('resetPassword')}
          </MDTypography>
          {/* <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <FacebookIcon color="inherit" />
              </MDTypography>
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
                //  label={t('email')}
                name="email"
                {...register("email")}
                disabled
                fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label={t('newPassword')}
                name="newPassword"
                {...register("newPassword", {
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

              {errors.newPassword && (
                <p className="errorMsg">{errors.newPassword.message}</p>
              )}


            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label={t('confirmPassword')}
                name="confirmPassword"
                {...register("confirmPassword", {
                  required: {
                    value: true,
                    message: t('passwordRequired')
                  },
                  minLength: {
                    value: minPasswordLength,
                    message: t('passwordMinLength', { minPasswordLength })
                  },
                  validate: (value) => {
                    if (watch('newPassword') != value) {
                      return t('passwordMismatch');
                    }
                  },
                })}
                fullWidth />

              {errors.confirmPassword && (
                <p className="errorMsg">{errors.confirmPassword.message}</p>
              )}


            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton type="submit" variant="gradient" color="info" fullWidth>
                {isLoading ? (
                  <CircularProgress color='inherit' size={20} />
                ) : (
                  t('submit')
                )}
              </MDButton>
            </MDBox>


          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default ForgotPasswordConfirm;
