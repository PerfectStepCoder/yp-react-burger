import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from './hooks/useRedux';
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

// Компонент для модального окна с деталями ингредиента
const IngredientModal: React.FC = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    // Возвращаемся к предыдущему пути при закрытии модалки
    navigate(-1);
  };

  return (
    <Modal title="Детали ингредиента" onClose={handleClose}>
      <IngredientDetails />
    </Modal>
  );
};

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const background = (location.state as any)?.background;

  useEffect(() => {
    dispatch(initAuth());
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <>
      <AppHeader />
      {/* Первый Routes - только для страниц (без модальных окон) */}
      <Routes location={background || location}>
        <Route path="/" element={<Home />} />
        {!background && <Route path="/ingredients/:id" element={<IngredientPage />} />}
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
      {/* Второй Routes - только для модальных окон (попапов), показываются только при наличии background */}
      {background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <IngredientModal />
            }
          />
        </Routes>
      )}
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
