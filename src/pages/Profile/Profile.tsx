import React from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../services/actions/authActions';
import ProfileSettings from './ProfileSettings/ProfileSettings';
import ProfileOrders from './ProfileOrders/ProfileOrders';
import styles from './Profile.module.css';

const Profile: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <nav className={styles.nav}>
          <NavLink
            to="/profile"
            end
            className={({ isActive }) =>
              `${styles.navLink} text text_type_main-medium ${
                isActive ? 'text_color_primary' : 'text_color_inactive'
              }`
            }
          >
            Профиль
          </NavLink>
          <NavLink
            to="/profile/orders"
            className={({ isActive }) =>
              `${styles.navLink} text text_type_main-medium ${
                isActive ? 'text_color_primary' : 'text_color_inactive'
              }`
            }
          >
            История заказов
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className={`${styles.navLink} ${styles.logoutButton} text text_type_main-medium text_color_inactive`}
          >
            Выход
          </button>
        </nav>
        <div className={styles.main}>
          <Routes>
            <Route index element={<ProfileSettings />} />
            <Route path="orders" element={<ProfileOrders />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Profile;
