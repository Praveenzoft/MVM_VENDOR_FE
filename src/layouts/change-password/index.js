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

// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

import Card from "@mui/material/Card";
import { toast, Toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import configurations from "config";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "examples/Lists/ProfilesList";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import DataTable from "examples/Tables/DataTable";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";
import CircularProgress from "@mui/material/CircularProgress";


// Images
import homeDecor1 from "assets/images/home-decor-1.jpg";
import homeDecor2 from "assets/images/home-decor-2.jpg";
import homeDecor3 from "assets/images/home-decor-3.jpg";
import homeDecor4 from "assets/images/home-decor-4.jpeg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

function ChangePassword() {

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [controller] = useMaterialUIController();
  const { minPasswordLength } = controller;
  const baseUrl = configurations.baseUrl;
  const bearerToken = `Bearer ${localStorage.getItem('JWTToken')}`; console.log(bearerToken);
  const userID = localStorage.getItem('userID');
  const [isLoading, setIsLoading] = useState(false);


  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    setError
  } = useForm();

  useEffect(() => {
    if (userID) {
      setValue('id', userID);
    }

  }, []);

  const onSubmit = async (data) => {
    console.log(data);
    setIsLoading(true);

    axios.post(baseUrl + '/changePassword', data, {
      headers: { Authorization: bearerToken }
    }).then((response) => {
      setIsLoading(false);
      console.log('updation successful!');
      console.log("response"); console.log(response)
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
      toast.error(error, { position: toast.POSITION.TOP_CENTER, hideProgressBar: true });

    });

  }
  const { columns, rows } = authorsTableData();
  const { columns: pColumns, rows: pRows } = projectsTableData();


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  {t('changePassword')}
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <MDBox component="form" role="form" onSubmit={handleSubmit(onSubmit)}>
                  <MDBox display="flex" flexDirection="column" alignItems="center">



                    <MDBox px={3}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={4}>
                          <MDTypography variant="body1" className="labelStyle">{t('newPassword')}</MDTypography>
                        </Grid>
                        <Grid item xs={8}>
                          <MDInput
                            type="password"
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

                        </Grid>

                        <Grid item xs={4}>
                          <MDTypography variant="body1" className="labelStyle">{t('confirmPassword')}</MDTypography>
                        </Grid>
                        <Grid item xs={8}>


                          <MDInput
                            type="password"
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

                        </Grid>


                        <Grid item xs={4}>
                        </Grid>
                        <Grid item xs={4}>
                          <MDBox mt={4} mb={4}>
                            <MDButton type="submit" variant="gradient" color="info" fullWidth>
                              {isLoading ? (
                                <CircularProgress color='inherit' size={20}/>
                              ) : (
                                t('submit')
                              )}
                            </MDButton>
                          </MDBox>
                        </Grid>
                        <Grid item xs={4}></Grid>

                      </Grid>


                    </MDBox>
                  </MDBox>

                </MDBox>
              </MDBox>

            </Card>
          </Grid>

        </Grid>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default ChangePassword;
