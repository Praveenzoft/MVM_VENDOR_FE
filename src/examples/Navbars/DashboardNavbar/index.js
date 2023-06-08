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

// react-router components
import { useLocation, Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import Tooltip from "@mui/material/Tooltip";


// Material Dashboard 2 React example components
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

import axios from "axios";
import configurations from "config";
import { toast, Toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import { useId } from "react";
import 'assets/css/common.css';

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const baseUrl = configurations.baseUrl;
  const bearerToken = `Bearer ${localStorage.getItem('JWTToken')}`;
  const userID = localStorage.getItem('userID');

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  const handleLogout = () => {
    const data = { id: userID }
    axios.post(baseUrl + '/logout', data, {
      headers: { Authorization: bearerToken }
    }).then((response) => {
      // The login was successful, handle the response accordingly
      console.log('logout successful!');
      console.log("response"); console.log(response)
      if (response.status == 200) {
        const status = response.data.status;
        const logoutMessage = response.data.message;
        if (status == 1) {

          localStorage.removeItem('userID');
          localStorage.removeItem('JWTToken');
          toast.success(t(logoutMessage), { position: toast.POSITION.TOP_CENTER, hideProgressBar: true })


          navigate('/vendor/login');
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

          }
        }
      }
      else {
        toast.error(t('unableToProccessRequest'), { position: toast.POSITION.TOP_CENTER, hideProgressBar: true });

      }

    }).catch(error => {
      // The login failed, handle the error response
      console.log('logout failed!'); console.log(error);
      // console.log(error.response.status)

      if (error.response.status == 403)
        toast.error(t(error.response.data.message), { position: toast.POSITION.TOP_CENTER, hideProgressBar: true });

    });

  };

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem icon={<Icon>email</Icon>} title="Check new messages" />
      <NotificationItem icon={<Icon>podcasts</Icon>} title="Manage Podcast sessions" />
      <NotificationItem icon={<Icon>shopping_cart</Icon>} title="Payment successfully completed" />
    </Menu>
  );

  // Styles for the navbar icons
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <ToastContainer toastClassName="custom-toast" />
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            {/* <MDBox pr={1}>
              <MDInput label="Search here" />
            </MDBox> */}
            <MDBox color={light ? "white" : "inherit"}>
              {/* <Link to="/authentication/sign-in/basic">
                <IconButton sx={navbarIconButton} size="small" disableRipple>
                  <Icon sx={iconsStyle}>account_circle</Icon>
                </IconButton>
              </Link> */}
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
              {/* <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfiguratorOpen}
              >
                <Icon sx={iconsStyle}>settings</Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              >
                <Icon sx={iconsStyle}>notifications</Icon>
              </IconButton>
              {renderMenu()} */}
              <Tooltip title="Logout" arrow>

              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                variant="contained"
                onClick={handleLogout}
              >
                <Icon sx={iconsStyle}>logout</Icon>
              </IconButton>
              </Tooltip>
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
