import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface ProtectedRouteElementProps {
  children: ReactNode;
  onlyUnauth?: boolean;
}

const ProtectedRouteElement: React.FC<ProtectedRouteElementProps> = ({ children, onlyUnauth = false }) => {
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);
  const location = useLocation();

  // Если маршрут только для неавторизованных (login, register, forgot-password)
  if (onlyUnauth) {
    // Если пользователь авторизован, редиректим на маршрут, с которого он был перенаправлен,
    // или на главную страницу, если такого маршрута нет
    if (isAuthenticated || user) {
      const from = (location.state as any)?.from || { pathname: '/' };
      return <Navigate to={from} replace />;
    }
    // Если не авторизован, разрешаем доступ
    return <>{children}</>;
  }

  // Если маршрут защищенный (требует авторизации)
  // Если пользователь не авторизован, редиректим на /login с сохранением исходного маршрута
  if (!isAuthenticated && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если авторизован, разрешаем доступ
  return <>{children}</>;
};

export default ProtectedRouteElement;
