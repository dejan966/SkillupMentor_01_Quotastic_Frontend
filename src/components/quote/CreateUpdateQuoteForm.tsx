import { observer } from 'mobx-react'
import { FC, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { StatusCode } from '../../constants/errorConstants'
import { routes } from '../../constants/routesConstants'
import { CreateQuoteFields, UpdateQuoteFields, useCreateUpdateQuoteForm } from '../../hooks/react-hook-form/useCreateUpdateQuote'
import { QuoteType } from '../../models/quote'
import * as API from '../../api/Api'

interface Props {
    defaultValues?: QuoteType
}

const CreateUpdateQuoteForm: FC<Props> = ({ defaultValues }) =>{
    const navigate = useNavigate()
    
    const { handleSubmit, errors, control } = useCreateUpdateQuoteForm({
        defaultValues,
    })

    const [apiError, setApiError] = useState('')
    const [showError, setShowError] = useState(false)

/*     const onSubmit = handleSubmit(async (data: CreateQuoteFields) =>{
        if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
            setApiError(response.data.message)
            setShowError(true)
            } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
            setApiError(response.data.message)
            setShowError(true)
            } else{

            }
    }) */

    const onSubmit = handleSubmit(
        async (data: CreateQuoteFields | UpdateQuoteFields) => {
          if (!defaultValues) await handleAdd(data as CreateQuoteFields)
          else await handleUpdate(data as UpdateQuoteFields)
        },
    )

/*     const handleAdd = async (data: CreateQuoteFields) => {
        if (!file) return
        const response = await API.createQuote(data)
        if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
          setApiError(response.data.message)
          setShowError(true)
        } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
          setApiError(response.data.message)
          setShowError(true)
        } else {
          //Upload avatar
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
            navigate('/users')
          }
        }
      }
    
      const handleUpdate = async (data: UpdateQuoteFields) => {
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
            navigate('/users')
            return
          }
          //Upload avatar
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
              //Get user with avatar image
              const userResponse = await API.fetchUser()
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
    } */

    return(
        <>
        <div className='text-center text'>
            <h1 className="display-6">Are you feeling <span style={{color:'#DE8667'}}>inspired?</span></h1>
            <div>You can post quotes. You can delete them on your profile</div>
        </div>
        <div className="form-group forms">
            <Form.Group className="mb-3 text-center">
                <textarea className="textfield" id="newQuote"></textarea>
            </Form.Group>
            <div className="d-flex justify-content-start">
                <Button className="quoteButton w-100 btnRegister col-md-3" style={{borderColor:'#DE8667'}} type="submit">
                    Submit
                </Button>
                <a className="text-decoration-none textColor" href={routes.HOME}>Cancel</a>
            </div>
        </div>
        </>
    )
}
export default observer(CreateUpdateQuoteForm)