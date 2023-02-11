import { FC, lazy, Suspense } from 'react'
import { Route, RouteProps, Routes as Switch } from 'react-router-dom'

import PrivateRoute from './PrivateRoute'
import RestrictedRoute from './RestrictedRoute'

export enum RouteType {
  PUBLIC,
  PRIVATE,
  RESTRICTED,
}

type AppRoute = RouteProps & {
  type?: RouteType
}

/* Public routes */
const Home = lazy(() => import('../pages/Home'))

/* Private routes */
const UserEdit = lazy(() => import('../pages/Users/Edit'))

const Quotes = lazy(() => import('../pages/Quotes'))
const QuotesAdd = lazy(() => import('../pages/Quotes/Add'))
const QuotesEdit = lazy(() => import('../pages/Quotes/Edit'))

const Upvote = lazy(()=>import('../pages/Votes/Upvote'))
const Downvote = lazy(()=>import('../pages/Votes/Downvote'))

/* Restricted routes */
const Login = lazy(() => import('../pages/Login'))
const Register = lazy(() => import('../pages/Register'))

/* Error routes */
const Page404 = lazy(() => import('../pages/Page404'))

export const AppRoutes: AppRoute[] = [
  // Restricted Routes
  {
    type: RouteType.RESTRICTED,
    path: '/login',
    children: <Login />,
  },
  {
    type: RouteType.RESTRICTED,
    path: '/signup',
    children: <Register />,
  },
  // Private Routes
  {
    type: RouteType.PRIVATE,
    path: '/me',
    children: <UserEdit />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/me/update-password',
    children: <UserEdit />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/me/update-avatar',
    children: <UserEdit />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/quotes',
    children: <Quotes />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/me/myquote',
    children: <QuotesAdd />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/me/myquote/id',
    children: <QuotesEdit />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/quotes/id/upvote',
    children: <Upvote />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/quotes/id/downvote',
    children: <Downvote />,
  },
  // Public Routes
  {
    type: RouteType.PUBLIC,
    path: '/',
    children: <Home />,
  },
  // 404 Error
  {
    type: RouteType.PUBLIC,
    path: '*',
    children: <Page404 />,
  },
]

const Routes: FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        {AppRoutes.map((r) => {
          const { type } = r
          if (type === RouteType.PRIVATE) {
            return (
              <Route
                key={`${r.path}`}
                path={`${r.path}`}
                element={<PrivateRoute>{r.children}</PrivateRoute>}
              />
            )
          }
          if (type === RouteType.RESTRICTED) {
            return (
              <Route
                key={`${r.path}`}
                path={`${r.path}`}
                element={<RestrictedRoute>{r.children}</RestrictedRoute>}
              />
            )
          }

          return (
            <Route key={`${r.path}`} path={`${r.path}`} element={r.children} />
          )
        })}
        <Route path="*" element={<Page404 />} />
      </Switch>
    </Suspense>
  )
}

export default Routes