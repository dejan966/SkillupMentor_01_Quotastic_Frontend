import { FC, useState } from 'react'
import { Button } from 'react-bootstrap'
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
  index:number;
  liked:string[];
  disliked:string[];
  likes:boolean[];
  dislikes:boolean[];
  karma?:number[];
}

const QuoteBlock: FC<Props> = ({ userQuote, index, liked, disliked, likes, dislikes, karma })=>{
  const [userId, setUserId] = useState(1)
  const [quoteData, setQuoteData] = useState({ id: 1, quote:''}) 

  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)

  const togglePopup = () => {
    setIsOpen(!isOpen)
  }
  
  const toggleSuccess = () => {
    setSuccessDelete(!successDelete)
  }

    /* const upvoteMostLiked = (index:number, quoteId:number) =>{
    const likesQuotesCopy = {...likesQuotes}
    const dislikesQuotesCopy = {...dislikesQuotes}
    if(likesQuotes[index] === true){
      likesQuotesCopy[index] = false
      mostLikedQuotesKarma[index]--
      mostLikedQuotes[index] = 'upvote.png'
      setLikesQuotes(likesQuotesCopy)
      setMostLikedQuotesKarma(mostLikedQuotesKarma)
      handleUpvote(quoteId)
      return
    }
    else if(likesQuotes[index] === false){
      likesQuotesCopy[index] = true
      if(dislikesQuotes[index] === true){
        setLikesQuotes(likesQuotesCopy)
        mostLikedQuotes[index] = 'upvoted.png'
        dislikesQuotesCopy[index] = false
        setDislikesQuotes(dislikesQuotesCopy)
        mostLikedQuotesKarma[index]+=2
        mostDislikedQuotes[index] = 'downvote.png'
        setMostLikedQuotes(mostLikedQuotes)
        setMostDislikedQuotes(mostDislikedQuotes)
        setMostLikedQuotesKarma(mostLikedQuotesKarma)
        handleUpvote(quoteId)
        return
      }
      setLikesQuotes(likesQuotesCopy)
      mostLikedQuotes[index] = 'upvoted.png'
      mostLikedQuotesKarma[index]++
      setMostLikedQuotes(mostLikedQuotes)
      setMostLikedQuotesKarma(mostLikedQuotesKarma)
      handleUpvote(quoteId)
      return
    }
  }

  const downvoteMostLiked = (index:number, quoteId:number) =>{
    const likesQuotesCopy = {...likesQuotes}
    const dislikesQuotesCopy = {...dislikesQuotes}
    if(dislikesQuotes[index] === true){
      dislikesQuotesCopy[index] = false
      setDislikesQuotes(dislikesQuotesCopy)
      mostDislikedQuotes[index] = 'downvote.png'
      mostLikedQuotesKarma[index]++
      setMostLikedQuotesKarma(mostLikedQuotesKarma)
      handleDownvote(quoteId)
      return
    }
    else if(dislikesQuotes[index] === false){
      dislikesQuotesCopy[index] = true
      if(likesQuotes[index] === true){
        likesQuotesCopy[index] = false
        mostDislikedQuotes[index] = 'downvoted.png'
        setDislikesQuotes(dislikesQuotesCopy)
        setLikesQuotes(likesQuotesCopy)
        mostLikedQuotes[index] = 'upvote.png'
        setMostDislikedQuotes(mostDislikedQuotes)
        mostLikedQuotesKarma[index]-=2
        setMostLikedQuotesKarma(mostLikedQuotesKarma)
        handleDownvote(quoteId)
        return
      }
      mostDislikedQuotes[index] = 'downvoted.png'
      setDislikesQuotes(dislikesQuotesCopy)
      mostLikedQuotesKarma[index]--
      setMostLikedQuotesKarma(mostLikedQuotesKarma)
      handleDownvote(quoteId)
      return
    }
  } */

  const [isOpen, setIsOpen] = useState(false)
  const [successDelete, setSuccessDelete] = useState(false)
  const navigate = useNavigate()

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
    <div key={index} className="quoteBorder myQuotes mb-5" style={{width:400}} onPointerMove={e=>{quoteData.id = userQuote.id; quoteData.quote = userQuote.quote}}>
      <div className='m-4'>
        <img className='voting' src={`/${liked[index]}`}  alt="Upvote" />
        <div style={{fontSize:18, fontFamily:'raleway'}}>{userQuote.karma}</div>
        <img className='voting' src={`/${disliked[index]}`}  alt="Downvote"/>
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
        <Link to={`${routes.EDITQUOTE}/${userQuote.id}`} state={{ data: quoteData }} >
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
    </div>
  )
}

export default QuoteBlock