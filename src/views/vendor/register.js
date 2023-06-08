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


import { toast, Toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Button } from "@mui/material";
import { position } from "stylis";
import 'assets/css/common.css';



function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [controller] = useMaterialUIController();
  const { minPasswordLength } = controller;
  const [isLoading, setIsLoading] = useState(false);

  const baseUrl = configurations.baseUrl;
  const azureFunctionVendorFrontendKey = configurations.azureFunctionVendorFrontendKey;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    setIsLoading(true);


    await axios.post(baseUrl + '/register', data,
      {
        headers: { function: azureFunctionVendorFrontendKey }
      }).then((response) => {
        setIsLoading(false);

        // The login was successful, handle the response accordingly
        console.log('registration successful!');
        console.log(response);
        if (response.status == 200) {
          const status = response.data.status;
          const message = response.data.message;
          if (status == 1) {

            toast.success(t(message), { position: toast.POSITION.TOP_CENTER, hideProgressBar: true })


            // navigate('/dashboard');
            //navigate('/');
          }
          else {
            if (message != '')
              toast.error(t(message), { position: toast.POSITION.TOP_CENTER, hideProgressBar: true })

            // console.log(response.data.errors);
            if (response && response.data && response.data.errors) {
              const errorData = response.data.errors;

              console.log(errorData);
              // Iterate over the errors and set them using setError from react-hook-form
              errorData.forEach((error) => {

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
        console.log('Registration failed!');
        console.log(error);
        toast.error(error, { position: toast.POSITION.TOP_CENTER, hideProgressBar: true });
      });




  }

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <ToastContainer toastClassName="custom-toast" />
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            {t('joinUsToday')}
          </MDTypography>

        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit(onSubmit)}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Name"
                name="name"
                {...register("name", {
                  required: {
                    value: true,
                    message: t('nameRequired')
                  },
                })}
                variant="standard"
                fullWidth />

              {errors.name && (
                <p className="errorMsg">{errors.name.message}</p>
              )}
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Email"
                variant="standard"
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
                type="tel"
                label="Mobile Number"
                variant="standard"
                name="mobileNumber"
                {...register("mobileNumber", {
                  required: {
                    value: true,
                    message: t('mobileNumberRequired')
                  },
                  //  pattern: /^[0-9]{10}$/ // Validate 10-digit numeric mobile number
                  pattern: {
                    value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                    message: t('mobileNumberInvalidFormat')
                  }
                })}
                fullWidth
              />



              {errors.mobileNumber && (
                <p className="errorMsg">{errors.mobileNumber.message}</p>
              )}
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Address"
                variant="standard"
                name="address"
                {...register("address", {
                  required: {
                    value: true,
                    message: t('addressRequired')
                  },
                })}
                fullWidth />

              {errors.address && (
                <p className="errorMsg">{errors.address.message}</p>
              )}
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="text"
                label="GST Number"
                variant="standard"
                name="gstNumber"
                {...register("gstNumber", {
                  required: {
                    value: true,
                    message: t('gstNumberRequired')
                  },
                  //   pattern:/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
                  minLength: {
                    value: 15,
                    message: t('gstNumberLength')

                  },
                  maxLength: {
                    value: 15,
                    message: t('gstNumberLength')
                  }
                })}
                fullWidth />

              {/* {errors.gstNumber && errors.gstNumber.type === "pattern" && (
                <p className="errorMsg">{t('gstNumberInvalidFormat')}</p>
              )} */}
              {errors.gstNumber && (
                <p className="errorMsg">{errors.gstNumber.message}</p>
              )}

            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="PAN Number"
                variant="standard"
                name="panNumber"
                {...register("panNumber", {
                  required: {
                    value: true,
                    message: t('panNumberRequired')
                  },
                  //  pattern:"[A-Z]{5}[0-9]{4}[A-Z]{1}",
                  minLength: {
                    value: 10,
                    message: t('panNumberLength')

                  },
                  maxLength: {
                    value: 10,
                    message: t('panNumberLength')
                  }
                })}
                fullWidth />

              {/* {errors.panNumber && errors.panNumber.type === "pattern" && (
                <p className="errorMsg">{t('panNumberInvalidFormat')}</p>
              )} */}
              {errors.panNumber && (
                <p className="errorMsg">{errors.panNumber.message}</p>
              )}
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                variant="standard"
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

            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Confirm Password"
                variant="standard"
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
                    if (watch('password') != value) {
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
                  t('signUp')
                )}
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                {t('alreadyHaveAnAccount')}
                <MDTypography
                  component={Link}
                  to="/vendor/login"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  {t('signIn')}
                </MDTypography>
              </MDTypography>
            </MDBox>

          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Register;
