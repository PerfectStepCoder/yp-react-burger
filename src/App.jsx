import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AppHeader from './components/AppHeader/AppHeader';
import ProtectedRouteElement from './components/ProtectedRouteElement/ProtectedRouteElement';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import Profile from './pages/Profile/Profile';
import ProfileOrders from './pages/Profile/ProfileOrders/ProfileOrders';
import ProfileOrderDetails from './pages/Profile/ProfileOrderDetails/ProfileOrderDetails';
import IngredientPage from './pages/IngredientPage/IngredientPage';
import NotFound from './pages/NotFound/NotFound';
import { initAuth } from './services/actions/authActions';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ingredients/:id" element={<IngredientPage />} />
        <Route
          path="/login"
          element={
            <ProtectedRouteElement onlyUnauth>
              <Login />
            </ProtectedRouteElement>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRouteElement onlyUnauth>
              <Register />
            </ProtectedRouteElement>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRouteElement onlyUnauth>
              <ForgotPassword />
            </ProtectedRouteElement>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRouteElement onlyUnauth>
              <ResetPassword />
            </ProtectedRouteElement>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRouteElement>
              <Profile />
            </ProtectedRouteElement>
          }
        >
          <Route path="orders" element={<ProfileOrders />} />
        </Route>
        <Route
          path="/profile/orders/:id"
          element={
            <ProtectedRouteElement>
              <ProfileOrderDetails />
            </ProtectedRouteElement>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

