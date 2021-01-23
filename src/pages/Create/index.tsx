import React, { FormEvent, useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import api from '../../services/api';
import copy from '../../services/copy';
import validateUrl from '../../services/validateUrl';
import Header from '../../components/Header';
import AlertMessage from '../../components/AlertMessage';

import './style.css';
import { FiCopy, FiArrowLeft } from 'react-icons/fi';

interface Url {
  id: number;
  url: string;
  short_url: string;
  short_code: string;
}

const Create = () => {
  const [token] = useState(localStorage.getItem('token'));
  const history = useHistory();

  const [url, setUrl] = useState<string>('');
  const [shortUrl, setShortUrl] = useState<string>('');
  const [submited, setSubmited] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  let copyElement: Element;

  const setCopyRef = (element: Element) => copyElement = element;

  function handleCopy() {
    if(copyElement)
      copy(copyElement);
  }

  function handleSubmit (e: FormEvent) {
    e.preventDefault();

    setSubmited(false);

    if(!validateUrl(url)){
      setErrorMessage('URL inválida! Digite novamente.');

      return;
    }

    api.post<Url>('/urls', { url }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })

    .then(response => {
      console.log(response);
      
      if(response.status === 201){
        setShortUrl(response.data.short_url);
        setSubmited(true);
      }
    })

    .catch(err => {
      console.error(err);

      if(err.response.status === 401){
        localStorage.clear();
        history.push('/');
      }
    });
  }

  return (
    <>
      <Header />

      <section className="create">
        {
          errorMessage &&
          <AlertMessage
            title="Erro"
            severity="error"
            message={errorMessage}
          />
        }

        {
          submited && 
          <AlertMessage
            title="Sucesso"
            severity="success"
            message="URL encurtada com sucesso"
          />
        }

        <Grid container direction="column" alignItems="center" alignContent="center">
          <Grid item sm={12}>
            <form onSubmit={ handleSubmit }>
              <input 
                type="text"
                value={url}
                placeholder="Digite a URL que deseja encurtar"
                onChange={e => setUrl(e.target.value)}
              />

              <button className="button" type="submit">Encurtar</button>
            </form>
          </Grid>

          <Grid item sm={12}>
            <List>
              {
                shortUrl &&
                <ListItem>
                  <ListItemText
                    primary={shortUrl}
                    ref={setCopyRef}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="copy" onClick={handleCopy}>
                      <FiCopy />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              }
            </List>
          </Grid>

          <Grid item sm={12}>
            <Link className="back-link" to="/dashboard">
              <FiArrowLeft size={16} color="#3498db" />
              Voltar
            </Link>
          </Grid>
        </Grid>
      </section>
    </>
  )
}

export default Create;