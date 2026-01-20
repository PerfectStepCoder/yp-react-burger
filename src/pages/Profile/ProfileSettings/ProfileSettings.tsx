import React from 'react';
import { Button, Input, PasswordInput } from '@ya.praktikum/react-developer-burger-ui-components';
import { useDispatch, useSelector } from '../../../hooks/useRedux';
import { getUser, updateUser } from '../../../services/actions/authActions';
import styles from './ProfileSettings.module.css';
import { User } from '../../../utils/types';

const ProfileSettings: React.FC = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.auth);
  const [name, setName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [isChanged, setIsChanged] = React.useState<boolean>(false);

  React.useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  React.useEffect(() => {
    if (user) {
      setName((user as User).name || '');
      setEmail((user as User).email || '');
      setPassword('');
      setIsChanged(false);
    }
  }, [user]);

  const checkIfChanged = (newName: string, newEmail: string, newPassword: string): boolean => {
    if (!user) return false;
    const userObj = user as User;
    const nameChanged = newName !== (userObj.name || '');
    const emailChanged = newEmail !== (userObj.email || '');
    const passwordChanged = newPassword !== '';
    return nameChanged || emailChanged || passwordChanged;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    setIsChanged(checkIfChanged(newName, email, password));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsChanged(checkIfChanged(name, newEmail, password));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setIsChanged(checkIfChanged(name, email, newPassword));
  };

  const handleCancel = () => {
    if (user) {
      const userObj = user as User;
      setName(userObj.name || '');
      setEmail(userObj.email || '');
      setPassword('');
      setIsChanged(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const userObj = user as User;
    // Отправляем только измененные поля
    const updateData: { name?: string; email?: string; password?: string } = {};
    if (name !== (userObj.name || '')) {
      updateData.name = name;
    }
    if (email !== (userObj.email || '')) {
      updateData.email = email;
    }
    if (password) {
      updateData.password = password;
    }

    // Если есть изменения, отправляем запрос
    if (Object.keys(updateData).length > 0) {
      const result = await dispatch(updateUser(updateData.name, updateData.email, updateData.password));
      if ((result as any).success) {
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
            {...({} as any)}
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
            {...({} as any)}
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
