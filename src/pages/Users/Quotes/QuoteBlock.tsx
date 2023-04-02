import { FC, useState } from 'react'
import { Button, Toast, ToastContainer } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { deleteQuote } from '../../../api/Quote'
import { StatusCode } from '../../../constants/errorConstants'
import { routes } from '../../../constants/routesConstants'
import { QuoteType } from '../../../models/quote'
import authStore from '../../../stores/auth.store'
import QuotesDelete from '../../Me/Myquote/Delete'
import * as API from '../../../api/Api'

interface Props {
  userQuote: QuoteType;
  liked:string;
  disliked:string;
  likes:boolean;
  dislikes:boolean;
  karma:number;
}

const QuoteBlock: FC<Props> = ({ userQuote, liked, disliked, likes, dislikes, karma })=>{
  const [userId, setUserId] = useState(1)
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [successDelete, setSuccessDelete] = useState(false)
  const navigate = useNavigate()

  const togglePopup = () => {
    setIsOpen(!isOpen)
  }
  
  const toggleSuccess = () => {
    setSuccessDelete(!successDelete)
  }

  const upvote = (quoteId:number) =>{
    if(likes === true){
      likes = false
      karma--
      liked = 'upvote.png'
      handleUpvote(quoteId)
      return
    }
    else if(likes === false){
      likes = true
      if(dislikes === true){
        liked = 'upvoted.png'
        dislikes = false
        karma+=2
        disliked = 'downvote.png'
        handleUpvote(quoteId)
        return
      }
      liked = 'upvoted.png'
      karma++
      handleUpvote(quoteId)
      return
    }
  }

  const downvote = (quoteId:number) =>{
    if(dislikes === true){
      dislikes = false
      disliked = 'downvote.png'
      karma++
      handleDownvote(quoteId)
      return
    }
    else if(dislikes === false){
      dislikes = true
      if(likes === true){
        likes = false
        disliked = 'downvoted.png'
        liked = 'upvote.png'
        karma-=2
        handleDownvote(quoteId)
        return
      }
      disliked = 'downvoted.png'
      karma--
      handleDownvote(quoteId)
      return
    }
  }

  const deleteQuote = async (quoteId:number) => {
    const response = await API.deleteQuote(quoteId)
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message)
      setShowError(true)
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message)
      setShowError(true)
    }
  }

  const handleProceedUser = () => {
    if(userId === authStore.user?.id){
      navigate('me/quotes')
      return
    }
    navigate(`users/${userId}/quotes`)
  }

  const handleUpvote = async (quoteId:number) => {
    const response = await API.createUpvote(quoteId)
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message)
      setShowError(true)
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message)
      setShowError(true)
    }
  }

  const handleDownvote = async (quoteId:number) => {
    const response = await API.createDownvote(quoteId)
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message)
      setShowError(true)
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message)
      setShowError(true)
    }
  }

  return(
    <div className="quoteBorder myQuotes mb-5" style={{width:400}}>
      {authStore.user ? (
        <>
          {authStore.user?.id === userQuote.user.id ? (
            <>
              <div className='m-4'>
                <img className='voting' src={`/${liked}`}  alt="Upvote"/>
                <div style={{fontSize:18, fontFamily:'raleway'}}>{userQuote.karma}</div>
                <img className='voting' src={`/${disliked}`}  alt="Downvote"/>
              </div>
              <div>
                <div style={{fontSize:18, fontFamily:'raleway'}}>{userQuote.quote}</div>
                <div className='authorGrid'>
                  <img className='voting userAvatar' src={`${process.env.REACT_APP_API_URL}/uploads/${userQuote.user.avatar}`} alt="User avatar" width={35} 
                  onPointerMove={e=>{setUserId(userQuote.user.id)}} onClick={handleProceedUser}/>
                  <div style={{fontSize:15, fontFamily:'raleway'}}>{userQuote.user.first_name + ' ' + userQuote.user.last_name}</div>
                </div>
              </div>
              <div className='m-4'>
                <Link to={`${routes.EDITQUOTE}/${userQuote.id}`} state={{ data: userQuote }} >
                  <img src="/settings.png" alt="Settings" />
                </Link>
                <div style={{color:'#fff'}}>s</div>
                <img className='voting' src="/delete.png" alt="Delete" onClick={togglePopup}/>
                {
                  isOpen && <QuotesDelete
                  content={
                  <>
                    <h1 className="text display-6 mb-4">Are you sure?</h1>
                    <p className='text'>The quote will be deleted. There is no undo of this action.</p>
                    <div className="d-flex justify-content-start">
                      <Button className="btnRegister col-md-3" style={{borderColor:'#DE8667'}} onClick={e=>{deleteQuote(userQuote.id);togglePopup();toggleSuccess()}}>
                          Delete
                      </Button>
                      <a className="text-decoration-none col-md-3" style={{color:'#000000'}} onClick={togglePopup}>Cancel</a>
                    </div>
                  </>
                  }/>
                }
                {
                  successDelete && <QuotesDelete
                  content={
                  <>
                    <p className='text fs-5'>Your <span style={{color:'#DE8667'}}>quote</span> was deleted.</p>
                    <div className="d-flex justify-content-start">
                      <Button href="/" className="btnRegister col-md-3" style={{borderColor:'#DE8667'}} onClick={e=>{toggleSuccess()}}>
                          Close
                      </Button>
                    </div>
                  </>
                  }/>
                }
              </div>
            </>
          ):(
            <>
              <div className='m-4'>
                <img className='voting' src={`/${liked}`}  alt="Upvote" onClick={e => {upvote(userQuote.id)}}/>
                <div style={{fontSize:18, fontFamily:'raleway'}}>{userQuote.karma}</div>
                <img className='voting' src={`/${disliked}`}  alt="Downvote" onClick={e => {downvote(userQuote.id)}}/>
              </div>
              <div>
                <div style={{fontSize:18, fontFamily:'raleway'}}>{userQuote.quote}</div>
                <div className='authorGrid'>
                  <img className='voting userAvatar' src={`${process.env.REACT_APP_API_URL}/uploads/${userQuote.user.avatar}`} alt="User avatar" width={35} 
                  onPointerMove={e=>{setUserId(userQuote.user.id)}} onClick={handleProceedUser}/>
                  <div style={{fontSize:15, fontFamily:'raleway'}}>{userQuote.user.first_name + ' ' + userQuote.user.last_name}</div>
                </div>
              </div>
            </>
          )}
        </>
      ):(
        <>
          <div className='m-4'>
            <Link to={routes.LOGIN}>
              <img className='voting' src="upvote.png" alt="Upvote" />
            </Link>
            <div style={{fontSize:18, fontFamily:'raleway'}}>{userQuote.karma}</div>
            <Link to={routes.LOGIN}>
              <img className='voting' src="downvote.png" alt="Downvote" />
            </Link>
          </div>
          <div>
            <div style={{fontSize:18, fontFamily:'raleway'}}>{userQuote.quote}</div>
            <div className='authorGrid'>
              <img className='voting userAvatar' src={`${process.env.REACT_APP_API_URL}/uploads/${userQuote.user.avatar}`} alt="User avatar" width={35} 
              onPointerMove={e=>{setUserId(userQuote.user.id)}} onClick={handleProceedUser}/>
              <div style={{fontSize:15, fontFamily:'raleway'}}>{userQuote.user.first_name + ' ' + userQuote.user.last_name}</div>
            </div>
          </div>
        </>
      )}
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
    </div>
  )
}

export default QuoteBlock