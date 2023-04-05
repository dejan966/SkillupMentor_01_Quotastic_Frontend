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

const QuotesMostRecent: FC = () => {
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
  }

  const {data: recentQuotes, isLoading:isLoadingMostRecent} = useQuery(
    ['allMostRecentQuotes'],
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

  return(
    <Layout>
      <div className='text-start mb-4' style={{width:420}}>
        <h2 className='red'>Most recent quotes</h2>
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

export default QuotesMostRecent