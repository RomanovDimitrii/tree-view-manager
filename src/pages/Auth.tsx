import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

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
  const [login, { error }] = useMutation(LOGIN_MUTATION);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await login({ variables: { email, password } });
      const { token, user } = response.data.login;

      // Сохраняем токен и данные пользователя в localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Перенаправление на главный экран
      navigate('/main');
    } catch (e) {
      console.error('Ошибка авторизации:', e);
    }
  };

  return (
    <div>
      <h2>Войти в аккаунт</h2>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Пароль"
      />
      <button onClick={handleLogin}>Войти</button>
      {error && <p>Ошибка: {error.message}</p>}
    </div>
  );
};

export default Auth;
