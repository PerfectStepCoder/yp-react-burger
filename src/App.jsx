import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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
import Modal from './components/Modal/Modal';
import IngredientDetails from './components/IngredientDetails/IngredientDetails';
import { initAuth } from './services/actions/authActions';
import { fetchIngredients } from './services/actions/ingredientsActions';

// Компонент для модального окна, который использует хуки роутера
const IngredientModal = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => {
    // Возвращаемся к предыдущему пути при закрытии модалки
    navigate(-1);
  };

  // Используем текущий location для маршрута модального окна
  return (
    <Routes location={location}>
      <Route
        path="/ingredients/:id"
        element={
          <Modal title="Детали ингредиента" onClose={handleClose}>
            <IngredientDetails />
          </Modal>
        }
      />
    </Routes>
  );
};

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const background = location.state?.background;

  useEffect(() => {
    dispatch(initAuth());
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <>
      <AppHeader />
      <Routes location={background || location}>
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
      {background && <IngredientModal />}
    </>
  );
}

// Обертка для использования хуков роутера
function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;

