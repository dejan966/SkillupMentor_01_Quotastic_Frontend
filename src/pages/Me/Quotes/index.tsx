import Layout from 'components/ui/Layout'
import { FC, useState } from 'react'
import { useQuery } from 'react-query'
import * as API from 'api/Api'
import { Button, Toast, ToastContainer } from 'react-bootstrap'
import { QuoteType } from 'models/quote'
import { VoteType } from 'models/vote'
import authStore from 'stores/auth.store'
import { StatusCode } from 'constants/errorConstants'
import { useNavigate } from 'react-router-dom'

const UserQuotesInfo: FC = () => {
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)
  const [otherUserId, setOtherUserId] = useState(1)
  const navigate = useNavigate()
  
  const userId = (authStore.user?.id) as number

  const mostLiked = useQuery(
    ['currUserMostLikedQuotes'],
    () => API.fetchUserMostLikedQuotes(userId),
    {
      refetchOnWindowFocus: false,
    },
  )
  
  const mostRecent = useQuery(
    ['currUserMostRecentQuotes'],
    () => API.fetchCurrUserMostRecentQuotes(),
    {
      refetchOnWindowFocus: false,
    },
  ) 

  const liked = useQuery(
    ['currUserLikes'],
    () => API.fetchCurrUserVotes(),
    {
      keepPreviousData: true,
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

  const handleProceedUser = () => {
    navigate(`../users/${otherUserId}/quotes`)
  }

  return (
    <Layout>
      <div>
        <div className='quoteRow mb-5'>
          <div>
            <h2 className='red'>Most liked quotes</h2>
            <div className='mb-5'>
              {mostLiked.data ? (
                <div>
                  {mostLiked.data.data.map((item: QuoteType, index:number)=>(
                    <div className="quoteBorder myQuotes mb-5" key={index} style={{width:400}}>
                      <div className='m-4'>
                        <img className='voting' src="/upvote.png" alt="Upvote" />
                        <div style={{fontSize:18, fontFamily:'raleway'}}>{item.karma}</div>
                        <img className='voting' src="/downvote.png" alt="Downvote" />
                      </div>
                      <div>
                        <div style={{fontSize:18, fontFamily:'raleway'}}>{item.quote}</div>
                        <div className='authorGrid'>
                          <img className='voting userAvatar' src={`${process.env.REACT_APP_API_URL}/uploads/${item.user.avatar}`} alt="User avatar" width={35}/>
                          <div style={{fontSize:15, fontFamily:'raleway'}}>{item.user.first_name + ' ' + item.user.last_name}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ):(
                <div className='text text-center'>No quotes available</div>
              )}
            </div>
          </div>
          <div>
            <h2 className='text'>Most recent</h2>
            <div className='mb-5'>
              {mostRecent.data ? (
                <div>
                  {mostRecent.data.data.map((item: QuoteType, index:number)=>(
                    <div className="quoteBorder myQuotes mb-5" key={index} style={{width:400}}>
                      <div className='m-4'>
                        <img className='voting' src="/upvote.png" alt="Upvote" />
                        <div style={{fontSize:18, fontFamily:'raleway'}}>{item.karma}</div>
                        <img className='voting' src="/downvote.png" alt="Downvote" />
                      </div>
                      <div>
                        <div style={{fontSize:18, fontFamily:'raleway'}}>{item.quote}</div>
                        <div className='authorGrid'>
                          <img className='voting userAvatar' src={`${process.env.REACT_APP_API_URL}/uploads/${item.user.avatar}`} alt="User avatar" width={35}/>
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
            </div>
          </div>
          <div>
            <h2 className='text'>Liked</h2>
            <div className='mb-5'>
            {liked.data ? (
                <div>
                  {liked.data.data.map((item: VoteType, index:number)=>(
                    <div className="quoteBorder myQuotes mb-5"  key={index} style={{width:400}}>
                      <div className='m-4'>
                        <img className='voting' src="/upvoted.png" alt="Upvoted" />
                        <div style={{fontSize:18, fontFamily:'raleway'}}>{item.quote.karma}</div>
                        <img className='voting' src="/downvote.png" alt="Downvote" />
                      </div>
                      <div>
                        <div style={{fontSize:18, fontFamily:'raleway'}}>{item.quote.quote}</div>
                        <div className='authorGrid'>
                          <img className='voting userAvatar' src={`${process.env.REACT_APP_API_URL}/uploads/${item.quote.user.avatar}`} alt="User avatar" width={35} 
                            onPointerMove={e=>{setOtherUserId(item.quote.user.id)}} onClick={handleProceedUser}/>
                          <div style={{fontSize:15, fontFamily:'raleway'}}>{item.quote.user.first_name + ' ' + item.quote.user.last_name}</div>
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
            </div>
          </div>
        </div>
        <div className='text-center'>
          <Button className="btnLogin">Load more</Button>
        </div>
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

export default UserQuotesInfo