import { FC, useState } from 'react'
import { useQuery } from 'react-query'
import Layout from 'components/ui/Layout'
import * as API from 'api/Api'
import authStore from 'stores/auth.store'
import { Link, useNavigate } from 'react-router-dom'
import { StatusCode } from 'constants/errorConstants'
import { Button, Toast, ToastContainer } from 'react-bootstrap'
import { routes } from 'constants/routesConstants'
import { QuoteType } from 'models/quote'
import QuotesDelete from 'pages/Me/Myquote/Delete'

const QuotesMostRecent: FC = () => {
    const [apiError, setApiError] = useState('')
    const [showError, setShowError] = useState(false)

    const [mostRecentLikedQuotes, setMostRecentLikedQuotes] = useState<string[]>([])
    const [mostRecentDislikedQuotes, setMostRecentDislikedQuotes] = useState<string[]>([])
    const [recentLikesQuotes, setRecentLikesQuotes] = useState<boolean[]>([])
    const [recentDislikesQuotes, setRecentDislikesQuotes] = useState<boolean[]>([])
    const [mostRecentQuotesKarma, setMostRecentQuotesKarma] = useState<number[]>([])
  
    const [userId, setUserId] = useState(1)
    const [quoteData, setQuoteData] = useState({ id: 1, quote:''}) 
    const navigate = useNavigate()
  
    const [isOpen, setIsOpen] = useState(false)
    const [successDelete, setSuccessDelete] = useState(false)
      
    const recentQuotes = useQuery(
        ['allRecentQuotes'],
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

    const togglePopup = () => {
        setIsOpen(!isOpen)
      }
      
      const toggleSuccess = () => {
        setSuccessDelete(!successDelete)
      }
      
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
      
        const handleProceedUser = () => {
          if(userId === authStore.user?.id){
            navigate('../me/quotes')
            return
          }
          navigate(`../users/${userId}/quotes`)
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

    return(
      <Layout>
        <div className='text-start mb-4' style={{width:420}}>
          <h2 className='red'>Most recent quotes</h2>
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
                <div key={index} className="quoteBorder myQuotes mb-5" style={{width:400}} onPointerMove={e=>{quoteData.id = item.id; quoteData.quote = item.quote}}>
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