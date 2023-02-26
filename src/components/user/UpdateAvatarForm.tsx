import { observer } from 'mobx-react'
import { ChangeEvent, FC, useEffect, useState } from 'react'
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

interface Props {
  defaultValues?: UserType & { isActiveUser?: boolean }
}

const UpdateAvatarForm: FC<Props> = ({ defaultValues }) =>{
  const navigate = useNavigate()
  const { handleSubmit, errors, control } = useCreateUpdateUserForm({
    defaultValues,
  })

  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string|null>(null)
  const [fileError, setFileError] = useState(false)

  const { data, isLoading, error } = useQuery(
    ['user'],
    () => API.fetchCurrUser(),
/*     {
      onSuccess:(response)=>{
        setPreview(response.data.data.avatar)
      }
    } */
  )

  const onSubmit = handleSubmit(
    async (data: UpdateUserFields) => {
      handleUpdate(data as UpdateUserFields)
    },
  )
    
  const handleUpdate = async (data: UpdateUserFields) => {
    const response = await API.updateUser(data, authStore.user?.id as number)
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
      { isLoading ? (
        <div className='text-center'>
          Loading data...
        </div>
        ):
        <>
        {data ? (
          <Form className="form-group forms" onSubmit={onSubmit}>
            <div className="text-start text">
              <h1>Profile <span style={{color:'#DE8667'}}>settings</span></h1>
              <div className='mb-3'>Change your profile photo</div>
            </div>
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
                  className="d-none" />
              </Form.Group>
            </div>
            <div className="d-flex justify-content-start">
              <Button className="btnRegister col-md-3" type="submit" onMouseUp={handleFileError}>
                Submit
              </Button>
              <a className="text-decoration-none col-md-3" style={{ color: '#000000' }} href={routes.USEREDIT}>Cancel</a>
            </div>
          </Form>
        ):null
      }
    </>
    }
    </>
  )
}

export default observer(UpdateAvatarForm)