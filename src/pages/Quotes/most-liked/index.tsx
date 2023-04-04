import { FC, useState } from 'react'
import { useQuery } from 'react-query'
import Layout from 'components/ui/Layout'
import * as API from 'api/Api'
import authStore from 'stores/auth.store'
import { Link, useNavigate } from 'react-router-dom'
import { StatusCode } from 'constants/errorConstants'
import { Button, Toast, ToastContainer } from 'react-bootstrap'
import { routes } from 'constants/routesConstants'
import { QuoteType } from 'models/quote'
import QuotesDelete from 'pages/Me/Myquote/Delete'

const QuotesMostLiked: FC = () => {
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)

  const [mostLikedQuotes, setMostLikedQuotes] = useState<string[]>([])
  const [mostDislikedQuotes, setMostDislikedQuotes] = useState<string[]>([])
  const [likesQuotes, setLikesQuotes] = useState<boolean[]>([])
  const [dislikesQuotes, setDislikesQuotes] = useState<boolean[]>([])
  const [mostLikedQuotesKarma, setMostLikedQuotesKarma] = useState<number[]>([])

  const [userId, setUserId] = useState(1)
  const [quoteData, setQuoteData] = useState({ id: 1, quote:''}) 
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false)
  const [successDelete, setSuccessDelete] = useState(false)
  
  const mostLiked = useQuery(
    ['allMostLikedQuotes'],
    () => API.fetchQuotes(),
    {
      onSuccess(data){
        if(data.data[0].votes[0]){
          if(data.data[0].votes[0].value === true){
            mostLikedQuotes.push('upvoted.png') 
            setMostLikedQuotes(mostLikedQuotes)
            mostDislikedQuotes.push('downvote.png')
            setMostDislikedQuotes(mostDislikedQuotes)
            likesQuotes.push(true)
            setLikesQuotes(likesQuotes)
            dislikesQuotes.push(false)
            setDislikesQuotes(dislikesQuotes)
            mostLikedQuotesKarma.push(data.data[0].karma)
            setMostLikedQuotesKarma(mostLikedQuotesKarma)
          }
          else if(data.data[0].votes[0].value === false){
            mostLikedQuotes.push('upvote.png') 
            setMostLikedQuotes(mostLikedQuotes)
            mostDislikedQuotes.push('downvoted.png')
            setMostDislikedQuotes(mostDislikedQuotes)
            likesQuotes.push(false)
            setLikesQuotes(likesQuotes)
            dislikesQuotes.push(true)
            setDislikesQuotes(dislikesQuotes)
            mostLikedQuotesKarma.push(data.data[0].karma)
            setMostLikedQuotesKarma(mostLikedQuotesKarma)
          }
        }
        else{
          mostLikedQuotes.push('upvote.png') 
          setMostLikedQuotes(mostLikedQuotes)
          mostDislikedQuotes.push('downvote.png')
          setMostDislikedQuotes(mostDislikedQuotes)
          likesQuotes.push(false)
          setLikesQuotes(likesQuotes)
          dislikesQuotes.push(false)
          setDislikesQuotes(dislikesQuotes)
          mostLikedQuotesKarma.push(data.data[0].karma)
          setMostLikedQuotesKarma(mostLikedQuotesKarma)
        }
        for(let i = 1; i<data.data.length; i++){
          if(authStore.user?.id === data.data[i].votes[0]?.user.id){
            if(data.data[i].votes[0]?.value === true){
              likesQuotes.push(true)
              dislikesQuotes.push(false)
              
              mostLikedQuotes.push('upvoted.png')
              mostDislikedQuotes.push('downvote.png')
              mostLikedQuotesKarma.push(data.data[i].karma)
            } else if(data.data[i].votes[0]?.value === false){
              likesQuotes.push(false)
              dislikesQuotes.push(true)

              mostLikedQuotes.push('upvote.png')
              mostDislikedQuotes.push('downvoted.png')
              mostLikedQuotesKarma.push(data.data[i].karma)
            }
            else{
              likesQuotes.push(false)
              dislikesQuotes.push(false)

              mostLikedQuotes.push('upvote.png')
              mostDislikedQuotes.push('downvote.png')
              mostLikedQuotesKarma.push(data.data[i].karma)
            }
          }
          else if(authStore.user?.id !== data.data[i].votes[0]?.user.id){
            likesQuotes.push(false)
            dislikesQuotes.push(false)

            mostLikedQuotes.push('upvote.png')
            mostDislikedQuotes.push('downvote.png')
            mostLikedQuotesKarma.push(data.data[i].karma)
          }
        }        
        setMostLikedQuotes(mostLikedQuotes)
        setMostDislikedQuotes(mostDislikedQuotes)

        setLikesQuotes(likesQuotes)
        setDislikesQuotes(dislikesQuotes)

        setMostLikedQuotesKarma(mostLikedQuotesKarma)
      },
      refetchOnWindowFocus: false,
    },
  )

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
  
  const handleProceedUser = () => {
    if(userId === authStore.user?.id){
        navigate('../me/quotes')
        return
    }
    navigate(`../users/${userId}/quotes`)
  }

  const upvoteMostLiked = (index:number, quoteId:number) =>{
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
  }
  
  return(
      <Layout>
        <div className='text-start mb-4' style={{width:420}}>
          <h2 className='red'>Most upvoted quotes</h2>
        </div>
        {mostLiked.data ? (
          <div className='quoteRow'>
            {mostLiked.data.data.map((item:QuoteType, index:number) => (
              authStore.user?.id === item.user.id ? (
              <div key={index} className="quoteBorder myQuotes mb-5" style={{width:400}} onPointerMove={e=>{quoteData.id = item.id; quoteData.quote = item.quote}}>
                <div className='m-4'>
                  <img className='voting' src={`/${mostLikedQuotes[index]}`}  alt="Upvote" />
                  <div style={{fontSize:18, fontFamily:'raleway'}}>{item.karma}</div>
                  <img className='voting' src={`/${mostDislikedQuotes[index]}`}  alt="Downvote"/>
                </div>
                <div>
                  <div style={{fontSize:18, fontFamily:'raleway'}}>{item.quote}</div>
                  <div className='authorGrid'>
                    <img className='voting userAvatar' src={`${process.env.REACT_APP_API_URL}/uploads/${item.user.avatar}`} alt="User avatar" width={35} 
                    onPointerMove={e=>{setUserId(item.user.id)}} onClick={handleProceedUser}/>
                    <div style={{fontSize:15, fontFamily:'raleway'}}>{item.user.first_name + ' ' + item.user.last_name}</div>
                  </div>
                </div>
                <div className='m-4'>
                  <Link to={`${routes.EDITQUOTE}/${item.id}`} state={{ data: quoteData }} >
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
                        <Button className="btnRegister col-md-3" style={{borderColor:'#DE8667'}} onClick={e=>{deleteQuote(item.id);togglePopup();toggleSuccess()}}>
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
              ):(
                <div key={index} className="quoteBorder myQuotes mb-5" style={{width:400}} onPointerMove={e=>{quoteData.id = item.id; quoteData.quote = item.quote}}>
                  <div className='m-4'>
                    <img className='voting' src={`/${mostLikedQuotes[index]}`}  alt="Upvote" onClick={()=>upvoteMostLiked(index, item.id)}/>
                    <div style={{fontSize:18, fontFamily:'raleway'}}>{mostLikedQuotesKarma[index]}</div>
                    <img className='voting' src={`/${mostDislikedQuotes[index]}`}  alt="Downvote" onClick={()=>downvoteMostLiked(index, item.id)}/>
                  </div>
                  <div>
                    <div style={{fontSize:18, fontFamily:'raleway'}}>{item.quote}</div>
                    <div className='authorGrid'>
                      <img className='voting userAvatar' src={`${process.env.REACT_APP_API_URL}/uploads/${item.user.avatar}`} alt="User avatar" width={35} 
                      onPointerMove={e=>{setUserId(item.user.id)}} onClick={handleProceedUser}/>
                      <div style={{fontSize:15, fontFamily:'raleway'}}>{item.user.first_name + ' ' + item.user.last_name}</div>
                    </div>
                  </div>
                </div>
              )
            ))}      
          </div>
        ):(
          <div className="quoteBorder mb-5 mx-auto" style={{width:400}}>
            <div className='m-4'>
              <div className='text-center' style={{fontSize:18, fontFamily:'raleway'}}>There are no quotes available.</div>
            </div>
          </div>
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
    </Layout>
  )
}

export default QuotesMostLiked