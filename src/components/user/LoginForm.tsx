import { LoginUserFields, useLoginForm } from 'hooks/react-hook-form/useLogin'
import { FC, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import { Form } from 'react-bootstrap'
import FormLabel from 'react-bootstrap/FormLabel'
import { routes } from 'constants/routesConstants'
import Button from 'react-bootstrap/Button'
import * as API from 'api/Api'
import { StatusCode } from 'constants/errorConstants'
import authStore from 'stores/auth.store'
import { observer } from 'mobx-react'
import { Controller } from 'react-hook-form'

const LoginForm: FC = () => {
  const navigate = useNavigate()
  const { handleSubmit, errors, control } = useLoginForm()
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)

  const onSubmit = handleSubmit(async (data: LoginUserFields) => {
    const response = await API.login(data)
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message)
      setShowError(true)
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message)
      setShowError(true)
    } else {
      authStore.login(response.data)
      navigate(routes.HOME)
    }
  })

  return (
    <>
      <div className="text-center text">
        <h1 className="display-5">Welcome <span style={{color:'#DE8667'}}>back</span></h1>
          <p className="fs-6">Thank you for coming back. Hope you have a good day and continue to inspire others</p>
      </div>
      <Form className="forms" onSubmit={onSubmit}>
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
        <Controller
          control={control}
          name="password"
          render={({field})=>(
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
        <Button className="w-100 btnLogin" style={{borderColor:'#DE8667'}} type="submit">
          Login
        </Button>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <p className="mb-0">Dont have an account yet?</p>
          <Link className="text-decoration-none text-end signUpText" to={routes.SIGNUP}>
            Sign up
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

export default observer(LoginForm)