import Button from 'react-bootstrap/Button'
import { routes } from 'constants/routesConstants'
import { FC, useState } from 'react'
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Toast from 'react-bootstrap/Toast'
import authStore from '../../stores/auth.store'
import ToastContainer from 'react-bootstrap/ToastContainer'
import { StatusCode } from '../../constants/errorConstants'
import * as API from '../../api/Api'
import { useQuery } from 'react-query'
import useMediaQuery from '../../hooks/useMediaQuery'

const Navbar: FC = () => {
  const location = useLocation()
  const { isMobile } = useMediaQuery(1038)
  const navigate = useNavigate()
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const {id} = useParams()
  const userId:number = parseInt(id!)
  
  const userQuotesKarma = useQuery(
    ['userQuotesKarma'],
    () => API.fetchUserUpvotedQuotes(userId),
    {
      refetchOnWindowFocus: false,
    },
  )
  
  const userUpvotes = useQuery(
    ['userUpvotes'],
    () => API.fetchUserUpvotes(userId),
    {
      refetchOnWindowFocus: false,
    },
  )

  const currUserQuotesKarma = useQuery(
    ['currUserQuotesKarma'],
    () => API.fetchCurrUserUpvotedQuotes(),
    {
      refetchOnWindowFocus: false,
    },
  )
  
  const currUserUpvotes = useQuery(
    ['currUserUpvotes'],
    () => API.fetchCurrUserUpvotes(),
    {
      refetchOnWindowFocus: false,
    },
  )

  const currUser = useQuery(
    ['currUserInfo'],
    () => API.fetchCurrUser(),
    {
      refetchOnWindowFocus:false
    }
  )

  const user = useQuery(
    ['userInfo'],
    () => API.fetchUser(userId),
    {
      refetchOnWindowFocus:false
    }
  )

  const toggleHamburger = () => {
    setShowMenu(showMenu => !showMenu)
  }

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
          {isMobile && showMenu ? (
              <nav className="navbar navbar-expand-lg bg-light">
                <div className="container-xxl d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <Link to={routes.HOME}>
                      <img
                        src="/quotastic_red.png"
                        alt="Quotastic red logo"
                        width={123}
                      />
                    </Link>
                  </div>
                  <div>
                    <span className="close-icon" onClick={toggleHamburger}>x</span>
                  </div>
                </div>
                <div className="container-xxl d-flex justify-content-center align-items-center mb-3">
                  <ul className='navbar-nav'>
                    <li className="nav-item">
                      <NavLink className="nav-link" to={routes.LOGIN}>
                        <Button className='btnLoginHamb'>
                          Login
                        </Button>
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </nav>
            ):(
              <nav className="navbar navbar-expand-lg">
                <div className="container-xxl pb-0">
                  <Link className="navbar.brand" to={routes.HOME}>
                    <img
                      src="/quotastic_red.png"
                      alt="Quotastic red logo"
                      width={123}
                    />
                  </Link>
                  <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarTogglerDemo02"
                    aria-controls="navbarTogglerDemo02"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                  >
                    <span className="navbar-toggler-icon" onClick={() => toggleHamburger()}></span>
                  </button>
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
            )
          }
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
          {isMobile && showMenu ? (
              <nav className="navbar navbar-expand-lg bg-light">
                <div className="container-xxl d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <Link to={routes.HOME}>
                      <img
                        src="/quotastic_red.png"
                        alt="Quotastic red logo"
                        width={123}
                      />
                    </Link>
                  </div>
                  <div>
                    <span className="close-icon" onClick={toggleHamburger}>x</span>
                  </div>
                </div>
                <div className="container-xxl d-flex justify-content-center align-items-center mb-3">
                  <ul className='navbar-nav'>
                    <li className="nav-item mb-3">
                      <NavLink className="nav-link" to={routes.SIGNUP}>
                        <Button className='btnRegisterHamb'>
                          Sign up
                        </Button>
                      </NavLink> 
                    </li>
                  </ul>
                </div>
              </nav>
            ):(
              <nav className="navbar navbar-expand-lg">
                <div className="container-xxl pb-0">
                  <Link className="navbar.brand" to={routes.HOME}>
                    <img
                      src="quotastic_red.png"
                      alt="Quotastic red logo"
                      width={123}
                    />
                  </Link>
                  <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarTogglerDemo02"
                    aria-controls="navbarTogglerDemo02"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                  >
                    <span className="navbar-toggler-icon" onClick={() => toggleHamburger()}></span>
                  </button>
                  <div
                    className="collapse navbar-collapse justify-content-end align-items-center"
                    id="navbarTogglerDemo02"
                  >
                  <ul className="navbar-nav mb-2 mb-lg-0">
                    <li className="nav-item">
                      <NavLink className="nav-link pe-0" to={routes.SIGNUP}>
                        <Button className='btnRegister'>
                          Sign up
                        </Button>
                      </NavLink>
                    </li>
                  </ul>
                  </div>
                </div>
              </nav>
            )
          }
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
  else if(location.pathname === '/me/quotes'){
    return(
      <>
        <header className='redBackground'>
          {isMobile && showMenu ? (
              <nav className="navbar navbar-expand-lg redBackground">
                <div className="container-xxl d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <Link to={routes.HOME}>
                      <img
                        src="/quotastic_white.png"
                        alt="Quotastic white logo"
                        width={123}
                      />
                    </Link>
                  </div>
                  <div>
                    <span className="close-icon" onClick={toggleHamburger}>x</span>
                  </div>
                </div>
                <div className="container-xxl d-flex justify-content-center align-items-center mb-3">
                  <ul className='navbar-nav text-center'>
                    <li className="nav-item pe-4 mb-2">
                      <Link to={routes.USERQUOTESINFO}>
                        <img className='userAvatar' src={`${process.env.REACT_APP_API_URL}/uploads/${authStore.user?.avatar}`} alt="User avatar" width={40}/>
                      </Link>
                    </li>
                    <li className="nav-item pe-4">
                      <Link to={routes.ADDNEWQUOTE}>
                      <img src='/plus.png' alt="Add quote" width={40}/>
                      </Link>
                    </li>
                    <li className="nav-item pe-4">
                      <a className="text-decoration-none reverseTextColor" onClick={signout}>
                        Sign out
                      </a>
                    </li>
                    <li className="nav-item pe-4 mb-2">
                      <a className="text-decoration-none reverseTextColor" href={routes.USERINFO}>
                        Setings
                      </a>
                    </li>
                  </ul>
                </div>
              </nav>
            ):(
              <nav className="navbar navbar-expand-lg">
                <div className="container-xxl">
                  <Link className="navbar.brand" to={routes.HOME}>
                    <img
                      src="/quotastic_white.png"
                      alt="Quotastic white logo"
                      width={123}
                    />
                  </Link>
                  <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarTogglerDemo02"
                    aria-controls="navbarTogglerDemo02"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                  >
                    <span className="navbar-toggler-icon" onClick={() => toggleHamburger()}></span>
                  </button>
                  <div
                    className="collapse navbar-collapse justify-content-end align-items-center"
                    id="navbarTogglerDemo02"
                  >
                    <ul className="navbar-nav mb-2 mb-lg-0">
                      <li className="nav-item pe-4">
                        <a className="text-decoration-none reverseTextColor" href={routes.HOME}>
                          Home
                        </a>
                      </li>
                      <li className="nav-item pe-4">
                        <a className="text-decoration-none reverseTextColor" onClick={signout}>
                          Sign out
                        </a>
                      </li>
                      <li className="nav-item pe-4">
                        <a className="text-decoration-none reverseTextColor" href={routes.USERINFO}>
                          Setings
                        </a>
                      </li>
                      <li className="nav-item pe-4">
                        <Link to={routes.USERQUOTESINFO}>
                          <img className='userAvatar' src={`${process.env.REACT_APP_API_URL}/uploads/${authStore.user?.avatar}`} alt="User avatar" width={40}/>
                        </Link>
                      </li>
                      <li className="nav-item pe-4">
                        <Link to={routes.ADDNEWQUOTE}>
                        <img src='/plus.png' alt="User avatar" width={40}/>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </nav>
            )
          }
          {currUser.data ? (
            <div className='redBackground reverseTextColor'>
              <div className='text-center'>
                <img className='userAvatar mb-3' src={`${process.env.REACT_APP_API_URL}/uploads/${currUser.data.data.avatar}`} alt="User avatar" width={40}/>
                <h2 className="display-6 mb-3">{currUser.data.data.first_name + ' ' + currUser.data.data.last_name}</h2>
              </div>
            </div>
          ):(
            <div>No user info available</div>
          )}
          <div className='mx-auto justify-content-center align-items-center'>
            <div style={{backgroundColor:'#DE8667'}}>
              <div className='userKarmaBorderTop p-4'>
                <div className="d-flex justify-content-between">
                  <div className="col-md-5">Quotes</div>
                  <div className="col-md-5">Quotastic karma</div>
                </div>
              </div>
            </div>
            <div style={{backgroundColor:'#fff'}}>
              <div className='userKarmaBorderBottom p-4'>
                <div className="d-flex justify-content-between">
                  {currUserQuotesKarma.data ?(
                    <>
                      <div>{currUserQuotesKarma.data.data.userquotes}</div>  
                      <div className="col-md-5">
                        {parseInt(currUserUpvotes.data.data.quoteUpvotes) + parseInt(currUserQuotesKarma.data.data.quotesupvoted)}
                      </div>
                    </>
                  ):(
                    <>
                      <div className="col-md-5">0</div>
                      <div>0</div>
                    </>
                  )} 
                </div>
              </div>
            </div>
          </div>
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
  else if(location.pathname === `/users/${id}/quotes`){
    return(
      <>
        <header className='redBackground'>
          {
            isMobile && showMenu ? (
              <nav className="navbar navbar-expand-lg redBackground">
                <div className="container-xxl d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <Link to={routes.HOME}>
                      <img
                        src="/quotastic_white.png"
                        alt="Quotastic white logo"
                        width={123}
                      />
                    </Link>
                  </div>
                  <div>
                    <span className="close-icon" onClick={toggleHamburger}>x</span>
                  </div>
                </div>
                <div className="container-xxl d-flex justify-content-center align-items-center mb-3">
                  <ul className='navbar-nav text-center'>
                    <li className="nav-item pe-4 mb-2">
                      <Link to={routes.USERQUOTESINFO}>
                        <img className='userAvatar' src={`${process.env.REACT_APP_API_URL}/uploads/${authStore.user?.avatar}`} alt="User avatar" width={40}/>
                      </Link>
                    </li>
                    <li className="nav-item pe-4">
                      <Link to={routes.ADDNEWQUOTE}>
                      <img src='/plus.png' alt="Add quote" width={40}/>
                      </Link>
                    </li>
                    <li className="nav-item pe-4">
                      <a className="text-decoration-none reverseTextColor" onClick={signout}>
                        Sign out
                      </a>
                    </li>
                    <li className="nav-item pe-4 mb-2">
                      <a className="text-decoration-none reverseTextColor" href={routes.USERINFO}>
                        Setings
                      </a>
                    </li>
                  </ul>
                </div>
              </nav>
            ):(
              <nav className="navbar navbar-expand-lg">
                <div className="container-xxl">
                  <Link className="navbar.brand" to={routes.HOME}>
                    <img
                      src="/quotastic_white.png"
                      alt="Quotastic white logo"
                      width={123}
                    />
                  </Link>
                  <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarTogglerDemo02"
                    aria-controls="navbarTogglerDemo02"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                  >
                  <span className="navbar-toggler-icon" onClick={() => toggleHamburger()}></span>
                  </button>
                  <div
                    className="collapse navbar-collapse justify-content-end align-items-center"
                    id="navbarTogglerDemo02"
                  >
                    <ul className="navbar-nav mb-2 mb-lg-0">
                      <li className="nav-item pe-4">
                        <a className="text-decoration-none reverseTextColor" href={routes.HOME}>
                          Home
                        </a>
                      </li>
                      <li className="nav-item pe-4">
                        <a className="text-decoration-none reverseTextColor" onClick={signout}>
                          Sign out
                        </a>
                      </li>
                      <li className="nav-item pe-4">
                        <a className="text-decoration-none reverseTextColor" href={routes.USERINFO}>
                          Setings
                        </a>
                      </li>
                      <li className="nav-item pe-4">
                        <Link to={routes.USERQUOTESINFO}>
                          <img className='userAvatar' src={`${process.env.REACT_APP_API_URL}/uploads/${authStore.user?.avatar}`} alt="User avatar" width={40}/>
                        </Link>
                      </li>
                      <li className="nav-item pe-4">
                        <Link to={routes.ADDNEWQUOTE}>
                        <img src='/plus.png' alt="Add quote" width={40}/>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </nav>
            )
          }
          {user.data ? (
            <div className='redBackground reverseTextColor'>
              <div className='text-center'>
                <img className='userAvatar mb-3' src={`${process.env.REACT_APP_API_URL}/uploads/${user.data.data.avatar}`} alt="User avatar" width={40}/>
                <h2 className="display-6 mb-3">{user.data.data.first_name + ' ' + user.data.data.last_name}</h2>
              </div>
            </div>
          ):(
            <div>No user info available</div>
          )}
        </header>
        <div className='mx-auto justify-content-center align-items-center'>
          <div style={{backgroundColor:'#DE8667'}}>
            <div className='userKarmaBorderTop p-4'>
              <div className="d-flex justify-content-between">
                <div className="col-md-5">Quotes</div>
                <div className="col-md-5">Quotastic karma</div>
              </div>
            </div>
          </div>
          <div style={{backgroundColor:'#fff'}}>
            <div className='userKarmaBorderBottom p-4'>
              <div className="d-flex justify-content-between">
                {userQuotesKarma.data ?(
                  <>
                    <div>{userQuotesKarma.data.data.userquotes}</div>  
                    <div className="col-md-5">
                      {parseInt(userUpvotes.data.data.quoteUpvotes) + parseInt(userQuotesKarma.data.data.quotesupvoted)}
                    </div>
                  </>
                ):(
                  <>
                    <div className="col-md-5">0</div>
                    <div>0</div>
                  </>
                )} 
              </div>
            </div>
          </div>
        </div>
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
      {
        isMobile && showMenu ? (
          <nav className="navbar navbar-expand-lg bg-light">
            {authStore.user ? (
              <>
                <div className="container-xxl d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <Link to={routes.HOME}>
                      <img
                        src="/quotastic_red.png"
                        alt="Quotastic red logo"
                        width={123}
                      />
                    </Link>
                  </div>
                  <div>
                    <span className="close-icon" onClick={toggleHamburger}>x</span>
                  </div>
                </div>
                <div className="container-xxl d-flex justify-content-center align-items-center mb-3">
                  <ul className='navbar-nav text-center'>
                    <li className="nav-item pe-4 mb-2">
                      <Link to={routes.USERQUOTESINFO}>
                        <img className='userAvatar' src={`${process.env.REACT_APP_API_URL}/uploads/${authStore.user?.avatar}`} alt="User avatar" width={40}/>
                      </Link>
                    </li>
                    <li className="nav-item pe-4">
                      <Link to={routes.ADDNEWQUOTE}>
                      <img src='/plus.png' alt="Add quote" width={40}/>
                      </Link>
                    </li>
                    <li className="nav-item pe-4">
                      <a className="text-decoration-none textColor" onClick={signout}>
                        Sign out
                      </a>
                    </li>
                    <li className="nav-item pe-4 mb-2">
                      <a className="text-decoration-none textColor" href={routes.USERINFO}>
                        Setings
                      </a>
                    </li>
                  </ul>
                </div>
              </>
            ):(
              <>
                <div className="container-xxl d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <Link to={routes.HOME}>
                      <img
                        src="/quotastic_red.png"
                        alt="Quotastic red logo"
                        width={123}
                      />
                    </Link>
                  </div>
                  <div>
                    <span className="close-icon" onClick={toggleHamburger}>x</span>
                  </div>
                </div>
                <div className="container-xxl d-flex justify-content-center align-items-center mb-3">
                  <ul className='navbar-nav'>
                    <li className="nav-item mb-3">
                      <NavLink className="nav-link" to={routes.SIGNUP}>
                        <Button className='btnRegisterHamb'>
                          Sign up
                        </Button>
                      </NavLink> 
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to={routes.LOGIN}>
                        <Button className='btnLoginHamb'>
                          Login
                        </Button>
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </nav>
        ):(
          <nav className="navbar navbar-expand-lg">
            <div className="container-xxl">
              <Link className="navbar.brand" to={routes.HOME}>
                <img
                  src="/quotastic_red.png"
                  alt="Quotastic red logo"
                  width={123}
                />
              </Link>
              <div className='navbar navbar-expand-lg'>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarTogglerDemo02"
                aria-controls="navbarTogglerDemo02"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon" onClick={() => toggleHamburger()}></span>
              </button>
              </div>
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
                        <Link to={routes.USERQUOTESINFO}>
                          <img className='userAvatar' src={`${process.env.REACT_APP_API_URL}/uploads/${authStore.user?.avatar}`} alt="User avatar" width={40}/>
                        </Link>
                      </li>
                      <li className="nav-item pe-4">
                        <Link to={routes.ADDNEWQUOTE}>
                        <img src='/plus.png' alt="Add quote" width={40}/>
                        </Link>
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
        )
      } 
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