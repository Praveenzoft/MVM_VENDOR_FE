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
import { useEffect ,useState} from "react";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CircularProgress from "@mui/material/CircularProgress";

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


// Images
import homeDecor1 from "assets/images/home-decor-1.jpg";
import homeDecor2 from "assets/images/home-decor-2.jpg";
import homeDecor3 from "assets/images/home-decor-3.jpg";
import homeDecor4 from "assets/images/home-decor-4.jpeg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

function Profile() {

  const { t } = useTranslation();
  const navigate = useNavigate();
  const baseUrl = configurations.baseUrl;
  const azureFunctionVendorFrontendKey=configurations.azureFunctionVendorFrontendKey;
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
    // Example code to fetch values from the database
    if (userID) {
      setValue('id', userID);
    }

    const fetchData = async () => {
      await axios.get(baseUrl + '/editProfile/' + userID, {
        headers: { Authorization: bearerToken ,function :azureFunctionVendorFrontendKey},
        // params: { id: userID }
      }).then((response) => {


        // console.log(response);
        const requestStatus = response.status;


        if (requestStatus == 200) {
          const status = response.data.status;
          const message = response.data.message;
          if (status == 1) {

            const responseData = response.data.data;
            console.log(responseData)



            Object.entries(responseData).forEach(([key, value]) => {
              setValue(key, value);
            });

          }
          else {

            // console.log(t(message));
            toast.error(t(message), { position: toast.POSITION.TOP_CENTER, hideProgressBar: true });

          }
        }
        else {
          // console.log(t('unableToProccessRequest'));
          toast.error(t('unableToProccessRequest'), { position: toast.POSITION.TOP_CENTER, hideProgressBar: true });

        }



      }).catch(error => {
        // The login failed, handle the error response

        console.log('Error fetching data:', error);

        console.log(error.response.data.message)
        console.log(error.response.status)
        if (error.response.status == 403) {
          if (error.response.data.status == 0) {
            if (error.response.data.message != '')
              toast.error(t(error.response.data.message), { position: toast.POSITION.TOP_CENTER, hideProgressBar: true });
            else
              toast.error(error.response.statusText, { position: toast.POSITION.TOP_CENTER, hideProgressBar: true });

          }
        }
        else if (error.code == 'ERR_BAD_REQUEST') {
          toast.error(error.message, { position: toast.POSITION.TOP_CENTER, hideProgressBar: true });
        }
        // toast.error(error, { position: toast.POSITION.TOP_CENTER, hideProgressBar: true });



      });





    };

    fetchData();
  }, []); // Empty dependency array to run only once on component mount




  const onSubmit = async (data) => {
    console.log(data);
    setIsLoading(true);

    axios.post(baseUrl + '/updateProfile', data, {
      headers: { Authorization: bearerToken }
    }).then((response) => {
      setIsLoading(false);
      // The login was successful, handle the response accordingly
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
                  {t('updateProfile')}
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <MDBox component="form" role="form" onSubmit={handleSubmit(onSubmit)}>
                  <MDBox display="flex" flexDirection="column" alignItems="center">


                    <MDBox px={3}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={4}>
                          <MDTypography variant="body1" className="labelStyle">{t('name')}</MDTypography>
                        </Grid>
                        <Grid item xs={8}>

                          <MDInput
                            type="text"
                            name="name"
                            {...register("name", {
                              required: {
                                value: true,
                                message: t('nameRequired')
                              },
                            })}
                            fullWidth />

                          {errors.name && (
                            <p className="errorMsg">{errors.name.message}</p>
                          )}
                        </Grid>

                        <Grid item xs={4}>
                          <MDTypography variant="body1" className="labelStyle">{t('email')}</MDTypography>
                        </Grid>
                        <Grid item xs={8}>
                          <MDInput
                            type="text"
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
                        </Grid>

                        <Grid item xs={4}>
                          <MDTypography variant="body1" className="labelStyle">{t('mobileNumber')}</MDTypography>
                        </Grid>
                        <Grid item xs={8}>
                          <MDInput
                            type="tel"
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
                        </Grid>

                        <Grid item xs={4}>
                          <MDTypography variant="body1" className="labelStyle">{t('address')}</MDTypography>
                        </Grid>
                        <Grid item xs={8}>
                          <MDInput
                            type="text"
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
                        </Grid>

                        <Grid item xs={4}>
                          <MDTypography variant="body1" className="labelStyle">{t('gstNumber')}</MDTypography>
                        </Grid>
                        <Grid item xs={8}>
                          <MDInput
                            type="text"
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

                          {errors.gstNumber && (
                            <p className="errorMsg">{errors.gstNumber.message}</p>
                          )}
                        </Grid>

                        <Grid item xs={4}>
                          <MDTypography variant="body1" className="labelStyle">{t('panNumber')}</MDTypography>
                        </Grid>
                        <Grid item xs={8}>
                          <MDInput
                            type="text"
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


                          {errors.panNumber && (
                            <p className="errorMsg">{errors.panNumber.message}</p>
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

export default Profile;
