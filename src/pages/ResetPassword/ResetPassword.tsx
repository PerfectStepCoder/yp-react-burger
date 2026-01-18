import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Input, PasswordInput } from '@ya.praktikum/react-developer-burger-ui-components';
import { useDispatch, useSelector } from '../../hooks/useRedux';
import { resetPassword, resetPasswordReset } from '../../services/actions/passwordActions';
import styles from './ResetPassword.module.css';

const ResetPassword: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = React.useState<string>('');
  const [token, setToken] = React.useState<string>('');
  const { isLoading, error, message } = useSelector((state) => state.password);

  React.useEffect(() => {
    dispatch(resetPasswordReset());
    // Проверяем, что пользователь пришел с /forgot-password
    if (!(location.state as any)?.fromForgotPassword) {
      navigate('/forgot-password', { replace: true });
    }
  }, [dispatch, location.state, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(resetPassword(password, token));
    if ((result as any).success) {
      navigate('/login');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className="mb-6">
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            placeholder="Введите новый пароль"
            size="default"
            required
          />
        </div>
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Введите код из письма"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            name="token"
            size="default"
            required
            {...({} as any)}
          />
        </div>
        {error && (
          <p className="text text_type_main-default text_color_error mb-6">
            {error}
          </p>
        )}
        {message && (
          <p className="text text_type_main-default text_color_success mb-6">
            {message}
          </p>
        )}
        <div className="mb-20">
          <Button
            type="primary"
            size="medium"
            htmlType="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      </form>
      <div className={styles.links}>
        <p className="text text_type_main-default text_color_inactive mb-4">
          Вспомнили пароль?{' '}
          <Link to="/login" className={styles.link}>
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
