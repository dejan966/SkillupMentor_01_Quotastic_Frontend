import {
  RegisterUserFields,
  useRegisterForm,
} from '../../hooks/react-hook-form/useRegister'
import { ChangeEvent, FC, useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import { Form } from 'react-bootstrap'
import { Controller } from 'react-hook-form'
import FormLabel from 'react-bootstrap/FormLabel'
import { routes } from '../../constants/routesConstants'
import Button from 'react-bootstrap/Button'
import * as API from '../../api/Api'
import { StatusCode } from '../../constants/errorConstants'
import authStore from '../../stores/auth.store'
import Avatar from 'react-avatar'
import { observer } from 'mobx-react'

const RegisterForm: FC = () => {
  const navigate = useNavigate()
  const { handleSubmit, errors } = useRegisterForm()
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileError, setFileError] = useState(false)

  const onSubmit = handleSubmit(async (data: RegisterUserFields) => {
    if (!file) return
    const response = await API.register(data)
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message)
      setShowError(true)
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message)
      setShowError(true)
    } else {
      // Login user before uploading an avatar image
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
        // Upload avatar
        const formData = new FormData()
        formData.append('avatar', file, file.name)
        const fileResponse = await API.uploadAvatar(
          formData,
          loginResponse.data.id,
        )
        if (fileResponse.data?.statusCode === StatusCode.BAD_REQUEST) {
          setApiError(fileResponse.data.message)
          setShowError(true)
        } else if (
          fileResponse.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
        ) {
          setApiError(fileResponse.data.message)
          setShowError(true)
        } else {
          // Get user with avatar image
          const userResponse = await API.fetchUser()
          if (
            userResponse.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
          ) {
            setApiError(fileResponse.data.message)
            setShowError(true)
          } else {
            authStore.login(userResponse.data)
            navigate(routes.HOME)
          }
        }
      }
    }
  })

  const handleFileError = () => {
    if (!file) setFileError(true)
    else setFileError(false)
  }

  const handleFileChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (target.files) {
      const myfile = target.files[0]
      setFile(myfile)
    }
  }

  useEffect(() => {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
        setFileError(false)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }, [file])

  return (
    <>
      <Form className="register-form" onSubmit={onSubmit}>
        <Form.Group className="d-flex flex-column justify-content-center align-items-center">
          <h1 className="display-5 text">What is your <span style={{color:'#DE8667'}}>name?</span></h1>
          <p className="text fs-6">Your name will appear on quotes and your public profile</p>
          <FormLabel htmlFor="avatar" id="avatar-p">
            <Avatar round src={preview as string} alt="Avatar" />
          </FormLabel>
          <input
            onChange={handleFileChange}
            id="avatar"
            name="avatar"
            type="file"
            aria-label="Avatar"
            aria-describedby="avatar"
            className="d-none"
          />
          {fileError && (
            <div className="d-block invalid-feedback text-danger mb-2 text-center">
              Field avatar is required
            </div>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <FormLabel htmlFor="email">Email</FormLabel>
          <input
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
        <Form.Group className="d-flex justify-content-between mb-3">
          <div className='col-md-5'>
            <FormLabel htmlFor="first_name">First name</FormLabel>
            <input
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
            </div>
            <div className='col-md-5'>
            <FormLabel htmlFor="last_name">Last name</FormLabel>
            <input
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
          </div>
        </Form.Group>
        <Form.Group className="mb-3">
          <FormLabel htmlFor="password">Password</FormLabel>
          <input
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
        <Form.Group className="mb-3">
          <FormLabel htmlFor="confirm_password">Confirm password</FormLabel>
          <input
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
        <Button className="w-100 btnRegister" style={{borderColor:'#DE8667'}} type="submit" onMouseUp={handleFileError}>
          Sign up
        </Button>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <p className="mb-0">Already have an account?</p>
          <Link className="text-decoration-none text-end" to={routes.LOGIN}>
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