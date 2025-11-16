import { Logo, BurgerIcon, ListIcon, ProfileIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './AppHeader.module.css';

const AppHeader = () => (
  <header className={`${styles.header} pt-4 pb-4`}>
    <div className={`${styles.container} pl-10 pr-10`}>
      <nav className={styles.nav}>
        <a className={`${styles.navItem} pl-5 pr-5`} href="#constructor">
          <BurgerIcon type="primary" />
          <span className="text text_type_main-default text_color_primary pl-2">
            Конструктор
          </span>
        </a>
        <a className={`${styles.navItem} pl-5 pr-5`} href="#feed">
          <ListIcon type="secondary" />
          <span className="text text_type_main-default text_color_inactive pl-2">
            Лента заказов
          </span>
        </a>
      </nav>

      <div className={styles.logoWrapper}>
        <Logo />
      </div>

      <a className={`${styles.navItem} ${styles.accountLink} pl-5 pr-5`} href="#profile">
        <ProfileIcon type="secondary" />
        <span className="text text_type_main-default text_color_inactive pl-2">
          Личный кабинет
        </span>
      </a>
    </div>
  </header>
);

export default AppHeader;

