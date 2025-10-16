/* @refresh reload */
import type { ParentComponent } from 'solid-js'
import { render } from 'solid-js/web'
import { Route, Router } from '@solidjs/router'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import './index.sass'

const root = document.getElementById('root')

const Layout: ParentComponent = (props) => <main>{props.children}</main>

render(
  () => (
    <Router root={Layout}>
      <Route path='/' component={Home} />
      <Route path='/login' component={Login} />
      <Route path='/register' component={Register} />
    </Router>
  ),
  root!
)
