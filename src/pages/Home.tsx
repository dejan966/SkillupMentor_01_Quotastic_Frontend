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
  const [dislikes, setDisikes] = useState(false)
  const[likedQuotes, setLikedQuotes] = useState('')
  const[dislikedQuotes, setDislikedQuotes] = useState('') 

  const [userId, setUserId] = useState(1)
  //const [quoteId, setQuoteId] = useState(8)//new_quote
  const [quoteData, setQuoteData] = useState({ id: 1, quote:''}) 
  const navigate = useNavigate()
  

  const mostLiked = useQuery(
    ['quote'],
    () => API.fetchQuotes(),
    {
      refetchOnWindowFocus: false,
    },
  )
  
  const randomQuote = useQuery(
    ['randomQuote'],
    () => API.fetchRandomQuote(),
    {
      refetchOnWindowFocus: false,
    },
  )

  const recentQuotes = useQuery(
    ['recentQuotes'],
    () => API.usersMostRecentQuotes(),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  )

  const handleProceedUser = () => {
    if(userId === authStore.user?.id){
      navigate('me/quotes')
      return
    }
    navigate(`users/${userId}/quotes`)
  }

  const voting = () =>{
    if(likes === true){
      setLikedQuotes('upvoted.png')
    } else {
      setLikedQuotes('upvote.png')
    }

    if(dislikes === true){
      setDislikedQuotes('downvoted.png')
    } else{
      setDislikedQuotes('downvote.png')
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
                authStore.user?.id === randomQuote.data.data.votes.user?.id ?(
                  (randomQuote.data.data.votes.value === true ? (
                    <div className='quoteBorder quoteGrid mb-5 mx-auto' style={{width:420}}>
                      <div className='m-4'>
                        <img className='voting' src="/upvoted.png" alt="Upvoted" />
                        <div style={{fontSize:18, fontFamily:'raleway'}}>{randomQuote.data.data.karma}</div>
                        <img className='voting' src="/downvote.png" alt="Downvote" />
                      </div>
                      <div>
                        <div style={{fontSize:18, fontFamily:'raleway'}}>{randomQuote.data.data.quote}</div>
                        <div className='authorGrid'>
                          <img className='voting' src={`${process.env.REACT_APP_API_URL}/uploads/${randomQuote.data.data.user.avatar}`} alt="User avatar" width={35} 
                          onPointerMove={e=>{setUserId(randomQuote.data.data.user.id)}} onClick={handleProceedUser}/>
                          <div style={{fontSize:15, fontFamily:'raleway'}}>{randomQuote.data.data.user.first_name + ' ' + randomQuote.data.data.user.last_name}</div>
                        </div>
                      </div>
                    </div>
                  ):(
                    <div className='quoteBorder quoteGrid mb-5 mx-auto' style={{width:420}}>
                      <div className='m-4'>
                        <img className='voting' src="/upvote.png" alt="Upvote" />
                        <div style={{fontSize:18, fontFamily:'raleway'}}>{randomQuote.data.data.karma}</div>
                        <img className='voting' src="/downvoted.png" alt="Downvoted" />
                      </div>
                      <div>
                        <div style={{fontSize:18, fontFamily:'raleway'}}>{randomQuote.data.data.quote}</div>
                        <div className='authorGrid'>
                          <img className='voting' src={randomQuote.data.data.user.avatar} alt="User avatar" width={35} 
                          onPointerMove={e=>{setUserId(randomQuote.data.data.user.id)}} onClick={handleProceedUser}/>
                          <div style={{fontSize:15, fontFamily:'raleway'}}>{randomQuote.data.data.user.first_name + ' ' + randomQuote.data.data.user.last_name}</div>
                        </div>
                      </div>
                    </div>
                  )
                )
                ):(
                  <div className='quoteBorder quoteGrid mb-5 mx-auto' style={{width:420}}>
                  <div className='m-4'>
                      <img className='voting' src="/upvote.png" alt="Upvote" />
                      <div style={{fontSize:18, fontFamily:'raleway'}}>{randomQuote.data.data.karma}</div>
                      <img className='voting' src="/downvote.png" alt="Downvote" />
                    </div>
                    <div>
                      <div style={{fontSize:18, fontFamily:'raleway'}}>{randomQuote.data.data.quote}</div>
                      <div className='authorGrid'>
                        <img className='voting' src={`${process.env.REACT_APP_API_URL}/uploads/${randomQuote.data.data.user.avatar}`} alt="User avatar" width={35} 
                        onPointerMove={e=>{setUserId(randomQuote.data.data.user.id)}} onClick={handleProceedUser}/>
                        <div style={{fontSize:15, fontFamily:'raleway'}}>{randomQuote.data.data.user.first_name + ' ' + randomQuote.data.data.user.last_name}</div>
                      </div>
                    </div>
                  </div>
                )
              ):(
                <div className='text-center text'>No quote of the day available</div>
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
                    authStore.user?.id === item.votes.user?.id ?
                    (
                      item.votes.value === true ? (
                        <div key={index} className="quoteBorder quoteGrid mb-5" style={{width:400}} onPointerMove={e=>{setLikes(true)}}>
                          <div className='m-4'>
                            <img className='voting' src={'/upvoted.png'} alt="Upvoted" onClick={voting}/>
                            <div style={{fontSize:18, fontFamily:'raleway'}}>{item.karma}</div>
                            <img className='voting' src={'/downvote.png'} alt="Downvote" onClick={voting}/>
                          </div>
                          <div>
                            <div style={{fontSize:18, fontFamily:'raleway'}}>{item.quote}</div>
                            <div className='authorGrid'>
                              <img className='voting' src={item.user.avatar} alt="User avatar" width={35} 
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
                        <div key={index} className="quoteBorder quoteGrid quoteRow mb-5" style={{width:400}} onPointerMove={e=>{setLikes(false)}}>
                          <div className='m-4'>
                            <img className='voting' src="/upvote.png" alt="Upvote" />
                            <div style={{fontSize:18, fontFamily:'raleway'}}>{item.karma}</div>
                            <img className='voting' src="/downvoted.png" alt="Downvoted" />
                          </div>
                          <div>
                            <div style={{fontSize:18, fontFamily:'raleway'}}>{item.quote}</div>
                              <div className='authorGrid'>
                              <img className='voting' src={`${process.env.REACT_APP_API_URL}/uploads/${item.user.avatar}`}alt="User avatar" width={35} onPointerMove={e=>{setUserId(item.user.id)}} onClick={handleProceedUser}/>
                              <div style={{fontSize:15, fontFamily:'raleway'}}>{item.user.first_name + ' ' + item.user.last_name}</div>
                            </div>
                          </div>
                          <div className='m-4'>
                            <img src="/settings.png" alt="Settings" />
                            <div></div>
                            <img src="/delete.png" alt="Delete" />
                          </div>
                        </div>
                      )
                    ):(
                      <div key={index} className="quoteBorder quoteGrid mb-5" style={{width:400}} onPointerMove={e=>{quoteData.id = item.id; quoteData.quote = item.quote}}>
                        <div className='m-4'>
                          <img className='voting' src="upvote.png" alt="Upvote" />
                          <div style={{fontSize:18, fontFamily:'raleway'}}>{item.karma}</div>
                          <img className='voting' src="downvote.png" alt="Downvote" />
                        </div>
                        <div>
                          <div style={{fontSize:18, fontFamily:'raleway'}}>{item.quote}</div>
                          <div className='authorGrid'>
                            <img className='voting' src={`${process.env.REACT_APP_API_URL}/uploads/${item.user.avatar}`} alt="User avatar" width={35} 
                            onPointerMove={e=>{setUserId(item.user.id)}} onClick={handleProceedUser}/>
                            <div style={{fontSize:15, fontFamily:'raleway'}}>{item.user.first_name + ' ' + item.user.last_name}</div>
                          </div>
                        </div>
                        <div className='m-4'>
                          <Link to={`${routes.EDITQUOTE}/${item.id}`} state={{ data: quoteData }} >
                            <img src="/settings.png" alt="Settings" />
                          </Link>
                          <div></div>
                          <img src="/delete.png" alt="Delete" />
                        </div>
                      </div>
                    )
                  ))}      
                </div>
              ):(
                <h1 className='text-center'>There are no quotes available</h1>
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
                    authStore.user?.id === item.votes.user?.id ?
                    (
                      item.votes.value === true ? (
                        <div key={index} className="quoteBorder quoteGrid mb-5" style={{width:400}}>
                          <div className='m-4'>
                            <img className='voting' src="/upvoted.png" alt="Upvoted" />
                            <div style={{fontSize:18, fontFamily:'raleway'}}>{item.karma}</div>
                            <img className='voting' src="/downvote.png" alt="Downvote" />
                          </div>
                          <div>
                            <div style={{fontSize:18, fontFamily:'raleway'}}>{item.quote}</div>
                            <div className='authorGrid'>
                              <img className='voting' src={`${process.env.REACT_APP_API_URL}/uploads/${item.user.avatar}`} alt="User avatar" width={35} 
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
                        <div key={index} className="quoteBorder quoteGrid quoteRow mb-5" style={{width:400}}>
                          <div className='m-4'>
                            <img className='voting' src="/upvote.png" alt="Upvote" />
                            <div style={{fontSize:18, fontFamily:'raleway'}}>{item.karma}</div>
                            <img className='voting' src="/downvoted.png" alt="Downvoted" />
                          </div>
                          <div>
                            <div style={{fontSize:18, fontFamily:'raleway'}}>{item.quote}</div>
                              <div className='authorGrid'>
                              <img className='voting' src={`${process.env.REACT_APP_API_URL}/uploads/${item.user.avatar}`} alt="User avatar" width={35} 
                              onPointerMove={e=>{setUserId(item.user.id)}} onClick={handleProceedUser}/>
                              <div style={{fontSize:15, fontFamily:'raleway'}}>{item.user.first_name + ' ' + item.user.last_name}</div>
                            </div>
                          </div>
{/*                           <div className='m-4'>
                            <img src="/settings.png" alt="Settings" />
                            <div></div>
                            <img src="/delete.png" alt="Delete" />
                          </div> */}
                        </div>
                      )
                    ):(
                      <div key={index} className="quoteBorder quoteGrid mb-5" style={{width:400}}>
                        <div className='m-4'>
                          <img className='voting' src="upvote.png" alt="Upvote" />
                          <div style={{fontSize:18, fontFamily:'raleway'}}>{item.karma}</div>
                          <img className='voting' src="downvote.png" alt="Downvote" />
                        </div>
                        <div>
                          <div style={{fontSize:18, fontFamily:'raleway'}}>{item.quote}</div>
                          <div className='authorGrid'>
                            <img className='voting' src={`${process.env.REACT_APP_API_URL}/uploads/${item.user.avatar}`} alt="User avatar" width={35} 
                            onPointerMove={e=>{setUserId(item.user.id)}} onClick={handleProceedUser} />
                            <div style={{fontSize:15, fontFamily:'raleway'}}>{item.user.first_name + ' ' + item.user.last_name}</div>
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              ):(
                <h1 className='text-center'>There are no quotes available</h1>
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
                          <img className='voting' src={`${process.env.REACT_APP_API_URL}/uploads/${item.user.avatar}`}alt="User avatar" width={35} 
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