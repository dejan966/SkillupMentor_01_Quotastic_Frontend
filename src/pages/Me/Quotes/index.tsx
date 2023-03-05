import Layout from '../../../components/ui/Layout'
import { FC, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import * as API from '../../../api/Api'
import { Button } from 'react-bootstrap'
import { UserType } from '../../../models/auth'
import { QuoteType } from '../../../models/quote'
import { VoteType } from '../../../models/vote'
import authStore from '../../../stores/auth.store'

const UserQuotesInfo: FC = () => {
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

  return (
    <Layout>
      <div>
        <div className='quoteRow mb-5'>
          <div>
            <h2 className='red'>Most liked quotes</h2>
            <div className='mb-5'>
              {mostLiked.data ? (
                <div className="quoteBorder quoteGrid mb-5" style={{width:400}}>
                  {mostLiked.data.data.map((item:QuoteType, index:number)=>{
                    <>
                    <div key={index} className='m-4'>
                      <img className='voting' src="/upvote.png" alt="Upvote" />
                      <div style={{fontSize:18, fontFamily:'raleway'}}>{item.karma}</div>
                      <img className='voting' src="/downvote.png" alt="Downvote" />
                    </div>
                    <div>
                      <div style={{fontSize:18, fontFamily:'raleway'}}>{item.quote}</div>
                      <div className='authorGrid'>
                        <img className='voting' src={`${process.env.REACT_APP_API_URL}/uploads/${item.user.avatar}`} alt="User avatar" width={35}/>
                        <div style={{fontSize:15, fontFamily:'raleway'}}>{item.user.first_name + ' ' + item.user.last_name}</div>
                      </div>
                    </div>
                    </>
                  })}
                </div>
              ):(
                <h2>No quotes available</h2>
              )}
            </div>
          </div>
          <div>
            <h2 className='text'>Most recent</h2>
            <div className='mb-5'>
              {mostRecent.data ? (
                <div>
                  {mostRecent.data.data.map((item: QuoteType, index:number)=>(
                    <div className="quoteBorder quoteGrid mb-5"  key={index} style={{width:400}}>
                      <div className='m-4'>
                        <img className='voting' src="/upvote.png" alt="Upvote" />
                        <div style={{fontSize:18, fontFamily:'raleway'}}>{item.karma}</div>
                        <img className='voting' src="/downvote.png" alt="Downvote" />
                      </div>
                      <div>
                        <div style={{fontSize:18, fontFamily:'raleway'}}>{item.quote}</div>
                        <div className='authorGrid'>
                          <img className='voting' src={`${process.env.REACT_APP_API_URL}/uploads/${item.user.avatar}`} alt="User avatar" width={35}/>
                          <div style={{fontSize:15, fontFamily:'raleway'}}>{item.user.first_name + ' ' + item.user.last_name}</div>
                        </div>
                      </div> 
                    </div>
                  ))}
                </div>
              ):(
                <h2>No quotes available</h2>
              )}
            </div>
          </div>
          <div>
            <h2 className='text'>Liked</h2>
            <div className='mb-5'>
              {liked.data ? (
                <div>
                  {liked.data.data.map((item: VoteType, index:number)=>(
                    <div className="quoteBorder quoteGrid mb-5"  key={index} style={{width:400}}>
                      <div className='m-4'>
                        <img className='voting' src="/upvoted.png" alt="Upvoted" />
                        <div style={{fontSize:18, fontFamily:'raleway'}}>{item.quote.karma}</div>
                        <img className='voting' src="/downvote.png" alt="Downvote" />
                      </div>
                      <div>
                        <div style={{fontSize:18, fontFamily:'raleway'}}>{item.quote.quote}</div>
                        <div className='authorGrid'>
                          <img className='voting' src={`${process.env.REACT_APP_API_URL}/uploads/${item.quote.user.avatar}`} alt="User avatar" width={35}/>
                          <div style={{fontSize:15, fontFamily:'raleway'}}>{item.quote.user.first_name + ' ' + item.quote.user.last_name}</div>
                        </div>
                      </div> 
                    </div>
                  ))} 
                </div>
              ):(
                <h2>No quotes available</h2>
              )}
            </div>
          </div>
        </div>
        <div className='text-center'>
          <Button className="btnLogin">Load more</Button>
        </div>
      </div>
    </Layout>
  )
}

export default UserQuotesInfo