import Layout from '../../../components/ui/Layout'
import { FC, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import * as API from '../../../api/Api'
import { Button } from 'react-bootstrap'
import { UserType } from '../../../models/auth'
import { QuoteType } from '../../../models/quote'
import { VoteType } from '../../../models/vote'

const UserQuotesInfo: FC = () => {
  const [mostLiked, setMostLiked] = useState([])
  const [mostRecent, setMostRecent] = useState([])
  const [likes, setLikes] = useState([])

  return (
    <Layout>
      <div>
        <div className='quoteRow mb-5'>
          <div>
            <h2 className='red'>Most liked quotes</h2>
            <div className='mb-5'>
              {mostLiked ? (
                <div>
                  {mostLiked.map((item: QuoteType, index:number)=>(
                    <div className="quoteBorder quoteGrid mb-5"  key={index} style={{width:400}}>
                      <div className='m-4'>
                        <img className='voting' src="/upvote.png" alt="Upvote" />
                        <div style={{fontSize:18, fontFamily:'raleway'}}>{item.karma}</div>
                        <img className='voting' src="/downvote.png" alt="Downvote" />
                      </div>
                      <div>
                        <div style={{fontSize:18, fontFamily:'raleway'}}>{item.quote}</div>
                        <div className='authorGrid'>
                          <img className='voting' src={item.user.avatar} alt="User avatar" width={35}/>
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
            <h2 className='text'>Most recent</h2>
            <div className='mb-5'>
              {mostRecent ? (
                <div>
                  {mostRecent.map((item: QuoteType, index:number)=>(
                    <div className="quoteBorder quoteGrid mb-5"  key={index} style={{width:400}}>
                      <div className='m-4'>
                        <img className='voting' src="/upvote.png" alt="Upvote" />
                        <div style={{fontSize:18, fontFamily:'raleway'}}>{item.karma}</div>
                        <img className='voting' src="/downvote.png" alt="Downvote" />
                      </div>
                      <div>
                        <div style={{fontSize:18, fontFamily:'raleway'}}>{item.quote}</div>
                        <div className='authorGrid'>
                          <img className='voting' src={item.user.avatar} alt="User avatar" width={35}/>
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
              {likes ? (
                <div>
                  {likes.map((item: VoteType, index:number)=>(
                    <div className="quoteBorder quoteGrid mb-5"  key={index} style={{width:400}}>
                      <div className='m-4'>
                        <img className='voting' src="/upvoted.png" alt="Upvoted" />
                        <div style={{fontSize:18, fontFamily:'raleway'}}>{item.quote.karma}</div>
                        <img className='voting' src="downvote.png" alt="Downvote" />
                      </div>
                      <div>
                        <div style={{fontSize:18, fontFamily:'raleway'}}>{item.quote.quote}</div>
                        <div className='authorGrid'>
                          <img className='voting' src={item.quote.user.avatar} alt="User avatar" width={35}/>
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