import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
import { clearCurrentIngredient } from './services/actions/currentIngredientActions';

// Компонент для модального окна, который использует хуки роутера
const IngredientModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentIngredient = useSelector((state) => state.currentIngredient.item);

  // Модальное окно показывается если:
  // 1. Есть currentIngredient в Redux (установлен при клике или прямом переходе)
  // 2. И мы на странице /ingredients/:id
  const shouldShowModal = 
    currentIngredient && 
    location.pathname.startsWith('/ingredients/');

  const handleClose = () => {
    dispatch(clearCurrentIngredient());
    // Если мы на странице /ingredients/:id, возвращаемся на страницу, с которой открыли модальное окно
    if (location.pathname.startsWith('/ingredients/')) {
      // Получаем информацию о предыдущей странице из location.state или sessionStorage
      const fromPage = location.state?.from || sessionStorage.getItem('ingredientFrom') || '/';
      // Очищаем sessionStorage
      sessionStorage.removeItem('ingredientFrom');
      // Возвращаемся на предыдущую страницу
      navigate(fromPage, { replace: true });
    }
    // Иначе просто закрываем модальное окно (URL остается прежним)
  };

  if (!shouldShowModal) {
    return null;
  }

  return (
    <Modal title="Детали ингредиента" onClose={handleClose}>
      <IngredientDetails ingredient={currentIngredient} />
    </Modal>
  );
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initAuth());
    dispatch(fetchIngredients());
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
      <IngredientModal />
    </BrowserRouter>
  );
}

export default App;

