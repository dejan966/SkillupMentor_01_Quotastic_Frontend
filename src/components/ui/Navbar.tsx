import Button from 'react-bootstrap/Button'
import { routes } from '../../constants/routesConstants'
import { FC, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Toast from 'react-bootstrap/Toast'
import authStore from '../../stores/auth.store'
import ToastContainer from 'react-bootstrap/ToastContainer'
import { StatusCode } from '../../constants/errorConstants'
import * as API from '../../api/Api'
import Avatar from 'react-avatar'

const Navbar: FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)

  const signout = async () => {
    const response = await API.signout()
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message)
      setShowError(true)
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message)
      setShowError(true)
    } else {
      authStore.signout()
      navigate(routes.HOME)
    }
  }
  if(location.pathname === '/signup'){
    return (
      <>
      <header>
          <nav className="navbar navbar-expand-lg">
            <div className="container-xxl pb-0">
              <Link className="navbar.brand" to={routes.HOME}>
                <img
                  src="quotastic_red.png"
                  alt="Quotastic red logo"
                  width={123}
                />
              </Link>
              <div
                className="collapse navbar-collapse justify-content-end align-items-center"
                id="navbarTogglerDemo02"
              >
                <ul className="navbar-nav mb-2 mb-lg-0">
                <li className="nav-item">
                  <NavLink className="nav-link pe-0" to={routes.LOGIN}>
                    <Button className='btnLogin'>
                      Login
                    </Button>
                  </NavLink>
                </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>
        {showError && (
          <ToastContainer className="p-3" position="top-end">
            <Toast onClose={() => setShowError(false)} show={showError}>
              <Toast.Header>
                <strong className="me-suto text-danger">Error</strong>
              </Toast.Header>
              <Toast.Body className="text-danger bg-light">{apiError}</Toast.Body>
            </Toast>
          </ToastContainer>
        )}
      </>
    )
  }
  else if(location.pathname === '/login'){
    return (
      <>
      <header>
          <nav className="navbar navbar-expand-lg">
            <div className="container-xxl pb-0">
              <Link className="navbar.brand" to={routes.HOME}>
                <img
                  src="quotastic_red.png"
                  alt="Quotastic red logo"
                  width={123}
                />
              </Link>
              <div
                className="collapse navbar-collapse justify-content-end align-items-center"
                id="navbarTogglerDemo02"
              >
                <ul className="navbar-nav mb-2 mb-lg-0">
                <li className="nav-item">
                  <NavLink className="nav-link pe-0" to={routes.SIGNUP}>
                    <Button className='btnRegister'>
                      Signup
                    </Button>
                  </NavLink>
                </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>
        {showError && (
          <ToastContainer className="p-3" position="top-end">
            <Toast onClose={() => setShowError(false)} show={showError}>
              <Toast.Header>
                <strong className="me-suto text-danger">Error</strong>
              </Toast.Header>
              <Toast.Body className="text-danger bg-light">{apiError}</Toast.Body>
            </Toast>
          </ToastContainer>
        )}
      </>
    )
  }
  return (
    <>
    <header>
        <nav className="navbar navbar-expand-lg">
          <div className="container-xxl pb-0">
            <Link className="navbar.brand" to={routes.HOME}>
              <img
                src="quotastic_red.png"
                alt="Quotastic red logo"
                width={123}
              />
            </Link>
            <div
              className="collapse navbar-collapse justify-content-end align-items-center"
              id="navbarTogglerDemo02"
            >
              <ul className="navbar-nav mb-2 mb-lg-0">
                {authStore.user ? (
                  <>
                    <li className="nav-item pe-4">
                      <a className="text-decoration-none textColor" href={routes.HOME}>
                        Home
                      </a>
                    </li>
                    <li className="nav-item pe-4">
                      <a className="text-decoration-none textColor" onClick={signout}>
                        Sign out
                      </a>
                    </li>
                    <li className="nav-item pe-4">
                      <a className="text-decoration-none textColor" href={routes.USERINFO}>
                        Setings
                      </a>
                    </li>
                    <li className="nav-item pe-4">
                      <a className="text-decoration-none textColor" href={routes.USERQUOTESINFO}>
                        {/*most liked quotes, most recent, liked quotes*/}
                        <Avatar round src={authStore.user.avatar} alt="User avatar" />
                      </a>
                    </li>
                    <li className="nav-item pe-4">
                      <a className="text-decoration-none textColor" href={routes.ADDNEWQUOTE}>
                        +
                      </a>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item pe-4">
                      <NavLink className="nav-link" to={routes.SIGNUP}>
                        <Button className='btnRegister'>
                          Sign up
                        </Button>
                      </NavLink> 
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link pe-0" to={routes.LOGIN}>
                        <Button className='btnLogin'>
                          Login
                        </Button>
                      </NavLink>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </header>
      {showError && (
        <ToastContainer className="p-3" position="top-end">
          <Toast onClose={() => setShowError(false)} show={showError}>
            <Toast.Header>
              <strong className="me-suto text-danger">Error</strong>
            </Toast.Header>
            <Toast.Body className="text-danger bg-light">{apiError}</Toast.Body>
          </Toast>
        </ToastContainer>
      )}
    </>
  )
}
export default Navbar