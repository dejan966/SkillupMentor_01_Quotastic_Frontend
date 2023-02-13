import { observer } from 'mobx-react'
import { FC, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { StatusCode } from '../../constants/errorConstants'
import { routes } from '../../constants/routesConstants'
import { CreateQuoteFields, useCreateUpdateQuoteForm } from '../../hooks/react-hook-form/useCreateUpdateQuote'

const CreateUpdateQuoteForm: FC = ({ }) =>{
    const { handleSubmit} = useCreateUpdateQuoteForm()
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