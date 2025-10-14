/* @refresh reload */
import './reset.css'
import { render } from 'solid-js/web'
import { Route, Router } from '@solidjs/router'
import { Home } from './Home'
import { Login } from './Login'
import { Register } from './Register'

const root = document.getElementById('root')

render(
  () => (
    <Router>
      <Route path='/' component={Home} />
      <Route path='/login' component={Login} />
      <Route path='/register' component={Register} />
    </Router>
  ),
  root!
)
