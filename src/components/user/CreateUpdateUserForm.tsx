import {
  CreateUserFields,
  UpdateUserFields,
  useCreateUpdateUserForm,
} from '../../hooks/react-hook-form/useCreateUpdateUser'
import { ChangeEvent, FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import { Form } from 'react-bootstrap'
import { Controller } from 'react-hook-form'
import FormLabel from 'react-bootstrap/FormLabel'
import Button from 'react-bootstrap/Button'
import * as API from '../../api/Api'
import { StatusCode } from '../../constants/errorConstants'
import authStore from '../../stores/auth.store'
import Avatar from 'react-avatar'
import { observer } from 'mobx-react'
import { UserType } from '../../models/auth'
import { routes } from '../../constants/routesConstants'

interface Props {
  defaultValues?: UserType & { isActiveUser?: boolean }
}

const CreateUpdateUserForm: FC<Props> = ({ defaultValues }) => {
  const navigate = useNavigate()
  const { handleSubmit, errors, control } = useCreateUpdateUserForm({
    defaultValues,
  })

  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileError, setFileError] = useState(false)

  const onSubmit = handleSubmit(
    async (data: CreateUserFields | UpdateUserFields) => {
      if (!defaultValues) await handleAdd(data as CreateUserFields)
      else await handleUpdate(data as UpdateUserFields)
    },
  )

  const handleAdd = async (data: CreateUserFields) => {
    if (!file) return
    const response = await API.createUser(data)
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message)
      setShowError(true)
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message)
      setShowError(true)
    } else {
      const formData = new FormData()
      formData.append('avatar', file, file.name)
      const fileResponse = await API.uploadAvatar(formData, response.data.id)
      if (fileResponse.data?.statusCode === StatusCode.BAD_REQUEST) {
        setApiError(fileResponse.data.message)
        setShowError(true)
      } else if (
        fileResponse.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
      ) {
        setApiError(fileResponse.data.message)
        setShowError(true)
      } else {
        navigate('/me')
      }
    }
  }

  const handleUpdate = async (data: UpdateUserFields) => {
    const response = await API.updateUser(data, defaultValues?.id as number)
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message)
      setShowError(true)
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message)
      setShowError(true)
    } else {
      if (!file) {
        if (defaultValues?.isActiveUser) {
          authStore.login(response.data)
        }
        navigate('/me')
        return
      }
      const formData = new FormData()
      formData.append('avatar', file, file.name)
      const fileResponse = await API.uploadAvatar(formData, response.data.id)
      if (fileResponse.data?.statusCode === StatusCode.BAD_REQUEST) {
        setApiError(fileResponse.data.message)
        setShowError(true)
      } else if (
        fileResponse.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
      ) {
        setApiError(fileResponse.data.message)
        setShowError(true)
      } else {
        if (defaultValues?.isActiveUser) {
          const userResponse = await API.fetchUser(response.data.id)
          if (
            userResponse.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
          ) {
            setApiError(fileResponse.data.message)
            setShowError(true)
          } else {
            authStore.login(userResponse.data)
          }
        }
      }
    }
  }

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
    
      <Form className="form-group forms" onSubmit={onSubmit}>
        <div className="text-start text">
          <h1>Profile <span style={{color:'#DE8667'}}>settings</span></h1>
          <div className='mb-3'>Change your profile setting</div>
        </div>
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
        <div className="d-flex justify-content-between mb-3">
          <div className="md-5">
            <Button className='btnOrange'>Change password</Button>
          </div>
          <div className="col-md-5">
            <Button className='btnChangeProfilePic'>Change profile picture</Button>
          </div>
        </div>
        <div className="d-flex justify-content-start">
          <Button className="btnRegister col-md-3" type="submit" onMouseUp={handleFileError}>
            Submit
          </Button>
          <a className="text-decoration-none col-md-3" style={{color:'#000000'}} href={routes.HOME}>Cancel</a>
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

export default observer(CreateUpdateUserForm)