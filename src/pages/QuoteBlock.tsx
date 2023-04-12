import { FC, useState } from 'react'
import { Button, Toast, ToastContainer } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { StatusCode } from 'constants/errorConstants'
import { routes } from 'constants/routesConstants'
import { QuoteType } from 'models/quote'
import authStore from 'stores/auth.store'
import QuotesDelete from './Me/Myquote/Delete'
import * as API from 'api/Api'

interface Props {
  userQuote: QuoteType;
  likedQuote?:number[];
  dislikedQuote?:number[];
  karma?:number[];
  upvote?:(index:number, quoteId:number, likeState:string, dislikeState:string)=>void;
  downvote?:(index:number, quoteId:number, likeState:string, dislikeState:string)=>void;
}

const QuoteBlock: FC<Props> = ({ userQuote, likedQuote, dislikedQuote, karma, upvote, downvote })=>{
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
    if(userQuote.user.id === authStore.user?.id){
      navigate('me/quotes')
      return
    }
    navigate(`users/${userQuote.user.id}/quotes`)
  }

  return(
    <div className="quoteBorder myQuotes mb-5" style={{width:400}}>
      {authStore.user ? (
        <>
          {authStore.user?.id === userQuote.user.id ? (
            <>
              <div className='m-4'>
                <img className='voting' src={'/upvote.png'}  alt="Upvote"/>
                <div style={{fontSize:18, fontFamily:'raleway'}}>{userQuote.karma}</div>
                <img className='voting' src={'/downvote.png'}  alt="Downvote"/>
              </div>
              <div>
                <div style={{fontSize:18, fontFamily:'raleway'}}>{userQuote.quote}</div>
                <div className='authorGrid'>
                  <img className='voting userAvatar' src={`${process.env.REACT_APP_API_URL}/uploads/${userQuote.user.avatar}`} alt="User avatar" width={35} 
                   onClick={handleProceedUser}/>
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
                      <p className="text-decoration-none col-md-3" style={{color:'#000000'}} onClick={togglePopup}>Cancel</p>
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
            {likedQuote?.map((element, index)=>
            <div key={index}>
            {element === userQuote.id ? (
              <>
                <div className='m-4'>
                  <img 
                    className='voting' 
                    src={'/upvoted.png'}  
                    alt="Upvote" 
                    onClick={e => {upvote!(index, userQuote.id, '/upvoted.png', '/downvote.png')}}
                  />
                  <div style={{fontSize:18, fontFamily:'raleway'}}>{karma![index]}</div>
                  <img className='voting' src={'/downvote.png'}  alt="Downvote" onClick={e => {downvote!(index, userQuote.id,'/downvote.png', '/upvoted.png')}}/>
                </div>
                <div>
                  <div style={{fontSize:18, fontFamily:'raleway'}}>{userQuote.quote}</div>
                  <div className='authorGrid'>
                    <img 
                      className='voting userAvatar' 
                      src={`${process.env.REACT_APP_API_URL}/uploads/${userQuote.user.avatar}`} 
                      alt="User avatar" 
                      width={35} 
                      onClick={handleProceedUser}
                    />
                    <div style={{fontSize:15, fontFamily:'raleway'}}>{userQuote.user.first_name + ' ' + userQuote.user.last_name}</div>
                  </div>
                </div>
              </>
             ):(
              <>
              {dislikedQuote![index] === userQuote.id ? (
                <>
                  <div className='m-4'>
                    <img 
                      className='voting'
                      src={'/upvote.png'}
                      alt="Upvote"
                      onClick={e => {upvote!(index, userQuote.id, '/upvote.png', 'downvote.png')}}
                    />
                    <div style={{fontSize:18, fontFamily:'raleway'}}>{karma![index]}</div>
                    <img className='voting' src={'/downvoted.png'}  alt="Downvote" onClick={e => {downvote!(index, userQuote.id, '/downvoted.png', '/upvote.png')}}/>
                  </div>
                  <div>
                    <div style={{fontSize:18, fontFamily:'raleway'}}>{userQuote.quote}</div>
                    <div className='authorGrid'>
                      <img 
                        className='voting userAvatar' 
                        src={`${process.env.REACT_APP_API_URL}/uploads/${userQuote.user.avatar}`} 
                        alt="User avatar" 
                        width={35} 
                        onClick={handleProceedUser}
                      />
                      <div style={{fontSize:15, fontFamily:'raleway'}}>{userQuote.user.first_name + ' ' + userQuote.user.last_name}</div>
                    </div>
                  </div>
                </>
              ):(
                null
                //poglej mal se
                /* <>
                {console.log('nothing ' + index + ': ', element, ' ', userQuote.id, ' ', karma![index])}
        
                  <div className='m-4'>
                    <img className='voting' src={'/upvote.png'}  alt="Upvote" onClick={e => {upvote!(index, userQuote.id, '/upvote.png', '/downvote.png')}}/>
                    <div style={{fontSize:18, fontFamily:'raleway'}}>{karma![index]}</div>
                    <img className='voting' src={'/downvote.png'}  alt="Downvote" onClick={e => {downvote!(index, userQuote.id, '/downvote.png', '/upvote.png')}}/>
                  </div>
                  <div>
                    <div style={{fontSize:18, fontFamily:'raleway'}}>{userQuote.quote}</div>
                    <div className='authorGrid'>
                      <img className='voting userAvatar' src={`${process.env.REACT_APP_API_URL}/uploads/${userQuote.user.avatar}`} alt="User avatar" width={35} 
                      onClick={handleProceedUser}/>
                      <div style={{fontSize:15, fontFamily:'raleway'}}>{userQuote.user.first_name + ' ' + userQuote.user.last_name}</div>
                    </div>
                  </div>
                </> */
              )}
              </>
             )}
            </div>
            )}
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
               onClick={handleProceedUser}/>
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
