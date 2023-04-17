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

  const [likedQuotes, setLikedQuotes] = useState<QuoteType[]>([])
  const [likedStroke, setLikedStroke] = useState<string[]>([])
  const [dislikedStroke, setDislikedStroke] = useState<string[]>([])
  const [quotesKarma, setQuotesKarma] = useState<number[]>([])

  const grabQuotes = (data: any) => {
    for (let i = 0; i < data.data.length; i++) {
      if (data.data[i]?.votes[0]) {
        if (data.data[i].votes[0].value === true) {
          likedStroke.push('#DE8667')
          dislikedStroke.push('black')
        }else if(data.data[i].votes[0].value === false){
          likedStroke.push('black')
          dislikedStroke.push('#DE8667')
        }
      } else {
        likedStroke.push('black')
        dislikedStroke.push('black')
      }
      quotesKarma.push(data.data[i].karma)
      likedQuotes.push(data.data[i])
    }
    setLikedStroke(likedStroke)
    setDislikedStroke(dislikedStroke)
    setLikedQuotes(likedQuotes)
    setQuotesKarma(quotesKarma)
  }

  /*   const { data: randomQuote, isLoading: isLoadingRandom } = useQuery(
    ['randomQuote'],
    () => API.fetchRandomQuote(),
    {
      onSuccess(data) {
        grabQuotes(data)
      },
      refetchOnWindowFocus: false,
    },
  )
 */
  useQuery(['allQuotes'], () => API.fetchQuotes(), {
    onSuccess(data) {
      grabQuotes(data)
    },
    refetchOnWindowFocus: false,
  })

  const { data: mostLiked, isLoading: isLoadingMostLiked } = useQuery(
    ['quote'],
    () => API.usersMostLikedQuotes(),
    {
      refetchOnWindowFocus: false,
    },
  )

  const { data: recentQuotes, isLoading: isLoadingMostRecent } = useQuery(
    ['recentQuotes'],
    () => API.usersMostRecentQuotes(),
    {
      refetchOnWindowFocus: false,
    },
  )

  const handleUpvote = async (quoteId: number) => {
    const response = await API.createUpvote(quoteId)
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message)
      setShowError(true)
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message)
      setShowError(true)
    }
  }

  const handleDownvote = async (quoteId: number) => {
    const response = await API.createDownvote(quoteId)
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message)
      setShowError(true)
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message)
      setShowError(true)
    }
  }

  const voting = (
    quoteId: number,
    vote:string,
    likeState: string,
    dislikeState: string,
  ) => {
    const likedStrokeCopy = {...likedStroke}
    const dislikedStrokeCopy = {...dislikedStroke}

    const index = likedQuotes.findIndex(obj => {
      return obj.id === quoteId
    })

    /* if(vote === 'upvote'){
      if(likeState === '#DE8667'){
        likedStrokeCopy[index] = 'black'
        likedQuotes[index].karma = likedQuotes[index].karma--
        setLikedQuotes(likedQuotes)
      } else if(likeState === 'black'){
        likedStrokeCopy[index] = '#DE8667'
        if(dislikeState === '#DE8667'){
          dislikedStrokeCopy[index] = 'black'
          likedQuotes[index].karma = likedQuotes[index].karma+=2
          setLikedQuotes(likedQuotes)
          setDislikedStroke(dislikedStrokeCopy)
          handleUpvote(quoteId)
          return
        }
        likedQuotes[index].karma = likedQuotes[index].karma++
      }
      setLikedStroke(likedStrokeCopy)
      setLikedQuotes(likedQuotes)
      handleUpvote(quoteId)
    } */
    if(vote === 'upvote'){
      if(likeState === '#DE8667'){
        likedStrokeCopy[index] = 'black'
        likedQuotes[index].karma--
      } else if(likeState === 'black'){
        likedStrokeCopy[index] = '#DE8667'
        if(dislikeState === '#DE8667'){
          dislikedStrokeCopy[index] = 'black'
          setDislikedStroke(dislikedStrokeCopy)
          likedQuotes[index].karma+=2
        } else{
          likedQuotes[index].karma++
        }
      }
      setLikedQuotes(likedQuotes)
      setLikedStroke(likedStrokeCopy)
      handleUpvote(quoteId)
    }
    else if(vote === 'downvote'){
      if(dislikeState === '#DE8667'){
        dislikedStrokeCopy[index] = 'black'
        likedQuotes[index].karma++
      } else if(dislikeState === 'black'){
        dislikedStrokeCopy[index] = '#DE8667'
        if(likeState === '#DE8667'){
          likedStrokeCopy[index] = 'black'
          setLikedStroke(likedStrokeCopy)
          likedQuotes[index].karma-=2
        } else{
          likedQuotes[index].karma--
        }
      }
      setLikedQuotes(likedQuotes)
      setDislikedStroke(dislikedStrokeCopy)
      handleDownvote(quoteId)
    }
  }

  return (
    <Layout>
      {authStore.user ? (
        <>
          <div className="mb-5">
            <div className="text-center">
              <h2 className="red">Quote of the day</h2>
              <p className="quoteText">
                Quote of the day is a randomly chosen quote
              </p>
            </div>
            <div className="quoteBorder mb-5 mx-auto" style={{ width: 400 }}>
              <div className="m-4">
                <div
                  className="text-center"
                  style={{ fontSize: 18, fontFamily: 'raleway' }}
                >
                  There are no quotes available.
                </div>
              </div>
            </div>
          </div>
          <div className="mb-5">
            <div className="text-center mx-auto" style={{ width: 420 }}>
              <h2 className="red">Most upvoted quotes</h2>
              <p className="quoteText">
                Most upvoted quotes on the platform. Give a like to the ones you
                like to keep them saved in your profile.
              </p>
            </div>
            {isLoadingMostLiked ? (
              <div className="quoteBorder mb-5 mx-auto" style={{ width: 400 }}>
                <div className="m-4">
                  <div
                    className="text-center"
                    style={{ fontSize: 18, fontFamily: 'raleway' }}
                  >
                    There are no quotes available.
                  </div>
                </div>
              </div>
            ) : (
              <>
                {mostLiked ? (
                  <div className="quoteRow">
                    {mostLiked.data.map((item: QuoteType, index: number) => (
                      <QuoteBlock
                        key={index}
                        userQuote={item}
                        likedQuote={likedQuotes}
                        likeColor={likedStroke}
                        dislikeColor={dislikedStroke}
                        voting={voting}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    className="quoteBorder mb-5 mx-auto"
                    style={{ width: 400 }}
                  >
                    <div className="m-4">
                      <div
                        className="text-center"
                        style={{ fontSize: 18, fontFamily: 'raleway' }}
                      >
                        There are no quotes available.
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div className="text-center">
              <Button href={routes.MOSTLIKEDQUOTES} className="btnLogin">
                Load more
              </Button>
            </div>
          </div>
          <div className="mb-4">
            <div className="text-center mx-auto" style={{ width: 420 }}>
              <h2 className="red">Most recent quotes</h2>
              <p className="quoteText">
                Recent quotes update as soon user adds new quote. Go ahed show
                them that you seen the new quote and like the ones you like.
              </p>
            </div>
            {isLoadingMostRecent ? (
              <div className="quoteBorder mb-5 mx-auto" style={{ width: 400 }}>
                <div className="m-4">
                  <div
                    className="text-center"
                    style={{ fontSize: 18, fontFamily: 'raleway' }}
                  >
                    There are no quotes available.
                  </div>
                </div>
              </div>
            ) : (
              <>
                {recentQuotes ? (
                  <div className="quoteRow">
                    {recentQuotes.data.map((item: QuoteType, index: number) => (
                      <QuoteBlock
                        key={index}
                        userQuote={item}
                        likedQuote={likedQuotes}
                        likeColor={likedStroke}
                        dislikeColor={dislikedStroke}
                        voting={voting}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    className="quoteBorder mb-5 mx-auto"
                    style={{ width: 400 }}
                  >
                    <div className="m-4">
                      <div
                        className="text-center"
                        style={{ fontSize: 18, fontFamily: 'raleway' }}
                      >
                        There are no quotes available.
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div className="mb-5 text-center mx-auto">
              <Button href={routes.MOSTRECENTQUOTES} className="btnLogin">
                Load more
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="py-4 grid mb-5 text-center">
            <div className="text-start">
              <div className="text">
                <h1 className="display-1">
                  Welcome to <span style={{ color: '#DE8667' }}>Quotastic</span>
                </h1>
                <p className="col-md-8 fs-4">
                  Quotastic is a free online tool for you to explore the quips,
                  quotes and proverbs. Sign up and express yourself.
                </p>
                <p className="fs-4">
                  <Button className="btnRegister" href={routes.SIGNUP}>
                    Sign up
                  </Button>
                </p>
              </div>
            </div>
            <div>
              <img src="example_quote.png" width={456} alt="example quote" />
            </div>
          </div>
          <div className="text-center mx-auto mb-5" style={{ width: 400 }}>
            <h1 className="display-6">
              Explore the world of{' '}
              <span style={{ color: '#DE8667' }}>fantastic quotes</span>
            </h1>
          </div>
          <div className="mb-5">
            <div className="text-center mx-auto" style={{ width: 420 }}>
              <h2 className="red">Most upvoted quotes</h2>
              <p className="quoteText">
                Most upvoted quotes on the platform. Sign up or login to like
                the quotes and keep them saved in your profile.
              </p>
            </div>
            {isLoadingMostLiked ? (
              <div className="quoteBorder mb-5 mx-auto" style={{ width: 400 }}>
                <div className="m-4">
                  <div
                    className="text-center"
                    style={{ fontSize: 18, fontFamily: 'raleway' }}
                  >
                    There are no quotes available.
                  </div>
                </div>
              </div>
            ) : (
              <>
                {mostLiked ? (
                  <div className="quoteRow">
                    {mostLiked.data.map((item: QuoteType, index: number) => (
                      <QuoteBlock key={index} userQuote={item} />
                    ))}
                  </div>
                ) : (
                  <div
                    className="quoteBorder mb-5 mx-auto"
                    style={{ width: 400 }}
                  >
                    <div className="m-4">
                      <div
                        className="text-center"
                        style={{ fontSize: 18, fontFamily: 'raleway' }}
                      >
                        There are no quotes available.
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div className="mb-5 text-center mx-auto text">
              <a href={routes.LOGIN}>
                <Button className="btnSeeMore">Sign in to see more</Button>
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
