import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [login, { error }] = useMutation(LOGIN_MUTATION);
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    let valid = true;

    if (!email) {
      setEmailError('Поле Email обязательно');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Введите корректный Email');
      valid = false;
    } else {
      setEmailError('');
    }

    // Проверка password
    if (!password) {
      setPasswordError('Поле Пароль обязательно');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (!valid) return;

    try {
      const response = await login({ variables: { email, password } });
      const { token, user } = response.data.login;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/mainpage');
    } catch (e) {
      console.error('Ошибка авторизации:', e);
    }
  };

  return (
    <div className="auth">
      <img src="../../images/logo.png" alt="Logo" className="auth__logo" />
      <form className="auth__container" onSubmit={handleLogin} noValidate>
        <h2 className="auth__title">Войти в аккаунт</h2>

        <div className="auth__field">
          <input
            type="email"
            className="auth__input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
          />
          <p className="auth__error">{emailError}</p>
        </div>

        <div className="auth__field">
          <input
            type={showPassword ? 'text' : 'password'}
            className="auth__input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Пароль"
          />
          <button
            type="button"
            className="auth__toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            <img
              src={
                showPassword ? '../../images/pass_invisible.svg' : '../../images/pass_visible.svg'
              }
              alt={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              className="auth__toggle-password-icon"
            />
          </button>
          <p className="auth__error">{passwordError}</p>
        </div>

        <button className="auth__submit" type="submit">
          Войти
        </button>
        {error && <p className="auth__error">{error.message}</p>}
        <a className="auth__link" href="">
          Не удается войти в систему?
        </a>
      </form>
    </div>
  );
};

export default Auth;
