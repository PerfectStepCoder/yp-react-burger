import { Link, useLocation } from 'react-router-dom';
import { Logo, BurgerIcon, ListIcon, ProfileIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './AppHeader.module.css';

const AppHeader = () => {
  const location = useLocation();
  const isProfilePage = location.pathname.startsWith('/profile');

  return (
    <header className={`${styles.header} pt-4 pb-4`}>
      <div className={`${styles.container} pl-10 pr-10`}>
        <nav className={styles.nav}>
          <Link
            to="/"
            className={`${styles.navItem} pl-5 pr-5`}
          >
            <BurgerIcon type="primary" />
            <span className="text text_type_main-default text_color_primary pl-2">
              Конструктор
            </span>
          </Link>
          <Link
            to="/feed"
            className={`${styles.navItem} pl-5 pr-5`}
          >
            <ListIcon type="secondary" />
            <span className="text text_type_main-default text_color_inactive pl-2">
              Лента заказов
            </span>
          </Link>
        </nav>

        <div className={styles.logoWrapper}>
          <Logo />
        </div>

        <Link
          to="/profile"
          className={`${styles.navItem} ${styles.accountLink} pl-5 pr-5`}
        >
          <ProfileIcon type={isProfilePage ? 'primary' : 'secondary'} />
          <span className={`text text_type_main-default pl-2 ${
            isProfilePage ? 'text_color_primary' : 'text_color_inactive'
          }`}>
            Личный кабинет
          </span>
        </Link>
      </div>
    </header>
  );
};

export default AppHeader;

