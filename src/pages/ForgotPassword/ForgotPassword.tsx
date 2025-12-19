import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input } from '@ya.praktikum/react-developer-burger-ui-components';
import { useDispatch, useSelector } from '../../hooks/useRedux';
import { forgotPassword, resetPasswordReset } from '../../services/actions/passwordActions';
import styles from './ForgotPassword.module.css';

const ForgotPassword: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState<string>('');
  const { isLoading, error, message } = useSelector((state: any) => state.password);

  React.useEffect(() => {
    dispatch(resetPasswordReset());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(forgotPassword(email));
    if ((result as any).success) {
      // Передаем флаг, что пользователь пришел с /forgot-password
      navigate('/reset-password', { state: { fromForgotPassword: true } });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className="mb-6">
          <Input
            type="email"
            placeholder="Укажите e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
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
            {isLoading ? 'Отправка...' : 'Восстановить'}
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

export default ForgotPassword;
