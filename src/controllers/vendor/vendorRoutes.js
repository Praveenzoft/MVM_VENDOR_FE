
import Login from "views/vendor/login";
import Register from "views/vendor/register";
import ForgotPassword from "views/vendor/forgotPassword";
import ForgotPasswordConfirm from "views/vendor/forgotPasswordConfirm";
import UpdateProfile from "views/vendor/updateProfile";
import UserRegisterConfirm from "views/vendor/userRegisterConfirm";

const VendorRoutes = [

  {
    route: "/vendor/login",
    component: <Login />
  },
  {
    route: "/vendor/register",
    component: <Register />
  },
  {
    route: "/vendor/forgotPassword",
    component: <ForgotPassword />
  },
  {
    route: "/vendor/forgotPasswordConfirm",
    component: <ForgotPasswordConfirm />
  },
  {
    route: "/vendor/updateProfile",
    component: <UpdateProfile />
  },
  {
    route:"/vendor/userRegisterConfirm",
    component:<UserRegisterConfirm />
  }
  ];

export default VendorRoutes;
 