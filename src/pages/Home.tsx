import Layout from '../components/ui/Layout'
import { FC, useState } from 'react'
import { Button } from 'react-bootstrap'
import { routes } from '../constants/routesConstants'
import authStore from '../stores/auth.store'
import { useQuery } from 'react-query'
import * as API from '../api/Api'
import { QuoteType } from '../models/quote'
import { Link, useNavigate } from 'react-router-dom'

const Home: FC = () => {
  const [likes, setLikes] = useState(false)
  const [dislikes, setDislikes] = useState(false)
  

  //most liked quotes
/*   let likedQuotesM = new Array(1)
  let dislikedQuotesM = new Array(1)
  let likesM = new Array(1)
  let dislikesM = new Array(1) */

  const [mostLikedQuotes, setMostLikedQuotes] = useState<string[]>([])
  const [mostDislikedQuotes, setMostDislikedQuotes] = useState<string[]>([])
  const [likesQuotes, setLikesQuotes] = useState<boolean[]>([])
  const [dislikesQuotes, setDislikesQuotes] = useState<boolean[]>([])

  //most recent quotes
/*   let likedQuotesR = new Array(1)
  let dislikedQuotesR = new Array(1)
  let likesR = new Array(1)
  let dislikesR = new Array(1) */

  const [mostRecentLikedQuotes, setMostRecentLikedQuotes] = useState<string[]>([])
  const [mostRecentDislikedQuotes, setMostRecentDislikedQuotes] = useState<string[]>([])
  const [recentLikesQuotes, setRecentLikesQuotes] = useState<boolean[]>([])
  const [recentDislikesQuotes, setRecentDislikesQuotes] = useState<boolean[]>([])

  const[randomLikedQuote, setRandomLikedQuote] = useState('')
  const[randomDislikedQuote, setRandomDislikedQuote] = useState('') 

  const [userId, setUserId] = useState(1)
  const [quoteData, setQuoteData] = useState({ id: 1, quote:''}) 
  const navigate = useNavigate()
  

  const mostLiked = useQuery(
    ['quote'],
    () => API.fetchQuotes(),
    {
      onSuccess(data){
/*         const length = data.data.length
        likedQuotesM = new Array(8)
        dislikedQuotesM = new Array(length)
        likesM = new Array(length)
        dislikesM = new Array(length) */

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
          else{
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
  
  const randomQuote = useQuery(
    ['randomQuote'],
    () => API.fetchRandomQuote(),
    {
      onSuccess(data){
        if(authStore.user?.id === data.data.votes[0].user.id){
          if(data.data.votes[0].value === true){
            setRandomLikedQuote('upvoted.png')
            setRandomDislikedQuote('downvote.png')
          } else if(data.data.votes[0].value === false){
            setRandomDislikedQuote('downvoted.png')
            setRandomLikedQuote('upvote.png')
          }
          else{
            setRandomLikedQuote('upvote.png')
            setRandomDislikedQuote('downvote.png')
          }
        }
        else{
          setRandomLikedQuote('upvote.png')
          setRandomDislikedQuote('downvote.png')
        }
      },
      refetchOnWindowFocus: false,
    },
  )

  const recentQuotes = useQuery(
    ['recentQuotes'],
    () => API.usersMostRecentQuotes(),
    {
      onSuccess(data){
/*         likedQuotesR = new Array(data.data.length)
        dislikedQuotesR = new Array(data.data.length)
        likesR = new Array(data.data.length)
        dislikesR = new Array(data.data.length) */

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
          else{
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

  //console.log(mostLikedQuotes)
/*   console.log(mostDislikedQuotes)
  console.log(likesQuotes)
  console.log(dislikesQuotes) */

  const handleProceedUser = () => {
    if(userId === authStore.user?.id){
      navigate('me/quotes')
      return
    }
    navigate(`users/${userId}/quotes`)
  }

  const upvote = () =>{
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
  }

  const downvote = () =>{
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
  }

  const upvoteMostLiked = (index:number) =>{
    if(likesQuotes[index] === true && dislikesQuotes[index] === false){
      //normal upvote
      likesQuotes.splice(index,1,false)
      mostLikedQuotes.splice(index, 1, 'upvote.png')
      mostDislikedQuotes.splice(index, 1, 'downvote.png')
    }
    else if(likesQuotes[index] === false){
      //downvote->upvote
      likesQuotes.splice(index,1,true)
      mostLikedQuotes.splice(index, 1, 'upvoted.png')
      if(dislikesQuotes[index] === true){
        dislikesQuotes.splice(index,1,false)
        mostDislikedQuotes.splice(index, 1, 'downvote.png')
      }
    }
  }

  const downvoteMostLiked = (index:number) =>{
    if(dislikesQuotes[index] === true && likesQuotes[index] === false){
      //normal downvote
      dislikesQuotes.splice(index,1,false)
      mostDislikedQuotes.splice(index, 1, 'downvote.png')
      mostLikedQuotes.splice(index, 1, 'upvote.png')
    }
    else if(dislikesQuotes[index] === false){
      //upvote->downvote
      dislikesQuotes.splice(index,1,true)
      mostDislikedQuotes.splice(index, 1, 'downvoted.png')
      if(likesQuotes[index] === true){
        likesQuotes.splice(index,1,false)
        mostLikedQuotes.splice(index, 1, 'upvote.png')
      }
    }
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
                <div className='quoteBorder quoteGrid mb-5 mx-auto' style={{width:420}}>
                  <div className='m-4'>
                    <img className='voting' src={`/${randomLikedQuote}`} alt="Upvote" onClick={upvote}/>
                    <div style={{fontSize:18, fontFamily:'raleway'}}>{randomQuote.data.data.karma}</div>
                    <img className='voting' src={`/${randomDislikedQuote}`}  alt="Downvote" onClick={downvote} />
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
                    <div key={index} className="quoteBorder quoteGrid mb-5" style={{width:400}}>
                      <div className='m-4'>
                        <img className='voting' src={`/${mostLikedQuotes[index]}`}  alt="Upvote" onClick={upvote}/>
                        <div style={{fontSize:18, fontFamily:'raleway'}}>{item.karma}</div>
                        <img className='voting' src={`/${mostDislikedQuotes[index]}`}  alt="Downvote" onClick={downvote}/>
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
                        <img src="/settings.png" alt="Settings" />
                        <div></div>
                        <img src="/delete.png" alt="Delete" />
                      </div>
                    </div>
                    ):(
                      <div key={index} className="quoteBorder quoteGrid mb-5" style={{width:400}}>
                        <div className='m-4'>
                          <img className='voting' src={`/${mostLikedQuotes[index]}`}  alt="Upvote" onClick={upvote}/>
                          <div style={{fontSize:18, fontFamily:'raleway'}}>{item.karma}</div>
                          <img className='voting' src={`/${mostDislikedQuotes[index]}`}  alt="Downvote" onClick={downvote}/>
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
                      <div key={index} className="quoteBorder quoteGrid mb-5" style={{width:400}}>
                        <div className='m-4'>
                          <img className='voting' src={`/${mostRecentLikedQuotes[index]}`} alt="Upvoted" onClick={upvote}/>
                          <div style={{fontSize:18, fontFamily:'raleway'}}>{item.karma}</div>
                          <img className='voting' src={`/${mostRecentDislikedQuotes[index]}`} alt="Downvote" onClick={downvote}/>
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
                          <img src="/settings.png" alt="Settings" />
                          <div></div>
                          <img src="/delete.png" alt="Delete" />
                        </div>
                      </div>
                    ):(
                      <div key={index} className="quoteBorder quoteGrid mb-5" style={{width:400}}>
                        <div className='m-4'>
                          <img className='voting' src={`/${mostRecentLikedQuotes[index]}`} alt="Upvote" onClick={upvote}/>
                            <div style={{fontSize:18, fontFamily:'raleway'}}>{item.karma}</div>
                            <img className='voting' src={`/${mostRecentDislikedQuotes[index]}`} alt="Downvot" onClick={downvote}/>
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