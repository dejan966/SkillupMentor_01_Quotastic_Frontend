import Layout from '../components/ui/Layout'
import { FC, useState } from 'react'
import { Button } from 'react-bootstrap'
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
  
  const [likes, setLikes] = useState(false)
  const [dislikes, setDislikes] = useState(false)
  
  //most liked quotes
  const [mostLikedQuotes, setMostLikedQuotes] = useState<string[]>([])
  const [mostDislikedQuotes, setMostDislikedQuotes] = useState<string[]>([])
  const [likesQuotes, setLikesQuotes] = useState<boolean[]>([])
  const [dislikesQuotes, setDislikesQuotes] = useState<boolean[]>([])

  //most recent quotes
  const [mostRecentLikedQuotes, setMostRecentLikedQuotes] = useState<string[]>([])
  const [mostRecentDislikedQuotes, setMostRecentDislikedQuotes] = useState<string[]>([])
  const [recentLikesQuotes, setRecentLikesQuotes] = useState<boolean[]>([])
  const [recentDislikesQuotes, setRecentDislikesQuotes] = useState<boolean[]>([])

  const[randomLikedQuote, setRandomLikedQuote] = useState('upvote.png')
  const[randomDislikedQuote, setRandomDislikedQuote] = useState('downvote.png') 

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
            setRandomLikedQuote('upvoted.png')
            setRandomDislikedQuote('downvote.png')
          } else if(data.data.votes[0].value === false){
            setDislikes(true)
            setRandomDislikedQuote('downvoted.png')
            setRandomLikedQuote('upvote.png')
          }
          else if(authStore.user?.id !== data.data.votes[0]?.user.id){
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
        for(let i = 0; i<data.data.length; i++){
          if(authStore.user?.id === data.data[i].votes[0]?.user.id){
            if(data.data[i].votes[0]?.value === true){
              likesQuotes.push(true)
              dislikesQuotes.push(false)
              
              mostLikedQuotes.push('upvoted.png')
              mostDislikedQuotes.push('downvote.png')
            } else if(data.data[i].votes[0]?.value === false){
              likesQuotes.push(false)
              dislikesQuotes.push(true)

              mostLikedQuotes.push('upvote.png')
              mostDislikedQuotes.push('downvoted.png')
            }
            else{
              likesQuotes.push(false)
              dislikesQuotes.push(false)

              mostLikedQuotes.push('upvote.png')
              mostDislikedQuotes.push('downvote.png')
            }
          }
          else if(authStore.user?.id !== data.data[i].votes[0]?.user.id){
            likesQuotes.push(false)
            dislikesQuotes.push(false)

            mostLikedQuotes.push('upvote.png')
            mostDislikedQuotes.push('downvote.png')
          }
        }        
        setMostLikedQuotes(mostLikedQuotes)
        setMostDislikedQuotes(mostDislikedQuotes)

        setLikesQuotes(likesQuotes)
        setDislikesQuotes(dislikesQuotes)
      },
      refetchOnWindowFocus: false,
    },
  )

  const recentQuotes = useQuery(
    ['recentQuotes'],
    () => API.usersMostRecentQuotes(),
    {
      onSuccess(data){
        for(let i = 0; i<data.data.length; i++){
          if(authStore.user?.id === data.data[i].votes[0]?.user.id){
            if(data.data[i].votes[0]?.value === true){
              recentLikesQuotes.push(true)
              recentDislikesQuotes.push(false)

              mostRecentLikedQuotes.push('upvoted.png')
              mostRecentDislikedQuotes.push('downvote.png')
            } else if(data.data[i].votes[0]?.value === false){
              recentLikesQuotes.push(false)
              recentDislikesQuotes.push(true)

              mostRecentLikedQuotes.push('upvote.png')
              mostRecentDislikedQuotes.push('downvoted.png')
            }
            else{
              recentLikesQuotes.push(false)
              recentDislikesQuotes.push(false)

              mostRecentLikedQuotes.push('upvote.png')
              mostRecentDislikedQuotes.push('downvote.png')
            }
          }
          else if(authStore.user?.id !== data.data[i].votes[0]?.user.id){
            recentLikesQuotes.push(false)
            recentDislikesQuotes.push(false)

            mostRecentLikedQuotes.push('upvote.png')
            mostRecentDislikedQuotes.push('downvote.png')
          }
        }
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
  //console.log(likesQuotes[0])

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
      //normal upvote
      setLikes(false)
      setRandomLikedQuote('upvote.png')
      setRandomDislikedQuote('downvote.png')
    }
    else if(likes === false){
      //downvote->upvote
      setLikes(true)
      setRandomLikedQuote('upvoted.png')
      if(dislikes === true){
        setDislikes(false)
        setRandomDislikedQuote('downvote.png')
      }
    }
    handleUpvote(quoteId)
  }

  const downvote = (quoteId:number) =>{
    if(dislikes===true && likes===false){
      //normal downvote
      setDislikes(false)
      setRandomDislikedQuote('downvote.png')
      setRandomLikedQuote('upvote.png')
    }
    else if(dislikes === false){
      //upvote->downvote
      setDislikes(true)
      setRandomDislikedQuote('downvoted.png')
      if(likes === true){
        setLikes(false)
        setRandomLikedQuote('upvote.png')
      }
    }
    handleDownvote(quoteId)
  }

  const upvoteMostLiked = (index:number) =>{
    if(likesQuotes[index] === true && dislikesQuotes[index] === false){
      //normal upvote
      likesQuotes[index] = false
      mostLikedQuotes[index] = 'upvote.png'
    }
    else if(likesQuotes[index] === false){
      //downvote->upvote
      likesQuotes[index] = true
      mostLikedQuotes[index] = 'upvoted.png'
      if(dislikesQuotes[index] === true){
        dislikesQuotes[index] = false
        mostDislikedQuotes[index] = 'downvote.png'
      }
    }
    setLikesQuotes(likesQuotes)
    setMostLikedQuotes(mostLikedQuotes)
    setDislikesQuotes(dislikesQuotes)
    setMostDislikedQuotes(mostDislikedQuotes)
  }

  const downvoteMostLiked = (index:number) =>{
    if(dislikesQuotes[index] === true && likesQuotes[index] === false){
      //normal downvote
      dislikesQuotes[index] = false
      mostDislikedQuotes[index] = 'downvote.png'
      mostLikedQuotes[index] = 'upvote.png'
    }
    else if(dislikesQuotes[index] === false){
      //upvote->downvote
      dislikesQuotes[index] = true
      mostDislikedQuotes[index] = 'downvoted.png'
      if(likesQuotes[index] === true){
        likesQuotes[index] = false
        mostLikedQuotes[index] = 'upvote.png'
      }
    }
    setLikesQuotes(likesQuotes)
    setMostLikedQuotes(mostLikedQuotes)
    setDislikesQuotes(dislikesQuotes)
    setMostDislikedQuotes(mostDislikedQuotes)
  }

  const upvoteMostRecent = (index:number) =>{
    if(recentLikesQuotes[index] === true && recentDislikesQuotes[index] === false){
      //normal upvote
      recentLikesQuotes.splice(index,1,false)
      mostRecentLikedQuotes.splice(index, 1, 'upvote.png')
      mostRecentDislikedQuotes.splice(index, 1, 'downvote.png')
    }
    else if(recentLikesQuotes[index] === false){
      //downvote->upvote
      recentLikesQuotes.splice(index,1,true)
      mostRecentLikedQuotes.splice(index, 1, 'upvoted.png')
      if(recentDislikesQuotes[index] === true){
        recentDislikesQuotes.splice(index,1,false)
        mostRecentDislikedQuotes.splice(index, 1, 'downvote.png')
      }
    }
  }

  const downvoteMostRecent = (index:number) =>{
    if(recentDislikesQuotes[index] === true && recentLikesQuotes[index] === false){
      //normal downvote
      recentDislikesQuotes.splice(index,1,false)
      mostRecentDislikedQuotes.splice(index, 1, 'downvote.png')
      mostRecentLikedQuotes.splice(index, 1, 'upvote.png')
    }
    else if(recentDislikesQuotes[index] === false){
      //upvote->downvote
      recentDislikesQuotes.splice(index,1,true)
      mostRecentDislikedQuotes.splice(index, 1, 'downvoted.png')
      if(recentLikesQuotes[index] === true){
        recentLikesQuotes.splice(index,1,false)
        mostRecentLikedQuotes.splice(index, 1, 'upvote.png')
      }
    }
  }

  return (
    <>
      <Layout>
        {authStore.user ? (
          <>
            <div className='mb-5'>
              <div className='text-center'>
                <h2 className='red'>Quote of the day</h2>
                <p className='quoteText'>Quote of the day is a randomly chosen quote</p>
              </div>
              {randomQuote.data ? (
                <div className='quoteBorder quoteGrid mb-5 mx-auto' style={{width:420}} onPointerMove={e=>{quoteData.id = randomQuote.data.data.id; quoteData.quote = randomQuote.data.data.quote}}>
                  {
                    authStore.user?.id === randomQuote.data.data.user.id ? (
                      <>
                        <div className='m-4'>
                          <img className='voting' src='/upvote.png' alt="Upvote"/>
                          <div style={{fontSize:18, fontFamily:'raleway'}}>{randomQuote.data.data.karma}</div>
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
                                <Button className="btnRegister col-md-3" style={{borderColor:'#DE8667'}} onClick={e=>{toggleSuccess()}}>
                                    Close
                                </Button>
                              </div>
                            </>
                            }/>
                          }
                        </div>
                      </>
                    ) :(
                      <>
                      <div className='m-4'>
                        <img className='voting' src={`/${randomLikedQuote}`} alt="Upvote" onClick={e => {upvote(randomQuote.data.data.id);if(likes===true){randomQuote.data.data.karma--}else{randomQuote.data.data.karma++}}}/>
                        <div style={{fontSize:18, fontFamily:'raleway'}}>{randomQuote.data.data.karma}</div>
                        <img className='voting' src={`/${randomDislikedQuote}`}  alt="Downvote" onClick={e => {downvote(randomQuote.data.data.id);if(dislikes===true){randomQuote.data.data.karma++}else{randomQuote.data.data.karma--}}}/>
                      </div>
                      <div>
                        <div style={{fontSize:18, fontFamily:'raleway'}}>{randomQuote.data.data.quote}</div>
                        <div className='authorGrid'>
                          <img className='voting userAvatar' src={`${process.env.REACT_APP_API_URL}/uploads/${randomQuote.data.data.user.avatar}`} alt="User avatar" width={35} 
                          onPointerMove={e=>{setUserId(randomQuote.data.data.user.id)}} onClick={handleProceedUser}/>
                          <div style={{fontSize:15, fontFamily:'raleway'}}>{randomQuote.data.data.user.first_name + ' ' + randomQuote.data.data.user.last_name}</div>
                        </div>
                      </div>                          
                      </>
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
                    <div key={index} className="quoteBorder quoteGrid mb-5" style={{width:400}} onPointerMove={e=>{quoteData.id = item.id; quoteData.quote = item.quote}}>
                      <div className='m-4'>
                        <img className='voting' src={`/${mostLikedQuotes[index]}`}  alt="Upvote" onClick={()=>upvoteMostLiked(index)}/>
                        <div style={{fontSize:18, fontFamily:'raleway'}}>{item.karma}</div>
                        <img className='voting' src={`/${mostDislikedQuotes[index]}`}  alt="Downvote" onClick={()=>downvoteMostLiked(index)}/>
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
                                <Button className="btnRegister col-md-3" style={{borderColor:'#DE8667'}} onClick={e=>{toggleSuccess()}}>
                                    Close
                                </Button>
                              </div>
                            </>
                            }/>
                          }
                      </div>
                    </div>
                    ):(
                      <div key={index} className="quoteBorder quoteGrid mb-5" style={{width:400}}>
                        <div className='m-4'>
                          <img className='voting' src={`/${mostLikedQuotes[index]}`}  alt="Upvote" onClick={()=>upvoteMostLiked(index)}/>
                          <div style={{fontSize:18, fontFamily:'raleway'}}>{item.karma}</div>
                          <img className='voting' src={`/${mostDislikedQuotes[index]}`}  alt="Downvote" onClick={()=>downvoteMostLiked(index)}/>
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
              <div className='text-center mx-auto'>
                <Button className='btnLogin'>Load more</Button>
              </div>
            </div>
            <div className="mb-5">
              <div className='text-center mx-auto' style={{width:420}}>
                <h2 className='red'>Most recent quotes</h2>
                <p className='quoteText'>Recent quotes update as soon user adds new quote. Go ahed show them that you seen the new quote and like the ones you like.</p>
              </div>
              {recentQuotes.data ? (
                <div className="quoteRow">
                  {recentQuotes.data.data.map((item:QuoteType, index:number) =>(
                    authStore.user?.id === item.user.id ? (
                      <div key={index} className="quoteBorder quoteGrid mb-5" style={{width:400}} onPointerMove={e=>{quoteData.id = item.id; quoteData.quote = item.quote}}>
                        <div className='m-4'>
                          <img className='voting' src={`/${mostRecentLikedQuotes[index]}`} alt="Upvoted" onClick={()=>upvoteMostRecent(index)}/>
                          <div style={{fontSize:18, fontFamily:'raleway'}}>{item.karma}</div>
                          <img className='voting' src={`/${mostRecentDislikedQuotes[index]}`} alt="Downvote" onClick={()=>downvoteMostRecent(index)}/>
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
                                <Button className="btnRegister col-md-3" style={{borderColor:'#DE8667'}} onClick={e=>{toggleSuccess()}}>
                                    Close
                                </Button>
                              </div>
                            </>
                            }/>
                          }
                        </div>
                      </div>
                    ):(
                      <div key={index} className="quoteBorder quoteGrid mb-5" style={{width:400}}>
                        <div className='m-4'>
                          <img className='voting' src={`/${mostRecentLikedQuotes[index]}`} alt="Upvote" onClick={()=>upvoteMostRecent(index)}/>
                            <div style={{fontSize:18, fontFamily:'raleway'}}>{item.karma}</div>
                            <img className='voting' src={`/${mostRecentDislikedQuotes[index]}`} alt="Downvot" onClick={()=>downvoteMostRecent(index)}/>
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
                <Button className='btnLogin'>Load more</Button>
              </div>
            </div>
          </>
        ):(
          <>
            <div className="py-4 grid mb-5 mx-auto">
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
                          <img className='voting userAvatar' src={`${process.env.REACT_APP_API_URL}/uploads/${item.user.avatar}`}alt="User avatar" width={35} 
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
                <Button className='btnLogin' href={routes.LOGIN}>Sign up to see more</Button>
              </div>
            </div>
          </>
        )}
      </Layout>
    </>
  )
}

export default Home