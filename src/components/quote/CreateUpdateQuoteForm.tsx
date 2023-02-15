import { observer } from 'mobx-react'
import { FC, useState } from 'react'
import { Button, Form, Toast, ToastContainer } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { StatusCode } from '../../constants/errorConstants'
import { routes } from '../../constants/routesConstants'
import { CreateQuoteFields, UpdateQuoteFields, useCreateUpdateQuoteForm } from '../../hooks/react-hook-form/useCreateUpdateQuote'
import { QuoteType } from '../../models/quote'
import * as API from '../../api/Api'
import { Controller } from 'react-hook-form'

interface Props {
    defaultValues?: QuoteType
}

const CreateUpdateQuoteForm: FC<Props> = ({ defaultValues }) =>{
    const navigate = useNavigate()
    
    const { handleSubmit, control } = useCreateUpdateQuoteForm({
        defaultValues,
    })

    const [apiError, setApiError] = useState('')
    const [showError, setShowError] = useState(false)

    const onSubmit = handleSubmit(
      async (data: CreateQuoteFields | UpdateQuoteFields) => {
        if (!defaultValues) await handleAdd(data as CreateQuoteFields)
        else await handleUpdate(data as UpdateQuoteFields)
      },
    )

    const handleAdd = async (data: CreateQuoteFields) => {
      const response = await API.createQuote(data)
      if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
        setApiError(response.data.message)
        setShowError(true)
      } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
        setApiError(response.data.message)
        setShowError(true)
      } else {
        navigate('/')
      }
    }
    
    const handleUpdate = async (data: UpdateQuoteFields) => {
      const response = await API.updateQuote(data, defaultValues?.id as number)
      if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
        setApiError(response.data.message)
        setShowError(true)
      } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
        setApiError(response.data.message)
        setShowError(true)
      } else {
          navigate('/me/quotes')
      }
    }
  
    return(
        <>
          <div className='text-center text'>
              <h1 className="display-6">Are you feeling <span style={{color:'#DE8667'}}>inspired?</span></h1>
              <div>You can post quotes. You can delete them on your profile</div>
          </div>
          <div className="form-group forms" onSubmit={onSubmit}>
            <Controller
              control={control}
              name="quote"
              render={({ field }) =>(
                <Form.Group className="mb-3 text-center">
                    <textarea {...field} className="textfield" id="newQuote"></textarea>
                </Form.Group>
            )}/>
              
              <div className="d-flex justify-content-start">
                  <Button className="quoteButton w-100 btnRegister col-md-3" style={{borderColor:'#DE8667'}} type="submit">
                      Submit
                  </Button>
                  <a className="text-decoration-none textColor" href={routes.HOME}>Cancel</a>
              </div>
          </div>
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
export default observer(CreateUpdateQuoteForm)