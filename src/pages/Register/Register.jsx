import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, PasswordInput } from '@ya.praktikum/react-developer-burger-ui-components';
import { register } from '../../services/actions/authActions';
import styles from './Register.module.css';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(email, password, name));
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className="text text_type_main-medium mb-6">Регистрация</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="name"
            size="default"
            required
          />
        </div>
        <div className="mb-6">
          <Input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            size="default"
            required
          />
        </div>
        <div className="mb-6">
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
        </div>
      </form>
      <div className={styles.links}>
        <p className="text text_type_main-default text_color_inactive mb-4">
          Уже зарегистрированы?{' '}
          <Link to="/login" className={styles.link}>
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

