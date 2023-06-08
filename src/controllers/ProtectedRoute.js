import { Route, Navigate } from 'react-router-dom';


const ProtectedRoute = ({ path, element }) => {
  return (localStorage.getItem('token') !== null && localStorage.getItem('id') !== null) ? (
    // <Route path={path} element={element} />
    <Route exact path={path} element={element}  />
  ) : (
    <Navigate to="/vendor/login" replace />
  );
};

export default ProtectedRoute;