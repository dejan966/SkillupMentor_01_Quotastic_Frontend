import Layout from '../../components/ui/Layout'
import { useState } from 'react'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { useQuery, useMutation } from 'react-query'
import useMediaQuery from '../../hooks/useMediaQuery'
import * as API from '../../api/Api'
import { routes } from '../../constants/routesConstants'
import { StatusCode } from '../../constants/errorConstants'
import { UserType } from '../../models/auth'
import authStore from '../../stores/auth.store'

const Users: FC = () => {
  const { data, isLoading, error } = useQuery(
    ['user'],
    () => API.fetchUser(authStore.user?.id as number),
  )

  return (
    <Layout>
      <div>
        <h2 className="text-center display-6">{/*Avatar, First name, last name*/}</h2>
      </div>
      <div className='quoteRow mb-5' style={{width:420}}>
          <div className='text-center mx-auto' style={{width:420}}>
            <h2 className='red'>Most liked quotes</h2>
            <div className='mb-5'>
              <div>Bla</div>
            </div>
            <div className='text-center mx-auto' style={{width:420}}>
              <h2 className='test'>Most recent</h2>
              <div className='mb-5'>
                <div>Bla</div>
              </div>
            </div>
            <div className='text-center mx-auto' style={{width:420}}>
              <h2 className='test'>Liked</h2>
              <div className='mb-5'>
                <div>Bla</div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className='mb-5 parentGrid'>
          <div className='text-center mx-auto' style={{width:420}}>
            <h2 className='red'>Most liked quotes</h2>
          </div>
          <div className='mb-5 parentDiv quoteRow'>
          {data.data.map((item:UserType, index:number) => (
            authStore.user?.id == item.votes.user?.id ?
            (
              item.votes.value == true ? (
                <div key={index} className="quoteBorder quoteGrid mb-5" style={{width:400}}>
                  <div className='m-4'>
                    <img className='voting' src="upvoted.png" alt="Upvote" />
                    <div style={{fontSize:18, fontFamily:'raleway'}}>{item.karma}</div>
                    <img className='voting' src="downvote.png" alt="Downvote" />
                  </div>
                <div>
                <div style={{fontSize:18, fontFamily:'raleway'}}>{item.quote}</div>
                  <div className='authorGrid'>
                    <img className='voting' src={item.user.avatar} alt="User avatar" width={35}/>
                    <div style={{fontSize:15, fontFamily:'raleway'}}>{item.user.first_name + ' ' + item.user.last_name}</div>
                  </div>
                </div>
                </div>
              ):(
                <div key={index} className="quoteBorder quoteGrid mb-5" style={{width:400}}>
                  <div className='m-4'>
                    <img className='voting' src="upvote.png" alt="Upvote" />
                    <div style={{fontSize:18, fontFamily:'raleway'}}>{item.karma}</div>
                    <img className='voting' src="downvoted.png" alt="Downvote" />
                  </div>
                <div>
                <div style={{fontSize:18, fontFamily:'raleway'}}>{item.quote}</div>
                  <div className='authorGrid'>
                    <img className='voting' src={item.user.avatar} alt="User avatar" width={35}/>
                    <div style={{fontSize:15, fontFamily:'raleway'}}>{item.user.first_name + ' ' + item.user.last_name}</div>
                  </div>
                  </div>
                </div>
              )
            )
            : (
              <div key={index} className="quoteBorder quoteGrid mb-5" style={{width:400}}>
              <div className='m-4'>
                <img className='voting' src="upvote.png" alt="Upvote" />
                <div style={{fontSize:18, fontFamily:'raleway'}}>{item.karma}</div>
                <img className='voting' src="downvote.png" alt="Downvote" />
              </div>
              <div>
                <div style={{fontSize:18, fontFamily:'raleway'}}>{item.quote}</div>
                <div className='authorGrid'>
                  <img className='voting' src={item.user.avatar} alt="User avatar" width={35}/>
                  <div style={{fontSize:15, fontFamily:'raleway'}}>{item.user.first_name + ' ' + item.user.last_name}</div>
                </div>
              </div>
            </div>
            )
          ))}
          </div>
          <div className='mb-5 text-center mx-auto'>
            <Button className='btnLogin'>Load more</Button>
          </div>
        </div>
        <div className='mb-5'>
          <div className='text-center mx-auto' style={{width:420}}>
            <h2 className='text'>Most recent quotes</h2>
          </div>
          <div className='mb-5 parentDiv quoteRow'>
          {data.data.map((item:UserType, index:number) => (
            authStore.user?.id == item.votes.user?.id ?
            (
              item.votes.value == true ? (
                <div key={index} className="quoteBorder quoteGrid mb-5" style={{width:400}}>
                  <div className='m-4'>
                    <img className='voting' src="upvoted.png" alt="Upvote" />
                    <div style={{fontSize:18, fontFamily:'raleway'}}>{item.karma}</div>
                    <img className='voting' src="downvote.png" alt="Downvote" />
                  </div>
                <div>
                <div style={{fontSize:18, fontFamily:'raleway'}}>{item.quote}</div>
                  <div className='authorGrid'>
                    <img className='voting' src={item.user.avatar} alt="User avatar" width={35}/>
                    <div style={{fontSize:15, fontFamily:'raleway'}}>{item.user.first_name + ' ' + item.user.last_name}</div>
                  </div>
                </div>
                </div>
              ):(
                <div key={index} className="quoteBorder quoteGrid mb-5" style={{width:400}}>
                  <div className='m-4'>
                    <img className='voting' src="upvote.png" alt="Upvote" />
                    <div style={{fontSize:18, fontFamily:'raleway'}}>{item.karma}</div>
                    <img className='voting' src="downvoted.png" alt="Downvote" />
                  </div>
                <div>
                <div style={{fontSize:18, fontFamily:'raleway'}}>{item.quote}</div>
                  <div className='authorGrid'>
                    <img className='voting' src={item.user.avatar} alt="User avatar" width={35}/>
                    <div style={{fontSize:15, fontFamily:'raleway'}}>{item.user.first_name + ' ' + item.user.last_name}</div>
                  </div>
                  </div>
                </div>
              )
            )
            : (
              <div key={index} className="quoteBorder quoteGrid mb-5" style={{width:400}}>
              <div className='m-4'>
                <img className='voting' src="upvote.png" alt="Upvote" />
                <div style={{fontSize:18, fontFamily:'raleway'}}>{item.karma}</div>
                <img className='voting' src="downvote.png" alt="Downvote" />
              </div>
              <div>
                <div style={{fontSize:18, fontFamily:'raleway'}}>{item.quote}</div>
                <div className='authorGrid'>
                  <img className='voting' src={item.user.avatar} alt="User avatar" width={35}/>
                  <div style={{fontSize:15, fontFamily:'raleway'}}>{item.user.first_name + ' ' + item.user.last_name}</div>
                </div>
              </div>
            </div>
            )
          ))}
          </div>
          <div className='mb-5 text-center mx-auto'>
            <Button className='btnLogin'>Load more</Button>
          </div>
        </div>
        <div className='mb-5'>
          <div className='text-center mx-auto' style={{width:420}}>
            <h2 className='text'>Liked</h2>
          </div>
          <div className='mb-5 parentDiv quoteRow'>
          {data.data.map((item:UserType, index:number) => (
            authStore.user?.id == item.votes.user?.id ? 
            (
              item.votes.value == true ? (
                <div key={index} className="quoteBorder quoteGrid mb-5" style={{width:400}}>
                  <div className='m-4'>
                    <img className='voting' src="upvoted.png" alt="Upvote" />
                    <div style={{fontSize:18, fontFamily:'raleway'}}>{item.karma}</div>
                    <img className='voting' src="downvote.png" alt="Downvote" />
                  </div>
                <div>
                <div style={{fontSize:18, fontFamily:'raleway'}}>{item.quote}</div>
                  <div className='authorGrid'>
                    <img className='voting' src={item.user.avatar} alt="User avatar" width={35}/>
                    <div style={{fontSize:15, fontFamily:'raleway'}}>{item.user.first_name + ' ' + item.user.last_name}</div>
                  </div>
                </div>
                </div>
              ):(
                <div key={index} className="quoteBorder quoteGrid mb-5" style={{width:400}}>
                  <div className='m-4'>
                    <img className='voting' src="upvote.png" alt="Upvote" />
                    <div style={{fontSize:18, fontFamily:'raleway'}}>{item.karma}</div>
                    <img className='voting' src="downvoted.png" alt="Downvote" />
                  </div>
                <div>
                <div style={{fontSize:18, fontFamily:'raleway'}}>{item.quote}</div>
                  <div className='authorGrid'>
                    <img className='voting' src={item.user.avatar} alt="User avatar" width={35}/>
                    <div style={{fontSize:15, fontFamily:'raleway'}}>{item.user.first_name + ' ' + item.user.last_name}</div>
                  </div>
                  </div>
                </div>
              )
            )
            : (
              <div key={index} className="quoteBorder quoteGrid mb-5" style={{width:400}}>
              <div className='m-4'>
                <img className='voting' src="upvote.png" alt="Upvote" />
                <div style={{fontSize:18, fontFamily:'raleway'}}>{item.karma}</div>
                <img className='voting' src="downvote.png" alt="Downvote" />
              </div>
              <div>
                <div style={{fontSize:18, fontFamily:'raleway'}}>{item.quote}</div>
                <div className='authorGrid'>
                  <img className='voting' src={item.user.avatar} alt="User avatar" width={35}/>
                  <div style={{fontSize:15, fontFamily:'raleway'}}>{item.user.first_name + ' ' + item.user.last_name}</div>
                </div>
              </div>
            </div>
            )
          ))}
          </div>
          <div className='mb-5 text-center mx-auto'>
            <Button className='btnLogin'>Load more</Button>
          </div>
        </div>
      */}
    </Layout>
  )
}

export default Users