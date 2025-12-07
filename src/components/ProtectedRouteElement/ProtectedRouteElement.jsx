import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const ProtectedRouteElement = ({ children, onlyUnauth = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // Если маршрут только для неавторизованных (login, register, forgot-password)
  if (onlyUnauth) {
    // Если пользователь авторизован, редиректим на главную
    if (isAuthenticated || user) {
      return <Navigate to="/" replace />;
    }
    // Если не авторизован, разрешаем доступ
    return children;
  }

  // Если маршрут защищенный (требует авторизации)
  // Если пользователь не авторизован, редиректим на /login с сохранением исходного маршрута
  if (!isAuthenticated && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если авторизован, разрешаем доступ
  return children;
};

ProtectedRouteElement.propTypes = {
  children: PropTypes.node.isRequired,
  onlyUnauth: PropTypes.bool,
};

export default ProtectedRouteElement;



