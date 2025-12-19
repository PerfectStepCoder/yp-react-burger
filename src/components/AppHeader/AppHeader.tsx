import { NavLink, Link } from 'react-router-dom';
import { Logo, BurgerIcon, ListIcon, ProfileIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './AppHeader.module.css';

const AppHeader: React.FC = () => {
  return (
    <header className={`${styles.header} pt-4 pb-4`}>
      <div className={`${styles.container} pl-10 pr-10`}>
        <nav className={styles.nav}>
          <NavLink
            to="/"
            className={({ isActive }) => 
              `${styles.navItem} pl-5 pr-5 ${isActive ? styles.active : ''}`
            }
            end
          >
            {({ isActive }) => (
              <>
                <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
                <span className={`text text_type_main-default pl-2 ${
                  isActive ? 'text_color_primary' : 'text_color_inactive'
                }`}>
                  Конструктор
                </span>
              </>
            )}
          </NavLink>
          <NavLink
            to="/feed"
            className={({ isActive }) => 
              `${styles.navItem} pl-5 pr-5 ${isActive ? styles.active : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <span className={`text text_type_main-default pl-2 ${
                  isActive ? 'text_color_primary' : 'text_color_inactive'
                }`}>
                  Лента заказов
                </span>
              </>
            )}
          </NavLink>
        </nav>

        <div className={styles.logoWrapper}>
          <Link to="/">
            <Logo />
          </Link>
        </div>

        <NavLink
          to="/profile"
          className={({ isActive }) => 
            `${styles.navItem} ${styles.accountLink} pl-5 pr-5 ${isActive ? styles.active : ''}`
          }
        >
          {({ isActive }) => (
            <>
              <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
              <span className={`text text_type_main-default pl-2 ${
                isActive ? 'text_color_primary' : 'text_color_inactive'
              }`}>
                Личный кабинет
              </span>
            </>
          )}
        </NavLink>
      </div>
    </header>
  );
};

export default AppHeader;
