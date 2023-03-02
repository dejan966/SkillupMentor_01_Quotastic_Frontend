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
const UserInfo = lazy(() => import('../pages/Me'))
const UserEdit = lazy(() => import('../pages/Me/Edit'))
const UsersQuotes = lazy(() => import('../pages/Users/Quotes'))

const QuotesAdd = lazy(() => import('../pages/Me/Myquote'))
const QuotesEdit = lazy(() => import('../pages/Me/Myquote/Edit'))
const UserQuotes = lazy(() => import('../pages/Me/Quotes'))
const UserPasswordEdit = lazy(() => import('../pages/Me/Update-password'))
const UserAvatarEdit = lazy(() => import('../pages/Me/Update-avatar'))
const DeleteAcc = lazy(() => import('../pages/Me/Delete-account'))

const Upvote = lazy(()=>import('../pages/Quotes/Upvote'))
const Downvote = lazy(()=>import('../pages/Quotes/Downvote'))

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
    children: <UserInfo />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/me/quotes',
    children: <UserQuotes />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/users/:id/quotes',
    children: <UsersQuotes />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/me/edit',
    children: <UserEdit />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/me/update-password',
    children: <UserPasswordEdit />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/me/update-avatar',
    children: <UserAvatarEdit />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/me/delete-account',
    children: <DeleteAcc />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/me/myquote',
    children: <QuotesAdd />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/me/myquote/edit/:id',
    children: <QuotesEdit />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/quotes/upvote/:id',
    children: <Upvote />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/quotes/downvote/:id',
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