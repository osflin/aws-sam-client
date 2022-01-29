import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './index.css'
import App from './App'
import Place from './Place'
import Login from './Login'
import 'tachyons'; 

ReactDOM.render(
<BrowserRouter>
    <Switch>
      <Route path="/" exact component={App} />
      <Route path="/place/:id" component={Place} />
      <Route path="/login" component={Login} />
    </Switch>
  </BrowserRouter>,
document.getElementById('root'))
