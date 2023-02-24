import { observer } from 'mobx-react'
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StatusCode } from '../../constants/errorConstants'
import * as API from '../../api/Api' 
import { useCreateUpdateUserForm, UpdateUserFields } from '../../hooks/react-hook-form/useCreateUpdateUser'
import authStore from '../../stores/auth.store'
import { UserType } from '../../models/auth'
import { Button, FormLabel, Form } from 'react-bootstrap'
import { routes } from '../../constants/routesConstants'
import Avatar from 'react-avatar'
import { useQuery } from 'react-query'
import Layout from '../ui/Layout'

interface Props {
  defaultValues?: UserType & { isActiveUser?: boolean }
}

const UpdateAvatarForm: FC<Props> = ({ defaultValues }) =>{
  const navigate = useNavigate()
  const { handleSubmit, errors, control } = useCreateUpdateUserForm({
    defaultValues,
  })

  const { data, isLoading, error } = useQuery(
    ['user'],
    () => API.fetchCurrUserAvatar(),
  )

  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string|null>(null)
  const [fileError, setFileError] = useState(false)

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

  const uploadFile = () =>{
    document.getElementById('avatarUpload')?.click()
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
  return(
    <>
      <Form className="form-group forms" onSubmit={onSubmit}>
        <Form.Group className="d-flex flex-column justify-content-center align-items-center">
          <FormLabel htmlFor="avatar" id="avatar-p">
            <Avatar round src={preview as string} alt="Avatar" />
          </FormLabel>
        </Form.Group>
        <div className="d-flex justify-content-center mb-3">
        <Form.Group className="d-flex flex-column justify-content-center align-items-center">
          <Button className="btnChangeProfilePic" onClick={uploadFile}>
            Upload new image
          </Button>
          <input
            onChange={handleFileChange}
            id="avatarUpload"
            name="avatar"
            type="file"
            aria-label="Avatar"
            aria-describedby="avatar"
            className="d-none"
          />
        </Form.Group>
        </div>
        <div className="d-flex justify-content-start">
          <Button className="btnRegister col-md-3" type="submit">
            Submit
          </Button>
          <a className="text-decoration-none col-md-3" style={{color:'#000000'}} href={routes.HOME}>Cancel</a>
        </div>
      </Form>
    </>
  )
}

export default observer(UpdateAvatarForm)