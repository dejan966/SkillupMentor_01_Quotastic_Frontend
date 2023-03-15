import Layout from '../components/ui/Layout'
import { FC, useState } from 'react'
import { Button, Toast, ToastContainer } from 'react-bootstrap'
import { routes } from '../constants/routesConstants'
import authStore from '../stores/auth.store'
import { useQuery } from 'react-query'
import * as API from '../api/Api'
import { QuoteType } from '../models/quote'
import { Link, useNavigate } from 'react-router-dom'
import { StatusCode } from '../constants/errorConstants'
import QuotesDelete from './Me/Myquote/Delete'

const Home: FC = () => {
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)
  
  //most liked quotes
  const [mostLikedQuotes, setMostLikedQuotes] = useState<string[]>([])
  const [mostDislikedQuotes, setMostDislikedQuotes] = useState<string[]>([])
  const [likesQuotes, setLikesQuotes] = useState<boolean[]>([])
  const [dislikesQuotes, setDislikesQuotes] = useState<boolean[]>([])
  const [mostLikedQuotesKarma, setMostLikedQuotesKarma] = useState<number[]>([])
  
  //most recent quotes
  const [mostRecentLikedQuotes, setMostRecentLikedQuotes] = useState<string[]>([])
  const [mostRecentDislikedQuotes, setMostRecentDislikedQuotes] = useState<string[]>([])
  const [recentLikesQuotes, setRecentLikesQuotes] = useState<boolean[]>([])
  const [recentDislikesQuotes, setRecentDislikesQuotes] = useState<boolean[]>([])
  const [mostRecentQuotesKarma, setMostRecentQuotesKarma] = useState<number[]>([])

  //quote of the day
  const[randomLikedQuote, setRandomLikedQuote] = useState('upvote.png')
  const[randomDislikedQuote, setRandomDislikedQuote] = useState('downvote.png') 
  const [randomQuoteKarma, setRandomQuoteKarma] = useState(1)
  const [likes, setLikes] = useState(false)
  const [dislikes, setDislikes] = useState(false)

  const [userId, setUserId] = useState(1)
  const [quoteData, setQuoteData] = useState({ id: 1, quote:''}) 
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false)
  const [successDelete, setSuccessDelete] = useState(false)
 
  const togglePopup = () => {
    setIsOpen(!isOpen)
  }
  
  const toggleSuccess = () => {
    setSuccessDelete(!successDelete)
  }
  
  const randomQuote = useQuery(
    ['randomQuote'],
    () => API.fetchRandomQuote(),
    {
      onSuccess(data){
        if(authStore.user?.id === data.data.votes[0]?.user.id){
          if(data.data.votes[0].value === true){
            setLikes(true)
            setRandomQuoteKarma(data.data.karma)
            setRandomLikedQuote('upvoted.png')
            setRandomDislikedQuote('downvote.png')
          } else if(data.data.votes[0].value === false){
            setDislikes(true)
            setRandomQuoteKarma(data.data.karma)
            setRandomDislikedQuote('downvoted.png')
            setRandomLikedQuote('upvote.png')
          }
          else if(authStore.user?.id !== data.data.votes[0]?.user.id){
            setRandomQuoteKarma(data.data.karma)
            setRandomLikedQuote('upvote.png')
            setRandomDislikedQuote('downvote.png')
          }
        }
      },
      refetchOnWindowFocus: false,
    },
  )

  const mostLiked = useQuery(
    ['quote'],
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

  const recentQuotes = useQuery(
    ['recentQuotes'],
    () => API.usersMostRecentQuotes(),
    {
      onSuccess(data){
        if(data.data[0].votes[0]){
          if(data.data[0].votes[0].value === true){
            mostRecentLikedQuotes.push('upvoted.png') 
            setMostRecentLikedQuotes(mostRecentLikedQuotes)
            mostRecentDislikedQuotes.push('downvote.png')
            setMostRecentDislikedQuotes(mostRecentDislikedQuotes)
            recentLikesQuotes.push(true)
            setRecentLikesQuotes(recentLikesQuotes)
            recentDislikesQuotes.push(false)
            setRecentDislikesQuotes(recentDislikesQuotes)
            mostRecentQuotesKarma.push(data.data[0].karma)
            setMostRecentQuotesKarma(mostRecentQuotesKarma)
          }
          else if(data.data[0].votes[0].value === false){
            mostRecentLikedQuotes.push('upvote.png') 
            setMostRecentLikedQuotes(mostRecentLikedQuotes)
            mostRecentDislikedQuotes.push('downvoted.png')
            setMostRecentDislikedQuotes(mostRecentDislikedQuotes)
            recentLikesQuotes.push(false)
            setRecentLikesQuotes(recentLikesQuotes)
            recentDislikesQuotes.push(true)
            setRecentDislikesQuotes(recentDislikesQuotes)
            mostRecentQuotesKarma.push(data.data[0].karma)
            setMostRecentQuotesKarma(mostRecentQuotesKarma)
          }
        }
        else{
          mostRecentLikedQuotes.push('upvote.png') 
          setMostRecentLikedQuotes(mostRecentLikedQuotes)
          mostRecentDislikedQuotes.push('downvote.png')
          setMostRecentDislikedQuotes(mostRecentDislikedQuotes)
          recentLikesQuotes.push(false)
          setRecentLikesQuotes(recentLikesQuotes)
          recentDislikesQuotes.push(false)
          setRecentDislikesQuotes(recentDislikesQuotes)
          mostRecentQuotesKarma.push(data.data[0].karma)
          setMostRecentQuotesKarma(mostRecentQuotesKarma)
        }
        for(let i = 1; i<data.data.length; i++){
          if(authStore.user?.id === data.data[i].votes[0]?.user.id){
            if(data.data[i].votes[0]?.value === true){
              recentLikesQuotes.push(true)
              recentDislikesQuotes.push(false)

              mostRecentLikedQuotes.push('upvoted.png')
              mostRecentDislikedQuotes.push('downvote.png')
              mostRecentQuotesKarma.push(data.data[i].karma)
            } else if(data.data[i].votes[0]?.value === false){
              recentLikesQuotes.push(false)
              recentDislikesQuotes.push(true)

              mostRecentLikedQuotes.push('upvote.png')
              mostRecentDislikedQuotes.push('downvoted.png')
              mostRecentQuotesKarma.push(data.data[i].karma)
            }
            else{
              recentLikesQuotes.push(false)
              recentDislikesQuotes.push(false)

              mostRecentLikedQuotes.push('upvote.png')
              mostRecentDislikedQuotes.push('downvote.png')
              mostRecentQuotesKarma.push(data.data[i].karma)
            }
          }
          else if(authStore.user?.id !== data.data[i].votes[0]?.user.id){
            recentLikesQuotes.push(false)
            recentDislikesQuotes.push(false)

            mostRecentLikedQuotes.push('upvote.png')
            mostRecentDislikedQuotes.push('downvote.png')
            mostRecentQuotesKarma.push(data.data[i].karma)
          }
        }
        setRecentLikesQuotes(recentLikesQuotes)
        setRecentDislikesQuotes(recentDislikesQuotes)
        
        setMostRecentLikedQuotes(mostRecentLikedQuotes)
        setMostRecentDislikedQuotes(mostRecentDislikedQuotes)

        setMostRecentQuotesKarma(mostRecentQuotesKarma)
      },
      refetchOnWindowFocus: false,
    },
  )

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

  const upvote = (quoteId:number) =>{
    if(likes === true && dislikes === false){
      setLikes(false)
      setRandomLikedQuote('upvote.png')
      setRandomDislikedQuote('downvote.png')
      let karma = randomQuoteKarma
      karma--
      setRandomQuoteKarma(karma)
      handleUpvote(quoteId)
      return
    }
    else if(likes === false){
      let karma = randomQuoteKarma
      setLikes(true)
      if(dislikes === true){
        setDislikes(false)
        karma+=2
        setRandomQuoteKarma(karma)
        setRandomDislikedQuote('downvote.png')
        setRandomLikedQuote('upvoted.png')
        return
      }
      setRandomLikedQuote('upvoted.png')
      karma++
      setRandomQuoteKarma(karma)
      handleUpvote(quoteId)
      return
    }
  }

  const downvote = (quoteId:number) =>{
    if(dislikes===true){
      setDislikes(false)
      setRandomDislikedQuote('downvote.png')
      setRandomLikedQuote('upvote.png')
      let karma = randomQuoteKarma
      karma++
      setRandomQuoteKarma(karma)
      handleDownvote(quoteId)
      return
    }
    else if(dislikes === false){
      setDislikes(true)
      let karma = randomQuoteKarma
      if(likes === true){
        setLikes(false)
        setRandomLikedQuote('upvote.png')
        setRandomDislikedQuote('downvoted.png')
        karma-=2
        setRandomQuoteKarma(karma)
        handleDownvote(quoteId)
        return
      }
      karma--
      setRandomQuoteKarma(karma)
      setRandomDislikedQuote('downvoted.png')
      handleDownvote(quoteId)
      return
    }
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

  const upvoteMostRecent = (index:number, quoteId:number) =>{
    const recentLikesQuotesCopy = {...recentLikesQuotes}
    const recentDislikesQuotesCopy = {...recentDislikesQuotes}
    if(recentLikesQuotes[index] === true){
      mostRecentLikedQuotes[index] = 'upvote.png'
      recentLikesQuotesCopy[index] = false
      mostRecentQuotesKarma[index]--
      setRecentLikesQuotes(recentLikesQuotesCopy)
      setMostRecentLikedQuotes(mostRecentLikedQuotes)
      setMostRecentQuotesKarma(mostRecentQuotesKarma)
      handleUpvote(quoteId)
      return
    }
    else if(recentLikesQuotes[index] === false){
      recentLikesQuotesCopy[index] = true
      if(recentDislikesQuotes[index] === true){
        recentDislikesQuotesCopy[index]=false
        mostRecentLikedQuotes[index] = 'upvoted.png'
        mostRecentQuotesKarma[index]+=2
        setMostRecentQuotesKarma(mostRecentQuotesKarma)
        setRecentDislikesQuotes(recentDislikesQuotesCopy)
        setMostRecentLikedQuotes(mostRecentLikedQuotes)
        mostRecentDislikedQuotes[index] = 'downvote.png'
        setMostRecentDislikedQuotes(mostRecentDislikedQuotes)
        handleUpvote(quoteId)
        return
      }
      mostRecentLikedQuotes[index] = 'upvoted.png'
      mostRecentQuotesKarma[index]++
      setRecentLikesQuotes(recentLikesQuotesCopy)
      setMostRecentLikedQuotes(mostRecentLikedQuotes)
      setMostRecentQuotesKarma(mostRecentQuotesKarma)
      handleUpvote(quoteId)
      return
    }
  }

  const downvoteMostRecent = (index:number, quoteId:number) =>{
    const recentLikesQuotesCopy = {...recentLikesQuotes}
    const recentDislikesQuotesCopy = {...recentDislikesQuotes}
    if(recentDislikesQuotes[index] === true){
      recentDislikesQuotesCopy[index] = false
      mostRecentDislikedQuotes[index] = 'downvote.png'
      mostRecentQuotesKarma[index]++
      setRecentDislikesQuotes(recentDislikesQuotesCopy)
      setMostRecentDislikedQuotes(mostRecentDislikedQuotes)
      setMostRecentQuotesKarma(mostRecentQuotesKarma)
      handleDownvote(quoteId)
      return
    }
    else if(recentDislikesQuotes[index] === false){
      recentDislikesQuotesCopy[index] = true
      if(recentLikesQuotes[index] === true){
        recentLikesQuotesCopy[index] = false
        mostRecentDislikedQuotes[index] = 'downvoted.png'
        mostRecentLikedQuotes[index] = 'upvote.png'
        mostRecentQuotesKarma[index]-=2
        setRecentLikesQuotes(recentLikesQuotesCopy)
        setMostRecentLikedQuotes(mostRecentLikedQuotes)
        setMostRecentQuotesKarma(mostRecentQuotesKarma)
        setMostRecentDislikedQuotes(mostRecentDislikedQuotes)
        setRecentDislikesQuotes(recentDislikesQuotesCopy)
        handleDownvote(quoteId)
        return
      }
      mostRecentDislikedQuotes[index] = 'downvoted.png'
      setRecentDislikesQuotes(recentDislikesQuotesCopy)
      mostRecentQuotesKarma[index]--
      setMostRecentQuotesKarma(mostRecentQuotesKarma)
      handleDownvote(quoteId)
      return
    }
  }

  return (
    <Layout>
      {authStore.user ? (
        <>
          <div className='mb-5'>
            <div className='text-center'>
              <h2 className='red'>Quote of the day</h2>
              <p className='quoteText'>Quote of the day is a randomly chosen quote</p>
            </div>
            {randomQuote.data ? (
              <div>
                {authStore.user?.id === randomQuote.data.data.user.id ? (
                  <div className='quoteBorder myQuotes mx-auto mb-5' style={{width:420}} onPointerMove={e=>{quoteData.id = randomQuote.data.data.id; quoteData.quote = randomQuote.data.data.quote}}>
                    <div className='m-4'>
                      <img className='voting' src='/upvote.png' alt="Upvote"/>
                      <div style={{fontSize:18, fontFamily:'raleway'}}>{randomQuoteKarma}</div>
                      <img className='voting' src='/downvote.png' alt="Downvote"/>
                    </div>
                    <div>
                      <div style={{fontSize:18, fontFamily:'raleway'}}>{randomQuote.data.data.quote}</div>
                      <div className='authorGrid'>
                        <img className='voting userAvatar' src={`${process.env.REACT_APP_API_URL}/uploads/${randomQuote.data.data.user.avatar}`} alt="User avatar" width={35} 
                        onPointerMove={e=>{setUserId(randomQuote.data.data.user.id)}} onClick={handleProceedUser}/>
                        <div style={{fontSize:15, fontFamily:'raleway'}}>{randomQuote.data.data.user.first_name + ' ' + randomQuote.data.data.user.last_name}</div>
                      </div>
                    </div>
                    <div className='m-4'>
                      <Link to={`${routes.EDITQUOTE}/${randomQuote.data.data.id}`} state={{ data: quoteData }} >
                        <img src="/settings.png" alt="Settings" />
                      </Link>
                      <div style={{color:'#fff'}}>s</div>
                      <img className='voting' src="/delete.png" alt="Delete" onClick={()=>togglePopup()} />
                      {
                        isOpen && <QuotesDelete
                        content={
                        <>
                          <h1 className="text display-6 mb-4">Are you sure?</h1>
                          <p className='text'>The quote will be deleted. There is no undo of this action.</p>
                          <div className="d-flex justify-content-start">
                            <Button className="btnRegister col-md-3" style={{borderColor:'#DE8667'}} onClick={e=>{deleteQuote(randomQuote.data.data.user.id);togglePopup();toggleSuccess()}}>
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
                          <p className='text'>Your <span style={{color:'#DE8667'}}>quote</span> was deleted.</p>
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
                  ) :(
                    <div className='quoteBorder quoteGrid mx-auto mb-5' style={{width:420}}>
                      <div className='m-4'>
                        <img className='voting' src={`/${randomLikedQuote}`} alt="Upvote" onClick={e => {upvote(randomQuote.data.data.id)}}/>
                        <div style={{fontSize:18, fontFamily:'raleway'}}>{randomQuoteKarma}</div>
                        <img className='voting' src={`/${randomDislikedQuote}`}  alt="Downvote" onClick={e => {downvote(randomQuote.data.data.id)}}/>
                      </div>
                      <div>
                        <div style={{fontSize:18, fontFamily:'raleway'}}>{randomQuote.data.data.quote}</div>
                        <div className='authorGrid'>
                          <img className='voting userAvatar' src={`${process.env.REACT_APP_API_URL}/uploads/${randomQuote.data.data.user.avatar}`} alt="User avatar" width={35} 
                          onPointerMove={e=>{setUserId(randomQuote.data.data.user.id)}} onClick={handleProceedUser}/>
                          <div style={{fontSize:15, fontFamily:'raleway'}}>{randomQuote.data.data.user.first_name + ' ' + randomQuote.data.data.user.last_name}</div>
                        </div>
                      </div>                          
                    </div>
                  )
                }
              </div>
            ):(
              <div className="quoteBorder mb-5 mx-auto" style={{width:400}}>
                <div className='m-4'>
                  <div className='text-center' style={{fontSize:18, fontFamily:'raleway'}}>There are no quotes available.</div>
                </div>
              </div>
            )}
          </div>
          <div className='mb-5'>
            <div className='text-center mx-auto' style={{width:420}}>
              <h2 className='red'>Most upvoted quotes</h2>
              <p className='quoteText'>Most upvoted quotes on the platform. Give a like to the ones you like to keep them saved in your profile.</p>
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
                    <div key={index} className="quoteBorder quoteGrid mb-5" style={{width:400}} onPointerMove={e=>{quoteData.id = item.id; quoteData.quote = item.quote}}>
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
            <div className='text-center'>
              <Button href={routes.MOSTLIKEDQUOTES} className='btnLogin'>Load more</Button>
            </div>
          </div>
          <div className="mb-4">
            <div className='text-center mx-auto' style={{width:420}}>
              <h2 className='red'>Most recent quotes</h2>
              <p className='quoteText'>Recent quotes update as soon user adds new quote. Go ahed show them that you seen the new quote and like the ones you like.</p>
            </div>
            {recentQuotes.data ? (
              <div className="quoteRow">
                {recentQuotes.data.data.map((item:QuoteType, index:number) =>(
                  authStore.user?.id === item.user.id ? (
                    <div key={index} className="quoteBorder myQuotes mb-5" style={{width:400}} onPointerMove={e=>{quoteData.id = item.id; quoteData.quote = item.quote}}>
                      <div className='m-4'>
                        <img className='voting' src={`/${mostRecentLikedQuotes[index]}`} alt="Upvoted"/>
                        <div style={{fontSize:18, fontFamily:'raleway'}}>{item.karma}</div>
                        <img className='voting' src={`/${mostRecentDislikedQuotes[index]}`} alt="Downvote"/>
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
                          <img className='voting' src="/settings.png" alt="Settings" />
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
                    <div key={index} className="quoteBorder quoteGrid mb-5" style={{width:400}} onPointerMove={e=>{quoteData.id = item.id; quoteData.quote = item.quote}}>
                      <div className='m-4'>
                        <img className='voting' src={`/${mostRecentLikedQuotes[index]}`} alt="Upvote" onClick={()=>upvoteMostRecent(index, item.id)}/>
                          <div style={{fontSize:18, fontFamily:'raleway'}}>{mostRecentQuotesKarma[index]}</div>
                          <img className='voting' src={`/${mostRecentDislikedQuotes[index]}`} alt="Downvote" onClick={()=>downvoteMostRecent(index, item.id)}/>
                      </div>
                      <div>
                        <div style={{fontSize:18, fontFamily:'raleway'}}>{item.quote}</div>
                        <div className='authorGrid'>
                          <img className='voting userAvatar' src={`${process.env.REACT_APP_API_URL}/uploads/${item.user.avatar}`} alt="User avatar" width={35} 
                          onPointerMove={e=>{setUserId(item.user.id)}} onClick={handleProceedUser} />
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
            <div className='mb-5 text-center mx-auto'>
              <Button href={routes.MOSTRECENTQUOTES} className='btnLogin'>Load more</Button>
            </div>
          </div>
        </>
      ):(
        <>
          <div className="py-4 grid mb-5 text-center">
            <div className="text-start">
              <div className="text">
                <h1 className="display-1">Welcome to <span style={{color:'#DE8667'}}>Quotastic</span></h1>
                <p className="col-md-8 fs-4">
                  Quotastic is a free online tool for you to explore the quips, quotes and proverbs.
                  Sign up and express yourself. 
                </p>
                <p className="fs-4">
                  <Button className="btnRegister" href={routes.SIGNUP}>
                    Sign up
                  </Button>
                </p>
              </div>
            </div>
            <div><img src="example_quote.png" width={456} alt="example quote" /></div>
          </div>
          <div className='text-center mx-auto mb-5' style={{width:400}}>
            <h1 className='display-6'>Explore the world of <span style={{color:'#DE8667'}}>fantastic quotes</span></h1>
          </div>
          <div className='mb-5'>
            <div className='text-center mx-auto' style={{width:420}}>
              <h2 className='red'>Most upvoted quotes</h2>
              <p className='quoteText'>Most upvoted quotes on the platform. Sign up or login to like the quotes and keep them saved in your profile.</p>
            </div>
            {mostLiked.data ? (
              <div className='mb-5 quoteRow'>
                {mostLiked.data.data.map((item:QuoteType, index:number) => (
                  <div key={index} className="quoteBorder quoteGrid mb-5" style={{width:400}}>
                    <div className='m-4'>
                      <Link to={routes.LOGIN}>
                        <img className='voting' src="upvote.png" alt="Upvote" />
                      </Link>
                      <div style={{fontSize:18, fontFamily:'raleway'}}>{item.karma}</div>
                      <Link to={routes.LOGIN}>
                        <img className='voting' src="downvote.png" alt="Downvote" />
                      </Link>
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
                ))}
              </div>
            ):(
              <div className="quoteBorder mb-5 mx-auto" style={{width:400}}>
                <div className='m-4'>
                  <div className='text-center' style={{fontSize:18, fontFamily:'raleway'}}>There are no quotes available.</div>
                </div>
              </div>
            )}
            <div className='mb-5 text-center mx-auto text'>
              <a href={routes.LOGIN}>
                <Button className='btnSeeMore'>Sign up to see more</Button>
              </a>
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
      )}
    </Layout>
  )
}

export default Home