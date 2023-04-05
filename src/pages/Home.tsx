import Layout from 'components/ui/Layout'
import { FC, useState } from 'react'
import { Button, Toast, ToastContainer } from 'react-bootstrap'
import { routes } from 'constants/routesConstants'
import authStore from 'stores/auth.store'
import { useQuery } from 'react-query'
import * as API from 'api/Api'
import { QuoteType } from 'models/quote'
import { useNavigate } from 'react-router-dom'
import QuoteBlock from './QuoteBlock'
import { StatusCode } from 'constants/errorConstants'

const Home: FC = () => {
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)
  const navigate = useNavigate()
  
  const [likesQuotes, setLikesQuotes] = useState<boolean[]>([])
  const [dislikesQuotes, setDislikesQuotes] = useState<boolean[]>([])
  const [quotesKarma, setQuotesKarma] = useState<number[]>([])

  const grabQuotes = (data:any) =>{
    if(data.data[0].votes[0]){
      if(data.data[0].votes[0].value === true){
        likesQuotes.push(true)
        setLikesQuotes(likesQuotes)
        dislikesQuotes.push(false)
        setDislikesQuotes(dislikesQuotes)
        quotesKarma.push(data.data[0].karma)
        setQuotesKarma(quotesKarma)
      }
      else if(data.data[0].votes[0].value === false){
        likesQuotes.push(false)
        setLikesQuotes(likesQuotes)
        dislikesQuotes.push(true)
        setDislikesQuotes(dislikesQuotes)
        quotesKarma.push(data.data[0].karma)
        setQuotesKarma(quotesKarma)
      }
    }
    else{
      likesQuotes.push(false)
      setLikesQuotes(likesQuotes)
      dislikesQuotes.push(false)
      setDislikesQuotes(dislikesQuotes)
      quotesKarma.push(data.data[0].karma)
      setQuotesKarma(quotesKarma)
    }
    for(let i = 1; i<data.data.length; i++){
      if(authStore.user?.id === data.data[i].votes[0]?.user.id){
        if(data.data[i].votes[0]?.value === true){
          likesQuotes.push(true)
          dislikesQuotes.push(false)
          quotesKarma.push(data.data[i].karma)
        } else if(data.data[i].votes[0]?.value === false){
          likesQuotes.push(false)
          dislikesQuotes.push(true)
          quotesKarma.push(data.data[i].karma)
        }
        else{
          likesQuotes.push(false)
          dislikesQuotes.push(false)
          quotesKarma.push(data.data[i].karma)
        }
      }
      else if(authStore.user?.id !== data.data[i].votes[0]?.user.id){
        likesQuotes.push(false)
        dislikesQuotes.push(false)
        quotesKarma.push(data.data[i].karma)
      }
    }
    setLikesQuotes(likesQuotes)
    setDislikesQuotes(dislikesQuotes)

    setQuotesKarma(quotesKarma)
    console.log(likesQuotes)
    console.log(dislikesQuotes)
  }
  const {data: randomQuote, isLoading:isLoadingRandom} = useQuery(
    ['randomQuote'],
    () => API.fetchRandomQuote(),
    {
      onSuccess(data){
        grabQuotes(data)
      },
      refetchOnWindowFocus: false,
    },
  )

  const {data: mostLiked, isLoading:isLoadingMostLiked} = useQuery(
    ['quote'],
    () => API.fetchQuotes(),
    {
      onSuccess(data){
        grabQuotes(data)
      },
      refetchOnWindowFocus: false,
    },
  )

  const {data: recentQuotes, isLoading:isLoadingMostRecent} = useQuery(
    ['recentQuotes'],
    () => API.usersMostRecentQuotes(),
    {
      onSuccess(data){
        grabQuotes(data)
      },
      refetchOnWindowFocus: false,
    },
  )

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

  const upvote = (index:number, quoteId:number) =>{
    const likesQuotesCopy = {...likesQuotes}
    const dislikesQuotesCopy = {...dislikesQuotes}
    if(likesQuotes[index] === true){
      likesQuotesCopy[index] = false
      quotesKarma[index]--
      setLikesQuotes(likesQuotesCopy)
      setQuotesKarma(quotesKarma)
      handleUpvote(quoteId)
      return
    }
    else if(likesQuotes[index] === false){
      likesQuotesCopy[index] = true
      if(dislikesQuotes[index] === true){
        setLikesQuotes(likesQuotesCopy)
        dislikesQuotesCopy[index] = false
        setDislikesQuotes(dislikesQuotesCopy)
        quotesKarma[index]+=2
        setQuotesKarma(quotesKarma)
        handleUpvote(quoteId)
        return
      }
      setLikesQuotes(likesQuotesCopy)
      quotesKarma[index]++
      setQuotesKarma(quotesKarma)
      handleUpvote(quoteId)
      return
    }
  }

  const downvote = (index:number, quoteId:number) =>{
    const likesQuotesCopy = {...likesQuotes}
    const dislikesQuotesCopy = {...dislikesQuotes}
    if(dislikesQuotes[index] === true){
      dislikesQuotesCopy[index] = false
      setDislikesQuotes(dislikesQuotesCopy)
      quotesKarma[index]++
      setQuotesKarma(quotesKarma)
      handleDownvote(quoteId)
      return
    }
    else if(dislikesQuotes[index] === false){
      dislikesQuotesCopy[index] = true
      if(likesQuotes[index] === true){
        likesQuotesCopy[index] = false
        setDislikesQuotes(dislikesQuotesCopy)
        setLikesQuotes(likesQuotesCopy)
        quotesKarma[index]-=2
        setQuotesKarma(quotesKarma)
        handleDownvote(quoteId)
        return
      }
      setDislikesQuotes(dislikesQuotesCopy)
      quotesKarma[index]--
      setQuotesKarma(quotesKarma)
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
            {isLoadingRandom ? (
              <div className="quoteBorder mb-5 mx-auto" style={{width:400}}>
                <div className='m-4'>
                  <div className='text-center' style={{fontSize:18, fontFamily:'raleway'}}>Loading...</div>
                </div>
              </div>
            ):(
              <>
                {randomQuote ? (
                  <div className='myQuotes mx-auto mb-5' style={{width:420}}>
                    <QuoteBlock
                      userQuote={randomQuote.data} 
                      likes={likesQuotes[0]}
                      dislikes={dislikesQuotes[0]}
                      karma={quotesKarma[0]}
                      index={0}
                      upvote={upvote}
                      downvote={downvote}
                    />
                  </div>
                  ):(
                  <div className="quoteBorder mb-5 mx-auto" style={{width:400}}>
                    <div className='m-4'>
                      <div className='text-center' style={{fontSize:18, fontFamily:'raleway'}}>There are no quotes available.</div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <div className='mb-5'>
            <div className='text-center mx-auto' style={{width:420}}>
              <h2 className='red'>Most upvoted quotes</h2>
              <p className='quoteText'>Most upvoted quotes on the platform. Give a like to the ones you like to keep them saved in your profile.</p>
            </div>
            {isLoadingMostLiked ?(
              <div className="quoteBorder mb-5 mx-auto" style={{width:400}}>
                <div className='m-4'>
                  <div className='text-center' style={{fontSize:18, fontFamily:'raleway'}}>There are no quotes available.</div>
                </div>
              </div>
            ):(
              <>
                {mostLiked ? (
                  <div className='quoteRow'>
                    {mostLiked.data.map((item:QuoteType, index:number) =>(
                    <QuoteBlock 
                      userQuote={item} 
                      key={index} 
                      likes={likesQuotes[index]}
                      dislikes={dislikesQuotes[index]}
                      karma={quotesKarma[index]}
                      index={index}
                      upvote={upvote}
                      downvote={downvote}
                    />
                    ))}      
                  </div>
                ):(
                  <div className="quoteBorder mb-5 mx-auto" style={{width:400}}>
                    <div className='m-4'>
                      <div className='text-center' style={{fontSize:18, fontFamily:'raleway'}}>There are no quotes available.</div>
                    </div>
                  </div>
                )}
              </>
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
            {isLoadingMostRecent?(
              <div className="quoteBorder mb-5 mx-auto" style={{width:400}}>
                <div className='m-4'>
                  <div className='text-center' style={{fontSize:18, fontFamily:'raleway'}}>There are no quotes available.</div>
                </div>
              </div>
            ):(
              <>
                {recentQuotes ? (
                  <div className="quoteRow">
                    {recentQuotes.data.map((item:QuoteType, index:number) =>(
                      <QuoteBlock 
                        userQuote={item} 
                        key={index} 
                        likes={likesQuotes[index]}
                        karma={quotesKarma[index]}
                        index={index}
                        upvote={upvote}
                        downvote={downvote}
                      />
                    ))}
                  </div>
                ):(
                  <div className="quoteBorder mb-5 mx-auto" style={{width:400}}>
                    <div className='m-4'>
                      <div className='text-center' style={{fontSize:18, fontFamily:'raleway'}}>There are no quotes available.</div>
                    </div>
                  </div>
                )}
              </>
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
            {isLoadingMostLiked ?(
              <div className="quoteBorder mb-5 mx-auto" style={{width:400}}>
                <div className='m-4'>
                  <div className='text-center' style={{fontSize:18, fontFamily:'raleway'}}>There are no quotes available.</div>
                </div>
              </div>
            ):(
              <>
                {mostLiked ? (
                  <div className='quoteRow'>
                    {mostLiked.data.map((item:QuoteType, index:number) =>(
                      <QuoteBlock 
                        userQuote={item} 
                        key={index}
                        index={index}
                      />
                    ))}      
                  </div>
                ):(
                  <div className="quoteBorder mb-5 mx-auto" style={{width:400}}>
                    <div className='m-4'>
                      <div className='text-center' style={{fontSize:18, fontFamily:'raleway'}}>There are no quotes available.</div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div className='mb-5 text-center mx-auto text'>
              <a href={routes.LOGIN}>
                <Button className='btnSeeMore'>Sign in to see more</Button>
              </a>
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
    </Layout>
  )
}

export default Home