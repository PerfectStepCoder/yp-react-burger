import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, PasswordInput } from '@ya.praktikum/react-developer-burger-ui-components';
import { getUser, updateUser } from '../../../services/actions/authActions';
import styles from './ProfileSettings.module.css';

const ProfileSettings = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.auth);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isChanged, setIsChanged] = React.useState(false);

  React.useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  React.useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPassword('');
      setIsChanged(false);
    }
  }, [user]);

  const checkIfChanged = (newName, newEmail, newPassword) => {
    if (!user) return false;
    const nameChanged = newName !== (user.name || '');
    const emailChanged = newEmail !== (user.email || '');
    const passwordChanged = newPassword !== '';
    return nameChanged || emailChanged || passwordChanged;
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    setIsChanged(checkIfChanged(newName, email, password));
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsChanged(checkIfChanged(name, newEmail, password));
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setIsChanged(checkIfChanged(name, email, newPassword));
  };

  const handleCancel = () => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPassword('');
      setIsChanged(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    // Отправляем только измененные поля
    const updateData = {};
    if (name !== (user.name || '')) {
      updateData.name = name;
    }
    if (email !== (user.email || '')) {
      updateData.email = email;
    }
    if (password) {
      updateData.password = password;
    }

    // Если есть изменения, отправляем запрос
    if (Object.keys(updateData).length > 0) {
      const result = await dispatch(updateUser(updateData.name, updateData.email, updateData.password));
      if (result.success) {
        setPassword('');
        setIsChanged(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Имя"
            value={name}
            onChange={handleNameChange}
            name="name"
            size="default"
            icon="EditIcon"
            disabled={isLoading}
          />
        </div>
        <div className="mb-6">
          <Input
            type="email"
            placeholder="Логин"
            value={email}
            onChange={handleEmailChange}
            name="email"
            size="default"
            icon="EditIcon"
            disabled={isLoading}
          />
        </div>
        <div className="mb-6">
          <PasswordInput
            value={password}
            onChange={handlePasswordChange}
            name="password"
            placeholder="Новый пароль"
            size="default"
            icon="EditIcon"
            disabled={isLoading}
          />
        </div>
        {error && (
          <p className="text text_type_main-default text_color_error mb-6">
            {error}
          </p>
        )}
        {isChanged && (
          <div className={styles.buttons}>
            <Button
              type="secondary"
              size="medium"
              htmlType="button"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Отмена
            </Button>
            <Button
              type="primary"
              size="medium"
              htmlType="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileSettings;

