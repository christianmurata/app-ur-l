import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';

const Routes = () => {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Login}></Route>
      <Route path="/register" exact component={Register}></Route>
    </BrowserRouter>
  )
}

export default Routes;