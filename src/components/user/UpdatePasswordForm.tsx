import { observer } from 'mobx-react'
import { ChangeEvent, FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StatusCode } from '../../constants/errorConstants'
import * as API from '../../api/Api'
import { useCreateUpdateUserForm, UpdateUserFields } from '../../hooks/react-hook-form/useCreateUpdateUser'
import authStore from '../../stores/auth.store'
import { Button, FormLabel, Form } from 'react-bootstrap'
import { UserType } from '../../models/auth'
import { routes } from '../../constants/routesConstants'
import { Controller } from 'react-hook-form'

interface Props {
    defaultValues?: UserType & { isActiveUser?: boolean }
}

const UpdatePasswordForm: FC<Props> = ({ defaultValues }) =>{
const navigate = useNavigate()
const { handleSubmit, errors, control } = useCreateUpdateUserForm({
  defaultValues,
})

const [apiError, setApiError] = useState('')
const [showError, setShowError] = useState(false)

const onSubmit = handleSubmit(
  async (data: UpdateUserFields) => {
    handleUpdate(data as UpdateUserFields)
  },
)

const handleUpdate = async (data: UpdateUserFields) => {
  const response = await API.updateUser(data, defaultValues?.id as number)
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
      name="password"
      render={({ field }) =>(
        <Form.Group className="mb-3">
          <FormLabel htmlFor="password">Current password</FormLabel>
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
      name="password"
      render={({ field }) =>(
        <Form.Group className="mb-3">
          <FormLabel htmlFor="newPassword">New password</FormLabel>
          <input
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

        <div className="d-flex justify-content-start">
            <Button className="btnRegister col-md-3" type="submit">
                Submit
            </Button>
            <a className="text-decoration-none col-md-3" style={{color:'#000000'}} href={routes.USEREDIT}>Cancel</a>
        </div>
    </Form>
  </>
  )
}

export default observer(UpdatePasswordForm)