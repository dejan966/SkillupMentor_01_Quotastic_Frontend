import { FC, useState } from 'react'
import { useQuery } from 'react-query'
import Layout from 'components/ui/Layout'
import * as API from 'api/Api'
import { useNavigate } from 'react-router-dom'
import { StatusCode } from 'constants/errorConstants'
import { Toast, ToastContainer } from 'react-bootstrap'
import { QuoteType } from 'models/quote'
import QuoteBlock from 'pages/QuoteBlock'

const QuotesMostLiked: FC = () => {
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)
  const navigate = useNavigate()

  const [allQuotes, setAllQuotes] = useState<QuoteType[]>([])
  const [likedStroke, setLikedStroke] = useState<string[]>([])
  const [dislikedStroke, setDislikedStroke] = useState<string[]>([])

  const grabQuotes = (data: any) => {
    for (let i = 0; i < data.data.length; i++) {
      if (data.data[i]?.votes[0]) {
        if (data.data[i].votes[0].value === true) {
          likedStroke.push('#DE8667')
          dislikedStroke.push('black')
        } else if (data.data[i].votes[0].value === false) {
          likedStroke.push('black')
          dislikedStroke.push('#DE8667')
        }
      } else {
        likedStroke.push('black')
        dislikedStroke.push('black')
      }
      allQuotes.push(data.data[i])
    }
    setLikedStroke(likedStroke)
    setDislikedStroke(dislikedStroke)
    setAllQuotes(allQuotes)
  }

  const { data: mostLiked, isLoading: isLoadingMostLiked } = useQuery(
    ['allMostLikedQuotes'],
    () => API.usersMostLikedQuotes(),
    {
      refetchOnWindowFocus: false,
    },
  )

  useQuery(['allQuotes_MostLiked'], () => API.fetchQuotes(), 
  {
    onSuccess(data) {
      grabQuotes(data)
    },
    refetchOnWindowFocus: false,
  }
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
    vote: string,
    likeState: string,
    dislikeState: string,
  ) => {
    const likedStrokeCopy = { ...likedStroke }
    const dislikedStrokeCopy = { ...dislikedStroke }

    const index = allQuotes.findIndex((obj) => {
      return obj.id === quoteId
    })

    if (vote === 'upvote') {
      if (likeState === '#DE8667') {
        likedStrokeCopy[index] = 'black'
        allQuotes[index].karma--
      } else if (likeState === 'black') {
        likedStrokeCopy[index] = '#DE8667'
        if (dislikeState === '#DE8667') {
          dislikedStrokeCopy[index] = 'black'
          setDislikedStroke(dislikedStrokeCopy)
          allQuotes[index].karma += 2
        } else {
          allQuotes[index].karma++
        }
      }
      setAllQuotes(allQuotes)
      setLikedStroke(likedStrokeCopy)
      handleUpvote(quoteId)
    } else if (vote === 'downvote') {
      if (dislikeState === '#DE8667') {
        dislikedStrokeCopy[index] = 'black'
        allQuotes[index].karma++
      } else if (dislikeState === 'black') {
        dislikedStrokeCopy[index] = '#DE8667'
        if (likeState === '#DE8667') {
          likedStrokeCopy[index] = 'black'
          setLikedStroke(likedStrokeCopy)
          allQuotes[index].karma -= 2
        } else {
          allQuotes[index].karma--
        }
      }
      setAllQuotes(allQuotes)
      setDislikedStroke(dislikedStrokeCopy)
      handleDownvote(quoteId)
    }
  }

  return (
    <Layout>
      <div className="text-start mb-4" style={{ width: 420 }}>
        <h2 className="red">Most upvoted quotes</h2>
      </div>
      {isLoadingMostLiked ? (
        <div className="quoteBorder mb-5 mx-auto" style={{ width: 400 }}>
          <div className="m-4">
            <div
              className="text-center"
              style={{ fontSize: 18, fontFamily: 'raleway' }}
            >
              Loading...
            </div>
          </div>
        </div>
      ) : (
        <>
          {mostLiked ? (
            <div className="quoteRow">
              {mostLiked.data.map((item: QuoteType, index: number) => (
                <>
                  <QuoteBlock
                    key={index}
                    userQuote={item}
                    quotes={allQuotes}
                    likeColor={likedStroke}
                    dislikeColor={dislikedStroke}
                    voting={voting}
                  />
                </>
              ))}
            </div>
          ) : (
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
          )}
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

export default QuotesMostLiked
