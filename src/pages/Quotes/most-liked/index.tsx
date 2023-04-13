import { FC, useState } from 'react'
import { useQuery } from 'react-query'
import Layout from 'components/ui/Layout'
import * as API from 'api/Api'
import authStore from 'stores/auth.store'
import { useNavigate } from 'react-router-dom'
import { StatusCode } from 'constants/errorConstants'
import { Toast, ToastContainer } from 'react-bootstrap'
import { QuoteType } from 'models/quote'
import QuoteBlock from 'pages/QuoteBlock'

const QuotesMostLiked: FC = () => {
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)
  const navigate = useNavigate()

  const [likedQuotes, setLikedQuotes] = useState<number[]>([])
  const [dislikedQuotes, setDislikedQuotes] = useState<number[]>([])
  const [quotesKarma, setQuotesKarma] = useState<number[]>([])

  const grabQuotes = (data: any) => {
    if (data.data[0].votes[0]) {
      if (data.data[0].votes[0].value === true) {
        likedQuotes.push(data.data[0].id)
        setLikedQuotes(likedQuotes)
        quotesKarma.push(data.data[0].karma)
        setQuotesKarma(quotesKarma)
      } else if (data.data[0].votes[0].value === false) {
        dislikedQuotes.push(data.data[0].id)
        setDislikedQuotes(dislikedQuotes)
        quotesKarma.push(data.data[0].karma)
        setQuotesKarma(quotesKarma)
      }
    } else {
      quotesKarma.push(data.data[0].karma)
      setQuotesKarma(quotesKarma)
    }
    for (let i = 1; i < data.data.length; i++) {
      if (authStore.user?.id === data.data[i].votes[0]?.user.id) {
        if (data.data[i].votes[0]?.value === true) {
          likedQuotes.push(data.data[i].id)
          quotesKarma.push(data.data[i].karma)
        } else if (data.data[i].votes[0]?.value === false) {
          dislikedQuotes.push(data.data[i].id)
          quotesKarma.push(data.data[i].karma)
        } else {
          quotesKarma.push(data.data[i].karma)
        }
      } else if (authStore.user?.id !== data.data[i].votes[0]?.user.id) {
        quotesKarma.push(data.data[i].karma)
      }
    }
    setLikedQuotes(likedQuotes)
    setDislikedQuotes(dislikedQuotes)

    setQuotesKarma(quotesKarma)
  }

  const { data: mostLiked, isLoading: isLoadingMostLiked } = useQuery(
    ['allMostLikedQuotes'],
    () => API.fetchQuotes(),
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
      <div className="text-start mb-4" style={{ width: 420 }}>
        <h2 className="red">Most upvoted quotes</h2>
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
    </Layout>
  )
}

export default QuotesMostLiked
