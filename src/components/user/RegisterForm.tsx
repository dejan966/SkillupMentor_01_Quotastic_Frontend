import {
  RegisterUserFields,
  useRegisterForm,
} from 'hooks/react-hook-form/useRegister'
import { FC, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import { Form } from 'react-bootstrap'
import { Controller } from 'react-hook-form'
import FormLabel from 'react-bootstrap/FormLabel'
import { routes } from 'constants/routesConstants'
import Button from 'react-bootstrap/Button'
import * as API from 'api/Api'
import { StatusCode } from 'constants/errorConstants'
import authStore from 'stores/auth.store'
import Avatar from 'react-avatar'
import { observer } from 'mobx-react'

const RegisterForm: FC = () => {
  const navigate = useNavigate()
  const { handleSubmit, errors, control } = useRegisterForm()
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)

  const onSubmit = handleSubmit(async (data: RegisterUserFields) => {
    const response = await API.register(data)
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message)
      setShowError(true)
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message)
      setShowError(true)
    } else {
      const loginResponse = await API.login({
        email: data.email,
        password: data.password,
      })
      if (loginResponse.data?.statusCode === StatusCode.BAD_REQUEST) {
        setApiError(loginResponse.data.message)
        setShowError(true)
      } else if (
        loginResponse.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
      ) {
        setApiError(loginResponse.data.message)
        setShowError(true)
      } else {
        authStore.login(response.data)
        navigate(routes.HOME)
      }
    }
  })

  return (
    <>
      <div className="text-center text">
        <h1 className="display-5">What is your <span style={{color:'#DE8667'}}>name?</span></h1>
        <p className="fs-6">Your name will appear on quotes and your public profile</p>
      </div>
      <Form className="forms" onSubmit={onSubmit}>
        <Form.Group className="d-flex flex-column justify-content-center align-items-center">
          <FormLabel htmlFor="avatar" id="avatar-p">
            <Avatar round src={`${process.env.REACT_APP_API_URL}/uploads/Blank-Avatar.jpg`} alt="Avatar" />
          </FormLabel>
        </Form.Group>
        <Controller
          control={control}
          name="email"
          render={({field})=>(
            <Form.Group className="mb-3">
              <FormLabel htmlFor="email">Email</FormLabel>
              <input
                {...field}
                type="email"
                placeholder="example@gmail.com"
                aria-label="Email"
                aria-describedby="email"
                className={
                  errors.email ? 'form-control is-invalid' : 'form-control'
                }
                style={{borderRadius:32, borderColor:'#DE8667', fontFamily:'Raleway'}}
              />
              {errors.email && (
                <div className="invalid-feedback text-danger">
                  {errors.email.message}
                </div>
              )}
            </Form.Group>
          )}
        />
        <div className="d-flex justify-content-between">
          <div className="col-md-5">
            <Controller
            control={control}
            name="first_name"
            render={({field})=>(
              <Form.Group className="mb-3">
                <FormLabel htmlFor="first_name">First name</FormLabel>
                <input
                  {...field}
                  type="text"
                  aria-label="First name"
                  aria-describedby="first_name"
                  className={
                    errors.first_name ? 'form-control is-invalid' : 'form-control'
                  }
                  style={{borderRadius:32, borderColor:'#DE8667', fontFamily:'Raleway'}}
                />
                {errors.first_name && (
                  <div className="invalid-feedback text-danger">
                    {errors.first_name.message}
                  </div>
                )}
              </Form.Group>
            )}
            />
          </div>
          <div className='col-md-5'>
            <Controller
            control={control}
            name="last_name"
            render={({ field }) => (
              <Form.Group className="mb-3">
                <FormLabel htmlFor="last_name">Last name</FormLabel>
                <input
                  {...field}
                  type="text"
                  aria-label="Last name"
                  aria-describedby="last_name"
                  className={
                    errors.last_name ? 'form-control is-invalid' : 'form-control'
                  }
                  style={{borderRadius:32, borderColor:'#DE8667', fontFamily:'Raleway'}}
                />
                {errors.last_name && (
                  <div className="invalid-feedback text-danger">
                    {errors.last_name.message}
                  </div>
                )}
              </Form.Group>
            )}
            />   
          </div>
        </div>
        <Controller
          control={control}
          name="password"
          render={({ field }) =>(
            <Form.Group className="mb-3">
              <FormLabel htmlFor="password">Password</FormLabel>
              <input
                {...field}
                type="password"
                placeholder="******"
                aria-label="Password"
                aria-describedby="password"
                className={
                  errors.password ? 'form-control is-invalid' : 'form-control'
                }
                style={{borderRadius:32, borderColor:'#DE8667', fontFamily:'Raleway'}}
              />
              {errors.password && (
                <div className="invalid-feedback text-danger">
                  {errors.password.message}
                </div>
              )}
            </Form.Group>
          )}
        />
        <Controller
          control={control}
          name="confirm_password"
          render={({ field }) => (
            <Form.Group className="mb-3">
              <FormLabel htmlFor="confirm_password">Confirm password</FormLabel>
              <input
              {...field}
                type="password"
                aria-label="Confirm password"
                aria-describedby="confirm_password"
                className={
                  errors.confirm_password ? 'form-control is-invalid' : 'form-control'
                }
                style={{borderRadius:32, borderColor:'#DE8667', fontFamily:'Raleway'}}
              />
              {errors.confirm_password && (
                <div className="invalid-feedback text-danger">
                  {errors.confirm_password.message}
                </div>
              )}
            </Form.Group> 
          )}
        />
        <Button className="w-100 btnRegister" style={{borderColor:'#DE8667'}} type="submit">
          Sign up
        </Button>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <p className="mb-0">Already have an account?</p>
          <Link className="text-decoration-none text-end signUpText" to={routes.LOGIN}>
            Sign in
          </Link>
        </div>
      </Form>
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

export default observer(RegisterForm)