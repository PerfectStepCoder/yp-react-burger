import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Input, PasswordInput } from '@ya.praktikum/react-developer-burger-ui-components';
import { useDispatch, useSelector } from '../../hooks/useRedux';
import { login } from '../../services/actions/authActions';
import { useForm } from '../../hooks/useForm';
import styles from './Login.module.css';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { values, handleChange } = useForm({ email: '', password: '' });
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(login(values.email, values.password));
    if ((result as any).success) {
      // Редиректим на маршрут, с которого пользователь был перенаправлен на логин,
      // или на главную страницу, если такого маршрута нет
      const from = (location.state as any)?.from || { pathname: '/' };
      navigate(from, { replace: true });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className="text text_type_main-medium mb-6">Вход</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className="mb-6">
          <Input
            type="email"
            placeholder="E-mail"
            value={values.email}
            onChange={handleChange}
            name="email"
            size="default"
            required
            {...({} as any)}
          />
        </div>
        <div className="mb-6">
          <PasswordInput
            value={values.password}
            onChange={handleChange}
            name="password"
            size="default"
            required
          />
        </div>
        {error && (
          <p className="text text_type_main-default text_color_error mb-6">
            {error}
          </p>
        )}
        <div className={`${styles.buttonWrapper} mb-20`}>
          <Button
            type="primary"
            size="medium"
            htmlType="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </Button>
        </div>
      </form>
      <div className={styles.links}>
        <p className="text text_type_main-default text_color_inactive mb-4">
          Вы — новый пользователь?{' '}
          <Link to="/register" className={styles.link}>
            Зарегистрироваться
          </Link>
        </p>
        <p className="text text_type_main-default text_color_inactive">
          Забыли пароль?{' '}
          <Link to="/forgot-password" className={styles.link}>
            Восстановить пароль
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
