import React, { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api';
import AlertMessage from '../../components/AlertMessage'

import './style.css';
import { FiLogIn } from 'react-icons/fi';

interface User {
  email: string;
  senha: string;
}

interface LoginResponse {
  token: string;
}

const Login = () => {
  const history = useHistory();
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [invalidForm, setInvalidForm] = useState<boolean>(false);

  function handleLogin(e: FormEvent) {
    e.preventDefault();

    if(invalidForm)
      setInvalidForm(false);

    api.post<LoginResponse>('api/auth/login', {email, password})

    .then(response => {
      localStorage.setItem('token', response.data.token);

      history.push('/index');
    })

    .catch(err => {
      setInvalidForm(true);
      console.error(err);
    });
  }

  return (
    <div className="logon-container">

      {
        invalidForm && 
        <AlertMessage
          title="Erro"
          severity="error"
          message="Login ou senha inválidos"
        /> 
      }

      <section className="form">
        <form onSubmit={handleLogin} className="login">

          <input 
            type="text"
            value={email}
            placeholder="Digite o seu Email"
            onChange={e => setEmail(e.target.value)}
          />

          <input 
            type="password"
            value={password}
            placeholder="Digite a sua senha"
            onChange={e => setPassword(e.target.value)}
          />

          <button className="button" type="submit">Entrar</button>

          <Link className="back-link" to="/register">
            <FiLogIn size={16} color="#3498db" />
            Não tenho cadastro
          </Link>
        </form>
      </section>
    </div>
  )
}

export default Login;