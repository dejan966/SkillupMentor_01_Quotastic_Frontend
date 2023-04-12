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

  const [likedQuotes, setLikedQuotes] = useState<number[]>([])
  const [dislikedQuotes, setDislikedQuotes] = useState<number[]>([])
  const [quotesKarma, setQuotesKarma] = useState<number[]>([])

  const grabQuotes = (data: any) => {
    for (let i = 0; i < data.data.length; i++) {
      if (data.data[i]?.votes) {
        if (authStore.user?.id === data.data[i].votes[0]?.user.id) {
          if (data.data[i].votes[0]?.value === true) {
            console.log(i + ' ' + true)
            likedQuotes.push(data.data[i].id)
            dislikedQuotes.push(0)
            quotesKarma.push(data.data[i].karma)
            setLikedQuotes(likedQuotes)
            setDislikedQuotes(dislikedQuotes)
            setQuotesKarma(quotesKarma)
          } else if (data.data[i].votes[0]?.value === false) {
            console.log(i + ' ' + false)
            likedQuotes.push(0)
            dislikedQuotes.push(data.data[i].id)
            quotesKarma.push(data.data[i].karma)
            setLikedQuotes(likedQuotes)
            setDislikedQuotes(dislikedQuotes)
            setQuotesKarma(quotesKarma)
          } else {
            console.log(i + ' ' + 'Nič')
            likedQuotes.push(0)
            dislikedQuotes.push(0)
            quotesKarma.push(data.data[i].karma)
            setLikedQuotes(likedQuotes)
            setDislikedQuotes(dislikedQuotes)
            setQuotesKarma(quotesKarma)
          }
        } else if (authStore.user?.id !== data.data[i].votes[0]?.user.id) {
          console.log(i + ' ' + 'Nič')
          likedQuotes.push(0)
          dislikedQuotes.push(0)
          quotesKarma.push(data.data[i].karma)
        }
      } else {
        quotesKarma.push(data.data[i].karma)
        setQuotesKarma(quotesKarma)
      }
    }
  }
  console.log('liked: ' + likedQuotes)
  console.log('disliked: ' + dislikedQuotes)

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
  const { data: mostLiked, isLoading: isLoadingMostLiked } = useQuery(
    ['quote'],
    () => API.fetchQuotes(),
    {
      refetchOnWindowFocus: false,
    },
  )

  const { data: recentQuotes, isLoading: isLoadingMostRecent } = useQuery(
    ['recentQuotes'],
    () => API.usersMostRecentQuotes(),
    {
      onSuccess(data) {
        grabQuotes(data)
      },
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
  console.log(quotesKarma)

  const upvote = (
    index: number,
    quoteId: number,
    likeState: string,
    dislikeState: string,
  ) => {
    const likedQuotesCopy = { ...likedQuotes }
    const dislikedQuotesCopy = { ...dislikedQuotes }
    if (likeState === '/upvote.png' && dislikeState === '/downvote.png') {
      likedQuotesCopy.push(quoteId)
      quotesKarma[index]++
    } else if (
      likeState === '/upvoted.png' &&
      dislikeState === '/downvote.png'
    ) {
      likedQuotesCopy.splice(index, 1) //deletes the value from the array
      quotesKarma[index]--
    } else if (
      likeState === '/upvote.png' &&
      dislikeState === '/downvoted.png'
    ) {
      dislikedQuotesCopy.splice(index, 1) //deletes the value from the array
      likedQuotesCopy.push(quoteId)
      quotesKarma[index] += 2
      setDislikedQuotes(dislikedQuotesCopy)
    }
    console.log(likedQuotesCopy[index])
    setLikedQuotes(likedQuotesCopy)
    setQuotesKarma(quotesKarma)
    handleUpvote(quoteId)
  }

  const downvote = (
    index: number,
    quoteId: number,
    likeState: string,
    dislikeState: string,
  ) => {
    const likedQuotesCopy = { ...likedQuotes }
    const dislikedQuotesCopy = { ...dislikedQuotes }
    if (dislikeState === '/downvote.png' && likeState === '/upvote.png') {
      dislikedQuotesCopy.push(quoteId)
      quotesKarma[index]--
    } else if (
      dislikeState === '/downvoted.png' &&
      likeState === '/upvote.png'
    ) {
      dislikedQuotesCopy.splice(index, 1) //deletes the value from the array
      quotesKarma[index]++
    } else if (
      dislikeState === '/downvote.png' &&
      likeState === '/upvoted.png'
    ) {
      likedQuotesCopy.splice(index, 1) //deletes the value from the array
      dislikedQuotesCopy.push(quoteId)
      quotesKarma[index] -= 2
      setLikedQuotes(dislikedQuotesCopy)
    }
    setDislikedQuotes(likedQuotesCopy)
    setQuotesKarma(quotesKarma)
    handleDownvote(quoteId)
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
                        dislikedQuote={dislikedQuotes}
                        karma={quotesKarma}
                        
                        upvote={upvote}
                        downvote={downvote}
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
                        dislikedQuote={dislikedQuotes}
                        karma={quotesKarma}
                        
                        upvote={upvote}
                        downvote={downvote}
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
                      <QuoteBlock key={index} userQuote={item}  />
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
