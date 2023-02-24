import { observer } from 'mobx-react'
import { ChangeEvent, FC, useEffect, useState } from 'react'
import { Form, useNavigate } from 'react-router-dom'
import { StatusCode } from '../../constants/errorConstants'
import * as API from '../../api/Api'
import { useCreateUpdateUserForm, UpdateUserFields } from '../../hooks/react-hook-form/useCreateUpdateUser'
import authStore from '../../stores/auth.store'
import { Button } from 'react-bootstrap'
import { UserType } from '../../models/auth'
import { routes } from '../../constants/routesConstants'

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
  
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
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
                navigate('/me')
            }
        }
    

    return(
    <>
        <Form className="form-group forms" onSubmit={onSubmit}>
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

export default observer(UpdatePasswordForm)