import Layout from 'components/ui/Layout'
import { FC, useState } from 'react'
import { useQuery } from 'react-query'
import { StatusCode } from 'constants/errorConstants'
import * as API from 'api/Api'
import { Button, FormLabel, Toast, ToastContainer } from 'react-bootstrap'
import { Form } from 'react-bootstrap'
import { routes } from 'constants/routesConstants'
import Avatar from 'react-avatar'
import { Link, useNavigate } from 'react-router-dom'
import SuccessPopup from 'pages/Success'

const UserInfo: FC = () => {
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)
  const [userData, setUserData] = useState({
    id: 1,
    first_name: '',
    last_name: '',
    email: '',
    avatar: '',
  })

  const togglePopup = () => {
    setIsOpen(!isOpen)
  }

  const handleDeleteAcc = async (id: number) => {
    const response = await API.deleteUser(id)
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message)
      setShowError(true)
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message)
      setShowError(true)
    } else {
      navigate('/')
    }
  }

  const user = useQuery(['currUser'], () => API.fetchCurrUser(), {
    onSuccess: () => setLoading(false),
    refetchOnWindowFocus: false,
  })

  return (
    <Layout>
      {loading ? (
        <div className="text-center">Loading data...</div>
      ) : (
        <>
          {user.data ? (
            <div className="forms">
              <h1 className="display-5 text-center">Your info</h1>
              <Form.Group className="d-flex flex-column justify-content-center align-items-center">
                <FormLabel htmlFor="avatar" id="avatar-p">
                  <Avatar
                    round
                    src={`${process.env.REACT_APP_API_URL}/uploads/${user.data.data.avatar}`}
                    alt="Avatar"
                  />
                </FormLabel>
              </Form.Group>
              <Form.Group className="mb-3">
                <FormLabel htmlFor="email">Email</FormLabel>
                <input
                  type="email"
                  value={user.data.data.email}
                  aria-label="Email"
                  aria-describedby="email"
                  className="form-control"
                  style={{
                    borderRadius: 32,
                    borderColor: '#DE8667',
                    fontFamily: 'Raleway',
                  }}
                  readOnly
                />
              </Form.Group>
              <div className="d-flex justify-content-between mb-3">
                <div className="col-md-5">
                  <Form.Group className="mb-3">
                    <FormLabel htmlFor="first_name">First name</FormLabel>
                    <input
                      type="text"
                      value={user.data.data.first_name}
                      aria-label="First name"
                      aria-describedby="first_name"
                      className="form-control"
                      style={{
                        borderRadius: 32,
                        borderColor: '#DE8667',
                        fontFamily: 'Raleway',
                      }}
                      readOnly
                    />
                  </Form.Group>
                </div>
                <div className="col-md-5">
                  <Form.Group className="mb-3">
                    <FormLabel htmlFor="last_name">Last name</FormLabel>
                    <input
                      type="text"
                      value={user.data.data.last_name}
                      aria-label="Last name"
                      aria-describedby="last_name"
                      className="form-control"
                      style={{
                        borderRadius: 32,
                        borderColor: '#DE8667',
                        fontFamily: 'Raleway',
                      }}
                      readOnly
                    />
                  </Form.Group>
                </div>
              </div>
              <div
                className="d-flex justify-content-between mb-3"
                onPointerMove={(e) => {
                  setUserData(user.data.data)
                }}
              >
                <Link to={routes.USEREDIT} state={{ data: userData }}>
                  <Button className="btnRegister">Edit</Button>
                </Link>
                <p
                  className="text-decoration-none col-md-3"
                  style={{ color: '#000000' }}
                  onClick={togglePopup}
                >
                  Delete account
                </p>
              </div>
              {isOpen && (
                <SuccessPopup
                  content={
                    <>
                      <h1 className="text display-6 mb-4">Are you sure?</h1>
                      <p className="text">
                        Are you sure you want to{' '}
                        <span style={{ color: '#DE8667' }}>delete</span> your
                        account?
                      </p>
                      <div className="d-flex justify-content-start">
                        <Button
                          className="btnRegister col-md-3"
                          style={{ borderColor: '#DE8667' }}
                          onClick={() => handleDeleteAcc(user.data.data.id)}
                        >
                          Delete
                        </Button>
                        <p
                          className="col-md-3 mx-3"
                          style={{ color: '#000000' }}
                          onClick={togglePopup}
                        >
                          Cancel
                        </p>
                      </div>
                    </>
                  }
                />
              )}
            </div>
          ) : (
            <div className="text-center text">No info available</div>
          )}
        </>
      )}
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
    </Layout>
  )
}
export default UserInfo
