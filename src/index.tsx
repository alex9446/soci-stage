/* @refresh reload */
import { render } from 'solid-js/web'
import { Route, Router } from '@solidjs/router'
import { Provider } from './context'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import './index.sass'

const root = document.getElementById('root')

render(
  () => (
    <Router root={Provider}>
      <Route path='/' component={Home} />
      <Route path='/login' component={Login} />
      <Route path='/register' component={Register} />
    </Router>
  ),
  root!
)
