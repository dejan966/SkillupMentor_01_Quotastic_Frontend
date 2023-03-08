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
import QuotesEditSuccess from '../../pages/Me/Myquote/Edit/success'

interface Props {
  defaultValues?: QuoteType
}

const CreateUpdateQuoteForm: FC<Props> = ({ defaultValues }) =>{
  const { handleSubmit, control } = useCreateUpdateQuoteForm({
    defaultValues,
  })

  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const togglePopup = () => {
    setIsOpen(!isOpen)
  }

/*   const popup = () => {
    {
      isOpen && <QuotesEditSuccess
      content={
      <>
        <h1 className="text display-6 mb-4">Are you sure?</h1>
        <p className='text'>Your <span style={{color:'#DE8667'}}>quote</span> was edited.</p>
        <Button className="btnRegister col-md-3" style={{borderColor:'#DE8667'}} onClick={togglePopup}>
          Close
        </Button>
      </>
      }/>
    }
  } */

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
    }
    else{
      navigate('/')
    }
  }

  return(
      <>
        <Form className="form-group forms" onSubmit={onSubmit}>
          <div className="text-start text">
              <h1 className="display-6">Are you feeling <span style={{color:'#DE8667'}}>inspired?</span></h1>
              <div className='mb-3'>You can post quotes. You can delete them on your profile</div>
          </div>
          <Controller
            control={control}
            name="quote"
            render={({ field }) =>(
              <Form.Group className="mb-3">
                  <textarea {...field} className="textfield" id="newQuote"></textarea>
              </Form.Group>
          )}/>
          <div className="d-flex justify-content-start">
            <Button className="btnRegister col-md-3" style={{borderColor:'#DE8667'}} onClick={togglePopup}>
              Submit
            </Button>
            <a className="text-decoration-none col-md-3" style={{color:'#000000'}} href={routes.HOME}>Cancel</a>
            {
              isOpen && <QuotesEditSuccess
              content={
              <>
                <h1 className="text display-6 mb-4">Are you sure?</h1>
                <p className='text'>Your <span style={{color:'#DE8667'}}>quote</span> was edited.</p>
                <Button className="btnRegister col-md-3" style={{borderColor:'#DE8667'}} type="submit">
                  Close
                </Button>
              </>
              }/>
            }
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
export default observer(CreateUpdateQuoteForm)