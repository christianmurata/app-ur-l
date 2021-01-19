import React, { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api';
import AlertMessage from '../../components/AlertMessage';

import './style.css';
import { FiArrowLeft } from 'react-icons/fi';

interface LoginResponse {
  token: string;
}

interface RegisterResponse {
  status: number;
  message: string;
}

const Register = () => {
  const history = useHistory();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  
  const [invalidForm, setInvalidForm] = useState<boolean>(false);
  const [formSubmited, setFormSubmited] = useState<boolean>(false);
  const [invalidFields, setInvalidFields] = useState({ name: "", email: "", password: "" });

  function addInvalidFields(field: string, errors: string[]) {
    setInvalidFields(invalidFields => ({...invalidFields , [field]: errors}));
  }

  function handleRegister (e: FormEvent) {
    e.preventDefault();

    if(invalidForm)
      setInvalidForm(false);

    const data = {
      name,
      email,
      password,
      'password_confirmation':confirmPassword // for laravel password authentication
    };

    api.post<RegisterResponse>('/api/register', data)

    .then(response => {
      if(response.data.status === 200) {
        api.post<LoginResponse>('/api/auth/login', { email, password })

        .then(response => {
          localStorage.setItem('token', response.data.token);
          
          setFormSubmited(true);
          setTimeout(() => history.push('/index'), 2000);
        })

        .catch(err => {
          setInvalidForm(true);
          console.error(err);
        });
      }
    })

    .catch(err => {
      setInvalidForm(true);

      if(err.response) {
        const response = err.response.data;
        const errors = response.errors;

        if(errors) {
          for(let field in errors){
            console.log(field);
            console.log(errors[field]);
  
            addInvalidFields(field, errors[field]);
          }
        }
      }

      console.error(err);
    });
  }

  return (
    <div className="register-container">
      {
        invalidForm &&
        <AlertMessage
          title="Erro"
          severity="error"
          message="Não foi possível efetuar o efetuar o cadastro"
        />
      }

      {
        formSubmited &&
        <AlertMessage
          title="Sucesso"
          severity="success"
          message="Cadasto efetuado com sucesso"
        />
      }

      <div className="content">
        <section>
          <h1>Cadastro</h1>
          <p>Faça seu cadastro, entre na plataforma e transforme os seus links</p>

          <Link className="back-link" to="/">
            <FiArrowLeft size={16} color="#3498db" />
            Já possuo cadastro
          </Link>
        </section>

        <form onSubmit={handleRegister}>

          <input 
            type="text"
            value={name}
            className={invalidFields?.name ? 'error' : ''}
            onChange={e => setName(e.target.value)}
            placeholder="Digite o seu nome"
          />

          <input 
            type="email"
            value={email}
            className={invalidFields.email ? 'error' : ''}
            onChange={e => setEmail(e.target.value)}
            placeholder="Digite o seu email"
          />

          <input 
            value={password}
            type="password"
            className={invalidFields.password ? 'error' : ''}
            onChange={e => setPassword(e.target.value)}
            placeholder="Digite sua Senha"
          />

          <input 
            value={confirmPassword}
            type="password"
            className={invalidFields.password ? 'error' : ''}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirme sua Senha"
          />

          <button className="button" type="submit">Cadastrar</button>
        </form>
      </div>
    </div>
  );
}

export default Register;