import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AppBar, Toolbar } from '@material-ui/core';
import { FiLogOut } from 'react-icons/fi';

import api from '../../services/api';

import './style.css';

const Header = () => {
  const history = useHistory();
  const [token] = useState<string>(localStorage.getItem('token') || '');

  if(!token)
    history.push('/');

  function handleLogout() {
    api.post('auth/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })

    .then(response => {
      console.log(response);

      if(response.status === 200) {
        localStorage.clear();
        history.push('/');
      }
    })

    .catch(err => {
      history.push('/');
      console.error(err);
    });
  }

  return (
    <div className="header">
      <AppBar className="menu" position="static">
        <Toolbar>
          <Link to="/dashboard" className="menuTitle">
            <h1>APP UR-L</h1>
          </Link>

          <button className="menuButton" onClick={handleLogout} type="button">
            <FiLogOut size={18} color="#fff"></FiLogOut>
          </button>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Header;