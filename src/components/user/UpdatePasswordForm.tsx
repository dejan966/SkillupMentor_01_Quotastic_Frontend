import { observer } from 'mobx-react'
import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StatusCode } from 'constants/errorConstants'
import * as API from 'api/Api'
import { useCreateUpdateUserForm, UpdateUserFields } from 'hooks/react-hook-form/useCreateUpdateUser'
import { Button, FormLabel, Form, Toast, ToastContainer } from 'react-bootstrap'
import { routes } from 'constants/routesConstants'
import { Controller } from 'react-hook-form'

const UpdatePasswordForm: FC = () =>{
const navigate = useNavigate()
const { handleSubmit, errors, control } = useCreateUpdateUserForm({})

const [apiError, setApiError] = useState('')
const [showError, setShowError] = useState(false)

const onSubmit = handleSubmit(
  async (data: UpdateUserFields) => {
    handleUpdate(data as UpdateUserFields)
  },
)

const handleUpdate = async (data: UpdateUserFields) => {
  const response = await API.updateUserPass(data)
  if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
    setApiError(response.data.message)
    setShowError(true)
  } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
    setApiError(response.data.message)
    setShowError(true)
  } else {
    navigate('/me')
  }
}

return(
  <>
    <Form className="form-group forms" onSubmit={onSubmit}>
      <div className="text-start text">
        <h1>Profile <span style={{color:'#DE8667'}}>settings</span></h1>
        <div className='mb-3'>Change your password</div>
      </div>
      <Controller
        control={control}
        name="current_password"
        render={({ field }) =>(
        <Form.Group className="mb-3">
          <FormLabel htmlFor="oldPassword">Current password</FormLabel>
          <input
            {...field}
            type="password"
            placeholder="******"
            aria-label="old_password"
            aria-describedby="old_password"
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
        )}/>
      <Controller
        control={control}
        name="password"
        render={({ field }) =>(
          <Form.Group className="mb-3">
            <FormLabel htmlFor="newPassword">New password</FormLabel>
            <input
              {...field}
              type="password"
              placeholder="******"
              aria-label="newPassword"
              aria-describedby="newPassword"
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
            <FormLabel htmlFor="confirm_password">Confirm new password</FormLabel>
            <input
              {...field}
              type="password"
              aria-label="Confirm new password"
              aria-describedby="confirm_new_password"
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
      <div className="d-flex justify-content-start">
        <div className="justify-content-center">
          <Button className="btnRegister col-md-3" type="submit">
            Submit
          </Button>
          <a className="text-decoration-none col-md-3 mx-3" style={{color:'#000000'}} href={routes.USEREDIT}>Cancel</a>
        </div>
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

export default observer(UpdatePasswordForm)